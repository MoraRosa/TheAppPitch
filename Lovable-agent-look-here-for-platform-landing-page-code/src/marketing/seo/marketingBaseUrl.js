/**
 * marketingBaseUrl -- Resolve the canonical origin for the marketing
 * surface. Used by the SEO head (canonical link, og:url) and the
 * JSON-LD Organization payload. Convention mirrors apiBase.js:
 *   - VITE_MARKETING_BASE_URL when set (production: https://peakenterprise.ca)
 *   - window.location.origin otherwise (dev / preview)
 *
 * @module marketing/seo/marketingBaseUrl
 */

export function getMarketingBaseUrl() {
  const fromEnv = import.meta.env?.VITE_MARKETING_BASE_URL;
  if (fromEnv && typeof fromEnv === "string") {
    return fromEnv.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

/**
 * Compose an absolute URL from a relative path. Path is a "/foo/bar"
 * style string; leading "/" is required.
 */
export function absoluteUrl(path) {
  const base = getMarketingBaseUrl();
  if (!path) return base;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
