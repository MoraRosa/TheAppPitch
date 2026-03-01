// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
// Single source of truth for active theme. Persists to localStorage.

import { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/index.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('theapp-theme') || DEFAULT_THEME;
  });

  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];

  useEffect(() => {
    localStorage.setItem('theapp-theme', themeId);
    // Inject Google Fonts for active theme
    const existing = document.getElementById('theme-font');
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.id = 'theme-font';
    link.rel = 'stylesheet';
    link.href = theme.fonts.googleFontsUrl;
    document.head.appendChild(link);
    // Apply bg color to body to prevent flash
    document.body.style.background = theme.colors.bg;
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
