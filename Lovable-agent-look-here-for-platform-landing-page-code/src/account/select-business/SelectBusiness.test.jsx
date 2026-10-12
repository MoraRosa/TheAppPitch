/**
 * SelectBusiness (Trust Surface) -- platform host integration tests
 *
 * Mounts SelectBusinessContainer so the useSelectBusiness hook and the
 * SelectBusinessPage shell are exercised together. The businessesService
 * data layer (@theapp/merchant-auth/businesses), the merchant auth
 * context, the apiClient (for the handoff issue POST), and useNavigate
 * are mocked at the module boundary.
 *
 * Trust-surface contract: one shell renders three states.
 *   - 0 memberships      -> forced create form (no cancel); on success
 *                           POST /handoff/issue and window.location.assign
 *   - N >= 1 memberships -> picker list; click -> switchActiveBusiness +
 *                           handoff; "Create another" toggle reveals the
 *                           form with a cancel; switch failure surfaces a
 *                           manual "Refresh list" button (anti-enumeration)
 *   - loading / list err -> inline status with manual retry
 *
 * The footer Sign out wires to useMerchantAuth().logout and navigates to
 * /login on the same (platform) host.
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
  createBusinessMock,
  getBusinessQuotaMock,
  apiClientPostMock,
} = vi.hoisted(() => ({
  authMock: {
    currentUser: { email: "merchant@test.io" },
    logout: vi.fn(),
  },
  navigateMock: vi.fn(),
  listMyBusinessesMock: vi.fn(),
  switchActiveBusinessMock: vi.fn(),
  createBusinessMock: vi.fn(),
  getBusinessQuotaMock: vi.fn(),
  apiClientPostMock: vi.fn(),
}));

vi.mock("@theapp/merchant-auth", () => ({
  useMerchantAuth: () => authMock,
}));

vi.mock("@theapp/merchant-auth/businesses", () => ({
  listMyBusinesses: (...args) => listMyBusinessesMock(...args),
  switchActiveBusiness: (...args) => switchActiveBusinessMock(...args),
  createBusiness: (...args) => createBusinessMock(...args),
  getBusinessQuota: (...args) => getBusinessQuotaMock(...args),
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

import SelectBusinessContainer from "./SelectBusinessContainer.jsx";

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

const DEFAULT_QUOTA = {
  used: 0,
  limit: 5,
  baseLimit: 5,
  override: null,
  isNewAccount: false,
  newAccountAgeHours: 24,
  remaining: 5,
};

const HANDOFF_URL = "https://admin.test.peakenterprise.ca/handoff#token=mock";

let originalLocation;
let locationAssignSpy;

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/select-business"]}>
      <SelectBusinessContainer />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  authMock.logout.mockReset();
  authMock.logout.mockResolvedValue(true);
  navigateMock.mockReset();
  listMyBusinessesMock.mockReset();
  switchActiveBusinessMock.mockReset();
  createBusinessMock.mockReset();
  getBusinessQuotaMock.mockReset();
  apiClientPostMock.mockReset();

  // Default: zero memberships, default (non-warning) quota snapshot,
  // handoff issuer hands back a valid URL.
  listMyBusinessesMock.mockResolvedValue([]);
  getBusinessQuotaMock.mockResolvedValue(DEFAULT_QUOTA);
  apiClientPostMock.mockResolvedValue({
    success: true,
    data: { handoffUrl: HANDOFF_URL },
  });

  // jsdom's window.location.assign is a no-op in strict mode; replace
  // location with a stubbed object so the cross-host hop is observable
  // without actually navigating the test runner.
  originalLocation = window.location;
  locationAssignSpy = vi.fn();
  delete window.location;
  window.location = { ...originalLocation, assign: locationAssignSpy };
});

afterEach(() => {
  window.location = originalLocation;
});

describe("SelectBusiness -- 0 memberships (forced create)", () => {
  it("renders the heading, current user email, and the forced create form", async () => {
    renderPage();
    expect(
      await screen.findByTestId("select-business-name-input"),
    ).toBeEnabled();
    expect(
      screen.getByRole("heading", { name: /select a business/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/merchant@test\.io/)).toBeInTheDocument();
    expect(screen.getByTestId("select-business-email-input")).toBeEnabled();
    // Forced mode: no cancel button, submit label is the prominent CTA.
    expect(
      screen.queryByTestId("select-business-create-cancel"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("select-business-create-button"),
    ).toHaveTextContent(/create a business/i);
  });

  it("submits a trimmed name + email and bounces through /handoff on success", async () => {
    createBusinessMock.mockResolvedValueOnce({
      tenantId: "t1",
      slug: "my-shop",
      role: "super_admin",
    });

    renderPage();
    fireEvent.change(await screen.findByTestId("select-business-name-input"), {
      target: { value: "  My Shop  " },
    });
    fireEvent.change(screen.getByTestId("select-business-email-input"), {
      target: { value: "  hello@my-shop.io  " },
    });

    fireEvent.click(screen.getByTestId("select-business-create-button"));

    await waitFor(() => expect(createBusinessMock).toHaveBeenCalledTimes(1));
    expect(createBusinessMock).toHaveBeenCalledWith({
      name: "My Shop",
      businessEmail: "hello@my-shop.io",
    });
    await waitFor(() =>
      expect(apiClientPostMock).toHaveBeenCalledWith(
        "/api/v1/auth/merchant/handoff/issue",
        {},
      ),
    );
    await waitFor(() =>
      expect(locationAssignSpy).toHaveBeenCalledWith(HANDOFF_URL),
    );
    // The platform host never renders /admin -- success exits via the
    // cross-host hop, not react-router navigation.
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("omits businessEmail from the payload when the input is left blank", async () => {
    createBusinessMock.mockResolvedValueOnce({
      tenantId: "t1",
      slug: "x",
      role: "super_admin",
    });

    renderPage();
    fireEvent.change(await screen.findByTestId("select-business-name-input"), {
      target: { value: "Solo" },
    });
    fireEvent.click(screen.getByTestId("select-business-create-button"));

    await waitFor(() => expect(createBusinessMock).toHaveBeenCalledTimes(1));
    expect(createBusinessMock).toHaveBeenCalledWith({ name: "Solo" });
  });

  it("blocks submit and surfaces a client-side error when the name is empty", async () => {
    renderPage();
    fireEvent.click(await screen.findByTestId("select-business-create-button"));

    expect(
      await screen.findByTestId("select-business-create-error"),
    ).toHaveTextContent(/business name is required/i);
    expect(createBusinessMock).not.toHaveBeenCalled();
    expect(apiClientPostMock).not.toHaveBeenCalled();
    expect(locationAssignSpy).not.toHaveBeenCalled();
  });

  it("surfaces the backend's structured message when create rejects with an ApiError", async () => {
    createBusinessMock.mockRejectedValueOnce(
      Object.assign(new Error("Conflict"), {
        statusCode: 409,
        data: { message: "A business with this slug already exists" },
      }),
    );

    renderPage();
    fireEvent.change(await screen.findByTestId("select-business-name-input"), {
      target: { value: "Dup" },
    });
    fireEvent.click(screen.getByTestId("select-business-create-button"));

    expect(
      await screen.findByTestId("select-business-create-error"),
    ).toHaveTextContent(/a business with this slug already exists/i);
    expect(locationAssignSpy).not.toHaveBeenCalled();
  });

  it("wires the Sign out button to logout and routes to /login on the same host", async () => {
    renderPage();
    fireEvent.click(
      await screen.findByTestId("select-business-signout-button"),
    );
    await waitFor(() => expect(authMock.logout).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith("/login", { replace: true }),
    );
  });
});

describe("SelectBusiness -- loading and list-error states", () => {
  it("renders the loading message while the initial list fetch is in flight", async () => {
    // Pending promise: the hook stays in loading=true with businesses=[].
    let resolveList;
    listMyBusinessesMock.mockImplementationOnce(
      () => new Promise((resolve) => (resolveList = resolve)),
    );

    renderPage();
    expect(
      await screen.findByTestId("select-business-loading"),
    ).toHaveTextContent(/loading your businesses/i);
    // Pinning test: the page must NOT flash the forced create form
    // while the businesses fetch is still pending.
    expect(
      screen.queryByTestId("select-business-name-input"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("select-business-create-button"),
    ).not.toBeInTheDocument();

    // Resolve to clean up the hanging promise.
    resolveList([]);
  });

  it("surfaces a list-error panel with a manual retry that re-runs the fetch", async () => {
    listMyBusinessesMock.mockRejectedValueOnce(
      Object.assign(new Error("boom"), {
        statusCode: 500,
        data: { message: "Backend exploded" },
      }),
    );

    renderPage();
    expect(
      await screen.findByTestId("select-business-list-error"),
    ).toHaveTextContent(/backend exploded/i);

    listMyBusinessesMock.mockResolvedValueOnce([]);
    fireEvent.click(screen.getByTestId("select-business-list-retry"));
    await waitFor(() => expect(listMyBusinessesMock).toHaveBeenCalledTimes(2));
  });
});

describe("SelectBusiness -- N>=1 memberships (picker)", () => {
  beforeEach(() => {
    listMyBusinessesMock.mockResolvedValue(BUSINESSES);
  });

  it("renders one row per business and marks the active one with aria-current", async () => {
    renderPage();
    expect(
      await screen.findByTestId("select-business-list"),
    ).toBeInTheDocument();
    const alpha = screen.getByTestId("select-business-row-t-alpha");
    const beta = screen.getByTestId("select-business-row-t-beta");
    expect(alpha).toHaveAttribute("aria-current", "true");
    expect(beta).not.toHaveAttribute("aria-current");
    expect(alpha).toHaveTextContent(/alpha co/i);
    expect(alpha).toHaveTextContent(/super_admin/);
    expect(beta).toHaveTextContent(/beta llc/i);
  });

  it("does not force the create form open and hides it behind a toggle", async () => {
    renderPage();
    await screen.findByTestId("select-business-list");
    expect(
      screen.queryByTestId("select-business-name-input"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("select-business-show-create")).toHaveTextContent(
      /create another business/i,
    );
  });

  it("calls switchActiveBusiness and bounces through /handoff on success", async () => {
    switchActiveBusinessMock.mockResolvedValueOnce({});
    renderPage();
    fireEvent.click(await screen.findByTestId("select-business-row-t-beta"));
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

  it("surfaces a SwitchErrorPanel with a manual Refresh list button on switch failure", async () => {
    switchActiveBusinessMock.mockRejectedValueOnce(
      Object.assign(new Error("forbidden"), {
        statusCode: 403,
        data: { message: "Access denied" },
      }),
    );

    renderPage();
    fireEvent.click(await screen.findByTestId("select-business-row-t-beta"));

    expect(
      await screen.findByTestId("select-business-switch-error"),
    ).toHaveTextContent(/access denied/i);
    // Anti-enumeration: the page must NOT auto-refresh on 403; the
    // user drives the retry via the explicit button.
    expect(listMyBusinessesMock).toHaveBeenCalledTimes(1);
    // List stays mounted so the user can pick a different row.
    expect(screen.getByTestId("select-business-list")).toBeInTheDocument();
    expect(locationAssignSpy).not.toHaveBeenCalled();

    listMyBusinessesMock.mockResolvedValueOnce(BUSINESSES);
    fireEvent.click(screen.getByTestId("select-business-refresh-list"));
    await waitFor(() => expect(listMyBusinessesMock).toHaveBeenCalledTimes(2));
  });

  it("Create another business toggle reveals the form with a cancel affordance", async () => {
    renderPage();
    fireEvent.click(await screen.findByTestId("select-business-show-create"));
    expect(screen.getByTestId("select-business-name-input")).toBeEnabled();
    // Non-forced mode: cancel is available and the submit label is the
    // shorter "Create".
    const cancel = screen.getByTestId("select-business-create-cancel");
    expect(cancel).toBeInTheDocument();
    expect(
      screen.getByTestId("select-business-create-button"),
    ).toHaveTextContent(/^create$/i);

    fireEvent.click(cancel);
    expect(
      screen.queryByTestId("select-business-name-input"),
    ).not.toBeInTheDocument();
  });
});

describe("SelectBusiness -- business quota counter and at-cap notice", () => {
  it("hides the quota counter when remaining is above WARN_AT_REMAINING", async () => {
    listMyBusinessesMock.mockResolvedValue(BUSINESSES);
    getBusinessQuotaMock.mockResolvedValue({
      used: 2,
      limit: 5,
      baseLimit: 5,
      override: null,
      isNewAccount: false,
      newAccountAgeHours: 24,
      remaining: 3,
    });
    renderPage();
    await screen.findByTestId("select-business-list");
    expect(
      screen.queryByTestId("select-business-quota-counter"),
    ).not.toBeInTheDocument();
    // Create another stays available.
    expect(
      screen.getByTestId("select-business-show-create"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("select-business-at-cap"),
    ).not.toBeInTheDocument();
  });

  it("shows the quota counter at the warning threshold (4 of 5) without blocking create", async () => {
    listMyBusinessesMock.mockResolvedValue(BUSINESSES);
    getBusinessQuotaMock.mockResolvedValue({
      used: 4,
      limit: 5,
      baseLimit: 5,
      override: null,
      isNewAccount: false,
      newAccountAgeHours: 24,
      remaining: 1,
    });
    renderPage();
    expect(
      await screen.findByTestId("select-business-quota-counter"),
    ).toHaveTextContent(/businesses:\s*4\s*of\s*5/i);
    expect(
      screen.getByTestId("select-business-show-create"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("select-business-at-cap"),
    ).not.toBeInTheDocument();
  });

  it("replaces the create CTA with an at-cap notice at the limit (5 of 5)", async () => {
    listMyBusinessesMock.mockResolvedValue(BUSINESSES);
    getBusinessQuotaMock.mockResolvedValue({
      used: 5,
      limit: 5,
      baseLimit: 5,
      override: null,
      isNewAccount: false,
      newAccountAgeHours: 24,
      remaining: 0,
    });
    renderPage();
    expect(
      await screen.findByTestId("select-business-quota-counter"),
    ).toHaveTextContent(/businesses:\s*5\s*of\s*5/i);
    const notice = screen.getByTestId("select-business-at-cap");
    expect(notice).toHaveTextContent(/limit of 5 businesses/i);
    // The "Create another" toggle and the create form are both gone.
    expect(
      screen.queryByTestId("select-business-show-create"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("select-business-name-input"),
    ).not.toBeInTheDocument();
  });

  it("renders new-account at-cap copy when the account-age gate is active", async () => {
    // New-account state: 1 business already, capped at 1 for the first 24h.
    listMyBusinessesMock.mockResolvedValue(BUSINESSES.slice(0, 1));
    getBusinessQuotaMock.mockResolvedValue({
      used: 1,
      limit: 1,
      baseLimit: 5,
      override: null,
      isNewAccount: true,
      newAccountAgeHours: 24,
      remaining: 0,
    });
    renderPage();
    const notice = await screen.findByTestId("select-business-at-cap");
    expect(notice).toHaveTextContent(/new accounts can create 1 business/i);
    expect(notice).toHaveTextContent(/first 24 hours/i);
    expect(
      screen.queryByTestId("select-business-show-create"),
    ).not.toBeInTheDocument();
  });
});
