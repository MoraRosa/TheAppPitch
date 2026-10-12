/**
 * SelectBusinessPage -- presentational shell for the merchant business
 * selection trust surface. Pure render based on props from
 * useSelectBusiness. Visual primitives come from the shared AuthForm
 * module so this page shares the AuthCard / AuthTitle / AuthInput
 * treatment of every other auth surface on the platform host (login,
 * register, forgot, reset, verify-email).
 *
 * Renders three states from one shell, gated by hook-derived booleans:
 *   - 0 memberships      -> forced "Create your first business" form
 *   - N >= 1 memberships -> picker list + "Create another" toggle
 *   - loading / list err -> inline status with manual retry
 *
 * Anti-enumeration: switch failures surface a manual "Refresh list"
 * button instead of auto-refreshing so the list never mutates under
 * the user's feet.
 */

import React from "react";
import styled from "styled-components";
import {
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  AuthForm,
  AuthField,
  AuthLabel,
  AuthInput,
  AuthSubmitButton,
  AuthErrorBanner,
} from "../../shared/AuthForm.jsx";

const RowList = styled.ul`
  list-style: none;
  margin: 0 0 var(--brand-space-4);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-2);
`;

const RowButton = styled.button`
  font: inherit;
  width: 100%;
  text-align: left;
  padding: var(--brand-space-3) var(--brand-space-4);
  background: var(--brand-color-neutral0);
  color: var(--brand-color-neutral900);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral200);
  border-radius: var(--brand-radius-md);
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--brand-color-primary500);
  }
  &[aria-current="true"] {
    border-color: var(--brand-color-primary500);
    background: var(--brand-color-primary50);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const SecondaryButton = styled.button`
  font: inherit;
  padding: var(--brand-space-3) var(--brand-space-4);
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

const QuotaText = styled.p`
  margin: 0 0 var(--brand-space-4);
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral500);
`;

const StatusText = styled.p`
  margin: 0 0 var(--brand-space-4);
  color: var(--brand-color-neutral700);
`;

const ButtonRow = styled.div`
  display: flex;
  gap: var(--brand-space-3);
`;

const Footer = styled.div`
  margin-top: var(--brand-space-6);
  display: flex;
  justify-content: flex-end;
`;

export default function SelectBusinessPage({
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
}) {
  const initialLoading = loading && !hasBusinesses;
  const showListError = listError && !hasBusinesses;

  return (
    <AuthCard
      as="main"
      id="main-content"
      aria-labelledby="select-business-heading"
    >
      <AuthTitle id="select-business-heading">Select a business</AuthTitle>
      <AuthSubtitle>
        You are signed in
        {currentUser?.email ? ` as ${currentUser.email}` : ""}. Choose a
        business to enter, or create a new one.
      </AuthSubtitle>

      {initialLoading && (
        <StatusText data-testid="select-business-loading">
          Loading your businesses...
        </StatusText>
      )}

      {showListError && <ListError error={listError} onRetry={handleRefresh} />}

      {hasBusinesses && (
        <BusinessList
          businesses={businesses}
          switchingId={switchingId}
          onSelect={handleSwitch}
        />
      )}

      {switchError && (
        <SwitchErrorPanel message={switchError} onRefresh={handleRefresh} />
      )}

      {showQuotaCounter && <QuotaCounter quota={quota} />}

      {atCap ? (
        <AtCapNotice quota={quota} />
      ) : hasBusinesses && !showCreateForm ? (
        <SecondaryButton
          type="button"
          onClick={handleShowCreate}
          data-testid="select-business-show-create"
        >
          + Create another business
        </SecondaryButton>
      ) : null}

      {createFormVisible && (
        <CreateBusinessForm
          name={name}
          businessEmail={businessEmail}
          submitting={submitting}
          formError={formError}
          forced={!hasBusinesses}
          onCancel={hasBusinesses ? handleCancelCreate : null}
          onChangeName={setName}
          onChangeEmail={setBusinessEmail}
          onSubmit={handleCreate}
        />
      )}

      <Footer>
        <SecondaryButton
          type="button"
          onClick={handleSignOut}
          data-testid="select-business-signout-button"
        >
          Sign out
        </SecondaryButton>
      </Footer>
    </AuthCard>
  );
}

function extractErrorMessage(err, fallback) {
  if (!err) return fallback;
  const backendMessage = err?.data?.message || err?.data?.error;
  if (backendMessage) return backendMessage;
  if (err?.message) return err.message;
  return fallback;
}

