/**
 * useEmailVerified -- decides which state the verification landing
 * page renders. Supabase appends `?error=&error_description=` to the
 * redirectTo when consumption fails (expired link, replayed token,
 * tampered fragment) and otherwise drops the user here clean with the
 * session bootstrap material in the URL hash.
 *
 * We intentionally do NOT consume the access_token / refresh_token
 * fragments Supabase puts in the URL. Sessions live on the merchant
 * host (admin.peakenterprise.ca); the platform account SPA is sign-in-only.
 * Letting the recipient click through to /login is the canonical entry
 * for the post-verification session, and it mints a fresh handoff via
 * the existing cross-host flow. The hash is stripped on mount so the
 * tokens do not linger in browser history or get copied via share.
 *
 * @module account/email-verified/useEmailVerified
 */

import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { readIntentFromParams, stashIntent } from "../_signupIntent.js";

export function useEmailVerified() {
  const [searchParams] = useSearchParams();

  const status = useMemo(() => {
    const error =
      searchParams.get("error") ||
      searchParams.get("error_code") ||
      searchParams.get("error_description");
    return error ? "error" : "success";
  }, [searchParams]);

  const errorDescription = useMemo(() => {
    return (
      searchParams.get("error_description") || searchParams.get("error") || ""
    );
  }, [searchParams]);

  // Re-hydrate the signup intent into sessionStorage when the email
  // link carries one. Recipients who click the link in a new browser
  // or device land here with an empty sessionStorage; the URL is the
  // only transport that survived the cross-tab hop. Same-tab returns
  // are a no-op because the intent is already stashed.
  const intent = useMemo(
    () => readIntentFromParams(searchParams),
    [searchParams],
  );
  useEffect(() => {
    if (intent) stashIntent(intent);
  }, [intent]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) {
      return;
    }
    try {
      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, "", cleanUrl);
    } catch {
      // history API unavailable -- safe to ignore
    }
  }, []);

  return {
    status,
    errorDescription,
  };
}
