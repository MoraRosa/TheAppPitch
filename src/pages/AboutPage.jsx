import { useTheme } from '../context/ThemeContext.jsx';
import { useIsMobile } from '../hooks/useIsMobile.js';
import { FOUNDER } from '../data/founder.js';

function Section({ label, children, theme, isMobile }) {
  const t = theme.colors;
  return (
    <div style={{
      padding: isMobile ? `32px 16px` : `40px ${theme.space.pagePadding}`,
      borderBottom: `1px solid ${t.border}`,
      display: isMobile ? 'block' : 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: '48px',
    }}>
      <div style={{
        fontFamily: theme.fonts.mono, fontSize: '9px',
        color: t.accent, letterSpacing: theme.type.monoTracking,
        textTransform: 'uppercase',
        marginBottom: isMobile ? '16px' : '0',
        paddingTop: '4px',
      }}>
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function AboutPage() {
  const { theme } = useTheme();
  const t = theme.colors;
  const isMobile = useIsMobile();
  const pad = isMobile ? '16px' : theme.space.pagePadding;

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>

      {/* Hero */}
      <div style={{
        padding: isMobile ? '40px 16px 32px' : `64px ${theme.space.pagePadding} 48px`,
        borderBottom: `1px solid ${t.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px',
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '12px' }}>
            Founder & Developer
          </p>
          <h1 style={{ fontFamily: theme.fonts.display, fontSize: isMobile ? 'clamp(32px, 10vw, 52px)' : theme.type.displaySize, fontWeight: theme.type.displayWeight, fontStyle: theme.type.displayStyle, color: t.text, lineHeight: 1.05, marginBottom: '6px' }}>
            {FOUNDER.name}
          </h1>
          <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.textMuted, letterSpacing: '0.1em' }}>
            {FOUNDER.title} · {FOUNDER.location}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', paddingTop: isMobile ? '0' : '48px' }}>
          <a href="https://github.com/MoraRosa" target="_blank" rel="noreferrer" style={{ fontFamily: theme.fonts.mono, fontSize: '10px', color: t.accent, textDecoration: 'none', letterSpacing: '0.1em', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px' }}>GitHub →</a>
          <a href="https://luminaco.skin" target="_blank" rel="noreferrer" style={{ fontFamily: theme.fonts.mono, fontSize: '10px', color: t.textMuted, textDecoration: 'none', letterSpacing: '0.1em', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px' }}>Lumina →</a>
        </div>
      </div>

      {/* Bio */}
      <Section label="Background" theme={theme} isMobile={isMobile}>
        {FOUNDER.bio.split('\n\n').map((para, i) => (
          <p key={i} style={{ fontFamily: theme.fonts.body, fontSize: '15px', fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.85, marginBottom: '20px' }}>
            {para}
          </p>
        ))}
      </Section>

      {/* Why */}
      <Section label="Why This Works" theme={theme} isMobile={isMobile}>
        <div style={{ padding: '28px 32px', border: `1px solid ${t.border}`, borderRadius: theme.space.radiusLg || '4px', borderLeft: `3px solid ${t.accent}` }}>
          <p style={{ fontFamily: theme.fonts.body, fontSize: '15px', fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.8 }}>
            {FOUNDER.whyUnique}
          </p>
        </div>
      </Section>

      {/* Projects */}
      <Section label="Live Projects" theme={theme} isMobile={isMobile}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1px', background: t.border }}>
          {FOUNDER.notableProjects.map(p => (
            <div key={p.name} style={{ background: t.bg, padding: '20px 24px' }}>
              <a href={p.url} target="_blank" rel="noreferrer" style={{ fontFamily: theme.fonts.display, fontSize: '17px', fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.accent, textDecoration: 'none', display: 'block', marginBottom: '6px' }}>
                {p.name} →
              </a>
              <p style={{ fontFamily: theme.fonts.body, fontSize: '12px', color: t.textMuted, lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section label="Core Skills" theme={theme} isMobile={isMobile}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {FOUNDER.skills.map((skill, i) => (
            <span key={i} style={{ fontFamily: theme.fonts.mono, fontSize: '10px', color: t.textMuted, letterSpacing: '0.08em', padding: '6px 12px', border: `1px solid ${t.border}`, borderRadius: theme.space.radius || '4px' }}>
              {skill}
            </span>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section label="Experience" theme={theme} isMobile={isMobile}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {FOUNDER.experience.map(e => (
            <div key={e.company} style={{ padding: '24px 28px', border: `1px solid ${t.border}`, borderRadius: theme.space.radiusLg || '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontFamily: theme.fonts.body, fontSize: '14px', fontWeight: 500, color: t.text }}>{e.role}</span>
                <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.textFaint, letterSpacing: '0.05em' }}>{e.period}</span>
              </div>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.accent, letterSpacing: '0.1em', marginBottom: '12px' }}>
                {e.company} · {e.location}
              </div>
              {e.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ color: t.accent, fontSize: '10px', marginTop: '3px', flexShrink: 0 }}>—</span>
                  <span style={{ fontFamily: theme.fonts.body, fontSize: '12px', color: t.textMuted, lineHeight: 1.6 }}>{h}</span>
                </div>
              ))}
            </div>
          ))}
          <div>
            <p style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '10px' }}>Education</p>
            {FOUNDER.education.map(e => (
              <p key={e} style={{ fontFamily: theme.fonts.body, fontSize: '13px', color: t.textMuted, lineHeight: 1.7 }}>{e}</p>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
