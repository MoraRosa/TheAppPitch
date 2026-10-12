/**
 * submitInquiry -- Tightly-scoped POST helper for the public platform
 * inquiries endpoint.
 *
 * Why this file exists rather than reusing @theapp/api-client: the
 * marketing bundle (peakenterprise.ca) is a zero-auth surface by design
 * (see fetchCms.js). This helper does exactly one thing: an anonymous
 * POST of a prospect inquiry to /api/v1/platform/inquiries, returning
 * the success envelope or throwing a typed error the form can render.
 *
 * The backend enforces the required-field contract (name, email, phone,
 * message) and rate limiting; this helper does no validation of its own
 * beyond shaping the request body.
 *
 * @module marketing/cms/submitInquiry
 */

import { getApiBase } from "./apiBase.js";

/**
 * Error thrown when the inquiry submission fails. `status` carries the
 * HTTP status (0 for a network error) and `code` the backend error code
 * when present, so the form can branch on rate-limit (429) vs the rest.
 */
export class InquirySubmitError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "InquirySubmitError";
    this.status = status;
    this.code = code;
  }
}

/**
 * POST /api/v1/platform/inquiries. Resolves to the response envelope
 * ({ success, message }) on success; throws InquirySubmitError on any
 * non-2xx response or network failure.
 *
 * @param {object} payload
 * @param {string} payload.name
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} payload.message
 * @param {string} [payload.company]
 * @param {string} [payload.inquiry_type]
 * @param {string} [payload.source_page]
 * @param {string} [payload.website]  Honeypot; leave empty for humans.
 * @param {object} [opts]
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function submitInquiry(payload, opts = {}) {
  const url = `${getApiBase()}/api/v1/platform/inquiries`;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: opts.signal,
    });
  } catch (err) {
    if (err && err.name === "AbortError") throw err;
    throw new InquirySubmitError(`network error: ${err.message}`, {
      status: 0,
    });
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
      body?.error?.message || `inquiry submission failed (${response.status})`;
    throw new InquirySubmitError(message, { status: response.status, code });
  }

  return body;
}
