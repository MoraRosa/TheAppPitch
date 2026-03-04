// ─── SLIDE RENDERER ───────────────────────────────────────────────────────────
// Two-column layout: content left, visual right.
// Each slide has a unique right-side visual per theme.
// Right-side slot is video-ready — swap <SlideVisual> for <video> at MVP.

import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import { COMPETITOR_COST_STACK, MERCHANT_GROWTH, UNIT_ECONOMICS, FUNDING_BREAKDOWN_SMALL } from '../../data/financials.js';
import { COMPANY, COMPETITORS, PRICING } from '../../data/config.js';

export default function SlideRenderer({ slide, isFullscreen = false }) {
  const { theme } = useTheme();
  const id = theme.id;
  if (id === 'manuscript') return <ManuscriptSlide slide={slide} theme={theme} isFullscreen={isFullscreen} />;
  if (id === 'brutalist')  return <BrutalistSlide  slide={slide} theme={theme} isFullscreen={isFullscreen} />;
  if (id === 'editorial')  return <EditorialSlide  slide={slide} theme={theme} isFullscreen={isFullscreen} />;
  if (id === 'canadian')   return <CanadianSlide   slide={slide} theme={theme} isFullscreen={isFullscreen} />;
  return null;
}

// ─── RIGHT-SIDE VISUALS (theme-agnostic data, theme-specific colours) ─────────

function SlideVisual({ slideSlug, theme, isFullscreen }) {
  const t = theme.colors;
  const size = isFullscreen ? 1 : 0.6;

  switch (slideSlug) {
    case 'hook':
      return <VisualHook theme={theme} size={size} />;
    case 'problem':
      return <VisualProblem theme={theme} size={size} />;
    case 'solution':
      return <VisualSolution theme={theme} size={size} />;
    case 'differentiator':
      return <VisualDifferentiator theme={theme} size={size} />;
    case 'market':
      return <VisualMarket theme={theme} size={size} />;
    case 'model':
      return <VisualModel theme={theme} size={size} />;
    case 'traction':
      return <VisualTraction theme={theme} size={size} />;
    case 'roadmap':
      return <VisualRoadmap theme={theme} size={size} />;
    case 'competition':
      return <VisualCompetition theme={theme} size={size} />;
    case 'ask':
      return <VisualAsk theme={theme} size={size} />;
    default:
      return null;
  }
}

// ── Hook: animated big numbers ────────────────────────────────────────────────
function VisualHook({ theme, size }) {
  const t = theme.colors;
  const items = [
    { val: '10', label: 'tools replaced' },
    { val: '$850', label: 'saved / month' },
    { val: '1', label: 'platform' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {items.map((item, i) => (
        <div key={i} style={{
          padding: `${12 * size}px ${16 * size}px`,
          border: `1px solid ${t.border}`,
          borderLeft: `3px solid ${t.accent}`,
          borderRadius: theme.space.radius || '2px',
          display: 'flex', alignItems: 'baseline', gap: '12px',
          animation: `fadeSlideIn 0.4s ease ${i * 0.1}s both`,
        }}>
          <span style={{
            fontFamily: theme.fonts.display,
            fontStyle: theme.type.displayStyle,
            fontWeight: theme.type.displayWeight,
            fontSize: `${32 * size}px`,
            color: t.accent, lineHeight: 1,
          }}>{item.val}</span>
          <span style={{
            fontFamily: theme.fonts.mono,
            fontSize: `${9 * size}px`,
            color: t.textMuted,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>{item.label}</span>
        </div>
      ))}
      <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}

// ── Problem: cost stack bars ──────────────────────────────────────────────────
function VisualProblem({ theme, size }) {
  const t = theme.colors;
  const maxCost = 300;
  const tools = COMPETITOR_COST_STACK.slice(0, 5);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${6 * size}px`, width: '100%' }}>
      <div style={{
        fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`,
        color: t.accent, letterSpacing: '0.15em', marginBottom: `${4 * size}px`,
        textTransform: 'uppercase',
      }}>Monthly tool spend</div>
      {tools.map((tool, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ fontFamily: theme.fonts.body, fontSize: `${9 * size}px`, color: t.textMuted }}>
              {tool.tool.split('/')[0].trim()}
            </span>
            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${9 * size}px`, color: t.accent }}>
              ${tool.min}–${tool.max}
            </span>
          </div>
          <div style={{ height: `${5 * size}px`, background: t.bgAlt, borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(tool.max / maxCost) * 100}%`,
              background: t.accent, opacity: 0.7,
              animation: `barGrow 0.6s ease ${i * 0.08}s both`,
            }} />
          </div>
        </div>
      ))}
      <style>{`@keyframes barGrow { from { width: 0 } }`}</style>
    </div>
  );
}

