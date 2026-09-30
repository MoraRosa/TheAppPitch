// ─── AUTO CURSOR ────────────────────────────────────────────────────────────────
// The soft accent dot from the "Fulfilled" step, made reusable: a fake cursor
// that glides to a real element inside a DeviceFrame, presses, and ripples.
// It is decoration only — the demo script performs the actual state change.
//
// Render it through DeviceFrame's `overlay` prop, hold a ref, then:
//   await cursorRef.current.moveTo(el, 800);   // glide to an element
//   await cursorRef.current.click();           // press + ripple
//   cursorRef.current.hide();                  // fade out
//
// X and Y ride on two nested layers with DIFFERENT easings, so the dot travels
// a gentle arc instead of a robotic straight line.

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

const AutoCursor = forwardRef(function AutoCursor({ theme, size = 1 }, ref) {
  const t = theme.colors;
  const boxRef = useRef(null);
  const shownRef = useRef(false);
  const [shown, setShown] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ripple, setRipple] = useState(0);
  const [m, setM] = useState({ x: 0, y: 0, ms: 0 });

  useImperativeHandle(ref, () => ({
    async moveTo(el, ms = 800) {
      const box = boxRef.current;
      if (!box || !el) return;
      const b = box.getBoundingClientRect();
      const e = el.getBoundingClientRect();
      const scale = b.width / box.offsetWidth || 1; // stays correct if the slide is CSS-scaled
      const tx = (e.left + e.width / 2 - b.left) / scale;
      const ty = (e.top + e.height * 0.55 - b.top) / scale;
      if (!shownRef.current) {
        // first appearance: start a short way off-target, then glide in
        setM({ x: tx + 70 * size, y: ty + 45 * size, ms: 0 });
        setShown(true);
        shownRef.current = true;
        await frames();
      }
      setM({ x: tx, y: ty, ms });
      await sleep(ms);
    },
    async click() {
      setPressed(true);
      setRipple((n) => n + 1);
      await sleep(140);
      setPressed(false);
      await sleep(220);
    },
    hide() {
      shownRef.current = false;
      setShown(false);
    },
  }));

  const d = 9 * size;
  return (
    <div ref={boxRef} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }}>
      <style>{`@keyframes acRipple{from{transform:translate(-50%,-50%) scale(.4);opacity:.55}to{transform:translate(-50%,-50%) scale(2.8);opacity:0}}`}</style>
      <div style={{
        position: 'absolute', top: 0, left: 0, opacity: shown ? 1 : 0,
        transform: `translateX(${m.x}px)`,
        transition: `${m.ms ? `transform ${m.ms}ms cubic-bezier(0.33,0,0.2,1), ` : ''}opacity 0.3s ease`,
      }}>
        <div style={{
          transform: `translateY(${m.y}px)`,
          transition: m.ms ? `transform ${m.ms}ms cubic-bezier(0.65,0,0.35,1)` : 'none',
        }}>
          {ripple > 0 && (
            <span key={ripple} style={{
              position: 'absolute', left: 0, top: 0, width: `${d * 2}px`, height: `${d * 2}px`, borderRadius: '50%',
              border: `${1.5 * size}px solid ${t.accent}`, animation: 'acRipple 0.6s ease-out forwards',
            }} />
          )}
          <div style={{
            position: 'absolute', left: `${-d / 2}px`, top: `${-d / 2}px`, width: `${d}px`, height: `${d}px`,
            borderRadius: '50%', background: t.accent, boxShadow: `0 0 0 ${4 * size}px ${t.accent}33`,
            transform: pressed ? 'scale(0.7)' : 'scale(1)', transition: 'transform 0.12s ease',
          }} />
        </div>
      </div>
    </div>
  );
});

export default AutoCursor;
