// ─── SLIDE RENDERER ───────────────────────────────────────────────────────────
// Two-column layout: content left, visual right (Showroom flips the ratio).
// `visuals` is a slug → component map supplied by the active deck, so this
// file never needs to know which deck it's rendering.

import { useTheme } from '../../context/ThemeContext.jsx';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import { COMPANY } from '../../data/config.js';

export default function SlideRenderer({ slide, visuals = {}, isFullscreen = false }) {
  const { theme } = useTheme();
  const id = theme.id;
  if (id === 'manuscript') return <ManuscriptSlide slide={slide} theme={theme} visuals={visuals} isFullscreen={isFullscreen} />;
  if (id === 'brutalist')  return <BrutalistSlide  slide={slide} theme={theme} visuals={visuals} isFullscreen={isFullscreen} />;
  if (id === 'editorial')  return <EditorialSlide  slide={slide} theme={theme} visuals={visuals} isFullscreen={isFullscreen} />;
  if (id === 'canadian')   return <CanadianSlide   slide={slide} theme={theme} visuals={visuals} isFullscreen={isFullscreen} />;
  if (id === 'showroom')   return <ShowroomSlide   slide={slide} theme={theme} visuals={visuals} isFullscreen={isFullscreen} />;
  return null;
}

// ─── RIGHT-SIDE VISUAL SLOT ────────────────────────────────────────────────────

function SlideVisual({ slideSlug, visuals, theme, isFullscreen }) {
  const size = isFullscreen ? 1 : 0.6;
  const Visual = visuals[slideSlug];
  if (!Visual) return null;
  return (
    <div style={{
      flex: '1 1 auto', minHeight: 0, width: '100%',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      <Visual theme={theme} size={size} isFullscreen={isFullscreen} />
    </div>
  );
}

// ─── SHARED CONTENT COLUMN ────────────────────────────────────────────────────
function SlideLeft({ slide, theme, isFullscreen, isMobile }) {
  const t = theme.colors;

  const headlineSize = isFullscreen
    ? (isMobile ? 'clamp(18px, 4.5vw, 28px)' : 'clamp(22px, 2.8vw, 36px)')
    : (isMobile ? 'clamp(12px, 3.2vw, 16px)' : 'clamp(16px, 2.4vw, 26px)');

  const bodySize = isFullscreen
    ? (isMobile ? '13px' : 'clamp(12px, 1.3vw, 15px)')
    : 'clamp(10px, 1.2vw, 13px)';

  const pad = isFullscreen
    ? (isMobile ? '28px 24px 20px' : 'clamp(32px, 5vh, 56px) clamp(36px, 4vw, 60px)')
    : (isMobile ? '18px 16px 14px' : '32px 36px');

  const headlineMargin = isFullscreen ? (isMobile ? '12px' : '20px') : (isMobile ? '0' : '14px');
  const eyebrowMargin  = isFullscreen ? (isMobile ? '12px' : '16px') : (isMobile ? '5px' : '14px');
  const ruleMargin     = isFullscreen ? (isMobile ? '12px 0' : '18px 0') : '12px 0';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: pad, height: '100%',
      overflow: 'hidden',
    }}>
      <div>
        <p style={{
          fontFamily: theme.fonts.mono,
          fontSize: isFullscreen ? theme.type.monoSize : (isMobile ? '7px' : theme.type.monoSize),
          letterSpacing: theme.type.monoTracking, color: t.accent,
          textTransform: 'uppercase',
          marginBottom: eyebrowMargin,
        }}>
          {slide.eyebrow}
        </p>

        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: headlineSize,
          fontWeight: theme.type.displayWeight, fontStyle: theme.type.displayStyle,
          color: t.text, lineHeight: 1.15,
          marginBottom: headlineMargin,
        }}>
          {slide.headline}
        </h2>

        {(!isMobile || isFullscreen) && (
          <>
            <div style={{
              width: isFullscreen ? '36px' : '28px', height: '1px',
              background: t.accent,
              margin: ruleMargin,
            }} />
            <p style={{
              fontFamily: theme.fonts.body,
              fontSize: bodySize,
              fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.75,
            }}>
              {slide.body}
            </p>
          </>
        )}
      </div>

      {isFullscreen && (
        <div style={{
          fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
          color: t.textFaint, letterSpacing: '0.12em', marginTop: '20px',
        }}>
          {COMPANY.name.toUpperCase()} · {new Date().getFullYear()}
        </div>
      )}
    </div>
  );
}

