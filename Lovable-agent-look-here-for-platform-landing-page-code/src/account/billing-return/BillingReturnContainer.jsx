/**
 * BillingReturnContainer -- glue between useBillingReturn (state +
 * orchestration) and BillingReturnPage (presentation). Kept
 * intentionally thin so the hook can be exercised in isolation.
 */

import React from "react";
import { useBillingReturn } from "./useBillingReturn.js";
import BillingReturnPage from "./BillingReturnPage.jsx";

export default function BillingReturnContainer() {
  const props = useBillingReturn();
  return <BillingReturnPage {...props} />;
}
