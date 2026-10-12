// ─── CONFIG ─────────────────────────────────────────────────────────────────────
// Names, links and display shapes. Every number comes from facts.js.
// To rename the app, change COMPANY.name here; it updates everywhere.

import {
  PLANS, FREE_PLAN, TRIAL, THEMES, TRANSACTION_FEE, ARPU_TODAY, ARPU_MIX, ASK, TRACTION_FACTS, BUILD,
  UNIT_ECON_MODEL, MARKET_FACTS, USE_OF_FUNDS, MODULES, stageLadder,
} from './facts.js';

// ── Company ───────────────────────────────────────────────────────────────────
export const COMPANY = {
  name:           'Peak',
  tagline:        'One platform. Every operation.',
  url:            'peakenterprise.ca',
  email:          'hello@peakenterprise.ca',
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

// ── Traction ──────────────────────────────────────────────────────────────────
export const TRACTION = {
  asOf:          TRACTION_FACTS.asOf,
  activeUsers:   TRACTION_FACTS.activeUsers,
  paidUsers:     TRACTION_FACTS.paidUsers,
  mrr:           TRACTION_FACTS.mrr,
  apiEndpoints:  BUILD.apiEndpoints,
  dbTables:      BUILD.dbTables,
  paidMarketing: TRACTION_FACTS.paidMarketing,
};

// ── Pricing ───────────────────────────────────────────────────────────────────
const plan = id => PLANS.find(p => p.id === id);
export const PRICING = {
  free:           FREE_PLAN.name,
  trialDays:      TRIAL.days,
  trialPlans:     TRIAL.plans,
  starter:        plan('starter').display,
  growth:         plan('grow').display,
  pro:            plan('pro').display,
  range:          `${plan('starter').display}–${plan('pro').display}`,
  arpu:           ARPU_TODAY,   // real, today
  arpuMix:        ARPU_MIX,     // illustrative 60/30/10 mix
  transactionFee: TRANSACTION_FEE,
};

// ── Unit economics (modelled) ─────────────────────────────────────────────────
export const UNIT_ECON = {
  arpu:        ARPU_TODAY,
  arpuMix:     ARPU_MIX,
  churnRate:   UNIT_ECON_MODEL.monthlyChurn,
  ltv:         UNIT_ECON_MODEL.ltvToday,
  ltvMix:      UNIT_ECON_MODEL.ltvMix,
  cac:         UNIT_ECON_MODEL.cac,      // null: not yet measured
  targets:     UNIT_ECON_MODEL.targets,
};

// ── Market (sourced) ──────────────────────────────────────────────────────────
const m = MARKET_FACTS;
export const MARKET = {
  canadianSmallBiz:    '1.07 million',
  canadianSmallBizNote:`small employer businesses (1–99 employees), ${m.canadaSmallEmployers.year}`,
  canadianSmallShare:  m.canadaSmallEmployers.share,
  usSmallBiz:          '36.2 million',
  usNonEmployerNote:   'about 30.4 million of them have no employees',
  globalSaaSMarket:    m.globalSaaSMarket.value, // unsourced: see OPEN_QUESTIONS
  saasMarketYear:      m.globalSaaSMarket.year,
  sources:             [m.canadaSmallEmployers.source, m.usSmallBusinesses.source],
};

// ── Growth stages (paying merchants) ──────────────────────────────────────────
export const STAGES = stageLadder();

// ── Funding ───────────────────────────────────────────────────────────────────
const split = (total, items) => items.map(i => ({ label: i.label, pct: i.pct, amount: Math.round(total * i.pct / 100) }));
export const FUNDING = {
  currentGrant: {
    name:      'Grants',
    amount:    ASK.grants,
    goal:      USE_OF_FUNDS.grants.goal,
    breakdown: split(ASK.grants, USE_OF_FUNDS.grants.items),
  },
  seedRound: {
    min: ASK.investment,
    max: ASK.investment,
    goal:      USE_OF_FUNDS.investment.goal,
    breakdown: split(ASK.investment, USE_OF_FUNDS.investment.items),
  },
  illustrative: USE_OF_FUNDS.illustrative,
};

// ── Platform / Tech ───────────────────────────────────────────────────────────
export const PLATFORM = {
  stack:      ['React', 'Supabase', 'Stripe Connect', 'Vercel', 'Fastify'],
  themes:     THEMES.liveCount,
  themeNames: THEMES.storefront.map(t => t.name),
  themeInProgress: THEMES.inProgress,
  modules:    MODULES,
  repoBase:   'https://github.com/MoraRosa',
};

// ── Competitors (for comparison tables) ──────────────────────────────────────
export const COMPETITORS = [
  { co: 'Shopify',     storefront: true,  crm: false, costing: false, price: '$30–300' },
  { co: 'Squarespace', storefront: true,  crm: false, costing: false, price: '$16–65'  },
  { co: 'Kajabi',      storefront: false, crm: false, costing: false, price: '$150–400'},
  { co: COMPANY.name,  storefront: true,  crm: true,  costing: true,  price: PRICING.range },
];

// ── Social & Links ────────────────────────────────────────────────────────────
export const LINKS = {
  github:   FOUNDER_INFO.github,
  website:  `https://${COMPANY.url}`,
  pitchDeck: `/${COMPANY.name.replace(/\s/g, '')}Pitch/`,
};
