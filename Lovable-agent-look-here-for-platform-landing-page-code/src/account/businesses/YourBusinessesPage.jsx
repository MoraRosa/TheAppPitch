/**
 * YourBusinessesPage -- presentational shell for the platform identity
 * surface that lists every business the signed-in merchant belongs to
 * and exposes the cross-business actions (switch, leave, accept /
 * decline pending ownership invitations).
 *
 * Pure render based on props from useYourBusinesses. Visual primitives
 * come from the shared AuthForm module so this page shares the
 * AuthCard / AuthTitle / AuthErrorBanner treatment of every other
 * identity surface on the platform host (login, register, forgot,
 * select-business, etc).
 *
 * Modals (LeaveConfirmModal, ReverifyForAcceptModal) are inlined as
 * page-internal components: the platform host has no shared Modal
 * primitive yet, and the two modal shapes here are bespoke to this
 * surface. Both are rendered inside the AuthCard tree but with fixed
 * positioning, matching the pattern used by the themed merchant modals.
 */

import React, { useState } from "react";
import styled from "styled-components";
import {
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  AuthField,
  AuthLabel,
  AuthInput,
  AuthSubmitButton,
  AuthErrorBanner,
} from "../../shared/AuthForm.jsx";

const SectionTitle = styled.h2`
  margin: var(--brand-space-6) 0 var(--brand-space-3);
  font-size: var(--brand-fontSize-lg);
  color: var(--brand-color-neutral900);
`;

const RowList = styled.ul`
  list-style: none;
  margin: 0 0 var(--brand-space-4);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-2);
`;

const RowCard = styled.li`
  display: flex;
  align-items: center;
  gap: var(--brand-space-3);
  padding: var(--brand-space-3) var(--brand-space-4);
  background: var(--brand-color-neutral0);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral200);
  border-radius: var(--brand-radius-md);

  &[aria-current="true"] {
    border-color: var(--brand-color-primary500);
    background: var(--brand-color-primary50);
  }
`;

const RowMain = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

const RowName = styled.span`
  display: block;
  font-weight: var(--brand-fontWeight-semibold);
  color: var(--brand-color-neutral900);
`;

const RowMeta = styled.span`
  display: block;
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral500);
`;

const RowActions = styled.div`
  display: flex;
  gap: var(--brand-space-2);
  flex-shrink: 0;
`;

const PrimaryAction = styled.button`
  font: inherit;
  padding: var(--brand-space-2) var(--brand-space-3);
  background: var(--brand-color-primary600);
  color: var(--brand-color-neutral0);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-primary600);
  border-radius: var(--brand-radius-md);
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--brand-color-primary700);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryAction = styled.button`
  font: inherit;
  padding: var(--brand-space-2) var(--brand-space-3);
  background: var(--brand-color-neutral0);
  color: var(--brand-color-neutral700);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral300);
  border-radius: var(--brand-radius-md);
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--brand-color-primary500);
    color: var(--brand-color-primary600);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DangerAction = styled(SecondaryAction)`
  color: var(--brand-color-danger700);
  border-color: var(--brand-color-danger200);

  &:hover:not(:disabled) {
    border-color: var(--brand-color-danger500);
    color: var(--brand-color-danger700);
    background: var(--brand-color-danger50);
  }
`;

const StatusText = styled.p`
  margin: 0 0 var(--brand-space-4);
  color: var(--brand-color-neutral700);
`;

const Footer = styled.div`
  margin-top: var(--brand-space-6);
  display: flex;
  justify-content: flex-end;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--brand-space-4);
`;

const ModalCard = styled.div`
  background: var(--brand-color-neutral0);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral200);
  border-radius: var(--brand-radius-lg);
  box-shadow: var(--brand-shadow-lg);
  padding: var(--brand-space-6);
  width: 100%;
  max-width: var(--brand-size-panelMax);
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-3);
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--brand-space-2);
  margin-top: var(--brand-space-2);
`;

const InviteList = styled.ul`
  list-style: none;
  margin: 0 0 var(--brand-space-4);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-3);
`;

const InviteCard = styled.li`
  padding: var(--brand-space-4);
  background: var(--brand-color-primary50);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-primary500);
  border-radius: var(--brand-radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-2);
`;

const InviteMeta = styled.dl`
  margin: 0;
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--brand-space-1) var(--brand-space-3);

  dt {
    font-size: var(--brand-fontSize-xs);
    font-weight: var(--brand-fontWeight-semibold);
    color: var(--brand-color-neutral500);
    text-transform: uppercase;
    letter-spacing: var(--brand-letterSpacing-wider);
  }
  dd {
    margin: 0;
    font-size: var(--brand-fontSize-sm);
    color: var(--brand-color-neutral900);
  }
`;

function extractErrorMessage(err, fallback) {
  if (!err) return fallback;
  const backendMessage = err?.data?.message || err?.data?.error;
  if (backendMessage) return backendMessage;
  if (err?.message) return err.message;
  return fallback;
}

