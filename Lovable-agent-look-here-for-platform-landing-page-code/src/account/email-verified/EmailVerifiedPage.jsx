/**
 * EmailVerifiedPage -- presentational shell for the post-verification
 * landing surface. Renders one of two states based on props from
 * useEmailVerified: success (verification succeeded -- sign-in CTA) or
 * error (Supabase rejected the link -- resend / sign-in CTAs).
 */

import React from "react";
import { Link } from "react-router-dom";
import {
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  AuthErrorBanner,
  AuthSubmitButton,
  AuthLinks,
} from "../../shared/AuthForm.jsx";

export default function EmailVerifiedPage({ status, errorDescription }) {
  if (status === "error") {
    return (
      <AuthCard>
        <AuthTitle>Verification failed</AuthTitle>
        <AuthSubtitle>
          The verification link is invalid or has expired. Sign in to request a
          fresh link.
        </AuthSubtitle>

        {errorDescription && (
          <AuthErrorBanner role="alert" aria-live="assertive">
            {errorDescription}
          </AuthErrorBanner>
        )}

        <AuthLinks>
          <Link to="/login">Go to sign in</Link>
          <Link to="/verify-email">Resend verification email</Link>
        </AuthLinks>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthTitle>Email verified</AuthTitle>
      <AuthSubtitle>
        Your email is confirmed. Sign in to access your merchant workspace.
      </AuthSubtitle>

      <AuthSubmitButton as={Link} to="/login">
        Go to sign in
      </AuthSubmitButton>
    </AuthCard>
  );
}
