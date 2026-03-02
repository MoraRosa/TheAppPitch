// ─── ELEVENLABS AUDIO CONFIG ─────────────────────────────────────────────────
// Drop your audio files into /public/audio/ and fill in the durations.
// Format: { slideId: number, file: string, duration: number (ms) }
//
// HOW TO USE:
// 1. Generate one MP3 per slide in ElevenLabs
// 2. Name them: slide-01.mp3, slide-02.mp3 ... slide-10.mp3
// 3. Drop into /public/audio/
// 4. Fill in each duration below (listen to each clip, note length in ms)
// 5. Set AUDIO_ENABLED = true
// Auto-play will advance each slide exactly when its audio ends.

export const AUDIO_ENABLED = false; // ← flip to true when files are ready

export const SLIDE_AUDIO = [
  { slideId: 1,  file: 'slide-01.mp3', duration: null }, // ← replace null with ms e.g. 14000
  { slideId: 2,  file: 'slide-02.mp3', duration: null },
  { slideId: 3,  file: 'slide-03.mp3', duration: null },
  { slideId: 4,  file: 'slide-04.mp3', duration: null },
  { slideId: 5,  file: 'slide-05.mp3', duration: null },
  { slideId: 6,  file: 'slide-06.mp3', duration: null },
  { slideId: 7,  file: 'slide-07.mp3', duration: null },
  { slideId: 8,  file: 'slide-08.mp3', duration: null },
  { slideId: 9,  file: 'slide-09.mp3', duration: null },
  { slideId: 10, file: 'slide-10.mp3', duration: null },
];

// Returns duration for a given slide index (0-based), falls back to defaultMs
export function getAudioDuration(slideIndex, defaultMs = 5000) {
  const entry = SLIDE_AUDIO[slideIndex];
  return entry?.duration ?? defaultMs;
}

export function getAudioFile(slideIndex) {
  const entry = SLIDE_AUDIO[slideIndex];
  if (!entry || !AUDIO_ENABLED) return null;
  return `/TheAppPitch/audio/${entry.file}`;
}
