// ─── SETTINGS DROPDOWN ────────────────────────────────────────────────────────
// Theme switcher. Extensible — add new setting sections below the theme grid.

import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { THEME_LIST } from '../../themes/index.js';

export default function SettingsDropdown({ onClose }) {
  const { theme, themeId, setThemeId } = useTheme();
  const t = theme.colors;
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: 'absolute', top: 'calc(100% + 10px)', right: 0,
      width: '280px',
      background: t.bg,
      border: `1px solid ${t.borderStrong}`,
      borderRadius: theme.space.radiusLg || '8px',
      boxShadow: `0 16px 48px rgba(0,0,0,${theme.isLight ? 0.12 : 0.5})`,
      zIndex: 200,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 10px',
        borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{
          fontFamily: theme.fonts.mono,
          fontSize: '9px',
          letterSpacing: theme.type.monoTracking,
          color: t.textFaint,
          textTransform: 'uppercase',
          marginBottom: '2px',
        }}>
          Settings
        </div>
        <div style={{
          fontFamily: theme.fonts.body,
          fontSize: '13px',
          color: t.text,
          fontWeight: 400,
        }}>
          Design Theme
        </div>
      </div>

      {/* Theme list */}
      <div style={{ padding: '10px 12px' }}>
        {THEME_LIST.map((item) => {
          const isActive = themeId === item.id;
          return (
            <button key={item.id} onClick={() => { setThemeId(item.id); onClose(); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 10px',
                background: isActive ? t.bgAlt : 'none',
                border: `1px solid ${isActive ? t.accent : 'transparent'}`,
                borderRadius: theme.space.radius || '4px',
                cursor: 'pointer',
                marginBottom: '4px',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}>
              <span style={{
                fontFamily: theme.fonts.mono,
                fontSize: '14px',
                color: isActive ? t.accent : t.textMuted,
                width: '20px', flexShrink: 0,
              }}>
                {item.icon}
              </span>
              <div>
                <div style={{
                  fontFamily: theme.fonts.body,
                  fontSize: '13px',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? t.text : t.textMuted,
                }}>
                  {item.label}
                </div>
              </div>
              {isActive && (
                <span style={{
                  marginLeft: 'auto',
                  fontFamily: theme.fonts.mono,
                  fontSize: '8px',
                  color: t.accent,
                  letterSpacing: '0.1em',
                }}>
                  ACTIVE
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Future settings sections go here */}
      <div style={{
        padding: '10px 16px 12px',
        borderTop: `1px solid ${t.border}`,
        fontFamily: theme.fonts.mono,
        fontSize: '8px',
        color: t.textFaint,
        letterSpacing: '0.15em',
      }}>
        MORE SETTINGS COMING SOON
      </div>
    </div>
  );
}
