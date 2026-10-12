/**
 * apiBase -- Resolve the backend base URL for marketing CMS reads.
 *
 * The marketing bundle MUST NOT import @theapp/api-client (per
 * AI_MANDATORY_BRIEFING). This helper is the only place a marketing
 * module touches an API URL: every CMS fetch goes through fetchCms.js
 * which composes endpoints onto getApiBase().
 *
 * Convention matches packages/api-client/src/apiClient.js:
 *   - VITE_API_BASE_URL when set
 *   - http://localhost:4000 in dev
 *
 * @module marketing/cms/apiBase
 */

export function getApiBase() {
  const fromEnv =
    import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL;
  if (typeof fromEnv === "string" && fromEnv.trim()) return fromEnv.trim();
  return "http://localhost:4000";
}
