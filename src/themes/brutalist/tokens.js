// ─── THEME C: WARM BRUTALIST ──────────────────────────────────────────────────
// Cream + terracotta, Playfair Display 700, hard borders, assertive grid.
// Premium brand agency annual report energy.

export const BRUTALIST = {
  id: 'brutalist',
  name: "Warm Brutalist",
  isLight: true,

  colors: {
    bg:           '#F2EBE0',
    bgAlt:        '#E8DDD0',
    bgDeep:       '#1A1210',
    surface:      '#FAF6F0',
    border:       '#1A1210',
    borderStrong: '#1A1210',
    text:         '#1A1210',
    textMuted:    '#5A4A3A',
    textFaint:    '#8A7A6A',
    accent:       '#C4603A',
    accentDark:   '#A04828',
    accentLight:  '#E8A080',
    negative:     '#C4603A',
    positive:     '#2B4A3F',
  },

  fonts: {
    display:  "'Playfair Display', serif",
    body:     "'DM Sans', sans-serif",
    mono:     "'Space Mono', monospace",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap",
  },

  type: {
    displaySize:    'clamp(40px, 6vw, 80px)',
    displayWeight:  900,
    displayStyle:   'normal',
    headSize:       'clamp(24px, 3.5vw, 44px)',
    headWeight:     700,
    headStyle:      'normal',
    subheadSize:    '16px',
    subheadWeight:  500,
    bodySize:       '14px',
    bodyWeight:     400,
    captionSize:    '11px',
    monoSize:       '10px',
    monoTracking:   '0.05em',
  },

  space: {
    navHeight:    '60px',
    pagePadding:  'clamp(20px, 4vw, 64px)',
    sectionGap:   '100px',
    radius:       '0px',
    radiusLg:     '0px',
  },

  slide: {
    bg:           '#F2EBE0',
    accentBar:    'none',
    eyebrowColor: '#C4603A',
    tagColor:     '#1A1210',
    overlayBg:    'rgba(242,235,224,0.97)',
    borderTop:    '3px solid #1A1210',
  },

  motion: {
    enter:        '0.3s',
    slide:        '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fade:         '0.25s ease',
    autoSlide:    5000,
  },
};
