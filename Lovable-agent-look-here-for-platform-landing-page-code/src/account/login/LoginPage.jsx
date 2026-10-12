/**
 * LoginPage -- presentational shell for the merchant sign-in surface.
 * Pure render based on props from useLogin. All primitives come from
 * the shared AuthForm module so every auth surface (login, forgot,
 * reset, register, verify, select-business) shares one visual system.
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  AuthForm,
  AuthField,
  AuthLabel,
  AuthInput,
  AuthPasswordInput,
  AuthSubmitButton,
  AuthErrorBanner,
  AuthSuccessBanner,
  AuthLinks,
} from "../../shared/AuthForm.jsx";

export default function LoginPage({
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
}) {
  // One-shot status banner carried in router state by surfaces that
  // navigate here on success (e.g. /reset-password after a successful
  // password change). Same-host nav preserves location.state across the
  // hop; cross-host hops drop it.
  const location = useLocation();
  const statusMessage = location.state?.message;

  return (
    <AuthCard>
      <AuthTitle>Sign in</AuthTitle>
      <AuthSubtitle>Welcome back. Sign in to manage your store.</AuthSubtitle>

      <AuthForm onSubmit={handleSubmit} noValidate>
        {statusMessage && (
          <AuthSuccessBanner role="status" aria-live="polite">
            {statusMessage}
          </AuthSuccessBanner>
        )}
        {error && (
          <AuthErrorBanner id="login-error" role="alert" aria-live="assertive">
            {error}
          </AuthErrorBanner>
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
            aria-describedby={error ? "login-error" : undefined}
          />
        </AuthField>

        <AuthField>
          <AuthLabel htmlFor="password">Password</AuthLabel>
          <AuthPasswordInput
            id="password"
            name="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            aria-describedby={error ? "login-error" : undefined}
            visible={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
          />
        </AuthField>

        <AuthSubmitButton
          type="submit"
          disabled={loading || isLockedOut}
          aria-busy={loading}
        >
          {loading
            ? "Signing in..."
            : isLockedOut
              ? "Temporarily locked"
              : "Sign in"}
        </AuthSubmitButton>
      </AuthForm>

      <AuthLinks>
        <Link to="/forgot-password">Forgot password?</Link>
        <div>
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </div>
      </AuthLinks>
    </AuthCard>
  );
}
