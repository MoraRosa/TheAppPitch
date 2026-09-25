// ─── PITCH CONTROLS HOOK ──────────────────────────────────────────────────────
// Manages slide index, fullscreen, auto-play, and ElevenLabs audio sync.
// Audio is configured per deck in data/audio.js (DECK_AUDIO). A deck with a
// config tries its narration clip for each slide and advances on the clip's
// real `ended` event; if a clip is missing or fails, that slide falls back to a
// timer so auto-play never stalls. Decks with no config use plain timers.

import { useState, useEffect, useCallback, useRef } from 'react';
import { deckHasAudio, getSlideAudioUrl, getFallbackMs } from '../data/audio.js';

export function usePitchControls(slideCount, { deckId, defaultAutoSlideMs = 5000, slideMs } = {}) {
  const SLIDE_COUNT = slideCount;
  const audioActive = deckHasAudio(deckId);
  // Latest per-slide timer overrides without making them an effect dependency.
  const slideMsRef = useRef(slideMs);
  slideMsRef.current = slideMs;
  const [current, setCurrent]     = useState(0);
  const [isFullscreen, setFS]     = useState(false);
  const [isAutoPlay, setAutoPlay] = useState(false);
  const [direction, setDirection] = useState(1);
  const [barsHidden, setBarsHidden] = useState(false);
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

  const togglePresentBars = useCallback(() => setBarsHidden(h => !h), []);

  const toggleAutoPlay = useCallback(() => setAutoPlay(a => {
    const turningOn = !a;
    if (turningOn) setBarsHidden(true); // starting autoplay means you're presenting now
    return turningOn;
  }), []);

  // Keyboard nav
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); prev(); }
      if (e.key === 'Escape') exitFullscreen();
      if (e.key === 'a' || e.key === 'A') toggleAutoPlay();
      if (e.key === 'p' || e.key === 'P') togglePresentBars();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen, next, prev, exitFullscreen, toggleAutoPlay, togglePresentBars]);

  // Auto-play: narration-driven when the deck has audio, timer otherwise.
  useEffect(() => {
    if (!isAutoPlay || !isFullscreen) { cleanupAudio(); return; }

    const fallbackMs =
      slideMsRef.current?.[current] ??
      getFallbackMs(deckId, current, defaultAutoSlideMs);
    const url = audioActive ? getSlideAudioUrl(deckId, current) : null;

    if (!url) {
      autoTimer.current = setTimeout(next, fallbackMs);
      return cleanupAudio;
    }

    let finished = false; // guards late events fired while tearing down
    const advance = () => { if (!finished) { finished = true; next(); } };
    const useTimer = () => {
      if (finished) return;
      clearTimeout(autoTimer.current);
      autoTimer.current = setTimeout(advance, fallbackMs);
    };

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.addEventListener('ended', advance);
    audio.addEventListener('error', useTimer); // missing / undecodable clip
    audio.play().catch(useTimer);              // autoplay blocked, etc.

    return () => { finished = true; cleanupAudio(); };
  }, [isAutoPlay, isFullscreen, current, next, cleanupAudio, defaultAutoSlideMs, audioActive, deckId]);

  return {
    current, direction, isFullscreen, isAutoPlay, barsHidden,
    goTo, next, prev, enterFullscreen, exitFullscreen, toggleAutoPlay, togglePresentBars,
    isFirst:  current === 0,
    isLast:   current === SLIDE_COUNT - 1,
    progress: SLIDE_COUNT ? ((current + 1) / SLIDE_COUNT) * 100 : 0,
    audioEnabled: audioActive,
  };
}