// ── Solution: module grid ─────────────────────────────────────────────────────
function VisualSolution({ theme, size }) {
  const t = theme.colors;
  const modules = [
    { icon: '◈', name: 'Storefront', desc: '5 themes' },
    { icon: '◎', name: 'Pulse', desc: 'Production' },
    { icon: '◐', name: 'Constellation', desc: 'CRM' },
    { icon: '◑', name: 'Compass', desc: 'Tasks' },
    { icon: '◒', name: 'Orders', desc: 'Commerce' },
    { icon: '◓', name: 'Email', desc: 'Marketing' },
  ];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: `${6 * size}px`, width: '100%',
    }}>
      {modules.map((mod, i) => (
        <div key={i} style={{
          padding: `${10 * size}px ${12 * size}px`,
          border: `1px solid ${t.border}`,
          borderRadius: theme.space.radius || '2px',
          animation: `fadeSlideIn 0.35s ease ${i * 0.06}s both`,
        }}>
          <div style={{
            fontFamily: theme.fonts.mono,
            fontSize: `${16 * size}px`,
            color: t.accent, lineHeight: 1, marginBottom: '4px',
          }}>{mod.icon}</div>
          <div style={{
            fontFamily: theme.fonts.body, fontWeight: 500,
            fontSize: `${10 * size}px`, color: t.text,
          }}>{mod.name}</div>
          <div style={{
            fontFamily: theme.fonts.mono,
            fontSize: `${8 * size}px`, color: t.textFaint,
            letterSpacing: '0.1em',
          }}>{mod.desc}</div>
        </div>
      ))}
    </div>
  );
}

