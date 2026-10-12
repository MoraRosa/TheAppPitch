/**
 * Tests for the sitemap + llms.txt builders. Pure functions, no fs or
 * fetch -- the integration with the actual build pipeline is covered
 * separately by a manual `pnpm build` smoke against a CMS_SSG_BASE_URL.
 */

import { describe, it, expect } from "vitest";
import {
  STATIC_ROUTE_DEFAULTS,
  SECTION_DEFAULTS,
  SECTION_LABELS,
  formatLastmodDate,
  normalizeDocumentEntry,
  buildSitemapXml,
  buildLlmsTxtAppendix,
} from "./sitemapBuilders.js";

const BASE = "https://peakenterprise.ca";

describe("formatLastmodDate", () => {
  it("returns YYYY-MM-DD from an ISO timestamp", () => {
    expect(formatLastmodDate("2026-05-12T08:30:00.123Z")).toBe("2026-05-12");
  });

  it("returns null for empty / missing / unparseable input", () => {
    expect(formatLastmodDate(null)).toBeNull();
    expect(formatLastmodDate(undefined)).toBeNull();
    expect(formatLastmodDate("")).toBeNull();
    expect(formatLastmodDate("not-a-date")).toBeNull();
  });
});

describe("normalizeDocumentEntry", () => {
  it("returns null when slug is missing or non-string", () => {
    expect(normalizeDocumentEntry({ docType: "blog", doc: {} })).toBeNull();
    expect(
      normalizeDocumentEntry({ docType: "blog", doc: { slug: "" } }),
    ).toBeNull();
    expect(
      normalizeDocumentEntry({ docType: "blog", doc: { slug: 42 } }),
    ).toBeNull();
  });

  it("prefers canonical_path when present", () => {
    const out = normalizeDocumentEntry({
      docType: "blog",
      doc: {
        slug: "foo",
        canonical_path: "/announcements/foo",
        title: "Foo",
        effective_at: "2026-04-01T00:00:00Z",
      },
    });
    expect(out).toMatchObject({
      docType: "blog",
      slug: "foo",
      path: "/announcements/foo",
      title: "Foo",
      lastmod: "2026-04-01",
    });
  });

  it("falls back to /<docType>/<slug> when canonical_path is missing", () => {
    const out = normalizeDocumentEntry({
      docType: "docs",
      doc: { slug: "getting-started", title: "Getting started" },
    });
    expect(out.path).toBe("/docs/getting-started");
  });

  it("derives lastmod from effective_at, then published_at, then created_at", () => {
    expect(
      normalizeDocumentEntry({
        docType: "blog",
        doc: {
          slug: "a",
          effective_at: "2026-05-10T00:00:00Z",
          published_at: "2025-01-01T00:00:00Z",
        },
      }).lastmod,
    ).toBe("2026-05-10");
    expect(
      normalizeDocumentEntry({
        docType: "blog",
        doc: { slug: "b", published_at: "2026-03-01T00:00:00Z" },
      }).lastmod,
    ).toBe("2026-03-01");
    expect(
      normalizeDocumentEntry({
        docType: "blog",
        doc: { slug: "c", created_at: "2026-02-01T00:00:00Z" },
      }).lastmod,
    ).toBe("2026-02-01");
    expect(
      normalizeDocumentEntry({ docType: "blog", doc: { slug: "d" } }).lastmod,
    ).toBeNull();
  });
});

