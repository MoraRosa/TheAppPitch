// ─── FINANCIAL PROJECTIONS DATA ───────────────────────────────────────────────
// Source: TheApp business plan projections.
// ARPU: $79/month. Monthly churn: 5%. CAC: ~$150. LTV: ~$1,580.

export const MERCHANT_GROWTH = [
  { period: "Q1 Y1", merchants: 5,    mrr: 395,    arr: 4740 },
  { period: "Q2 Y1", merchants: 15,   mrr: 1185,   arr: 14220 },
  { period: "Q3 Y1", merchants: 30,   mrr: 2370,   arr: 28440 },
  { period: "Q4 Y1", merchants: 50,   mrr: 3950,   arr: 47400 },
  { period: "Q1 Y2", merchants: 80,   mrr: 6320,   arr: 75840 },
  { period: "Q2 Y2", merchants: 130,  mrr: 10270,  arr: 123240 },
  { period: "Q3 Y2", merchants: 190,  mrr: 15010,  arr: 180120 },
  { period: "Q4 Y2", merchants: 250,  mrr: 19750,  arr: 237000 },
  { period: "Q1 Y3", merchants: 400,  mrr: 31600,  arr: 379200 },
  { period: "Q2 Y3", merchants: 600,  mrr: 47400,  arr: 568800 },
  { period: "Q3 Y3", merchants: 800,  mrr: 63200,  arr: 758400 },
  { period: "Q4 Y3", merchants: 1000, mrr: 79000,  arr: 948000 },
];

export const FUNDING_BREAKDOWN_SMALL = [
  { label: "Infrastructure & Hosting",  amount: 2500,  pct: 25 },
  { label: "Email, CDN, Domains",        amount: 1500,  pct: 15 },
  { label: "Beta Merchant Onboarding",   amount: 3000,  pct: 30 },
  { label: "Merchant Acquisition",       amount: 3000,  pct: 30 },
];

export const FUNDING_BREAKDOWN_LARGE = [
  { label: "Infrastructure (12 mo)",     amount: 15000,  pct: 10 },
  { label: "Developer Hire (6 mo)",      amount: 45000,  pct: 30 },
  { label: "Customer Success Hire",      amount: 40000,  pct: 27 },
  { label: "Marketing & Acquisition",    amount: 25000,  pct: 17 },
  { label: "Legal & Compliance",         amount: 10000,  pct: 6 },
  { label: "Operating Reserve",          amount: 15000,  pct: 10 },
];

export const UNIT_ECONOMICS = {
  arpu: 79,
  monthlyChurn: 0.05,
  ltv: 1580,
  cac: 150,
  ltvCacRatio: 10.5,
  paybackMonths: 2,
};

export const COMPETITOR_COST_STACK = [
  { tool: "Shopify / Squarespace",  min: 30,  max: 300 },
  { tool: "Mailchimp / Klaviyo",    min: 20,  max: 150 },
  { tool: "HubSpot / HoneyBook",    min: 50,  max: 200 },
  { tool: "Calendly / Acuity",      min: 20,  max: 50  },
  { tool: "QuickBooks + sheets",    min: 25,  max: 100 },
  { tool: "Notion / Trello",        min: 15,  max: 50  },
];

export const MILESTONES = [
  { label: "Year 1", merchants: 50,   arr: 47400,   note: "Product-market fit, first cohort" },
  { label: "Year 2", merchants: 250,  arr: 237000,  note: "First hire, second theme live" },
  { label: "Year 3", merchants: 1000, arr: 948000,  note: "Near profitability or Series A" },
];
