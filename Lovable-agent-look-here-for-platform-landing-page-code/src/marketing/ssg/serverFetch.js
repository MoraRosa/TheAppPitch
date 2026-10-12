/**
 * fetchCmsForSsg -- Build-time-aware CMS fetch for route loaders.
 *
 * Two-mode policy (the agreed Phase 2E ADR):
 *
 *   Server (vite-react-ssg build, Node):
 *     - process.env.CMS_SSG_BASE_URL UNSET  -> return null (soft skip).
 *       Local `pnpm build` smoke checks complete without the backend
 *       running and emit shell HTML for each route.
 *     - process.env.CMS_SSG_BASE_URL SET    -> fetch hard. Any
 *       network/HTTP error is re-thrown so CI fails the build instead
 *       of silently shipping empty pages. Production CI sets the var
 *       unconditionally.
 *
 *   Client (browser, dev or post-hydration):
 *     - Delegates to fetchCms which uses VITE_API_BASE_URL.
 *
 * @module marketing/ssg/serverFetch
 */

import { fetchCms } from "../cms/fetchCms.js";

function isServer() {
  return typeof window === "undefined";
}

function getSsgBaseUrl() {
  if (typeof process === "undefined") return null;
  const v = process.env?.CMS_SSG_BASE_URL;
  return v && typeof v === "string" ? v.replace(/\/+$/, "") : null;
}

function buildQuery(params) {
  if (!params) return "";
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    usp.set(k, String(v));
  }
  const q = usp.toString();
  return q ? `?${q}` : "";
}

async function fetchAt(baseUrl, path, query) {
  const url = `${baseUrl}/api/v1/cms/${path}${buildQuery(query)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    let body = null;
    try {
      body = await res.json();
    } catch {
      // body stays null
    }
    const code = body?.error?.code || `http_${res.status}`;
    const message =
      body?.error?.message || `cms request failed (${res.status})`;
    throw new Error(`[SSG] ${path}: ${code} -- ${message}`);
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return body?.data ?? null;
}

/**
 * Fetch a public CMS endpoint. Returns the unwrapped `data` payload,
 * or null for 404 / SSG-soft-skip. Throws on any other error.
 *
 * @param {string} path        e.g. "pages/landing", "documents/legal/tos"
 * @param {object} [query]     Query string params (locale, type, limit, ...)
 * @returns {Promise<object|null>}
 */
export async function fetchCmsForSsg(path, query) {
  if (isServer()) {
    const base = getSsgBaseUrl();
    if (!base) return null; // soft skip -- ADR-documented
    return fetchAt(base, path, query);
  }
  // Browser: existing helper handles VITE_API_BASE_URL + AbortError + 404.
  return fetchCms(path, { query });
}
