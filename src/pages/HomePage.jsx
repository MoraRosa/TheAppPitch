import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import { useIsMobile } from '../hooks/useIsMobile.js';

export default function HomePage() {
  const { theme } = useTheme();
  const t = theme.colors;
  const isMobile = useIsMobile();
  const pad = isMobile ? '20px' : theme.space.pagePadding;

  const stats = [
    { value: '15',     label: 'Beta merchants waiting' },
    { value: '$948K', label: 'ARR projection · Year 3' },
    { value: '23+',   label: 'API endpoints built' },
    { value: '1',     label: 'Developer. No team yet.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
      {/* Hero */}
      <section style={{
        minHeight: isMobile ? 'auto' : `calc(100vh - ${theme.space.navHeight})`,
        padding: isMobile
          ? `48px ${pad} 48px`
          : `clamp(64px, 12vh, 140px) ${pad}`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        borderBottom: `1px solid ${t.border}`,
        position: 'relative', overflow: 'hidden',
      }}>
        {!theme.isLight && (
          <div style={{ position: 'absolute', top: '10%', right: '5%', width: '400px', height: '400px', background: `radial-gradient(ellipse, ${t.accent}06 0%, transparent 70%)`, pointerEvents: 'none' }} />
        )}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '20px' }}>
          Investor Pitch · Canada · {new Date().getFullYear()}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          style={{ fontFamily: theme.fonts.display, fontSize: isMobile ? 'clamp(28px, 8vw, 48px)' : theme.type.displaySize, fontWeight: theme.type.displayWeight, fontStyle: theme.type.displayStyle, color: t.text, lineHeight: 1.1, maxWidth: '900px', marginBottom: '24px' }}>
          Small businesses are paying for 10 tools when one should do.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontFamily: theme.fonts.body, fontSize: isMobile ? '15px' : '17px', fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.75, maxWidth: '580px', marginBottom: '40px' }}>
          TheApp is the complete business platform for small brands and makers — storefront, CRM, production costing, and task management in one subscription. Built in Canada.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/pitch" style={{ background: t.accent, color: theme.isLight ? '#fff' : t.bg, textDecoration: 'none', padding: isMobile ? '12px 24px' : '14px 32px', borderRadius: theme.space.radius || '6px', fontFamily: theme.fonts.body, fontSize: '14px', fontWeight: 500 }}>
            View Pitch Deck →
          </Link>
          <Link to="/plan" style={{ background: 'none', color: t.text, textDecoration: 'none', padding: isMobile ? '12px 24px' : '14px 32px', border: `1px solid ${t.border}`, borderRadius: theme.space.radius || '6px', fontFamily: theme.fonts.body, fontSize: '14px' }}>
            Business Plan
          </Link>
          <Link to="/downloads" style={{ background: 'none', color: t.textMuted, textDecoration: 'none', padding: isMobile ? '12px 24px' : '14px 32px', fontFamily: theme.fonts.body, fontSize: '14px' }}>
            ↓ Downloads
          </Link>
        </motion.div>
      </section>

      {/* Stats — 2×2 on mobile, 4×1 on desktop */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        borderBottom: `1px solid ${t.border}`,
      }}>
        {stats.map((stat, i) => (
          <motion.div key={stat.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            style={{
              padding: isMobile ? '24px 20px' : '40px 40px',
              borderRight: (isMobile ? i % 2 === 0 : i < stats.length - 1) ? `1px solid ${t.border}` : 'none',
              borderBottom: isMobile && i < 2 ? `1px solid ${t.border}` : 'none',
            }}>
            <div style={{ fontFamily: theme.fonts.display, fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(28px, 4vw, 48px)', fontWeight: theme.type.displayWeight, fontStyle: theme.type.displayStyle, color: t.text, lineHeight: 1, marginBottom: '8px' }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: isMobile ? '7px' : theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', lineHeight: 1.4 }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
