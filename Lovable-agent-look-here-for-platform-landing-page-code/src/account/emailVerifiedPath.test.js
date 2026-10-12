/**
 * emailVerifiedPath -- deploy-layout correctness tests.
 *
 * The verification email's redirect target must match the account SPA's
 * mount point in every deploy layout, or the confirmation link lands on
 * a 404 (single-origin Cloudflare Pages serves the SPA under /account,
 * so a root /email-verified target is unroutable). These tests pin that
 * the path is derived from VITE_ACCOUNT_BASENAME rather than a DEV flag.
 *
 * EMAIL_VERIFIED_PATH is computed at module load from import.meta.env,
 * so each case stubs the env then re-imports the module.
 */
import { describe, it, expect, afterEach, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadWith(basename) {
  vi.stubEnv("VITE_ACCOUNT_BASENAME", basename);
  vi.resetModules();
  return import("./emailVerifiedPath.js");
}

describe("EMAIL_VERIFIED_PATH", () => {
  it("mounts under /account when the SPA basename is /account (single-origin prod)", async () => {
    const { EMAIL_VERIFIED_PATH } = await loadWith("/account");
    expect(EMAIL_VERIFIED_PATH).toBe("/account/email-verified");
  });

  it("mounts at root when the SPA basename is / (split-host layout)", async () => {
    const { EMAIL_VERIFIED_PATH } = await loadWith("/");
    expect(EMAIL_VERIFIED_PATH).toBe("/email-verified");
  });

  it("defaults to the /account layout when the basename env is unset", async () => {
    const { EMAIL_VERIFIED_PATH } = await loadWith(undefined);
    expect(EMAIL_VERIFIED_PATH).toBe("/account/email-verified");
  });
});

describe("emailVerifiedRedirectUrl", () => {
  it("prefixes the current origin and honours the account basename", async () => {
    const { emailVerifiedRedirectUrl } = await loadWith("/account");
    const url = emailVerifiedRedirectUrl();
    expect(url).toBe(`${window.location.origin}/account/email-verified`);
  });

  it("appends signup intent as query params for cross-tab survival", async () => {
    const { emailVerifiedRedirectUrl } = await loadWith("/account");
    const url = emailVerifiedRedirectUrl({ plan: "grow" });
    expect(url).toContain("/account/email-verified");
    expect(url).toContain("plan=grow");
  });
});
