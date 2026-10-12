/**
 * useLogin -- form state machine for the merchant sign-in surface.
 *
 * Owns email/password input state, the show/hide-password toggle, the
 * client-side failed-attempts lockout, and the orchestration that fires
 * on a successful credential check:
 *
 *   1. login(email, password)              -- via MerchantAuthContext;
 *                                             persists tokens + hydrates
 *                                             the in-memory user/claims.
 *   2. POST /api/v1/auth/merchant/handoff/issue
 *                                          -- mints a one-shot JWT and
 *                                             returns a #token=... URL on
 *                                             the merchant host. apiClient
 *                                             already carries the Bearer
 *                                             token persisted by step 1.
 *   3. window.location.assign(handoffUrl)  -- crosses the host boundary
 *                                             to admin.peakenterprise.ca/handoff
 *                                             where consumeHandoff seats
 *                                             the session and lands the
 *                                             user in /admin.
 *
 * Routing decisions for 0-membership and multi-membership users live
 * inside the merchant app's ProtectedRoute (which forwards to
 * /select-business as needed) -- this hook intentionally does not branch
 * on memberships and always issues the handoff so a single code path
 * crosses the host boundary.
 *
 * @module account/login/useLogin
 */

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@theapp/api-client";
import { useMerchantAuth } from "@theapp/merchant-auth";
import { appendIntentToUrl, loadIntent } from "../_signupIntent.js";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30_000;

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);

  const { login, error: authError } = useMerchantAuth();

  const isLockedOut = Boolean(lockedUntil && Date.now() < lockedUntil);

  useEffect(() => {
    if (!lockedUntil) return undefined;
    const remainingMs = lockedUntil - Date.now();
    if (remainingMs <= 0) {
      setLockedUntil(null);
      return undefined;
    }
    const timerId = setTimeout(() => setLockedUntil(null), remainingMs);
    return () => clearTimeout(timerId);
  }, [lockedUntil]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (isLockedOut) {
        const secondsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
        setError(
          `Too many failed attempts. Please wait ${secondsLeft} seconds before trying again.`,
        );
        return;
      }

      setLoading(true);

      try {
        const ok = await login(email, password);

        if (!ok) {
          const newCount = failedAttempts + 1;
          setFailedAttempts(newCount);

          if (newCount >= MAX_FAILED_ATTEMPTS) {
            setLockedUntil(Date.now() + LOCKOUT_DURATION_MS);
            setFailedAttempts(0);
            setError(
              "Too many failed attempts. Please wait 30 seconds before trying again.",
            );
          } else {
            setError(authError || "Failed to sign in");
          }
          return;
        }

        setFailedAttempts(0);
        setLockedUntil(null);

        const res = await apiClient.post(
          "/api/v1/auth/merchant/handoff/issue",
          {},
        );

        if (!res?.success || !res?.data?.handoffUrl) {
          setError(
            res?.message || "Could not start your session. Please try again.",
          );
          return;
        }

        // Append the signup intent (if any) to the handoff URL so the
        // params survive the cross-host hop to admin.peakenterprise.ca where
        // the CheckoutBounce page reads them and drives a Stripe
        // checkout session. The hash (#token=...) is preserved.
        const handoffUrl = appendIntentToUrl(res.data.handoffUrl, loadIntent());
        window.location.assign(handoffUrl);
      } catch (err) {
        setError(err?.message || "Failed to sign in");
      } finally {
        setLoading(false);
      }
    },
    [
      email,
      password,
      isLockedOut,
      lockedUntil,
      failedAttempts,
      login,
      authError,
    ],
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    loading,
    isLockedOut,
    handleSubmit,
  };
}
