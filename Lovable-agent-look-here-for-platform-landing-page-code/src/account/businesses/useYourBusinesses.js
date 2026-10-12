/**
 * useYourBusinesses -- state machine + orchestration for the platform
 * Your Businesses identity surface.
 *
 * Hosted on the platform account host (app.peakenterprise.ca/account/businesses)
 * and reachable from the merchant TopBar's "Manage businesses" link or
 * directly. Owns the cross-business list, the leave-flow, the incoming
 * ownership-transfer banner (accept / decline), and the cross-host
 * handoff used to switch the active tenant.
 *
 * Composes:
 *   - useBusinesses (list + leave + session refresh)
 *   - useOwnershipTransfers(null) for the incoming list (recipient side)
 *   - useReverifyPassword for the accept fresh-auth gate
 *   - useLeaveBusinessFlow for the leave-modal chrome
 *
 * Switching goes through the same /handoff/issue pattern as the
 * SelectBusiness surface so the merchant host seats the new active
 * tenant; the platform host never renders /admin.
 *
 * @module account/businesses/useYourBusinesses
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@theapp/api-client";
import { switchActiveBusiness } from "@theapp/merchant-auth/businesses";
import { useMerchantAuth } from "@theapp/merchant-auth";
import {
  useBusinesses,
  useOwnershipTransfers,
  useReverifyPassword,
  useLeaveBusinessFlow,
} from "@theapp/shared/hooks/businesses";

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
  window.location.assign(res.data.handoffUrl);
}

export function useYourBusinesses() {
  const navigate = useNavigate();
  const { currentUser, logout, refreshMemberships } = useMerchantAuth();

  const businessesApi = useBusinesses();
  const transfersApi = useOwnershipTransfers(null);
  const { verify } = useReverifyPassword();
  const leaveFlow = useLeaveBusinessFlow({ leave: businessesApi.leave });

  const [switchingId, setSwitchingId] = useState(null);
  const [switchError, setSwitchError] = useState(null);

  // Recipient-side accept gate: an inline (no separate hook) reverify ->
  // accept(invitationId) sequence. Kept here rather than as a fourth
  // flow hook because the orchestration is a five-line compose.
  const [pendingAcceptId, setPendingAcceptId] = useState(null);
  const [acceptSubmitting, setAcceptSubmitting] = useState(false);
  const [acceptError, setAcceptError] = useState(null);

  // Per-invitation decline error, so a failure on one row does not
  // smear an error message across the whole banner.
  const [declineErrorById, setDeclineErrorById] = useState({});
  const [busyInviteId, setBusyInviteId] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setSwitchError(null);
  }, [businessesApi.businesses]);

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
    businessesApi.refresh().catch(() => {});
    transfersApi.refresh().catch(() => {});
  }, [businessesApi, transfersApi]);

  const handleOpenLeave = useCallback(
    (b) => {
      leaveFlow.open({ tenantId: b.tenantId, businessName: b.name });
    },
    [leaveFlow],
  );

  const handleConfirmLeave = useCallback(async () => {
    try {
      await leaveFlow.confirm();
    } catch {
      // Error already captured into leaveFlow.error; swallow so the
      // promise rejection does not surface as an unhandled rejection.
    }
  }, [leaveFlow]);

  const openAcceptGate = useCallback((invitationId) => {
    setPendingAcceptId(invitationId);
    setAcceptError(null);
  }, []);

  const closeAcceptGate = useCallback(() => {
    if (acceptSubmitting) return;
    setPendingAcceptId(null);
    setAcceptError(null);
  }, [acceptSubmitting]);

  const confirmAccept = useCallback(
    async (password) => {
      if (!pendingAcceptId || acceptSubmitting || !password) return;
      setAcceptSubmitting(true);
      setAcceptError(null);
      try {
        await verify(password);
        await transfersApi.accept(pendingAcceptId);
        // Membership set changed; keep the local list and the global
        // session in sync so the new business appears immediately.
        await businessesApi.refresh().catch(() => {});
        await refreshMemberships().catch(() => {});
        if (mountedRef.current) {
          setPendingAcceptId(null);
        }
      } catch (err) {
        if (mountedRef.current) {
          setAcceptError(
            extractErrorMessage(err, "Failed to accept transfer."),
          );
        }
      } finally {
        if (mountedRef.current) setAcceptSubmitting(false);
      }
    },
    [
      pendingAcceptId,
      acceptSubmitting,
      verify,
      transfersApi,
      businessesApi,
      refreshMemberships,
    ],
  );

  const handleDecline = useCallback(
    async (invitationId) => {
      if (!invitationId || busyInviteId) return;
      setBusyInviteId(invitationId);
      setDeclineErrorById((prev) => ({ ...prev, [invitationId]: null }));
      try {
        await transfersApi.decline({ invitationId });
      } catch (err) {
        if (mountedRef.current) {
          setDeclineErrorById((prev) => ({
            ...prev,
            [invitationId]: extractErrorMessage(
              err,
              "Failed to decline transfer.",
            ),
          }));
        }
      } finally {
        if (mountedRef.current) setBusyInviteId(null);
      }
    },
    [busyInviteId, transfersApi],
  );

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
    businesses: businessesApi.businesses,
    loading: businessesApi.loading,
    listError: businessesApi.error,
    switchingId,
    switchError,
    incoming: transfersApi.incoming,
    transfersLoading: transfersApi.loading,
    transfersError: transfersApi.error,
    busyInviteId,
    declineErrorById,
    pendingAcceptId,
    acceptSubmitting,
    acceptError,
    leaveTarget: leaveFlow.target,
    leaveOpen: leaveFlow.isOpen,
    leaveSubmitting: leaveFlow.submitting,
    leaveError: leaveFlow.error,
    handleSwitch,
    handleRefresh,
    handleOpenLeave,
    handleCloseLeave: leaveFlow.close,
    handleConfirmLeave,
    openAcceptGate,
    closeAcceptGate,
    confirmAccept,
    handleDecline,
    handleSignOut,
  };
}

export default useYourBusinesses;
