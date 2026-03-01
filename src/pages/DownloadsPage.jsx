// ─── DOWNLOADS PAGE ───────────────────────────────────────────────────────────
// All files generated client-side from live data. No uploads needed.
// Updating content in /data/ automatically updates all downloads.

import { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { generateBusinessPlanPDF } from '../utils/generatePDF.js';
import { generatePitchDeckPDF, generateFinancialsPDF } from '../utils/generatePDF.js';
import { generatePitchDeckPPTX } from '../utils/generatePPTX.js';

const DOWNLOADS = [
  {
    id: 'plan-pdf',
    title: 'Business Plan',
    format: 'PDF',
    icon: '📄',
    desc: 'Full 10-section business plan. Generated from live content.',
    action: (theme) => generateBusinessPlanPDF(theme),
  },
  {
    id: 'pitch-pdf',
    title: 'Pitch Deck',
    format: 'PDF',
    icon: '📊',
    desc: '10-slide investor pitch deck. Landscape format. Generated from live slides.',
    action: (theme) => generatePitchDeckPDF(theme),
  },
  {
    id: 'pitch-pptx',
    title: 'Pitch Deck',
    format: 'PPTX',
    icon: '🎯',
    desc: 'Editable PowerPoint version for offline presenting. Uses active theme colours.',
    action: (theme) => generatePitchDeckPPTX(theme),
  },
  {
    id: 'financials-pdf',
    title: 'Financial Projections',
    format: 'PDF',
    icon: '📈',
    desc: 'Unit economics, 3-year milestones, funding breakdown.',
    action: (theme) => generateFinancialsPDF(theme),
  },
];

export default function DownloadsPage() {
  const { theme } = useTheme();
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
      {/* Header */}
      <div style={{
        padding: `48px ${theme.space.pagePadding} 32px`,
        borderBottom: `1px solid ${t.border}`,
      }}>
        <p style={{
          fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize,
          color: t.accent, letterSpacing: theme.type.monoTracking,
          textTransform: 'uppercase', marginBottom: '8px',
        }}>
          Downloads
        </p>
        <h1 style={{
          fontFamily: theme.fonts.display, fontSize: theme.type.headSize,
          fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle,
          color: t.text, marginBottom: '12px',
        }}>
          Take everything with you.
        </h1>
        <p style={{
          fontFamily: theme.fonts.body, fontSize: '13px',
          color: t.textMuted, lineHeight: 1.6, maxWidth: '520px',
        }}>
          All files are generated instantly from the live content in this app.
          No uploads needed — every download always reflects the current version.
        </p>
      </div>

      {/* Download cards */}
      <div style={{
        padding: `40px ${theme.space.pagePadding}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1px',
        background: t.border,
        maxWidth: '960px',
      }}>
        {DOWNLOADS.map(dl => {
          const isLoading = loading[dl.id];
          const isDone = done[dl.id];

          return (
            <div key={dl.id} style={{
              background: t.bg,
              padding: '32px 36px',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between', gap: '20px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{dl.icon}</span>
                  <span style={{
                    fontFamily: theme.fonts.mono, fontSize: '9px',
                    color: t.accent, letterSpacing: '0.15em',
                    border: `1px solid ${t.accent}`,
                    padding: '2px 6px',
                    borderRadius: theme.space.radius || '2px',
                  }}>
                    {dl.format}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: theme.fonts.display, fontSize: '20px',
                  fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle,
                  color: t.text, marginBottom: '6px',
                }}>
                  {dl.title}
                </h3>
                <p style={{
                  fontFamily: theme.fonts.body, fontSize: '13px',
                  color: t.textMuted, lineHeight: 1.6,
                }}>
                  {dl.desc}
                </p>
              </div>

              <button
                onClick={() => handleDownload(dl)}
                disabled={isLoading}
                style={{
                  background: isDone ? t.positive : 'none',
                  border: `1px solid ${isDone ? t.positive : isLoading ? t.textFaint : t.accent}`,
                  color: isDone ? '#fff' : isLoading ? t.textFaint : t.accent,
                  padding: '10px 20px',
                  borderRadius: theme.space.radius || '4px',
                  cursor: isLoading ? 'wait' : 'pointer',
                  fontFamily: theme.fonts.mono, fontSize: '10px',
                  letterSpacing: '0.12em',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  justifyContent: 'center',
                }}
              >
                {isLoading ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span>
                    GENERATING...
                  </>
                ) : isDone ? (
                  '✓ DOWNLOADED'
                ) : (
                  `↓ DOWNLOAD ${dl.format}`
                )}
              </button>
            </div>
          );
        })}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Note */}
      <div style={{
        padding: `24px ${theme.space.pagePadding} 48px`,
        fontFamily: theme.fonts.mono, fontSize: '9px',
        color: t.textFaint, letterSpacing: '0.1em', lineHeight: 1.8,
        maxWidth: '600px',
      }}>
        FILES ARE GENERATED FROM LIVE APP DATA · NO SERVER · NO STALE CONTENT<br />
        PPTX USES ACTIVE THEME COLOURS · PDF ALWAYS REFLECTS CURRENT VERSION
      </div>
    </div>
  );
}
