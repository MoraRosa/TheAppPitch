// ─── PITCH CONTROLS HOOK ──────────────────────────────────────────────────────
// Manages slide index, fullscreen mode, auto-present mode.
// Used by PitchPage and PresentMode — single source of truth.

import { useState, useEffect, useCallback, useRef } from 'react';
import { SLIDE_COUNT } from '../data/slides.js';

export function usePitchControls(autoSlideMs = 5000) {
  const [current, setCurrent]       = useState(0);
  const [isFullscreen, setFullscreen] = useState(false);
  const [isAutoPlay, setAutoPlay]   = useState(false);
  const [direction, setDirection]   = useState(1); // 1 = forward, -1 = backward
  const autoTimer = useRef(null);

  const goTo = useCallback((index) => {
    setDirection(index >= current ? 1 : -1);
    setCurrent(Math.max(0, Math.min(SLIDE_COUNT - 1, index)));
  }, [current]);

  const next = useCallback(() => {
    if (current < SLIDE_COUNT - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    } else if (isAutoPlay) {
      // Loop back to start in auto mode
      setDirection(1);
      setCurrent(0);
    }
  }, [current, isAutoPlay]);

  const prev = useCallback(() => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(c => c - 1);
    }
  }, [current]);

  const enterFullscreen = useCallback(() => setFullscreen(true),  []);
  const exitFullscreen  = useCallback(() => {
    setFullscreen(false);
    setAutoPlay(false);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay(a => !a);
  }, []);

  // Keyboard navigation — active when fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        next();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      }
      if (e.key === 'Escape') exitFullscreen();
      if (e.key === 'a' || e.key === 'A') toggleAutoPlay();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen, next, prev, exitFullscreen, toggleAutoPlay]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay || !isFullscreen) {
      clearInterval(autoTimer.current);
      return;
    }
    autoTimer.current = setInterval(next, autoSlideMs);
    return () => clearInterval(autoTimer.current);
  }, [isAutoPlay, isFullscreen, next, autoSlideMs]);

  return {
    current,
    direction,
    isFullscreen,
    isAutoPlay,
    goTo,
    next,
    prev,
    enterFullscreen,
    exitFullscreen,
    toggleAutoPlay,
    isFirst: current === 0,
    isLast:  current === SLIDE_COUNT - 1,
    progress: ((current + 1) / SLIDE_COUNT) * 100,
  };
}
