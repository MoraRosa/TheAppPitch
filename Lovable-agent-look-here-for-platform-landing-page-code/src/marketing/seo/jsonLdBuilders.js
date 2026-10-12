/**
 * jsonLdBuilders -- Pure helpers that turn a CMS document payload into
 * schema.org JSON-LD objects. Kept side-effect free (no fs, no fetch,
 * no DOM, no process.env) so they're trivially unit-testable and shared
 * across SSR (vite-react-ssg prerender) and CSR mounts.
 *
 * The component (PageJsonLd.jsx) owns: rendering the <script> tag.
 * This module owns: schema selection, field mapping, URL composition,
 * breadcrumb assembly.
 *
 * Type selection per doc_type follows Phase 4.3 decision 1B:
 *   blog       -> BlogPosting
 *   docs       -> TechArticle
 *   changelog  -> Article
 *   legal      -> Article
 *
 * @module marketing/seo/jsonLdBuilders
 */

import { APP_METADATA } from "@theapp/config";

// Pretty labels used in BreadcrumbList items. Distinct from
// sitemapBuilders.SECTION_LABELS (which targets llms.txt headers and
// reads more like prose). Keys must stay in sync with the doc_type
// enum on the backend (see getPublishedDocument.VALID_DOC_TYPES).
export const BREADCRUMB_SECTION_LABELS = Object.freeze({
  legal: "Legal",
  blog: "Blog",
  changelog: "Changelog",
  docs: "Docs",
});

// schema.org @type per doc_type. Anything not listed falls back to the
// schema.org parent "Article" so a new doc_type added on the backend
// before this map is updated still renders valid JSON-LD.
const ARTICLE_TYPE_BY_DOC_TYPE = Object.freeze({
  blog: "BlogPosting",
  docs: "TechArticle",
  changelog: "Article",
  legal: "Article",
});

const PUBLISHER_NAME = APP_METADATA.NAME;
const PUBLISHER_LOGO_PATH = "/favicon.svg";

function joinUrl(base, path) {
  if (!path) return base || "";
  const left = (base || "").replace(/\/$/, "");
  const right = path.startsWith("/") ? path : `/${path}`;
  return `${left}${right}`;
}

function detailUrl({ siteBaseUrl, doc }) {
  const path =
    doc?.canonical_path ||
    (doc?.doc_type && doc?.slug ? `/${doc.doc_type}/${doc.slug}` : null);
  return path ? joinUrl(siteBaseUrl, path) : null;
}

function toIsoDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

/**
 * Build an Article-family JSON-LD payload for one detail document.
 * Returns null when required fields (title, doc_type) are missing.
 *
 * @param {object} args
 * @param {string} args.siteBaseUrl   Absolute origin, e.g. "https://peakenterprise.ca".
 * @param {object} args.doc           Public CMS document payload (see
 *   backend getPublishedDocument return shape).
 * @returns {object|null}
 */
export function buildArticleJsonLd({ siteBaseUrl, doc }) {
  if (!doc || !doc.title || !doc.doc_type) return null;

  const type = ARTICLE_TYPE_BY_DOC_TYPE[doc.doc_type] || "Article";
  const url = detailUrl({ siteBaseUrl, doc });
  const datePublished = toIsoDate(doc.published_at);
  const dateModified = toIsoDate(doc.effective_at) || datePublished;
  const sectionLabel = BREADCRUMB_SECTION_LABELS[doc.doc_type] || null;

  const payload = {
    "@context": "https://schema.org",
    "@type": type,
    headline: doc.title,
  };

  const description = doc.meta_description || doc.summary;
  if (description) payload.description = description;
  if (url) {
    payload.url = url;
    payload.mainEntityOfPage = { "@type": "WebPage", "@id": url };
  }
  if (datePublished) payload.datePublished = datePublished;
  if (dateModified) payload.dateModified = dateModified;
  if (doc.author_name) {
    payload.author = { "@type": "Person", name: doc.author_name };
  }
  if (sectionLabel) payload.articleSection = sectionLabel;
  if (Array.isArray(doc.tags) && doc.tags.length > 0) {
    payload.keywords = doc.tags.join(", ");
  }
  if (doc.locale) payload.inLanguage = doc.locale;

  payload.publisher = {
    "@type": "Organization",
    name: PUBLISHER_NAME,
    logo: {
      "@type": "ImageObject",
      url: joinUrl(siteBaseUrl, PUBLISHER_LOGO_PATH),
    },
  };

  return payload;
}

/**
 * Build a BreadcrumbList JSON-LD payload from an ordered array of
 * { name, path } crumbs. Returns null when fewer than 2 crumbs are
 * supplied (a single-item breadcrumb adds no information).
 *
 * @param {object} args
 * @param {string} args.siteBaseUrl
 * @param {Array<{name:string,path:string}>} args.crumbs
 * @returns {object|null}
 */
export function buildBreadcrumbListJsonLd({ siteBaseUrl, crumbs }) {
  if (!Array.isArray(crumbs) || crumbs.length < 2) return null;
  const items = crumbs
    .filter((c) => c && c.name && c.path)
    .map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: c.name,
      item: joinUrl(siteBaseUrl, c.path),
    }));
  if (items.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

/**
 * Convenience: build the Home > Section > Document crumb trail for a
 * detail page. Used by DocumentDetail so each call site does not
 * repeat the same composition. Returns null when the doc is missing
 * required fields.
 */
export function buildDetailPageBreadcrumbs({ siteBaseUrl, doc }) {
  if (!doc || !doc.title || !doc.doc_type) return null;
  const sectionLabel = BREADCRUMB_SECTION_LABELS[doc.doc_type];
  if (!sectionLabel) return null;
  const detail = detailUrl({ siteBaseUrl, doc });
  if (!detail) return null;
  return buildBreadcrumbListJsonLd({
    siteBaseUrl,
    crumbs: [
      { name: "Home", path: "/" },
      { name: sectionLabel, path: `/${doc.doc_type}` },
      { name: doc.title, path: detail.replace(siteBaseUrl, "") || "/" },
    ],
  });
}
