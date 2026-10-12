// ─── FINANCIALS DATA ──────────────────────────────────────────────────────────
// Derived from facts.js. Nothing here is typed in by hand.
// "Modelled" values are projections from stated assumptions, not results.

import { ARPU_TODAY, ARPU_MIX, TRACTION_FACTS, UNIT_ECON_MODEL, USE_OF_FUNDS, ASK, MRR_TRACKER, stageLadder } from './facts.js';

export { MRR_TRACKER };

// Today plus each stage, at the illustrative $43 mix ARPU (modelled).
export const MERCHANT_GROWTH = [
  { period: 'Today', short: 'Today', merchants: TRACTION_FACTS.paidUsers, mrr: TRACTION_FACTS.mrr, arr: TRACTION_FACTS.mrr * 12, measured: true },
  ...stageLadder().map(s => ({
    period: s.label, short: `S${s.stage}`, merchants: s.payingUsers,
    mrr: s.mrrHigh, arr: s.arrHigh, mrrLow: s.mrrLow, arrLow: s.arrLow, measured: false,
  })),
];

const toRows = (total, items) => items.map(i => ({ label: i.label, pct: i.pct, amount: Math.round(total * i.pct / 100) }));
export const FUNDING_BREAKDOWN_SMALL = toRows(ASK.grants, USE_OF_FUNDS.grants.items);
export const FUNDING_BREAKDOWN_LARGE = toRows(ASK.investment, USE_OF_FUNDS.investment.items);

// Modelled. CAC and payback are targets until paid acquisition produces real data.
export const UNIT_ECONOMICS = {
  modelled:      true,
  arpu:          ARPU_TODAY,
  arpuMix:       ARPU_MIX,
  monthlyChurn:  UNIT_ECON_MODEL.monthlyChurn,
  ltv:           UNIT_ECON_MODEL.ltvToday,
  ltvMix:        UNIT_ECON_MODEL.ltvMix,
  cac:           null,
  ltvCacRatio:   null,
  paybackMonths: null,
  targetLtvCac:  UNIT_ECON_MODEL.targets.ltvCacMin,
  targetPaybackMonths: UNIT_ECON_MODEL.targets.paybackMonthsMax,
};

export const COMPETITOR_COST_STACK = [
  { tool: "Shopify / Squarespace",  min: 30,  max: 300 },
  { tool: "Mailchimp / Klaviyo",    min: 20,  max: 150 },
  { tool: "HubSpot / HoneyBook",    min: 50,  max: 200 },
  { tool: "Calendly / Acuity",      min: 20,  max: 50  },
  { tool: "QuickBooks + sheets",    min: 25,  max: 100 },
  { tool: "Notion / Trello",        min: 15,  max: 50  },
];

// Stage ladder as milestone cards (paying merchants, modelled ARR at the $43 mix).
export const MILESTONES = stageLadder().map(s => ({
  label: s.label, merchants: s.payingUsers, arr: s.arrHigh,
  note: s.then || (s.stage === 1 ? 'First paying cohort' : 'Repeatable growth'),
}));
