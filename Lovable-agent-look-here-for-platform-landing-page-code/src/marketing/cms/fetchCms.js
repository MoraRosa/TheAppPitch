/**
 * fetchCms -- Tightly-scoped GET helper for the public CMS endpoints.
 *
 * Why this file exists rather than reusing @theapp/api-client: the
 * marketing bundle (peakenterprise.ca) is a zero-auth surface by design; it
 * does not pull in any module that talks to authenticated endpoints
 * or carries token-injection plumbing. This helper does exactly one
 * thing: anonymous GET against /api/v1/cms/*, unwrap the { data: ... }
 * envelope, surface 404s as null, throw on every other non-2xx.
 *
 * @module marketing/cms/fetchCms
 */

import { getApiBase } from "./apiBase.js";

/**
 * Error thrown for non-2xx responses other than 404 (which becomes
 * `null` so callers can branch on "missing" without a try/catch).
 */
export class CmsFetchError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "CmsFetchError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Build a query string from an object, skipping undefined / null /
 * empty-string values. Returns "" or "?key=value&...".
 */
function buildQuery(params) {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (entries.length === 0) return "";
  const usp = new URLSearchParams();
  for (const [k, v] of entries) usp.set(k, String(v));
  return `?${usp.toString()}`;
}

/**
 * GET /api/v1/cms/<path><query>. Returns the unwrapped `data` payload
 * on 200, `null` on 404, throws CmsFetchError otherwise.
 *
 * @param {string} path        Path under /api/v1/cms (e.g. "pages/landing").
 * @param {object} [opts]
 * @param {object} [opts.query]  Query string params.
 * @param {AbortSignal} [opts.signal]  Cancellation signal.
 * @returns {Promise<object|null>}
 */
export async function fetchCms(path, opts = {}) {
  const url = `${getApiBase()}/api/v1/cms/${path}${buildQuery(opts.query)}`;

  let response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: opts.signal,
    });
  } catch (err) {
    // AbortError is propagated as-is so callers can branch on it.
    if (err && err.name === "AbortError") throw err;
    throw new CmsFetchError(`network error reading ${path}: ${err.message}`, {
      status: 0,
    });
  }

  if (response.status === 404) {
    return null;
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const code = body?.error?.code || `http_${response.status}`;
    const message =
      body?.error?.message || `cms request failed (${response.status})`;
    throw new CmsFetchError(message, { status: response.status, code });
  }

  return body?.data ?? null;
}
