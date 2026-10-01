// ─── DEMO SCRIPT HELPERS ────────────────────────────────────────────────────────
// Small toolkit for the self-playing mockups (Welcome, Customer, ...). A demo
// is written as a readable async script:
//
//   await glide(frame, 'bottom', 3400, isLive);
//   await pointAndClick({ cursorRef, frameRef, selector: '[data-demo="x"]', isLive, onClick: () => ... });
//
// Every helper takes an `isLive()` check and bails out the moment it returns
// false — that's how a real click / wheel / slide change hands control back.

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// easeInOutSine — a long, soft start and stop. Reads as "someone scrolling",
// not "the browser jumped". (The native `behavior: 'smooth'` is a fixed ~0.4s
// regardless of distance, which is what made the old scrolls feel abrupt.)
const ease = (p) => -(Math.cos(Math.PI * p) - 1) / 2;

// Eased scroll of a container to `to` (px, or 'bottom') over `duration` ms.
export function glide(el, to, duration, isLive = () => true) {
  return new Promise((resolve) => {
    if (!el) return resolve();
    const max = Math.max(0, el.scrollHeight - el.clientHeight);
    const target = Math.max(0, Math.min(to === 'bottom' ? max : to, max));
    const from = el.scrollTop;
    const dist = target - from;
    if (Math.abs(dist) < 2) return resolve();
    const prevBehavior = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    const start = performance.now();
    const step = (now) => {
      if (!isLive()) { el.style.scrollBehavior = prevBehavior; return resolve(); }
      const p = Math.min(1, (now - start) / duration);
      el.scrollTop = from + dist * ease(p);
      if (p < 1) requestAnimationFrame(step);
      else { el.style.scrollBehavior = prevBehavior; resolve(); }
    };
    requestAnimationFrame(step);
  });
}

// Poll for an element (a view that was just switched may not have rendered yet).
export async function waitFor(root, selector, isLive = () => true, timeout = 2500) {
  const t0 = performance.now();
  while (isLive() && performance.now() - t0 < timeout) {
    const el = root?.querySelector(selector);
    if (el) return el;
    await sleep(50);
  }
  return null;
}

// Find the target, scroll it into view if needed, glide the cursor to it,
// press, then run `onClick` (a state setter — NOT a DOM click, so it doesn't
// trip the "real click cancels the demo" handlers). Resolves false if the demo
// was cancelled or the target never appeared.
export async function pointAndClick({ cursorRef, frameRef, selector, isLive, moveMs = 800, scroll = true, onClick }) {
  const frame = frameRef.current;
  const el = await waitFor(frame, selector, isLive);
  if (!el || !isLive()) return false;

  const fr = frame.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  if (scroll && (er.top < fr.top + 8 || er.bottom > fr.bottom - 8)) {
    await glide(frame, frame.scrollTop + (er.top - fr.top) - fr.height / 3, 900, isLive);
    if (!isLive()) return false;
  }

  await cursorRef.current?.moveTo(el, moveMs);
  if (!isLive()) return false;
  await cursorRef.current?.click();
  if (!isLive()) return false;
  onClick?.();
  return true;
}

// Type `text` one character at a time (with a little human jitter), calling
// onUpdate(partialText) after each keystroke. Resolves false if cancelled.
export async function typeText(text, isLive, onUpdate, cps = 20) {
  for (let i = 1; i <= text.length; i++) {
    if (!isLive()) return false;
    onUpdate(text.slice(0, i));
    const ch = text[i - 1];
    const pause = ch === ' ' ? 1.6 : ch === ',' || ch === '.' || ch === '!' || ch === '?' ? 3 : 1;
    await sleep((1000 / cps) * pause + ((i * 37) % 30));
  }
  return isLive();
}
