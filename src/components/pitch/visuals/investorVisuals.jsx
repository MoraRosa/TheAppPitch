// ─── INVESTOR DECK VISUALS ─────────────────────────────────────────────────────
// Moved unchanged out of SlideRenderer.jsx. Exported as a slug → component map
// so SlideRenderer can look decks up generically instead of switching by hand.

import React from 'react';
import { COMPETITOR_COST_STACK, MERCHANT_GROWTH, FUNDING_BREAKDOWN_SMALL } from '../../../data/financials.js';
import { COMPANY, COMPETITORS, TRACTION, MARKET, PRICING, FUNDING, FOUNDER_INFO } from '../../../data/config.js';
import { LIVE_SITES, PRODUCT } from '../../../data/facts.js';
import { CountUp } from '../motion.jsx';

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
    { label: 'TAM', sub: `${MARKET.globalPlatform2025} global e-commerce platforms`, r: 80 * size, opacity: 0.15 },
    { label: 'SAM', sub: `${MARKET.canadianSmallBiz.replace(' million', 'M')} CA small employers`, r: 56 * size, opacity: 0.3 },
    { label: 'SOM', sub: '4,000 paying (Stage 3)', r: 32 * size, opacity: 0.7 },
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
  const plans = [
    { name: 'Free',    price: '$0',            note: 'Minimal storage' },
    { name: 'Starter', price: PRICING.starter, note: 'Per month' },
    { name: 'Grow',    price: PRICING.growth,  note: `${PRICING.trialDays}-day trial` },
    { name: 'Pro',     price: PRICING.pro,     note: `${PRICING.trialDays}-day trial` },
  ];
  const points = MERCHANT_GROWTH;
  const maxMrr = Math.max(...points.map(p => p.mrr));
  const VW = 200, VH = 70;
  const xy = (p, i) => [(i / (points.length - 1)) * VW, VH - (p.mrr / maxMrr) * VH * 0.88];
  const pathD = points.map((p, i) => { const [x, y] = xy(p, i); return `${i === 0 ? 'M' : 'L'} ${x} ${y}`; }).join(' ');
  const label = (txt, extra) => (
    <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.12em', textTransform: 'uppercase', ...extra }}>{txt}</div>
  );
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: `${10 * size}px` }}>
      {label('Plans, per month')}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: `${6 * size}px` }}>
        {plans.map((p, i) => (
          <div key={p.name} style={{ padding: `${8 * size}px ${6 * size}px`, background: t.bgAlt, border: `1px solid ${i === 0 ? t.border : t.accent}`, borderRadius: theme.space.radius || '2px', textAlign: 'center', animation: `fadeSlideIn 0.35s ease ${i * 0.08}s both` }}>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.name}</div>
            <div style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${18 * size}px`, color: t.text, margin: `${3 * size}px 0` }}>{p.price}</div>
            <div style={{ fontFamily: theme.fonts.body, fontSize: `${7.5 * size}px`, color: t.textMuted }}>{p.note}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted }}>
        Plus a platform fee ({PRICING.transactionFee}) on every sale through Stripe.
      </div>
      {label('Paying merchants and MRR by stage (modelled)', { marginTop: `${4 * size}px` })}
      <svg width="100%" height={`${70 * size}px`} viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        <path d={pathD + ` L ${VW} ${VH} L 0 ${VH} Z`} fill={t.accent} fillOpacity="0.15" />
        <path d={pathD} fill="none" stroke={t.accent} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => { const [x, y] = xy(p, i); return <circle key={i} cx={x} cy={y} r="3" fill={t.accent} vectorEffect="non-scaling-stroke" />; })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {points.map(p => (
          <span key={p.period} style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.06em', textAlign: 'center' }}>
            {p.short}<br />{p.merchants.toLocaleString()}
          </span>
        ))}
      </div>
      <div style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted, lineHeight: 1.5 }}>
        Stage 3 is about ${Math.round(points[points.length - 1].mrr / 1000)}K MRR at a $${PRICING.arpuMix} average plan. CAC is not measured yet: targets are LTV:CAC of 3:1 or better and payback inside 12 months.
      </div>
    </div>
  );
}

// ── Traction: build progress ──────────────────────────────────────────────────
function VisualTraction({ theme, size }) {
  const t = theme.colors;
  const stat = (to, label, prefix = '') => (
    <div style={{ flex: 1, padding: `${10 * size}px ${8 * size}px`, background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: theme.space.radius || '2px', textAlign: 'center' }}>
      <div style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${26 * size}px`, color: t.text, lineHeight: 1 }}>
        <CountUp to={to} prefix={prefix} duration={1.4} />
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: `${5 * size}px` }}>{label}</div>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${10 * size}px`, width: '100%' }}>
      <div style={{ display: 'flex', gap: `${8 * size}px` }}>
        {stat(TRACTION.activeUsers, 'Active users')}
        {stat(TRACTION.paidUsers, 'Paying merchants')}
        {stat(TRACTION.mrr, 'MRR', '$')}
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Live on the platform now</div>
      {LIVE_SITES.map((site, i) => (
        <a key={site.host} href={site.url} target="_blank" rel="noreferrer" style={{
          display: 'flex', alignItems: 'center', gap: `${10 * size}px`, textDecoration: 'none',
          padding: `${8 * size}px ${10 * size}px`, background: t.bgAlt, border: `1px solid ${t.border}`,
          borderRadius: theme.space.radius || '2px', animation: `proofIn 0.4s ease ${0.15 * i}s both`,
        }}>
          <span style={{ width: `${8 * size}px`, height: `${8 * size}px`, borderRadius: '50%', background: t.positive || t.accent, flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: theme.fonts.body, fontSize: `${10 * size}px`, color: t.text }}>{site.name}</span>
            <span style={{ display: 'block', fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{site.host}</span>
          </span>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: site.paying ? t.accent : t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{site.paying ? 'Paying' : 'Test account'}</span>
        </a>
      ))}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${5 * size}px` }}>
        {PRODUCT.liveNow.map(f => (
          <span key={f} style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: '999px', padding: `${3 * size}px ${8 * size}px` }}>{f}</span>
        ))}
      </div>
      <style>{`@keyframes proofIn { from { opacity: 0; transform: translateY(6px) } }`}</style>
    </div>
  );
}

