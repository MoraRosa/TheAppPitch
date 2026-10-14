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
  adminCount: 3,
  inProgress: ['Soft Matter (claymorphism)'],
  admin: ['Pink', 'Midnight Ledger', 'Bare'],
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
  firstUserDate: '2026-09-02', // first official user
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

// Both paying merchants gave verbal consent to show their websites (and possibly logos). Not their names or numbers beyond that.
export const PAYING_MERCHANTS = [
  { name: 'Circle of Care Counselling', url: 'https://circleofcarecounselling.com', consent: 'verbal: website, maybe logo' },
  { name: 'Huchflex', url: 'https://huchflex-p340.peakenterprise.ca', note: 'will move to the merchant\'s own domain', consent: 'verbal: website, maybe logo' },
];

// Sites shown as product proof. Grolead is the founder's own test account (not paying), on a custom domain.
export const LIVE_SITES = [
  { name: 'Circle of Care Counselling', host: 'circleofcarecounselling.com', url: 'https://circleofcarecounselling.com', paying: true,  kind: 'Counselling practice' },
  { name: 'Huchflex',                   host: 'huchflex-p340.peakenterprise.ca', url: 'https://huchflex-p340.peakenterprise.ca', paying: true,  kind: 'Paying merchant' },
  { name: 'Grolead',                    host: 'grolead.com', url: 'https://grolead.com', paying: false, kind: 'Founder test account, custom domain' },
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

// ── Market (researched, with sources; see docs/market-research.md) ───────────
const ISED = 'ISED, Key Small Business Statistics 2025 (ised-isde.canada.ca/site/sme-research-statistics/en/node/439)';
export const MARKET_FACTS = {
  canada: {
    asOf: 'December 2024',
    smallEmployers: { value: 1079188, of: 1099521, share: '98.2%', note: 'employer businesses with 1-99 employees', source: ISED },
    nonEmployers:   { value: 3480000, note: 'businesses with no employees and annual revenue above $30,000',
      source: 'Statistics Canada, Canadian business counts, December 2024 (The Daily, 2025-02-14)' },
    alberta:        { smallEmployers: 137182, source: ISED },
    onlineSelling:  { share: '32%', year: 2021, note: 'of small businesses had online sales (33% of all businesses)',
      source: 'Statistics Canada, Survey of Digital Technology and Internet Use, 2021 (article 13-605-X)' },
    // Third-party tracker estimates (StoreLeads), not Shopify's own numbers. Two published figures differ by date and definition.
    shopifyStores:  { low: 131033, high: 170307, note: 'live / active Shopify stores in Canada',
      source: 'StoreLeads (storeleads.app/reports/shopify/CA), and a StoreLeads pull dated 2026-06-01 reported by eightx.co' },
  },
  usSmallBusinesses: { value: 36207130, share: '99.9%', nonEmployer: 30400000,
    source: 'SBA Office of Advocacy, FAQ About Small Business 2026 (advocacy.sba.gov); non-employer split from SBA 2025 Small Business Profile' },
  // Closest published category to Peak. Analyst firms disagree on size because they define the market differently.
  globalEcommercePlatform: { y2025: '$9.07 billion', y2030: '$16.5 billion', cagr: '12.7%',
    source: 'MarketsandMarkets, via ResearchAndMarkets (Business Wire, Aug 2025)',
    caveat: 'Other analyst firms publish different sizes (for example $6.1B in 2023 for "e-commerce software"), so show it as one estimate, not a fact.' },
};

// Canadian small EMPLOYER businesses (1-99 employees) in the industries where Peak's customer types sit.
// This is an upper bound by industry, not a count of businesses that fit Peak: it includes some that do not (heavy manufacturing, care homes).
// Non-employer businesses (sole operators) are not split by industry here; see OPEN_QUESTIONS.
export const TARGET_INDUSTRIES = [
  { industry: 'Professional, scientific and technical services', small: 150105 },
  { industry: 'Health care and social assistance',               small: 119783 },
  { industry: 'Other services (salons, repair, personal care)',  small: 103576 },
  { industry: 'Retail trade',                                    small: 96799 },
  { industry: 'Manufacturing (makers)',                          small: 44440 },
  { industry: 'Arts, entertainment and recreation',              small: 16772 },
];
export const TARGET_INDUSTRIES_TOTAL = TARGET_INDUSTRIES.reduce((n, i) => n + i.small, 0); // 531,475

// ── Benchmarks used in wording (researched) ───────────────────────────────────
export const BENCHMARKS = {
  ltvCac: '3:1 is the common benchmark; 8-10x often reads as unrealistic; SMB SaaS payback under 12 months (feinternational.com)',
  preSeedMedian: 'about $1M (Carta State of Pre-seed 2025, via cbinsights.com)',
  seedMrr: 'seed investors typically want about $10K-$50K MRR (angelbacked.co)',
  canadianSeed: 'average seed about $3.0M, H1 2025 (CVCA)',
};

// ── Use of funds: ILLUSTRATIVE DRAFT (Hikmah to edit) ─────────────────────────
export const USE_OF_FUNDS = {
  illustrative: true, // applies to the investment split only; the grant split is the founder's own
  grants: {
    goal: 'Reach Stage 1-2 (40 to 400 paying merchants)',
    // Founder's split: 50% development, 30% marketing, 20% business setup (paperwork, accounting, legal, insurance).
    items: [
      { label: 'Development',                                   pct: 50 },
      { label: 'Marketing',                                     pct: 30 },
      { label: 'Business setup (accounting, legal, insurance)', pct: 20 },
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
  'Market: split non-employer businesses by industry (StatCan table 33-10-0765) to size the sole-operator segment.',
  'Market: Alberta small employer businesses by industry (StatCan table 33-10-0764).',
  'Market: the $9.07B global figure is one analyst estimate; decide whether to show it with the caveat or drop it.',
  'Does huchflex stay on its peakenterprise.ca subdomain or has it moved to its own domain?',
  'Roadmap items still ahead: GST/HST tax engine, 5th storefront theme (Soft Matter), AI agent API, US expansion.',
  'API endpoint and table counts (23+, 21+): re-count from the code, or drop them (the audience is non-technical).',
];
