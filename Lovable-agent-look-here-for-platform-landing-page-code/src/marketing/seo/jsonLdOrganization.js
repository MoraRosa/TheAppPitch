/**
 * jsonLdOrganization -- Mount a single <script type="application/ld+json">
 * Organization block in <head> at app boot. Search engines and
 * AI crawlers (including answer engines that index Organization
 * snippets without rendering JS-heavy pages) read this once per
 * crawl; it does not need to follow route changes.
 *
 * Keep this minimal -- name, URL, logo. Phase 5 (staff CMS) is the
 * place to make these CMS-driven; until then they trace back to the
 * same brand constants the site chrome uses.
 *
 * @module marketing/seo/jsonLdOrganization
 */

import { APP_METADATA } from "@theapp/config";
import { getMarketingBaseUrl, absoluteUrl } from "./marketingBaseUrl.js";

const SCRIPT_ID = "theapp-jsonld-organization";

export function mountJsonLdOrganization() {
  if (typeof document === "undefined") return;
  if (document.getElementById(SCRIPT_ID)) return;

  const payload = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_METADATA.NAME,
    url: getMarketingBaseUrl() || undefined,
    logo: absoluteUrl("/favicon.svg"),
  };

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(payload);
  document.head.appendChild(script);
}
