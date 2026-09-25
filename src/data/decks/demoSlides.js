// ─── PRODUCT DEMO DECK — SLIDE DATA ───────────────────────────────────────────
// Theme-agnostic, like the investor deck. Written for customers and merchants
// watching a live demo — no funding ask, no unit economics. Each slug maps to
// an interactive mockup in components/pitch/visuals/demoVisuals.jsx.

import { COMPANY } from '../config.js';

const BASE_SLIDES = [
  {
    id: 1,
    slug: 'welcome',
    autoMs: 5000,
    eyebrow: 'Welcome',
    headline: 'One platform. Every operation.',
    body: `${COMPANY.name} is the complete business platform for small brands and makers — a branded storefront, a merchant dashboard, and everything behind it, in one place.`,
    speakerNote: 'Open on the hero mockup. Let them see it before you explain it.',
    tag: '01',
  },
  {
    id: 2,
    slug: 'problem',
    autoMs: 6500,
    eyebrow: 'The Problem',
    headline: 'Right now, your business lives in ten different tabs.',
    body: 'A storefront tool. A spreadsheet for inventory. A CRM. An email platform. A separate costing sheet. None of them talk to each other, and you\u2019re the one stitching it together every morning.',
    speakerNote: 'Click through the scattered tabs, then let them collapse into one. That\u2019s the whole pitch in five seconds.',
    tag: '02',
  },
  {
    id: 3,
    slug: 'platform',
    autoMs: 5500,
    eyebrow: 'What You Can Do',
    headline: 'Everything a business needs to operate online, under one login.',
    body: 'Storefront, products and inventory, orders, payments, shipping, customers, content, and production costing \u2014 all built in, all connected, nothing bolted on.',
    speakerNote: 'Hover each module. This is the map for the rest of the demo.',
    tag: '03',
  },
  {
    id: 4,
    slug: 'customer',
    autoMs: 9000,
    eyebrow: 'Customer Experience',
    headline: 'Browse, buy, and check out in a storefront that feels custom-built.',
    body: 'Every business gets its own branded storefront \u2014 product pages, variants, cart, checkout, and order history \u2014 with none of the generic template feel.',
    speakerNote: 'Click a product, add it to cart, open the cart drawer. Let it feel real.',
    tag: '04',
  },
  {
    id: 5,
    slug: 'merchant',
    autoMs: 5500,
    eyebrow: 'Merchant Experience',
    headline: 'Run the business from a single dashboard.',
    body: 'Products, orders, customers, and production costing in one merchant view \u2014 built for the person running the business, not the person who built the software.',
    speakerNote: 'Click between tabs. Point out that nothing requires leaving the page.',
    tag: '05',
  },
  {
    id: 6,
    slug: 'storefront-theme',
    autoMs: 7500,
    eyebrow: 'Storefront Customization',
    headline: 'Every business gets its own look. Same platform underneath.',
    body: `Tenant-specific storefronts, dynamic themes, and full branding control \u2014 two businesses on ${COMPANY.name} can look nothing alike, and both are running on the same reliable core.`,
    speakerNote: 'Click each swatch. Watch the whole storefront repaint live \u2014 this is the differentiator.',
    tag: '06',
  },
  {
    id: 7,
    slug: 'workflow',
    autoMs: 8000,
    eyebrow: 'Operations & Workflow',
    headline: 'From sign-up to fulfilled order, one continuous path.',
    body: 'A merchant sets up their storefront, adds products, and configures payments and shipping. A customer discovers, orders, and pays. The merchant fulfills. Nothing falls through a gap between tools.',
    speakerNote: 'Click through the steps left to right. Keep it to one sentence per step out loud.',
    tag: '07',
  },
  {
    id: 8,
    slug: 'portal',
    autoMs: 5500,
    eyebrow: 'One-Stop-Shop Portal',
    headline: 'Stop paying for the seams between your tools.',
    body: 'Business, storefront, customer, order, payment, and fulfillment \u2014 one connected workflow instead of six subscriptions that don\u2019t know about each other.',
    speakerNote: 'Toggle Before/After. Let the after-state breathe for a second before moving on.',
    tag: '08',
  },
  {
    id: 9,
    slug: 'why',
    autoMs: 5500,
    eyebrow: 'Why This Matters',
    headline: 'This isn\u2019t another website builder.',
    body: `${COMPANY.name} gives small businesses the infrastructure to operate online without piecing together a dozen systems \u2014 from launching a storefront to running the business behind it.`,
    speakerNote: 'Let the chips speak for the audience \u2014 click the one that matches who\u2019s in the room.',
    tag: '09',
  },
  {
    id: 10,
    slug: 'live-demo',
    autoMs: 5000,
    eyebrow: 'Live Demo',
    headline: 'Let\u2019s look at the real thing.',
    body: 'Business \u2192 storefront \u2192 customer \u2192 checkout \u2192 merchant dashboard \u2192 order. One continuous story, in the actual app.',
    speakerNote: 'Minimal text on screen \u2014 this is your cue card, not a slide to read from.',
    tag: '10',
  },
];

