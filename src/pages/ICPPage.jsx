import { useTheme } from '../context/ThemeContext.jsx';
import { useIsMobile } from '../hooks/useIsMobile.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { ICP_VERSION, ICP_UPDATED, ICP_LEAD, ICP_BASIS, ICP_EVIDENCE_KEY, ICP_ROWS, ICP_NEXT_EVIDENCE, ICP_LOG } from '../data/icp.js';

// ─── Ideal customer profile page ────────────────────────────────────────────────
// Data lives in src/data/icp.js. Evidence tags and a 1 to 5 confidence score sit on every row.

function EvidenceTag({ tag, theme }) {
  const t = theme.colors, k = ICP_EVIDENCE_KEY.find(e => e.tag === tag);
  const solid = tag === 'tested', soft = tag === 'partly';
  return (
    <span style={{
      display: 'inline-block', fontFamily: theme.fonts.mono, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '3px 9px', borderRadius: '999px', whiteSpace: 'nowrap',
      background: solid ? t.accent : soft ? `${t.accent}14` : 'transparent',
      color: solid ? t.bg : soft ? t.accent : t.textMuted,
      border: `1px solid ${solid || soft ? t.accent : t.border}`,
    }}>{k ? k.label : tag}</span>
  );
}

function Confidence({ n, theme }) {
  const t = theme.colors;
  return (
    <span aria-label={`Confidence ${n} out of 5`} style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= n ? t.accent : 'transparent', border: `1px solid ${i <= n ? t.accent : t.border}` }} />
      ))}
      <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.textFaint, marginLeft: '6px' }}>{n}/5</span>
    </span>
  );
}

function Reveal({ children, theme, style }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: `opacity ${theme.motion.enter}, transform ${theme.motion.enter}`, ...style }}>
      {children}
    </div>
  );
}

const label = (theme, color) => ({ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase' });

export default function ICPPage() {
  const { theme } = useTheme();
  const t = theme.colors;
  const isMobile = useIsMobile();
  const pad = isMobile ? '16px' : theme.space.pagePadding;
  const body = { fontFamily: theme.fonts.body, fontSize: theme.type.bodySize, fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.8, margin: 0 };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
      <div style={{ padding: isMobile ? `40px ${pad} 28px` : `56px ${pad} 40px`, borderBottom: `1px solid ${t.border}` }}>
        <p style={{ ...label(theme, t.accent), marginBottom: '10px' }}>Ideal customer profile · {ICP_VERSION} · {ICP_UPDATED}</p>
        <h1 style={{ fontFamily: theme.fonts.display, fontSize: theme.type.headSize, fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text, lineHeight: 1.2, maxWidth: '820px', margin: '0 0 16px' }}>
          {ICP_LEAD}
        </h1>
        <p style={{ ...body, maxWidth: '640px' }}>{ICP_BASIS}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', marginTop: '22px' }}>
          {ICP_EVIDENCE_KEY.map(k => (
            <span key={k.tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <EvidenceTag tag={k.tag} theme={theme} />
              <span style={{ fontFamily: theme.fonts.body, fontSize: '12px', color: t.textFaint }}>{k.text}</span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: isMobile ? `8px ${pad}` : `16px ${pad}` }}>
        {ICP_ROWS.map(r => (
          <Reveal key={r.part} theme={theme} style={{
            display: isMobile ? 'block' : 'grid', gridTemplateColumns: '180px 1fr 150px 130px', gap: isMobile ? '0' : '32px', alignItems: 'start',
            padding: isMobile ? '20px 0' : '26px 0', borderBottom: `1px solid ${t.border}`,
          }}>
            <h2 style={{ fontFamily: theme.fonts.display, fontSize: isMobile ? '16px' : '17px', fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text, margin: isMobile ? '0 0 8px' : 0 }}>{r.part}</h2>
            <p style={{ ...body, margin: isMobile ? '0 0 12px' : 0 }}>{r.answer}</p>
            <div style={{ marginBottom: isMobile ? '10px' : 0 }}><EvidenceTag tag={r.evidence} theme={theme} /></div>
            <Confidence n={r.confidence} theme={theme} />
          </Reveal>
        ))}
      </div>

      <div style={{ padding: isMobile ? `28px ${pad}` : `40px ${pad}`, display: isMobile ? 'block' : 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', borderTop: `1px solid ${t.border}` }}>
        <Reveal theme={theme} style={{ marginBottom: isMobile ? '32px' : 0 }}>
          <p style={{ ...label(theme, t.accent), marginBottom: '14px' }}>What would turn this into evidence</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {ICP_NEXT_EVIDENCE.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                <span style={{ color: t.accent, fontFamily: theme.fonts.mono, fontSize: '10px', marginTop: '6px', flexShrink: 0 }}>—</span>
                <span style={body}>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal theme={theme}>
          <p style={{ ...label(theme, t.accent), marginBottom: '14px' }}>Version log</p>
          {ICP_LOG.map((l, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 96px 1fr', gap: '12px', padding: '10px 0', borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontFamily: theme.fonts.mono, fontSize: '11px', color: t.text }}>{l.version}</span>
              <span style={{ fontFamily: theme.fonts.mono, fontSize: '11px', color: t.textFaint }}>{l.when}</span>
              <span style={{ ...body, fontSize: '13px', lineHeight: 1.6 }}>{l.change}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
