/**
 * Tests for the JSON-LD builders. Pure functions -- no DOM, no fetch.
 * Component-level rendering (PageJsonLd <script> emission) is exercised
 * implicitly by the marketing app/a11y tests once the component is wired
 * into DocumentDetail, per Phase 4.3 decision 4A.
 */

import { describe, it, expect } from "vitest";
import { APP_METADATA } from "@theapp/config";
import {
  BREADCRUMB_SECTION_LABELS,
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
  buildDetailPageBreadcrumbs,
} from "./jsonLdBuilders.js";

const BASE = "https://peakenterprise.ca";

function makeDoc(overrides = {}) {
  return {
    slug: "hello-world",
    doc_type: "blog",
    locale: "en",
    title: "Hello, world",
    summary: "A short summary.",
    meta_description: null,
    canonical_path: "/blog/hello-world",
    body_html: "<p>hi</p>",
    effective_at: "2026-04-01T00:00:00.000Z",
    tags: ["release", "v1"],
    author_name: "Sam Editor",
    published_at: "2026-03-15T12:00:00.000Z",
    ...overrides,
  };
}

describe("buildArticleJsonLd", () => {
  it("returns null when doc is missing required fields", () => {
    expect(buildArticleJsonLd({ siteBaseUrl: BASE, doc: null })).toBeNull();
    expect(
      buildArticleJsonLd({ siteBaseUrl: BASE, doc: { doc_type: "blog" } }),
    ).toBeNull();
    expect(
      buildArticleJsonLd({ siteBaseUrl: BASE, doc: { title: "x" } }),
    ).toBeNull();
  });

  it("selects @type BlogPosting for blog documents", () => {
    const out = buildArticleJsonLd({ siteBaseUrl: BASE, doc: makeDoc() });
    expect(out["@type"]).toBe("BlogPosting");
    expect(out["@context"]).toBe("https://schema.org");
  });

  it("selects @type TechArticle for docs documents", () => {
    const out = buildArticleJsonLd({
      siteBaseUrl: BASE,
      doc: makeDoc({
        doc_type: "docs",
        canonical_path: "/docs/getting-started",
      }),
    });
    expect(out["@type"]).toBe("TechArticle");
  });

  it("selects @type Article for changelog and legal documents", () => {
    const changelog = buildArticleJsonLd({
      siteBaseUrl: BASE,
      doc: makeDoc({ doc_type: "changelog", canonical_path: "/changelog/x" }),
    });
    const legal = buildArticleJsonLd({
      siteBaseUrl: BASE,
      doc: makeDoc({ doc_type: "legal", canonical_path: "/legal/tos" }),
    });
    expect(changelog["@type"]).toBe("Article");
    expect(legal["@type"]).toBe("Article");
  });

  it("falls back to Article for an unknown doc_type", () => {
    const out = buildArticleJsonLd({
      siteBaseUrl: BASE,
      doc: makeDoc({ doc_type: "press_release" }),
    });
    expect(out["@type"]).toBe("Article");
  });

  it("prefers meta_description over summary for description", () => {
    const out = buildArticleJsonLd({
      siteBaseUrl: BASE,
      doc: makeDoc({ meta_description: "Meta wins", summary: "Summary loses" }),
    });
    expect(out.description).toBe("Meta wins");
  });

  it("falls back to summary when meta_description is empty", () => {
    const out = buildArticleJsonLd({
      siteBaseUrl: BASE,
      doc: makeDoc({ meta_description: null, summary: "Summary used" }),
    });
    expect(out.description).toBe("Summary used");
  });

  it("composes url + mainEntityOfPage from canonical_path", () => {
    const out = buildArticleJsonLd({ siteBaseUrl: BASE, doc: makeDoc() });
    expect(out.url).toBe(`${BASE}/blog/hello-world`);
    expect(out.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": `${BASE}/blog/hello-world`,
    });
  });

  it("falls back to /<doc_type>/<slug> when canonical_path is absent", () => {
    const out = buildArticleJsonLd({
      siteBaseUrl: BASE,
      doc: makeDoc({ canonical_path: null }),
    });
    expect(out.url).toBe(`${BASE}/blog/hello-world`);
  });

  it("emits ISO datePublished + dateModified, dateModified prefers effective_at", () => {
    const out = buildArticleJsonLd({ siteBaseUrl: BASE, doc: makeDoc() });
    expect(out.datePublished).toBe("2026-03-15T12:00:00.000Z");
    expect(out.dateModified).toBe("2026-04-01T00:00:00.000Z");
  });

  it("dateModified falls back to datePublished when effective_at is absent", () => {
    const out = buildArticleJsonLd({
      siteBaseUrl: BASE,
      doc: makeDoc({ effective_at: null }),
    });
    expect(out.dateModified).toBe("2026-03-15T12:00:00.000Z");
  });

  it("emits author as Person when author_name is set", () => {
    const out = buildArticleJsonLd({ siteBaseUrl: BASE, doc: makeDoc() });
    expect(out.author).toEqual({ "@type": "Person", name: "Sam Editor" });
  });

  it("omits author when author_name is empty", () => {
    const out = buildArticleJsonLd({
      siteBaseUrl: BASE,
      doc: makeDoc({ author_name: null }),
    });
    expect(out.author).toBeUndefined();
  });

  it("joins tags into a comma-separated keywords string", () => {
    const out = buildArticleJsonLd({ siteBaseUrl: BASE, doc: makeDoc() });
    expect(out.keywords).toBe("release, v1");
  });

  it("omits keywords when tags is empty", () => {
    const out = buildArticleJsonLd({
      siteBaseUrl: BASE,
      doc: makeDoc({ tags: [] }),
    });
    expect(out.keywords).toBeUndefined();
  });

  it("emits articleSection label per doc_type", () => {
    const out = buildArticleJsonLd({ siteBaseUrl: BASE, doc: makeDoc() });
    expect(out.articleSection).toBe(BREADCRUMB_SECTION_LABELS.blog);
  });

  it("emits inLanguage from doc.locale", () => {
    const out = buildArticleJsonLd({ siteBaseUrl: BASE, doc: makeDoc() });
    expect(out.inLanguage).toBe("en");
  });

  it("always emits a publisher Organization with absolute logo url", () => {
    const out = buildArticleJsonLd({ siteBaseUrl: BASE, doc: makeDoc() });
    expect(out.publisher).toEqual({
      "@type": "Organization",
      name: APP_METADATA.NAME,
      logo: { "@type": "ImageObject", url: `${BASE}/favicon.svg` },
    });
  });
});

