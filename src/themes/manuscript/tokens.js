// ─── THEME A: FOUNDER'S MANUSCRIPT ───────────────────────────────────────────
// Warm ivory, ink, editorial weight. Cormorant Garamond + DM Sans.
// High-end magazine meets founder diary.

export const MANUSCRIPT = {
  id: 'manuscript',
  name: "Founder's Manuscript",
  isLight: true,

  // ── Colour tokens
  colors: {
    bg:           '#F7F2E8',
    bgAlt:        '#EDE7D9',
    bgDeep:       '#E0D8C8',
    surface:      '#FDFAF4',
    border:       '#D4C9B0',
    borderStrong: '#B8A88A',
    text:         '#1C1510',
    textMuted:    '#6B5E4E',
    textFaint:    '#A89880',
    accent:       '#C9A96E',
    accentDark:   '#A8853A',
    accentLight:  '#E8D4A8',
    negative:     '#CC4433',
    positive:     '#4A7C5F',
  },

  // ── Typography
  fonts: {
    display:  "'Cormorant Garamond', serif",
    body:     "'DM Sans', sans-serif",
    mono:     "'DM Mono', monospace",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap",
  },

  // ── Type scale
  type: {
    displaySize:    'clamp(36px, 5vw, 68px)',
    displayWeight:  300,
    displayStyle:   'italic',
    headSize:       'clamp(22px, 3vw, 38px)',
    headWeight:     300,
    headStyle:      'italic',
    subheadSize:    '18px',
    subheadWeight:  400,
    bodySize:       '15px',
    bodyWeight:     300,
    captionSize:    '11px',
    monoSize:       '10px',
    monoTracking:   '0.15em',
  },

  // ── Spacing & shape
  space: {
    navHeight:    '64px',
    pagePadding:  'clamp(24px, 5vw, 80px)',
    sectionGap:   '120px',
    radius:       '2px',
    radiusLg:     '4px',
  },

  // ── Slide-specific
  slide: {
    bg:           '#F7F2E8',
    accentBar:    'linear-gradient(90deg, #C9A96E, transparent)',
    eyebrowColor: '#C9A96E',
    tagColor:     '#D4C9B0',
    overlayBg:    'rgba(247,242,232,0.95)',
  },

  // ── Motion timings
  motion: {
    enter:        '0.5s',
    slide:        '0.45s cubic-bezier(0.16, 1, 0.3, 1)',
    fade:         '0.35s ease',
    autoSlide:    5000,   // ms per slide in auto-present mode
  },
};
