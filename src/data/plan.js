// ─── BUSINESS PLAN CONTENT ────────────────────────────────────────────────────
// Full readable business plan, section by section.
// Each section is independently renderable.

export const PLAN_SECTIONS = [
  {
    id: "executive-summary",
    number: "01",
    title: "Executive Summary",
    content: `TheApp is a Canadian multi-tenant vertical SaaS platform that gives small business owners a complete, ready-to-operate online business from day one. Unlike Shopify, Squarespace, or any single-purpose tool, TheApp combines a fully themed customer storefront with an integrated merchant back-office — including a CRM (Constellation), a production costing engine (Pulse), task management (Compass), email, blog, newsletter, reviews, FAQ, and legal tools — all in one platform, activated through a module toggle system.

The platform is built for two customer types: small product-based businesses (beauty brands, skincare makers, small manufacturers, food producers) who need both a storefront and operational tools; and service-based businesses (fitness trainers, photographers, salons, therapists) who need a professional online presence with client-facing functionality.

TheApp is currently pre-revenue, built entirely by a solo Canadian developer, with 5 beta merchants signed up and waiting for launch.`,
  },
  {
    id: "problem",
    number: "02",
    title: "The Problem",
    content: `Small business owners are paying for 6–10 disconnected tools to run a basic online presence — between $160 and $850 per month — and none of these tools share data cleanly. Every integration is a maintenance burden. Every data silo is a missed insight.

For product-based businesses — beauty brands, skincare makers, food producers — the problem is sharper. Shopify was built for retailers who buy finished goods and resell them. It was not built for makers who need to track raw ingredients, manage supplier relationships, calculate batch costs, and design packaging before a product ever goes on sale. They manage these critical operations in spreadsheets.

The result: small makers are overpaying for tools that were not designed for them, or they are underequipped and running blind.`,
  },
  {
    id: "solution",
    number: "03",
    title: "The Solution",
    content: `One platform. One login. Everything operational on day one.

When a merchant signs up for TheApp, they choose their business type, pick a theme, and are operational without setting up a single integration.

The storefront is a fully themed customer-facing store powered by a curated theme engine — five radically isolated design universes. These are not color swaps. Each theme has its own typography, spacing, layout philosophy, animation system, component structure, and interaction design.

The merchant back-office includes products, orders, and inventory; Pulse for ingredient management, supplier tracking, batch costing, and QuickBooks sync; Constellation CRM for customer profiles and engagement analytics; Compass for task and project management; and complete content management for blog, FAQ, legal, newsletter, emails, reviews, and messages.

The module system means merchants enable only what their business needs. The sidebar, routes, and buyer storefront all adapt to what is enabled.`,
  },
  {
    id: "market",
    number: "04",
    title: "Market Opportunity",
    content: `There are 3.8 million small businesses in Canada and 33 million in the United States. The global SaaS ecommerce platform market is projected to exceed $14 billion by 2027.

The indie beauty and personal care segment is one of the fastest-growing direct-to-consumer categories in North America — driven by small brands who start on Etsy and outgrow it. A conservative target of 100,000 Canadian small businesses at $79 per month represents $94.8M ARR in Canada alone, before any US expansion.

TheApp does not need a large slice of this market to build a meaningful business. At 500 paying merchants at an average of $79 per month, that is $474K ARR. At 2,000 merchants, it is $1.9M ARR. Both are achievable without venture-scale growth.`,
  },
  {
    id: "model",
    number: "05",
    title: "Business Model",
    content: `Primary revenue comes from subscription tiers: a Starter tier at approximately $29–49 per month for early-stage businesses, a Growth tier at approximately $79–129 per month for active sellers, and an Enterprise tier at custom pricing for multi-staff high-volume operations. All new signups receive a 14-day free trial with all modules unlocked.

Secondary revenue comes from a small platform transaction fee of 0.5–1% on each sale processed through Stripe Connect — the same model as Shopify, and one that aligns platform revenue directly with merchant success.

Future revenue streams include a premium theme marketplace, a third-party app ecosystem with commission, and white-label licensing for agencies and operators.

Unit economics at current assumptions: ARPU of $79 per month, monthly churn of 5%, LTV of approximately $1,580, CAC of approximately $150, and an LTV to CAC ratio of approximately 10 to 1.`,
  },
  {
    id: "competition",
    number: "06",
    title: "Competitive Landscape",
    content: `Shopify is the largest ecommerce ecosystem but was built for retailers, not makers. It has no ingredient management, no batch costing, and no native CRM. Its app ecosystem adds cost and integration friction at every step.

Squarespace is design-first and business-second. No ecommerce depth, no back-office tools, and booking requires third-party integration.

Kajabi serves digital products and courses at $150–400 per month — overkill for most small merchants with no physical ecommerce or production costing.

HoneyBook and Dubsado serve service business CRM and invoicing but have no storefront and no ecommerce capability.

TheApp's real advantages are integrated operations that work on day one, a production costing engine that Shopify has no equivalent for, radically isolated theming that competitors cannot replicate with color swaps, and AI-native architecture designed for external access from day one.`,
  },
  {
    id: "gtm",
    number: "07",
    title: "Go-To-Market Strategy",
    content: `Phase one targets the first 50 merchants through the existing 5 beta merchants and word of mouth. The goal is to onboard them, learn fast, fix what breaks, and earn referrals. A merchant who replaces Shopify, Mailchimp, and a costing spreadsheet with one platform and saves $300 per month tells other merchants.

The primary target in this phase is beauty brands and small product makers in Alberta and British Columbia who are currently on Shopify and using spreadsheets for production costing.

Phase two targets 50 to 250 merchants through Instagram and TikTok content showcasing real storefronts, presence in Canadian small business communities, outreach to women in business networks and maker communities in Alberta, and case studies from beta merchants.

Phase three targets 250 or more merchants through paid acquisition on Meta and Google once unit economics are validated — CAC, LTV, and churn confirmed from real cohort data.`,
  },
  {
    id: "traction",
    number: "08",
    title: "Traction",
    content: `Five beta merchants signed up through word of mouth before the product was publicly available. These are real small business owners who want to use the platform.

The platform is in advanced development. Multi-tenant database with Row-Level Security across 21 or more tables. Dual authentication covering merchants and buyers as completely separate identity pools. Fastify REST API with products, orders, customers, and inventory across 23 or more endpoints. Merchant admin dashboard. Pulse production costing module with ingredients, suppliers, batch costing, packaging design studio, QuickBooks integration, and financial dashboard. Constellation CRM with customer overview, segments, journey tracking, and engagement analytics. Compass task and calendar management. Blog, FAQ, legal, newsletter, email, hero, banner, and reviews — all built.

Zero churn. The product approaches its first beta release.`,
  },
  {
    id: "roadmap",
    number: "09",
    title: "Product Roadmap",
    content: `Complete or in progress: full multi-tenant architecture, dual authentication, REST API, merchant dashboard, Pulse, Constellation, Compass, and all content modules.

Next 6 months: cart, Stripe Connect payments, Shippo shipping integration, subscription billing system, BARE theme, custom domain support, and Canadian GST/HST tax engine.

6 to 18 months: remaining three themes (Midnight Luxury, Gothic Academia, Neubrutalism), scheduling module for fitness and therapy and salons, AI Agent API enabling ChatGPT or Claude to search inventory and place orders, internal AI merchant assistant, and US market entry.`,
  },
  {
    id: "ask",
    number: "10",
    title: "The Ask",
    content: `For the Zensurance Grant of $10,000: $2,500 for Supabase hosting and infrastructure during the beta period, $1,500 for email service, CDN, and domain management, $3,000 for beta merchant onboarding support, and $3,000 for initial paid merchant acquisition. This grant closes the gap between built and launched.

For a larger grant or seed round of $100,000 to $150,000: $15,000 for infrastructure and hosting over 12 months, $45,000 for a developer hire on a 6-month contract, $40,000 for a customer success and merchant onboarding hire, $25,000 for marketing and merchant acquisition, $10,000 for legal, accounting, and compliance, and $15,000 as an operating reserve.

This enables 100 or more paying merchants in 12 months, the first full-time hire, and a clear path to $237,000 ARR by end of Year 2.`,
  },
];
