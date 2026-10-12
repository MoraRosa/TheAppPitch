/**
 * ResetPasswordPage -- presentational shell for the "set new password"
 * surface. Pure render based on props from useResetPassword.
 */

import React from "react";
import {
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  AuthForm,
  AuthField,
  AuthLabel,
  AuthInput,
  AuthSubmitButton,
  AuthErrorBanner,
} from "../../shared/AuthForm.jsx";

export default function ResetPasswordPage({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  loading,
  handleSubmit,
}) {
  return (
    <AuthCard>
      <AuthTitle>Set new password</AuthTitle>
      <AuthSubtitle>Enter your new password below.</AuthSubtitle>

      <AuthForm onSubmit={handleSubmit} noValidate>
        {error && (
          <AuthErrorBanner id="reset-error" role="alert" aria-live="assertive">
            {error}
          </AuthErrorBanner>
        )}

        <AuthField>
          <AuthLabel htmlFor="password">New password</AuthLabel>
          <AuthInput
            type="password"
            id="password"
            name="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-describedby={error ? "reset-error" : undefined}
          />
        </AuthField>

        <AuthField>
          <AuthLabel htmlFor="confirm-password">Confirm new password</AuthLabel>
          <AuthInput
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-describedby={error ? "reset-error" : undefined}
          />
        </AuthField>

        <AuthSubmitButton type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Updating..." : "Update password"}
        </AuthSubmitButton>
      </AuthForm>
    </AuthCard>
  );
}
