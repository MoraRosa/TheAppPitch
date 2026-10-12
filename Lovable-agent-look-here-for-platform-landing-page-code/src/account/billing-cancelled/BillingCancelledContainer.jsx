/**
 * BillingCancelledContainer -- glue between useBillingCancelled (state
 * + orchestration) and BillingCancelledPage (presentation). Kept
 * intentionally thin so the hook can be exercised in isolation.
 */

import React from "react";
import { useBillingCancelled } from "./useBillingCancelled.js";
import BillingCancelledPage from "./BillingCancelledPage.jsx";

export default function BillingCancelledContainer() {
  const props = useBillingCancelled();
  return <BillingCancelledPage {...props} />;
}
