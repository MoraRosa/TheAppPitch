/**
 * VerifyEmailContainer -- glue between useVerifyEmail (state) and
 * VerifyEmailPage (presentation). Kept intentionally thin so the hook
 * can be exercised in isolation.
 */

import React from "react";
import { useVerifyEmail } from "./useVerifyEmail.js";
import VerifyEmailPage from "./VerifyEmailPage.jsx";

export default function VerifyEmailContainer() {
  const props = useVerifyEmail();
  return <VerifyEmailPage {...props} />;
}
