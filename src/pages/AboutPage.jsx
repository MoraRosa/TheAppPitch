// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
import { useTheme } from '../context/ThemeContext.jsx';
import { FOUNDER } from '../data/founder.js';

export default function AboutPage() {
  const { theme } = useTheme();
  const t = theme.colors;

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
      <div style={{ padding: `80px ${theme.space.pagePadding}`, maxWidth: '760px' }}>
        <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '16px' }}>
          Founder
        </p>
        <h1 style={{ fontFamily: theme.fonts.display, fontSize: theme.type.displaySize, fontWeight: theme.type.displayWeight, fontStyle: theme.type.displayStyle, color: t.text, marginBottom: '8px', lineHeight: 1.1 }}>
          {FOUNDER.name}
        </h1>
        <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.textMuted, letterSpacing: '0.1em', marginBottom: '48px' }}>
          {FOUNDER.title} · {FOUNDER.location}
        </p>

        <div style={{ width: '48px', height: '1px', background: t.accent, marginBottom: '40px' }} />

        {FOUNDER.bio.split('\n').map((para, i) => (
          <p key={i} style={{ fontFamily: theme.fonts.body, fontSize: '16px', fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.85, marginBottom: '20px' }}>
            {para}
          </p>
        ))}

        <div style={{ marginTop: '48px', padding: '32px 36px', border: `1px solid ${t.border}`, borderRadius: theme.space.radiusLg || '4px' }}>
          <p style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.accent, letterSpacing: theme.type.monoTracking, marginBottom: '12px', textTransform: 'uppercase' }}>
            Why uniquely positioned
          </p>
          <p style={{ fontFamily: theme.fonts.body, fontSize: '15px', fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.8 }}>
            {FOUNDER.whyUnique}
          </p>
        </div>

        <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {FOUNDER.skills.map(skill => (
            <span key={skill} style={{ fontFamily: theme.fonts.mono, fontSize: '10px', color: t.textMuted, letterSpacing: '0.08em', padding: '6px 12px', border: `1px solid ${t.border}`, borderRadius: theme.space.radius || '4px' }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
