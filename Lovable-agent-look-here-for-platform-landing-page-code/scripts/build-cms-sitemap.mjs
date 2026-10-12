/**
 * build-cms-sitemap -- Post-SSG sitemap.xml + llms.txt generator.
 *
 * Two-mode policy, mirroring marketing/ssg/serverFetch.js and
 * scripts/verify-ssg-output.mjs:
 *
 *   CMS_SSG_BASE_URL unset (local dev `pnpm build`)
 *     - Skip. The static dist/sitemap.xml + dist/llms.txt copied
 *       from public/ stay as the soft fallback. No detail-page
 *       enumeration is possible without a reachable CMS.
 *
 *   CMS_SSG_BASE_URL set (CI / prod build)
 *     - Fetch each public document index (legal, blog, changelog,
 *       docs), normalise the rows, then:
 *         * Overwrite dist/sitemap.xml with a generated file that
 *           includes every static route AND every detail page.
 *         * Append a per-section detail listing to dist/llms.txt
 *           (the static template stays, the appendix is added).
 *     - Any fetch / write error throws and exits non-zero so CI
 *       fails before verify-ssg-output runs.
 *
 * Host URL: SITE_BASE_URL env override, defaults to https://theapp.com
 * (matches the literal in public/sitemap.xml).
 *
 * Locale: en only (the marketing surface is en-only today; this
 * follows the same convention as routes.jsx).
 *
 * @module scripts/build-cms-sitemap
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  STATIC_ROUTE_DEFAULTS,
  normalizeDocumentEntry,
  buildSitemapXml,
  buildLlmsTxtAppendix,
} from "../src/marketing/seo/sitemapBuilders.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PUBLIC_LLMS = path.resolve(__dirname, "..", "public", "llms.txt");
const DIST_SITEMAP = path.join(DIST, "sitemap.xml");
const DIST_LLMS = path.join(DIST, "llms.txt");

const DOC_TYPES = ["legal", "blog", "changelog", "docs"];
const LOCALE = "en";
const PER_TYPE_LIMIT = 100;
const SITE_BASE_URL = process.env.SITE_BASE_URL || "https://theapp.com";
const CMS_BASE = (process.env.CMS_SSG_BASE_URL || "").replace(/\/+$/, "");

function log(msg) {
  console.log(`build-cms-sitemap: ${msg}`);
}
function logError(msg) {
  console.error(`build-cms-sitemap: ${msg}`);
}

if (!CMS_BASE) {
  log(
    "CMS_SSG_BASE_URL unset -- skipping. Static dist/sitemap.xml and " +
      "dist/llms.txt from public/ will ship as the soft-mode fallback.",
  );
  process.exit(0);
}

if (!fs.existsSync(DIST)) {
  logError(`dist/ not found at ${DIST}. Did vite-react-ssg build run?`);
  process.exit(2);
}

async function fetchDocList(docType) {
  const url = `${CMS_BASE}/api/v1/cms/documents?type=${encodeURIComponent(
    docType,
  )}&locale=${encodeURIComponent(LOCALE)}&limit=${PER_TYPE_LIMIT}&offset=0`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(
      `[${docType}] CMS list responded ${res.status} for ${url}`,
    );
  }
  const body = await res.json().catch(() => null);
  const docs = body?.data?.documents;
  if (!Array.isArray(docs)) {
    throw new Error(
      `[${docType}] CMS list payload missing data.documents (url=${url})`,
    );
  }
  return docs;
}

async function main() {
  log(`mode=strict CMS_SSG_BASE_URL=${CMS_BASE} SITE_BASE_URL=${SITE_BASE_URL}`);

  // Fetch all four types in parallel. Throw on the first failure --
  // the CI build needs a complete, accurate sitemap or it shouldn't
  // ship anything new.
  const sections = {};
  const detailEntries = [];
  const lists = await Promise.all(DOC_TYPES.map((t) => fetchDocList(t)));
  DOC_TYPES.forEach((docType, i) => {
    const docs = lists[i];
    const normalised = docs
      .map((d) => normalizeDocumentEntry({ docType, doc: d }))
      .filter(Boolean);
    sections[docType] = normalised;
    for (const e of normalised) detailEntries.push(e);
    log(`  ${docType}: ${normalised.length} document(s)`);
  });

  // Sitemap: overwrite dist/sitemap.xml end-to-end.
  const xml = buildSitemapXml({
    siteBaseUrl: SITE_BASE_URL,
    staticRoutes: STATIC_ROUTE_DEFAULTS,
    detailEntries,
  });
  fs.writeFileSync(DIST_SITEMAP, xml, "utf8");
  log(
    `wrote ${DIST_SITEMAP} (${STATIC_ROUTE_DEFAULTS.length} static + ` +
      `${detailEntries.length} detail entries)`,
  );

  // llms.txt: read source template, append per-section appendix, write
  // to dist. Source stays the prose-rich template; only dist gets the
  // generated detail block bolted on the end.
  let template;
  try {
    template = fs.readFileSync(PUBLIC_LLMS, "utf8");
  } catch (err) {
    throw new Error(
      `failed to read llms.txt template at ${PUBLIC_LLMS}: ${err.message}`,
    );
  }
  const appendix = buildLlmsTxtAppendix({
    siteBaseUrl: SITE_BASE_URL,
    sections,
  });
  // Normalise: ensure exactly one trailing newline on the template
  // before concatenation so we don't get either a missing or doubled
  // blank line at the seam.
  const trimmed = template.replace(/\s*$/, "\n");
  fs.writeFileSync(DIST_LLMS, trimmed + appendix, "utf8");
  log(
    `wrote ${DIST_LLMS} (template + ${
      appendix ? "appendix" : "no appendix (no documents found)"
    })`,
  );
}

main().catch((err) => {
  logError(err.message || String(err));
  process.exit(1);
});
