/**
 * BrandLayout -- responsive navbar (Phase 2) behaviour + a11y contract.
 *
 * The header renders a desktop cluster (inline nav + right controls) and
 * a mobile hamburger that opens an accessible dialog drawer. jsdom has no
 * layout engine, so the media-query show/hide is not asserted here (that
 * is a token/CSS concern covered by brand.test.js); these tests pin the
 * interaction contract that must hold regardless of viewport: the toggle
 * exposes aria-expanded/aria-controls, the drawer is a labelled modal
 * dialog, Escape and the scrim close it, and focus returns to the toggle.
 */

import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { APP_METADATA } from "@theapp/config";
import BrandLayout from "./BrandLayout.jsx";

function renderLayout(props) {
  return render(
    <MemoryRouter>
      <BrandLayout
        nav={
          <>
            <a href="/pricing">Pricing</a>
            <a href="/trust">Trust</a>
          </>
        }
        headerRight={<a href="/login">Sign in</a>}
        {...props}
      >
        <p>Body content</p>
      </BrandLayout>
    </MemoryRouter>,
  );
}

describe("BrandLayout -- responsive navbar", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("renders the hamburger toggle collapsed by default", () => {
    renderLayout();
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "brand-mobile-menu");
    expect(toggle).toHaveAttribute("aria-haspopup", "dialog");
    // Drawer dialog is not mounted until opened.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a labelled modal drawer with the nav links when toggled", () => {
    renderLayout();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    // Nav links are reachable inside the drawer.
    expect(
      within(dialog).getByRole("link", { name: "Pricing" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("link", { name: "Sign in" }),
    ).toBeInTheDocument();
  });

  it("locks body scroll while the drawer is open and restores it on close", () => {
    renderLayout();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes on Escape and returns focus to the toggle", () => {
    renderLayout();
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });

  it("closes when the scrim is clicked", () => {
    renderLayout();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    // The scrim is the sibling overlay rendered before the dialog; click
    // it via its position (first fixed overlay). It has no role, so query
    // the dialog's preceding element through the DOM.
    const dialog = screen.getByRole("dialog");
    const scrim = dialog.previousElementSibling;
    expect(scrim).not.toBeNull();
    fireEvent.click(scrim);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("omits the hamburger entirely when there is no nav or right content", () => {
    render(
      <MemoryRouter>
        <BrandLayout>
          <p>Body only</p>
        </BrandLayout>
      </MemoryRouter>,
    );
    expect(
      screen.queryByRole("button", { name: "Open menu" }),
    ).not.toBeInTheDocument();
    // Brand link still renders.
    expect(
      screen.getByRole("link", { name: APP_METADATA.NAME }),
    ).toBeInTheDocument();
  });
});
