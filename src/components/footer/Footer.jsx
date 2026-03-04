// ─── FOOTER ───────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import { FOUNDER } from '../../data/founder.js';
import { COMPANY, FOUNDER_INFO } from '../../data/config.js';

export default function Footer() {
  const { theme } = useTheme();
  const t = theme.colors;
  const isMobile = useIsMobile();

  if (isMobile) {
    // Compact single-line footer on mobile
    return (
      <footer style={{
        borderTop: `1px solid ${t.border}`,
        background: t.bg,
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: theme.fonts.display, fontSize: '14px', fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, color: t.text }}>
          {COMPANY.name}
        </span>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: '8px', color: t.textFaint, letterSpacing: '0.1em' }}>
          © {new Date().getFullYear()} {FOUNDER.name}
        </span>
        <a href={FOUNDER_INFO.github} target="_blank" rel="noreferrer" style={{ fontFamily: theme.fonts.mono, fontSize: '8px', color: t.accent, textDecoration: 'none', letterSpacing: '0.08em' }}>
          GitHub →
        </a>
      </footer>
    );
  }

  return (
    <footer style={{
      borderTop: `1px solid ${t.border}`,
      background: t.bg,
      padding: `28px ${theme.space.pagePadding}`,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: '24px',
    }}>
      {/* Left */}
      <div>
        <span style={{ fontFamily: theme.fonts.display, fontSize: '16px', fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, color: t.text, marginRight: '12px' }}>
          {COMPANY.name}
        </span>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: '8px', color: t.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Investor Pitch · {new Date().getFullYear()}
        </span>
      </div>

      {/* Center links */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {[
          { to: '/pitch',      label: 'Pitch'       },
          { to: '/plan',       label: 'Plan'         },
          { to: '/financials', label: 'Financials'   },
          { to: '/downloads',  label: 'Downloads'    },
        ].map(({ to, label }) => (
          <Link key={to} to={to} style={{
            fontFamily: theme.fonts.mono, fontSize: '9px',
            color: t.textFaint, textDecoration: 'none',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.target.style.color = t.accent}
            onMouseLeave={e => e.target.style.color = t.textFaint}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right */}
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.textFaint, letterSpacing: '0.08em' }}>
          Built by {FOUNDER.name} ·{' '}
        </span>
        <a href={FOUNDER_INFO.github} target="_blank" rel="noreferrer" style={{ fontFamily: theme.fonts.mono, fontSize: '9px', color: t.accent, textDecoration: 'none', letterSpacing: '0.08em' }}>
          GitHub →
        </a>
      </div>
    </footer>
  );
}
