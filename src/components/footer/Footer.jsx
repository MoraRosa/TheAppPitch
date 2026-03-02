// ─── FOOTER ───────────────────────────────────────────────────────────────────
// Thin, typographic, stays out of the way.

import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { FOUNDER } from '../../data/founder.js';

export default function Footer() {
  const { theme } = useTheme();
  const t = theme.colors;

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
      {/* Left — wordmark + tagline */}
      <div>
        <span style={{
          fontFamily: theme.fonts.display,
          fontSize: '16px',
          fontStyle: theme.type.displayStyle,
          fontWeight: theme.type.displayWeight,
          color: t.text,
          marginRight: '12px',
        }}>
          TheApp
        </span>
        <span style={{
          fontFamily: theme.fonts.mono,
          fontSize: '8px',
          color: t.textFaint,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Investor Pitch · {new Date().getFullYear()}
        </span>
      </div>

      {/* Center — nav links */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {[
          { to: '/pitch',      label: 'Pitch' },
          { to: '/plan',       label: 'Plan' },
          { to: '/financials', label: 'Financials' },
          { to: '/downloads',  label: 'Downloads' },
        ].map(({ to, label }) => (
          <Link key={to} to={to} style={{
            fontFamily: theme.fonts.mono,
            fontSize: '9px',
            color: t.textFaint,
            textDecoration: 'none',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.target.style.color = t.accent}
            onMouseLeave={e => e.target.style.color = t.textFaint}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right — founder + contact */}
      <div style={{ textAlign: 'right' }}>
        <span style={{
          fontFamily: theme.fonts.mono,
          fontSize: '9px',
          color: t.textFaint,
          letterSpacing: '0.08em',
        }}>
          Built by {FOUNDER.name} ·{' '}
        </span>
        <a
          href="https://github.com/MoraRosa"
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: '9px',
            color: t.accent,
            textDecoration: 'none',
            letterSpacing: '0.08em',
          }}
        >
          GitHub →
        </a>
      </div>
    </footer>
  );
}
