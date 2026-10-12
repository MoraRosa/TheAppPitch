/**
 * Account App Root (app.peakenterprise.ca)
 *
 * Hosts the merchant account surface: sign-in, sign-up, password reset,
 * email verification, business selection, and billing. All auth state
 * lives in MerchantAuthProvider from @theapp/merchant-auth -- the same
 * provider mounted on apps/merchant so the two surfaces share an
 * identical context shape.
 *
 * TenantProvider is intentionally NOT mounted here: app.peakenterprise.ca is
 * account-scoped, not tenant-scoped. Tenant context is established on
 * the merchant host (admin.peakenterprise.ca) after the cross-host handoff.
 */

import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MerchantAuthProvider } from "@theapp/merchant-auth";
import BrandLayout from "../shared/BrandLayout.jsx";

const LoginContainer = lazy(() => import("./login/LoginContainer.jsx"));
const RegisterContainer = lazy(
  () => import("./register/RegisterContainer.jsx"),
);
const ForgotPasswordContainer = lazy(
  () => import("./forgot-password/ForgotPasswordContainer.jsx"),
);
const ResetPasswordContainer = lazy(
  () => import("./reset-password/ResetPasswordContainer.jsx"),
);
const VerifyEmailContainer = lazy(
  () => import("./verify-email/VerifyEmailContainer.jsx"),
);
const EmailVerifiedContainer = lazy(
  () => import("./email-verified/EmailVerifiedContainer.jsx"),
);
const SelectBusinessContainer = lazy(
  () => import("./select-business/SelectBusinessContainer.jsx"),
);
const YourBusinessesContainer = lazy(
  () => import("./businesses/YourBusinessesContainer.jsx"),
);
// Reverse cross-host handoff consume surface. The merchant admin host
// mints an "account-app"-audience token and lands the browser here so a
// merchant following an account deep link arrives already-authenticated
// instead of bouncing to /login on a cold origin.
const HandoffContainer = lazy(() => import("./handoff/HandoffContainer.jsx"));
// Stripe-hosted checkout return surfaces. The merchant CheckoutBounce
// page encodes deep-link state into the success/cancel URLs so we can
// land returns on the account host (stable session, central traffic
// control) instead of bouncing them straight into admin.peakenterprise.ca
// where a stale session would force a re-login mid-funnel.
const BillingReturnContainer = lazy(
  () => import("./billing-return/BillingReturnContainer.jsx"),
);
const BillingCancelledContainer = lazy(
  () => import("./billing-cancelled/BillingCancelledContainer.jsx"),
);

// Password-reset recovery emails point Supabase back at this surface.
// Derived from the account basename so it stays correct in every
// deploy layout (see apps/platform/src/account/main.jsx).
const ACCOUNT_BASENAME = import.meta.env.VITE_ACCOUNT_BASENAME ?? "/account";
const PASSWORD_RESET_PATH = `${
  ACCOUNT_BASENAME === "/" ? "" : ACCOUNT_BASENAME
}/reset-password`;

function AccountHeaderRight() {
  // Back-link to the marketing site. Replaced with the active-account
  // menu (avatar, sign out, business switcher) once the moved auth
  // pages land on this surface. Env-driven for the same reason as the
  // sign-in href in MarketingLayout.
  const marketingHref = import.meta.env.VITE_PLATFORM_MARKETING_URL ?? "/";
  return <a href={marketingHref}>Marketing</a>;
}

export default function App() {
  return (
    <MerchantAuthProvider passwordResetPath={PASSWORD_RESET_PATH}>
      <BrandLayout headerRight={<AccountHeaderRight />}>
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            {/* No standalone landing surface yet -- unauthenticated
                requests start at sign-in and authenticated sessions
                are handed off cross-host into admin.peakenterprise.ca. */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginContainer />} />
            <Route path="/register" element={<RegisterContainer />} />
            <Route
              path="/forgot-password"
              element={<ForgotPasswordContainer />}
            />
            <Route
              path="/reset-password"
              element={<ResetPasswordContainer />}
            />
            <Route path="/verify-email" element={<VerifyEmailContainer />} />
            <Route
              path="/email-verified"
              element={<EmailVerifiedContainer />}
            />
            <Route
              path="/select-business"
              element={<SelectBusinessContainer />}
            />
            <Route path="/businesses" element={<YourBusinessesContainer />} />
            <Route path="/handoff" element={<HandoffContainer />} />
            <Route
              path="/billing/return"
              element={<BillingReturnContainer />}
            />
            <Route
              path="/billing/cancelled"
              element={<BillingCancelledContainer />}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrandLayout>
    </MerchantAuthProvider>
  );
}
