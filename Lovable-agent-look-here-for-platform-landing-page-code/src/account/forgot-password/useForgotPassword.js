/**
 * useForgotPassword -- form state for the "send me a reset link" surface.
 *
 * Wraps MerchantAuthContext.resetPassword(email) which POSTs to
 * /api/v1/auth/merchant/forgot-password and instructs the backend to
 * email a recovery link. The `redirectTo` field inside the context
 * method is built from window.location.origin -- because this surface
 * now lives on the platform host, the email's link will land on
 * app.peakenterprise.ca/reset-password (same host, no cross-origin hop).
 *
 * Anti-enumeration: the success copy is intentionally identical
 * whether or not the email matched an account.
 *
 * @module account/forgot-password/useForgotPassword
 */

import { useState, useCallback } from "react";
import { useMerchantAuth } from "@theapp/merchant-auth";

const ANTI_ENUMERATION_NOTICE =
  "If an account with that email exists, a password reset link has been sent.";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useMerchantAuth();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setMessage("");
      setError("");
      setLoading(true);

      try {
        const ok = await resetPassword(email);
        if (ok) {
          setMessage(ANTI_ENUMERATION_NOTICE);
        } else {
          setError("Failed to send reset link. Please try again.");
        }
      } catch (err) {
        setError(err?.message || "Failed to send reset link");
      } finally {
        setLoading(false);
      }
    },
    [email, resetPassword],
  );

  return {
    email,
    setEmail,
    message,
    error,
    loading,
    handleSubmit,
  };
}
