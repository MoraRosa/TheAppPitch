/**
 * ForgotPasswordPage -- presentational shell for the "send me a reset
 * link" surface. Pure render based on props from useForgotPassword.
 */

import React from "react";
import { Link } from "react-router-dom";
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
  AuthSuccessBanner,
  AuthLinks,
} from "../../shared/AuthForm.jsx";

export default function ForgotPasswordPage({
  email,
  setEmail,
  message,
  error,
  loading,
  handleSubmit,
}) {
  return (
    <AuthCard>
      <AuthTitle>Reset password</AuthTitle>
      <AuthSubtitle>Enter your email to receive a reset link.</AuthSubtitle>

      <AuthForm onSubmit={handleSubmit} noValidate>
        {error && (
          <AuthErrorBanner id="forgot-error" role="alert" aria-live="assertive">
            {error}
          </AuthErrorBanner>
        )}
        {message && (
          <AuthSuccessBanner role="status" aria-live="polite">
            {message}
          </AuthSuccessBanner>
        )}

        <AuthField>
          <AuthLabel htmlFor="email">Email address</AuthLabel>
          <AuthInput
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-describedby={error ? "forgot-error" : undefined}
          />
        </AuthField>

        <AuthSubmitButton type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </AuthSubmitButton>
      </AuthForm>

      <AuthLinks>
        <Link to="/login">Back to sign in</Link>
      </AuthLinks>
    </AuthCard>
  );
}
