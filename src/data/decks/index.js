// ─── DECK REGISTRY ─────────────────────────────────────────────────────────────
// Add new decks here. Nothing else in the app needs to change.
// Each deck: { id, name, tagline, audience, slides, visuals, suggestedTheme }

import { INVESTOR_SLIDES } from './investorSlides.js';
import { DEMO_SLIDES } from './demoSlides.js';
import { INVESTOR_VISUALS } from '../../components/pitch/visuals/investorVisuals.jsx';
import { DEMO_VISUALS, RoadmapClimb, LiveDemoPippa } from '../../components/pitch/visuals/demoVisuals.jsx';

export const DECKS = {
  investor: {
    id: 'investor',
    name: 'Investor Pitch',
    tagline: 'The ask, the market, and the traction.',
    audience: 'Investors & grant reviewers',
    slides: INVESTOR_SLIDES,
    // Sprint 2: problem + solution reuse the animated demo components (flood, module cards).
    visuals: {
      ...INVESTOR_VISUALS,
      problem: DEMO_VISUALS.problem,
      solution: DEMO_VISUALS.platform,
      roadmap: RoadmapClimb,            // Sprint 3: the funding stages as a mountain climb
      close: LiveDemoPippa,             // closing slide with the QR (Pippa)
      differentiator: DEMO_VISUALS['storefront-theme'], // instant theme switching
      competition: DEMO_VISUALS.portal,                 // the seams between tools
    },
    suggestedTheme: 'canadian',
    animated: true,
  },
  demo: {
    id: 'demo',
    name: 'Product Demo',
    tagline: 'What the platform actually does — click around and see.',
    audience: 'Customers & merchants',
    slides: DEMO_SLIDES,
    visuals: DEMO_VISUALS,
    suggestedTheme: 'showroom',
    animated: true, // slide-open reveals + ambient backdrop (see components/pitch/motion.jsx)
  },
};

export const DECK_LIST = [DECKS.investor, DECKS.demo];

export const DEFAULT_DECK = 'investor';