function BusinessList({ businesses, switchingId, onSelect }) {
  return (
    <RowList data-testid="select-business-list" aria-label="Your businesses">
      {businesses.map((b) => {
        const isActive = Boolean(b.isActive);
        const isSwitching = switchingId === b.tenantId;
        return (
          <li key={b.tenantId}>
            <RowButton
              type="button"
              onClick={() => onSelect(b.tenantId)}
              disabled={Boolean(switchingId)}
              aria-current={isActive ? "true" : undefined}
              data-testid={`select-business-row-${b.tenantId}`}
            >
              <RowName>{b.name || b.slug || b.tenantId}</RowName>
              <RowMeta>
                {b.role}
                {isActive ? " - current" : ""}
                {isSwitching ? " - switching..." : ""}
              </RowMeta>
            </RowButton>
          </li>
        );
      })}
    </RowList>
  );
}

function QuotaCounter({ quota }) {
  const used = Number(quota?.used ?? 0);
  const limit = Number(quota?.limit ?? 0);
  return (
    <QuotaText data-testid="select-business-quota-counter">
      {`Businesses: ${used} of ${limit}`}
    </QuotaText>
  );
}

function AtCapNotice({ quota }) {
  const limit = Number(quota?.limit ?? 0);
  const isNewAccount = Boolean(quota?.isNewAccount);
  const ageHours = Number(quota?.newAccountAgeHours ?? 0);
  const message = isNewAccount
    ? `New accounts can create ${limit} business in the first ${ageHours} hours. You can create more after that window.`
    : `You have reached your limit of ${limit} businesses. Leave or transfer one to free a slot.`;
  return (
    <StatusText role="status" data-testid="select-business-at-cap">
      {message}
    </StatusText>
  );
}

function ListError({ error, onRetry }) {
  const message = extractErrorMessage(
    error,
    "We could not load your businesses.",
  );
  return (
    <div data-testid="select-business-list-error">
      <AuthErrorBanner role="alert">{message}</AuthErrorBanner>
      <SecondaryButton
        type="button"
        onClick={onRetry}
        data-testid="select-business-list-retry"
        style={{ marginTop: "var(--brand-space-3)" }}
      >
        Try again
      </SecondaryButton>
    </div>
  );
}

function SwitchErrorPanel({ message, onRefresh }) {
  return (
    <div data-testid="select-business-switch-error">
      <AuthErrorBanner role="alert">{message}</AuthErrorBanner>
      <SecondaryButton
        type="button"
        onClick={onRefresh}
        data-testid="select-business-refresh-list"
        style={{ marginTop: "var(--brand-space-3)" }}
      >
        Refresh list
      </SecondaryButton>
    </div>
  );
}

function CreateBusinessForm({
  name,
  businessEmail,
  submitting,
  formError,
  forced,
  onCancel,
  onChangeName,
  onChangeEmail,
  onSubmit,
}) {
  return (
    <AuthForm
      onSubmit={onSubmit}
      aria-label={forced ? "Create your first business" : "Create a business"}
      noValidate
    >
      {formError && (
        <AuthErrorBanner
          role="alert"
          data-testid="select-business-create-error"
        >
          {formError}
        </AuthErrorBanner>
      )}

      <AuthField>
        <AuthLabel htmlFor="business-name">Business name</AuthLabel>
        <AuthInput
          id="business-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => onChangeName(event.target.value)}
          required
          autoComplete="organization"
          disabled={submitting}
          data-testid="select-business-name-input"
        />
      </AuthField>

      <AuthField>
        <AuthLabel htmlFor="business-email">
          Business email (optional)
        </AuthLabel>
        <AuthInput
          id="business-email"
          name="businessEmail"
          type="email"
          value={businessEmail}
          onChange={(event) => onChangeEmail(event.target.value)}
          autoComplete="email"
          disabled={submitting}
          data-testid="select-business-email-input"
        />
      </AuthField>

      <ButtonRow>
        <AuthSubmitButton
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          data-testid="select-business-create-button"
        >
          {submitting ? "Creating..." : forced ? "Create a business" : "Create"}
        </AuthSubmitButton>
        {onCancel && (
          <SecondaryButton
            type="button"
            onClick={onCancel}
            disabled={submitting}
            data-testid="select-business-create-cancel"
          >
            Cancel
          </SecondaryButton>
        )}
      </ButtonRow>
    </AuthForm>
  );
}
