// ─── BUSINESS PLAN CONTENT ────────────────────────────────────────────────────
// Single source of truth: all names/numbers come from config.js
// To rename the app, update COMPANY.name in config.js — it updates everywhere.

import { COMPANY, FOUNDER_INFO, TRACTION, PRICING, MARKET, MILESTONES, FUNDING, COMPETITORS, UNIT_ECON } from './config.js';

export const PLAN_SECTIONS = [
  {
    id: "executive-summary",
    number: "01",
    title: "Executive Summary",
    get content() {
      return `${COMPANY.name} is a Canadian multi-tenant vertical SaaS platform that gives small business owners a complete, ready-to-operate online business from day one. Unlike Shopify, Squarespace, or any single-purpose tool, ${COMPANY.name} combines a fully themed customer storefront with an integrated merchant back-office — including a CRM (Constellation), a production costing engine (Pulse), task management (Compass), email, blog, newsletter, reviews, FAQ, and legal tools — all in one platform, activated through a module toggle system.

The platform is built for two customer types: small product-based businesses (beauty brands, skincare makers, small manufacturers, food producers) who need both a storefront and operational tools; and service-based businesses (fitness trainers, photographers, salons, therapists) who need a professional online presence with client-facing functionality.

${COMPANY.name} is currently pre-revenue, built entirely by a solo Canadian developer, with ${TRACTION.betaMerchants} beta merchants signed up and waiting for launch.`;
    },
  },

  {
    id: "company-description",
    number: "02",
    title: "Company Description",
    get blocks() { return [
      { type: 'text', text: `${COMPANY.name} is a Canadian-built, Alberta-founded SaaS company providing integrated operational infrastructure for small makers, independent brands, and service businesses. It is currently in active development with a working multi-tenant platform, ${TRACTION.betaMerchants} confirmed beta merchants, and a clear path to launch.` },
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
      { type: 'text', text: `No competitor combines a fully themed storefront with production costing, CRM, and task management in a single platform. The production costing engine (Pulse) has no direct equivalent in Shopify, Squarespace, Kajabi, or any current small business platform. The radically isolated theme engine is not a color swap — each theme is architecturally distinct.` },
      { type: 'label', text: 'How It Will Be Used' },
      { type: 'text', text: `Merchants access ${COMPANY.name} through a web browser on desktop or mobile. Buyers access the merchant's public storefront through a custom-branded URL. No app install required for either party. Merchants configure their store once and operate continuously from the dashboard.` },
      { type: 'label', text: 'How Price Is Established' },
      { type: 'text', text: `Pricing is based on a tiered subscription model anchored to competitor pricing and the value of tools replaced. A merchant replacing Shopify ($79), Mailchimp ($20), and a costing spreadsheet saves $100+/month by consolidating onto ${COMPANY.name} at $${PRICING.arpu}/month. Pricing will be validated through beta merchant survey data before public launch.` },
      { type: 'label', text: 'Competitive Advantages' },
      { type: 'bullets', items: [
        `Production costing engine — no equivalent exists in the market for small makers`,
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
      { type: 'text', text: `There are ${MARKET.canadianSmallBiz} small businesses in Canada and ${MARKET.usSmallBiz} in the United States. The global SaaS ecommerce platform market is projected to exceed ${MARKET.globalSaaSMarket} by ${MARKET.saasMarketYear}.` },
      { type: 'text', text: `The indie beauty and personal care segment is one of the fastest-growing direct-to-consumer categories in North America. A conservative target of ${MARKET.targetCanadian.toLocaleString()} Canadian small businesses at $${MARKET.targetMrr}/month represents $${MARKET.targetArr} ARR in Canada alone, before any US expansion. At 500 paying merchants at $${PRICING.arpu}/month that is $474K ARR. At 2,000 merchants, $1.9M ARR — achievable without venture-scale growth.` },
      { type: 'placeholder', text: `Alberta-specific market size, digital adoption rates, and small business count by industry — pending Business Link Alberta secondary research.` },
      { type: 'placeholder', text: `Target market demographics (age, income, occupation, current tool spend, buying habits) — pending primary survey results.` },
    ]; },
  },

  {
    id: "model",
    number: "07",
    title: "Business Model",
    get content() {
      return `Primary revenue comes from subscription tiers: a Starter tier at approximately ${PRICING.starter} per month for early-stage businesses, a Growth tier at approximately ${PRICING.growth} per month for active sellers, and an Enterprise tier at custom pricing for multi-staff high-volume operations. All new signups receive a ${PRICING.trialDays}-day free trial with all modules unlocked.

Secondary revenue comes from a small platform transaction fee of ${PRICING.transactionFee} on each sale processed through Stripe Connect — the same model as Shopify, and one that aligns platform revenue directly with merchant success.

Future revenue streams include a premium theme marketplace, a third-party app ecosystem with commission, and white-label licensing for agencies and operators.

Unit economics at current assumptions: ARPU of $${UNIT_ECON.arpu} per month, monthly churn of ${UNIT_ECON.churnRate * 100}%, LTV of approximately $${UNIT_ECON.ltv.toLocaleString()}, CAC of approximately $${UNIT_ECON.cac}, and an LTV to CAC ratio of approximately ${UNIT_ECON.ltvCacRatio} to 1.`;
    },
  },

  {
    id: "competition",
    number: "08",
    title: "Competitive Landscape",
    get blocks() { return [
      { type: 'text', text: `Shopify is the largest ecommerce ecosystem but was built for retailers, not makers. It has no ingredient management, no batch costing, and no native CRM. Its app ecosystem adds cost and integration friction at every step.` },
      { type: 'text', text: `Squarespace is design-first and business-second. No ecommerce depth, no back-office tools, and booking requires third-party integration. Kajabi serves digital products and courses at $150–400/month — overkill for most small merchants with no physical ecommerce or production costing. HoneyBook and Dubsado serve service business CRM and invoicing but have no storefront or ecommerce capability.` },
      { type: 'text', text: `${COMPANY.name}'s advantages are integrated operations that work on day one, a production costing engine no competitor has, radically isolated theming, and AI-native architecture designed for external access from day one.` },
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
        title: 'Pre-revenue and pre-launch',
        challenge: `${COMPANY.name} has not yet generated subscription revenue. There is no proven willingness-to-pay data.`,
        mitigation: `${TRACTION.betaMerchants} beta merchants are actively waiting to onboard. Beta launch with a free or discounted period will generate the first revenue data and testimonials within 30 days of completing the cart and payments module. Revenue is a milestone, not an assumption.`,
      },
      {
        type: 'weakness',
        title: 'Single founder — operational concentration risk',
        challenge: `All product development, design, operations, and customer support currently rests with one person.`,
        mitigation: `The technical architecture is built for handoff — documented, modular, and API-first. The first hire (customer success / operations) is planned at the 100-merchant milestone and budgeted in the $${(FUNDING.currentGrant.amount / 1000).toFixed(0)}K grant plan. An advisory board is being established to provide strategic continuity.`,
      },
      {
        type: 'weakness',
        title: 'Zero brand awareness at launch',
        challenge: `${COMPANY.name} is an unknown brand entering a market where Shopify and Squarespace have years of brand equity.`,
        mitigation: `The go-to-market strategy is deliberately narrow: Alberta makers and independent brands first. Word-of-mouth within tight craft and small business communities travels faster than paid advertising. Beta merchant success stories will be the primary acquisition channel in Year 1.`,
      },
      {
        type: 'weakness',
        title: 'Incomplete feature set at beta launch',
        challenge: `Cart, payment processing (Stripe Connect), and scheduling are still in development. Launching without these limits the addressable market.`,
        mitigation: `The launch scope is deliberately constrained to features that are complete and stable. The beta audience has been selected for fit with the current feature set. A clear public roadmap communicates what is coming and by when.`,
      },
      {
        type: 'weakness',
        title: 'No external funding secured',
        challenge: `Development has been self-funded. Limited runway for extended pre-revenue operation.`,
        mitigation: `Operating costs are minimal (solo founder, existing infrastructure subscriptions). Grant applications are underway. Revenue at 10 merchants covers all operating costs. The funding requirement is time-bound, not structural.`,
      },
    ]; },
  },

  {
    id: "swot",
    number: "08c",
    title: "SWOT Analysis",
    get blocks() { return [
      { type: 'text', text: `Strengths and Weaknesses are internal. Opportunities and Threats are external. This reflects ${COMPANY.name}'s position as of current development stage — pre-revenue, pre-launch, with a working product and confirmed beta demand.` },
      {
        type: 'swot',
        strengths: [
          `Founder operates Lumina — is a primary user of the platform`,
          `Full-stack capability: React, Supabase, Stripe, multi-tenant SaaS architecture`,
          `Deep customer empathy built from lived experience, not assumption`,
          `${TRACTION.betaMerchants} beta merchants confirmed — real demand before public launch`,
          `Canadian-built and Alberta-based — aligned with local small business identity`,
          `Low overhead: solo founder, fast iteration cycle`,
        ],
        weaknesses: [
          `Pre-revenue: no demonstrated willingness-to-pay yet`,
          `Single founder — operational concentration risk`,
          `No dedicated sales, marketing, or support function`,
          `Zero brand awareness at launch`,
          `Feature set not yet complete (cart, payments in progress)`,
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
          `Market education required — customers may not know a better option exists`,
          `Churn risk if platform launches with incomplete feature set`,
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
      return `Phase one targets the first 50 merchants through the existing ${TRACTION.betaMerchants} beta merchants and word of mouth. The goal is to onboard them, learn fast, fix what breaks, and earn referrals. A merchant who replaces Shopify, Mailchimp, and a costing spreadsheet with one platform and saves $300 per month tells other merchants.

The primary target in this phase is beauty brands and small product makers in Alberta and British Columbia who are currently on Shopify and using spreadsheets for production costing.

Phase two targets 50 to 250 merchants through Instagram and TikTok content showcasing real storefronts, presence in Canadian small business communities, outreach to women in business networks and maker communities in Alberta, and case studies from beta merchants.

Phase three targets 250 or more merchants through paid acquisition on Meta and Google once unit economics are validated — CAC, LTV, and churn confirmed from real cohort data.`;
    },
  },

  {
    id: "operations",
    number: "10",
    title: "Operations",
    get blocks() { return [
      { type: 'label', text: 'Service Delivery' },
      { type: 'text', text: `${COMPANY.name} is a SaaS product delivered through a web browser and cross-platform mobile application. No physical production, inventory, or logistics. Available 24/7, hosted on cloud infrastructure with automatic scaling. New merchants self-onboard through a guided setup flow. The founder provides direct onboarding support to beta merchants via email and video call. At scale, onboarding will be automated through in-app tutorials and a knowledge base.` },
      { type: 'label', text: 'Staffing' },
      { type: 'text', text: `Current stage: single founder handles all product development, design, customer support, and business operations — sustainable through beta and up to approximately 50 merchants. First planned hire at 100 merchants: a part-time Customer Success and Operations role, freeing the founder to focus on product development and the US expansion roadmap.` },
      { type: 'label', text: 'Distribution' },
      { type: 'text', text: `Direct to merchants via the web application at ${COMPANY.url}. No intermediary or reseller. Year 1 acquisition channels: direct referral from beta merchants, organic search, social media (Instagram, TikTok targeting maker communities), and presence at Alberta craft and maker markets.` },
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
      { type: 'text', text: `At ${MILESTONES.y1.merchants} merchants: part-time Customer Success & Operations. At ${MILESTONES.y2.merchants} merchants: full-time Head of Growth, part-time developer. At US market entry: US-based business development lead.` },
    ]; },
  },

  {
    id: "traction",
    number: "12",
    title: "Traction",
    get content() {
      return `${TRACTION.betaMerchants} beta merchants signed up through word of mouth before the product was publicly available. These are real small business owners who want to use the platform.

The platform is in advanced development. Multi-tenant database with Row-Level Security across ${TRACTION.dbTables}+ tables. Dual authentication covering merchants and buyers as completely separate identity pools. Fastify REST API with products, orders, customers, and inventory across ${TRACTION.apiEndpoints}+ endpoints. Merchant admin dashboard. Pulse production costing module with ingredients, suppliers, batch costing, packaging design studio, QuickBooks integration, and financial dashboard. Constellation CRM with customer overview, segments, journey tracking, and engagement analytics. Compass task and calendar management. Blog, FAQ, legal, newsletter, email, hero, banner, and reviews — all built.

Zero churn. The product approaches its first beta release.`;
    },
  },

  {
    id: "roadmap",
    number: "13",
    title: "Product Roadmap",
    content: `Complete or in progress: full multi-tenant architecture, dual authentication, REST API, merchant dashboard, Pulse, Constellation, Compass, and all content modules.

Next 6 months: cart, Stripe Connect payments, Shippo shipping integration, subscription billing system, BARE theme, custom domain support, and Canadian GST/HST tax engine.

6 to 18 months: remaining three themes (Midnight Luxury, Gothic Academia, Neubrutalism), scheduling module for fitness and therapy and salons, AI Agent API enabling ChatGPT or Claude to search inventory and place orders, internal AI merchant assistant, and US market entry.`,
  },

  {
    id: "ask",
    number: "14",
    title: "Funding Requirements",
    get blocks() { return [
      { type: 'label', text: `Current Ask — $${FUNDING.currentGrant.amount.toLocaleString()} Grant` },
      { type: 'text', text: `For the ${FUNDING.currentGrant.name} of $${FUNDING.currentGrant.amount.toLocaleString()}: $${FUNDING.currentGrant.breakdown[0].amount.toLocaleString()} for Supabase hosting and infrastructure during the beta period, $${FUNDING.currentGrant.breakdown[1].amount.toLocaleString()} for email service, CDN, and domain management, $${FUNDING.currentGrant.breakdown[2].amount.toLocaleString()} for beta merchant onboarding support, and $${FUNDING.currentGrant.breakdown[3].amount.toLocaleString()} for initial paid merchant acquisition. This grant closes the gap between built and launched.` },
      { type: 'label', text: `Seed Round — $${(FUNDING.seedRound.min / 1000).toFixed(0)}K–$${(FUNDING.seedRound.max / 1000).toFixed(0)}K` },
      { type: 'text', text: `$${FUNDING.seedRound.breakdown[0].amount.toLocaleString()} for infrastructure and hosting over 12 months, $${FUNDING.seedRound.breakdown[1].amount.toLocaleString()} for a developer hire on a 6-month contract, $${FUNDING.seedRound.breakdown[2].amount.toLocaleString()} for customer success and onboarding, $${FUNDING.seedRound.breakdown[3].amount.toLocaleString()} for marketing and acquisition, $${FUNDING.seedRound.breakdown[4].amount.toLocaleString()} for legal and compliance, and $${FUNDING.seedRound.breakdown[5].amount.toLocaleString()} operating reserve. This enables 100+ paying merchants in 12 months and a clear path to $${(MILESTONES.y2.arr / 1000).toFixed(0)}K ARR by end of Year 2.` },
      { type: 'label', text: 'Long-Term Financing Plan' },
      { type: 'text', text: `Revenue-funded growth from Year 1 subscriptions. Potential Series A at 2,000+ merchants to fund US market entry and AI feature development. ${FOUNDER_INFO.name} retains majority ownership through all funding stages.` },
      { type: 'placeholder', text: `Pessimistic and ideal 3-year financial scenarios — pending survey pricing validation and Business Link market size data.` },
    ]; },
  },
];
