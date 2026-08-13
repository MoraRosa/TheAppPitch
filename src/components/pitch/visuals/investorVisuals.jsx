// ─── INVESTOR DECK VISUALS ─────────────────────────────────────────────────────
// Moved unchanged out of SlideRenderer.jsx. Exported as a slug → component map
// so SlideRenderer can look decks up generically instead of switching by hand.

import React from 'react';
import { COMPETITOR_COST_STACK, MERCHANT_GROWTH, FUNDING_BREAKDOWN_SMALL } from '../../../data/financials.js';
import { COMPANY, COMPETITORS } from '../../../data/config.js';

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

export const INVESTOR_VISUALS = {
  hook: VisualHook,
  problem: VisualProblem,
  solution: VisualSolution,
  differentiator: VisualDifferentiator,
  market: VisualMarket,
  model: VisualModel,
  traction: VisualTraction,
  roadmap: VisualRoadmap,
  competition: VisualCompetition,
  ask: VisualAsk,
};
