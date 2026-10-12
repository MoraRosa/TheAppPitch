// ─── PITCH DECK SLIDES ────────────────────────────────────────────────────────
// Theme-agnostic. All visual decisions live in /themes.
// Every number comes from facts.js (via config.js). Do not type figures in here.

import { COMPANY, TRACTION, PRICING, MARKET, FUNDING } from './config.js';
import { STAGE_TARGETS, WORDING } from './facts.js';

const [S1, S2, S3] = STAGE_TARGETS.map(s => s.payingUsers.toLocaleString());
const fmtK = n => `$${Math.round(n / 1000)}K`;

export const SLIDES = [
  {
    id: 1,
    slug: "hook",
    eyebrow: "Introduction",
    headline: "Small businesses are paying for 10 tools when one should do.",
    body: `${COMPANY.name} is the complete business platform for small brands and makers. Built in Canada. Live today with ${TRACTION.activeUsers} active users and ${TRACTION.paidUsers} paying merchants.`,
    speakerNote: "Open with the core tension. Every person in this room knows a small business owner drowning in subscriptions.",
    tag: "01",
  },
  {
    id: 2,
    slug: "problem",
    autoMs: 24000,
    eyebrow: "The Problem",
    headline: "$160–850/month in tools that don't talk to each other.",
    body: "Shopify was built for retailers who buy and resell — not makers who track 40 ingredients, 8 suppliers, and 12 batch recipes before a product ever ships. The market handed them a website builder and told them to figure out the rest.",
    stat: { value: "$850", label: "Max monthly tool spend" },
    speakerNote: "Make it concrete. Name the tools: Shopify, Mailchimp, HubSpot, Calendly, QuickBooks, Notion. That is 6 subscriptions before lunch.",
    tag: "02",
  },
  {
    id: 3,
    slug: "solution",
    autoMs: 28000,
    eyebrow: "The Solution",
    headline: "One platform. One login. Operational in under an hour.",
    body: "A merchant signs up, picks their business type, picks a theme, and has everything they need — storefront, customers, costing, tasks, scheduling, email — no additional accounts, no integrations, no maintenance.",
    speakerNote: "This is the relief moment. Let it land. One login.",
    tag: "03",
  },
  {
    id: 4,
    slug: "differentiator",
    eyebrow: "The Differentiator",
    headline: "Costing, inventory, storefront and bookings in one database.",
    body: WORDING.competition,
    speakerNote: "Costing is the wedge. Shopify has no native production costing, and that gap is where makers lose hours every week.",
    tag: "04",
  },
  {
    id: 5,
    slug: "market",
    eyebrow: "Market Opportunity",
    headline: `${MARKET.canadianSmallBiz} small employer businesses in Canada. ${MARKET.usSmallBiz} small businesses in the US.`,
    body: `Small businesses are ${MARKET.canadianSmallShare} of Canadian employer businesses (${MARKET.canadianSmallBizNote}). In the US, ${MARKET.usNonEmployerNote}. ${COMPANY.name} starts with the makers and service providers who have been underserved by every tool built for someone else.`,
    stat: { value: MARKET.canadianSmallShare, label: "of Canadian employer businesses are small (1–99 staff)" },
    speakerNote: "Stay focused on the maker segment. That is the wedge. Sources: ISED Key Small Business Statistics 2024; SBA Office of Advocacy 2026.",
    tag: "05",
  },
  {
    id: 6,
    slug: "model",
    eyebrow: "Business Model",
    headline: `Three plans, ${PRICING.starter} to ${PRICING.pro} a month, plus a fee on every sale.`,
    body: `Starter ${PRICING.starter}, Grow ${PRICING.growth}, Pro ${PRICING.pro} per month, plus a platform fee on each Stripe transaction — revenue that grows with merchant success. Unit economics are modelled, not yet measured: our targets are an LTV to CAC of at least 3 to 1 and payback inside 12 months.`,
    speakerNote: "Be upfront that CAC is not measured yet because there is no paid acquisition. Targets, not claims.",
    tag: "06",
  },
  {
    id: 7,
    slug: "traction",
    autoMs: 22000,
    eyebrow: "Traction",
    headline: `Live product. ${TRACTION.activeUsers} active users. ${TRACTION.paidUsers} paying. $${TRACTION.mrr} MRR.`,
    body: `Storefront, cart and checkout, shipping, scheduling, custom domains, and Stripe Connect payments are live, with transaction fees switched on. First official user: September 2. ${TRACTION.paidUsers} of ${TRACTION.activeUsers} active users have converted to paid — an early signal, not a conversion rate. Zero paid marketing. One developer.`,
    speakerNote: "One person built and shipped all of this. Call 2 of 8 an early signal, because the sample is tiny.",
    tag: "07",
  },
  {
    id: 8,
    slug: "roadmap",
    eyebrow: "Roadmap",
    headline: `${S1} paying merchants, then ${S2}, then ${S3}.`,
    body: `Stage 1 is ${S1} paying merchants. Stage 2 is ${S2}. Stage 3 is ${S3}, and then we hire for marketing and branding. Milestones are earned, not dated.`,
    speakerNote: "Milestone-based, not date-based. Milestones are earned, dates are guessed.",
    tag: "08",
  },
  {
    id: 9,
    slug: "competition",
    eyebrow: "Competition",
    headline: "Shopify has no native costing. Squarespace has no back-office. Nobody has both.",
    body: WORDING.competition,
    speakerNote: "Acknowledge what competitors do well, then name the specific gap only we fill.",
    tag: "09",
  },
  {
    id: 10,
    slug: "ask",
    eyebrow: "The Ask",
    headline: `${fmtK(FUNDING.currentGrant.amount)} in grants and $${(FUNDING.seedRound.min / 1e6).toFixed(0)}M from investors to reach ${S3} paying merchants.`,
    body: `Grants take us from ${S1} to ${S2} paying merchants: product hardening, infrastructure, onboarding, first marketing tests. The investment takes us to ${S3} and funds our first hires, including brand and the rename.`,
    speakerNote: "End with the human story. One developer, a live product, paying customers. The ask turns a working product into a company.",
    tag: "10",
  },
];

export const SLIDE_COUNT = SLIDES.length;
