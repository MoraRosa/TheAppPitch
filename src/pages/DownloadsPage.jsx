// ─── DOWNLOADS PAGE ───────────────────────────────────────────────────────────
// PDF downloads. Files go in /public/downloads/
import { useTheme } from '../context/ThemeContext.jsx';

const DOWNLOADS = [
  { title: 'Business Plan', desc: 'Full business plan — all 10 sections. PDF format.', file: 'theapp-business-plan.pdf', size: 'PDF' },
  { title: 'Pitch Deck', desc: 'Investor pitch deck — 10 slides. PDF format.', file: 'theapp-pitch-deck.pdf', size: 'PDF' },
  { title: 'Financial Projections', desc: 'Year 1–3 projections, unit economics, funding breakdown.', file: 'theapp-financials.pdf', size: 'PDF' },
];

export default function DownloadsPage() {
  const { theme } = useTheme();
  const t = theme.colors;

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: theme.space.navHeight }}>
      <div style={{ padding: `48px ${theme.space.pagePadding} 32px`, borderBottom: `1px solid ${t.border}` }}>
        <p style={{ fontFamily: theme.fonts.mono, fontSize: theme.type.monoSize, color: t.accent, letterSpacing: theme.type.monoTracking, textTransform: 'uppercase', marginBottom: '8px' }}>
          Downloads
        </p>
        <h1 style={{ fontFamily: theme.fonts.display, fontSize: theme.type.headSize, fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text }}>
          Take everything with you.
        </h1>
      </div>

      <div style={{ padding: `48px ${theme.space.pagePadding}`, display: 'flex', flexDirection: 'column', gap: '1px', background: t.border, maxWidth: '800px' }}>
        {DOWNLOADS.map(dl => (
          <div key={dl.title} style={{ background: t.bg, padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontFamily: theme.fonts.display, fontSize: '22px', fontWeight: theme.type.headWeight, fontStyle: theme.type.headStyle, color: t.text, marginBottom: '6px' }}>
                {dl.title}
              </h3>
              <p style={{ fontFamily: theme.fonts.body, fontSize: '13px', color: t.textMuted, lineHeight: 1.6 }}>
                {dl.desc}
              </p>
            </div>
            <a href={`/theapp-pitch/downloads/${dl.file}`} download style={{
              flexShrink: 0, marginLeft: '32px',
              background: 'none', border: `1px solid ${t.border}`,
              color: t.textMuted, textDecoration: 'none',
              padding: '10px 22px', borderRadius: theme.space.radius || '4px',
              fontFamily: theme.fonts.mono, fontSize: '10px', letterSpacing: '0.1em',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.borderColor = t.accent; e.target.style.color = t.accent; }}
              onMouseLeave={e => { e.target.style.borderColor = t.border; e.target.style.color = t.textMuted; }}
            >
              ↓ {dl.size}
            </a>
          </div>
        ))}
      </div>

      <div style={{ padding: `0 ${theme.space.pagePadding} 48px`, fontFamily: theme.fonts.body, fontSize: '12px', color: t.textFaint, marginTop: '24px', lineHeight: 1.6 }}>
        PDFs are generated from the live data in this application. Place your PDF files in <code style={{ fontFamily: theme.fonts.mono, background: t.bgAlt, padding: '2px 6px', borderRadius: '2px' }}>/public/downloads/</code> to enable downloads.
      </div>
    </div>
  );
}
