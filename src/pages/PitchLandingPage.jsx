import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DECK_LIST } from '../data/decks/index.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { useIsMobile } from '../hooks/useIsMobile.js';

export default function PitchLandingPage() {
  const { theme } = useTheme();
  const t = theme.colors;
  const isMobile = useIsMobile();
  const pad = isMobile ? '16px' : theme.space.pagePadding;

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
      <div style={{
        padding: isMobile ? `32px ${pad} 24px` : `56px ${pad} 40px`,
        borderBottom: `1px solid ${t.border}`,
      }}>
        <p style={{
          fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent,
          letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '10px',
        }}>
          {DECK_LIST.length} Decks Available
        </p>
        <h1 style={{
          fontFamily: theme.fonts.display, fontSize: theme.type.displaySize,
          fontWeight: theme.type.displayWeight, fontStyle: theme.type.displayStyle,
          color: t.text, maxWidth: '640px', lineHeight: 1.1,
        }}>
          Pick a deck.
        </h1>
        <p style={{
          fontFamily: theme.fonts.body, fontSize: theme.type.subheadSize,
          color: t.textMuted, marginTop: '12px', maxWidth: '520px',
        }}>
          Same platform, two audiences. Each deck has its own slides — and its own suggested theme.
        </p>
      </div>

      <div style={{
        padding: `40px ${pad}`,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: isMobile ? '16px' : '24px',
        maxWidth: '1100px',
      }}>
        {DECK_LIST.map((deck, i) => (
          <motion.div
            key={deck.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            <Link to={`/pitch/${deck.id}`} style={{
              display: 'block', textDecoration: 'none',
              border: `1px solid ${t.border}`,
              borderRadius: theme.space.radiusLg || '8px',
              padding: isMobile ? '24px' : '32px',
              background: t.surface || 'transparent',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => !isMobile && (e.currentTarget.style.borderColor = t.accent)}
            onMouseLeave={e => !isMobile && (e.currentTarget.style.borderColor = t.border)}
            >
              <p style={{
                fontFamily: theme.fonts.mono, fontSize: '9px', color: t.accent,
                letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px',
              }}>
                {deck.audience} · {deck.slides.length} Slides
              </p>
              <h2 style={{
                fontFamily: theme.fonts.display, fontSize: theme.type.headSize,
                fontWeight: theme.type.headWeight, color: t.text, marginBottom: '10px',
              }}>
                {deck.name}
              </h2>
              <p style={{
                fontFamily: theme.fonts.body, fontSize: '13px', color: t.textMuted, lineHeight: 1.6,
              }}>
                {deck.tagline}
              </p>
              <div style={{
                marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: theme.fonts.mono, fontSize: '10px', color: t.accent, letterSpacing: '0.08em',
              }}>
                OPEN DECK →
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
