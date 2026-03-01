// ─── THEME D: DARK EDITORIAL ──────────────────────────────────────────────────
// Near-black, champagne gold, Cormorant Garamond italic, cinematic luxury.
// Wallpaper* magazine meets investor deck.

export const EDITORIAL = {
  id: 'editorial',
  name: "Dark Editorial",
  isLight: false,

  colors: {
    bg:           '#0E0C09',
    bgAlt:        '#161310',
    bgDeep:       '#0A0806',
    surface:      '#1C1814',
    border:       '#2A2420',
    borderStrong: '#4A3F30',
    text:         '#F5F0E8',
    textMuted:    '#8A7D6E',
    textFaint:    '#4A3F30',
    accent:       '#C9A96E',
    accentDark:   '#A8853A',
    accentLight:  '#E8D4A8',
    negative:     '#E07B6A',
    positive:     '#6A9E8A',
  },

  fonts: {
    display:  "'Cormorant Garamond', serif",
    body:     "'DM Sans', sans-serif",
    mono:     "'Space Mono', monospace",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400&display=swap",
  },

  type: {
    displaySize:    'clamp(38px, 5.5vw, 72px)',
    displayWeight:  300,
    displayStyle:   'italic',
    headSize:       'clamp(24px, 3.2vw, 42px)',
    headWeight:     300,
    headStyle:      'italic',
    subheadSize:    '17px',
    subheadWeight:  300,
    bodySize:       '14px',
    bodyWeight:     300,
    captionSize:    '10px',
    monoSize:       '9px',
    monoTracking:   '0.2em',
  },

  space: {
    navHeight:    '64px',
    pagePadding:  'clamp(24px, 5vw, 80px)',
    sectionGap:   '120px',
    radius:       '4px',
    radiusLg:     '8px',
  },

  slide: {
    bg:           '#0E0C09',
    accentBar:    'linear-gradient(90deg, #C9A96E, transparent)',
    eyebrowColor: '#C9A96E',
    tagColor:     '#2A2420',
    overlayBg:    'rgba(14,12,9,0.96)',
  },

  motion: {
    enter:        '0.6s',
    slide:        '0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    fade:         '0.4s ease',
    autoSlide:    6000,
  },
};
