/**
 * brand.js -- token SSOT + first-paint head CSS contract.
 *
 * These tests lock the FOUC-prevention design: the brand tokens are the
 * single source of truth, they serialize to a :root variable block, and
 * that block (plus the base reset) is what platformHeadCss inlines into
 * every entry's <head> at build time. They also guard against
 * reintroducing the runtime JS injection that previously shipped the
 * token table a second time.
 */
import { describe, it, expect } from "vitest";
import * as brandModule from "./brand.js";
import {
  brand,
  brandVariablesCss,
  platformHeadCss,
  breakpoints,
  media,
} from "./brand.js";

describe("brandVariablesCss -- token projection", () => {
  it("wraps the variables in a single :root block", () => {
    const css = brandVariablesCss();
    expect(css.startsWith(":root {")).toBe(true);
    expect(css.trimEnd().endsWith("}")).toBe(true);
    expect(css.match(/:root \{/g)).toHaveLength(1);
  });

  it("emits one --brand-<group>-<key> line for every token", () => {
    const css = brandVariablesCss();
    const expected = Object.entries(brand).reduce(
      (sum, [, values]) => sum + Object.keys(values).length,
      0,
    );
    const declared = css.match(/--brand-[a-z0-9-]+:/gi) || [];
    expect(declared).toHaveLength(expected);
  });

  it("projects each token value verbatim under its namespaced custom property", () => {
    const css = brandVariablesCss();
    for (const [group, values] of Object.entries(brand)) {
      for (const [key, value] of Object.entries(values)) {
        expect(css).toContain(`--brand-${group}-${key}: ${value};`);
      }
    }
  });
});

describe("platformHeadCss -- inlined first-paint stylesheet", () => {
  it("contains the full :root token block", () => {
    expect(platformHeadCss()).toContain(brandVariablesCss());
  });

  it("sets the base html/body reset from tokens (no hardcoded literals)", () => {
    const css = platformHeadCss();
    expect(css).toContain(`background: ${brand.color.neutral0};`);
    expect(css).toContain(`color: ${brand.color.neutral900};`);
    expect(css).toContain(`font-family: ${brand.font.sans};`);
    expect(css).toContain(`font-size: ${brand.fontSize.base};`);
    expect(css).toContain(`line-height: ${brand.lineHeight.normal};`);
  });

  it("carries no surrounding <style> tag (the plugin adds it)", () => {
    expect(platformHeadCss()).not.toMatch(/<\/?style/i);
  });
});

describe("design-system token groups -- completeness contract", () => {
  // These groups back the platform's zero-hardcoding posture: type
  // scale, weight, line-height, letter-spacing, breakpoints, z-index,
  // motion, glass, and on-* contrast tokens must exist so no surface
  // has any excuse to reach for a literal (Section 7.2).
  const REQUIRED_GROUPS = [
    "color",
    "font",
    "fontSize",
    "fontSizeFluid",
    "fontWeight",
    "lineHeight",
    "letterSpacing",
    "space",
    "radius",
    "borderWidth",
    "shadow",
    "glass",
    "breakpoint",
    "zIndex",
    "motion",
    "size",
    "focusRing",
  ];

  it("exposes every required token group", () => {
    for (const group of REQUIRED_GROUPS) {
      expect(brand).toHaveProperty(group);
      expect(Object.keys(brand[group]).length).toBeGreaterThan(0);
    }
  });

  it("carries semantic on-* contrast tokens for colored fills", () => {
    expect(brand.color).toHaveProperty("onPrimary");
    expect(brand.color).toHaveProperty("onAccent");
  });

  it("projects the type scale as --brand-fontSize-* custom properties", () => {
    const css = brandVariablesCss();
    for (const key of Object.keys(brand.fontSize)) {
      expect(css).toContain(`--brand-fontSize-${key}: ${brand.fontSize[key]};`);
    }
  });
});

describe("breakpoints + media helpers", () => {
  it("mirrors brand.breakpoint", () => {
    expect(breakpoints).toBe(brand.breakpoint);
  });

  it("builds non-overlapping up/down media queries", () => {
    expect(media.up.md).toBe(`@media (min-width: ${brand.breakpoint.md})`);
    // down.md is one pixel below the breakpoint so up/down never overlap.
    const px = parseInt(brand.breakpoint.md, 10);
    expect(media.down.md).toBe(`@media (max-width: ${px - 1}px)`);
  });
});

describe("no runtime brand injection", () => {
  it("does not export injectBrandVariables (inlined head CSS is the only mechanism)", () => {
    expect(brandModule).not.toHaveProperty("injectBrandVariables");
  });
});
