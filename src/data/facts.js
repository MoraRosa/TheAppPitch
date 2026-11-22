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
  asOf: '2026-11',
  firstUserDate: '2026-09-02', // first official user
  activeUsers: 20, // 8 on 13 Oct, 11 on 22 Oct, 12 on 30 Oct, 20 on 18 Nov 2026
  paidUsers: 4,
  mrr: 120, // subscription revenue only (4 x $30 Starter, gross); about $114 after Stripe fees; no tax charged (sole proprietor under the GST threshold); transaction fees tracked separately
  paidMarketing: false,
  // 4 of 20 is a tiny sample: describe it as an early signal, never as a conversion rate.
  earlySignalNote: '4 of 20 users are paying: an early signal, not a conversion rate.',
};

// One row per month. Add a row each month; the Financials page reads this.
export const MRR_TRACKER = [
  { month: '2026-10', activeUsers: 12, paidUsers: 2, mrr: 60 },
  { month: '2026-11', activeUsers: 20, paidUsers: 4, mrr: 120 }, // 18 Nov 2026
];

// Dated snapshots of user growth, for a growth chart later. Add one when you check the numbers.
// Launch-week figures are approximate (first official user 2 Sept 2026; about a week after launch).
export const USER_SNAPSHOTS = [
  { when: 'launch week (about 9 Sep 2026)', users: 3,  paying: 1 },
  { when: '2026-10-13',                      users: 8,  paying: 2 },
  { when: '2026-10-22',                      users: 11, paying: 2 },
  { when: '2026-10-30',                      users: 12, paying: 2 },
  { when: '2026-11-18',                      users: 20, paying: 4 },
];

// Paying merchants (4, all on Starter). Circle of Care gave verbal consent to show their website and maybe logo.
// Sirie Limitless replaced Huchflex (that merchant changed course). Consent for Sirie, Bruce Tails and Julz Creations: to confirm.
export const PAYING_MERCHANTS = [
  { name: 'Circle of Care Counselling', url: 'https://circleofcarecounselling.com', consent: 'verbal: website, maybe logo' },
  { name: 'Sirie Limitless', url: 'https://sirielc.org', consent: 'to confirm (new business name)' },
  { name: 'Bruce Tails', url: 'https://bruce-tails-r8g.peakenterprise.ca', consent: 'to confirm' },
  { name: 'Julz Creations', url: 'https://www.julzzcreations.ca', consent: 'to confirm' },
];

// Sites shown as product proof. Lumina is the founder's own live business (not a paying account).
// `shot` (optional): a screenshot in public/proof/ (e.g. 'circle-of-care.jpg'); the traction visual draws it on the frame when set.
export const LIVE_SITES = [
  { name: 'Circle of Care', host: 'circleofcarecounselling.com', url: 'https://circleofcarecounselling.com', paying: true,  kind: 'Counselling practice', shot: null },
  { name: 'Sirie', host: 'sirielc.org', url: 'https://sirielc.org', paying: true,  kind: 'Paying merchant', shot: null },
  { name: 'Bruce Tails', host: 'bruce-tails-r8g.peakenterprise.ca', url: 'https://bruce-tails-r8g.peakenterprise.ca', paying: true,  kind: 'Paying merchant', shot: null },
  { name: 'Julz Creations', host: 'julzzcreations.ca', url: 'https://www.julzzcreations.ca', paying: true,  kind: 'Paying merchant', shot: null },
  { name: 'Lumina', host: 'luminaco.skin', url: 'https://luminaco.skin', paying: false, tag: 'Founder brand', kind: 'Founder\'s own live business', shot: null },
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
// Rates are planning sensitivities, not measurements (we have 4 of 20).
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
  oneDatabase: 'Peak puts costing, inventory, storefront, bookings and customers in one database, so there is nothing to sync.',
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
  'Consent to show Sirie, Bruce Tails and Julz Creations (website, maybe logo): confirm with each merchant.',
  'Roadmap items still ahead: GST/HST tax engine, 5th storefront theme (Soft Matter), AI agent API, US expansion.',
  'API endpoint and table counts (23+, 21+): re-count from the code, or drop them (the audience is non-technical).',
];