describe("buildSitemapXml", () => {
  it("emits every static route as an absolute URL with the configured base", () => {
    const xml = buildSitemapXml({ siteBaseUrl: BASE });
    for (const r of STATIC_ROUTE_DEFAULTS) {
      const loc = r.path === "/" ? `${BASE}/` : `${BASE}${r.path}`;
      expect(xml).toContain(`<loc>${loc}</loc>`);
    }
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain("<urlset");
    expect(xml.trim().endsWith("</urlset>")).toBe(true);
  });

  it("emits detail entries with per-section defaults and lastmod when present", () => {
    const xml = buildSitemapXml({
      siteBaseUrl: BASE,
      staticRoutes: [],
      detailEntries: [
        {
          docType: "blog",
          slug: "x",
          path: "/blog/x",
          title: "X",
          lastmod: "2026-05-01",
        },
        { docType: "docs", slug: "y", path: "/docs/y", title: "Y" },
      ],
    });
    expect(xml).toContain(`<loc>${BASE}/blog/x</loc>`);
    expect(xml).toContain("<lastmod>2026-05-01</lastmod>");
    expect(xml).toContain(
      `<changefreq>${SECTION_DEFAULTS.blog.changefreq}</changefreq>`,
    );
    expect(xml).toContain(`<loc>${BASE}/docs/y</loc>`);
    expect(xml).toContain(
      `<changefreq>${SECTION_DEFAULTS.docs.changefreq}</changefreq>`,
    );
    // The docs entry has no lastmod, so no <lastmod> line should sit
    // between its <loc> and its <changefreq>.
    const docsBlock = xml.slice(xml.indexOf(`${BASE}/docs/y`));
    expect(docsBlock.startsWith(`${BASE}/docs/y</loc>`)).toBe(true);
    expect(docsBlock.slice(0, 200)).not.toContain("<lastmod>");
  });

  it("escapes XML-significant characters in <loc>", () => {
    const xml = buildSitemapXml({
      siteBaseUrl: BASE,
      staticRoutes: [],
      detailEntries: [
        { docType: "blog", slug: "q&a", path: "/blog/q&a", title: "Q&A" },
      ],
    });
    expect(xml).toContain(`<loc>${BASE}/blog/q&amp;a</loc>`);
  });
});

describe("buildLlmsTxtAppendix", () => {
  it("returns an empty string when no section has entries", () => {
    expect(buildLlmsTxtAppendix({ siteBaseUrl: BASE, sections: {} })).toBe("");
    expect(
      buildLlmsTxtAppendix({
        siteBaseUrl: BASE,
        sections: { blog: [], docs: [] },
      }),
    ).toBe("");
  });

  it("emits a section header + bullet list per non-empty doc_type", () => {
    const out = buildLlmsTxtAppendix({
      siteBaseUrl: BASE,
      sections: {
        blog: [
          { docType: "blog", slug: "a", path: "/blog/a", title: "Post A" },
        ],
        docs: [
          {
            docType: "docs",
            slug: "getting-started",
            path: "/docs/getting-started",
            title: "Getting started",
          },
        ],
      },
    });
    expect(out).toContain(`## ${SECTION_LABELS.blog}`);
    expect(out).toContain(`- ${BASE}/blog/a    Post A`);
    expect(out).toContain(`## ${SECTION_LABELS.docs}`);
    expect(out).toContain(`- ${BASE}/docs/getting-started    Getting started`);
  });

  it("orders sections by SECTION_LABELS key order, not input order", () => {
    const out = buildLlmsTxtAppendix({
      siteBaseUrl: BASE,
      sections: {
        docs: [{ docType: "docs", slug: "d", path: "/docs/d", title: "D" }],
        legal: [{ docType: "legal", slug: "l", path: "/legal/l", title: "L" }],
      },
    });
    const legalIdx = out.indexOf(SECTION_LABELS.legal);
    const docsIdx = out.indexOf(SECTION_LABELS.docs);
    expect(legalIdx).toBeGreaterThan(-1);
    expect(docsIdx).toBeGreaterThan(legalIdx);
  });

  it("falls back to slug when title is empty", () => {
    const out = buildLlmsTxtAppendix({
      siteBaseUrl: BASE,
      sections: {
        blog: [{ docType: "blog", slug: "no-title", path: "/blog/no-title" }],
      },
    });
    expect(out).toContain(`- ${BASE}/blog/no-title    no-title`);
  });
});
