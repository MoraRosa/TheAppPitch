import { useParams, Link, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DECKS } from '../data/decks/index.js';
import { COMPANY } from '../data/config.js';
import { usePitchControls } from '../hooks/usePitchControls.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { useIsMobile } from '../hooks/useIsMobile.js';
import SlideRenderer from '../components/pitch/SlideRenderer.jsx';
import PresentMode from '../components/pitch/PresentMode.jsx';

export default function PitchDeckPage() {
  const { deckId } = useParams();
  const deck = DECKS[deckId];

  if (!deck) return <Navigate to="/pitch" replace />;

  return <PitchDeckPageInner deck={deck} />;
}

function PitchDeckPageInner({ deck }) {
  const { theme } = useTheme();
  const t = theme.colors;
  const isMobile = useIsMobile();
  const controls = usePitchControls(deck.slides.length, {
    defaultAutoSlideMs: theme.motion.autoSlide,
    useAudio: deck.id === 'investor',
  });
  const pad = isMobile ? '16px' : theme.space.pagePadding;

  return (
    <>
      <AnimatePresence>
        {controls.isFullscreen && (
          <motion.div key="presenter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <PresentMode controls={controls} deck={deck} />
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
            <Link to="/pitch" style={{
              fontFamily: theme.fonts.mono, fontSize: '9px', color: t.textFaint,
              letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
              display: 'inline-block', marginBottom: '10px',
            }}>
              ← All decks
            </Link>
            <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '8px' }}>
              {deck.name} · {deck.slides.length} Slides
            </p>
            <h1 style={{ fontFamily: theme.fonts.display, fontSize: theme.type.headSize, fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text }}>
              {COMPANY.name} — {deck.name}
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
          {deck.slides.map((slide, i) => (
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
              <SlideRenderer slide={slide} visuals={deck.visuals} isFullscreen={false} />
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
}
