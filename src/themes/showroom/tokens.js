// ─── THEME F: SHOWROOM ─────────────────────────────────────────────────────────
// Product-marketing register, built for the demo deck. Cool paper base, one
// confident signal-red accent, rounded geometry (a deliberate contrast to the
// sharp/zero-radius investor themes), and a layout ratio that gives the
// interactive mockups more room than the copy — because this deck's job is to
// show the product, not argue for it.

export const SHOWROOM = {
  id: 'showroom',
  name: 'Showroom',
  isLight: true,

  colors: {
    bg:           '#F7F8FA',
    bgAlt:        '#EFF1F5',
    bgDeep:       '#12141C',
    surface:      '#FFFFFF',
    border:       '#E3E6EC',
    borderStrong: '#12141C',
    text:         '#12141C',
    textMuted:    '#565D6D',
    textFaint:    '#9AA1AF',
    accent:       '#FF4D3D',
    accentDark:   '#DB3521',
    accentLight:  '#FF8A7A',
    negative:     '#DB3521',
    positive:     '#1F9D6B',
  },

  fonts: {
    display:  "'Sora', sans-serif",
    body:     "'Inter', sans-serif",
    mono:     "'JetBrains Mono', monospace",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
  },

  type: {
    displaySize:    'clamp(30px, 4.2vw, 54px)',
    displayWeight:  800,
    displayStyle:   'normal',
    headSize:       'clamp(19px, 2.6vw, 32px)',
    headWeight:     700,
    headStyle:      'normal',
    subheadSize:    '16px',
    subheadWeight:  500,
    bodySize:       '15px',
    bodyWeight:     400,
    captionSize:    '11px',
    monoSize:       '10px',
    monoTracking:   '0.08em',
  },

  space: {
    navHeight:    '60px',
    pagePadding:  'clamp(20px, 4vw, 72px)',
    sectionGap:   '96px',
    radius:       '14px',
    radiusLg:     '20px',
  },

  slide: {
    bg:           '#F7F8FA',
    accentBar:    'linear-gradient(90deg, #FF4D3D, #FF8A7A)',
    eyebrowColor: '#FF4D3D',
    tagColor:     '#9AA1AF',
    overlayBg:    'rgba(247,248,250,0.97)',
    borderLeft:   'none',
  },

  motion: {
    enter:        '0.3s',
    slide:        '0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    fade:         '0.25s ease',
    autoSlide:    5000,
  },
};
