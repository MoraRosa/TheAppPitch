/**
 * RegisterContainer -- glue between useRegister (state + orchestration)
 * and RegisterPage (presentation). Kept intentionally thin so the hook
 * can be exercised in isolation and the page can be reused by a future
 * themed variant without re-implementing the submit flow.
 */

import React from "react";
import { useRegister } from "./useRegister.js";
import RegisterPage from "./RegisterPage.jsx";

export default function RegisterContainer() {
  const props = useRegister();
  return <RegisterPage {...props} />;
}
