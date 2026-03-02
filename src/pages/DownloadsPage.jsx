import { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { generateBusinessPlanPDF, generatePitchDeckPDF, generateFinancialsPDF } from '../utils/generatePDF.js';
import { generatePitchDeckPPTX } from '../utils/generatePPTX.js';

const IconDocument = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconPresentation = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const IconSlides = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M10 8l4 3-4 3V8z" fill={color} stroke={color} strokeWidth="1"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const IconChart = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const IconDownload = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const IconCheck = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconSpinner = ({ size = 13, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite', transformOrigin: 'center' }}>
    <path d="M12 2a10 10 0 0 1 10 10"/>
  </svg>
);

const DOWNLOADS = [
  {
    id: 'plan-pdf', title: 'Business Plan', format: 'PDF', Icon: IconDocument,
    desc: 'Full 10-section business plan. Generated from live content.',
    action: (theme) => generateBusinessPlanPDF(theme),
  },
  {
    id: 'pitch-pdf', title: 'Pitch Deck', format: 'PDF', Icon: IconPresentation,
    desc: '10-slide investor pitch deck. Landscape format.',
    action: (theme) => generatePitchDeckPDF(theme),
  },
  {
    id: 'pitch-pptx', title: 'Pitch Deck', format: 'PPTX', Icon: IconSlides,
    desc: 'Editable PowerPoint for offline presenting. Uses active theme colours.',
    action: (theme) => generatePitchDeckPPTX(theme),
  },
  {
    id: 'financials-pdf', title: 'Financial Projections', format: 'PDF', Icon: IconChart,
    desc: 'Unit economics, 3-year milestones, funding breakdown.',
    action: (theme) => generateFinancialsPDF(theme),
  },
];

export default function DownloadsPage() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const pad = isMobile ? '16px' : theme.space.pagePadding;
  const t = theme.colors;
  const [loading, setLoading] = useState({});
  const [done, setDone] = useState({});

  const handleDownload = async (dl) => {
    setLoading(l => ({ ...l, [dl.id]: true }));
    setDone(d => ({ ...d, [dl.id]: false }));
    try {
      await dl.action(theme);
      setDone(d => ({ ...d, [dl.id]: true }));
      setTimeout(() => setDone(d => ({ ...d, [dl.id]: false })), 3000);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setLoading(l => ({ ...l, [dl.id]: false }));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ padding: `48px ${pad} 32px`, borderBottom: `1px solid ${t.border}` }}>
        <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '8px' }}>
          Downloads
        </p>
        <h1 style={{ fontFamily: theme.fonts.display, fontSize: theme.type.headSize, fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text, marginBottom: '12px' }}>
          Take everything with you.
        </h1>
        <p style={{ fontFamily: theme.fonts.body, fontSize: '13px', color: t.textMuted, lineHeight: 1.6, maxWidth: '520px' }}>
          All files generated instantly from live app content. Always current — no uploads needed.
        </p>
      </div>

      {/* Cards — no background trick, just borders */}
      <div style={{ padding: `40px ${pad}` }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          maxWidth: '1000px',
        }}>
          {DOWNLOADS.map((dl, i) => {
            const isLoading = loading[dl.id];
            const isDone = done[dl.id];
            const isLast = i === DOWNLOADS.length - 1;
            const isLastRow = i >= DOWNLOADS.length - (DOWNLOADS.length % 2 || 2);

            return (
              <div key={dl.id} style={{
                padding: '32px 32px 28px',
                borderRight: (i % 2 === 0) ? `1px solid ${t.border}` : 'none',
                borderBottom: !isLastRow ? `1px solid ${t.border}` : 'none',
                display: 'flex', flexDirection: 'column', gap: '20px',
              }}>
                {/* Icon + format badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${t.border}`,
                    borderRadius: theme.space.radiusLg || '6px',
                  }}>
                    <dl.Icon size={18} color={t.accent} />
                  </div>
                  <span style={{
                    fontFamily: theme.fonts.mono, fontSize: '8px',
                    color: t.accent, letterSpacing: '0.18em',
                    border: `1px solid ${t.accent}`,
                    padding: '3px 7px',
                    borderRadius: theme.space.radius || '2px',
                  }}>
                    {dl.format}
                  </span>
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: theme.fonts.display, fontSize: '19px', fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text, marginBottom: '6px', lineHeight: 1.2 }}>
                    {dl.title}
                  </h3>
                  <p style={{ fontFamily: theme.fonts.body, fontSize: '13px', color: t.textMuted, lineHeight: 1.65 }}>
                    {dl.desc}
                  </p>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleDownload(dl)}
                  disabled={isLoading}
                  style={{
                    background: isDone ? (t.positive || t.accent) : 'none',
                    border: `1px solid ${isDone ? (t.positive || t.accent) : isLoading ? t.textFaint : t.accent}`,
                    color: isDone ? (theme.isLight ? '#fff' : t.bg) : isLoading ? t.textFaint : t.accent,
                    padding: '10px 16px',
                    borderRadius: theme.space.radius || '4px',
                    cursor: isLoading ? 'wait' : 'pointer',
                    fontFamily: theme.fonts.mono, fontSize: '10px',
                    letterSpacing: '0.12em',
                    transition: 'all 0.2s ease',
                    display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  {isLoading ? (
                    <><IconSpinner size={13} color={t.textFaint} /> GENERATING...</>
                  ) : isDone ? (
                    <><IconCheck size={13} color={theme.isLight ? '#fff' : t.bg} /> DOWNLOADED</>
                  ) : (
                    <><IconDownload size={13} color={t.accent} /> DOWNLOAD {dl.format}</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div style={{ padding: `0 ${pad} 48px`, fontFamily: theme.fonts.mono, fontSize: '8px', color: t.textFaint, letterSpacing: '0.12em', lineHeight: 2 }}>
        GENERATED CLIENT-SIDE · NO SERVER · NO STALE FILES<br />
        CONTENT UPDATES IN /DATA/ ARE REFLECTED INSTANTLY IN ALL DOWNLOADS
      </div>
    </div>
  );
}
