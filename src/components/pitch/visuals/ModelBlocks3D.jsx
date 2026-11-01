import React, { useEffect, useRef } from 'react';
import { useSlideEntered } from '../../../context/SlideTransitionContext.jsx';
import { PLANS, FREE_PLAN, TRIAL, TRANSACTION_FEE } from '../../../data/facts.js';
import { clamp01, eo3, eoBack, hexToRgb, mix, css, hull } from './MarketField3D.jsx';

// ─── Business model slide: the plans as lit 3D blocks that rise in order ─────────────
// Same engine as the market slide: rotate the plane, look down from an elevation, light from the upper left.
// Block height is proportional to price. Starter is the accent colour (the most popular plan).
// One clock drives the blocks, the prices and the labels, so every number counts up once.

const LW = 640, LH = 440, Q = 2;
const THETA = (-16 * Math.PI) / 180, ELEV = (36 * Math.PI) / 180;
const COS_T = Math.cos(THETA), SIN_T = Math.sin(THETA), SIN_E = Math.sin(ELEV), COS_E = Math.cos(ELEV);
export const MODEL_T_END = 5.6;

const LIGHT = (() => { const v = [-0.5, 0.42, 0.78], l = Math.hypot(...v); return v.map(x => x / l); })();
const shade = (nx, ny, nz) => { const l = Math.hypot(nx, ny, nz) || 1; return clamp01(0.12 + 1.05 * Math.max(0, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / l)); };
const rotN = (nx, ny) => [nx * COS_T - ny * SIN_T, nx * SIN_T + ny * COS_T];
const SH_TOP = shade(0, 0, 1), SH_S = shade(...rotN(0, 1), 0), SH_W = shade(...rotN(-1, 0), 0), SH_E = shade(...rotN(1, 0), 0);

const num = (display) => parseFloat(String(display).replace(/[^0-9.]/g, '')) || 0;
const BLOCKS = [
  { id: 'free', name: FREE_PLAN.name, shown: 0, display: '$0', H: 0.7, d: 0.3, note: FREE_PLAN.note },
  { id: 'starter', name: 'Starter', shown: num(PLANS[0].display), display: PLANS[0].display, H: 3.2, d: 0.65, popular: true, note: 'Most popular' },
  { id: 'grow', name: 'Grow', shown: num(PLANS[1].display), display: PLANS[1].display, H: 5.3, d: 1.0, note: `${TRIAL.days}-day free trial` },
  { id: 'pro', name: 'Pro', shown: num(PLANS[2].display), display: PLANS[2].display, H: 9.6, d: 1.35, note: `${TRIAL.days}-day free trial` },
].map((b, i) => ({ ...b, x: i * 3.5, y: 0, w: 2.7 }));
const PLAT = { x0: -1.2, x1: 3 * 3.5 + 2.7 + 1.2, y0: -1.4, y1: 6.4, h: 0.35 };
const FEE = { x0: 0, x1: 3 * 3.5 + 2.7, y0: 3.8, y1: 4.9, h: 0.45, d: 3.3 };
const CX = (PLAT.x0 + PLAT.x1) / 2, CY = (PLAT.y0 + PLAT.y1) / 2;
const rot = (x, y) => [(x - CX) * COS_T - (y - CY) * SIN_T, (x - CX) * SIN_T + (y - CY) * COS_T];

let CAM = null;
function camera() {
  if (CAM) return CAM;
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  const add = (x, y, z) => { const [xr, yr] = rot(x, y); x0 = Math.min(x0, xr); x1 = Math.max(x1, xr); const sy = yr * SIN_E - z * COS_E; y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); };
  [[PLAT.x0, PLAT.y0], [PLAT.x1, PLAT.y0], [PLAT.x1, PLAT.y1], [PLAT.x0, PLAT.y1]].forEach(([x, y]) => add(x, y, 0));
  BLOCKS.forEach(b => { add(b.x, b.y, PLAT.h + b.H); add(b.x + b.w, b.y, PLAT.h + b.H); });
  y0 -= 4.2; // room above the tallest block for its label
  const padX = 18, padY = 16, u = Math.min((LW - 2 * padX) / (x1 - x0), (LH - 2 * padY) / (y1 - y0));
  const ox = (LW - (x1 - x0) * u) / 2 - x0 * u, oy = (LH - (y1 - y0) * u) / 2 - y0 * u + 10;
  CAM = { u, ox, oy };
  return CAM;
}
const SX = (xr) => camera().ox + xr * camera().u;
const SY = (yr, z) => camera().oy + (yr * SIN_E - z * COS_E) * camera().u;
const anchor = (b) => { const [xr, yr] = rot(b.x + b.w / 2, b.y + b.w / 2); return [SX(xr), SY(yr, PLAT.h + b.H)]; };

