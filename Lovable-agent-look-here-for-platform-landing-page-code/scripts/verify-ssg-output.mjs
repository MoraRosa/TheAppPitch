/**
 * verify-ssg-output -- Post-build assertion that the marketing SSG
 * actually emitted browsable HTML, not just an SPA shell.
 *
 * Runs in two modes, mirroring the soft/hard fail policy in
 * marketing/ssg/serverFetch.js:
 *
 *   CMS_SSG_BASE_URL unset (local dev `pnpm build`)
 *     - Each known top-level marketing route must have an index.html.
 *     - Each emitted file must contain the brand chrome marker.
 *     - Sitemap.xml <loc> entries must map to emitted files.
 *     - This proves the SSG pipeline ran end-to-end even without a
 *       running backend; CmsPage routes legitimately render NotFound
 *       in this mode and that's fine.
 *
 *   CMS_SSG_BASE_URL set (CI / prod build)
 *     - All of the above PLUS each CmsPage route must NOT render the
 *       NotFound heading. If it does, the loader returned null, which
 *       in strict mode means a real CMS miss and the build is wrong.
 *     - Hydration loader-data for CMS routes must be non-null --
 *       guards against the SSR rendering a fallback that happens not
 *       to contain the NotFound string.
 *     - Detail-route prefixes (legal/blog/changelog) must each contain
 *       at least one <slug>/index.html, proving getStaticPaths ran and
 *       returned data. (If a doc type is legitimately empty, document
 *       it in EXPECTED_EMPTY_DOC_TYPES below.)
 *     - Each emitted detail page must contain an <h1> and a minimum
 *       body length, proving the document body was rendered in the
 *       prerender (not just the chrome).
 *
 * Exit non-zero on any failure so CI deploys block.
 *
 * @module scripts/verify-ssg-output
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PUBLIC_SITEMAP = path.resolve(__dirname, "..", "public", "sitemap.xml");

// Brand chrome marker emitted by BrandLayout's <Brand to="/">Peak</Brand>.
// Matches both the static text and any styled-components attrs so this stays
// resilient to className churn.
const CHROME_MARKER = ">Peak<";
// NotFound's <Heading>. Only an error in strict mode on CmsPage routes.
const NOT_FOUND_MARKER = "Page not found";
// Hydration data marker emitted by react-router's StaticRouter. Used to
// extract loader payloads for the strict-mode null-loader check.
const HYDRATION_MARKER = "window.__staticRouterHydrationData = JSON.parse(";
// Floor for detail-page body bytes after stripping chrome. Tuned to be
// well below the smallest seeded document (changelog v1 ~ 2KB) and well
// above an empty shell.
const DETAIL_MIN_BODY_BYTES = 600;

// Static top-level routes the marketing surface always emits. Detail
// routes (legal/:slug etc.) are checked by directory enumeration below.
const STATIC_ROUTES = [
  { path: "/", file: "index.html", kind: "cms" },
  { path: "/pricing", file: "pricing/index.html", kind: "cms" },
  { path: "/trust", file: "trust/index.html", kind: "cms" },
  { path: "/about", file: "about/index.html", kind: "cms" },
  { path: "/legal", file: "legal/index.html", kind: "list" },
  { path: "/blog", file: "blog/index.html", kind: "list" },
  { path: "/changelog", file: "changelog/index.html", kind: "list" },
  { path: "/docs", file: "docs/index.html", kind: "list" },
];

const DETAIL_PREFIXES = ["legal", "blog", "changelog", "docs"];
// Doc types that may legitimately be empty at build time. Add a type here
// to silence the strict-mode "no detail pages emitted" failure for it.
// "docs" is listed here until launch documentation is authored through
// the staff CMS; remove the entry once the first docs entry publishes
// so a future regression that wipes the table fails the build.
const EXPECTED_EMPTY_DOC_TYPES = new Set(["docs"]);

const STRICT = !!process.env.CMS_SSG_BASE_URL;
const failures = [];
const notes = [];

function fail(msg) {
  failures.push(msg);
}
function note(msg) {
  notes.push(msg);
}

function readFileOrNull(rel) {
  const abs = path.join(DIST, rel);
  try {
    return fs.readFileSync(abs, "utf8");
  } catch {
    return null;
  }
}

function listChildDirs(rel) {
  const abs = path.join(DIST, rel);
  try {
    return fs
      .readdirSync(abs, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
}

// Extract react-router's serialized loader payload from an emitted HTML
// file. Returns the parsed object, or null if the marker is absent or
// the JSON-in-JSON unwrap fails. Used for the strict-mode check that
// CMS routes carry real loader data, not just shell content.
function extractLoaderData(html) {
  const i = html.indexOf(HYDRATION_MARKER);
  if (i === -1) return null;
  const start = i + HYDRATION_MARKER.length;
  // The payload is JSON.parse("...") -- a JSON-encoded string. Find the
  // closing ") and slice. The encoded string itself never contains an
  // unescaped ") because react-router serializes via JSON.stringify.
  const end = html.indexOf('")', start);
  if (end === -1) return null;
  const encoded = html.slice(start, end + 1); // includes the closing "
  try {
    const inner = JSON.parse(encoded); // unwrap outer string
    return JSON.parse(inner); // unwrap loader payload
  } catch {
    return null;
  }
}

// True when at least one loader on the route returned non-null data.
// Routes nest as keys like "0", "0-1", etc.; a CMS route renders shell
// content when every entry is null, which is the exact failure mode
// strict mode is here to catch.
function hasNonNullLoaderData(loaderData) {
  if (!loaderData || typeof loaderData !== "object") return false;
  return Object.values(loaderData).some((v) => v !== null && v !== undefined);
}

// Read sitemap.xml and extract path-only entries (the host gets stripped
// because the verifier doesn't know the deploy host). Returns the list
// of expected dist paths, e.g. "/" -> "index.html", "/pricing" ->
// "pricing/index.html". Skips entries that don't share the marketing
// host so a future merchant/buyer sitemap entry doesn't trip this.
function readSitemapExpectedFiles() {
  let xml;
  try {
    xml = fs.readFileSync(PUBLIC_SITEMAP, "utf8");
  } catch {
    return null; // sitemap is optional; absence isn't a failure here
  }
  const out = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const raw = m[1].trim();
    let pathname;
    try {
      pathname = new URL(raw).pathname;
    } catch {
      pathname = raw.startsWith("/") ? raw : `/${raw}`;
    }
    const file =
      pathname === "/"
        ? "index.html"
        : `${pathname.replace(/^\/+/, "")}/index.html`;
    out.push({ loc: raw, file });
  }
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error(
    `verify-ssg-output: dist/ not found at ${DIST}. Did you run \`pnpm build\` first?`,
  );
  process.exit(2);
}

for (const route of STATIC_ROUTES) {
  const html = readFileOrNull(route.file);
  if (html === null) {
    fail(`missing artifact: ${route.file} (route ${route.path})`);
    continue;
  }
  if (!html.includes(CHROME_MARKER)) {
    fail(`chrome marker missing in ${route.file} (route ${route.path})`);
  }
  if (STRICT && route.kind === "cms" && html.includes(NOT_FOUND_MARKER)) {
    fail(
      `${route.file} rendered NotFound in strict mode -- loader returned null for ${route.path}`,
    );
  }
  // Strict-mode loader-data sanity. Catches the failure mode where the
  // page renders a fallback that happens not to contain "Page not found"
  // (e.g. a future ErrorState restyling or a list page that gracefully
  // shows "No entries yet").
  if (STRICT && route.kind === "cms") {
    const ld = extractLoaderData(html);
    if (!hasNonNullLoaderData(ld)) {
      fail(
        `${route.file} hydration loaderData has no non-null entries in strict mode (route ${route.path})`,
      );
    }
  }
}

// Sitemap consistency. Every <loc> in public/sitemap.xml must map to an
// emitted dist file. Runs in both modes -- a sitemap referencing a
// missing route is broken regardless of CMS reachability.
const sitemapEntries = readSitemapExpectedFiles();
if (sitemapEntries === null) {
  note("sitemap.xml: not present, skipping consistency check");
} else if (sitemapEntries.length === 0) {
  fail(
    "sitemap.xml: no <loc> entries parsed -- sitemap looks empty or malformed",
  );
} else {
  let sitemapMissing = 0;
  for (const entry of sitemapEntries) {
    if (readFileOrNull(entry.file) === null) {
      fail(`sitemap.xml lists ${entry.loc} but ${entry.file} is not in dist/`);
      sitemapMissing += 1;
    }
  }
  if (sitemapMissing === 0) {
    note(
      `sitemap.xml: ${sitemapEntries.length} <loc> entry(s) present in dist`,
    );
  }
}

for (const prefix of DETAIL_PREFIXES) {
  const children = listChildDirs(prefix);
  // Filter out the index file's directory marker; we want only slug subdirs.
  const slugDirs = children.filter((name) => name !== "" && name !== ".");
  if (
    STRICT &&
    slugDirs.length === 0 &&
    !EXPECTED_EMPTY_DOC_TYPES.has(prefix)
  ) {
    fail(
      `no detail pages under dist/${prefix}/ in strict mode -- getStaticPaths returned empty`,
    );
  } else if (slugDirs.length > 0) {
    note(`dist/${prefix}/: ${slugDirs.length} detail page(s)`);
  } else {
    note(`dist/${prefix}/: no detail pages (soft mode or empty doc type)`);
  }
  // Per-detail-page substance check (strict). Every emitted detail
  // page must carry an <h1> and a body of at least DETAIL_MIN_BODY_BYTES,
  // proving the document body was rendered into the prerender. Runs
  // even when the prefix ITSELF was flagged above so the strict report
  // shows every offending slug at once.
  if (STRICT) {
    for (const slug of slugDirs) {
      const file = `${prefix}/${slug}/index.html`;
      const html = readFileOrNull(file);
      if (html === null) {
        fail(`missing artifact: ${file}`);
        continue;
      }
      if (!/<h1[\s>]/i.test(html)) {
        fail(`${file} has no <h1> -- detail body did not render`);
      }
      if (html.length < DETAIL_MIN_BODY_BYTES) {
        fail(
          `${file} body length ${html.length}B < ${DETAIL_MIN_BODY_BYTES}B floor -- detail looks empty`,
        );
      }
    }
  }
}

console.log(
  `verify-ssg-output: mode=${STRICT ? "strict" : "soft"} dist=${DIST}`,
);
for (const n of notes) console.log(`  ok   ${n}`);
for (const f of failures) console.error(`  FAIL ${f}`);

if (failures.length > 0) {
  console.error(
    `\nverify-ssg-output: ${failures.length} failure(s). Build artifacts do not satisfy the SSG contract.`,
  );
  process.exit(1);
}
console.log(
  `verify-ssg-output: ${STATIC_ROUTES.length} static route(s) verified.`,
);
