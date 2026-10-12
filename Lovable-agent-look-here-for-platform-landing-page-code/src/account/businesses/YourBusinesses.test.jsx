/**
 * YourBusinesses (Identity Surface) -- platform host integration tests
 *
 * Mounts YourBusinessesContainer so useYourBusinesses (plus the three
 * shared hooks it composes from @theapp/shared/hooks/businesses) and
 * YourBusinessesPage are exercised together. The merchant-auth data
 * layer, the apiClient (handoff issue POST), and useNavigate are mocked
 * at the module boundary.
 *
 * Surface contract this exercises:
 *   - Initial fetch lists businesses + incoming transfer invitations.
 *   - Switch row -> switchActiveBusiness + handoff hop.
 *   - Switch failure surfaces a SwitchErrorPanel with manual refresh
 *     (anti-enumeration -- never auto-refresh on a 4xx).
 *   - Leave row -> shared useLeaveBusinessFlow + useBusinesses().leave
 *     -> session refresh + optimistic removal.
 *   - Accept invitation -> reverify password (gate) -> accept -> list
 *     and memberships refresh.
 *   - Decline invitation -> direct decline, per-invitation error
 *     channel so a single failure does not smear the banner.
 */

import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const {
  authMock,
  navigateMock,
  listMyBusinessesMock,
  switchActiveBusinessMock,
  leaveBusinessMock,
  listIncomingMock,
  listOutgoingMock,
  acceptTransferMock,
  declineTransferMock,
  reverifyPasswordMock,
  apiClientPostMock,
} = vi.hoisted(() => ({
  authMock: {
    currentUser: { email: "merchant@test.io" },
    logout: vi.fn(),
    refreshMemberships: vi.fn(),
    createBusiness: vi.fn(),
  },
  navigateMock: vi.fn(),
  listMyBusinessesMock: vi.fn(),
  switchActiveBusinessMock: vi.fn(),
  leaveBusinessMock: vi.fn(),
  listIncomingMock: vi.fn(),
  listOutgoingMock: vi.fn(),
  acceptTransferMock: vi.fn(),
  declineTransferMock: vi.fn(),
  reverifyPasswordMock: vi.fn(),
  apiClientPostMock: vi.fn(),
}));

vi.mock("@theapp/merchant-auth", () => ({
  useMerchantAuth: () => authMock,
}));

vi.mock("@theapp/merchant-auth/businesses", () => ({
  listMyBusinesses: (...args) => listMyBusinessesMock(...args),
  switchActiveBusiness: (...args) => switchActiveBusinessMock(...args),
  leaveBusiness: (...args) => leaveBusinessMock(...args),
  softDeleteBusiness: vi.fn(),
  listIncomingTransfers: (...args) => listIncomingMock(...args),
  listOutgoingTransfers: (...args) => listOutgoingMock(...args),
  acceptOwnershipTransfer: (...args) => acceptTransferMock(...args),
  declineOwnershipTransfer: (...args) => declineTransferMock(...args),
  initiateOwnershipTransfer: vi.fn(),
  cancelOwnershipTransfer: vi.fn(),
  reverifyMerchantPassword: (...args) => reverifyPasswordMock(...args),
}));

