/**
 * YourBusinessesContainer -- glue between useYourBusinesses (state +
 * orchestration) and YourBusinessesPage (presentation). Kept
 * intentionally thin so the hook can be exercised in isolation and the
 * page stays a pure render target. Mirrors SelectBusinessContainer.
 */

import React from "react";
import { useYourBusinesses } from "./useYourBusinesses.js";
import YourBusinessesPage from "./YourBusinessesPage.jsx";

export default function YourBusinessesContainer() {
  const props = useYourBusinesses();
  return <YourBusinessesPage {...props} />;
}