// ── Roadmap: horizontal timeline ──────────────────────────────────────────────
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
        {['', 'Store', 'Customers', 'Costing', 'Price'].map((h, i) => (
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
  const Block = ({ title, total, items, delay }) => (
    <div style={{ marginBottom: `${14 * size}px` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: `${6 * size}px` }}>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{title}</span>
        <span style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${20 * size}px`, color: t.text }}>{total}</span>
      </div>
      {items.map((item, i) => (
        <div key={item.label} style={{ marginBottom: `${6 * size}px`, animation: `fadeSlideIn 0.4s ease ${delay + i * 0.07}s both` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted }}>{item.label}</span>
            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8.5 * size}px`, color: t.accent }}>{item.pct}%</span>
          </div>
          <div style={{ height: `${4 * size}px`, background: t.bgAlt, borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${item.pct}%`, background: t.accent, opacity: 0.85 }} />
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ width: '100%' }}>
      <Block title="Grants: reach Stage 1 to 2" total={`$${(FUNDING.currentGrant.amount / 1000).toFixed(0)}K`} items={FUNDING.currentGrant.breakdown} delay={0} />
      <Block title="Investment: reach Stage 3, first hires" total={`$${(FUNDING.seedRound.min / 1e6).toFixed(0)}M`} items={FUNDING.seedRound.breakdown} delay={0.3} />
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.08em' }}>
        Investment split is an illustrative draft.
      </div>
    </div>
  );
}

// ── Team: founder + first hires ───────────────────────────────────────────
function VisualTeam({ theme, size }) {
  const t = theme.colors;
  const initials = FOUNDER_INFO.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const hires = ['Marketing', 'Branding (including the rename)', 'Engineering', 'Customer success'];
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: `${12 * size}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: `${12 * size}px`, padding: `${12 * size}px`, background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: theme.space.radius || '2px' }}>
        <div style={{ width: `${44 * size}px`, height: `${44 * size}px`, borderRadius: '50%', background: t.accent, color: theme.isLight ? '#fff' : t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${16 * size}px`, flexShrink: 0 }}>{initials}</div>
        <div>
          <div style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${16 * size}px`, color: t.text }}>{FOUNDER_INFO.name}</div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{FOUNDER_INFO.title}</div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted }}>{FOUNDER_INFO.location}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${5 * size}px` }}>
        {['Built the whole platform, solo', 'Runs Lumina, a live e-commerce brand', `${TRACTION.paidUsers} paying merchants`].map(c => (
          <span key={c} style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: '999px', padding: `${3 * size}px ${8 * size}px` }}>{c}</span>
        ))}
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>First hires, after Stage 3</div>
      {hires.map((h, i) => (
        <div key={h} style={{ display: 'flex', alignItems: 'center', gap: `${8 * size}px`, animation: `fadeSlideIn 0.35s ease ${i * 0.1}s both` }}>
          <span style={{ width: `${7 * size}px`, height: `${7 * size}px`, borderRadius: '50%', border: `2px solid ${t.accent}`, flexShrink: 0 }} />
          <span style={{ fontFamily: theme.fonts.body, fontSize: `${9.5 * size}px`, color: t.text }}>{h}</span>
        </div>
      ))}
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
  team: VisualTeam,
  competition: VisualCompetition,
  ask: VisualAsk,
};
