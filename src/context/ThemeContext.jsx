// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
// Single source of truth for active theme.
// Injects Google Fonts + theme-matched scrollbar CSS on every theme change.

import { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/index.js';

const ThemeContext = createContext(null);

function buildScrollbarCSS(theme) {
  const t = theme.colors;
  // Firefox
  const ffColor = `scrollbar-color: ${t.border} ${t.bgAlt};`;
  // WebKit
  return `
    html { ${ffColor} scrollbar-width: thin; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: ${t.bgAlt}; }
    ::-webkit-scrollbar-thumb {
      background: ${t.borderStrong};
      border-radius: ${theme.space.radius === '0px' ? '0' : '3px'};
    }
    ::-webkit-scrollbar-thumb:hover { background: ${t.accent}; }
    ::-webkit-scrollbar-corner { background: ${t.bgAlt}; }
  `;
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('theapp-theme') || DEFAULT_THEME;
  });

  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];

  useEffect(() => {
    localStorage.setItem('theapp-theme', themeId);

    // ── Google Fonts
    const existingFont = document.getElementById('theme-font');
    if (existingFont) existingFont.remove();
    const link = document.createElement('link');
    link.id = 'theme-font';
    link.rel = 'stylesheet';
    link.href = theme.fonts.googleFontsUrl;
    document.head.appendChild(link);

    // ── Scrollbar styles
    const existingScrollbar = document.getElementById('theme-scrollbar');
    if (existingScrollbar) existingScrollbar.remove();
    const style = document.createElement('style');
    style.id = 'theme-scrollbar';
    style.textContent = buildScrollbarCSS(theme);
    document.head.appendChild(style);

    // ── Body background (prevents flash on theme switch)
    document.body.style.background = theme.colors.bg;
    document.body.style.transition = 'background 0.4s ease';

  }, [themeId, theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
