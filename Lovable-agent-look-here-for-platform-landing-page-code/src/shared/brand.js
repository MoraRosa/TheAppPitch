/**
 * TheApp Brand Tokens
 *
 * Design tokens for TheApp's *own* brand surface (marketing site,
 * merchant account/billing UI, future docs/blog when wired through the
 * platform CMS). These are intentionally separate from any merchant
 * theme under apps/merchant/src/themes/ -- merchants control their own
 * admin chrome; TheApp controls what TheApp shows the world.
 *
 * Tokens are projected onto :root as CSS variables so styled-components
 * (and any plain CSS) can consume them with var(--brand-*). The :root
 * block is emitted by platformHeadCss() and inlined into every entry's
 * static <head> at build/serve time by the Vite plugin in
 * vite.config.js -- there is no runtime JS injection, so first paint is
 * correct with zero JavaScript and the token table ships exactly once.
 *
 * Peak Enterprise brand: a confident crimson primary with a soft pink
 * accent, set on calm cool-neutral surfaces. Every visual property a
 * component could need -- colour, type scale, weight, line-height,
 * spacing, radius, shadow, breakpoint, z-index, motion -- is a token
 * here so no surface ever reaches for a literal (Section 7.2).
 *
 * @module shared/brand
 */

export const brand = {
  color: {
    // Primary: crimson. Used for primary CTAs, headlines, links.
    // White text clears AA on 600/700; 700/900 clear AAA on the 50 tint.
    primary50: "#fff1f2",
    primary100: "#ffe4e6",
    primary500: "#e11d48",
    primary600: "#be123c",
    primary700: "#9f1239",
    primary900: "#881337",

    // Accent: pink. Highlights, badges, and decorative depth only --
    // never load-bearing body text (reserved for large text / non-text).
    accent500: "#ec4899",
    accent600: "#db2777",

    // Neutral: cool slate grays for a serene surface. Body text
    // (neutral900/700) clears AAA on neutral0/50; neutral500 is the
    // AA muted tone for subtitles and metadata.
    neutral0: "#ffffff",
    neutral50: "#f8fafc",
    neutral100: "#f1f5f9",
    neutral200: "#e2e8f0",
    neutral300: "#cbd5e1",
    neutral500: "#64748b",
    neutral700: "#334155",
    neutral900: "#0f172a",

    // Semantic contrast tokens (Section 7.2): guaranteed-readable text
    // colours for placement on the primary / accent / semantic fills.
    onPrimary: "#ffffff",
    onAccent: "#ffffff",

    // Semantic: success / warning / danger. The 50/200/700 ramp on
    // success and danger backs the standard banner pattern (tinted
    // surface, matching border, AAA-contrast text) used by AuthForm
    // and any other form-feedback surface.
    success50: "#f0fdf4",
    success200: "#bbf7d0",
    success500: "#10b981",
    success700: "#15803d",
    warning50: "#fffbeb",
    warning200: "#fde68a",
    warning500: "#f59e0b",
    warning700: "#b45309",
    danger50: "#fef2f2",
    danger200: "#fecaca",
    danger500: "#ef4444",
    danger700: "#b91c1c",
  },

  // System font stack. No Google Fonts at this stage so the marketing
  // bundle stays fast and the initial CSP can stay strict; brand font
  // selection happens with the CMS rollout.
  font: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  },

  // Modular type scale (1.200 minor-third steps, rem). Every readable
  // size on a platform surface maps to one of these -- no literal rem
  // font-sizes in components.
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },

  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  // Fluid display sizes (clamp: min, viewport-preferred, max) for
  // headings that should scale smoothly between mobile and desktop.
  // Semantic, not numeric, so callers pick intent not pixels.
  fontSizeFluid: {
    display: "clamp(2rem, 5vw, 3.25rem)",
    heading: "clamp(1.75rem, 4vw, 2.5rem)",
    headingSm: "clamp(1.75rem, 4vw, 2.25rem)",
    band: "clamp(1.5rem, 3vw, 2rem)",
  },

  lineHeight: {
    tight: "1.15",
    snug: "1.3",
    normal: "1.5",
    relaxed: "1.65",
  },

  letterSpacing: {
    tight: "-0.01em",
    normal: "0",
    // Eyebrow / small-caps tracking. `wide` backs the common 0.04-0.06em
    // uppercase labels; `wider` the rarer 0.08-0.1em treatments.
    wide: "0.05em",
    wider: "0.1em",
  },

  space: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
  },

  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "24px",
    full: "9999px",
  },

  // Hairline / emphasis border widths. `thick` also backs focus-ring
  // outlines; `emphasis` is the accent rule (e.g. blockquote bar).
  borderWidth: {
    hairline: "1px",
    thick: "2px",
    emphasis: "3px",
  },

  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    // Soft ambient lift for cards -- calm, not heavy.
    card: "0 10px 30px -12px rgb(15 23 42 / 0.18)",
    // Glass panel: layered soft shadow used with a translucent fill and
    // backdrop blur for the nav pill / frosted surfaces.
    glass: "0 8px 32px -8px rgb(15 23 42 / 0.2)",
  },

  // Translucent fills + blur radius for the tasteful glass treatment.
  glass: {
    fill: "rgb(255 255 255 / 0.7)",
    fillStrong: "rgb(255 255 255 / 0.85)",
    border: "rgb(255 255 255 / 0.6)",
    blur: "12px",
    // Dim behind modal drawers/overlays (neutral900 @ 40%).
    scrim: "rgb(15 23 42 / 0.4)",
  },

  // Named breakpoints. Consumed as var(--brand-breakpoint-md) inside
  // styled-components media queries so the mobile/desktop cutovers are
  // one source of truth (navbar, block grids).
  breakpoint: {
    sm: "480px",
    md: "768px",
    lg: "1024px",
  },

  // Stacking order. The mobile menu overlay sits above page chrome.
  zIndex: {
    base: "0",
    header: "100",
    overlay: "900",
    menu: "1000",
  },

  // Motion tokens. All motion is gated behind prefers-reduced-motion at
  // the consumer; these define the calm default timings.
  motion: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Layout caps + intrinsic track sizes used across marketing and
  // account. The `*Col`/`gridColMin*` values are grid-track intrinsics
  // (min column width before wrap), tokenised so responsive card grids
  // share one set of breakpoints-in-miniature rather than ad-hoc px.
  size: {
    contentMax: "1200px",
    panelMax: "480px",
    proseMax: "760px",
    sidebarCol: "240px",
    gridColMinSm: "160px",
    gridColMin: "220px",
    gridColMinLg: "260px",
  },

  // Focus-ring geometry. Centralised so every focus-visible outline
  // across the app shares one offset (paired with borderWidth.thick as
  // the ring width and color.primary500 as the ring colour).
  focusRing: {
    offset: "2px",
  },
};

