// ─── PITCH CONTROLS HOOK ──────────────────────────────────────────────────────
// Manages slide index, fullscreen, auto-play, and ElevenLabs audio sync.
// Audio is opt-in — set AUDIO_ENABLED = true in src/data/audio.js when ready.

import { useState, useEffect, useCallback, useRef } from 'react';
import { SLIDE_COUNT } from '../data/slides.js';
import { AUDIO_ENABLED, getAudioFile, getAudioDuration } from '../data/audio.js';

export function usePitchControls(defaultAutoSlideMs = 5000) {
  const [current, setCurrent]     = useState(0);
  const [isFullscreen, setFS]     = useState(false);
  const [isAutoPlay, setAutoPlay] = useState(false);
  const [direction, setDirection] = useState(1);
  const autoTimer  = useRef(null);
  const audioRef   = useRef(null);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    clearTimeout(autoTimer.current);
  }, []);

  const goTo = useCallback((index) => {
    setDirection(index >= current ? 1 : -1);
    setCurrent(Math.max(0, Math.min(SLIDE_COUNT - 1, index)));
  }, [current]);

  const next = useCallback(() => {
    setCurrent(c => {
      const n = c < SLIDE_COUNT - 1 ? c + 1 : 0; // loop in auto
      setDirection(1);
      return n;
    });
  }, []);

  const prev = useCallback(() => {
    if (current > 0) { setDirection(-1); setCurrent(c => c - 1); }
  }, [current]);

  const enterFullscreen = useCallback(() => setFS(true), []);
  const exitFullscreen  = useCallback(() => {
    setFS(false);
    setAutoPlay(false);
    cleanupAudio();
  }, [cleanupAudio]);

  const toggleAutoPlay = useCallback(() => setAutoPlay(a => !a), []);

  // Keyboard nav
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); prev(); }
      if (e.key === 'Escape') exitFullscreen();
      if (e.key === 'a' || e.key === 'A') toggleAutoPlay();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen, next, prev, exitFullscreen, toggleAutoPlay]);

  // Auto-play: audio-synced if AUDIO_ENABLED, timer-based otherwise
  useEffect(() => {
    if (!isAutoPlay || !isFullscreen) { cleanupAudio(); return; }

    if (AUDIO_ENABLED) {
      // Audio-driven: advance when audio ends
      const file = getAudioFile(current);
      if (file) {
        const audio = new Audio(file);
        audioRef.current = audio;
        audio.play().catch(console.error);
        audio.onended = () => next();
      } else {
        // File not yet available, fall back to timer
        autoTimer.current = setTimeout(next, getAudioDuration(current, defaultAutoSlideMs));
      }
    } else {
      // Pure timer mode — use per-slide duration or default
      autoTimer.current = setTimeout(next, getAudioDuration(current, defaultAutoSlideMs));
    }

    return cleanupAudio;
  }, [isAutoPlay, isFullscreen, current, next, cleanupAudio, defaultAutoSlideMs]);

  return {
    current, direction, isFullscreen, isAutoPlay,
    goTo, next, prev, enterFullscreen, exitFullscreen, toggleAutoPlay,
    isFirst:  current === 0,
    isLast:   current === SLIDE_COUNT - 1,
    progress: ((current + 1) / SLIDE_COUNT) * 100,
    audioEnabled: AUDIO_ENABLED,
  };
}
