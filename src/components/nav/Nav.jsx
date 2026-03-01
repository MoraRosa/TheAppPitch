// ─── NAV ──────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import SettingsDropdown from '../settings/SettingsDropdown.jsx';

const LINKS = [
  { to: '/',            label: 'Home'        },
  { to: '/about',       label: 'About'       },
  { to: '/pitch',       label: 'Pitch Deck'  },
  { to: '/plan',        label: 'Business Plan'},
  { to: '/financials',  label: 'Financials'  },
  { to: '/downloads',   label: 'Downloads'   },
];

export default function Nav() {
  const { theme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const t = theme.colors;
  const tp = theme.type;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: theme.space.navHeight,
      background: t.bg,
      borderBottom: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center',
      padding: `0 ${theme.space.pagePadding}`,
      justifyContent: 'space-between',
      zIndex: 100,
      transition: 'background 0.4s ease, border-color 0.4s ease',
    }}>
      {/* Wordmark */}
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: theme.fonts.display,
          fontSize: '20px',
          fontStyle: theme.type.displayStyle,
          fontWeight: theme.type.displayWeight,
          color: t.text,
          letterSpacing: theme.id === 'canadian' ? '0.02em' : 0,
        }}>
          TheApp
        </span>
      </NavLink>

      {/* Links */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        {LINKS.map(({ to, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            textDecoration: 'none',
            fontFamily: theme.fonts.body,
            fontSize: '13px',
            fontWeight: 400,
            color: isActive ? t.accent : t.textMuted,
            borderBottom: isActive ? `1px solid ${t.accent}` : '1px solid transparent',
            paddingBottom: '2px',
            transition: 'color 0.2s ease',
          })}>
            {label}
          </NavLink>
        ))}

        {/* Settings button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setSettingsOpen(o => !o)}
            aria-label="Settings"
            style={{
              background: settingsOpen ? t.bgAlt : 'none',
              border: `1px solid ${settingsOpen ? t.accent : t.border}`,
              borderRadius: theme.space.radius || '4px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontFamily: theme.fonts.mono,
              fontSize: '11px',
              color: settingsOpen ? t.accent : t.textMuted,
              letterSpacing: theme.type.monoTracking,
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
            <span>⚙</span>
            <span>Theme</span>
          </button>
          {settingsOpen && (
            <SettingsDropdown onClose={() => setSettingsOpen(false)} />
          )}
        </div>
      </div>
    </nav>
  );
}
