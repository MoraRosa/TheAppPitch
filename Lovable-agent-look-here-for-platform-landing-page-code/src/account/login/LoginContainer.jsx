/**
 * LoginContainer -- glue between useLogin (state + orchestration) and
 * LoginPage (presentation). Kept intentionally thin so the hook can be
 * exercised in isolation and the page can be reused by a future themed
 * variant without re-implementing the submit flow.
 */

import React from "react";
import { useLogin } from "./useLogin.js";
import LoginPage from "./LoginPage.jsx";

export default function LoginContainer() {
  const props = useLogin();
  return <LoginPage {...props} />;
}
