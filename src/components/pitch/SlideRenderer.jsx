// ─── SLIDE RENDERER ───────────────────────────────────────────────────────────
// Renders a single slide using the active theme's design language.
// Each theme gets a completely unique visual treatment.

import { useTheme } from '../../context/ThemeContext.jsx';

export default function SlideRenderer({ slide, isFullscreen = false }) {
  const { theme } = useTheme();
  const t = theme.colors;
  const tp = theme.type;
  const id = theme.id;

  if (id === 'manuscript')  return <ManuscriptSlide slide={slide} theme={theme} isFullscreen={isFullscreen} />;
  if (id === 'brutalist')   return <BrutalistSlide  slide={slide} theme={theme} isFullscreen={isFullscreen} />;
  if (id === 'editorial')   return <EditorialSlide  slide={slide} theme={theme} isFullscreen={isFullscreen} />;
  if (id === 'canadian')    return <CanadianSlide   slide={slide} theme={theme} isFullscreen={isFullscreen} />;
  return null;
}

// ── A: MANUSCRIPT ─────────────────────────────────────────────────────────────
function ManuscriptSlide({ slide, theme, isFullscreen }) {
  const t = theme.colors;
  return (
    <div style={{
      height: '100%', background: t.bg,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      padding: isFullscreen ? 'clamp(48px, 8vh, 96px) clamp(48px, 8vw, 120px)' : '40px 48px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Top accent rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: theme.slide.accentBar }} />
      {/* Subtle paper texture via box-shadow layers */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4,
        background: 'radial-gradient(ellipse at 80% 20%, #E8D4A820 0%, transparent 60%)',
        pointerEvents: 'none' }} />

      <div>
        {/* Eyebrow */}
        <p style={{
          fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
          letterSpacing: theme.type.monoTracking, color: t.accent,
          textTransform: 'uppercase', marginBottom: '28px',
        }}>
          {slide.eyebrow}
        </p>
        {/* Headline */}
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: isFullscreen ? theme.type.displaySize : 'clamp(24px, 3.5vw, 44px)',
          fontWeight: theme.type.displayWeight, fontStyle: theme.type.displayStyle,
          color: t.text, lineHeight: 1.15,
          maxWidth: '800px', marginBottom: '32px',
        }}>
          {slide.headline}
        </h2>
        {/* Thin rule */}
        <div style={{ width: '48px', height: '1px', background: t.accent, marginBottom: '28px' }} />
        {/* Body */}
        <p style={{
          fontFamily: theme.fonts.body,
          fontSize: theme.type.bodySize, fontWeight: theme.type.bodyWeight,
          color: t.textMuted, lineHeight: 1.8, maxWidth: '620px',
        }}>
          {slide.body}
        </p>
      </div>

      {/* Footer row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{
          fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
          color: t.accentLight, letterSpacing: theme.type.monoTracking,
        }}>
          THEAPP — {new Date().getFullYear()}
        </div>
        <div style={{
          fontFamily: theme.fonts.display, fontStyle: 'italic', fontWeight: 300,
          fontSize: isFullscreen ? '48px' : '32px', color: t.bgDeep, lineHeight: 1,
        }}>
          {slide.tag}
        </div>
      </div>
    </div>
  );
}

// ── C: BRUTALIST ──────────────────────────────────────────────────────────────
function BrutalistSlide({ slide, theme, isFullscreen }) {
  const t = theme.colors;
  return (
    <div style={{
      height: '100%', background: t.bg,
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      borderTop: theme.slide.borderTop,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Header strip */}
      <div style={{
        borderBottom: `2px solid ${t.border}`,
        padding: isFullscreen ? '24px 64px' : '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
          color: t.accent, letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          {slide.eyebrow}
        </span>
        <span style={{
          fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
          color: t.textFaint,
        }}>
          {slide.tag} / 10
        </span>
      </div>

      {/* Main content */}
      <div style={{ padding: isFullscreen ? '48px 64px' : '32px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: isFullscreen ? theme.type.displaySize : 'clamp(28px, 4vw, 52px)',
          fontWeight: theme.type.displayWeight, fontStyle: theme.type.displayStyle,
          color: t.text, lineHeight: 1.05,
          maxWidth: '780px', marginBottom: '32px',
        }}>
          {slide.headline}
        </h2>
        <p style={{
          fontFamily: theme.fonts.body, fontSize: theme.type.bodySize,
          fontWeight: theme.type.bodyWeight, color: t.textMuted,
          lineHeight: 1.7, maxWidth: '560px',
          borderLeft: `3px solid ${t.accent}`,
          paddingLeft: '20px',
        }}>
          {slide.body}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `2px solid ${t.border}`,
        padding: isFullscreen ? '16px 64px' : '12px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: t.bgDeep,
      }}>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.bg, letterSpacing: '0.1em' }}>
          THEAPP
        </span>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.bg, letterSpacing: '0.1em' }}>
          CANADA · {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
}

