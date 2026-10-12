// ─── BUSINESS PLAN CONTENT ────────────────────────────────────────────────────
// Single source of truth: all names/numbers come from config.js
// To rename the app, update COMPANY.name in config.js — it updates everywhere.

import { COMPANY, FOUNDER_INFO, TRACTION, PRICING, MARKET, STAGES, FUNDING, UNIT_ECON } from './config.js';
import { WORDING } from './facts.js';

const usd = n => `$${Math.round(n).toLocaleString()}`;
const [ST1, ST2, ST3] = STAGES;
const n = v => v.toLocaleString();

export const PLAN_SECTIONS = [
  {
    id: "executive-summary",
    number: "01",
    title: "Executive Summary",
    get content() {
      return `${COMPANY.name} is a Canadian multi-tenant vertical SaaS platform that gives small business owners a complete, ready-to-operate online business from day one. Unlike Shopify, Squarespace, or any single-purpose tool, ${COMPANY.name} combines a fully themed customer storefront with an integrated merchant back-office — including customer management (Constellation), production costing (Pulse), task management (Compass), scheduling, email, blog, newsletter, reviews, FAQ, and legal tools — all in one platform, activated through a module toggle system.

The platform is built for two customer types: small product-based businesses (beauty brands, skincare makers, small manufacturers, food producers) who need both a storefront and operational tools; and service-based businesses (fitness trainers, photographers, salons, therapists) who need a professional online presence with client-facing functionality.

${COMPANY.name} is live at MVP, built entirely by a solo Canadian developer. ${TRACTION.activeUsers} users are actively using the platform, ${TRACTION.paidUsers} have converted to paid, and subscription revenue is ${usd(TRACTION.mrr)} per month. That is an early signal, not yet a proven conversion rate.`;
    },
  },

  {
    id: "company-description",
    number: "02",
    title: "Company Description",
    get blocks() { return [
      { type: 'text', text: `${COMPANY.name} is a Canadian-built, Alberta-founded SaaS company providing integrated operational infrastructure for small makers, independent brands, and service businesses. It is live at MVP with a working multi-tenant platform, ${TRACTION.activeUsers} active users, and ${TRACTION.paidUsers} paying merchants.` },
      { type: 'label', text: 'Mission' },
      { type: 'callout', text: `To remove the operational chaos that prevents talented makers and small business owners from focusing on their craft, by replacing the spreadsheets, subscriptions, and workarounds with storefront, CRM, production costing, and task management in one integrated platform that just works.` },
      { type: 'label', text: 'Vision' },
      { type: 'callout', text: `A Canada where every independent business owner has access to enterprise-grade tools — and the playing field between the solo founder and the funded company is finally level.` },
      { type: 'label', text: 'Who We Serve' },
      { type: 'text', text: `Small product-based businesses — beauty brands, skincare makers, food producers, small manufacturers — who need both a storefront and production operations in one place. Service-based businesses — fitness trainers, photographers, salons, therapists — who need a professional online presence with client-facing booking and content tools.` },
      { type: 'label', text: 'What Need We Satisfy' },
      { type: 'text', text: `Small business owners are currently paying $160–850/month across 6–10 disconnected tools that do not share data. There is no single platform built specifically for makers who need to track ingredients, calculate batch costs, manage suppliers, and run a storefront simultaneously. ${COMPANY.name} is that platform.` },
    ]; },
  },

  {
    id: "problem",
    number: "03",
    title: "The Problem",
    get content() {
      return `Small business owners are paying for 6–10 disconnected tools to run a basic online presence — between $160 and $850 per month — and none of these tools share data cleanly. Every integration is a maintenance burden. Every data silo is a missed insight.

For product-based businesses — beauty brands, skincare makers, food producers — the problem is sharper. Shopify was built for retailers who buy finished goods and resell them. It was not built for makers who need to track raw ingredients, manage supplier relationships, calculate batch costs, and design packaging before a product ever goes on sale. They manage these critical operations in spreadsheets.

The result: small makers are overpaying for tools that were not designed for them, or they are underequipped and running blind.`;
    },
  },

  {
    id: "solution",
    number: "04",
    title: "The Solution",
    get content() {
      return `One platform. One login. Everything operational on day one.

When a merchant signs up for ${COMPANY.name}, they choose their business type, pick a theme, and are operational without setting up a single integration.

The storefront is a fully themed customer-facing store powered by a curated theme engine — five radically isolated design universes. These are not color swaps. Each theme has its own typography, spacing, layout philosophy, animation system, component structure, and interaction design.

The merchant back-office includes products, orders, and inventory; Pulse for ingredient management, supplier tracking, batch costing, and QuickBooks sync; Constellation CRM for customer profiles and engagement analytics; Compass for task and project management; and complete content management for blog, FAQ, legal, newsletter, emails, reviews, and messages.

The module system means merchants enable only what their business needs. The sidebar, routes, and buyer storefront all adapt to what is enabled.`;
    },
  },

  {
    id: "products-services",
    number: "05",
    title: "Products & Services",
    get blocks() { return [
      { type: 'text', text: `${COMPANY.name} is a subscription-based SaaS platform. Merchants pay a monthly fee for access to the full module suite. There is no physical product — the service is the software.` },
      { type: 'label', text: 'What Makes It Unique' },
      { type: 'text', text: `No competitor combines a fully themed storefront with production costing, CRM, and task management in a single platform. ${WORDING.competition} The radically isolated theme engine is not a color swap — each theme is architecturally distinct.` },
      { type: 'label', text: 'How It Will Be Used' },
      { type: 'text', text: `Merchants access ${COMPANY.name} through a web browser on desktop or mobile. Buyers access the merchant's public storefront through a custom-branded URL. No app install required for either party. Merchants configure their store once and operate continuously from the dashboard.` },
      { type: 'label', text: 'How Price Is Established' },
      { type: 'text', text: `Pricing is based on a tiered subscription model anchored to competitor pricing and the value of tools replaced. Plans are Starter ${PRICING.starter}, Grow ${PRICING.growth}, and Pro ${PRICING.pro} per month, set against the cost of the separate tools a merchant would otherwise stack together. The first paying merchants are the first real validation of that pricing.` },
      { type: 'label', text: 'Competitive Advantages' },
      { type: 'bullets', items: [
        `Production costing built in — Shopify has no native costing, so makers run a second app and keep two systems in sync`,
        `Integrated storefront + back-office — competitors are either storefront-only or back-office-only`,
        `Radically isolated theme engine — genuine design differentiation, not color variants`,
        `Canadian-built and Canadian-hosted — resonates with local small business identity`,
        `Founder is a primary user (operates Lumina) — product decisions come from lived experience`,
        `AI-native architecture — external API access ready for AI agent integration from day one`,
      ]},
      { type: 'label', text: 'Copyrights & IP' },
      { type: 'text', text: `All source code is proprietary and privately held. The ${COMPANY.name} name and brand are unregistered trademarks at this stage. Trademark registration will be pursued at federal incorporation. The competitive moat is execution and product depth.` },
    ]; },
  },

  {
    id: "market",
    number: "06",
    title: "Market Opportunity",
    get blocks() { return [
      { type: 'text', text: `Canada has ${MARKET.canadianSmallBiz} ${MARKET.canadianSmallBizNote}, which is ${MARKET.canadianSmallShare} of all Canadian employer businesses (ISED, Key Small Business Statistics 2024). The United States has ${MARKET.usSmallBiz} small businesses, ${MARKET.usNonEmployerNote} (SBA Office of Advocacy, 2026).` },
      { type: 'text', text: `${COMPANY.name} does not need a large share of this market. The growth plan is stage-based: Stage 1 is ${n(ST1.payingUsers)} paying merchants, Stage 2 is ${n(ST2.payingUsers)}, and Stage 3 is ${n(ST3.payingUsers)}. At Stage 3, ${n(ST3.payingUsers)} paying merchants is ${usd(ST3.arrLow)} to ${usd(ST3.arrHigh)} in annual recurring revenue (modelled, at ${usd(PRICING.arpu)} to ${usd(PRICING.arpuMix)} average revenue per merchant per month).` },
      { type: 'placeholder', text: `Alberta-specific market size, digital adoption rates, and small business count by industry — pending Business Link Alberta secondary research.` },
      { type: 'placeholder', text: `Target market demographics (age, income, occupation, current tool spend, buying habits) — pending primary survey results.` },
    ]; },
  },

  {
    id: "model",
    number: "07",
    title: "Business Model",
    get content() {
      return `Primary revenue comes from three subscription plans: Starter at ${PRICING.starter} per month, Grow at ${PRICING.growth} per month, and Pro at ${PRICING.pro} per month. Subscription revenue today is ${usd(TRACTION.mrr)} per month from ${TRACTION.paidUsers} paying merchants.

Secondary revenue comes from a platform transaction fee (${PRICING.transactionFee}) on each sale processed through Stripe Connect — the same model as Shopify, and one that aligns platform revenue directly with merchant success. Transaction fees are live and tracked separately from subscriptions.

Future revenue streams include a premium theme marketplace, a third-party app ecosystem with commission, and white-label licensing for agencies and operators.

Unit economics (modelled, not measured): average revenue per merchant is ${usd(UNIT_ECON.arpu)} per month today, or about ${usd(UNIT_ECON.arpuMix)} on an illustrative 60/30/10 mix of Starter, Grow, and Pro. At 5% monthly churn, lifetime value is about ${usd(UNIT_ECON.ltv)} to ${usd(UNIT_ECON.ltvMix)} on a revenue basis. Customer acquisition cost is not yet measured because there is no paid acquisition. Our targets are an LTV to CAC ratio of at least ${UNIT_ECON.targets.ltvCacMin} to 1 and a CAC payback inside ${UNIT_ECON.targets.paybackMonthsMax} months.`;
    },
  },

  {
    id: "competition",
    number: "08",
    title: "Competitive Landscape",
    get blocks() { return [
      { type: 'text', text: `Shopify is the largest ecommerce ecosystem but was built for retailers, not makers. It has no native ingredient management, batch costing, or CRM. Its app ecosystem adds cost and integration friction at every step.` },
      { type: 'text', text: `Squarespace is design-first and business-second. No ecommerce depth, no back-office tools, and booking requires third-party integration. Kajabi serves digital products and courses at $150–400/month — overkill for most small merchants with no physical ecommerce or production costing. HoneyBook and Dubsado serve service business CRM and invoicing but have no storefront or ecommerce capability.` },
      { type: 'text', text: `${COMPANY.name}'s advantages are integrated operations that work on day one, built-in production costing (Shopify has none natively), radically isolated theming, and AI-native architecture designed for external access from day one.` },
      { type: 'placeholder', text: `Competitor market share, advertising spend, and distribution analysis — pending secondary market research.` },
    ]; },
  },

  {
    id: "competitive-weaknesses",
    number: "08b",
    title: "Competitive Weaknesses & Mitigation",
    get blocks() { return [
      { type: 'text', text: `Every early-stage SaaS product carries structural disadvantages. The following is an honest assessment of ${COMPANY.name}'s current weaknesses and the specific strategy for overcoming each.` },
      {
        type: 'weakness',
        title: 'Very early traction',
        challenge: `${COMPANY.name} has ${TRACTION.paidUsers} paying merchants and ${usd(TRACTION.mrr)} in monthly subscription revenue. ${TRACTION.paidUsers} of ${TRACTION.activeUsers} active users converting is an early signal, not a proven conversion rate.`,
        mitigation: `The plan is stage-based: reach ${n(ST1.payingUsers)} paying merchants, then ${n(ST2.payingUsers)}, then ${n(ST3.payingUsers)}. Each stage produces real conversion, churn, and acquisition-cost data before the next one is funded. Revenue is a milestone, not an assumption.`,
      },
      {
        type: 'weakness',
        title: 'No strong brand identity',
        challenge: `${WORDING.weakness} The current name and identity are not distinctive enough to build awareness on their own.`,
        mitigation: `A rename and brand identity project is part of the use of funds (about 10% of the investment). Branding is also one of the first hires planned at Stage 3.`,
      },
      {
        type: 'weakness',
        title: 'Single founder — operational concentration risk',
        challenge: `All product development, design, operations, and customer support currently rests with one person.`,
        mitigation: `The technical architecture is built for handoff — documented, modular, and API-first. The first hires (marketing and branding, then engineering and customer success) follow Stage 3 and are funded from the investment round. An advisory board is being established to provide strategic continuity.`,
      },
      {
        type: 'weakness',
        title: 'Limited marketing reach',
        challenge: `${COMPANY.name} is an unknown brand entering a market where Shopify and Squarespace have years of brand equity, and there is no paid marketing yet.`,
        mitigation: `The go-to-market strategy is deliberately narrow: Alberta makers and independent brands first. Word-of-mouth within tight craft and small business communities travels faster than paid advertising. Live merchant sites are the primary proof in Year 1.`,
      },
      {
        type: 'weakness',
        title: 'Funding not yet secured',
        challenge: `Development has been self-funded. Limited runway for extended growth at the current pace.`,
        mitigation: `Operating costs are minimal (solo founder, existing infrastructure subscriptions). The raise is ${usd(FUNDING.currentGrant.amount)} in grants plus ${usd(FUNDING.seedRound.min)} from investors, sized to reach Stage 3. The funding requirement is time-bound, not structural.`,
      },
    ]; },
  },

  {
    id: "swot",
    number: "08c",
    title: "SWOT Analysis",
    get blocks() { return [
      { type: 'text', text: `Strengths and Weaknesses are internal. Opportunities and Threats are external. This reflects ${COMPANY.name}'s position at MVP stage — a live product with its first paying merchants.` },
      {
        type: 'swot',
        strengths: [
          `Founder operates Lumina — is a primary user of the platform`,
          `Full-stack capability: React, Supabase, Stripe, multi-tenant SaaS architecture`,
          `Deep customer empathy built from lived experience, not assumption`,
          `Live product: ${TRACTION.activeUsers} active users, ${TRACTION.paidUsers} paying merchants, ${usd(TRACTION.mrr)} MRR`,
          `Canadian-built and Alberta-based — aligned with local small business identity`,
          `Low overhead: solo founder, fast iteration cycle`,
        ],
        weaknesses: [
          `No strong brand identity yet; a rename is planned`,
          `Very early traction: ${TRACTION.paidUsers} paying merchants is a signal, not a proven conversion rate`,
          `Single founder — operational concentration risk`,
          `No dedicated sales, marketing, or support function`,
          `Limited brand awareness and no paid marketing yet`,
          `No external funding secured`,
        ],
        opportunities: [
          `Canadian small business digital adoption accelerating post-pandemic`,
          `Government grants available (CDAP, Alberta Innovates, Business Link)`,
          `Shopify price increases creating merchant dissatisfaction`,
          `Underserved niche: makers with no platform built specifically for them`,
          `Growing maker economy and independent brand movement in ${COMPANY.location.split(',')[1]?.trim() || 'Alberta'}`,
          `AI-enhanced features represent a clear product roadmap advantage`,
        ],
        threats: [
          `Shopify and Squarespace have significantly larger development resources`,
          `A weak brand identity makes it harder to stand out in a crowded market`,
          `Market education required — customers may not know a better option exists`,
          `Potential for well-funded competitor to enter the same niche`,
          `Dependency on third-party infrastructure (Supabase, Stripe)`,
        ],
      },
    ]; },
  },

  {
    id: "marketing",
    number: "09",
    title: "Marketing & Sales Strategy",
    get content() {
      return `Stage 1 targets ${n(ST1.payingUsers)} paying merchants through the current ${TRACTION.activeUsers} active users, live merchant sites as proof, and word of mouth. The goal is to learn fast, fix what breaks, and earn referrals. A merchant who replaces Shopify, Mailchimp, and a costing spreadsheet with one platform tells other merchants.

The primary target in this stage is beauty brands, small product makers, and service businesses in Alberta and British Columbia who currently stitch together several tools.

Stage 2 targets ${n(ST2.payingUsers)} paying merchants through Instagram and TikTok content showcasing real storefronts, presence in Canadian small business communities, outreach to women in business networks and maker communities in Alberta, and case studies from live merchants.

Stage 3 targets ${n(ST3.payingUsers)} paying merchants through paid acquisition on Meta and Google once unit economics are validated — CAC, LTV, and churn confirmed from real cohort data. Marketing and branding hires follow Stage 3.`;
    },
  },

  {
    id: "operations",
    number: "10",
    title: "Operations",
    get blocks() { return [
      { type: 'label', text: 'Service Delivery' },
      { type: 'text', text: `${COMPANY.name} is a SaaS product delivered through a web browser and cross-platform mobile application. No physical production, inventory, or logistics. Available 24/7, hosted on cloud infrastructure with automatic scaling. New merchants self-onboard through a guided setup flow. The founder provides direct onboarding support to early merchants via email and video call. At scale, onboarding will be automated through in-app tutorials and a knowledge base.` },
      { type: 'label', text: 'Staffing' },
      { type: 'text', text: `Current stage: single founder handles all product development, design, customer support, and business operations — sustainable through Stage 1 and into Stage 2. First planned hires follow Stage 3 (${n(ST3.payingUsers)} paying merchants): marketing and branding first, then engineering and customer success, funded by the investment round.` },
      { type: 'label', text: 'Distribution' },
      { type: 'text', text: `Direct to merchants via the web application at ${COMPANY.url}. No intermediary or reseller. Year 1 acquisition channels: direct referral from live merchants, organic search, social media (Instagram, TikTok targeting maker communities), and presence at Alberta craft and maker markets.` },
      { type: 'label', text: 'Legal Structure' },
      { type: 'text', text: `${COMPANY.legalStructure}. Federal incorporation under the Canada Business Corporations Act planned at or before public launch — providing liability protection, a cleaner structure for future investment, and the ability to enter contracts independently of the founder.` },
      { type: 'label', text: 'Licenses, Tax & Compliance' },
      { type: 'text', text: `No product-specific license required for SaaS software in Alberta or federally. GST/HST number required once revenue exceeds $30,000 CAD annually — to be obtained at incorporation. Federal and provincial corporate income tax filed under CRA T2 return post-incorporation.` },
      { type: 'label', text: 'Insurance' },
      { type: 'text', text: `Professional liability (errors and omissions) insurance at launch. Cyber liability insurance at the 100-merchant milestone. Both standard requirements for SaaS businesses handling merchant payment data.` },
      { type: 'label', text: 'Technology Infrastructure' },
      { type: 'text', text: `Built on Supabase (PostgreSQL database, authentication, storage), Vercel (hosting and edge deployment), and Stripe Connect (payment processing). All three are enterprise-grade services with 99.9%+ uptime SLAs. Codebase maintained in a private GitHub repository with automated deployment pipelines and daily database backups.` },
    ]; },
  },

  {
    id: "management",
    number: "11",
    title: "Management & Ownership",
    get blocks() { return [
      { type: 'label', text: 'Founder' },
      { type: 'text', text: `${FOUNDER_INFO.name} — ${FOUNDER_INFO.title}. Sole owner, 100% equity. Responsible for all product architecture, development, design, operations, and business strategy. Also operates Lumina, a live e-commerce business that serves as the primary testbed and proof of concept for ${COMPANY.name}'s feature set.` },
      { type: 'label', text: 'Legal Structure & Ownership' },
      { type: 'text', text: `${COMPANY.legalStructure}. 100% owned by ${FOUNDER_INFO.name}. No external shareholders, partners, or equity agreements at this stage.` },
      { type: 'label', text: 'Professional Resource Team' },
      { type: 'bullets', items: [
        `Entrepreneurship program team — provided business plan framework and ongoing mentorship`,
        `Independent mentors with experience in small business development and technology entrepreneurship`,
        `Business Link Alberta — accessed for market research, secondary data, and advisory services`,
        `Accountant / bookkeeper (to be engaged at incorporation)`,
        `Legal counsel (to be engaged at incorporation for corporate structure and terms of service)`,
      ]},
      { type: 'label', text: 'Planned Team Additions' },
      { type: 'text', text: `After Stage 3 (${n(ST3.payingUsers)} paying merchants): marketing and branding first, then engineering and customer success, funded by the investment round. At US market entry: US-based business development lead.` },
    ]; },
  },

  {
    id: "traction",
    number: "12",
    title: "Traction",
    get content() {
      return `The product is live at MVP. ${TRACTION.activeUsers} users are actively using the platform and ${TRACTION.paidUsers} have converted to paid, for ${usd(TRACTION.mrr)} in monthly subscription revenue. ${TRACTION.paidUsers} of ${TRACTION.activeUsers} is an early signal, not a conversion rate. Transaction fees are on and tracked separately. No paid marketing has been used.

What is live: storefront, cart and checkout, connected shipping, scheduling, and Stripe Connect payments. Multi-tenant database with Row-Level Security across ${TRACTION.dbTables}+ tables. Dual authentication covering merchants and buyers as completely separate identity pools. Fastify REST API with products, orders, customers, and inventory across ${TRACTION.apiEndpoints}+ endpoints. Merchant admin dashboard. Costing (Pulse) with ingredients, suppliers, batch costing, packaging design studio, QuickBooks integration, and financial dashboard. Customers (Constellation) with customer overview, segments, journey tracking, and engagement analytics. Tasks and calendar (Compass). Email, blog, FAQ, legal, newsletter, hero, banner, and reviews.`;
    },
  },

  {
    id: "roadmap",
    number: "13",
    title: "Product Roadmap",
    content: `Live now: multi-tenant architecture, dual authentication, REST API, merchant dashboard, storefront, cart and checkout, shipping, scheduling, Stripe Connect payments, Costing, Customers, Tasks, Email, and all content modules.

Growth stages (paying merchants): Stage 1 is ${n(ST1.payingUsers)}, Stage 2 is ${n(ST2.payingUsers)}, Stage 3 is ${n(ST3.payingUsers)}, and then we hire for marketing and branding.

Product next: custom domain support, Canadian GST/HST tax engine, the BARE theme, and the remaining themes.

Later: AI Agent API enabling ChatGPT or Claude to search inventory and place orders, an internal AI merchant assistant, and US market entry.`,
  },

  {
    id: "ask",
    number: "14",
    title: "Funding Requirements",
    get blocks() { return [
      { type: 'label', text: `The Raise — ${usd(FUNDING.currentGrant.amount)} in Grants + ${usd(FUNDING.seedRound.min)} from Investors` },
      { type: 'text', text: `Grants of ${usd(FUNDING.currentGrant.amount)}: ${FUNDING.currentGrant.goal}. Illustrative use: ${FUNDING.currentGrant.breakdown.map(b => `${b.label.toLowerCase()} ${usd(b.amount)}`).join(', ')}.` },
      { type: 'text', text: `Investment of ${usd(FUNDING.seedRound.min)}: ${FUNDING.seedRound.goal}. Illustrative split: ${FUNDING.seedRound.breakdown.map(b => `${b.label.toLowerCase()} ${b.pct}% (${usd(b.amount)})`).join(', ')}.` },
      { type: 'label', text: 'Long-Term Financing Plan' },
      { type: 'text', text: `Revenue-funded growth from subscriptions and transaction fees, with a possible later round to fund US market entry and AI feature development. ${FOUNDER_INFO.name} retains majority ownership through all funding stages.` },
      { type: 'placeholder', text: `Pessimistic and ideal 3-year financial scenarios — pending survey pricing validation and Business Link market size data.` },
    ]; },
  },

];
