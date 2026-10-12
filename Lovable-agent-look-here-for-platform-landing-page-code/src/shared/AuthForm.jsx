/**
 * AuthForm
 *
 * Shared presentational primitives for every TheApp-branded auth
 * surface (sign in, forgot password, reset password, register, verify
 * email, select business). Every primitive references --brand-* tokens
 * exclusively -- no hardcoded hex codes, no magic spacing, no fallback
 * literals (per Section 7.2 of AI_MANDATORY_BRIEFING).
 *
 * Pages import from here and stay presentational; they never define
 * their own styled-components for shapes that already exist in this
 * module. If a new shape is needed, add it here so every surface
 * stays consistent.
 *
 * @module shared/AuthForm
 */

import React from "react";
import styled from "styled-components";

export const AuthCard = styled.section`
  max-width: var(--brand-size-panelMax);
  margin: var(--brand-space-12) auto;
  padding: var(--brand-space-8);
  background: var(--brand-color-neutral0);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral200);
  border-radius: var(--brand-radius-xl);
  box-shadow: var(--brand-shadow-card);
`;

export const AuthTitle = styled.h1`
  margin: 0 0 var(--brand-space-2);
  font-size: var(--brand-fontSize-2xl);
  color: var(--brand-color-neutral900);
`;

export const AuthSubtitle = styled.p`
  margin: 0 0 var(--brand-space-8);
  color: var(--brand-color-neutral500);
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-4);
`;

export const AuthField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-2);
`;

export const AuthLabel = styled.label`
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral700);
`;

export const AuthInput = styled.input`
  font: inherit;
  width: 100%;
  box-sizing: border-box;
  padding: var(--brand-space-3);
  padding-right: ${({ $withToggle }) =>
    $withToggle ? "2.25rem" : "var(--brand-space-3)"};
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral300);
  border-radius: var(--brand-radius-md);
  background: var(--brand-color-neutral0);
  color: var(--brand-color-neutral900);

  &:focus {
    outline: var(--brand-borderWidth-thick) solid var(--brand-color-primary500);
    outline-offset: var(--brand-focusRing-offset);
    border-color: var(--brand-color-primary500);
  }
`;

export const AuthSubmitButton = styled.button`
  font: inherit;
  padding: var(--brand-space-3) var(--brand-space-4);
  background: var(--brand-color-primary600);
  color: var(--brand-color-onPrimary);
  border: none;
  border-radius: var(--brand-radius-md);
  box-shadow: var(--brand-shadow-sm);
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition:
    background var(--brand-motion-fast) var(--brand-motion-ease),
    box-shadow var(--brand-motion-fast) var(--brand-motion-ease);

  &:hover:not(:disabled) {
    background: var(--brand-color-primary700);
    box-shadow: var(--brand-shadow-md);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const AuthErrorBanner = styled.div`
  padding: var(--brand-space-3);
  background: var(--brand-color-danger50);
  color: var(--brand-color-danger700);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-danger200);
  border-radius: var(--brand-radius-md);
  font-size: var(--brand-fontSize-sm);
`;

export const AuthSuccessBanner = styled.div`
  padding: var(--brand-space-3);
  background: var(--brand-color-success50);
  color: var(--brand-color-success700);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-success200);
  border-radius: var(--brand-radius-md);
  font-size: var(--brand-fontSize-sm);
`;

export const AuthLinks = styled.div`
  margin-top: var(--brand-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-2);
  text-align: center;
  font-size: var(--brand-fontSize-sm);

  a {
    color: var(--brand-color-primary600);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

const StrengthBar = styled.div`
  height: var(--brand-space-2);
  background: var(--brand-color-neutral200);
  border-radius: var(--brand-radius-full);
  overflow: hidden;
  margin-top: var(--brand-space-2);
`;

const StrengthFill = styled.div.attrs(({ $score }) => ({
  style: { width: `${Math.max(0, Math.min(100, $score))}%` },
}))`
  height: 100%;
  background: ${({ $tone }) =>
    $tone === "strong"
      ? "var(--brand-color-success500)"
      : $tone === "medium"
        ? "var(--brand-color-warning500)"
        : "var(--brand-color-danger500)"};
  transition: width 200ms ease;
`;

const StrengthLabel = styled.div`
  margin-top: var(--brand-space-2);
  font-size: var(--brand-fontSize-xs);
  font-weight: var(--brand-fontWeight-semibold);
  color: ${({ $tone }) =>
    $tone === "strong"
      ? "var(--brand-color-success700)"
      : $tone === "medium"
        ? "var(--brand-color-warning700)"
        : "var(--brand-color-danger700)"};
`;

const StrengthFeedback = styled.ul`
  margin: var(--brand-space-2) 0 0 var(--brand-space-4);
  padding: 0;
  font-size: var(--brand-fontSize-xs);
  color: var(--brand-color-neutral500);
  list-style: disc;
`;

const STRENGTH_COPY = {
  strong: "Strong password",
  medium: "Medium password",
  weak: "Weak password",
};

/**
 * Password strength meter. Pure presentation around a strength snapshot
 * shaped { score: 0..100, strength: "weak"|"medium"|"strong", feedback: string[] }.
 * Owns nothing -- the hook decides when to compute and when to render.
 */
export function AuthPasswordStrengthMeter({ score, strength, feedback, id }) {
  const label = STRENGTH_COPY[strength] || STRENGTH_COPY.weak;
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      <StrengthBar>
        <StrengthFill $score={score} $tone={strength} />
      </StrengthBar>
      <StrengthLabel
        $tone={strength}
        aria-label={`Password strength: ${strength}`}
      >
        {label}
      </StrengthLabel>
      {feedback && feedback.length > 0 && (
        <StrengthFeedback aria-label="Password requirements">
          {feedback.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </StrengthFeedback>
      )}
    </div>
  );
}

const PasswordWrap = styled.div`
  position: relative;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: var(--brand-space-3);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--brand-color-neutral500);
  padding: var(--brand-space-2);
  display: flex;
  align-items: center;

  &:hover {
    color: var(--brand-color-neutral700);
  }
`;

/**
 * Password input with an inline show/hide toggle. The wrapping <button>
 * carries the accessible label; the SVGs are aria-hidden because
 * assistive tech consumes the button's aria-label.
 */
export function AuthPasswordInput({
  visible,
  onToggleVisibility,
  showLabel = "Show password",
  hideLabel = "Hide password",
  ...inputProps
}) {
  return (
    <PasswordWrap>
      <AuthInput
        {...inputProps}
        type={visible ? "text" : "password"}
        $withToggle
      />
      <ToggleButton
        type="button"
        onClick={onToggleVisibility}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </ToggleButton>
    </PasswordWrap>
  );
}

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 4.22-5.11" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 7 10 7a18.6 18.6 0 0 1-3.17 4.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