export default function YourBusinessesPage({
  currentUser,
  businesses,
  loading,
  listError,
  switchingId,
  switchError,
  incoming,
  busyInviteId,
  declineErrorById,
  pendingAcceptId,
  acceptSubmitting,
  acceptError,
  leaveTarget,
  leaveOpen,
  leaveSubmitting,
  leaveError,
  handleSwitch,
  handleRefresh,
  handleOpenLeave,
  handleCloseLeave,
  handleConfirmLeave,
  openAcceptGate,
  closeAcceptGate,
  confirmAccept,
  handleDecline,
  handleSignOut,
}) {
  const hasBusinesses = businesses.length > 0;
  const initialLoading = loading && !hasBusinesses;
  const showListError = listError && !hasBusinesses;
  const hasIncoming = incoming && incoming.length > 0;

  return (
    <AuthCard
      as="main"
      id="main-content"
      aria-labelledby="your-businesses-heading"
    >
      <AuthTitle id="your-businesses-heading">Your businesses</AuthTitle>
      <AuthSubtitle>
        Signed in
        {currentUser?.email ? ` as ${currentUser.email}` : ""}. Switch between
        businesses, leave one you no longer need, or respond to ownership
        invitations.
      </AuthSubtitle>

      {hasIncoming && (
        <PendingInvitations
          incoming={incoming}
          busyInviteId={busyInviteId}
          declineErrorById={declineErrorById}
          onAccept={openAcceptGate}
          onDecline={handleDecline}
        />
      )}

      <SectionTitle>Businesses you belong to</SectionTitle>

      {initialLoading && (
        <StatusText data-testid="your-businesses-loading">
          Loading your businesses...
        </StatusText>
      )}

      {showListError && (
        <ListErrorPanel error={listError} onRetry={handleRefresh} />
      )}

      {hasBusinesses && (
        <BusinessList
          businesses={businesses}
          switchingId={switchingId}
          onSwitch={handleSwitch}
          onLeave={handleOpenLeave}
        />
      )}

      {switchError && (
        <SwitchErrorPanel message={switchError} onRefresh={handleRefresh} />
      )}

      <Footer>
        <SecondaryAction
          type="button"
          onClick={handleSignOut}
          data-testid="your-businesses-signout-button"
        >
          Sign out
        </SecondaryAction>
      </Footer>

      <LeaveConfirmModal
        isOpen={leaveOpen}
        target={leaveTarget}
        submitting={leaveSubmitting}
        error={leaveError}
        onClose={handleCloseLeave}
        onConfirm={handleConfirmLeave}
      />

      <ReverifyForAcceptModal
        isOpen={pendingAcceptId !== null}
        submitting={acceptSubmitting}
        error={acceptError}
        onClose={closeAcceptGate}
        onSubmit={confirmAccept}
      />
    </AuthCard>
  );
}

function BusinessList({ businesses, switchingId, onSwitch, onLeave }) {
  return (
    <RowList data-testid="your-businesses-list" aria-label="Your businesses">
      {businesses.map((b) => {
        const isActive = Boolean(b.isActive);
        const isSwitching = switchingId === b.tenantId;
        const switchDisabled = Boolean(switchingId) || isActive;
        return (
          <RowCard
            key={b.tenantId}
            aria-current={isActive ? "true" : undefined}
            data-testid={`your-businesses-row-${b.tenantId}`}
          >
            <RowMain>
              <RowName>{b.name || b.slug || b.tenantId}</RowName>
              <RowMeta>
                {b.role}
                {isActive ? " - current" : ""}
                {isSwitching ? " - switching..." : ""}
              </RowMeta>
            </RowMain>
            <RowActions>
              <PrimaryAction
                type="button"
                onClick={() => onSwitch(b.tenantId)}
                disabled={switchDisabled}
                data-testid={`your-businesses-switch-${b.tenantId}`}
              >
                {isActive ? "Current" : "Switch"}
              </PrimaryAction>
              <DangerAction
                type="button"
                onClick={() => onLeave(b)}
                disabled={Boolean(switchingId)}
                data-testid={`your-businesses-leave-${b.tenantId}`}
              >
                Leave
              </DangerAction>
            </RowActions>
          </RowCard>
        );
      })}
    </RowList>
  );
}