// ── Differentiator: before/after ──────────────────────────────────────────────
function VisualDifferentiator({ theme, size }) {
  const t = theme.colors;
  const rows = ['Ingredients', 'Suppliers', 'Batch Cost', 'Packaging', 'QuickBooks'];
  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: `${4 * size}px`,
      }}>
        <div style={{
          fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`,
          color: t.negative || t.textFaint, letterSpacing: '0.12em',
          textAlign: 'center', marginBottom: `${6 * size}px`,
          textTransform: 'uppercase',
        }}>Shopify</div>
        <div style={{
          fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`,
          color: t.positive || t.accent, letterSpacing: '0.12em',
          textAlign: 'center', marginBottom: `${6 * size}px`,
          textTransform: 'uppercase',
        }}>{ COMPANY.name }</div>
        {rows.map((row, i) => (
          <React.Fragment key={row}>
            <div style={{
              padding: `${6 * size}px ${8 * size}px`,
              background: t.bgAlt,
              border: `1px solid ${t.border}`,
              borderRadius: theme.space.radius || '2px',
              fontFamily: theme.fonts.body,
              fontSize: `${9 * size}px`, color: t.textFaint,
              textDecoration: 'line-through',
              animation: `fadeSlideIn 0.3s ease ${i * 0.07}s both`,
            }}>{row} → Sheet</div>
            <div style={{
              padding: `${6 * size}px ${8 * size}px`,
              background: t.bgAlt,
              border: `1px solid ${t.accent}40`,
              borderRadius: theme.space.radius || '2px',
              fontFamily: theme.fonts.body,
              fontSize: `${9 * size}px`, color: t.text,
              animation: `fadeSlideIn 0.3s ease ${i * 0.07 + 0.05}s both`,
            }}>{row} ✓ Built-in</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Market: TAM/SAM/SOM rings ─────────────────────────────────────────────────
function VisualMarket({ theme, size }) {
  const t = theme.colors;
  const rings = [
    { label: 'TAM', sub: '$14B+ Global SaaS', r: 80 * size, opacity: 0.15 },
    { label: 'SAM', sub: '3.8M CA Businesses', r: 56 * size, opacity: 0.3 },
    { label: 'SOM', sub: '100K Target Year 5', r: 32 * size, opacity: 0.7 },
  ];
  const svgSize = 180 * size;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: `${12 * size}px`, width: '100%' }}>
      <svg width={svgSize} height={svgSize} viewBox={`0 0 180 180`}>
        {rings.map((ring, i) => (
          <circle key={i}
            cx="90" cy="90" r={ring.r}
            fill={t.accent}
            fillOpacity={ring.opacity}
            stroke={t.accent}
            strokeWidth="1"
            strokeOpacity="0.4"
          />
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${4 * size}px`, width: '100%' }}>
        {rings.map((ring, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: `${10 * size}px`, height: `${10 * size}px`, background: t.accent, opacity: ring.opacity, borderRadius: '50%', flexShrink: 0 }} />
            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.1em', width: '32px' }}>{ring.label}</span>
            <span style={{ fontFamily: theme.fonts.body, fontSize: `${9 * size}px`, color: t.textMuted }}>{ring.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Model: MRR growth chart — fully responsive SVG ───────────────────────────
function VisualModel({ theme, size }) {
  const t = theme.colors;
  const points = MERCHANT_GROWTH.filter((_, i) => i % 2 === 0);
  const maxMrr = Math.max(...points.map(p => p.mrr));
  // Fixed viewBox coordinates — SVG scales to fill container width
  const VW = 200, VH = 90;
  const pathD = points.map((p, i) => {
    const x = (i / (points.length - 1)) * VW;
    const y = VH - (p.mrr / maxMrr) * VH * 0.88;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  const areaD = pathD + ` L ${VW} ${VH} L 0 ${VH} Z`;

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`,
        color: t.accent, letterSpacing: '0.12em',
        marginBottom: `${8 * size}px`, textTransform: 'uppercase',
      }}>
        MRR Growth · 3 Years
      </div>

      {/* width 100% + viewBox = fully responsive, fills available space */}
      <svg
        width="100%" height={`${110 * size}px`}
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="mrrGradV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={t.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#mrrGradV)" />
        <path d={pathD} fill="none" stroke={t.accent} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => {
          const x = (i / (points.length - 1)) * VW;
          const y = VH - (p.mrr / maxMrr) * VH * 0.88;
          return <circle key={i} cx={x} cy={y} r="3" fill={t.accent} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: `${5 * size}px` }}>
        {['Y1', 'Y2', 'Y3'].map(y => (
          <span key={y} style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textFaint, letterSpacing: '0.1em' }}>{y}</span>
        ))}
      </div>
      <div style={{ marginTop: `${14 * size}px`, fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${22 * size}px`, color: t.text }}>
        $79K{' '}
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${9 * size}px`, color: t.accent }}>
          MRR · Y3
        </span>
      </div>
    </div>
  );
}