function palette(theme) {
  const t = theme.colors;
  const bg = hexToRgb(t.bg, [250, 250, 247]), tx = hexToRgb(t.text, [20, 22, 28]), ac = hexToRgb(t.accent, [194, 65, 12]);
  const W = [255, 255, 255], K = [0, 0, 0];
  return {
    bg, tx, ac,
    plat: { lit: mix(bg, tx, 0.03), dark: mix(bg, tx, 0.28) },
    block: { lit: mix(mix(bg, tx, 0.04), ac, 0.07), dark: mix(mix(bg, tx, 0.5), ac, 0.12) },
    star: { lit: mix(ac, W, 0.12), dark: mix(ac, K, 0.5) },
    fee: { lit: mix(ac, W, 0.5), dark: mix(ac, K, 0.2) },
  };
}

let SHADOW = null, SHADOW_KEY = '';
function shadowLayer(pal) {
  const key = pal.bg.join() + pal.tx.join();
  if (SHADOW && SHADOW_KEY === key) return SHADOW;
  if (typeof document === 'undefined') return null;
  const cv = document.createElement('canvas'); cv.width = LW * Q; cv.height = LH * Q;
  const g = cv.getContext('2d'); g.scale(Q, Q);
  const OFF = 4000;
  g.shadowColor = css(mix(pal.tx, [0, 0, 0], 0.4), 0.4); g.shadowBlur = 20 * Q; g.shadowOffsetX = (OFF + 4) * Q; g.shadowOffsetY = 16 * Q;
  g.fillStyle = '#000'; g.beginPath();
  [[PLAT.x0, PLAT.y0], [PLAT.x1, PLAT.y0], [PLAT.x1, PLAT.y1], [PLAT.x0, PLAT.y1]].forEach(([x, y], i) => { const [xr, yr] = rot(x, y); const X = SX(xr) - OFF, Y = SY(yr, 0); i ? g.lineTo(X, Y) : g.moveTo(X, Y); });
  g.closePath(); g.fill();
  SHADOW = cv; SHADOW_KEY = key; return cv;
}

export function drawModelFrame(ctx, theme, T) {
  const pal = palette(theme);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, LW * Q, LH * Q);
  const sh = shadowLayer(pal), sa = eo3(clamp01((T - 0.0) / 1.2));
  if (sh) { ctx.globalAlpha = sa; ctx.drawImage(sh, 0, 0); ctx.globalAlpha = 1; }
  ctx.setTransform(Q, 0, 0, Q, 0, 0);

  const poly = (pts, fill, stroke) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 0.7; ctx.stroke(); } };
  const P = (x, y, z) => { const [xr, yr] = rot(x, y); return [SX(xr), SY(yr, z)]; };
  const box = (x0, y0, x1, y1, z0, z1, pl) => {
    if (z1 - z0 <= 0.001) return;
    const c = (a, b, z) => P(a, b, z);
    const topC = css(mix(pl.dark, pl.lit, SH_TOP)), sC = css(mix(pl.dark, pl.lit, SH_S));
    if (SIN_T < 0) poly([c(x0, y0, z0), c(x0, y1, z0), c(x0, y1, z1), c(x0, y0, z1)], css(mix(pl.dark, pl.lit, SH_W)));
    else poly([c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1)], css(mix(pl.dark, pl.lit, SH_E)));
    poly([c(x0, y1, z0), c(x1, y1, z0), c(x1, y1, z1), c(x0, y1, z1)], sC);
    poly([c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1)], topC);
    ctx.beginPath(); ctx.moveTo(...c(x0, y1, z1)); ctx.lineTo(...c(x0, y0, z1)); ctx.lineTo(...c(x1, y0, z1));
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 0.8; ctx.stroke();
  };

  // the stage they stand on
  const pg = eo3(clamp01(T / 0.7));
  ctx.globalAlpha = pg; box(PLAT.x0, PLAT.y0, PLAT.x1, PLAT.y1, 0, PLAT.h, pal.plat); ctx.globalAlpha = 1;

  // cast shadows (light from the upper left, so shadows fall to the lower right), kept on the stage
  ctx.save(); ctx.beginPath();
  [[PLAT.x0, PLAT.y0], [PLAT.x1, PLAT.y0], [PLAT.x1, PLAT.y1], [PLAT.x0, PLAT.y1]].forEach(([x, y], i) => { const q = P(x, y, PLAT.h); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
  ctx.closePath(); ctx.clip();
  BLOCKS.forEach(b => {
    const g = eoBack(clamp01((T - b.d) / 1.0)); if (g <= 0.02) return;
    const H = b.H * Math.min(1, g), sd = [0.5, 0.45], L = H * 0.55;
    const pts = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.w], [b.x, b.y + b.w]];
    const all = [...pts.map(([x, y]) => P(x, y, PLAT.h)), ...pts.map(([x, y]) => P(x + sd[0] * L, y + sd[1] * L, PLAT.h))];
    poly(hull(all), css(mix(pal.tx, [0, 0, 0], 0.5), 0.2));
  });
  ctx.restore();

  // blocks, back to front (the tall Pro block is furthest from the camera)
  [...BLOCKS].reverse().forEach(b => {
    const g = eoBack(clamp01((T - b.d) / 1.0)); if (g <= 0) return;
    box(b.x, b.y, b.x + b.w, b.y + b.w, PLAT.h, PLAT.h + b.H * Math.max(0, g), b.popular ? pal.star : pal.block);
  });

  // the transaction-fee strip slides out in front
  const fg = eo3(clamp01((T - FEE.d) / 1.1));
  if (fg > 0) box(FEE.x0, FEE.y0, FEE.x0 + (FEE.x1 - FEE.x0) * fg, FEE.y1, PLAT.h, PLAT.h + FEE.h, pal.fee);
}

