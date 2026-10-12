/**
 * Marketing routes contract tests. Mocks global fetch with payloads
 * shaped exactly like the public CMS endpoints (matches the response
 * envelopes in backend/src/plugins/platformContent/*) and walks the
 * top-level routes to verify the page renderers wire blocks + refs
 * through correctly. Block-level invariants (comparison_table feature
 * resolution, pricing_card_grid_meta enterprise override) are
 * exercised through full page renders rather than in isolation so the
 * registry wiring is also covered.
 *
 * Routes are mounted through createMemoryRouter so this exercises the
 * exact data-router shape vite-react-ssg consumes at build time.
 */

import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { APP_METADATA } from "@theapp/config";
import { routes } from "./routes.jsx";

function renderAt(initialEntries) {
  const router = createMemoryRouter(routes, { initialEntries });
  // v7_startTransition lives on RouterProvider (not the router
  // constructor) in react-router-dom v6 -- mirrors what vite-react-ssg
  // does at boot so test output stays free of the future-flag warning.
  return render(
    <RouterProvider router={router} future={{ v7_startTransition: true }} />,
  );
}

// ---- payload fixtures ---------------------------------------------------

const PLANS_FIXTURE = [
  {
    code: "starter",
    name: "Starter",
    display_order: 1,
    features_json: { limits: { team_seats: 3 }, sla: false },
    prices: [
      { currency: "usd", interval: "month", unit_amount_minor: 1900 },
      { currency: "usd", interval: "year", unit_amount_minor: 19000 },
    ],
  },
  {
    code: "growth",
    name: "Growth",
    display_order: 2,
    features_json: { limits: { team_seats: 10 }, sla: true },
    prices: [
      { currency: "usd", interval: "month", unit_amount_minor: 4900 },
      { currency: "usd", interval: "year", unit_amount_minor: 49000 },
    ],
  },
  {
    code: "enterprise",
    name: "Enterprise",
    display_order: 9,
    features_json: { limits: { team_seats: -1 }, sla: true },
    prices: [],
  },
];

function landingPagePayload() {
  return {
    data: {
      page: {
        slug: "landing",
        locale: "en",
        title: "Run your business with TheApp",
        meta_description: "All-in-one platform.",
        meta_keywords: null,
        canonical_path: "/",
        revision_number: 1,
        published_at: "2026-05-01T00:00:00Z",
        blocks: [
          {
            type: "hero",
            headline: "Headline-XYZ",
            subheadline: "Subheadline-XYZ",
            primary_cta_label: "Start free",
            primary_cta_href: "/pricing",
          },
          {
            type: "comparison_table",
            heading: "Compare plans",
            plan_codes: ["starter", "growth", "enterprise"],
            rows: [
              {
                label: "Team seats",
                feature_key: "limits.team_seats",
                format: "number",
              },
              { label: "SLA", feature_key: "sla", format: "boolean" },
            ],
          },
          {
            type: "pricing_card_grid_meta",
            heading: "Pricing",
            enterprise_card: {
              name: "Enterprise",
              description: "Custom enterprise contract.",
              cta_label: "Talk to sales",
              cta_href: "/contact",
            },
          },
        ],
      },
      refs: { plans: PLANS_FIXTURE },
    },
  };
}

function legalDocumentPayload() {
  return {
    data: {
      document: {
        slug: "tos",
        doc_type: "legal",
        locale: "en",
        title: "Terms of Service",
        summary: "Legal terms governing use of TheApp.",
        meta_description: "Terms of Service for TheApp.",
        canonical_path: "/legal/tos",
        body_html:
          '<h2>Acceptance</h2><p data-testid="tos-body">By using TheApp you accept these terms.</p>',
        effective_at: "2026-04-01T00:00:00Z",
        tags: [],
        author_name: null,
        revision_number: 1,
        published_at: "2026-04-01T00:00:00Z",
      },
    },
  };
}

function docsListPayload() {
  return {
    data: {
      documents: [
        {
          slug: "getting-started",
          title: "Getting started",
          summary: "Set up TheApp and ship your first product.",
          published_at: "2026-05-10T00:00:00Z",
        },
        {
          slug: "api-overview",
          title: "API overview",
          summary: "Endpoints, auth, and rate limits.",
          published_at: "2026-05-11T00:00:00Z",
        },
      ],
    },
  };
}

function docsDetailPayload() {
  return {
    data: {
      document: {
        slug: "getting-started",
        doc_type: "docs",
        locale: "en",
        title: "Getting started",
        summary: "Set up TheApp and ship your first product.",
        canonical_path: "/docs/getting-started",
        body_html:
          '<h2>Install</h2><p data-testid="docs-body">Run the installer.</p>',
        tags: [],
        author_name: null,
        revision_number: 1,
        published_at: "2026-05-10T00:00:00Z",
      },
    },
  };
}

// ---- fetch mock ---------------------------------------------------------

function jsonResponse(body, { status = 200 } = {}) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

function installFetchRouter(routes) {
  const fn = vi.fn((url) => {
    const u = String(url);
    for (const [pattern, handler] of routes) {
      if (u.includes(pattern)) return handler();
    }
    return jsonResponse({ error: { code: "not_found" } }, { status: 404 });
  });
  globalThis.fetch = fn;
  return fn;
}

// ---- tests --------------------------------------------------------------