// ── Traction: build progress ──────────────────────────────────────────────────
function VisualTraction({ theme, size }) {
  const t = theme.colors;
  const items = [
    { label: 'Multi-tenant DB', pct: 100 },
    { label: 'Dual Auth', pct: 100 },
    { label: 'REST API (23+ endpoints)', pct: 100 },
    { label: 'Pulse (Production)', pct: 100 },
    { label: 'Constellation CRM', pct: 100 },
    { label: 'Stripe Connect', pct: 35 },
    { label: 'Beta Launch', pct: 20 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${7 * size}px`, width: '100%' }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.12em', marginBottom: `${2 * size}px`, textTransform: 'uppercase' }}>Build progress</div>
      {items.map((item, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ fontFamily: theme.fonts.body, fontSize: `${9 * size}px`, color: item.pct === 100 ? t.text : t.textMuted }}>{item.label}</span>
            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${9 * size}px`, color: item.pct === 100 ? t.accent : t.textFaint }}>{item.pct}%</span>
          </div>
          <div style={{ height: `${4 * size}px`, background: t.bgAlt, borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${item.pct}%`,
              background: item.pct === 100 ? t.accent : `${t.accent}60`,
              animation: `barGrow 0.5s ease ${i * 0.06}s both`,
            }} />
          </div>
        </div>
      ))}
      <style>{`@keyframes barGrow { from { width: 0 } }`}</style>
    </div>
  );
}

// ── Roadmap: horizontal timeline ──────────────────────────────────────────────
function VisualRoadmap({ theme, size }) {
  const t = theme.colors;
  const phases = [
    { label: 'Now', items: ['Cart + Payments', 'BARE Theme', 'Beta Launch'] },
    { label: '6 mo', items: ['Scheduling', '100+ merchants', 'First Hire'] },
    { label: '18 mo', items: ['AI Agent API', 'US Entry', '500+ merchants'] },
  ];
  return (
    <div style={{ width: '100%' }}>
      {phases.map((phase, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: `${40 * size}px 1fr`,
          gap: `${10 * size}px`, marginBottom: `${14 * size}px`,
          animation: `fadeSlideIn 0.4s ease ${i * 0.12}s both`,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{
              width: `${10 * size}px`, height: `${10 * size}px`,
              borderRadius: '50%', background: i === 0 ? t.accent : t.border,
              border: `2px solid ${t.accent}`, flexShrink: 0,
            }} />
            {i < phases.length - 1 && (
              <div style={{ width: '1px', flex: 1, background: t.border, minHeight: `${20 * size}px` }} />
            )}
          </div>
          <div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.1em', marginBottom: '4px' }}>{phase.label}</div>
            {phase.items.map((item, j) => (
              <div key={j} style={{ fontFamily: theme.fonts.body, fontSize: `${10 * size}px`, color: t.textMuted, lineHeight: 1.6 }}>— {item}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Competition: comparison table ─────────────────────────────────────────────
function VisualCompetition({ theme, size }) {
  const t = theme.colors;
  const rows = COMPETITORS.map(c => ({
    co:         c.co,
    storefront: c.storefront,
    crm:        c.crm,
    costing:    c.costing,
    price:      c.price,
  }));
  const Check = ({ v }) => (
    <span style={{ color: v ? t.accent : t.textFaint, fontFamily: theme.fonts.mono, fontSize: `${10 * size}px` }}>
      {v ? '✓' : '×'}
    </span>
  );
  return (
    <div style={{ width: '100%', marginTop: `-${20 * size}px` }}>
      {/* Header label */}
      <div style={{
        fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`,
        color: t.accent, letterSpacing: '0.15em',
        textTransform: 'uppercase', marginBottom: `${12 * size}px`,
      }}>
        Platform Comparison
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: `${4 * size}px 8px`, alignItems: 'center' }}>
        {['', 'Store', 'CRM', 'Costing', 'Price'].map((h, i) => (
          <div key={i} style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px' }}>{h}</div>
        ))}
        {rows.map((row, i) => (
          <React.Fragment key={row.co}>
            <div style={{
              fontFamily: theme.fonts.body, fontSize: `${9 * size}px`,
              color: row.co === COMPANY.name ? t.accent : t.textMuted,
              fontWeight: row.co === COMPANY.name ? 500 : 400,
              padding: `${3 * size}px 0`,
              borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : 'none',
            }}>{row.co}</div>
            <div style={{ textAlign: 'center', borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : 'none', padding: `${3 * size}px 0` }}><Check v={row.storefront} /></div>
            <div style={{ textAlign: 'center', borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : 'none', padding: `${3 * size}px 0` }}><Check v={row.crm} /></div>
            <div style={{ textAlign: 'center', borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : 'none', padding: `${3 * size}px 0` }}><Check v={row.costing} /></div>
            <div style={{
              fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`,
              color: row.co === COMPANY.name ? t.accent : t.textFaint,
              borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : 'none',
              padding: `${3 * size}px 0`,
            }}>{row.price}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Ask: funding breakdown ────────────────────────────────────────────────────
function VisualAsk({ theme, size }) {
  const t = theme.colors;
  const items = FUNDING_BREAKDOWN_SMALL;
  const total = items.reduce((s, i) => s + i.amount, 0);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.12em', marginBottom: `${10 * size}px`, textTransform: 'uppercase' }}>
        $10K Grant Breakdown
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ marginBottom: `${8 * size}px`, animation: `fadeSlideIn 0.4s ease ${i * 0.08}s both` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ fontFamily: theme.fonts.body, fontSize: `${9 * size}px`, color: t.textMuted }}>{item.label}</span>
            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${9 * size}px`, color: t.accent }}>${item.amount.toLocaleString()}</span>
          </div>
          <div style={{ height: `${5 * size}px`, background: t.bgAlt, borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(item.amount / total) * 100}%`,
              background: t.accent, opacity: 0.8,
            }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: `${12 * size}px`, paddingTop: `${8 * size}px`, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textFaint, letterSpacing: '0.1em' }}>TOTAL</span>
        <span style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${20 * size}px`, color: t.accent }}>$10,000</span>
      </div>
    </div>
  );
}

