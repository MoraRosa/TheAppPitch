import { useTheme } from '../context/ThemeContext.jsx';
import { useIsMobile } from '../hooks/useIsMobile.js';
import { PLAN_SECTIONS } from '../data/plan.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

// ─── BLOCK RENDERERS ──────────────────────────────────────────────────────────

function BlockText({ text, theme }) {
  const t = theme.colors;
  return (
    <p style={{ fontFamily: theme.fonts.body, fontSize: theme.type.bodySize, fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.85, marginBottom: '20px' }}>
      {text}
    </p>
  );
}

function BlockLabel({ text, theme }) {
  const t = theme.colors;
  return (
    <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, letterSpacing: theme.type.monoTracking, color: t.accent, textTransform: 'uppercase', marginTop: '28px', marginBottom: '8px' }}>
      {text}
    </p>
  );
}

function BlockCallout({ text, theme }) {
  const t = theme.colors;
  return (
    <div style={{ borderLeft: `3px solid ${t.accent}`, padding: '16px 20px', margin: '4px 0 20px', background: `${t.accent}08`, borderRadius: '0 4px 4px 0' }}>
      <p style={{ fontFamily: theme.fonts.body, fontSize: theme.type.bodySize, fontWeight: '500', color: t.text, lineHeight: 1.75, margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

function BlockBullets({ items, theme }) {
  const t = theme.colors;
  return (
    <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
          <span style={{ color: t.accent, fontFamily: theme.fonts.mono, fontSize: '10px', marginTop: '5px', flexShrink: 0 }}>—</span>
          <span style={{ fontFamily: theme.fonts.body, fontSize: theme.type.bodySize, fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.7 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function BlockWeakness({ block, theme, isMobile }) {
  const t = theme.colors;
  return (
    <div style={{ marginBottom: '24px', border: `1px solid ${t.border}`, borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ padding: isMobile ? '12px 16px' : '12px 20px', borderBottom: `1px solid ${t.border}`, background: t.bgAlt }}>
        <p style={{ fontFamily: theme.fonts.display, fontSize: isMobile ? '15px' : '16px', fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text, margin: 0 }}>
          {block.title}
        </p>
      </div>
      <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ padding: isMobile ? '12px 16px' : '16px 20px', borderRight: isMobile ? 'none' : `1px solid ${t.border}`, borderBottom: isMobile ? `1px solid ${t.border}` : 'none' }}>
          <p style={{ fontFamily: theme.fonts.mono, fontSize: '8px', letterSpacing: '0.12em', color: t.textFaint, textTransform: 'uppercase', marginBottom: '6px' }}>The Challenge</p>
          <p style={{ fontFamily: theme.fonts.body, fontSize: '13px', color: t.textMuted, lineHeight: 1.7, margin: 0 }}>{block.challenge}</p>
        </div>
        <div style={{ padding: isMobile ? '12px 16px' : '16px 20px', background: `${t.accent}06` }}>
          <p style={{ fontFamily: theme.fonts.mono, fontSize: '8px', letterSpacing: '0.12em', color: t.accent, textTransform: 'uppercase', marginBottom: '6px' }}>How We Overcome It</p>
          <p style={{ fontFamily: theme.fonts.body, fontSize: '13px', color: t.textMuted, lineHeight: 1.7, margin: 0 }}>{block.mitigation}</p>
        </div>
      </div>
    </div>
  );
}

function BlockSwot({ block, theme, isMobile }) {
  const t = theme.colors;
  const quadrants = [
    { label: 'Strengths',     items: block.strengths,     color: t.accent },
    { label: 'Weaknesses',    items: block.weaknesses,    color: t.textFaint },
    { label: 'Opportunities', items: block.opportunities, color: t.accent },
    { label: 'Threats',       items: block.threats,       color: t.textFaint },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1px', background: t.border, border: `1px solid ${t.border}`, borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
      {quadrants.map((q) => (
        <div key={q.label} style={{ background: t.bg, padding: isMobile ? '16px' : '20px 24px' }}>
          <p style={{ fontFamily: theme.fonts.mono, fontSize: '8px', letterSpacing: '0.12em', color: q.color, textTransform: 'uppercase', marginBottom: '12px' }}>
            {q.label}
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {q.items.map((item, j) => (
              <li key={j} style={{ display: 'flex', gap: '10px', marginBottom: '7px' }}>
                <span style={{ color: q.color, fontFamily: theme.fonts.mono, fontSize: '9px', marginTop: '4px', flexShrink: 0 }}>—</span>
                <span style={{ fontFamily: theme.fonts.body, fontSize: '12px', color: t.textMuted, lineHeight: 1.65 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function BlockPlaceholder({ text, theme }) {
  const t = theme.colors;
  return (
    <div style={{ border: `1px dashed ${t.border}`, borderRadius: '4px', padding: '14px 18px', marginBottom: '14px', background: t.bgAlt, opacity: 0.65 }}>
      <p style={{ fontFamily: theme.fonts.mono, fontSize: '10px', letterSpacing: '0.08em', color: t.textFaint, margin: 0 }}>
        ⏳  {text}
      </p>
    </div>
  );
}

function renderBlock(block, index, theme, isMobile) {
  switch (block.type) {
    case 'text':        return <BlockText        key={index} text={block.text}   theme={theme} />;
    case 'label':       return <BlockLabel       key={index} text={block.text}   theme={theme} />;
    case 'callout':     return <BlockCallout     key={index} text={block.text}   theme={theme} />;
    case 'bullets':     return <BlockBullets     key={index} items={block.items} theme={theme} />;
    case 'weakness':    return <BlockWeakness    key={index} block={block}       theme={theme} isMobile={isMobile} />;
    case 'swot':        return <BlockSwot        key={index} block={block}       theme={theme} isMobile={isMobile} />;
    case 'placeholder': return <BlockPlaceholder key={index} text={block.text}   theme={theme} />;
    default:            return null;
  }
}

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────

function PlanSection({ section, theme, isMobile }) {
  const t = theme.colors;
  const [ref, visible] = useScrollReveal();
  const pad = isMobile ? '16px' : theme.space.pagePadding;

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(24px)',
      transition: `opacity ${theme.motion.enter}, transform ${theme.motion.enter}`,
      padding: isMobile ? `32px ${pad}` : `48px ${pad}`,
      borderBottom: `1px solid ${t.border}`,
      display: isMobile ? 'block' : 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: '48px',
    }}>
      <div style={{ marginBottom: isMobile ? '16px' : '0' }}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, marginBottom: '8px' }}>
          {section.number}
        </div>
        <h2 style={{ fontFamily: theme.fonts.display, fontSize: isMobile ? '18px' : '20px', fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text, lineHeight: 1.3 }}>
          {section.title}
        </h2>
      </div>

      <div>
        {section.blocks
          ? section.blocks.map((block, i) => renderBlock(block, i, theme, isMobile))
          : section.content.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontFamily: theme.fonts.body, fontSize: theme.type.bodySize, fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.85, marginBottom: '20px' }}>
                {para}
              </p>
            ))
        }
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function PlanPage() {
  const { theme } = useTheme();
  const t = theme.colors;
  const isMobile = useIsMobile();
  const pad = isMobile ? '16px' : theme.space.pagePadding;

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
      <div style={{ padding: isMobile ? `40px ${pad} 24px` : `48px ${pad} 32px`, borderBottom: `1px solid ${t.border}` }}>
        <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '8px' }}>
          Business Plan · Full Document
        </p>
        <h1 style={{ fontFamily: theme.fonts.display, fontSize: theme.type.headSize, fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text }}>
          TheApp — Complete Business Plan
        </h1>
      </div>
      {PLAN_SECTIONS.map(section => (
        <PlanSection key={section.id} section={section} theme={theme} isMobile={isMobile} />
      ))}
    </div>
  );
}
