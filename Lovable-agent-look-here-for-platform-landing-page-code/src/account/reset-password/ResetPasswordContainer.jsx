/**
 * ResetPasswordContainer -- glue between useResetPassword (state +
 * recovery-token extraction) and ResetPasswordPage (presentation).
 */

import React from "react";
import { useResetPassword } from "./useResetPassword.js";
import ResetPasswordPage from "./ResetPasswordPage.jsx";

export default function ResetPasswordContainer() {
  const props = useResetPassword();
  return <ResetPasswordPage {...props} />;
}
