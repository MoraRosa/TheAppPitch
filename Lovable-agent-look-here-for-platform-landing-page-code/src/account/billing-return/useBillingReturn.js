/**
 * useBillingReturn -- state for the post-checkout success landing
 * surface. Stripe-hosted checkout redirects the merchant here on a
 * successful charge; this hook reads the deep-link state the merchant
 * CheckoutBounce page encoded into the successUrl and exposes a
 * handleContinue() that bounces the user back to the originating
 * merchant host.
 *
 * The page deliberately does NOT poll the backend for subscription
 * activation. The Stripe webhook is the source of truth for the
 * subscription state -- by the time the user clicks "Continue" the
 * webhook either has or has not landed, and either way the merchant
 * billing page is where the live state is rendered. Phase E will add
 * the in-app "subscription active" badge that reads from the billing
 * API directly.
 *
 * The signup intent is intentionally cleared here: the funnel from
 * marketing pricing CTA -> register -> verify-email -> select-business
 * -> checkout-bounce -> Stripe succeeded, so the stashed intent has
 * done its job and any future bounce should start fresh.
 *
 * @module account/billing-return/useBillingReturn
 */

import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { platformMerchantUrl } from "@theapp/utils/platformUrl";
import { clearIntent } from "../_signupIntent.js";

const DEFAULT_DEST = "/admin/account?tab=subscription";

export function useBillingReturn() {
  const [searchParams] = useSearchParams();

  const dest = useMemo(() => {
    const raw = (searchParams.get("dest") || "").trim();
    return raw.startsWith("/") ? raw : DEFAULT_DEST;
  }, [searchParams]);

  const handleContinue = useCallback(() => {
    // Funnel completed -- drop the stashed signup intent so a future
    // visit to the pricing surface starts clean.
    clearIntent();
    if (typeof window === "undefined") return;
    // platformMerchantUrl clamps the path against an allowlist so a
    // tampered ?dest=evil.com query cannot turn this surface into an
    // open redirector.
    window.location.assign(platformMerchantUrl(dest));
  }, [dest]);

  return {
    handleContinue,
  };
}