export function ModelBlocks3D({ theme, size = 1 }) {
  const t = theme.colors;
  const entered = useSlideEntered();
  const canvasRef = useRef(null);
  const ui = useRef({});
  const cam = camera();

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    const setUI = (T) => {
      const U = ui.current;
      BLOCKS.forEach(b => {
        const el = U['l' + b.id], n = U['n' + b.id]; if (!el || !n) return;
        const a = eo3(clamp01((T - (b.d + 0.55)) / 0.55));
        el.style.opacity = a; el.style.transform = `translate(-50%, calc(-100% - ${6 - a * 0}px)) translateY(${(1 - a) * 10}px)`;
        n.textContent = '$' + Math.round(b.shown * eo3(clamp01((T - (b.d + 0.4)) / 1.1)));
      });
      if (U.pop) { const a = eoBack(clamp01((T - 2.5) / 0.5)); U.pop.style.opacity = clamp01(a); U.pop.style.transform = `scale(${0.6 + 0.4 * Math.min(1, a)})`; }
      if (U.fee) { const a = eo3(clamp01((T - 3.9) / 0.7)); U.fee.style.opacity = a; U.fee.style.transform = `translate(-50%, 0) translateY(${(1 - a) * 6}px)`; }
    };
    const frame = (T) => { drawModelFrame(ctx, theme, T); setUI(T); };
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!entered) { frame(0); return undefined; }
    if (reduce) { frame(MODEL_T_END + 1); return undefined; }
    let raf, start = null;
    const tick = (ts) => { if (start === null) start = ts; const T = (ts - start) / 1000; frame(Math.min(T, MODEL_T_END + 1)); if (T < MODEL_T_END + 0.2) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [entered, theme]);

  const pct = (x, y) => ({ left: `${(x / LW) * 100}%`, top: `${(y / LH) * 100}%` });
  const feeAnchor = (() => { const [xr, yr] = rot((FEE.x0 + FEE.x1) / 2, FEE.y1); return [SX(xr), SY(yr, PLAT.h)]; })();
  return (
    <div style={{ width: '100%', maxWidth: `${500 * size}px`, margin: '0 auto', position: 'relative' }}>
      <canvas ref={canvasRef} width={LW * Q} height={LH * Q} style={{ width: '100%', height: 'auto', display: 'block' }} />
      {BLOCKS.map(b => {
        const [ax, ay] = anchor(b);
        return (
          <div key={b.id} ref={el => { ui.current['l' + b.id] = el; }}
            style={{ position: 'absolute', ...pct(ax, ay), textAlign: 'center', opacity: 0, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            {b.popular && (
              <div ref={el => { ui.current.pop = el; }} style={{ opacity: 0, display: 'inline-block', marginBottom: `${4 * size}px`, padding: `${2 * size}px ${7 * size}px`, borderRadius: '999px', background: t.accent, color: t.bg, fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Most popular</div>
            )}
            <div ref={el => { ui.current['n' + b.id] = el; }} style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${22 * size}px`, lineHeight: 1, color: b.popular ? t.accent : t.text }}>$0</div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textMuted, marginTop: `${3 * size}px` }}>{b.name}</div>
            {b.id !== 'starter' && <div style={{ fontFamily: theme.fonts.body, fontSize: `${7.5 * size}px`, color: t.textFaint, marginTop: `${1 * size}px` }}>{b.note}</div>}
          </div>
        );
      })}
      <div ref={el => { ui.current.fee = el; }} style={{ position: 'absolute', ...pct(feeAnchor[0], feeAnchor[1] + 6), opacity: 0, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMuted }}>
        Plus a {TRANSACTION_FEE} fee on every sale
      </div>
    </div>
  );
}
