// ─── BUSINESS PLAN PAGE ───────────────────────────────────────────────────────
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { PLAN_SECTIONS } from '../data/plan.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

function PlanSection({ section }) {
  const { theme } = useTheme();
  const t = theme.colors;
  const [ref, visible] = useScrollReveal();

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(24px)',
      transition: `opacity ${theme.motion.enter}, transform ${theme.motion.enter}`,
      padding: `48px ${theme.space.pagePadding}`,
      borderBottom: `1px solid ${t.border}`,
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: '48px',
    }}>
      <div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, marginBottom: '8px' }}>
          {section.number}
        </div>
        <h2 style={{ fontFamily: theme.fonts.display, fontSize: '20px', fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text, lineHeight: 1.3 }}>
          {section.title}
        </h2>
      </div>
      <div>
        {section.content.split('\n\n').map((para, i) => (
          <p key={i} style={{ fontFamily: theme.fonts.body, fontSize: theme.type.bodySize, fontWeight: theme.type.bodyWeight, color: t.textMuted, lineHeight: 1.85, marginBottom: '20px' }}>
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function PlanPage() {
  const { theme } = useTheme();
  const t = theme.colors;

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
      <div style={{ padding: `48px ${theme.space.pagePadding} 32px`, borderBottom: `1px solid ${t.border}` }}>
        <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '8px' }}>
          Business Plan · Full Document
        </p>
        <h1 style={{ fontFamily: theme.fonts.display, fontSize: theme.type.headSize, fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text }}>
          TheApp — Complete Business Plan
        </h1>
      </div>
      {PLAN_SECTIONS.map(section => <PlanSection key={section.id} section={section} />)}
    </div>
  );
}
