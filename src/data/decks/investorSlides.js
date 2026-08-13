// ─── INVESTOR DECK — SLIDE DATA ───────────────────────────────────────────────
// Thin re-export. The original slides.js is left untouched so the investor
// deck (and its PDF/PPTX generators, which import slides.js directly) never
// has to change.

export { SLIDES as INVESTOR_SLIDES, SLIDE_COUNT as INVESTOR_SLIDE_COUNT } from '../slides.js';
