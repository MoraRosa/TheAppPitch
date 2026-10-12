/**
 * ForgotPasswordContainer -- glue between useForgotPassword (state) and
 * ForgotPasswordPage (presentation). Kept intentionally thin so the
 * hook can be exercised in isolation.
 */

import React from "react";
import { useForgotPassword } from "./useForgotPassword.js";
import ForgotPasswordPage from "./ForgotPasswordPage.jsx";

export default function ForgotPasswordContainer() {
  const props = useForgotPassword();
  return <ForgotPasswordPage {...props} />;
}
