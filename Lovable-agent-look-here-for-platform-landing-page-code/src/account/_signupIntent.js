/**
 * Signup intent -- read / stash / serialize the plan selection a
 * visitor brought from the marketing pricing surface so the account
 * SPA can hand it off to the merchant host's checkout bounce after
 * the register -> verify-email -> login -> select-business -> handoff
 * journey completes.
 *
 * Three transports cooperate because no single channel survives the
 * whole journey:
 *
 *   1. URL query string  -- crosses host boundaries (peakenterprise.ca ->
 *      app.peakenterprise.ca on the initial "Start free" click,
 *      app.peakenterprise.ca -> admin.peakenterprise.ca on the final handoff hop).
 *   2. sessionStorage    -- survives same-host page navigation within
 *      app.peakenterprise.ca (register -> verify-email -> login ->
 *      select-business) without leaking the intent into the URL bar
 *      or browser history.
 *   3. Supabase email link -- the verify redirect URL re-seeds the
 *      intent so a recipient who opens the email in a fresh tab (a
 *      different sessionStorage scope) still arrives intent-aware.
 *
 * The intent shape is intentionally narrow: only the fields the
 * billing checkout-session endpoint actually consumes (planCode,
 * currency, interval) plus the resolved price row id so the bounce
 * page can short-circuit price re-resolution. Anything else from the
 * pricing card URL is ignored.
 *
 * Validation is permissive-by-discard: unknown values silently drop
 * to null so a malformed query string lands the user safely in /admin
 * with no checkout bounce, rather than 4xx-ing them out of the funnel.
 *
 * @module account/_signupIntent
 */
import { log } from "@theapp/utils/logger";
import {
  sanitizePlan,
  sanitizePrice,
  sanitizeInterval,
  sanitizeCurrency,
  readIntentFields,
} from "@theapp/utils/signupIntent";

const STORAGE_KEY = "theapp:signup_intent";

/**
 * Parse intent fields out of any URLSearchParams-like reader. Returns
 * null when no `plan` is present so callers can branch cleanly. Thin
 * wrapper over the shared @theapp/utils/signupIntent reader so the
 * account host and the merchant host validate identically.
 *
 * @param {URLSearchParams|{get:(k:string)=>string|null}} params
 * @returns {{plan:string,price:string|null,interval:string|null,currency:string|null}|null}
 */
export function readIntentFromParams(params) {
  return readIntentFields(params);
}

/**
 * Persist the intent to sessionStorage. No-ops outside the browser
 * (SSR) and silently swallows storage failures (private mode, quota)
 * because the URL transport is the resilient fallback.
 *
 * @param {object|null} intent
 */
export function stashIntent(intent) {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    if (!intent) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
  } catch (err) {
    log("[signupIntent] stash failed", err?.message || err);
  }
}

/**
 * Read the intent back from sessionStorage. Returns null when missing
 * or corrupted; a corrupted entry is also evicted so the next read is
 * clean.
 *
 * @returns {object|null}
 */
export function loadIntent() {
  if (typeof window === "undefined" || !window.sessionStorage) return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const plan = sanitizePlan(parsed?.plan);
    if (!plan) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return {
      plan,
      // eslint-disable-next-line no-restricted-syntax -- Signup intent: price is subscription price value (should document if dollars or minor units)
      price: sanitizePrice(parsed?.price),
      interval: sanitizeInterval(parsed?.interval),
      currency: sanitizeCurrency(parsed?.currency),
    };
  } catch {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore -- removal is best-effort
    }
    return null;
  }
}

/** Drop the stashed intent. */
export function clearIntent() {
  stashIntent(null);
}

/**
 * Serialize an intent as a URLSearchParams-ready object so callers can
 * append it to a redirect URL without per-call boilerplate. Returns an
 * empty object when intent is null so spread usage is safe.
 *
 * @param {object|null} intent
 * @returns {Record<string,string>}
 */
export function intentToQueryEntries(intent) {
  if (!intent) return {};
  const out = { plan: intent.plan };
  if (intent.price) out.price = intent.price;
  if (intent.interval) out.interval = intent.interval;
  if (intent.currency) out.currency = intent.currency;
  return out;
}

/**
 * Append intent params to an absolute or relative URL string,
 * preserving any existing query and any URL fragment. The fragment is
 * particularly important for the handoff URL (#token=...) which must
 * not collide with the query-string transport.
 *
 * @param {string} url
 * @param {object|null} intent
 * @returns {string}
 */
export function appendIntentToUrl(url, intent) {
  if (!intent || !url) return url;
  const entries = intentToQueryEntries(intent);
  if (Object.keys(entries).length === 0) return url;

  // Split off the fragment so query-string mutation does not collide
  // with the handoff token (#token=...).
  const hashIdx = url.indexOf("#");
  const fragment = hashIdx >= 0 ? url.slice(hashIdx) : "";
  const base = hashIdx >= 0 ? url.slice(0, hashIdx) : url;

  const sep = base.includes("?") ? "&" : "?";
  const qs = new URLSearchParams(entries).toString();
  return `${base}${sep}${qs}${fragment}`;
}

export const SIGNUP_INTENT_STORAGE_KEY = STORAGE_KEY;