// ─── THEME SLIDE SHELLS ───────────────────────────────────────────────────────


// ─── SHARED CONTENT COLUMN ────────────────────────────────────────────────────
function SlideLeft({ slide, theme, isFullscreen, isMobile }) {
  const t = theme.colors;

  // Desktop fullscreen is always two-column — use tighter sizes than full-page display
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
      overflow: 'hidden', // prevent any bleed
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
          // No maxWidth — let it fill the column naturally
        }}>
          {slide.headline}
        </h2>

        {/* Body + rule — hidden in card preview on mobile, shown fullscreen */}
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
          THEAPP · {new Date().getFullYear()}
        </div>
      )}
    </div>
  );
}

// ─── SHARED TWO-COLUMN / STACKED LAYOUT ───────────────────────────────────────
function TwoCol({ slide, theme, isFullscreen, leftBg, rightBg, accentBar, leftBorder }) {
  const t = theme.colors;
  const isMobile = useIsMobile();

  // mobile card preview → single column, content only, ghost tag
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

  // mobile fullscreen → stacked: content top, visual bottom
  if (isMobile && isFullscreen) {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        background: leftBg || t.bg, position: 'relative', overflow: 'hidden',
      }}>
        {accentBar && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accentBar, zIndex: 2 }} />}
        {leftBorder && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: t.accent }} />}

        {/* Content — top 58% */}
        <div style={{ flex: '0 0 58%', borderBottom: `1px solid ${t.border}`, overflow: 'hidden' }}>
          <SlideLeft slide={slide} theme={theme} isFullscreen={true} isMobile={true} />
        </div>

        {/* Visual — bottom 42% */}
        <div style={{
          flex: '1 1 42%', background: rightBg || t.bgAlt,
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
          <SlideVisual slideSlug={slide.slug} theme={theme} isFullscreen={false} />
        </div>
      </div>
    );
  }

  // Desktop — original side-by-side
  return (
    <div style={{
      height: '100%', display: 'grid', gridTemplateColumns: '55% 45%',
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
        justifyContent: 'center',
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
        <SlideVisual slideSlug={slide.slug} theme={theme} isFullscreen={isFullscreen} />
      </div>
    </div>
  );
}

// ── A: MANUSCRIPT ─────────────────────────────────────────────────────────────
function ManuscriptSlide({ slide, theme, isFullscreen }) {
  return <TwoCol slide={slide} theme={theme} isFullscreen={isFullscreen}
    accentBar={`linear-gradient(90deg, ${theme.colors.accent}, transparent)`}
    rightBg={theme.colors.bgAlt}
  />;
}

// ── C: BRUTALIST ──────────────────────────────────────────────────────────────
function BrutalistSlide({ slide, theme, isFullscreen }) {
  const t = theme.colors;
  const isMobile = useIsMobile();

  // Mobile card — compact single column with header strip
  if (isMobile && !isFullscreen) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: `3px solid ${t.bgDeep}` }}>
        <div style={{ borderBottom: `1px solid ${t.border}`, padding: '6px 16px', display: 'flex', justifyContent: 'space-between', background: t.bgDeep, flexShrink: 0 }}>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: '7px', color: t.bg, letterSpacing: '0.1em' }}>THEAPP</span>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: '7px', color: t.bg, letterSpacing: '0.1em' }}>{slide.tag} / 10</span>
        </div>
        <div style={{ flex: 1, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <p style={{ fontFamily: theme.fonts.mono, fontSize: '7px', color: t.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '5px' }}>{slide.eyebrow}</p>
          <h2 style={{ fontFamily: theme.fonts.display, fontSize: 'clamp(12px, 3.2vw, 16px)', fontWeight: theme.type.displayWeight, color: t.text, lineHeight: 1.1 }}>{slide.headline}</h2>
          <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontFamily: theme.fonts.display, fontWeight: 900, fontSize: '32px', color: t.bgDeep, lineHeight: 1, userSelect: 'none' }}>{slide.tag}</div>
        </div>
      </div>
    );
  }

  // Mobile fullscreen — stacked
  if (isMobile && isFullscreen) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: `3px solid ${t.bgDeep}` }}>
        <div style={{ borderBottom: `2px solid ${t.border}`, padding: '10px 24px', display: 'flex', justifyContent: 'space-between', background: t.bgDeep, flexShrink: 0 }}>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.bg, letterSpacing: '0.1em', textTransform: 'uppercase' }}>THEAPP</span>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.bg, letterSpacing: '0.1em' }}>{slide.tag} / 10</span>
        </div>
        <div style={{ flex: '0 0 58%', borderBottom: `2px solid ${t.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>{slide.eyebrow}</p>
            <h2 style={{ fontFamily: theme.fonts.display, fontSize: 'clamp(18px, 4.5vw, 26px)', fontWeight: theme.type.displayWeight, color: t.text, lineHeight: 1.05, marginBottom: '12px', maxWidth: '480px' }}>{slide.headline}</h2>
            <p style={{ fontFamily: theme.fonts.body, fontSize: '13px', color: t.textMuted, lineHeight: 1.7, maxWidth: '440px', borderLeft: `3px solid ${t.accent}`, paddingLeft: '16px' }}>{slide.body}</p>
          </div>
        </div>
        <div style={{ flex: '1 1 42%', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontFamily: theme.fonts.display, fontWeight: 900, fontSize: '40px', color: t.bgDeep, lineHeight: 1, userSelect: 'none' }}>{slide.tag}</div>
          <SlideVisual slideSlug={slide.slug} theme={theme} isFullscreen={false} />
        </div>
      </div>
    );
  }

  // Desktop — original
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: '3px solid #1A1210' }}>
      <div style={{ borderBottom: `2px solid ${t.border}`, padding: isFullscreen ? '16px 56px' : '10px 32px', display: 'flex', justifyContent: 'space-between', background: t.bgDeep, flexShrink: 0 }}>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.bg, letterSpacing: '0.1em', textTransform: 'uppercase' }}>THEAPP</span>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.bg, letterSpacing: '0.1em' }}>{slide.tag} / 10</span>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '55% 45%', minHeight: 0 }}>
        <div style={{ borderRight: `2px solid ${t.border}` }}>
          <div style={{ padding: isFullscreen ? '40px 56px' : '24px 32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: isFullscreen ? '20px' : '10px' }}>{slide.eyebrow}</p>
            <h2 style={{ fontFamily: theme.fonts.display, fontSize: isFullscreen ? theme.type.displaySize : 'clamp(16px, 2.4vw, 28px)', fontWeight: theme.type.displayWeight, color: t.text, lineHeight: 1.05, marginBottom: isFullscreen ? '24px' : '12px', maxWidth: '480px' }}>{slide.headline}</h2>
            <p style={{ fontFamily: theme.fonts.body, fontSize: isFullscreen ? theme.type.bodySize : 'clamp(10px, 1.1vw, 13px)', color: t.textMuted, lineHeight: 1.7, maxWidth: '440px', borderLeft: `3px solid ${t.accent}`, paddingLeft: '16px' }}>{slide.body}</p>
          </div>
        </div>
        <div style={{ padding: isFullscreen ? '40px 48px' : '24px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '12px', right: '16px', fontFamily: theme.fonts.display, fontWeight: 900, fontSize: isFullscreen ? '72px' : '44px', color: t.bgDeep, lineHeight: 1, userSelect: 'none' }}>{slide.tag}</div>
          <SlideVisual slideSlug={slide.slug} theme={theme} isFullscreen={isFullscreen} />
        </div>
      </div>
    </div>
  );
}

// ── D: EDITORIAL ──────────────────────────────────────────────────────────────
function EditorialSlide({ slide, theme, isFullscreen }) {
  const t = theme.colors;
  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '45%', height: '70%', background: `radial-gradient(ellipse, ${t.accent}06 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <TwoCol slide={slide} theme={theme} isFullscreen={isFullscreen}
        leftBg={t.bg} rightBg={t.bgAlt}
        accentBar={`linear-gradient(90deg, ${t.accent}, transparent)`}
      />
    </div>
  );
}

// ── E: CANADIAN ───────────────────────────────────────────────────────────────
function CanadianSlide({ slide, theme, isFullscreen }) {
  return <TwoCol slide={slide} theme={theme} isFullscreen={isFullscreen}
    leftBg={theme.colors.bg} rightBg={theme.colors.bgAlt}
    leftBorder={true}
  />;
}
