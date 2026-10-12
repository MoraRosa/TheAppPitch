/**
 * HandoffContainer (account consume surface) tests.
 *
 * Verifies the reverse Merchant -> Account handoff consume: the surface
 * lifts the token from the URL fragment, redeems it with the account-app
 * audience, and routes to the allowlisted next path. The merchant-auth
 * consumeHandoff method and useNavigate are mocked so the test focuses on
 * the consume-surface orchestration, not session hydration internals.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const { consumeHandoffMock, navigateMock } = vi.hoisted(() => ({
  consumeHandoffMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock("@theapp/merchant-auth", () => ({
  useMerchantAuth: () => ({ consumeHandoff: consumeHandoffMock }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

import HandoffContainer from "./HandoffContainer.jsx";

let originalLocation;

function setLocation({ hash = "", search = "" }) {
  delete window.location;
  window.location = {
    ...originalLocation,
    hash,
    search,
    pathname: "/account/handoff",
    replaceState: () => {},
  };
}

function renderSurface() {
  return render(
    <MemoryRouter initialEntries={["/handoff"]}>
      <HandoffContainer />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  originalLocation = window.location;
  vi.clearAllMocks();
  // history.replaceState is called to strip the hash; stub it so jsdom
  // does not complain about the synthetic location object.
  vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
});

afterEach(() => {
  window.location = originalLocation;
  vi.restoreAllMocks();
});

describe("HandoffContainer (account consume)", () => {
  it("redeems the token with the account-app audience and routes to the next path", async () => {
    setLocation({ hash: "#token=abc.def.ghi", search: "?next=%2Fbusinesses" });
    consumeHandoffMock.mockResolvedValueOnce(true);

    renderSurface();

    await waitFor(() => {
      expect(consumeHandoffMock).toHaveBeenCalledWith(
        "abc.def.ghi",
        "account-app",
      );
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/businesses", {
        replace: true,
      });
    });
  });

  it("defaults to /businesses when no next path is present", async () => {
    setLocation({ hash: "#token=tok", search: "" });
    consumeHandoffMock.mockResolvedValueOnce(true);

    renderSurface();

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/businesses", {
        replace: true,
      });
    });
  });

  it("ignores a non-allowlisted next path and falls back to /businesses", async () => {
    setLocation({ hash: "#token=tok", search: "?next=%2Fadmin%2Fsecrets" });
    consumeHandoffMock.mockResolvedValueOnce(true);

    renderSurface();

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/businesses", {
        replace: true,
      });
    });
  });

  it("does not navigate and shows the expired state when consume fails", async () => {
    setLocation({ hash: "#token=tok", search: "" });
    consumeHandoffMock.mockResolvedValueOnce(false);

    const { findByRole } = renderSurface();

    await findByRole("alert");
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("shows the expired state when no token is in the URL", async () => {
    setLocation({ hash: "", search: "" });

    const { findByRole } = renderSurface();

    await findByRole("alert");
    expect(consumeHandoffMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
