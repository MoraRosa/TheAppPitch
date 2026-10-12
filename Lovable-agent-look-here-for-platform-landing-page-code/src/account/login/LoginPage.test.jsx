/**
 * LoginPage -- input-attribute contract tests.
 *
 * Pins the autocomplete / type / name / required attributes on the
 * merchant sign-in email and password fields so password managers,
 * keychains, and accessibility tooling stay aligned with the buyer
 * and staff login surfaces (which use autoComplete="email" +
 * "current-password" on their email and password inputs respectively).
 *
 * Regression guard: a previous version of this page emitted
 * autoComplete="username" on the email field, which broke 1Password /
 * Safari Keychain autofill for the merchant surface while the buyer
 * and staff surfaces continued to work. These tests fail if anyone
 * regresses the attribute set.
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import LoginPage from "./LoginPage.jsx";

function renderPage(overrides = {}) {
  const props = {
    email: "",
    setEmail: () => {},
    password: "",
    setPassword: () => {},
    showPassword: false,
    setShowPassword: () => {},
    error: "",
    loading: false,
    isLockedOut: false,
    handleSubmit: (event) => event.preventDefault(),
    ...overrides,
  };

  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <LoginPage {...props} />
    </MemoryRouter>,
  );
}

describe("LoginPage -- input attribute contract", () => {
  it("renders the email input with type=email, name=email, autoComplete=email, and required", () => {
    renderPage();
    const email = screen.getByLabelText(/email address/i);
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute("name", "email");
    expect(email).toHaveAttribute("id", "email");
    expect(email).toHaveAttribute("autocomplete", "email");
    expect(email).toBeRequired();
  });

  it("renders the password input with name=password, autoComplete=current-password, and required", () => {
    renderPage();
    const password = screen.getByLabelText(/^password$/i);
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveAttribute("name", "password");
    expect(password).toHaveAttribute("id", "password");
    expect(password).toHaveAttribute("autocomplete", "current-password");
    expect(password).toBeRequired();
  });

  it("flips the password input type to text when showPassword is true", () => {
    renderPage({ showPassword: true });
    const password = screen.getByLabelText(/^password$/i);
    expect(password).toHaveAttribute("type", "text");
    expect(password).toHaveAttribute("autocomplete", "current-password");
  });
});
