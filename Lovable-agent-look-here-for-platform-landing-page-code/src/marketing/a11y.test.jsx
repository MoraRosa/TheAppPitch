/**
 * Marketing a11y suite -- runs axe against every top-level marketing
 * route mounted through the same data-router shape vite-react-ssg
 * consumes at build time. Each case mocks fetch with a payload shaped
 * like the public CMS endpoints, awaits the loader-rendered content,
 * then runs axe on the document body so the chrome (header/footer
 * landmarks, skip links) is also covered.
 *
 * Standard: WCAG 2.1 A + AA tags. The AAA color-contrast rule is
 * enabled "where feasible" -- jsdom does not compute layout colors
 * reliably, so axe will skip the rule there, but turning it on means
 * any future migration to a real-browser runner picks it up without
 * config drift.
 */

import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { axe } from "vitest-axe";
import { routes } from "./routes.jsx";

const AXE_OPTIONS = {
  runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
  rules: {
    "color-contrast-enhanced": { enabled: true },
  },
};

function renderAt(initialEntries) {
  const router = createMemoryRouter(routes, { initialEntries });
  // v7_startTransition lives on RouterProvider (not the router
  // constructor) in react-router-dom v6 -- mirrors what vite-react-ssg
  // does at boot so test output stays free of the future-flag warning.
  return render(
    <RouterProvider router={router} future={{ v7_startTransition: true }} />,
  );
}

function jsonResponse(body, { status = 200 } = {}) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

function installFetchRouter(handlers) {
  const fn = vi.fn((url) => {
    const u = String(url);
    for (const [pattern, handler] of handlers) {
      if (u.includes(pattern)) return handler();
    }
    return jsonResponse({ error: { code: "not_found" } }, { status: 404 });
  });
  globalThis.fetch = fn;
  return fn;
}

// ---- payload fixtures (minimal, page-shape correct) --------------------

function pagePayload(slug, title, blocks) {
  return {
    data: {
      page: {
        slug,
        locale: "en",
        title,
        meta_description: `${title} description.`,
        meta_keywords: null,
        canonical_path: slug === "landing" ? "/" : `/${slug}`,
        revision_number: 1,
        published_at: "2026-05-01T00:00:00Z",
        blocks,
      },
      refs: { plans: [] },
    },
  };
}

function heroBlock(headline) {
  return {
    type: "hero",
    headline,
    subheadline: `${headline} subheadline.`,
    primary_cta_label: "Start free",
    primary_cta_href: "/pricing",
  };
}

function documentListPayload(docType, items) {
  return {
    data: {
      documents: items.map((it) => ({
        slug: it.slug,
        doc_type: docType,
        locale: "en",
        title: it.title,
        summary: it.summary,
        effective_at: "2026-04-01T00:00:00Z",
        published_at: "2026-04-01T00:00:00Z",
      })),
      // eslint-disable-next-line no-restricted-syntax -- Pagination: total is row count (quantity), not money
      pagination: { total: items.length, limit: 20, offset: 0 },
    },
  };
}

function documentDetailPayload(docType, slug, title, bodyHtml) {
  return {
    data: {
      document: {
        slug,
        doc_type: docType,
        locale: "en",
        title,
        summary: `${title} summary.`,
        meta_description: `${title} description.`,
        canonical_path: `/${docType}/${slug}`,
        body_html: bodyHtml,
        effective_at: "2026-04-01T00:00:00Z",
        tags: [],
        author_name: null,
        revision_number: 1,
        published_at: "2026-04-01T00:00:00Z",
      },
    },
  };
}

// ---- helper: mount a route, wait for known content, run axe ------------

async function mountAndAudit(path, waitForText) {
  const { container } = renderAt([path]);
  await screen.findByText(waitForText);
  const results = await axe(container, AXE_OPTIONS);
  expect(results).toHaveNoViolations();
}

// ---- tests --------------------------------------------------------------

