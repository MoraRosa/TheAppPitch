// ─── PRESENT MODE ─────────────────────────────────────────────────────────────
// Fullscreen cinematic presenter. Keyboard nav. Auto-play mode.
// ESC always exits. 'A' toggles auto-play.

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SLIDES } from '../../data/slides.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import SlideRenderer from './SlideRenderer.jsx';

export default function PresentMode({ controls }) {
  const { theme } = useTheme();
  const t = theme.colors;
  const slide = SLIDES[controls.current];

  // Prevent body scroll while fullscreen
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const variants = {
    enter:  (dir) => ({ opacity: 0, y: dir > 0 ? 40  : -40 }),
    center: { opacity: 1, y: 0 },
    exit:   (dir) => ({ opacity: 0, y: dir > 0 ? -40 :  40 }),
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: t.bg,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Presenter toolbar */}
      <div style={{
        height: '48px', flexShrink: 0,
        borderBottom: `1px solid ${t.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: '16px',
        background: t.bgAlt,
      }}>
        {/* Progress bar */}
        <div style={{ flex: 1, height: '2px', background: t.border, borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: t.accent,
            width: `${controls.progress}%`,
            transition: `width ${theme.motion.fade}`,
          }} />
        </div>

        {/* Slide counter */}
        <span style={{
          fontFamily: theme.fonts.mono, fontSize: '10px',
          color: t.textMuted, letterSpacing: '0.1em', whiteSpace: 'nowrap',
        }}>
          {controls.current + 1} / {SLIDES.length}
        </span>

        {/* Auto-play toggle */}
        <button onClick={controls.toggleAutoPlay} style={{
          background: controls.isAutoPlay ? t.accent : 'none',
          border: `1px solid ${controls.isAutoPlay ? t.accent : t.border}`,
          color: controls.isAutoPlay ? (theme.isLight ? '#fff' : t.bg) : t.textMuted,
          padding: '4px 12px', borderRadius: theme.space.radius || '4px',
          cursor: 'pointer', fontFamily: theme.fonts.mono,
          fontSize: '9px', letterSpacing: '0.1em',
          transition: 'all 0.2s',
        }}>
          {controls.isAutoPlay ? '⏸ AUTO' : '▶ AUTO'}
        </button>

        {/* Exit */}
        <button onClick={controls.exitFullscreen} style={{
          background: 'none', border: `1px solid ${t.border}`,
          color: t.textMuted, padding: '4px 14px',
          borderRadius: theme.space.radius || '4px',
          cursor: 'pointer', fontFamily: theme.fonts.mono,
          fontSize: '9px', letterSpacing: '0.1em',
          transition: 'all 0.2s',
        }}>
          ESC · EXIT
        </button>
      </div>

      {/* Slide area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={controls.direction}>
          <motion.div
            key={slide.id}
            custom={controls.direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: parseFloat(theme.motion.enter), ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <SlideRenderer slide={slide} isFullscreen />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div style={{
        height: '56px', flexShrink: 0,
        borderTop: `1px solid ${t.border}`,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '24px',
        background: t.bgAlt,
      }}>
        <button onClick={controls.prev} disabled={controls.isFirst} style={{
          background: 'none', border: `1px solid ${controls.isFirst ? 'transparent' : t.border}`,
          color: controls.isFirst ? t.textFaint : t.textMuted,
          padding: '8px 24px', borderRadius: theme.space.radius || '4px',
          cursor: controls.isFirst ? 'default' : 'pointer',
          fontFamily: theme.fonts.mono, fontSize: '10px',
          letterSpacing: '0.1em', transition: 'all 0.2s',
        }}>
          ← PREV
        </button>

        {/* Dot navigation */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => controls.goTo(i)} style={{
              width: i === controls.current ? '24px' : '6px',
              height: '6px', borderRadius: '3px', padding: 0,
              background: i === controls.current ? t.accent : t.border,
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        <button onClick={controls.next} disabled={controls.isLast && !controls.isAutoPlay} style={{
          background: 'none',
          border: `1px solid ${(controls.isLast && !controls.isAutoPlay) ? 'transparent' : t.border}`,
          color: (controls.isLast && !controls.isAutoPlay) ? t.textFaint : t.textMuted,
          padding: '8px 24px', borderRadius: theme.space.radius || '4px',
          cursor: (controls.isLast && !controls.isAutoPlay) ? 'default' : 'pointer',
          fontFamily: theme.fonts.mono, fontSize: '10px',
          letterSpacing: '0.1em', transition: 'all 0.2s',
        }}>
          NEXT →
        </button>
      </div>

      {/* Keyboard hints */}
      <div style={{
        position: 'absolute', bottom: '70px', right: '20px',
        fontFamily: theme.fonts.mono, fontSize: '8px',
        color: t.textFaint, letterSpacing: '0.1em', lineHeight: 1.8,
        textAlign: 'right', pointerEvents: 'none',
      }}>
        <div>← → NAVIGATE</div>
        <div>A  AUTO-PLAY</div>
        <div>ESC  EXIT</div>
      </div>
    </div>
  );
}
