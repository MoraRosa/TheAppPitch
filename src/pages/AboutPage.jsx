// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
import { useTheme } from '../context/ThemeContext.jsx';
import { FOUNDER } from '../data/founder.js';

export default function AboutPage() {
  const { theme } = useTheme();
  const t = theme.colors;

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
      {/* Hero */}
      <div style={{
        padding: `64px ${theme.space.pagePadding} 48px`,
        borderBottom: `1px solid ${t.border}`,
        display: 'grid', gridTemplateColumns: '1fr auto', gap: '48px',
        alignItems: 'start',
      }}>
        <div>
          <p style={{
            fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
            color: t.accent, letterSpacing: theme.type.monoTracking,
            textTransform: 'uppercase', marginBottom: '12px',
          }}>
            Founder & Developer
          </p>
          <h1 style={{
            fontFamily: theme.fonts.display, fontSize: theme.type.displaySize,
            fontWeight: theme.type.displayWeight, fontStyle: theme.type.displayStyle,
            color: t.text, lineHeight: 1.05, marginBottom: '6px',
          }}>
            {FOUNDER.name}
          </h1>
          <p style={{
            fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
            color: t.textMuted, letterSpacing: '0.1em',
          }}>
            {FOUNDER.title} · {FOUNDER.location}
          </p>
        </div>

        {/* Link strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '48px' }}>
          <a href="https://github.com/MoraRosa" target="_blank" rel="noreferrer" style={{
            fontFamily: theme.fonts.mono, fontSize: '10px', color: t.accent,
            textDecoration: 'none', letterSpacing: '0.1em',
            borderBottom: `1px solid ${t.border}`, paddingBottom: '4px',
          }}>
            GitHub →
          </a>
          <a href="https://luminaco.skin" target="_blank" rel="noreferrer" style={{
            fontFamily: theme.fonts.mono, fontSize: '10px', color: t.textMuted,
            textDecoration: 'none', letterSpacing: '0.1em',
            borderBottom: `1px solid ${t.border}`, paddingBottom: '4px',
          }}>
            Lumina →
          </a>
        </div>
      </div>

      {/* Bio */}
      <div style={{
        padding: `48px ${theme.space.pagePadding}`,
        borderBottom: `1px solid ${t.border}`,
        display: 'grid', gridTemplateColumns: '200px 1fr', gap: '48px',
        maxWidth: '960px',
      }}>
        <div style={{
          fontFamily: theme.fonts.mono, fontSize: '9px',
          color: t.accent, letterSpacing: theme.type.monoTracking,
          textTransform: 'uppercase', paddingTop: '4px',
        }}>
          Background
        </div>
        <div>
          {FOUNDER.bio.split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontFamily: theme.fonts.body, fontSize: '15px',
              fontWeight: theme.type.bodyWeight, color: t.textMuted,
              lineHeight: 1.85, marginBottom: '20px',
            }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Why uniquely positioned */}
      <div style={{
        padding: `40px ${theme.space.pagePadding}`,
        borderBottom: `1px solid ${t.border}`,
        display: 'grid', gridTemplateColumns: '200px 1fr', gap: '48px',
        maxWidth: '960px',
      }}>
        <div style={{
          fontFamily: theme.fonts.mono, fontSize: '9px',
          color: t.accent, letterSpacing: theme.type.monoTracking,
          textTransform: 'uppercase', paddingTop: '4px',
        }}>
          Why This Works
        </div>
        <div style={{
          padding: '28px 32px',
          border: `1px solid ${t.border}`,
          borderRadius: theme.space.radiusLg || '4px',
          borderLeft: `3px solid ${t.accent}`,
        }}>
          <p style={{
            fontFamily: theme.fonts.body, fontSize: '15px',
            fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.8,
          }}>
            {FOUNDER.whyUnique}
          </p>
        </div>
      </div>

      {/* Notable projects */}
      <div style={{
        padding: `40px ${theme.space.pagePadding}`,
        borderBottom: `1px solid ${t.border}`,
        display: 'grid', gridTemplateColumns: '200px 1fr', gap: '48px',
        maxWidth: '960px',
      }}>
        <div style={{
          fontFamily: theme.fonts.mono, fontSize: '9px',
          color: t.accent, letterSpacing: theme.type.monoTracking,
          textTransform: 'uppercase', paddingTop: '4px',
        }}>
          Live Projects
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: t.border }}>
          {FOUNDER.notableProjects.map(p => (
            <div key={p.name} style={{ background: t.bg, padding: '20px 24px' }}>
              <a href={p.url} target="_blank" rel="noreferrer" style={{
                fontFamily: theme.fonts.display, fontSize: '17px',
                fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle,
                color: t.accent, textDecoration: 'none', display: 'block', marginBottom: '6px',
              }}>
                {p.name} →
              </a>
              <p style={{
                fontFamily: theme.fonts.body, fontSize: '12px',
                color: t.textMuted, lineHeight: 1.6,
              }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div style={{
        padding: `40px ${theme.space.pagePadding}`,
        borderBottom: `1px solid ${t.border}`,
        display: 'grid', gridTemplateColumns: '200px 1fr', gap: '48px',
        maxWidth: '960px',
      }}>
        <div style={{
          fontFamily: theme.fonts.mono, fontSize: '9px',
          color: t.accent, letterSpacing: theme.type.monoTracking,
          textTransform: 'uppercase', paddingTop: '4px',
        }}>
          Core Skills
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {FOUNDER.skills.map(skill => (
            <span key={skill} style={{
              fontFamily: theme.fonts.mono, fontSize: '10px',
              color: t.textMuted, letterSpacing: '0.08em',
              padding: '6px 12px',
              border: `1px solid ${t.border}`,
              borderRadius: theme.space.radius || '4px',
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div style={{
        padding: `40px ${theme.space.pagePadding} 64px`,
        display: 'grid', gridTemplateColumns: '200px 1fr', gap: '48px',
        maxWidth: '960px',
      }}>
        <div style={{
          fontFamily: theme.fonts.mono, fontSize: '9px',
          color: t.accent, letterSpacing: theme.type.monoTracking,
          textTransform: 'uppercase', paddingTop: '4px',
        }}>
          Experience
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {FOUNDER.experience.map(e => (
            <div key={e.company} style={{
              padding: '24px 28px',
              border: `1px solid ${t.border}`,
              borderRadius: theme.space.radiusLg || '4px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{
                  fontFamily: theme.fonts.body, fontSize: '14px',
                  fontWeight: 500, color: t.text,
                }}>
                  {e.role}
                </span>
                <span style={{
                  fontFamily: theme.fonts.mono, fontSize: '9px',
                  color: t.textFaint, letterSpacing: '0.05em', whiteSpace: 'nowrap', marginLeft: '16px',
                }}>
                  {e.period}
                </span>
              </div>
              <div style={{
                fontFamily: theme.fonts.mono, fontSize: '9px',
                color: t.accent, letterSpacing: '0.1em', marginBottom: '12px',
              }}>
                {e.company} · {e.location}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {e.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: t.accent, fontSize: '10px', marginTop: '3px', flexShrink: 0 }}>—</span>
                    <span style={{
                      fontFamily: theme.fonts.body, fontSize: '12px',
                      color: t.textMuted, lineHeight: 1.6,
                    }}>
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Education */}
          <div>
            <p style={{
              fontFamily: theme.fonts.mono, fontSize: '9px',
              color: t.accent, letterSpacing: theme.type.monoTracking,
              textTransform: 'uppercase', marginBottom: '10px',
            }}>
              Education
            </p>
            {FOUNDER.education.map(e => (
              <p key={e} style={{
                fontFamily: theme.fonts.body, fontSize: '13px',
                color: t.textMuted, lineHeight: 1.7,
              }}>
                {e}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