function PendingInvitations({
  incoming,
  busyInviteId,
  declineErrorById,
  onAccept,
  onDecline,
}) {
  return (
    <>
      <SectionTitle>Ownership invitations</SectionTitle>
      <InviteList
        data-testid="your-businesses-invites"
        aria-label="Pending ownership invitations"
      >
        {incoming.map((inv) => {
          const busy = busyInviteId === inv.id;
          const err = declineErrorById?.[inv.id];
          const businessName = inv.tenant?.name || inv.tenantId;
          const inviterName =
            inv.fromUser?.displayName || inv.fromUser?.email || inv.fromUserId;
          return (
            <InviteCard
              key={inv.id}
              data-testid={`your-businesses-invite-${inv.id}`}
            >
              <InviteMeta>
                <dt>Business</dt>
                <dd>{businessName}</dd>
                <dt>Invited by</dt>
                <dd>{inviterName}</dd>
                <dt>Expires</dt>
                <dd>{new Date(inv.expiresAt).toLocaleString()}</dd>
              </InviteMeta>
              {err && <AuthErrorBanner role="alert">{err}</AuthErrorBanner>}
              <RowActions>
                <SecondaryAction
                  type="button"
                  disabled={busy}
                  onClick={() => onDecline(inv.id)}
                  data-testid={`your-businesses-decline-${inv.id}`}
                >
                  Decline
                </SecondaryAction>
                <PrimaryAction
                  type="button"
                  disabled={busy}
                  onClick={() => onAccept(inv.id)}
                  data-testid={`your-businesses-accept-${inv.id}`}
                >
                  Accept
                </PrimaryAction>
              </RowActions>
            </InviteCard>
          );
        })}
      </InviteList>
    </>
  );
}

function ListErrorPanel({ error, onRetry }) {
  const message = extractErrorMessage(
    error,
    "We could not load your businesses.",
  );
  return (
    <div data-testid="your-businesses-list-error">
      <AuthErrorBanner role="alert">{message}</AuthErrorBanner>
      <SecondaryAction
        type="button"
        onClick={onRetry}
        data-testid="your-businesses-list-retry"
        style={{ marginTop: "var(--brand-space-3)" }}
      >
        Try again
      </SecondaryAction>
    </div>
  );
}

function SwitchErrorPanel({ message, onRefresh }) {
  return (
    <div data-testid="your-businesses-switch-error">
      <AuthErrorBanner role="alert">{message}</AuthErrorBanner>
      <SecondaryAction
        type="button"
        onClick={onRefresh}
        data-testid="your-businesses-refresh-list"
        style={{ marginTop: "var(--brand-space-3)" }}
      >
        Refresh list
      </SecondaryAction>
    </div>
  );
}

function LeaveConfirmModal({
  isOpen,
  target,
  submitting,
  error,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !target) return null;
  return (
    <ModalOverlay
      onClick={() => !submitting && onClose()}
      data-testid="your-businesses-leave-modal"
    >
      <ModalCard
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="leave-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <AuthTitle id="leave-modal-title">Leave business</AuthTitle>
        <AuthSubtitle>
          You will be removed from <strong>{target.businessName}</strong> and
          lose access to its dashboard, orders and settings. The owner can
          re-invite you later if needed.
        </AuthSubtitle>
        {error && (
          <AuthErrorBanner
            role="alert"
            data-testid="your-businesses-leave-error"
          >
            {error}
          </AuthErrorBanner>
        )}
        <ModalActions>
          <SecondaryAction
            type="button"
            onClick={onClose}
            disabled={submitting}
            data-testid="your-businesses-leave-cancel"
          >
            Cancel
          </SecondaryAction>
          <DangerAction
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            aria-busy={submitting || undefined}
            data-testid="your-businesses-leave-confirm"
          >
            {submitting ? "Leaving..." : "Leave"}
          </DangerAction>
        </ModalActions>
      </ModalCard>
    </ModalOverlay>
  );
}

function ReverifyForAcceptModal({
  isOpen,
  submitting,
  error,
  onClose,
  onSubmit,
}) {
  const [password, setPassword] = useState("");

  // Reset the password field whenever the modal closes so a stale value
  // never persists across accept attempts.
  React.useEffect(() => {
    if (!isOpen) setPassword("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || submitting) return;
    onSubmit(password);
  };

  return (
    <ModalOverlay
      onClick={() => !submitting && onClose()}
      data-testid="your-businesses-accept-modal"
    >
      <ModalCard
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="accept-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <AuthTitle id="accept-modal-title">Confirm your password</AuthTitle>
        <AuthSubtitle>
          Accepting will make you the new super admin of this business. Re-enter
          your password to confirm.
        </AuthSubtitle>
        <form onSubmit={handleSubmit}>
          <AuthField>
            <AuthLabel htmlFor="accept-password">Password</AuthLabel>
            <AuthInput
              id="accept-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              data-testid="your-businesses-accept-password"
            />
          </AuthField>
          {error && (
            <AuthErrorBanner
              role="alert"
              data-testid="your-businesses-accept-error"
              style={{ marginTop: "var(--brand-space-3)" }}
            >
              {error}
            </AuthErrorBanner>
          )}
          <ModalActions>
            <SecondaryAction
              type="button"
              onClick={onClose}
              disabled={submitting}
              data-testid="your-businesses-accept-cancel"
            >
              Cancel
            </SecondaryAction>
            <AuthSubmitButton
              type="submit"
              disabled={submitting || !password}
              aria-busy={submitting || undefined}
              data-testid="your-businesses-accept-confirm"
            >
              {submitting ? "Confirming..." : "Confirm"}
            </AuthSubmitButton>
          </ModalActions>
        </form>
      </ModalCard>
    </ModalOverlay>
  );
}
