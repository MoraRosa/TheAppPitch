// ─── SINGLE SOURCE OF TRUTH ────────────────────────────────────────────────────
// Change anything here and it updates everywhere:
// nav, footer, slides, plan, PDF download, PPTX download, financials page.
//
// When you have real market research data, update MARKET.
// When you incorporate, update COMPANY.legalStructure.
// When pricing is validated, update PRICING.
// When beta grows, update TRACTION.betaMerchants.

// ── Company ───────────────────────────────────────────────────────────────────
export const COMPANY = {
  name:           'TheApp',
  tagline:        'One platform. Every operation.',
  url:            'theapp.ca',
  email:          'hello@theapp.ca',
  location:       'Calgary, Alberta, Canada',
  legalStructure: 'Sole proprietorship (federal incorporation planned at launch)',
  founded:        '2026',
  incorporatedAt: null, // set when incorporated e.g. 'January 2026'
};

// ── Founder ───────────────────────────────────────────────────────────────────
export const FOUNDER_INFO = {
  name:     'Hikmah Adepoju',
  title:    'Founder & Full-Stack Developer',
  location: 'Calgary, Alberta, Canada',
  github:   'https://github.com/MoraRosa',
  email:    'info@theapp.ca',
  linkedin: null, // add when ready
};

// ── Traction (update as you grow) ─────────────────────────────────────────────
export const TRACTION = {
  betaMerchants:  15,
  apiEndpoints:   23,    // "23+ endpoints"
  dbTables:       21,    // "21+ tables"
  churn:          0,     // current churn
  paidMarketing:  false, // true once you start paid ads
};

// ── Pricing ───────────────────────────────────────────────────────────────────
export const PRICING = {
  starter:        '$29–49',
  growth:         '$79–129',
  enterprise:     'Custom',
  arpu:           79,          // average revenue per user ($/month)
  trialDays:      14,
  transactionFee: '0.5–1%',   // platform fee on Stripe sales
};

// ── Unit Economics ─────────────────────────────────────────────────────────────
export const UNIT_ECON = {
  arpu:        79,      // $/month
  churnRate:   0.05,    // 5% monthly churn
  ltv:         1580,    // lifetime value ($)
  cac:         150,     // customer acquisition cost ($)
  ltvCacRatio: 10,      // LTV:CAC
};

// ── Market (update with Business Link Alberta data when received) ──────────────
export const MARKET = {
  canadianSmallBiz:  '3.8 million',   // Stats Canada
  usSmallBiz:        '33 million',
  globalSaaSMarket:  '$14 billion',   // projected by 2027
  saasMarketYear:    2027,
  targetCanadian:    100000,          // conservative target merchants
  targetMrr:         79,              // $/month
  targetArr:         '94.8M',         // CAD, Canada only at target
  // ↓ Placeholders — fill in from Business Link research
  albertaSmallBiz:   null,            // Alberta-specific count
  albertaDigitalGap: null,            // % without online presence
  primaryResearch:   null,            // survey data summary
};

// ── Growth Milestones ─────────────────────────────────────────────────────────
export const MILESTONES = {
  y1: { merchants: 50,   arr: 47400,   note: 'Product-market fit, first cohort' },
  y2: { merchants: 250,  arr: 237000,  note: 'First hire, second theme live' },
  y3: { merchants: 1000, arr: 948000,  note: 'Near profitability or Series A' },
};

// ── Grant / Funding ───────────────────────────────────────────────────────────
export const FUNDING = {
  currentGrant: {
    name:   'Zensurance Small Business Grant',
    amount: 10000,
    breakdown: [
      { label: 'Supabase hosting & infrastructure (beta period)', amount: 2500 },
      { label: 'Email service, CDN & domain management',          amount: 1500 },
      { label: 'Beta merchant onboarding support',                amount: 3000 },
      { label: 'Initial paid merchant acquisition',               amount: 3000 },
    ],
  },
  seedRound: {
    min: 100000,
    max: 150000,
    breakdown: [
      { label: 'Infrastructure & hosting (12 months)',   amount: 15000 },
      { label: 'Developer hire (6-month contract)',      amount: 45000 },
      { label: 'Customer success & onboarding hire',    amount: 40000 },
      { label: 'Marketing & merchant acquisition',      amount: 25000 },
      { label: 'Legal, accounting & compliance',        amount: 10000 },
      { label: 'Operating reserve',                     amount: 15000 },
    ],
  },
};

// ── Platform / Tech ───────────────────────────────────────────────────────────
export const PLATFORM = {
  stack:      ['React', 'Supabase', 'Stripe Connect', 'Vercel', 'Fastify'],
  themes:     5,
  themeNames: ['Manuscript', 'Brutalist', 'Editorial', 'Canadian', 'BARE'],
  modules:    ['Pulse', 'Constellation', 'Compass', 'Storefront', 'Blog', 'Newsletter', 'FAQ', 'Legal', 'Reviews'],
  repoBase:   'https://github.com/MoraRosa',
};

// ── Competitors (for comparison tables) ──────────────────────────────────────
export const COMPETITORS = [
  { co: 'Shopify',     storefront: true,  crm: false, costing: false, price: '$30–300' },
  { co: 'Squarespace', storefront: true,  crm: false, costing: false, price: '$16–65'  },
  { co: 'Kajabi',      storefront: false, crm: false, costing: false, price: '$150–400'},
  { co: COMPANY.name,  storefront: true,  crm: true,  costing: true,  price: PRICING.growth },
];

// ── Social & Links ────────────────────────────────────────────────────────────
export const LINKS = {
  github:   FOUNDER_INFO.github,
  website:  `https://${COMPANY.url}`,
  pitchDeck: `/${COMPANY.name.replace(/\s/g, '')}Pitch/`,
};
