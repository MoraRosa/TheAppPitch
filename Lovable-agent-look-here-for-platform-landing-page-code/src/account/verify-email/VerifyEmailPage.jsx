/**
 * VerifyEmailPage -- presentational shell for the "check your inbox"
 * surface shown immediately after registration. Pure render based on
 * props from useVerifyEmail. Uses the same AuthForm primitives as every
 * other auth surface so the visual system stays consistent.
 */

import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  AuthSubmitButton,
  AuthErrorBanner,
  AuthSuccessBanner,
  AuthLinks,
} from "../../shared/AuthForm.jsx";

const EmailBadge = styled.p`
  margin: 0 0 var(--brand-space-6);
  padding: var(--brand-space-3);
  background: var(--brand-color-primary50);
  color: var(--brand-color-primary700);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-primary100);
  border-radius: var(--brand-radius-md);
  font-size: var(--brand-fontSize-sm);
  font-family: var(--brand-font-mono);
  text-align: center;
  word-break: break-all;
`;

export default function VerifyEmailPage({
  email,
  message,
  error,
  loading,
  handleResend,
}) {
  return (
    <AuthCard>
      <AuthTitle>Verify your email</AuthTitle>
      <AuthSubtitle>
        We've sent a verification link to your inbox. Click the link in the
        email to activate your account.
      </AuthSubtitle>

      {email && <EmailBadge>{email}</EmailBadge>}

      {error && (
        <AuthErrorBanner role="alert" aria-live="assertive">
          {error}
        </AuthErrorBanner>
      )}
      {message && (
        <AuthSuccessBanner role="status" aria-live="polite">
          {message}
        </AuthSuccessBanner>
      )}

      <AuthSubmitButton
        type="button"
        onClick={handleResend}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Sending..." : "Resend verification email"}
      </AuthSubmitButton>

      <AuthLinks>
        <Link to="/login">Back to sign in</Link>
      </AuthLinks>
    </AuthCard>
  );
}