// ── D: EDITORIAL ──────────────────────────────────────────────────────────────
function EditorialSlide({ slide, theme, isFullscreen }) {
  const t = theme.colors;
  return (
    <div style={{
      height: '100%', background: t.bg,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      padding: isFullscreen ? 'clamp(56px, 9vh, 112px) clamp(56px, 9vw, 140px)' : '48px 56px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Accent gradient bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: theme.slide.accentBar }} />
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '50%', height: '60%',
        background: `radial-gradient(ellipse, ${t.accent}08 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div>
        <p style={{
          fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
          letterSpacing: theme.type.monoTracking, color: t.accent,
          textTransform: 'uppercase', marginBottom: '32px',
        }}>
          {slide.eyebrow}
        </p>
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: isFullscreen ? theme.type.displaySize : 'clamp(26px, 4vw, 52px)',
          fontWeight: theme.type.displayWeight, fontStyle: theme.type.displayStyle,
          color: t.text, lineHeight: 1.12,
          maxWidth: '820px', marginBottom: '40px',
        }}>
          {slide.headline}
        </h2>
        <p style={{
          fontFamily: theme.fonts.body, fontSize: theme.type.bodySize,
          fontWeight: theme.type.bodyWeight, color: t.textMuted,
          lineHeight: 1.85, maxWidth: '600px',
        }}>
          {slide.body}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{
          fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
          color: t.textFaint, letterSpacing: theme.type.monoTracking,
        }}>
          THEAPP · INVESTOR PRESENTATION
        </div>
        <div style={{
          fontFamily: theme.fonts.display, fontStyle: 'italic', fontWeight: 300,
          fontSize: isFullscreen ? '72px' : '48px',
          color: t.surface, lineHeight: 1,
        }}>
          {slide.tag}
        </div>
      </div>
    </div>
  );
}

// ── E: CANADIAN ───────────────────────────────────────────────────────────────
function CanadianSlide({ slide, theme, isFullscreen }) {
  const t = theme.colors;
  return (
    <div style={{
      height: '100%', background: t.bg,
      display: 'grid',
      gridTemplateColumns: '4px 1fr',
    }}>
      {/* Red left border stripe */}
      <div style={{ background: t.accent }} />

      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: isFullscreen ? 'clamp(48px, 8vh, 96px) clamp(48px, 7vw, 96px)' : '40px 48px',
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <p style={{
              fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
              letterSpacing: theme.type.monoTracking, color: t.accent,
              textTransform: 'uppercase',
            }}>
              {slide.eyebrow}
            </p>
            <p style={{
              fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
              color: t.textFaint, letterSpacing: '0.05em',
            }}>
              {slide.tag} — 10
            </p>
          </div>

          <div style={{ width: '48px', height: '3px', background: t.accent, marginBottom: '24px' }} />

          <h2 style={{
            fontFamily: theme.fonts.display,
            fontSize: isFullscreen ? theme.type.displaySize : 'clamp(22px, 3.2vw, 40px)',
            fontWeight: theme.type.displayWeight, fontStyle: theme.type.displayStyle,
            color: t.text, lineHeight: 1.2,
            maxWidth: '760px', marginBottom: '28px',
          }}>
            {slide.headline}
          </h2>

          <p style={{
            fontFamily: theme.fonts.body, fontSize: theme.type.bodySize,
            fontWeight: theme.type.bodyWeight, color: t.textMuted,
            lineHeight: 1.75, maxWidth: '580px',
          }}>
            {slide.body}
          </p>
        </div>

        <div style={{
          fontFamily: theme.fonts.body, fontSize: '11px',
          color: t.textFaint, letterSpacing: '0.05em',
        }}>
          TheApp · Canada · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
