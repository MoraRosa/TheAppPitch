// ─── PITCH PAGE ───────────────────────────────────────────────────────────────
// Slide browser + entry to fullscreen present mode.

import { AnimatePresence, motion } from 'framer-motion';
import { SLIDES } from '../data/slides.js';
import { usePitchControls } from '../hooks/usePitchControls.js';
import { useTheme } from '../context/ThemeContext.jsx';
import SlideRenderer from '../components/pitch/SlideRenderer.jsx';
import PresentMode from '../components/pitch/PresentMode.jsx';

export default function PitchPage() {
  const { theme } = useTheme();
  const t = theme.colors;
  const controls = usePitchControls(theme.motion.autoSlide);

  return (
    <>
      {/* Fullscreen presenter portal */}
      <AnimatePresence>
        {controls.isFullscreen && (
          <motion.div
            key="presenter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <PresentMode controls={controls} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browse view */}
      <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
        {/* Page header */}
        <div style={{
          padding: `48px ${theme.space.pagePadding} 32px`,
          borderBottom: `1px solid ${t.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div>
            <p style={{
              fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
              color: t.accent, letterSpacing: theme.type.monoTracking,
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              Pitch Deck · {SLIDES.length} Slides
            </p>
            <h1 style={{
              fontFamily: theme.fonts.display,
              fontSize: theme.type.headSize,
              fontWeight: theme.type.headWeight,
              fontStyle: theme.type.headStyle,
              color: t.text,
            }}>
              TheApp — Investor Presentation
            </h1>
          </div>

          <button onClick={controls.enterFullscreen} style={{
            background: t.accent,
            color: theme.isLight ? '#fff' : t.bg,
            border: 'none', padding: '12px 28px',
            borderRadius: theme.space.radius || '6px',
            cursor: 'pointer', fontFamily: theme.fonts.mono,
            fontSize: '11px', letterSpacing: '0.12em',
            fontWeight: 500,
          }}>
            ▶ PRESENT
          </button>
        </div>

        {/* Slide grid */}
        <div style={{
          padding: `40px ${theme.space.pagePadding}`,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '24px',
        }}>
          {SLIDES.map((slide, i) => (
            <motion.button
              key={slide.id}
              onClick={() => { controls.goTo(i); controls.enterFullscreen(); }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.015 }}
              style={{
                background: 'none', border: `1px solid ${t.border}`,
                borderRadius: theme.space.radiusLg || '8px',
                padding: 0, cursor: 'pointer',
                height: '240px', overflow: 'hidden',
                textAlign: 'left',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
            >
              <SlideRenderer slide={slide} isFullscreen={false} />
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
}
