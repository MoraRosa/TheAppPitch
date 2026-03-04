// ─── NAV ──────────────────────────────────────────────────────────────────────
// Desktop: full horizontal nav
// Mobile: logo + theme icon only (bottom nav handles routes)

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import SettingsDropdown from '../settings/SettingsDropdown.jsx';
import { COMPANY } from '../../data/config.js';

const DESKTOP_LINKS = [
  { to: '/',            label: 'Home'          },
  { to: '/about',       label: 'About'         },
  { to: '/pitch',       label: 'Pitch Deck'    },
  { to: '/plan',        label: 'Business Plan' },
  { to: '/financials',  label: 'Financials'    },
  { to: '/downloads',   label: 'Downloads'     },
];

const IconSettings = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

export default function Nav() {
  const { theme } = useTheme();
  const t = theme.colors;
  const isMobile = useIsMobile();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: theme.space.navHeight,
      background: t.bg,
      borderBottom: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center',
      padding: `0 ${isMobile ? '16px' : theme.space.pagePadding}`,
      justifyContent: 'space-between',
      zIndex: 100,
      transition: 'background 0.4s ease',
    }}>
      {/* Wordmark */}
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: theme.fonts.display,
          fontSize: isMobile ? '18px' : '20px',
          fontStyle: theme.type.displayStyle,
          fontWeight: theme.type.displayWeight,
          color: t.text,
        }}>
          {COMPANY.name}
        </span>
      </NavLink>

      {/* Desktop links */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {DESKTOP_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
              textDecoration: 'none',
              fontFamily: theme.fonts.body, fontSize: '13px', fontWeight: 400,
              color: isActive ? t.accent : t.textMuted,
              borderBottom: isActive ? `1px solid ${t.accent}` : '1px solid transparent',
              paddingBottom: '2px', transition: 'color 0.2s ease',
            })}>
              {label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Settings button — desktop: text + icon, mobile: icon only */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setSettingsOpen(o => !o)}
          aria-label="Theme Settings"
          style={{
            background: settingsOpen ? t.bgAlt : 'none',
            border: `1px solid ${settingsOpen ? t.accent : t.border}`,
            borderRadius: theme.space.radius || '4px',
            padding: isMobile ? '7px 10px' : '6px 12px',
            cursor: 'pointer',
            color: settingsOpen ? t.accent : t.textMuted,
            display: 'flex', alignItems: 'center',
            gap: isMobile ? '0' : '6px',
            transition: 'all 0.2s ease',
          }}
        >
          <IconSettings size={15} color={settingsOpen ? t.accent : t.textMuted} />
          {!isMobile && (
            <span style={{ fontFamily: theme.fonts.mono, fontSize: '11px', letterSpacing: theme.type.monoTracking }}>
              Theme
            </span>
          )}
        </button>
        {settingsOpen && (
          <SettingsDropdown onClose={() => setSettingsOpen(false)} />
        )}
      </div>
    </nav>
  );
}
