/**
 * RegisterPage -- presentational shell for the merchant sign-up
 * surface. Pure render based on props from useRegister. All primitives
 * come from the shared AuthForm module so every auth surface (login,
 * forgot, reset, register, verify, select-business) shares one visual
 * system.
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
  AuthPasswordInput,
  AuthSubmitButton,
  AuthErrorBanner,
  AuthSuccessBanner,
  AuthLinks,
  AuthPasswordStrengthMeter,
} from "../../shared/AuthForm.jsx";

export default function RegisterPage({
  formData,
  fieldErrors,
  touched,
  error,
  success,
  loading,
  passwordStrength,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleChange,
  handleBlur,
  handleSubmit,
}) {
  const fieldError = (name) => touched[name] && fieldErrors[name];

  return (
    <AuthCard>
      <AuthTitle>Create your store</AuthTitle>
      <AuthSubtitle>Start selling in minutes.</AuthSubtitle>

      <AuthForm onSubmit={handleSubmit} noValidate>
        {error && (
          <AuthErrorBanner
            id="register-error"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </AuthErrorBanner>
        )}
        {success && (
          <AuthSuccessBanner role="status" aria-live="polite">
            {success}
          </AuthSuccessBanner>
        )}

        <AuthField>
          <AuthLabel htmlFor="storeName">Store name</AuthLabel>
          <AuthInput
            type="text"
            id="storeName"
            name="storeName"
            placeholder="My awesome store"
            value={formData.storeName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="organization"
            aria-invalid={Boolean(fieldError("storeName"))}
            aria-describedby={
              fieldError("storeName") ? "storeName-error" : undefined
            }
          />
          {fieldError("storeName") && (
            <AuthErrorBanner id="storeName-error" role="alert">
              {fieldErrors.storeName}
            </AuthErrorBanner>
          )}
        </AuthField>

        <AuthField>
          <AuthLabel htmlFor="email">Email address</AuthLabel>
          <AuthInput
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="email"
            aria-invalid={Boolean(fieldError("email"))}
            aria-describedby={fieldError("email") ? "email-error" : undefined}
          />
          {fieldError("email") && (
            <AuthErrorBanner id="email-error" role="alert">
              {fieldErrors.email}
            </AuthErrorBanner>
          )}
        </AuthField>

        <AuthField>
          <AuthLabel htmlFor="password">Password</AuthLabel>
          <AuthPasswordInput
            id="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="new-password"
            visible={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
            aria-invalid={Boolean(fieldError("password"))}
            aria-describedby={
              [
                fieldError("password") ? "password-error" : null,
                formData.password ? "password-strength" : null,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
          />
          {fieldError("password") && (
            <AuthErrorBanner id="password-error" role="alert">
              {fieldErrors.password}
            </AuthErrorBanner>
          )}
          {formData.password && (
            <AuthPasswordStrengthMeter
              id="password-strength"
              score={passwordStrength.score}
              strength={passwordStrength.strength}
              feedback={passwordStrength.feedback}
            />
          )}
        </AuthField>

        <AuthField>
          <AuthLabel htmlFor="confirmPassword">Confirm password</AuthLabel>
          <AuthPasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="new-password"
            visible={showConfirmPassword}
            onToggleVisibility={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            aria-invalid={Boolean(fieldError("confirmPassword"))}
            aria-describedby={
              fieldError("confirmPassword")
                ? "confirmPassword-error"
                : undefined
            }
          />
          {fieldError("confirmPassword") && (
            <AuthErrorBanner id="confirmPassword-error" role="alert">
              {fieldErrors.confirmPassword}
            </AuthErrorBanner>
          )}
        </AuthField>

        <AuthSubmitButton type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Creating account..." : "Create account"}
        </AuthSubmitButton>
      </AuthForm>

      <AuthLinks>
        <div>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </AuthLinks>
    </AuthCard>
  );
}
