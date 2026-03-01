# TheApp — Investor Pitch Site

A premium React + Vite pitch showcase for TheApp, featuring 4 fully independent design themes, a fullscreen cinematic pitch deck presenter with auto-play mode, interactive financial charts, and a complete readable business plan.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173/theapp-pitch/`

---

## GitHub Pages Deploy

### First-time setup

```bash
# 1. Create your repo on GitHub named: theapp-pitch
# 2. Clone it and copy all these files in
git init
git remote add origin https://github.com/YOUR_USERNAME/theapp-pitch.git

# 3. Install dependencies
npm install

# 4. Deploy
npm run deploy
```

This runs `vite build` then pushes the `/dist` folder to a `gh-pages` branch automatically.

Your site will be live at: `https://YOUR_USERNAME.github.io/theapp-pitch/`

### Subsequent deploys

```bash
npm run deploy
```

That's it. One command.

---

## Project Structure

```
src/
├── data/               ← All content. Theme-agnostic. Edit here.
│   ├── slides.js       ← 10 pitch deck slides
│   ├── plan.js         ← 10 business plan sections
│   ├── financials.js   ← Projections, unit economics, charts data
│   └── founder.js      ← Your name, bio, background ← FILL THIS IN
│
├── themes/             ← One folder per theme. Self-contained.
│   ├── index.js        ← Theme registry (add new themes here)
│   ├── manuscript/     ← A: Founder's Manuscript (warm ivory, editorial)
│   ├── brutalist/      ← C: Warm Brutalist (cream, terracotta, hard borders)
│   ├── editorial/      ← D: Dark Editorial (near-black, champagne gold)
│   └── canadian/       ← E: Canadian Print (white, black, red)
│
├── context/
│   └── ThemeContext.jsx ← Theme state, font injection, localStorage persist
│
├── hooks/
│   ├── usePitchControls.js  ← Slide nav, fullscreen, auto-play, keyboard
│   └── useScrollReveal.js   ← IntersectionObserver scroll animations
│
├── components/
│   ├── nav/            ← Nav bar with settings button
│   ├── settings/       ← Theme switcher dropdown (extensible)
│   └── pitch/
│       ├── SlideRenderer.jsx  ← 4 unique theme treatments per slide
│       └── PresentMode.jsx    ← Fullscreen presenter UI
│
└── pages/              ← One file per route. Thin composition only.
    ├── HomePage.jsx
    ├── AboutPage.jsx
    ├── PitchPage.jsx
    ├── PlanPage.jsx
    ├── FinancialsPage.jsx
    └── DownloadsPage.jsx
```

---

## Before You Present

1. **Fill in your name and bio** → `src/data/founder.js`
2. **Add PDF files** → `public/downloads/theapp-business-plan.pdf`, `theapp-pitch-deck.pdf`, `theapp-financials.pdf`
3. **Run deploy** → `npm run deploy`

---

## Pitch Presenter Controls

| Key | Action |
|-----|--------|
| `→` or `Space` | Next slide |
| `←` | Previous slide |
| `A` | Toggle auto-play |
| `ESC` | Exit fullscreen |

Auto-play timing is set per theme in `src/themes/[theme]/tokens.js` → `motion.autoSlide` (milliseconds).

---

## Adding a New Theme

1. Create `src/themes/yourtheme/tokens.js` (copy any existing tokens file as template)
2. Add to `src/themes/index.js` registry
3. Add a case to `SlideRenderer.jsx` for the new theme's unique slide design
4. Done — the nav settings dropdown picks it up automatically

---

## Phase 2 — Coming Later

- **ElevenLabs voice narration** → audio files per slide, synced to auto-play timer
- **Product tour overlay** → Shepherd.js or custom, for TheApp MVP onboarding demo
- **Auto-present with timed animations** → slide elements animate in sequence per slide

---

## docs/

`docs/aesthetic-explorer.jsx` — Interactive reference showing all theme aesthetics. Open as a React artifact to compare themes visually.
