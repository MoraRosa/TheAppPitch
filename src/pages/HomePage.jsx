// ─── HOME PAGE ────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

export default function HomePage() {
  const { theme } = useTheme();
  const t = theme.colors;

  const stats = [
    { value: '5',     label: 'Beta merchants waiting' },
    { value: '$948K', label: 'ARR projection · Year 3' },
    { value: '23+',   label: 'API endpoints built' },
    { value: '1',     label: 'Developer. No team yet.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
      {/* Hero */}
      <section style={{
        minHeight: `calc(100vh - ${theme.space.navHeight})`,
        padding: `clamp(64px, 12vh, 140px) ${theme.space.pagePadding}`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        borderBottom: `1px solid ${t.border}`,
        position: 'relative', overflow: 'hidden',
      }}>
        {!theme.isLight && (
          <div style={{
            position: 'absolute', top: '10%', right: '5%',
            width: '500px', height: '500px',
            background: `radial-gradient(ellipse, ${t.accent}06 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <p style={{
            fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
            color: t.accent, letterSpacing: theme.type.monoTracking,
            textTransform: 'uppercase', marginBottom: '24px',
          }}>
            Investor Pitch · Canada · {new Date().getFullYear()}
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: theme.fonts.display,
            fontSize: theme.type.displaySize,
            fontWeight: theme.type.displayWeight,
            fontStyle: theme.type.displayStyle,
            color: t.text, lineHeight: 1.1,
            maxWidth: '900px', marginBottom: '32px',
          }}
        >
          Small businesses are paying for 10 tools when one should do.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: theme.fonts.body, fontSize: '17px',
            fontWeight: theme.type.bodyWeight, color: t.textMuted,
            lineHeight: 1.75, maxWidth: '580px', marginBottom: '48px',
          }}
        >
          TheApp is the complete business platform for small brands and makers — storefront, CRM, production costing, and task management in one subscription. Built in Canada.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
        >
          <Link to="/pitch" style={{
            background: t.accent, color: theme.isLight ? '#fff' : t.bg,
            textDecoration: 'none', padding: '14px 32px',
            borderRadius: theme.space.radius || '6px',
            fontFamily: theme.fonts.body, fontSize: '14px', fontWeight: 500,
          }}>
            View Pitch Deck →
          </Link>
          <Link to="/plan" style={{
            background: 'none', color: t.text, textDecoration: 'none',
            padding: '14px 32px', border: `1px solid ${t.border}`,
            borderRadius: theme.space.radius || '6px',
            fontFamily: theme.fonts.body, fontSize: '14px',
          }}>
            Read Business Plan
          </Link>
          <Link to="/downloads" style={{
            background: 'none', color: t.textMuted, textDecoration: 'none',
            padding: '14px 32px', fontFamily: theme.fonts.body, fontSize: '14px',
          }}>
            ↓ Download PDF
          </Link>
        </motion.div>
      </section>

      {/* Stats strip — clean borders, no grid background trick */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: `1px solid ${t.border}`,
      }}>
        {stats.map((stat, i) => (
          <motion.div key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            style={{
              padding: '40px 40px',
              borderRight: i < stats.length - 1 ? `1px solid ${t.border}` : 'none',
            }}
          >
            <div style={{
              fontFamily: theme.fonts.display,
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: theme.type.displayWeight,
              fontStyle: theme.type.displayStyle,
              color: t.text, lineHeight: 1, marginBottom: '8px',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
              color: t.accent, letterSpacing: theme.type.monoTracking,
              textTransform: 'uppercase',
            }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
