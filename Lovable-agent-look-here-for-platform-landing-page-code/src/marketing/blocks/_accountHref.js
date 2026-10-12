/**
 * Cross-host href resolution for marketing block CTAs.
 *
 * Marketing block JSON authored by staff/operators uses short paths
 * like "/register" or "/login?plan=starter" -- intent, not URLs. The
 * renderer rewrites those to absolute account-host URLs (in prod) or
 * /account-prefixed dev paths so the same seed works in every
 * environment without per-env edits.
 *
 * Origin resolution is delegated to @theapp/utils/platformUrl so the
 * marketing entry on peakenterprise.ca and the merchant admin on
 * admin.peakenterprise.ca share a single source of truth (briefing Section
 * 5.4 #6: cross-app sharing goes through packages/*). This file owns
 * only the marketing-specific concern: which authored hrefs should be
 * treated as account-bound at all.
 *
 * Anything that is NOT in the explicit account-path allowlist is
 * returned unchanged: marketing-host paths ("/contact", "/legal"),
 * absolute URLs ("https://..."), and other schemes ("mailto:",
 * "tel:") all pass through.
 *
 * Keep the allowlist explicit -- silently account-prefixing every
 * "/foo" would break new marketing routes the moment they are
 * added. Adding a new account-side route requires one line here.
 *
 * @module marketing/blocks/_accountHref
 */

import { platformAccountUrl } from "@theapp/utils/platformUrl";

// Known account-side routes the platform account SPA owns. Match
// either an exact path, a path with a query string
// ("/register?plan=..."), or a nested route ("/billing/return").
const ACCOUNT_PATHS = Object.freeze([
  "/register",
  "/login",
  "/select-business",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/billing",
]);

function hasScheme(href) {
  // Matches "https:", "mailto:", "tel:", etc. -- anything with a
  // URL scheme is already absolute and must pass through unchanged.
  return /^[a-z][a-z0-9+.-]*:/i.test(href);
}

function isAccountPath(href) {
  if (typeof href !== "string" || href.length === 0) return false;
  if (hasScheme(href)) return false;
  if (!href.startsWith("/")) return false;
  return ACCOUNT_PATHS.some(
    (p) =>
      href === p ||
      href.startsWith(`${p}?`) ||
      href.startsWith(`${p}#`) ||
      href.startsWith(`${p}/`),
  );
}

/**
 * Resolve a CTA href against the account host when it points at a
 * known account-side route; pass everything else through unchanged.
 *
 * @param {string|null|undefined} href
 * @returns {string|null|undefined}  Original input shape preserved
 *   for empty / nullish values so callers can keep their own
 *   fallback handling (e.g. `href || "#"`).
 */
export function resolveAccountHref(href) {
  if (!href) return href;
  if (!isAccountPath(href)) return href;
  return platformAccountUrl(href);
}
