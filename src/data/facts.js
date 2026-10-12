// ─── FACTS: SINGLE SOURCE OF TRUTH ────────────────────────────────────────────
// Every number, price, claim and source used by the decks, plan, financials,
// founder page and PDF/PPTX exports starts here. config.js and financials.js
// only re-shape these values; they do not hold numbers of their own.
//
// Rules:
//  - Confirmed facts come from Hikmah. Researched numbers carry a `source`.
//  - Anything modelled (not measured) is labelled `modelled`. Never present it as a result.
//  - Open questions live in OPEN_QUESTIONS below so nothing is silently assumed.
//  - Update TRACTION and MRR_TRACKER monthly; everything else follows.

// ── Product status (confirmed) ────────────────────────────────────────────────
export const PRODUCT = {
  stage: 'MVP',
  liveNow: ['Storefront', 'Cart & checkout', 'Shipping (connected)', 'Scheduling', 'Stripe Connect payments', 'Transaction fees', 'Custom domains'],
};

// Themes (confirmed). Each is a fully unique experience: no shared UI primitives or visual leakage between themes.
// Storefront themes and admin themes are separate sets; the 5th storefront theme is in progress.
export const THEMES = {
  liveCount: 4,
  inProgress: ['Soft Matter (claymorphism)'],
  storefront: [
    { name: 'Soft Pink',  for: 'beauty, skincare, lifestyle' },
    { name: 'Editorial',  for: 'luxury, fashion, niche publishing' },
    { name: 'Brutalism',  for: 'challenger brands: beauty, streetwear, snacks, tech accessories' },
    { name: 'Axiom',      for: 'software, hardware, tools, design-forward brands' },
  ],
};

// ── Traction (confirmed) ──────────────────────────────────────────────────────
export const TRACTION_FACTS = {
  asOf: '2026-10',
  activeUsers: 8,
  paidUsers: 2,
  mrr: 60, // subscription revenue only; transaction fees are live but tracked separately
  paidMarketing: false,
  // 2 of 8 is a tiny sample: describe it as an early signal, never as a conversion rate.
  earlySignalNote: '2 of 8 active users converted to paid: an early signal, not a conversion rate.',
};

// One row per month. Add a row each month; the Financials page reads this.
export const MRR_TRACKER = [
  { month: '2026-10', activeUsers: 8, paidUsers: 2, mrr: 60 },
];

// Confirm both merchants consent to being shown before they appear on any slide.
export const PAYING_MERCHANTS = [
  { name: 'Circle of Care Counselling', url: 'https://circleofcarecounselling.com', consentConfirmed: false },
  { name: 'Huchflex', url: 'https://huchflex-p340.peakenterprise.ca', note: 'will move to the merchant\'s own domain', consentConfirmed: false },
];

// Projects live on Peak (replaces Momentum and Mizzie). Links and screenshots to come.
export const LIVE_PROJECTS = [];

// ── Pricing (confirmed, per month, CAD) ───────────────────────────────────────
export const PLANS = [
  { id: 'starter', name: 'Starter', price: 30,    display: '$30' },
  { id: 'grow',    name: 'Grow',    price: 49.99, display: '$50' }, // show as $50
  { id: 'pro',     name: 'Pro',     price: 100,   display: '$100' },
];
export const TRANSACTION_FEE = '0.5–1%'; // confirmed by Hikmah
// Free plan (minimal storage) exists. Grow and Pro include a 3-day free trial.
export const FREE_PLAN = { name: 'Free', price: 0, note: 'minimal storage' };
export const TRIAL = { days: 3, plans: ['Grow', 'Pro'] };
export const ARPU_TODAY = 30; // real: both paying merchants are on Starter
// Illustrative mix: 60% Starter / 30% Grow / 10% Pro = $42.997, shown as $43
export const ARPU_MIX = Math.round(0.6 * 30 + 0.3 * 49.99 + 0.1 * 100);

// ── The ask (confirmed) ───────────────────────────────────────────────────────
export const ASK = {
  grants: 100000,
  investment: 1000000,
  grantsNamedOnSlides: false, // no grants are named on slides; Zensurance is no longer pursued
};

// ── Growth stages (confirmed). Numbers are PAYING merchants. ──────────────────
export const STAGE_TARGETS = [
  { stage: 1, label: 'Stage 1', payingUsers: 40 },
  { stage: 2, label: 'Stage 2', payingUsers: 400 },
  { stage: 3, label: 'Stage 3', payingUsers: 4000, then: 'Hire: marketing, branding' },
];

// Sign-ups needed to reach each stage at a given sign-up-to-paid rate.
// Rates are planning sensitivities, not measurements (we have 2 of 8).
export const CONVERSION_SENSITIVITY = [0.10, 0.20, 0.30];