// ── Competitor watch ─────────────────────────────────────────────────────────────────
// Companies we track. Add a row here and it shows in the business plan (competitive landscape).
// Keep each cell short and checked against the company's own site; say "none shown on their site" rather than "none".
export const COMPETITOR_WATCH = [
  {
    name: 'Khaime',
    url: 'https://khaime.com',
    does: 'Online store and payments for selling anywhere, with an AI agent that answers customers on WhatsApp, Instagram and Messenger.',
    differs: 'Built for selling across borders and chat apps. No production costing, bookkeeping, scheduling or team tools are shown on their site. Peak is a connected back office for non-technical owners.',
    ahead: 'An AI sales assistant on chat apps, 120+ currencies, a mobile app, and payment links and invoices.',
  },
  {
    name: 'gòke (HighValue Solutions)',
    url: 'https://highvaluesolutions.net',
    does: 'Turns an Instagram handle, or a LinkedIn profile or CV, into a multi-page website. Free to build and edit, then a one-time $15 fee to publish, hosted on Cloudflare Pages.',
    differs: 'A website generator for businesses in Nigeria and across Africa, not a business platform. Its ecommerce engine is a paid add-on, and no operations, costing, CRM or scheduling tools are shown on their site.',
    ahead: 'Very low entry cost with no monthly fee, and a site built from content the owner already has on Instagram.',
  },
  {
    name: 'Milo',
    url: 'https://milo.design',
    does: 'An AI website builder: the owner describes the business and Milo designs, writes and builds the site, and changes are made by asking in plain words. Takes payments through Buy and Donate buttons into the owner\'s own Stripe account, with orders, refunds, an enquiry inbox and analytics.',
    differs: 'Focused on websites and simple payments. No inventory, production costing, bookkeeping or CRM are shown on their site.',
    ahead: 'AI-built design, 100+ templates and a polished visual editor, free to start with no card needed.',
  },
  {
    name: 'SiteGround Ecommerce',
    url: 'https://www.siteground.com/ecommerce',
    does: 'A hosting company\'s all-in-one ecommerce service for small businesses: payments, shipping, taxes, orders and inventory in one platform, with built-in marketing and AI tools. Launched April 2026 with a 14-day free trial.',
    differs: 'Closest in message, since it also sells consolidating several tools into one. Its announcement covers selling online; no production costing, bookkeeping, scheduling or team tools are mentioned.',
    ahead: 'A 20-year hosting brand with 3+ million domains, built-in shipping and tax setup, and an established support team.',
  },
  {
    name: 'Oloja by Payxy',
    url: 'https://www.oloja.africa',
    does: 'A commerce platform for sellers in Nigeria and across Africa, with a store set up in under three minutes. Combines payment collection, a customisable storefront, customer management, business operations tools and business intelligence in one dashboard.',
    differs: 'Built around how African sellers operate, with local payments. Its launch coverage is a partner-published article, and no production costing or service scheduling is listed.',
    ahead: 'Local payment fit, no setup fee, and a very fast start.',
  },
  {
    name: 'Zoho Commerce',
    url: 'https://www.zoho.com/commerce/',
    does: 'A drag-and-drop online store builder from Zoho with ready-made themes, unified online and offline inventory, email campaigns and no transaction fees. Part of the Zoho suite, which also offers CRM, bookings, calendar and marketing automation.',
    differs: 'Zoho offers these as separate products in a large suite that the owner chooses and connects. Peak\'s modules share one database and one login from day one, set up for a non-technical owner.',
    ahead: 'A very large suite and brand, deep tools for companies that grow, and no transaction fees.',
  },
];
