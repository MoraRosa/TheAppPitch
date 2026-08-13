// ─── DECK REGISTRY ─────────────────────────────────────────────────────────────
// Add new decks here. Nothing else in the app needs to change.
// Each deck: { id, name, tagline, audience, slides, visuals, suggestedTheme }

import { INVESTOR_SLIDES } from './investorSlides.js';
import { DEMO_SLIDES } from './demoSlides.js';
import { INVESTOR_VISUALS } from '../../components/pitch/visuals/investorVisuals.jsx';
import { DEMO_VISUALS } from '../../components/pitch/visuals/demoVisuals.jsx';

export const DECKS = {
  investor: {
    id: 'investor',
    name: 'Investor Pitch',
    tagline: 'The ask, the market, and the traction.',
    audience: 'Investors & grant reviewers',
    slides: INVESTOR_SLIDES,
    visuals: INVESTOR_VISUALS,
    suggestedTheme: 'canadian',
  },
  demo: {
    id: 'demo',
    name: 'Product Demo',
    tagline: 'What the platform actually does — click around and see.',
    audience: 'Customers & merchants',
    slides: DEMO_SLIDES,
    visuals: DEMO_VISUALS,
    suggestedTheme: 'showroom',
  },
};

export const DECK_LIST = [DECKS.investor, DECKS.demo];

export const DEFAULT_DECK = 'investor';
