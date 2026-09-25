// ─── DECK AUDIO CONFIG ────────────────────────────────────────────────────────
// Narration is configured PER DECK. Adding audio to a deck = drop the MP3s in
// its folder and (optionally) list it here. No durations required: auto-play
// advances on the audio's real `ended` event. `fallbackMs` is only used when
// a clip is missing or fails to load, so a deck never gets stuck.
//
// Folder layout (files named slide-01.mp3 … slide-NN.mp3, in slide order):
//   public/downloads/audio/        → investor deck (existing)
//   public/downloads/audio/demo/   → product demo deck (drop files here)

export const AUDIO_ENABLED = true;

const BASE = import.meta.env.BASE_URL || './';

export const DECK_AUDIO = {
  investor: {
    dir: 'downloads/audio',
    // Existing clip lengths — used only as the timer fallback if a file fails.
    fallbackMs: [32000, 31000, 34000, 42000, 32000, 26000, 25000, 21000, 21000, 21000],
  },
  demo: {
    dir: 'downloads/audio/demo',
    fallbackMs: null, // uses each slide's `autoMs`, else the theme default
  },
};

export const deckHasAudio = (deckId) => AUDIO_ENABLED && !!DECK_AUDIO[deckId];

// URL of the narration clip for a slide (0-based index), or null.
export function getSlideAudioUrl(deckId, slideIndex) {
  const cfg = DECK_AUDIO[deckId];
  if (!AUDIO_ENABLED || !cfg) return null;
  const file = `slide-${String(slideIndex + 1).padStart(2, '0')}.mp3`;
  return `${BASE}${cfg.dir}/${file}`;
}

// Timer used when there is no audio (or the clip failed). Never falls back to
// another deck's durations.
export function getFallbackMs(deckId, slideIndex, defaultMs = 5000) {
  return DECK_AUDIO[deckId]?.fallbackMs?.[slideIndex] ?? defaultMs;
}
