/**
 * useVerifyEmail -- state for the post-registration "check your inbox"
 * surface. Reads the recipient's email from ?email=... in the URL (the
 * only channel that survives a refresh or a future cross-host hop into
 * this page) and exposes a resend-verification action that POSTs to the
 * unauthenticated backend endpoint.
 *
 * The resend redirectTo is built from window.location.origin plus the
 * dev-aware /email-verified path, matching what useRegister sends at
 * sign-up time. The backend re-validates the URL against its own
 * platform/merchant origin allow-list before echoing it into the
 * verification email, so a tampered query string cannot redirect the
 * recipient off-host.
 *
 * @module account/verify-email/useVerifyEmail
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { emailVerifiedRedirectUrl } from "../emailVerifiedPath.js";
import {
  loadIntent,
  readIntentFromParams,
  stashIntent,
} from "../_signupIntent.js";

export function useVerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Same-host nav from /register stashes the intent before landing
  // here, but a refresh on this URL can replay it from the query
  // string. Read URL first so an explicit re-share survives, fall
  // back to whatever the register tab already stashed.
  const urlIntent = useMemo(
    () => readIntentFromParams(searchParams),
    [searchParams],
  );
  useEffect(() => {
    if (urlIntent) stashIntent(urlIntent);
  }, [urlIntent]);

  const handleResend = useCallback(async () => {
    if (!email) {
      setError(
        "Unable to determine your email address. Please sign in to resend.",
      );
      return;
    }

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const apiUrl = (
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_API_URL ||
        "http://localhost:4000"
      ).replace(/\/$/, "");
      const intent = urlIntent || loadIntent();
      const response = await fetch(
        `${apiUrl}/api/v1/merchants/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            verifyRedirectTo: emailVerifiedRedirectUrl(intent),
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage(
          data.message || "Verification email sent. Please check your inbox.",
        );
      } else {
        setError(data.message || "Failed to resend verification email.");
      }
    } catch {
      setError("Failed to resend verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, urlIntent]);

  return {
    email,
    message,
    error,
    loading,
    handleResend,
  };
}