describe("marketing a11y (axe per page)", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("landing route (/) has no axe violations", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/pages/landing",
        () =>
          jsonResponse(
            pagePayload("landing", "Run your business with TheApp", [
              heroBlock("Headline-A11y"),
            ]),
          ),
      ],
    ]);
    await mountAndAudit("/", "Headline-A11y");
  });

  it("pricing route (/pricing) has no axe violations", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/pages/pricing",
        () =>
          jsonResponse(
            pagePayload("pricing", "Pricing", [heroBlock("Pricing-A11y")]),
          ),
      ],
    ]);
    await mountAndAudit("/pricing", "Pricing-A11y");
  });

  it("trust route (/trust) has no axe violations", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/pages/trust",
        () =>
          jsonResponse(
            pagePayload("trust", "Trust", [heroBlock("Trust-A11y")]),
          ),
      ],
    ]);
    await mountAndAudit("/trust", "Trust-A11y");
  });

  it("about route (/about) has no axe violations", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/pages/about",
        () =>
          jsonResponse(
            pagePayload("about", "About", [heroBlock("About-A11y")]),
          ),
      ],
    ]);
    await mountAndAudit("/about", "About-A11y");
  });

  it("legal index (/legal) has no axe violations", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/documents",
        () =>
          jsonResponse(
            documentListPayload("legal", [
              {
                slug: "tos",
                title: "Terms of Service",
                summary: "Legal terms.",
              },
              {
                slug: "privacy",
                title: "Privacy Policy",
                summary: "Privacy terms.",
              },
            ]),
          ),
      ],
    ]);
    await mountAndAudit("/legal", "Terms of Service");
  });

  it("blog index (/blog) has no axe violations", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/documents",
        () =>
          jsonResponse(
            documentListPayload("blog", [
              {
                slug: "launch",
                title: "Launch Post",
                summary: "Hello world.",
              },
            ]),
          ),
      ],
    ]);
    await mountAndAudit("/blog", "Launch Post");
  });

  it("changelog index (/changelog) has no axe violations", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/documents",
        () =>
          jsonResponse(
            documentListPayload("changelog", [
              {
                slug: "v1-0",
                title: "v1.0 released",
                summary: "Initial GA.",
              },
            ]),
          ),
      ],
    ]);
    await mountAndAudit("/changelog", "v1.0 released");
  });

  it("document detail (/legal/:slug) has no axe violations", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/documents/legal/tos",
        () =>
          jsonResponse(
            documentDetailPayload(
              "legal",
              "tos",
              "Terms of Service",
              "<h2>Acceptance</h2><p>By using TheApp you accept these terms.</p>",
            ),
          ),
      ],
    ]);
    await mountAndAudit("/legal/tos", "Terms of Service");
  });

  it("docs index (/docs) has no axe violations", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/documents?type=docs",
        () =>
          jsonResponse(
            documentListPayload("docs", [
              {
                slug: "getting-started",
                title: "Getting started",
                summary: "Set up TheApp.",
              },
            ]),
          ),
      ],
    ]);
    // "Set up TheApp." appears only in the tile card summary, so it
    // uniquely identifies hydrated content (the title "Getting started"
    // is rendered twice: in the sidebar link and the card heading).
    await mountAndAudit("/docs", "Set up TheApp.");
  });

  it("docs detail (/docs/:slug) has no axe violations", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/documents?type=docs",
        () =>
          jsonResponse(
            documentListPayload("docs", [
              {
                slug: "getting-started",
                title: "Getting started",
                summary: "Set up TheApp.",
              },
            ]),
          ),
      ],
      [
        "/api/v1/cms/documents/docs/getting-started",
        () =>
          jsonResponse(
            documentDetailPayload(
              "docs",
              "getting-started",
              "Getting started",
              "<h2>Install</h2><p>Run the installer.</p>",
            ),
          ),
      ],
    ]);
    await mountAndAudit("/docs/getting-started", "Install");
  });
});
