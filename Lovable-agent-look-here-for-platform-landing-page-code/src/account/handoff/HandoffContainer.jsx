/**
 * Cross-Host Merchant Handoff -- Account Consume Surface
 *
 * The reverse of apps/merchant/src/pages/Handoff.jsx. The merchant admin
 * host (admin.peakenterprise.ca), which holds the live session, mints a
 * one-shot handoff token bound to the "account-app" audience and hard-
 * navigates the browser to app.peakenterprise.ca/account/handoff#token=<JWT>.
 * This surface redeems it so a merchant landing on an account deep link
 * (e.g. the businesses manager) arrives already-authenticated instead of
 * bouncing to /login on a cold origin.
 *
 * Flow on mount (mirrors the merchant consume surface):
 *   1. Lift the token out of window.location.hash.
 *   2. Read the allowlisted post-consume path from the query string
 *      (?next=/businesses); default to /businesses.
 *   3. Strip the hash from the address bar immediately so the token
 *      never survives in history or a share.
 *   4. consumeHandoff(token, "account-app") -- the audience binding
 *      makes a token minted for the merchant host unredeemable here.
 *   5. On success navigate to the next path (replace: true so the back
 *      button does not land on the spent handoff URL).
 *   6. On failure render a brief explainer with a CTA back to sign-in.
 *
 * The single-network-dispatch guard (consumedRef) and the StrictMode
 * double-invoke protection match the merchant surface exactly.
 */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMerchantAuth } from "@theapp/merchant-auth";
import {
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  AuthSubmitButton,
} from "../../shared/AuthForm.jsx";

const STATUS = {
  PENDING: "pending",
  FAILED: "failed",
};

// Relative paths this consume surface will route to after redeeming the
// token. Mirrors the server-side ACCOUNT_POST_CONSUME_PATHS allowlist in
// handoffService.js so a tampered ?next= can never redirect elsewhere.
const NEXT_PATH_ALLOWLIST = Object.freeze(["/businesses"]);
const DEFAULT_NEXT_PATH = "/businesses";

const ACCOUNT_HANDOFF_AUDIENCE = "account-app";

function extractTokenFromHash() {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash || "";
  if (!hash.startsWith("#")) return null;
  const params = new URLSearchParams(hash.slice(1));
  const raw = params.get("token");
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function readNextPath() {
  if (typeof window === "undefined") return DEFAULT_NEXT_PATH;
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");
  return next && NEXT_PATH_ALLOWLIST.includes(next) ? next : DEFAULT_NEXT_PATH;
}

function clearHashFromHistory() {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}`);
}

export default function HandoffContainer() {
  const navigate = useNavigate();
  const { consumeHandoff } = useMerchantAuth();
  const [status, setStatus] = useState(STATUS.PENDING);
  const consumedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (consumedRef.current) return;
    consumedRef.current = true;

    const token = extractTokenFromHash();
    const nextPath = readNextPath();
    clearHashFromHistory();

    if (!token) {
      setStatus(STATUS.FAILED);
      return;
    }

    (async () => {
      const ok = await consumeHandoff(token, ACCOUNT_HANDOFF_AUDIENCE);
      if (ok) {
        navigate(nextPath, { replace: true });
      } else if (mountedRef.current) {
        setStatus(STATUS.FAILED);
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, [consumeHandoff, navigate]);

  if (status === STATUS.PENDING) {
    return <p>Loading...</p>;
  }

  return (
    <AuthCard role="alert">
      <AuthTitle>Sign-in link expired</AuthTitle>
      <AuthSubtitle>
        This link could not be redeemed. Sign-in links are valid for a short
        window and can only be used once. Please sign in again to continue.
      </AuthSubtitle>
      <AuthSubmitButton as={Link} to="/login">
        Sign in again
      </AuthSubmitButton>
    </AuthCard>
  );
}
