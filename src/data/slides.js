// ─── PITCH DECK SLIDES ────────────────────────────────────────────────────────
// Theme-agnostic. All visual decisions live in /themes.
// Every number comes from facts.js (via config.js). Do not type figures in here.

import { COMPANY, TRACTION, PRICING, MARKET, FUNDING, FOUNDER_INFO } from './config.js';
import { STAGE_TARGETS, WORDING } from './facts.js';

const [S1, S2, S3] = STAGE_TARGETS.map(s => s.payingUsers.toLocaleString());
const fmtK = n => `$${Math.round(n / 1000)}K`;
const n = v => v.toLocaleString();
const k = v => (Math.round(v / 1000) * 1000).toLocaleString(); // 531,475 -> 531,000

export const SLIDES = [
  {
    id: 1,
    slug: "hook",
    eyebrow: "Introduction",
    headline: "Small businesses are paying for 10 tools when one should do.",
    body: `${COMPANY.name} is the complete business platform for small brands and makers. Built in Canada. Live today with ${TRACTION.activeUsers} users and ${TRACTION.paidUsers} paying merchants.`,
    speakerNote: "Open with the core tension. Every person in this room knows a small business owner drowning in subscriptions.",
    tag: "01",
  },
  {
    id: 2,
    slug: "problem",
    autoMs: 24000,
    eyebrow: "The Problem",
    headline: "$160–850/month in tools that don't talk to each other.",
    body: "Shopify was built for retailers who buy and resell, not makers who track 40 ingredients, 8 suppliers, and 12 batch recipes before a product ever ships. The market handed them a website builder and told them to figure out the rest.",
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
    body: "Sign up and you are running: storefront, customers, costing, tasks, scheduling and email, all in one place. No extra accounts, no integrations, no maintenance.",
    speakerNote: "This is the relief moment. Let it land. One login.",
    tag: "03",
  },
  {
    id: 4,
    slug: "differentiator",
    autoMs: 18000,
    eyebrow: "The Differentiator",
    headline: "Run a product business or a service business. Everything is built in.",
    body: "Costing, bookkeeping, team management, email and instant theme switching, all in one platform.",
    speakerNote: "Product or service, it is all here. Click through the themes: one click and the whole store changes.",
    tag: "04",
  },
  {
    id: 5,
    slug: "market",
    autoMs: 22000,
    eyebrow: "Market Opportunity",
    headline: `${MARKET.canadianSmallBiz} small employer businesses in Canada, plus ${MARKET.canadianNonEmployer} sole operators.`,
    body: `About ${k(MARKET.targetIndustries)} of them sit in industries ${COMPANY.name} serves. Our ${S3}-merchant goal is under 1% of that group.`,
    stat: { value: MARKET.canadianSmallBiz, label: "small employer businesses in Canada (Dec 2024)" },
    speakerNote: "The 531,000 is an upper bound by industry, not a count of exact fits. Sources: ISED Key Small Business Statistics 2025; Statistics Canada business counts, Dec 2024.",
    tag: "05",
  },
  {
    id: 6,
    slug: "model",
    eyebrow: "Business Model",
    headline: `Three plans, ${PRICING.starter} to ${PRICING.pro} a month, plus a fee on every sale.`,
    body: "",
    speakerNote: "Be upfront that CAC is not measured yet because there is no paid acquisition. Targets, not claims.",
    tag: "06",
  },
  {
    id: 7,
    slug: "traction",
    autoMs: 22000,
    eyebrow: "Traction",
    headline: `Live product. ${TRACTION.activeUsers} active users. ${TRACTION.paidUsers} paying. $${TRACTION.mrr} MRR.`,
    body: `Storefront, checkout, shipping, scheduling, custom domains and Stripe payments are live. First user on September 2. No paid marketing. One developer.`,
    speakerNote: `One person built and shipped all of this. Call ${TRACTION.paidUsers} of ${TRACTION.activeUsers} an early signal, because the sample is tiny.`,
    tag: "07",
  },
  {
    id: 8,
    slug: "roadmap",
    autoMs: 26000,
    eyebrow: "Roadmap",
    headline: `${S1} paying merchants, then ${S2}, then ${S3}.`,
    body: "Milestones are earned, not dated.",
    speakerNote: "Milestone-based, not date-based. Milestones are earned, dates are guessed.",
    tag: "08",
  },
  {
    id: 9,
    slug: "competition",
    autoMs: 24000,
    eyebrow: "Competition",
    headline: "One database behind the whole business.",
    body: WORDING.oneDatabase,
    speakerNote: "Let the subscriptions land, then watch them pull into one place. Acknowledge what each tool does well, then name the seams between them.",
    tag: "09",
  },
  {
    id: 10,
    slug: "ask",
    eyebrow: "The Ask",
    headline: `${fmtK(FUNDING.currentGrant.amount)} in grants and $${(FUNDING.seedRound.min / 1e6).toFixed(0)}M from investors to reach ${S3} paying merchants.`,
    body: `Grants take us from ${S1} to ${S2} paying merchants. The investment takes us to ${S3} and funds our first hires, including the rename.`,
    speakerNote: "End with the human story. One developer, a live product, paying customers. The ask turns a working product into a company.",
    tag: "10",
  },
  {
    id: 11,
    slug: "team",
    eyebrow: "The Team",
    headline: "One developer built it. The raise adds the first team.",
    body: `${FOUNDER_INFO.name} designed, built and launched ${COMPANY.name} alone, and also runs Lumina, a live e-commerce brand. After Stage 3 we hire marketing and branding first, then engineering and customer success.`,
    speakerNote: "Own the solo-founder risk out loud, then show the plan that removes it: the hires, in order.",
    tag: "11",
  },
  {
    id: 12,
    slug: "close",
    eyebrow: "The Close",
    headline: "Scan it. The platform is live.",
    body: `${COMPANY.name} is live at ${COMPANY.url}. Scan the code or open the live site, and see the merchants already running on it.`,
    autoMs: 22000,
    speakerNote: "Leave the QR on screen. Let people scan while you take questions.",
    tag: "12",
  },
];

export const SLIDE_COUNT = SLIDES.length;
