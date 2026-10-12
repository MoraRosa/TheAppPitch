/**
 * MarketingLayout
 *
 * Marketing-specific composition of BrandLayout. The layout slot wires
 * the marketing nav, the cross-host "Sign in" link, and the marketing
 * footer nav, then renders the matched child route via <Outlet />.
 *
 * BrandLayout itself stays surface-agnostic so the Phase 5 account
 * shell can mount its own controls inside the same chrome.
 *
 * @module marketing/MarketingLayout
 */

import React from "react";
import { Link, Outlet } from "react-router-dom";
import BrandLayout from "../shared/BrandLayout.jsx";
import MarketingFooterNav from "./MarketingFooterNav.jsx";

function MarketingNav() {
  return (
    <>
      <Link to="/pricing">Pricing</Link>
      <Link to="/trust">Trust</Link>
      <Link to="/docs">Docs</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/about">About</Link>
    </>
  );
}

function MarketingHeaderRight() {
  // Cross-host link to the merchant account sign-in surface. Hard <a>
  // (not Link) because account is a separate SPA mount. The href is
  // env-driven so the same build serves both single-project staging
  // (e.g. /account/login on theapp-platform.pages.dev) and the eventual
  // split-host production layout (https://app.peakenterprise.ca/login). Falls
  // back to the dev /account/login path when the var is unset.
  const signInHref =
    import.meta.env.VITE_PLATFORM_ACCOUNT_LOGIN_URL ?? "/account/login";
  return <a href={signInHref}>Sign in</a>;
}

export default function MarketingLayout() {
  return (
    <BrandLayout
      nav={<MarketingNav />}
      headerRight={<MarketingHeaderRight />}
      footerNav={<MarketingFooterNav />}
    >
      <Outlet />
    </BrandLayout>
  );
}