describe("buildBreadcrumbListJsonLd", () => {
  it("returns null for fewer than two crumbs", () => {
    expect(
      buildBreadcrumbListJsonLd({ siteBaseUrl: BASE, crumbs: [] }),
    ).toBeNull();
    expect(
      buildBreadcrumbListJsonLd({
        siteBaseUrl: BASE,
        crumbs: [{ name: "Home", path: "/" }],
      }),
    ).toBeNull();
  });

  it("emits itemListElement with 1-based positions and absolute item urls", () => {
    const out = buildBreadcrumbListJsonLd({
      siteBaseUrl: BASE,
      crumbs: [
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: "Hello", path: "/blog/hello" },
      ],
    });
    expect(out["@type"]).toBe("BreadcrumbList");
    expect(out.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Hello",
        item: `${BASE}/blog/hello`,
      },
    ]);
  });

  it("drops crumbs missing name or path", () => {
    const out = buildBreadcrumbListJsonLd({
      siteBaseUrl: BASE,
      crumbs: [
        { name: "Home", path: "/" },
        { name: "", path: "/x" },
        { name: "Blog", path: "/blog" },
      ],
    });
    expect(out.itemListElement).toHaveLength(2);
  });
});

describe("buildDetailPageBreadcrumbs", () => {
  it("returns null when doc is missing required fields", () => {
    expect(
      buildDetailPageBreadcrumbs({ siteBaseUrl: BASE, doc: null }),
    ).toBeNull();
    expect(
      buildDetailPageBreadcrumbs({
        siteBaseUrl: BASE,
        doc: { title: "x" },
      }),
    ).toBeNull();
  });

  it("returns null for an unknown doc_type with no label", () => {
    expect(
      buildDetailPageBreadcrumbs({
        siteBaseUrl: BASE,
        doc: makeDoc({ doc_type: "press_release" }),
      }),
    ).toBeNull();
  });

  it("emits Home > Section > Title trail with absolute urls", () => {
    const out = buildDetailPageBreadcrumbs({
      siteBaseUrl: BASE,
      doc: makeDoc(),
    });
    expect(out.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: BREADCRUMB_SECTION_LABELS.blog,
        item: `${BASE}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Hello, world",
        item: `${BASE}/blog/hello-world`,
      },
    ]);
  });
});