vi.mock("@theapp/api-client", () => ({
  apiClient: {
    post: (...args) => apiClientPostMock(...args),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import YourBusinessesContainer from "./YourBusinessesContainer.jsx";

const BUSINESSES = [
  {
    tenantId: "t-alpha",
    name: "Alpha Co",
    slug: "alpha",
    role: "super_admin",
    isActive: true,
    isPrimary: true,
  },
  {
    tenantId: "t-beta",
    name: "Beta LLC",
    slug: "beta",
    role: "editor",
    isActive: false,
    isPrimary: false,
  },
];

const INVITATION = {
  id: "inv-1",
  tenantId: "t-gamma",
  tenant: { name: "Gamma Inc" },
  fromUserId: "u-2",
  fromUser: { displayName: "Sam Owner", email: "sam@gamma.io" },
  toUserId: "u-1",
  status: "pending",
  expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
};

const HANDOFF_URL = "https://admin.test.peakenterprise.ca/handoff#token=mock";

let originalLocation;
let locationAssignSpy;

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/businesses"]}>
      <YourBusinessesContainer />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  authMock.logout.mockReset();
  authMock.logout.mockResolvedValue(true);
  authMock.refreshMemberships.mockReset();
  authMock.refreshMemberships.mockResolvedValue(true);
  navigateMock.mockReset();
  listMyBusinessesMock.mockReset();
  switchActiveBusinessMock.mockReset();
  leaveBusinessMock.mockReset();
  listIncomingMock.mockReset();
  listOutgoingMock.mockReset();
  acceptTransferMock.mockReset();
  declineTransferMock.mockReset();
  reverifyPasswordMock.mockReset();
  apiClientPostMock.mockReset();

  listMyBusinessesMock.mockResolvedValue(BUSINESSES);
  listIncomingMock.mockResolvedValue([]);
  listOutgoingMock.mockResolvedValue([]);
  apiClientPostMock.mockResolvedValue({
    success: true,
    data: { handoffUrl: HANDOFF_URL },
  });

  originalLocation = window.location;
  locationAssignSpy = vi.fn();
  delete window.location;
  window.location = { ...originalLocation, assign: locationAssignSpy };
});

afterEach(() => {
  window.location = originalLocation;
});

describe("YourBusinesses -- list rendering and switch", () => {
  it("renders heading, current user email, and one row per business", async () => {
    renderPage();
    expect(
      await screen.findByTestId("your-businesses-list"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /your businesses/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/merchant@test\.io/)).toBeInTheDocument();
    const alpha = screen.getByTestId("your-businesses-row-t-alpha");
    const beta = screen.getByTestId("your-businesses-row-t-beta");
    expect(alpha).toHaveAttribute("aria-current", "true");
    expect(beta).not.toHaveAttribute("aria-current");
    // Active row: Switch button reads "Current" and is disabled.
    expect(screen.getByTestId("your-businesses-switch-t-alpha")).toBeDisabled();
    expect(
      screen.getByTestId("your-businesses-switch-t-alpha"),
    ).toHaveTextContent(/current/i);
    expect(screen.getByTestId("your-businesses-switch-t-beta")).toBeEnabled();
  });

  it("switching a row calls switchActiveBusiness and bounces through /handoff", async () => {
    switchActiveBusinessMock.mockResolvedValueOnce({});
    renderPage();
    fireEvent.click(await screen.findByTestId("your-businesses-switch-t-beta"));
    await waitFor(() =>
      expect(switchActiveBusinessMock).toHaveBeenCalledWith("t-beta"),
    );
    await waitFor(() =>
      expect(apiClientPostMock).toHaveBeenCalledWith(
        "/api/v1/auth/merchant/handoff/issue",
        {},
      ),
    );
    await waitFor(() =>
      expect(locationAssignSpy).toHaveBeenCalledWith(HANDOFF_URL),
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("surfaces a SwitchErrorPanel with a manual Refresh on switch failure", async () => {
    switchActiveBusinessMock.mockRejectedValueOnce(
      Object.assign(new Error("forbidden"), {
        statusCode: 403,
        data: { message: "Access denied" },
      }),
    );

    renderPage();
    fireEvent.click(await screen.findByTestId("your-businesses-switch-t-beta"));

    expect(
      await screen.findByTestId("your-businesses-switch-error"),
    ).toHaveTextContent(/access denied/i);
    // Anti-enumeration: list does NOT auto-refresh on 4xx.
    expect(listMyBusinessesMock).toHaveBeenCalledTimes(1);
    expect(locationAssignSpy).not.toHaveBeenCalled();

    listMyBusinessesMock.mockResolvedValueOnce(BUSINESSES);
    listIncomingMock.mockResolvedValueOnce([]);
    fireEvent.click(screen.getByTestId("your-businesses-refresh-list"));
    await waitFor(() => expect(listMyBusinessesMock).toHaveBeenCalledTimes(2));
  });

  it("surfaces a list-error panel when the initial fetch fails", async () => {
    listMyBusinessesMock.mockReset();
    listMyBusinessesMock.mockRejectedValueOnce(
      Object.assign(new Error("boom"), {
        statusCode: 500,
        data: { message: "Backend exploded" },
      }),
    );
    renderPage();
    expect(
      await screen.findByTestId("your-businesses-list-error"),
    ).toHaveTextContent(/backend exploded/i);
  });

  it("Sign out wires to logout and routes to /login on the same host", async () => {
    renderPage();
    fireEvent.click(
      await screen.findByTestId("your-businesses-signout-button"),
    );
    await waitFor(() => expect(authMock.logout).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith("/login", { replace: true }),
    );
  });
});

describe("YourBusinesses -- leave flow", () => {
  it("opens the leave modal with the target business name and cancels cleanly", async () => {
    renderPage();
    fireEvent.click(await screen.findByTestId("your-businesses-leave-t-beta"));

    const modal = await screen.findByTestId("your-businesses-leave-modal");
    expect(modal).toHaveTextContent(/beta llc/i);

    fireEvent.click(screen.getByTestId("your-businesses-leave-cancel"));
    await waitFor(() =>
      expect(
        screen.queryByTestId("your-businesses-leave-modal"),
      ).not.toBeInTheDocument(),
    );
    expect(leaveBusinessMock).not.toHaveBeenCalled();
  });

  it("confirming leave calls leaveBusiness(tenantId) and removes the row optimistically", async () => {
    leaveBusinessMock.mockResolvedValueOnce({ success: true });
    renderPage();
    fireEvent.click(await screen.findByTestId("your-businesses-leave-t-beta"));
    fireEvent.click(await screen.findByTestId("your-businesses-leave-confirm"));

    await waitFor(() =>
      expect(leaveBusinessMock).toHaveBeenCalledWith("t-beta"),
    );
    await waitFor(() => expect(authMock.refreshMemberships).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        screen.queryByTestId("your-businesses-row-t-beta"),
      ).not.toBeInTheDocument(),
    );
  });

  it("surfaces a leave error in the modal without closing it", async () => {
    leaveBusinessMock.mockRejectedValueOnce(
      Object.assign(new Error("nope"), {
        statusCode: 409,
        data: { message: "You are the only super admin." },
      }),
    );
    renderPage();
    fireEvent.click(await screen.findByTestId("your-businesses-leave-t-beta"));
    fireEvent.click(await screen.findByTestId("your-businesses-leave-confirm"));

    expect(
      await screen.findByTestId("your-businesses-leave-error"),
    ).toHaveTextContent(/only super admin/i);
    expect(
      screen.getByTestId("your-businesses-leave-modal"),
    ).toBeInTheDocument();
    // Row restored after optimistic remove rolls back.
    expect(
      screen.getByTestId("your-businesses-row-t-beta"),
    ).toBeInTheDocument();
  });
});

describe("YourBusinesses -- incoming ownership transfers", () => {
  it("renders the invitations banner when listIncomingTransfers returns rows", async () => {
    listIncomingMock.mockReset();
    listIncomingMock.mockResolvedValue([INVITATION]);
    renderPage();

    expect(
      await screen.findByTestId(`your-businesses-invite-${INVITATION.id}`),
    ).toBeInTheDocument();
    expect(screen.getByText(/gamma inc/i)).toBeInTheDocument();
    expect(screen.getByText(/sam owner/i)).toBeInTheDocument();
  });

  it("Accept opens the reverify modal, verifies password, accepts, refreshes lists", async () => {
    listIncomingMock.mockReset();
    listIncomingMock.mockResolvedValue([INVITATION]);
    reverifyPasswordMock.mockResolvedValueOnce({
      verifiedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    });
    acceptTransferMock.mockResolvedValueOnce({ success: true });

    renderPage();
    fireEvent.click(
      await screen.findByTestId(`your-businesses-accept-${INVITATION.id}`),
    );

    const modal = await screen.findByTestId("your-businesses-accept-modal");
    expect(modal).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("your-businesses-accept-password"), {
      target: { value: "hunter2" },
    });
    fireEvent.click(screen.getByTestId("your-businesses-accept-confirm"));

    await waitFor(() =>
      expect(reverifyPasswordMock).toHaveBeenCalledWith("hunter2"),
    );
    await waitFor(() =>
      expect(acceptTransferMock).toHaveBeenCalledWith(INVITATION.id),
    );
    await waitFor(() => expect(authMock.refreshMemberships).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        screen.queryByTestId("your-businesses-accept-modal"),
      ).not.toBeInTheDocument(),
    );
  });

  it("Accept surfaces a password error and keeps the modal open without calling accept", async () => {
    listIncomingMock.mockReset();
    listIncomingMock.mockResolvedValue([INVITATION]);
    reverifyPasswordMock.mockRejectedValueOnce(
      Object.assign(new Error("bad"), {
        statusCode: 401,
        data: { message: "Wrong password." },
      }),
    );

    renderPage();
    fireEvent.click(
      await screen.findByTestId(`your-businesses-accept-${INVITATION.id}`),
    );
    fireEvent.change(
      await screen.findByTestId("your-businesses-accept-password"),
      { target: { value: "nope" } },
    );
    fireEvent.click(screen.getByTestId("your-businesses-accept-confirm"));

    expect(
      await screen.findByTestId("your-businesses-accept-error"),
    ).toHaveTextContent(/wrong password/i);
    expect(acceptTransferMock).not.toHaveBeenCalled();
    expect(
      screen.getByTestId("your-businesses-accept-modal"),
    ).toBeInTheDocument();
  });

  it("Decline calls declineOwnershipTransfer({ invitationId }) directly (no reverify)", async () => {
    listIncomingMock.mockReset();
    listIncomingMock.mockResolvedValue([INVITATION]);
    declineTransferMock.mockResolvedValueOnce({ success: true });

    renderPage();
    fireEvent.click(
      await screen.findByTestId(`your-businesses-decline-${INVITATION.id}`),
    );

    await waitFor(() =>
      expect(declineTransferMock).toHaveBeenCalledWith({
        invitationId: INVITATION.id,
        reason: undefined,
      }),
    );
    expect(reverifyPasswordMock).not.toHaveBeenCalled();
  });
});