// ─── SHARED TWO-COLUMN / STACKED LAYOUT ───────────────────────────────────────
function TwoCol({ slide, theme, visuals, isFullscreen, leftBg, rightBg, accentBar, leftBorder, columns = '55% 45%' }) {
  const t = theme.colors;
  const isMobile = useIsMobile();

  if (isMobile && !isFullscreen) {
    return (
      <div style={{
        height: '100%', background: leftBg || t.bg,
        position: 'relative', overflow: 'hidden',
      }}>
        {accentBar && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accentBar, zIndex: 2 }} />}
        {leftBorder && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: t.accent }} />}
        <SlideLeft slide={slide} theme={theme} isFullscreen={false} isMobile={true} />
        <div style={{
          position: 'absolute', bottom: '8px', right: '12px',
          fontFamily: theme.fonts.display, fontStyle: 'italic', fontWeight: 300,
          fontSize: '32px', color: t.border, lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>
          {slide.tag}
        </div>
      </div>
    );
  }

  if (isMobile && isFullscreen) {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        background: leftBg || t.bg, position: 'relative', overflow: 'hidden',
      }}>
        {accentBar && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accentBar, zIndex: 2 }} />}
        {leftBorder && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: t.accent }} />}

        <div style={{ flex: '0 0 50%', borderBottom: `1px solid ${t.border}`, overflow: 'hidden' }}>
          <SlideLeft slide={slide} theme={theme} isFullscreen={true} isMobile={true} />
        </div>

        <div style={{
          flex: '1 1 50%', background: rightBg || t.bgAlt,
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', bottom: '6px', right: '10px',
            fontFamily: theme.fonts.display, fontStyle: 'italic', fontWeight: 300,
            fontSize: '40px', color: t.border, lineHeight: 1,
            userSelect: 'none', pointerEvents: 'none',
          }}>
            {slide.tag}
          </div>
          <SlideVisual slideSlug={slide.slug} visuals={visuals} theme={theme} isFullscreen={false} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%', display: 'grid', gridTemplateColumns: columns,
      background: leftBg || t.bg, position: 'relative', overflow: 'hidden',
    }}>
      {accentBar && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accentBar, zIndex: 2 }} />}

      <div style={{ borderRight: `1px solid ${t.border}`, position: 'relative', overflow: 'hidden' }}>
        {leftBorder && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: t.accent }} />}
        <SlideLeft slide={slide} theme={theme} isFullscreen={isFullscreen} isMobile={false} />
      </div>

      <div style={{
        background: rightBg || t.bgAlt,
        padding: isFullscreen
          ? 'clamp(32px, 5vh, 52px) clamp(28px, 3.5vw, 48px)'
          : '28px 24px',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: isFullscreen ? '20px' : '10px',
          right: isFullscreen ? '28px' : '14px',
          fontFamily: theme.fonts.display, fontStyle: 'italic', fontWeight: 300,
          fontSize: isFullscreen ? '80px' : '48px', color: t.border, lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>
          {slide.tag}
        </div>
        <SlideVisual slideSlug={slide.slug} visuals={visuals} theme={theme} isFullscreen={isFullscreen} />
      </div>
    </div>
  );
}

// ── A: MANUSCRIPT ─────────────────────────────────────────────────────────────
function ManuscriptSlide({ slide, theme, visuals, isFullscreen }) {
  return <TwoCol slide={slide} theme={theme} visuals={visuals} isFullscreen={isFullscreen}
    accentBar={`linear-gradient(90deg, ${theme.colors.accent}, transparent)`}
    rightBg={theme.colors.bgAlt}
  />;
}

