/**
 * BillingCancelledPage -- presentational shell for the Stripe-cancel
 * return surface. Pure render from props supplied by
 * useBillingCancelled. Primary CTA retries the same plan via the
 * merchant CheckoutBounce; secondary CTA bounces to the business
 * switcher because "back to dashboard" is not always a valid
 * destination (subscribing for a second business means the user has
 * already used their free slot and has no usable fallback without
 * paying -- see the hook docstring).
 *
 * The retry button is hidden when the URL did not carry an intent so
 * we never render a button that cannot do anything.
 */

import React from "react";
import {
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  AuthSubmitButton,
  AuthLinks,
} from "../../shared/AuthForm.jsx";

export default function BillingCancelledPage({
  canRetry,
  handleRetry,
  handleManage,
}) {
  return (
    <AuthCard>
      <AuthTitle>Checkout cancelled</AuthTitle>
      <AuthSubtitle>
        No charge was made. You can try the same plan again, or jump over to
        manage your businesses.
      </AuthSubtitle>

      {canRetry && (
        <AuthSubmitButton
          type="button"
          onClick={handleRetry}
          data-testid="billing-cancelled-retry"
        >
          Try again
        </AuthSubmitButton>
      )}

      <AuthLinks>
        <button
          type="button"
          onClick={handleManage}
          data-testid="billing-cancelled-manage"
          style={LINK_BUTTON_STYLE}
        >
          Manage your businesses
        </button>
      </AuthLinks>
    </AuthCard>
  );
}

// Inline because AuthLinks renders <Link>s by default and we want the
// secondary CTA to call a hook-owned callback rather than navigate
// declaratively (the bounce target is a same-origin window.location
// assign so the hook can swap it without changing the page).
const LINK_BUTTON_STYLE = {
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  color: "var(--brand-color-primary600)",
  cursor: "pointer",
  textDecoration: "underline",
};
