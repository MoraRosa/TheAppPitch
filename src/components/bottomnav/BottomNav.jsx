// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
// Mobile only. 5 tabs. Icons + labels. Sits above footer.
// Pages add padding-bottom = BOTTOM_NAV_HEIGHT to clear the bar.

import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useIsMobile } from '../../hooks/useIsMobile.js';

export const BOTTOM_NAV_HEIGHT = '64px';

const IconUser = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconSlides = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M10 8l4 3-4 3V8z" fill={color} stroke={color} strokeWidth="0.5"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const IconDocument = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const IconChart = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
    <line x1="2"  y1="20" x2="22" y2="20"/>
  </svg>
);

const IconDownload = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const TABS = [
  { to: '/about',      label: 'About',     Icon: IconUser     },
  { to: '/pitch',      label: 'Pitch',     Icon: IconSlides   },
  { to: '/plan',       label: 'Plan',      Icon: IconDocument },
  { to: '/financials', label: 'Financials',Icon: IconChart    },
  { to: '/downloads',  label: 'Downloads', Icon: IconDownload },
];

export default function BottomNav() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const t = theme.colors;

  if (!isMobile) return null;

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: BOTTOM_NAV_HEIGHT,
      background: t.bg,
      borderTop: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'stretch',
      zIndex: 100,
      // Subtle backdrop blur where supported
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '3px',
            textDecoration: 'none',
            color: isActive ? t.accent : t.textFaint,
            borderTop: isActive ? `2px solid ${t.accent}` : '2px solid transparent',
            transition: 'color 0.15s, border-color 0.15s',
            paddingBottom: '2px',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon size={20} color={isActive ? t.accent : t.textFaint} />
              <span style={{
                fontFamily: theme.fonts.mono,
                fontSize: '8px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
