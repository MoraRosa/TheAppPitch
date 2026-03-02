import { AnimatePresence, motion } from 'framer-motion';
import { SLIDES } from '../data/slides.js';
import { usePitchControls } from '../hooks/usePitchControls.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { useIsMobile } from '../hooks/useIsMobile.js';
import SlideRenderer from '../components/pitch/SlideRenderer.jsx';
import PresentMode from '../components/pitch/PresentMode.jsx';

export default function PitchPage() {
  const { theme } = useTheme();
  const t = theme.colors;
  const isMobile = useIsMobile();
  const controls = usePitchControls(theme.motion.autoSlide);
  const pad = isMobile ? '16px' : theme.space.pagePadding;

  return (
    <>
      <AnimatePresence>
        {controls.isFullscreen && (
          <motion.div key="presenter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <PresentMode controls={controls} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
        {/* Header */}
        <div style={{
          padding: isMobile ? `32px ${pad} 24px` : `48px ${pad} 32px`,
          borderBottom: `1px solid ${t.border}`,
          display: 'flex', justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '16px',
        }}>
          <div>
            <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '8px' }}>
              Pitch Deck · {SLIDES.length} Slides
            </p>
            <h1 style={{ fontFamily: theme.fonts.display, fontSize: theme.type.headSize, fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text }}>
              TheApp — Investor Presentation
            </h1>
          </div>
          <button onClick={controls.enterFullscreen} style={{
            background: t.accent, color: theme.isLight ? '#fff' : t.bg,
            border: 'none', padding: isMobile ? '12px 24px' : '12px 28px',
            borderRadius: theme.space.radius || '6px',
            cursor: 'pointer', fontFamily: theme.fonts.mono,
            fontSize: '11px', letterSpacing: '0.12em', fontWeight: 500,
            alignSelf: isMobile ? 'flex-start' : 'auto',
          }}>
            ▶ PRESENT
          </button>
        </div>

        {/* Slide grid */}
        <div style={{
          padding: `32px ${pad}`,
          display: 'grid',
          gridTemplateColumns: isMobile
            ? '1fr'
            : 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: isMobile ? '12px' : '20px',
        }}>
          {SLIDES.map((slide, i) => (
            <motion.button
              key={slide.id}
              onClick={() => { controls.goTo(i); controls.enterFullscreen(); }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              whileHover={{ scale: isMobile ? 1 : 1.015 }}
              style={{
                background: 'none',
                border: `1px solid ${t.border}`,
                borderRadius: theme.space.radiusLg || '8px',
                padding: 0, cursor: 'pointer',
                height: isMobile ? '160px' : '220px',
                overflow: 'hidden', textAlign: 'left',
              }}
              onMouseEnter={e => !isMobile && (e.currentTarget.style.borderColor = t.accent)}
              onMouseLeave={e => !isMobile && (e.currentTarget.style.borderColor = t.border)}
            >
              <SlideRenderer slide={slide} isFullscreen={false} />
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
}
