/**
 * useResetPassword -- form state for the "set new password" surface.
 *
 * Reached from the recovery-email link, which lands on
 * /reset-password#access_token=...&type=recovery. We lift the token
 * from the URL fragment, validate the new password client-side, then
 * call MerchantAuthContext.updatePassword(newPassword, accessToken)
 * which POSTs to /api/v1/auth/merchant/reset-password.
 *
 * On success we navigate (same-host) to /login with a status message
 * in router state -- LoginPage reads location.state.message and renders
 * it as a one-shot confirmation banner.
 *
 * @module account/reset-password/useResetPassword
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMerchantAuth } from "@theapp/merchant-auth";

const MIN_PASSWORD_LENGTH = 12;

function extractAccessToken() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token") || null;
}

export function useResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updatePassword } = useMerchantAuth();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
        return;
      }

      const accessToken = extractAccessToken();
      if (!accessToken) {
        setError(
          "Invalid or expired reset link. Please request a new password reset.",
        );
        return;
      }

      setLoading(true);

      try {
        const ok = await updatePassword(password, accessToken);
        if (ok) {
          navigate("/login", {
            replace: true,
            state: {
              message:
                "Password updated successfully. Please sign in with your new password.",
            },
          });
        } else {
          setError("Failed to reset password. The link may have expired.");
        }
      } catch (err) {
        setError(err?.message || "Failed to reset password");
      } finally {
        setLoading(false);
      }
    },
    [password, confirmPassword, updatePassword, navigate],
  );

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    loading,
    handleSubmit,
  };
}
