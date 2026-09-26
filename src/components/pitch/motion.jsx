// ─── DECK MOTION PRIMITIVES ───────────────────────────────────────────────────
// Small, reusable building blocks for the "alive" demo deck. Everything honours
// prefers-reduced-motion and is safe to use anywhere inside a slide.
//
//   <Reveal>         plays ONCE when its slide opens (staggered with `delay`)
//   <ScrollReveal>   plays when scrolled into view — works inside a scrolling
//                    DeviceFrame (it registers itself as the scroll root)
//   <CountUp>        number that counts up when it appears
//   <Float>          gentle looping drift for ambient shapes (waits until the
//                    slide has finished entering, per SlideTransitionContext)

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, animate, useReducedMotion, useInView } from 'framer-motion';
import { useSlideEntered } from '../../context/SlideTransitionContext.jsx';
import { deckHasAudio, getSlideAudioUrl } from '../../data/audio.js';

export const EASE = [0.16, 1, 0.3, 1];

// A scroll container publishes its ref here so ScrollReveal can observe
// against it instead of the window.
export const ScrollRootContext = createContext(null);

export function Reveal({
  children, delay = 0, y = 18, x = 0, scale = 1, duration = 0.6,
  as = 'div', style, ...rest
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y, x, scale }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{ duration, delay, ease: EASE }}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function ScrollReveal({
  children, delay = 0, y = 24, x = 0, scale = 1, duration = 0.6,
  amount = 0.2, as = 'div', style, ...rest
}) {
  const reduce = useReducedMotion();
  const root = useContext(ScrollRootContext);
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount, ...(root ? { root } : {}) }}
      transition={{ duration, delay, ease: EASE }}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function CountUp({
  to, from = 0, duration = 1.2, delay = 0,
  decimals = 0, prefix = '', suffix = '', style,
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(reduce ? to : from);

  useEffect(() => {
    if (!inView || reduce) { if (reduce) setVal(to); return; }
    const controls = animate(from, to, {
      duration, delay, ease: EASE, onUpdate: setVal,
    });
    return () => controls.stop();
  }, [inView, to, from, duration, delay, reduce]);

  return (
    <span ref={ref} style={style}>
      {prefix}{val.toLocaleString(undefined, {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals,
      })}{suffix}
    </span>
  );
}

export function Float({ children, dx = 24, dy = 18, duration = 14, delay = 0, style }) {
  const reduce = useReducedMotion();
  const entered = useSlideEntered();
  const go = entered && !reduce;
  return (
    <motion.div
      animate={go ? { x: [0, dx, 0], y: [0, -dy, 0] } : { x: 0, y: 0 }}
      transition={go ? { duration, delay, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Soft mesh + dot grid that fills the visual pane so the mockup never floats
// in empty space. Purely decorative.
export function AmbientBackdrop({ theme }) {
  const t = theme.colors;
  const blob = (size, color) => ({
    width: size, height: size, borderRadius: '50%',
    background: `radial-gradient(circle at 30% 30%, ${color}, transparent 68%)`,
    filter: 'blur(8px)',
  });
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(${t.border} 1.2px, transparent 1.2px)`,
        backgroundSize: '22px 22px', opacity: 0.7,
      }} />
      <Float dx={30} dy={22} duration={13} style={{ position: 'absolute', top: '-12%', right: '-8%' }}>
        <div style={blob('46vmin', `${t.accent}26`)} />
      </Float>
      <Float dx={-26} dy={-18} duration={16} delay={1.5} style={{ position: 'absolute', bottom: '-16%', left: '-10%' }}>
        <div style={blob('40vmin', `${t.positive || t.accent}20`)} />
      </Float>
    </div>
  );
}

// The demo deck is currently the only deck with auto-play choreography
// (Reveal beats, tab-walks, etc.) — kept as a constant rather than threaded
// through every mockup's props purely to save a lot of prop-drilling.
const DEMO_DECK_ID = 'demo';

// How long a slide's own choreography (tab-walks, cycles, auto-demo scripts)
// should take to play out. Prefers the REAL narration clip's length once one
// exists for this slide — so beats naturally spread across however long the
// presenter is actually talking — and falls back to `fallbackMs` (each
// slide's `autoMs` in data/decks/demoSlides.js) until then. This runs
// whenever a slide opens, whether or not deck auto-play/auto-advance is on.
export function useSlidePace(slideId, fallbackMs = 18000) {
  const [ms, setMs] = useState(fallbackMs);
  useEffect(() => {
    setMs(fallbackMs);
    if (!slideId || !deckHasAudio(DEMO_DECK_ID)) return;
    const url = getSlideAudioUrl(DEMO_DECK_ID, slideId - 1);
    if (!url) return;
    let cancelled = false;
    const audio = new Audio();
    audio.preload = 'metadata';
    const onLoaded = () => {
      if (!cancelled && isFinite(audio.duration) && audio.duration > 0) {
        setMs(audio.duration * 1000);
      }
    };
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.src = url; // errors (clip not recorded yet) just leave us on fallbackMs
    return () => { cancelled = true; audio.removeEventListener('loadedmetadata', onLoaded); audio.src = ''; };
  }, [slideId, fallbackMs]);
  return ms;
}
