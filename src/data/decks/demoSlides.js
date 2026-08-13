// ─── PRODUCT DEMO DECK — SLIDE DATA ───────────────────────────────────────────
// Theme-agnostic, like the investor deck. Written for customers and merchants
// watching a live demo — no funding ask, no unit economics. Each slug maps to
// an interactive mockup in components/pitch/visuals/demoVisuals.jsx.

import { COMPANY } from '../config.js';

export const DEMO_SLIDES = [
  {
    id: 1,
    slug: 'welcome',
    eyebrow: 'Welcome',
    headline: 'One platform. Every operation.',
    body: `${COMPANY.name} is the complete business platform for small brands and makers — a branded storefront, a merchant dashboard, and everything behind it, in one place.`,
    speakerNote: 'Open on the hero mockup. Let them see it before you explain it.',
    tag: '01',
  },
  {
    id: 2,
    slug: 'problem',
    eyebrow: 'The Problem',
    headline: 'Right now, your business lives in ten different tabs.',
    body: 'A storefront tool. A spreadsheet for inventory. A CRM. An email platform. A separate costing sheet. None of them talk to each other, and you\u2019re the one stitching it together every morning.',
    speakerNote: 'Click through the scattered tabs, then let them collapse into one. That\u2019s the whole pitch in five seconds.',
    tag: '02',
  },
  {
    id: 3,
    slug: 'platform',
    eyebrow: 'What You Can Do',
    headline: 'Everything a business needs to operate online, under one login.',
    body: 'Storefront, products and inventory, orders, payments, shipping, customers, content, and production costing \u2014 all built in, all connected, nothing bolted on.',
    speakerNote: 'Hover each module. This is the map for the rest of the demo.',
    tag: '03',
  },
  {
    id: 4,
    slug: 'customer',
    eyebrow: 'Customer Experience',
    headline: 'Browse, buy, and check out in a storefront that feels custom-built.',
    body: 'Every business gets its own branded storefront \u2014 product pages, variants, cart, checkout, and order history \u2014 with none of the generic template feel.',
    speakerNote: 'Click a product, add it to cart, open the cart drawer. Let it feel real.',
    tag: '04',
  },
  {
    id: 5,
    slug: 'merchant',
    eyebrow: 'Merchant Experience',
    headline: 'Run the business from a single dashboard.',
    body: 'Products, orders, customers, and production costing in one merchant view \u2014 built for the person running the business, not the person who built the software.',
    speakerNote: 'Click between tabs. Point out that nothing requires leaving the page.',
    tag: '05',
  },
  {
    id: 6,
    slug: 'storefront-theme',
    eyebrow: 'Storefront Customization',
    headline: 'Every business gets its own look. Same platform underneath.',
    body: `Tenant-specific storefronts, dynamic themes, and full branding control \u2014 two businesses on ${COMPANY.name} can look nothing alike, and both are running on the same reliable core.`,
    speakerNote: 'Click each swatch. Watch the whole storefront repaint live \u2014 this is the differentiator.',
    tag: '06',
  },
  {
    id: 7,
    slug: 'workflow',
    eyebrow: 'Operations & Workflow',
    headline: 'From sign-up to fulfilled order, one continuous path.',
    body: 'A merchant sets up their storefront, adds products, and configures payments and shipping. A customer discovers, orders, and pays. The merchant fulfills. Nothing falls through a gap between tools.',
    speakerNote: 'Click through the steps left to right. Keep it to one sentence per step out loud.',
    tag: '07',
  },
  {
    id: 8,
    slug: 'portal',
    eyebrow: 'One-Stop-Shop Portal',
    headline: 'Stop paying for the seams between your tools.',
    body: 'Business, storefront, customer, order, payment, and fulfillment \u2014 one connected workflow instead of six subscriptions that don\u2019t know about each other.',
    speakerNote: 'Toggle Before/After. Let the after-state breathe for a second before moving on.',
    tag: '08',
  },
  {
    id: 9,
    slug: 'why',
    eyebrow: 'Why This Matters',
    headline: 'This isn\u2019t another website builder.',
    body: `${COMPANY.name} gives small businesses the infrastructure to operate online without piecing together a dozen systems \u2014 from launching a storefront to running the business behind it.`,
    speakerNote: 'Let the chips speak for the audience \u2014 click the one that matches who\u2019s in the room.',
    tag: '09',
  },
  {
    id: 10,
    slug: 'live-demo',
    eyebrow: 'Live Demo',
    headline: 'Let\u2019s look at the real thing.',
    body: 'Business \u2192 storefront \u2192 customer \u2192 checkout \u2192 merchant dashboard \u2192 order. One continuous story, in the actual app.',
    speakerNote: 'Minimal text on screen \u2014 this is your cue card, not a slide to read from.',
    tag: '10',
  },
];

export const DEMO_SLIDE_COUNT = DEMO_SLIDES.length;
