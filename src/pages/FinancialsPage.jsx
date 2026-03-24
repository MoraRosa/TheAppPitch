// ─── FINANCIALS PAGE ──────────────────────────────────────────────────────────
import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext.jsx';
import { useIsMobile } from '../hooks/useIsMobile.js';
import { MERCHANT_GROWTH, UNIT_ECONOMICS, FUNDING_BREAKDOWN_SMALL, COMPETITOR_COST_STACK, MILESTONES } from '../data/financials.js';

const CHART_TABS = ['MRR Growth', 'Merchant Growth', 'Funding Use', 'vs. Competition'];

const UE_ITEMS = [
  { label: 'ARPU / month', key: 'arpu',           format: v => `$${v}` },
  { label: 'LTV',          key: 'ltv',            format: v => `$${v.toLocaleString()}` },
  { label: 'CAC',          key: 'cac',            format: v => `$${v}` },
  { label: 'LTV : CAC',   key: 'ltvCacRatio',    format: v => `${v}×` },
  { label: 'Payback',      key: 'paybackMonths',  format: v => `${v} mo` },
];

export default function FinancialsPage() {
  const { theme } = useTheme();
  const t = theme.colors;
  const isMobile = useIsMobile();
  const [tab, setTab] = useState(0);

  const tooltipStyle = {
    background: t.bgAlt, border: `1px solid ${t.border}`,
    borderRadius: '4px', color: t.text,
    fontFamily: theme.fonts.body, fontSize: '12px',
  };

  const pad = isMobile ? '16px' : theme.space.pagePadding;

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>

      {/* Header */}
      <div style={{ padding: `48px ${pad} 32px`, borderBottom: `1px solid ${t.border}` }}>
        <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '8px' }}>
          Financial Projections
        </p>
        <h1 style={{ fontFamily: theme.fonts.display, fontSize: theme.type.headSize, fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text }}>
          From 15 beta merchants to $948K ARR.
        </h1>
      </div>

      {/* Unit economics — clean borders, no grid background */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
        borderBottom: `1px solid ${t.border}`,
      }}>
        {UE_ITEMS.map((item, i) => (
          <div key={item.label} style={{
            padding: isMobile ? '20px 12px' : '28px 32px',
            borderRight: i < UE_ITEMS.length - 1 ? `1px solid ${t.border}` : 'none',
            // On mobile, wrap to second row — add top border for row 2
            borderTop: isMobile && i >= 3 ? `1px solid ${t.border}` : 'none',
          }}>
            <div style={{
              fontFamily: theme.fonts.display,
              fontStyle: theme.type.displayStyle,
              fontWeight: theme.type.displayWeight,
              fontSize: isMobile ? '22px' : '32px',
              color: t.text, lineHeight: 1, marginBottom: '6px',
            }}>
              {item.format(UNIT_ECONOMICS[item.key])}
            </div>
            <div style={{
              fontFamily: theme.fonts.mono,
              fontSize: isMobile ? '7px' : '9px',
              color: t.accent,
              letterSpacing: theme.type.monoTracking,
              textTransform: 'uppercase',
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Chart tabs */}
      <div style={{ padding: `32px ${pad} 0` }}>
        <div style={{
          display: 'flex',
          gap: isMobile ? '0' : '4px',
          marginBottom: '32px',
          borderBottom: `1px solid ${t.border}`,
          overflowX: isMobile ? 'auto' : 'visible',
        }}>
          {CHART_TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} style={{
              background: 'none', border: 'none',
              borderBottom: i === tab ? `2px solid ${t.accent}` : '2px solid transparent',
              padding: isMobile ? '10px 14px' : '10px 20px',
              cursor: 'pointer', marginBottom: '-1px',
              fontFamily: theme.fonts.body,
              fontSize: isMobile ? '12px' : '13px',
              color: i === tab ? t.text : t.textMuted,
              fontWeight: i === tab ? 500 : 400,
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div style={{ height: isMobile ? '260px' : '360px', marginBottom: '48px' }}>
          {tab === 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MERCHANT_GROWTH}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={t.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={t.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
                <XAxis dataKey="period" tick={{ fontFamily: theme.fonts.mono, fontSize: 8, fill: t.textMuted }} interval={isMobile ? 2 : 0} />
                <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontFamily: theme.fonts.mono, fontSize: 8, fill: t.textMuted }} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [`$${v.toLocaleString()}`, 'MRR']} />
                <Area type="monotone" dataKey="mrr" stroke={t.accent} strokeWidth={2} fill="url(#mrrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {tab === 1 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MERCHANT_GROWTH}>
                <defs>
                  <linearGradient id="marchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={t.positive || t.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={t.positive || t.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
                <XAxis dataKey="period" tick={{ fontFamily: theme.fonts.mono, fontSize: 8, fill: t.textMuted }} interval={isMobile ? 2 : 0} />
                <YAxis tick={{ fontFamily: theme.fonts.mono, fontSize: 8, fill: t.textMuted }} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Merchants']} />
                <Area type="monotone" dataKey="merchants" stroke={t.positive || t.accent} strokeWidth={2} fill="url(#marchGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {tab === 2 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FUNDING_BREAKDOWN_SMALL} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} horizontal={false} />
                <XAxis type="number" tickFormatter={v => `$${v.toLocaleString()}`} tick={{ fontFamily: theme.fonts.mono, fontSize: 8, fill: t.textMuted }} />
                <YAxis type="category" dataKey="label" width={isMobile ? 120 : 180} tick={{ fontFamily: theme.fonts.body, fontSize: isMobile ? 9 : 11, fill: t.textMuted }} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [`$${v.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" fill={t.accent} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          {tab === 3 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPETITOR_COST_STACK}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
                <XAxis dataKey="tool" tick={{ fontFamily: theme.fonts.body, fontSize: isMobile ? 8 : 10, fill: t.textMuted }} />
                <YAxis tickFormatter={v => `$${v}`} tick={{ fontFamily: theme.fonts.mono, fontSize: 8, fill: t.textMuted }} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [`$${v}/mo`, '']} />
                <Bar dataKey="max" fill={t.negative || t.accent} opacity={0.8} name="Max cost" />
                <Bar dataKey="min" fill={t.textFaint} name="Min cost" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Milestones — clean borders, no grid background */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          borderTop: `1px solid ${t.border}`,
        }}>
          {MILESTONES.map((m, i) => (
            <div key={m.label} style={{
              padding: isMobile ? '24px 0' : '32px 40px',
              borderRight: !isMobile && i < MILESTONES.length - 1 ? `1px solid ${t.border}` : 'none',
              borderBottom: isMobile && i < MILESTONES.length - 1 ? `1px solid ${t.border}` : 'none',
            }}>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.accent, letterSpacing: theme.type.monoTracking, marginBottom: '12px' }}>
                {m.label.toUpperCase()}
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: isMobile ? '22px' : '28px', color: t.text, marginBottom: '4px' }}>
                {m.merchants} merchants
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: isMobile ? '18px' : '22px', color: t.accent, marginBottom: '12px' }}>
                ${m.arr.toLocaleString()} ARR
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: '12px', color: t.textMuted, lineHeight: 1.5 }}>
                {m.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
