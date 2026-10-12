/**
 * EmailVerifiedContainer -- glue between useEmailVerified (state) and
 * EmailVerifiedPage (presentation). Kept intentionally thin so the
 * hook can be exercised in isolation.
 */

import React from "react";
import { useEmailVerified } from "./useEmailVerified.js";
import EmailVerifiedPage from "./EmailVerifiedPage.jsx";

export default function EmailVerifiedContainer() {
  const props = useEmailVerified();
  return <EmailVerifiedPage {...props} />;
}
