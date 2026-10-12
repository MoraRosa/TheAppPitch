/**
 * useSelectBusiness -- state machine + orchestration for the merchant
 * business selection / first-business-create trust surface.
 *
 * Hosted on the platform account host (app.peakenterprise.ca) and reached
 * either right after sign-in (when the user has 0 or 2+ memberships)
 * or via the "Switch business" link in the themed merchant TopBar.
 *
 * Owns:
 *   - Initial fetch of /api/v1/auth/my-businesses + /api/v1/auth/business-quota
 *   - Create-form state (name, businessEmail) and submission gating
 *   - Switch state (per-row in-flight tracking, separate error channel
 *     so a switch failure does not blank the create form)
 *   - Post-success orchestration: issue a one-shot handoff token and
 *     redirect cross-host to admin.peakenterprise.ca/handoff so the merchant
 *     host can seat the session and land the user in /admin.
 *
 * The platform NEVER renders /admin: every successful select/create
 * exits this surface via window.location.assign(handoffUrl). Sign-out
 * goes to /login on the same host (account SPA).
 *
 * @module account/select-business/useSelectBusiness
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@theapp/api-client";
import {
  createBusiness,
  getBusinessQuota,
  listMyBusinesses,
  switchActiveBusiness,
} from "@theapp/merchant-auth/businesses";
import { useMerchantAuth } from "@theapp/merchant-auth";
import { BUSINESS_QUOTA } from "@theapp/config";
import { appendIntentToUrl, loadIntent } from "../_signupIntent.js";

function extractErrorMessage(err, fallback) {
  if (!err) return fallback;
  const backendMessage = err?.data?.message || err?.data?.error;
  if (backendMessage) return backendMessage;
  if (err?.message) return err.message;
  return fallback;
}

async function issueHandoffAndAssign() {
  const res = await apiClient.post("/api/v1/auth/merchant/handoff/issue", {});
  if (!res?.success || !res?.data?.handoffUrl) {
    throw new Error(res?.message || "Could not start your merchant session.");
  }
  // Append the signup intent (if any) so the cross-host hop carries
  // plan/price/interval to the merchant CheckoutBounce page. The
  // handoff token rides the URL fragment; appendIntentToUrl preserves
  // the fragment while mutating only the query string.
  const handoffUrl = appendIntentToUrl(res.data.handoffUrl, loadIntent());
  window.location.assign(handoffUrl);
}

export function useSelectBusiness() {
  const navigate = useNavigate();
  const { currentUser, logout } = useMerchantAuth();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [quota, setQuota] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [switchingId, setSwitchingId] = useState(null);
  const [switchError, setSwitchError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refreshList = useCallback(async () => {
    setLoading(true);
    setListError(null);
    try {
      const data = await listMyBusinesses();
      if (mountedRef.current) setBusinesses(data);
      return data;
    } catch (err) {
      if (mountedRef.current) setListError(err);
      throw err;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  // Quota failures are non-fatal -- the server is the source of truth
  // for the cap; without a snapshot the UI just hides the counter and
  // lets the create endpoint surface a 409 if necessary.
  const refreshQuota = useCallback(async () => {
    try {
      const snapshot = await getBusinessQuota();
      if (mountedRef.current) setQuota(snapshot);
      return snapshot;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    refreshList().catch(() => {});
    refreshQuota();
  }, [refreshList, refreshQuota]);

  // Clear stale switch errors when the list mutates (e.g. after refresh)
  // so a previous failure message does not linger above a fresh picker.
  useEffect(() => {
    setSwitchError(null);
  }, [businesses]);

  const hasBusinesses = businesses.length > 0;
  const initialLoad = loading && !hasBusinesses;
  const atCap = Boolean(quota && quota.remaining <= 0);
  const showQuotaCounter = Boolean(
    quota && quota.remaining <= BUSINESS_QUOTA.WARN_AT_REMAINING,
  );
  const createFormVisible =
    (!initialLoad && !hasBusinesses && !listError && !atCap) || showCreateForm;

  const handleCreate = useCallback(
    async (event) => {
      event.preventDefault();
      setFormError(null);

      const trimmedName = name.trim();
      if (!trimmedName) {
        setFormError("Business name is required.");
        return;
      }

      const payload = { name: trimmedName };
      const trimmedEmail = businessEmail.trim();
      if (trimmedEmail) payload.businessEmail = trimmedEmail;

      setSubmitting(true);
      try {
        await createBusiness(payload);
        // Cross-host hop seats the new membership on admin.peakenterprise.ca.
        // No local refresh -- the merchant /handoff consume will pull a
        // fresh session whose active_tenant_id is the new business.
        await issueHandoffAndAssign();
      } catch (err) {
        if (mountedRef.current) {
          setFormError(
            extractErrorMessage(
              err,
              "We could not create your business. Please try again.",
            ),
          );
        }
        // 409 BUSINESS_QUOTA_EXCEEDED races (e.g. another tab created a
        // business in parallel) -- pull a fresh snapshot so the at-cap
        // notice replaces the form on the next render.
        refreshQuota();
      } finally {
        if (mountedRef.current) setSubmitting(false);
      }
    },
    [name, businessEmail, refreshQuota],
  );

  const handleSwitch = useCallback(
    async (tenantId) => {
      if (!tenantId || switchingId) return;
      setSwitchError(null);
      setSwitchingId(tenantId);
      try {
        await switchActiveBusiness(tenantId);
        await issueHandoffAndAssign();
      } catch (err) {
        if (mountedRef.current) {
          setSwitchError(
            extractErrorMessage(
              err,
              "We could not switch to that business. Please try again.",
            ),
          );
          setSwitchingId(null);
        }
      }
    },
    [switchingId],
  );

  const handleRefresh = useCallback(() => {
    setSwitchError(null);
    refreshList().catch(() => {});
  }, [refreshList]);

  const handleShowCreate = useCallback(() => setShowCreateForm(true), []);
  const handleCancelCreate = useCallback(() => setShowCreateForm(false), []);

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
    } catch {
      // logout() already clears local state on failure; the redirect
      // below is the user-visible recovery either way.
    }
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  return {
    currentUser,
    businesses,
    quota,
    loading,
    listError,
    switchingId,
    switchError,
    hasBusinesses,
    atCap,
    showQuotaCounter,
    showCreateForm,
    createFormVisible,
    name,
    setName,
    businessEmail,
    setBusinessEmail,
    submitting,
    formError,
    handleCreate,
    handleSwitch,
    handleRefresh,
    handleShowCreate,
    handleCancelCreate,
    handleSignOut,
  };
}

export default useSelectBusiness;
