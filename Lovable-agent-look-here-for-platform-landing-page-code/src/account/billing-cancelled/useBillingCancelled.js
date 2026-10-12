/**
 * useBillingCancelled -- state for the post-checkout cancellation
 * landing surface. Stripe-hosted checkout redirects the merchant here
 * when they back out of the payment page; this hook reads the deep
 * link state the merchant CheckoutBounce page encoded into the
 * cancelUrl and exposes two affordances:
 *
 *   - handleRetry()  -- bounces back into admin.peakenterprise.ca
 *                       /checkout-bounce with the same plan / interval
 *                       / currency, which mints a fresh Stripe Session
 *                       and re-redirects. Stripe's hosted page has no
 *                       "try again" of its own; landing here IS the
 *                       cancel action, so the retry button has to live
 *                       on our side.
 *   - handleManage() -- bounces to the platform business switcher.
 *                       Always safe regardless of free-quota state:
 *                       if they have a free-tier business they can pick
 *                       it; if they hit the free cap and need to pay,
 *                       the page guides them; the dashboard is NOT a
 *                       safe destination because subscribing for a
 *                       second / third / fourth business implies the
 *                       free slot is taken so there is no fallback
 *                       business they can use without paying.
 *
 * The stashed signup intent is preserved -- the user may complete the
 * retry from this surface, and the merchant CheckoutBounce page reads
 * it directly off the URL anyway.
 *
 * @module account/billing-cancelled/useBillingCancelled
 */

import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { platformMerchantUrl } from "@theapp/utils/platformUrl";
import {
  readIntentFromParams,
  intentToQueryEntries,
} from "../_signupIntent.js";

const RETRY_PATH = "/checkout-bounce";
const MANAGE_PATH = "/select-business";

export function useBillingCancelled() {
  const [searchParams] = useSearchParams();

  // The retry intent is reconstructed from URL params the merchant
  // CheckoutBounce page encoded into the cancelUrl. We deliberately
  // do not read sessionStorage here because the user is on the
  // platform-account origin and the intent stash from registration
  // may already have been cleared by the success path on a previous
  // attempt; the URL is the authoritative carry-through.
  const intent = useMemo(
    () => readIntentFromParams(searchParams),
    [searchParams],
  );

  const canRetry = Boolean(intent);

  const handleRetry = useCallback(() => {
    if (typeof window === "undefined" || !intent) return;
    const entries = intentToQueryEntries(intent);
    const qs = new URLSearchParams(entries).toString();
    const target = qs ? `${RETRY_PATH}?${qs}` : RETRY_PATH;
    // platformMerchantUrl clamps the path against an allowlist so a
    // tampered query string cannot redirect off-host.
    window.location.assign(platformMerchantUrl(target));
  }, [intent]);

  const handleManage = useCallback(() => {
    if (typeof window === "undefined") return;
    // Same-origin navigation -- platform-account already owns
    // /select-business so no cross-host helper is needed.
    window.location.assign(MANAGE_PATH);
  }, []);

  return {
    canRetry,
    handleRetry,
    handleManage,
  };
}
