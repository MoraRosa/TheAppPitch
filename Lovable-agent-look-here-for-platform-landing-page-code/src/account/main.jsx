/**
 * Account Entry Point (app.peakenterprise.ca)
 *
 * Authenticated merchant surface: signup, login, MFA, password reset,
 * email verify, billing, business switcher, account settings. All auth
 * goes through the existing `merchantAuth` Fastify plugin -- this
 * surface NEVER calls `platformAuth` (that is reserved for Peak staff
 * on apps/staff). See apps/platform/README.md for the naming
 * convention.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// The :root brand tokens are inlined into this entry's <head> at
// build/serve time by the platform-head-css Vite plugin (see
// vite.config.js), so styled-components' var(--brand-*) resolve on
// first paint with no JS -- nothing to inject here.

// URL parity: the dev server rewrites /account and /account/* to
// account.html (see apps/platform/vite.config.js); the single-project
// Cloudflare staging mirrors that with a _redirects rule. In the
// eventual split-host production layout (app.peakenterprise.ca) the account
// SPA lives at root. VITE_ACCOUNT_BASENAME selects the layout per
// deploy; default mirrors dev so local + .pages.dev work unconfigured.
const ACCOUNT_BASENAME = import.meta.env.VITE_ACCOUNT_BASENAME ?? "/account";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={ACCOUNT_BASENAME}>
    <App />
  </BrowserRouter>,
);
