/**
 * BillingReturnPage -- presentational shell for the Stripe success
 * return surface. Pure render from props supplied by useBillingReturn.
 * Visual primitives come from the shared AuthForm module so the page
 * shares the AuthCard / AuthTitle / AuthSubmitButton treatment of
 * every other auth surface on the platform host.
 */

import React from "react";
import {
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  AuthSubmitButton,
} from "../../shared/AuthForm.jsx";

export default function BillingReturnPage({ handleContinue }) {
  return (
    <AuthCard>
      <AuthTitle>Subscription confirmed</AuthTitle>
      <AuthSubtitle>
        Thanks for subscribing. Your payment has been received and your plan
        will be active shortly. Continue to your dashboard to pick up where you
        left off.
      </AuthSubtitle>

      <AuthSubmitButton
        type="button"
        onClick={handleContinue}
        data-testid="billing-return-continue"
      >
        Continue to your dashboard
      </AuthSubmitButton>
    </AuthCard>
  );
}