// ── C: BRUTALIST ──────────────────────────────────────────────────────────────
function BrutalistSlide({ slide, theme, visuals, isFullscreen }) {
  const t = theme.colors;
  const isMobile = useIsMobile();

  if (isMobile && !isFullscreen) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: `3px solid ${t.bgDeep}` }}>
        <div style={{ borderBottom: `1px solid ${t.border}`, padding: '6px 16px', display: 'flex', justifyContent: 'space-between', background: t.bgDeep, flexShrink: 0 }}>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: '7px', color: t.bg, letterSpacing: '0.1em' }}>{COMPANY.name.toUpperCase()}</span>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: '7px', color: t.bg, letterSpacing: '0.1em' }}>{slide.tag}</span>
        </div>
        <div style={{ flex: 1, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <p style={{ fontFamily: theme.fonts.mono, fontSize: '7px', color: t.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '5px' }}>{slide.eyebrow}</p>
          <h2 style={{ fontFamily: theme.fonts.display, fontSize: 'clamp(12px, 3.2vw, 16px)', fontWeight: theme.type.displayWeight, color: t.text, lineHeight: 1.1 }}>{slide.headline}</h2>
          <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontFamily: theme.fonts.display, fontWeight: 900, fontSize: '32px', color: t.bgDeep, lineHeight: 1, userSelect: 'none' }}>{slide.tag}</div>
        </div>
      </div>
    );
  }

  if (isMobile && isFullscreen) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: `3px solid ${t.bgDeep}` }}>
        <div style={{ borderBottom: `2px solid ${t.border}`, padding: '10px 24px', display: 'flex', justifyContent: 'space-between', background: t.bgDeep, flexShrink: 0 }}>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.bg, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{COMPANY.name.toUpperCase()}</span>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.bg, letterSpacing: '0.1em' }}>{slide.tag}</span>
        </div>
        <div style={{ flex: '0 0 50%', borderBottom: `2px solid ${t.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>{slide.eyebrow}</p>
            <h2 style={{ fontFamily: theme.fonts.display, fontSize: 'clamp(18px, 4.5vw, 26px)', fontWeight: theme.type.displayWeight, color: t.text, lineHeight: 1.05, marginBottom: '12px', maxWidth: '480px' }}>{slide.headline}</h2>
            <p style={{ fontFamily: theme.fonts.body, fontSize: '13px', color: t.textMuted, lineHeight: 1.7, maxWidth: '440px', borderLeft: `3px solid ${t.accent}`, paddingLeft: '16px' }}>{slide.body}</p>
          </div>
        </div>
        <div style={{ flex: '1 1 50%', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontFamily: theme.fonts.display, fontWeight: 900, fontSize: '40px', color: t.bgDeep, lineHeight: 1, userSelect: 'none' }}>{slide.tag}</div>
          <SlideVisual slideSlug={slide.slug} visuals={visuals} theme={theme} isFullscreen={false} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: '3px solid #1A1210' }}>
      <div style={{ borderBottom: `2px solid ${t.border}`, padding: isFullscreen ? '16px 56px' : '10px 32px', display: 'flex', justifyContent: 'space-between', background: t.bgDeep, flexShrink: 0 }}>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.bg, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{COMPANY.name.toUpperCase()}</span>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.bg, letterSpacing: '0.1em' }}>{slide.tag}</span>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '55% 45%', minHeight: 0 }}>
        <div style={{ borderRight: `2px solid ${t.border}` }}>
          <div style={{ padding: isFullscreen ? '40px 56px' : '24px 32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: isFullscreen ? '20px' : '10px' }}>{slide.eyebrow}</p>
            <h2 style={{ fontFamily: theme.fonts.display, fontSize: isFullscreen ? theme.type.displaySize : 'clamp(16px, 2.4vw, 28px)', fontWeight: theme.type.displayWeight, color: t.text, lineHeight: 1.05, marginBottom: isFullscreen ? '24px' : '12px', maxWidth: '480px' }}>{slide.headline}</h2>
            <p style={{ fontFamily: theme.fonts.body, fontSize: isFullscreen ? theme.type.bodySize : 'clamp(10px, 1.1vw, 13px)', color: t.textMuted, lineHeight: 1.7, maxWidth: '440px', borderLeft: `3px solid ${t.accent}`, paddingLeft: '16px' }}>{slide.body}</p>
          </div>
        </div>
        <div style={{ padding: isFullscreen ? '40px 48px' : '24px 24px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '12px', right: '16px', fontFamily: theme.fonts.display, fontWeight: 900, fontSize: isFullscreen ? '72px' : '44px', color: t.bgDeep, lineHeight: 1, userSelect: 'none' }}>{slide.tag}</div>
          <SlideVisual slideSlug={slide.slug} visuals={visuals} theme={theme} isFullscreen={isFullscreen} />
        </div>
      </div>
    </div>
  );
}

// ── D: EDITORIAL ──────────────────────────────────────────────────────────────
function EditorialSlide({ slide, theme, visuals, isFullscreen }) {
  const t = theme.colors;
  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '45%', height: '70%', background: `radial-gradient(ellipse, ${t.accent}06 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <TwoCol slide={slide} theme={theme} visuals={visuals} isFullscreen={isFullscreen}
        leftBg={t.bg} rightBg={t.bgAlt}
        accentBar={`linear-gradient(90deg, ${t.accent}, transparent)`}
      />
    </div>
  );
}

// ── E: CANADIAN ───────────────────────────────────────────────────────────────
function CanadianSlide({ slide, theme, visuals, isFullscreen }) {
  return <TwoCol slide={slide} theme={theme} visuals={visuals} isFullscreen={isFullscreen}
    leftBg={theme.colors.bg} rightBg={theme.colors.bgAlt}
    leftBorder={true}
  />;
}

// ── F: SHOWROOM ───────────────────────────────────────────────────────────────
// Visual-forward ratio (42/58) — the mockup is the point of this deck, so it
// gets more room than the copy. A live-dot badge replaces the sharp accent
// bars the investor themes use.
function ShowroomSlide({ slide, theme, visuals, isFullscreen }) {
  const t = theme.colors;
  const isMobile = useIsMobile();

  if (!isMobile || isFullscreen) {
    return (
      <div style={{ height: '100%', position: 'relative' }}>
        {!isMobile && (
          <div style={{
            position: 'absolute', top: isFullscreen ? '24px' : '14px', left: isFullscreen ? '36px' : '20px',
            zIndex: 3, display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%', background: t.positive,
              boxShadow: `0 0 0 3px ${t.positive}22`,
            }} />
            <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {slide.tag} / 10
            </span>
          </div>
        )}
        <TwoCol slide={slide} theme={theme} visuals={visuals} isFullscreen={isFullscreen}
          leftBg={t.bg} rightBg={t.bgAlt}
          columns={isMobile ? undefined : '42% 58%'}
        />
      </div>
    );
  }

  return <TwoCol slide={slide} theme={theme} visuals={visuals} isFullscreen={isFullscreen} leftBg={t.bg} rightBg={t.bgAlt} />;
}