// ─── NARRATION SCRIPT (ElevenLabs) ────────────────────────────────────────────
// One paragraph per slide, written to be SPOKEN over the on-screen animation
// (not read off it). Generate each with ElevenLabs and save as
// public/downloads/audio/demo/slide-01.mp3 … slide-10.mp3 — auto-play picks
// them up with no other changes. Aim for 15–25s each.
export const DEMO_NARRATION = {
  welcome: `Meet ${COMPANY.name}. It's the complete business platform for small brands and makers. A beautiful branded storefront for your customers, a dashboard for you, and everything behind it, all in one place. Here's Ember and Moss, a real example brand, running on the platform. Let's see how it all fits together.`,
  problem: `Right now, most small businesses live in ten different tabs. A storefront tool, a spreadsheet for inventory, a separate CRM, an email platform, a costing sheet. None of them talk to each other, and every morning, you're the one stitching them together. Watch what happens when they collapse into one.`,
  platform: `Here's everything the platform does. Storefront, products and inventory, orders, payments, shipping, customers, content, and production costing. Every module is built in and connected, nothing is bolted on. Think of this as the map for the rest of the demo.`,
  customer: `This is what your customers see. They browse the collection, open a product, choose a variant, add it to the cart, and check out. It feels custom-built for your brand, because it is. No generic template look, just a storefront that's unmistakably yours.`,
  merchant: `And this is what you see. One dashboard for products, orders, customers, and production costing. Switch between tabs and notice that nothing sends you to another tool. It's built for the person running the business, not the person who built the software.`,
  'storefront-theme': `Every business gets its own look, on the same reliable platform underneath. Watch the whole storefront repaint as the theme changes. Two businesses on ${COMPANY.name} can look nothing alike, and both are running on exactly the same core. This is the real differentiator.`,
  workflow: `From sign-up to fulfilled order, it's one continuous path. A merchant sets up their storefront, adds products, and turns on payments and shipping. A customer discovers, orders, and pays. The merchant fulfills. Nothing falls through the gap between tools, because there are no gaps.`,
  portal: `Now compare before and after. Before: six subscriptions that don't know about each other. After: one connected workflow, from business to storefront to customer to order to payment to fulfillment. Stop paying for the seams between your tools.`,
  why: `So why does this matter? Because this isn't another website builder. It gives small businesses the infrastructure to operate online, from launching a storefront to running everything behind it, without piecing together a dozen systems. Whoever you are, it's built for you.`,
  'live-demo': `That's the picture. Now let's look at the real thing. We'll go from business to storefront, to a customer, through checkout, into the merchant dashboard, and finish with the order. One continuous story, in the actual app.`,
};

export const DEMO_SLIDES = BASE_SLIDES.map(s => ({ ...s, narration: DEMO_NARRATION[s.slug] }));

export const DEMO_SLIDE_COUNT = DEMO_SLIDES.length;
