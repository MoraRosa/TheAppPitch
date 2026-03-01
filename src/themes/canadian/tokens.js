// ─── THEME E: CANADIAN PRINT ──────────────────────────────────────────────────
// Crisp white, black, Canadian red. Swiss grid. Libre Baskerville.
// National brand confidence. Zero decoration, pure typographic hierarchy.

export const CANADIAN = {
  id: 'canadian',
  name: "Canadian Print",
  isLight: true,

  colors: {
    bg:           '#FAFAF8',
    bgAlt:        '#F0F0EC',
    bgDeep:       '#111111',
    surface:      '#FFFFFF',
    border:       '#E0E0DC',
    borderStrong: '#111111',
    text:         '#111111',
    textMuted:    '#555555',
    textFaint:    '#999999',
    accent:       '#CC2929',
    accentDark:   '#AA1111',
    accentLight:  '#FF6666',
    negative:     '#CC2929',
    positive:     '#1A6640',
  },

  fonts: {
    display:  "'Libre Baskerville', serif",
    body:     "'DM Sans', sans-serif",
    mono:     "'Space Mono', monospace",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap",
  },

  type: {
    displaySize:    'clamp(32px, 4.5vw, 60px)',
    displayWeight:  700,
    displayStyle:   'normal',
    headSize:       'clamp(20px, 2.8vw, 36px)',
    headWeight:     700,
    headStyle:      'normal',
    subheadSize:    '16px',
    subheadWeight:  400,
    bodySize:       '15px',
    bodyWeight:     400,
    captionSize:    '11px',
    monoSize:       '10px',
    monoTracking:   '0.1em',
  },

  space: {
    navHeight:    '60px',
    pagePadding:  'clamp(20px, 4vw, 72px)',
    sectionGap:   '96px',
    radius:       '0px',
    radiusLg:     '2px',
  },

  slide: {
    bg:           '#FAFAF8',
    accentBar:    'none',
    eyebrowColor: '#CC2929',
    tagColor:     '#999999',
    overlayBg:    'rgba(250,250,248,0.97)',
    borderLeft:   '4px solid #CC2929',
  },

  motion: {
    enter:        '0.3s',
    slide:        '0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    fade:         '0.25s ease',
    autoSlide:    5000,
  },
};
