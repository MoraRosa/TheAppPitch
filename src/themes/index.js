// ─── THEME REGISTRY ───────────────────────────────────────────────────────────
// Add new themes here. Nothing else in the app needs to change.
// Each theme exports: tokens, fonts, id, name, description.

export { MANUSCRIPT } from './manuscript/tokens.js';
export { BRUTALIST }  from './brutalist/tokens.js';
export { EDITORIAL }  from './editorial/tokens.js';
export { CANADIAN }   from './canadian/tokens.js';

import { MANUSCRIPT } from './manuscript/tokens.js';
import { BRUTALIST }  from './brutalist/tokens.js';
import { EDITORIAL }  from './editorial/tokens.js';
import { CANADIAN }   from './canadian/tokens.js';

export const THEMES = {
  manuscript: MANUSCRIPT,
  brutalist:  BRUTALIST,
  editorial:  EDITORIAL,
  canadian:   CANADIAN,
};

export const THEME_LIST = [
  { id: 'manuscript', label: 'Founder\'s Manuscript',  icon: '✦' },
  { id: 'brutalist',  label: 'Warm Brutalist',          icon: '▲' },
  { id: 'editorial',  label: 'Dark Editorial',          icon: '◆' },
  { id: 'canadian',   label: 'Canadian Print',          icon: '●' },
];

export const DEFAULT_THEME = 'manuscript';
