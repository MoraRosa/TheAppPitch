/**
 * Email-verified path constant shared by every account surface that
 * needs to seed Supabase's verification email with a `redirectTo` URL.
 *
 * The path is derived from VITE_ACCOUNT_BASENAME so it stays correct in
 * every deploy layout (single-origin Cloudflare Pages serves the account
 * SPA under /account; a split-host layout serves it at root). This is
 * the same basename SSOT that account/main.jsx and App.jsx's
 * PASSWORD_RESET_PATH use, so the register and resend-verification flows
 * agree with the router; the backend's origin allow-list re-validates
 * whatever value lands at the API.
 *
 * Optional signup intent ({ plan, price, interval, currency }) is
 * appended as query params so a recipient opening the email in a
 * fresh tab (a different sessionStorage scope than the register tab)
 * still arrives intent-aware; the email-verified landing page
 * re-stashes the params into sessionStorage before the user signs in.
 *
 * @module account/emailVerifiedPath
 */

import { appendIntentToUrl } from "./_signupIntent.js";

const ACCOUNT_BASENAME = import.meta.env.VITE_ACCOUNT_BASENAME ?? "/account";
const ACCOUNT_BASE_PATH = ACCOUNT_BASENAME === "/" ? "" : ACCOUNT_BASENAME;

export const EMAIL_VERIFIED_PATH = `${ACCOUNT_BASE_PATH}/email-verified`;

/**
 * Absolute URL the verification email should land on. Built from the
 * current document origin so each environment (localhost, preview,
 * prod) produces a same-host redirectTo without any extra env var.
 *
 * @param {object|null} [intent]  Optional signup intent appended as
 *   ?plan&price&interval&currency for cross-tab survival.
 * @returns {string}
 */
export function emailVerifiedRedirectUrl(intent = null) {
  const base =
    typeof window === "undefined"
      ? EMAIL_VERIFIED_PATH
      : `${window.location.origin}${EMAIL_VERIFIED_PATH}`;
  return appendIntentToUrl(base, intent);
}
