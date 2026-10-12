/**
 * SelectBusinessContainer -- glue between useSelectBusiness (state +
 * orchestration) and SelectBusinessPage (presentation). Kept
 * intentionally thin so the hook can be exercised in isolation and the
 * page stays a pure render target.
 */

import React from "react";
import { useSelectBusiness } from "./useSelectBusiness.js";
import SelectBusinessPage from "./SelectBusinessPage.jsx";

export default function SelectBusinessContainer() {
  const props = useSelectBusiness();
  return <SelectBusinessPage {...props} />;
}