describe("marketing routes", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("renders the chrome on every route (header brand link)", async () => {
    installFetchRouter([
      ["/api/v1/cms/pages/landing", () => jsonResponse(landingPagePayload())],
    ]);
    renderAt(["/"]);
    // First test in this file pays cold-start parse + loader-resolve cost
    // for the full route table; the testing-library default 1s findBy*
    // timeout is occasionally short here. Subsequent tests in the same
    // file reuse warmed modules and resolve well under 1s.
    expect(
      await screen.findByRole(
        "link",
        { name: APP_METADATA.NAME },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
  });

  it("renders the landing page blocks from a sample payload", async () => {
    installFetchRouter([
      ["/api/v1/cms/pages/landing", () => jsonResponse(landingPagePayload())],
    ]);

    renderAt(["/"]);

    expect(await screen.findByText("Headline-XYZ")).toBeInTheDocument();
    expect(screen.getByText("Subheadline-XYZ")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start free" })).toHaveAttribute(
      "href",
      "/pricing",
    );
  });

  it("renders comparison_table cells from refs.plans (dotted-path resolution)", async () => {
    installFetchRouter([
      ["/api/v1/cms/pages/landing", () => jsonResponse(landingPagePayload())],
    ]);

    renderAt(["/"]);

    const table = await screen.findByRole("table");
    const utils = within(table);

    // Column headers come from refs.plans
    expect(
      utils.getByRole("columnheader", { name: "Starter" }),
    ).toBeInTheDocument();
    expect(
      utils.getByRole("columnheader", { name: "Growth" }),
    ).toBeInTheDocument();
    expect(
      utils.getByRole("columnheader", { name: "Enterprise" }),
    ).toBeInTheDocument();

    // Row label + values resolved from features_json
    const seatsRow = utils
      .getByRole("rowheader", { name: "Team seats" })
      .closest("tr");
    const seatCells = within(seatsRow).getAllByRole("cell");
    expect(seatCells[0]).toHaveTextContent("3");
    expect(seatCells[1]).toHaveTextContent("10");
    expect(seatCells[2]).toHaveTextContent("Unlimited");

    const slaRow = utils.getByRole("rowheader", { name: "SLA" }).closest("tr");
    const slaCells = within(slaRow).getAllByRole("cell");
    expect(slaCells[0]).toHaveTextContent("\u2014");
    expect(slaCells[1]).toHaveTextContent("\u2713");
    expect(slaCells[2]).toHaveTextContent("\u2713");
  });

  it("pricing_card_grid_meta excludes plans with no prices and renders enterprise_card override", async () => {
    installFetchRouter([
      ["/api/v1/cms/pages/landing", () => jsonResponse(landingPagePayload())],
    ]);

    renderAt(["/"]);

    // Wait for hydrated content.
    await screen.findByText("Headline-XYZ");

    // Standard cards rendered for plans with prices.
    expect(screen.getAllByText("Starter").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Growth").length).toBeGreaterThan(0);

    // The card must render the formatted amount from the catalog. The
    // default toggle picks the first currency/interval (usd / month),
    // so Starter shows $19 and Growth shows $49. This guards the
    // unit_amount_minor field name against silently regressing to a
    // blank price (the field the backend catalog actually delivers).
    expect(screen.getByText("$19")).toBeInTheDocument();
    expect(screen.getByText("$49")).toBeInTheDocument();

    // Enterprise card override (description + CTA from block.enterprise_card)
    expect(screen.getByText("Custom enterprise contract.")).toBeInTheDocument();
    const enterpriseCta = screen.getByRole("link", { name: "Talk to sales" });
    expect(enterpriseCta).toHaveAttribute("href", "/contact");

    // No pricing card for the empty-prices plan would render a price string
    // like "$" -- assert the enterprise CTA is the only Enterprise CTA.
    expect(screen.getAllByRole("link", { name: "Talk to sales" })).toHaveLength(
      1,
    );
  });

  it("renders document detail body_html for /legal/:slug", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/documents/legal/tos",
        () => jsonResponse(legalDocumentPayload()),
      ],
    ]);

    renderAt(["/legal/tos"]);

    expect(
      await screen.findByRole("heading", {
        name: "Terms of Service",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Acceptance", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("tos-body")).toHaveTextContent(
      "By using TheApp you accept these terms.",
    );
  });

  it("returns the NotFound page for unknown CMS slugs (404 from API)", async () => {
    installFetchRouter([
      // Default 404 from the router catches the request.
    ]);

    renderAt(["/unknown-marketing-slug"]);

    expect(
      await screen.findByRole("heading", { name: "Page not found", level: 1 }),
    ).toBeInTheDocument();
  });

  it("renders the /docs index with sidebar TOC + tile cards from the docs list", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/documents?type=docs",
        () => jsonResponse(docsListPayload()),
      ],
    ]);

    renderAt(["/docs"]);

    expect(
      await screen.findByRole("heading", { name: "Documentation", level: 1 }),
    ).toBeInTheDocument();

    const sidebar = screen.getByRole("complementary", {
      name: "Documentation navigation",
    });
    expect(
      within(sidebar).getByRole("link", { name: "Getting started" }),
    ).toHaveAttribute("href", "/docs/getting-started");
    expect(
      within(sidebar).getByRole("link", { name: "API overview" }),
    ).toHaveAttribute("href", "/docs/api-overview");
  });

  it("renders /docs/:slug detail with sidebar TOC still visible", async () => {
    installFetchRouter([
      [
        "/api/v1/cms/documents?type=docs",
        () => jsonResponse(docsListPayload()),
      ],
      [
        "/api/v1/cms/documents/docs/getting-started",
        () => jsonResponse(docsDetailPayload()),
      ],
    ]);

    renderAt(["/docs/getting-started"]);

    expect(
      await screen.findByRole("heading", { name: "Getting started", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("docs-body")).toHaveTextContent(
      "Run the installer.",
    );
    // Sidebar TOC still mounted on the detail route.
    const sidebar = screen.getByRole("complementary", {
      name: "Documentation navigation",
    });
    expect(
      within(sidebar).getByRole("link", { name: "Getting started" }),
    ).toBeInTheDocument();
  });
});