/**
 * The brand tokens projected onto :root as CSS custom properties, as a
 * plain CSS string (no surrounding <style> tag). This is the single
 * serialization of the token table; platformHeadCss() wraps it with the
 * base reset for inlining into <head>. Kept as a discrete export so the
 * token block can be asserted in isolation by tests.
 *
 * @returns {string} CSS text: `:root { --brand-*: ...; }`
 */
export function brandVariablesCss() {
  const lines = [];
  for (const [group, values] of Object.entries(brand)) {
    for (const [key, value] of Object.entries(values)) {
      lines.push(`  --brand-${group}-${key}: ${value};`);
    }
  }
  return `:root {\n${lines.join("\n")}\n}`;
}

/**
 * The complete CSS inlined into every platform entry's static <head> at
 * build/serve time (by the Vite plugin in vite.config.js). It is the
 * single, authoritative first-paint stylesheet for TheApp's own
 * surfaces and is generated entirely from the brand tokens above, so
 * there is one source of truth and no literal hardcoded in any HTML.
 *
 * It contains, in order:
 *   1. the :root { --brand-* } token block (brandVariablesCss), which
 *      every styled-components rule consumes via var(--brand-*); and
 *   2. the base html/body reset (margin/padding/background/color/font).
 *
 * Why inline, and why this is the whole mechanism: both the marketing
 * site (prerendered by vite-react-ssg) and the account SPA render their
 * chrome with styled-components, whose rules only apply once the JS
 * bundle hydrates. Without the token block present before hydration,
 * every var(--brand-*) in the prerendered markup resolves to nothing
 * and the page flashes unstyled (FOUC). Inlining this block in <head>
 * -- rather than injecting it from JavaScript at runtime -- makes first
 * paint correct with zero JS and ships the token table exactly once per
 * document (no static + runtime duplication). Inlined critical CSS is
 * also faster to first paint than a separately linked, render-blocking
 * stylesheet. The platform surface is a single light palette (no dark
 * mode / theme toggle), so no prefers-color-scheme or [data-theme]
 * branches are needed.
 *
 * @returns {string} CSS text (no surrounding <style> tag).
 */
/**
 * Breakpoint min-widths as a JS map, mirroring brand.breakpoint. CSS
 * @media queries cannot evaluate var(--brand-breakpoint-*) (media
 * features do not resolve custom properties), so styled-components
 * media blocks consume these string values via the `media` helper
 * below. The CSS-variable form still exists for any non-media use.
 *
 * @type {{ sm: string, md: string, lg: string }}
 */
export const breakpoints = brand.breakpoint;

/**
 * Media-query helpers for styled-components. `media.up.md` yields a
 * min-width query string; `media.down.md` a max-width query one pixel
 * below the breakpoint (so up/down never overlap). Usage:
 *   ${media.down.md} { ... mobile ... }
 *   ${media.up.md}   { ... desktop ... }
 */
export const media = {
  up: Object.fromEntries(
    Object.entries(brand.breakpoint).map(([k, v]) => [
      k,
      `@media (min-width: ${v})`,
    ]),
  ),
  down: Object.fromEntries(
    Object.entries(brand.breakpoint).map(([k, v]) => [
      k,
      `@media (max-width: ${parseInt(v, 10) - 1}px)`,
    ]),
  ),
};

export function platformHeadCss() {
  return [
    brandVariablesCss(),
    "html, body {",
    "  margin: 0;",
    "  padding: 0;",
    `  background: ${brand.color.neutral0};`,
    `  color: ${brand.color.neutral900};`,
    `  font-family: ${brand.font.sans};`,
    `  font-size: ${brand.fontSize.base};`,
    `  line-height: ${brand.lineHeight.normal};`,
    "}",
  ].join("\n");
}