export function stageLadder() {
  return STAGE_TARGETS.map(s => {
    const mrrLow = s.payingUsers * ARPU_TODAY;
    const mrrHigh = s.payingUsers * ARPU_MIX;
    return {
      ...s,
      mrrLow, mrrHigh,
      arrLow: mrrLow * 12, arrHigh: mrrHigh * 12,
      signupsNeeded: CONVERSION_SENSITIVITY.map(r => ({ rate: r, signups: Math.ceil(s.payingUsers / r) })),
    };
  });
}

// ── Unit economics: MODELLED, not measured ────────────────────────────────────
export const UNIT_ECON_MODEL = {
  label: 'modelled',
  monthlyChurn: 0.05, // inside the typical SMB SaaS range; no real churn data yet
  ltvToday: ARPU_TODAY / 0.05,  // $600 (revenue basis)
  ltvMix: ARPU_MIX / 0.05,      // $860 (revenue basis)
  cac: null,                    // NOT measured: no paid acquisition yet
  targets: { ltvCacMin: 3, paybackMonthsMax: 12 }, // targets, not claims
};

// ── Market (researched, with sources) ─────────────────────────────────────────
export const MARKET_FACTS = {
  canadaSmallEmployers: { value: 1074939, of: 1095251, share: '98.1%', year: 2023, note: 'employer businesses with 1-99 employees',
    source: 'ISED, Key Small Business Statistics 2024 (ised-isde.canada.ca/smeresearch)' },
  usSmallBusinesses: { value: 36207130, share: '99.9%', nonEmployer: 30400000,
    source: 'SBA Office of Advocacy, FAQ About Small Business 2026 (advocacy.sba.gov); non-employer split from SBA 2025 Small Business Profile' },
  globalSaaSMarket: { value: '$14 billion', year: 2027, source: null }, // UNSOURCED, carried over: verify or drop
};

// ── Benchmarks used in wording (researched) ───────────────────────────────────
export const BENCHMARKS = {
  ltvCac: '3:1 is the common benchmark; 8-10x often reads as unrealistic; SMB SaaS payback under 12 months (feinternational.com)',
  preSeedMedian: 'about $1M (Carta State of Pre-seed 2025, via cbinsights.com)',
  seedMrr: 'seed investors typically want about $10K-$50K MRR (angelbacked.co)',
  canadianSeed: 'average seed about $3.0M, H1 2025 (CVCA)',
};

// ── Use of funds: ILLUSTRATIVE DRAFT (Hikmah to edit) ─────────────────────────
export const USE_OF_FUNDS = {
  illustrative: true,
  grants: {
    goal: 'Reach Stage 1-2 (40 to 400 paying merchants)',
    // Split below is a placeholder; the plan only named the purposes, not the amounts.
    items: [
      { label: 'Product hardening',        pct: 30 },
      { label: 'Infrastructure',           pct: 20 },
      { label: 'Onboarding',               pct: 25 },
      { label: 'First marketing tests',    pct: 25 },
    ],
  },
  investment: {
    goal: 'Reach Stage 3 (4,000 paying merchants), first hires, runway',
    items: [
      { label: 'Product & engineering',     pct: 35 },
      { label: 'Sales & marketing',         pct: 30 },
      { label: 'Brand & identity (rename)', pct: 10 },
      { label: 'Customer success',          pct: 10 },
      { label: 'Infrastructure & compliance', pct: 5 },
      { label: 'Reserve',                   pct: 10 },
    ],
  },
};

// ── Modules: plain names first (audience is non-technical) ────────────────────
export const MODULES = [
  { name: 'Storefront' }, { name: 'Products' }, { name: 'Orders' }, { name: 'Payments' },
  { name: 'Shipping' }, { name: 'Scheduling' },
  { name: 'Customers', brand: 'Constellation' },
  { name: 'Costing', brand: 'Pulse' },
  { name: 'Tasks', brand: 'Compass' },
  { name: 'Email' }, { name: 'Content' },
];

// ── Build facts carried over from the earlier deck: re-verify before quoting ──
export const BUILD = { apiEndpoints: 23, dbTables: 21 };

// ── Approved wording ──────────────────────────────────────────────────────────
export const WORDING = {
  competition:
    'Shopify has no native production costing, so makers add a separate costing app and keep two systems in sync. ' +
    'Peak puts costing, inventory, storefront, bookings and customers in one database, so there is nothing to sync.',
  weakness: 'No strong brand identity yet; a rename is planned.',
};

// ── Open questions (nothing below is assumed in the content) ──────────────────
export const OPEN_QUESTIONS = [
  'Both paying merchants: consent to be shown on slides?',
  'Source or removal of the $14B global SaaS figure.',
  'Roadmap items still ahead: GST/HST tax engine, 5th storefront theme (Soft Matter), AI agent API, US expansion.',
  'Admin themes: how many exist today?',
  'API endpoint and table counts (23+, 21+): re-count from the code, or drop them (the audience is non-technical).',
  'Grant use-of-funds split (amounts were not specified).',
];
