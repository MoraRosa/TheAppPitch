// ─── SLIDE TRANSITION CONTEXT ─────────────────────────────────────────────────
// Tells mockups when it's safe to start entrance animations without them
// getting stuck (a known issue: infinite CSS animations inserted while an
// ancestor is still mid-transform can freeze at their first frame in some
// browsers). Previous fix used a guessed timeout, which broke because the
// guess didn't match the actual transition duration. This ties directly to
// Framer Motion's real onAnimationComplete event in PresentMode — no
// guessing, no duration to keep in sync by hand.
//
// Default value is `true` — outside of PresentMode (e.g. the non-fullscreen
// deck-grid preview cards), there's no slide-transition concern, so mockups
// should just animate immediately rather than wait for a signal that will
// never come.

import { createContext, useContext } from 'react';

export const SlideTransitionContext = createContext(true);

export function useSlideEntered() {
  return useContext(SlideTransitionContext);
}
