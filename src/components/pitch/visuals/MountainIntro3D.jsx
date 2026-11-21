import React, { useEffect, useRef } from 'react';
import { useSlideEntered } from '../../../context/SlideTransitionContext.jsx';
import { clamp01, eo3, eoBack, hexToRgb, mix, css } from './MarketField3D.jsx';

// ─── Slide 1: the mountain the whole deck climbs ────────────────────────────────────
// A lit cube mountain builds itself on the stage, outside in, then Pippa's twin-engine plane
// flies in once and settles near the summit, her shadow gliding across the stage below.
// Slide 8 is the climb and slide 12 the summit, so the deck opens and closes on the same peak.
// Same engine as slides 5 to 7: rotate the plane, look down from an elevation, light from the upper left,
// one pre-blurred shadow layer, one clock (T). No text here: the slide copy sits beside it.

const LW = 640, LH = 400, Q = 2;
const THETA = (10 * Math.PI) / 180, ELEV = (34 * Math.PI) / 180;
const COS_T = Math.cos(THETA), SIN_T = Math.sin(THETA), SIN_E = Math.sin(ELEV), COS_E = Math.cos(ELEV);
export const INTRO_T_END = 7.2;

const LIGHT = (() => { const v = [-0.5, 0.42, 0.78], l = Math.hypot(...v); return v.map(x => x / l); })();
const shade = (nx, ny, nz) => { const l = Math.hypot(nx, ny, nz) || 1; return clamp01(0.12 + 1.05 * Math.max(0, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / l)); };
const rotN = (nx, ny) => [nx * COS_T - ny * SIN_T, nx * SIN_T + ny * COS_T];
const SH_TOP = shade(0, 0, 1), SH_S = shade(...rotN(0, 1), 0), SH_E = shade(...rotN(1, 0), 0);

const NX = 14, NY = 9, CXm = NX / 2, CYm = NY / 2, BASE = 0.25;
const PLAT = { x0: -1, x1: NX + 1, y0: -1, y1: NY + 1 };
const height = (x, y) => {
  const d = ((x - 6.2) ** 2) / 11 + ((y - 4) ** 2) / 5;
  const base = 6.2 * Math.exp(-d), ridge = 1.1 * Math.abs(Math.sin(x * 1.7 + y * 0.6)) * Math.exp(-d * 0.35);
  return Math.max(0, Math.round((base + ridge) * 2) / 2);
};
const CELLS = (() => {
  const out = []; let hmax = 0;
  for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) { const h = height(x, y); if (h > 0) { out.push({ x, y, h }); hmax = Math.max(hmax, h); } }
  out.sort((a, b) => (a.y - b.y) || (a.x - b.x));
  // outside in: low cubes first, tall last, a little spread by position so it feels grown, not stamped
  out.forEach(c => { c.d = 0.45 + (1 - c.h / hmax) * 2.0 + ((c.x * 7 + c.y * 13) % 10) * 0.02; });
  return out;
})();
const HMAX = Math.max(...CELLS.map(c => c.h));

const rot = (x, y) => [(x - CXm) * COS_T - (y - CYm) * SIN_T, (x - CXm) * SIN_T + (y - CYm) * COS_T];
let CAM = null;
function camera() {
  if (CAM) return CAM;
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  const add = (x, y, z) => { const [xr, yr] = rot(x, y); x0 = Math.min(x0, xr); x1 = Math.max(x1, xr); const sy = yr * SIN_E - z * COS_E; y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); };
  [[PLAT.x0, PLAT.y0], [PLAT.x1, PLAT.y0], [PLAT.x1, PLAT.y1], [PLAT.x0, PLAT.y1]].forEach(([x, y]) => add(x, y, 0));
  add(6, 4, BASE + HMAX + 3.2); // headroom for the plane
  const padX = 14, padY = 10, u = Math.min((LW - 2 * padX) / (x1 - x0), (LH - 2 * padY) / (y1 - y0));
  CAM = { u, ox: (LW - (x1 - x0) * u) / 2 - x0 * u, oy: (LH - (y1 - y0) * u) / 2 - y0 * u + 6 };
  return CAM;
}
const Pt = (x, y, z) => { const [xr, yr] = rot(x, y), c = camera(); return [c.ox + xr * c.u, c.oy + (yr * SIN_E - z * COS_E) * c.u]; };

function palette(theme) {
  const t = theme.colors;
  const bg = hexToRgb(t.bg, [250, 250, 247]), tx = hexToRgb(t.text, [20, 22, 28]), ac = hexToRgb(t.accent, [194, 65, 12]);
  return { bg, tx, ac, Wh: [255, 255, 255] };
}
const bandColour = (pal, h) => (h > 4.6 ? pal.Wh : h > 2.2 ? mix(pal.ac, pal.Wh, 0.1) : h > 0.9 ? mix(pal.ac, pal.tx, 0.35) : mix(pal.tx, pal.bg, 0.35));

let SHADOW = null, SHADOW_KEY = '';
function shadowLayer(pal, make) {
  const key = pal.bg.join() + pal.tx.join();
  if (SHADOW && SHADOW_KEY === key) return SHADOW;
  const cv = make(LW * Q, LH * Q); if (!cv) return null;
  const g = cv.getContext('2d'); g.scale(Q, Q);
  const OFF = 4000;
  g.shadowColor = css(mix(pal.tx, [0, 0, 0], 0.4), 0.4); g.shadowBlur = 20 * Q; g.shadowOffsetX = (OFF + 4) * Q; g.shadowOffsetY = 14 * Q;
  g.fillStyle = '#000'; g.beginPath();
  [[PLAT.x0, PLAT.y0], [PLAT.x1, PLAT.y0], [PLAT.x1, PLAT.y1], [PLAT.x0, PLAT.y1]].forEach(([x, y], i) => { const p = Pt(x, y, 0); i ? g.lineTo(p[0] - OFF, p[1]) : g.moveTo(p[0] - OFF, p[1]); });
  g.closePath(); g.fill();
  SHADOW = cv; SHADOW_KEY = key; return cv;
}
const makeBrowserCanvas = (w, h) => { if (typeof document === 'undefined') return null; const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

// Pippa's plane, side-on, twin engines. Drawn at the origin, facing right; the caller moves, tilts and scales it.
function drawPlane(ctx, pal) {
  const ink = css(mix(pal.tx, pal.bg, 0.2));
  ctx.fillStyle = css(pal.Wh); ctx.strokeStyle = ink; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, 0, 62, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-58, -2); ctx.lineTo(-84, -26); ctx.lineTo(-70, -26); ctx.lineTo(-44, -4); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = css(pal.ac); ctx.beginPath(); ctx.moveTo(-8, 2); ctx.lineTo(18, 26); ctx.lineTo(34, 26); ctx.lineTo(18, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = ink; [[0, 22], [0, 2]].forEach(([a, b]) => { ctx.beginPath(); ctx.ellipse(a + 2, b, 12, 5, 0, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = css(mix(pal.ac, pal.tx, 0.2)); ctx.beginPath(); ctx.ellipse(40, -3, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
}

export function drawIntroFrame(ctx, theme, T, make = makeBrowserCanvas) {
  const pal = palette(theme);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, LW * Q, LH * Q);
  const sh = shadowLayer(pal, make);
  if (sh) { ctx.globalAlpha = eo3(clamp01(T / 1.0)); ctx.drawImage(sh, 0, 0); ctx.globalAlpha = 1; }
  ctx.setTransform(Q, 0, 0, Q, 0, 0);
  const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };

  // the stage
  const stage = (z) => [[PLAT.x0, PLAT.y0], [PLAT.x1, PLAT.y0], [PLAT.x1, PLAT.y1], [PLAT.x0, PLAT.y1]].map(([x, y]) => Pt(x, y, z));
  ctx.globalAlpha = eo3(clamp01(T / 0.7));
  poly(stage(0), css(mix(pal.bg, pal.tx, 0.2)));
  poly(stage(BASE), css(mix(pal.bg, pal.tx, 0.04)));
  ctx.globalAlpha = 1;

  // the mountain: back to front, each cube grows from the stage
  CELLS.forEach(c => {
    const g = eoBack(clamp01((T - c.d) / 0.7)); if (g <= 0.01) return;
    const h = c.h * Math.min(1.04, g), z0 = BASE, z1 = BASE + h, { x, y } = c;
    const c0 = bandColour(pal, c.h), lit = mix(c0, pal.Wh, 0.18), dk = mix(c0, [0, 0, 0], 0.5);
    poly([Pt(x + 1, y, z0), Pt(x + 1, y + 1, z0), Pt(x + 1, y + 1, z1), Pt(x + 1, y, z1)], css(mix(dk, lit, SH_E)));
    poly([Pt(x, y + 1, z0), Pt(x + 1, y + 1, z0), Pt(x + 1, y + 1, z1), Pt(x, y + 1, z1)], css(mix(dk, lit, SH_S)));
    poly([Pt(x, y, z1), Pt(x + 1, y, z1), Pt(x + 1, y + 1, z1), Pt(x, y + 1, z1)], css(mix(dk, lit, SH_TOP)));
  });

  // Pippa: enters from the lower left, climbs in one arc and settles left of the summit; her shadow follows on the stage
  const f = eo3(clamp01((T - 3.3) / 3.2));
  if (f > 0) {
    const sx = -0.12 * LW, sy = 0.62 * LH, ex = 0.3 * LW, ey = 0.12 * LH, cx = 0.08 * LW, cy = 0.1 * LH;
    const bz = (p) => [(1 - p) * (1 - p) * sx + 2 * (1 - p) * p * cx + p * p * ex, (1 - p) * (1 - p) * sy + 2 * (1 - p) * p * cy + p * p * ey];
    const [px, py0] = bz(f), [qx, qy] = bz(Math.min(1, f + 0.02));
    const bob = Math.sin(clamp01((T - 6.4) / 0.8) * Math.PI) * 2.5 * (1 - clamp01((T - 6.4) / 0.8) * 0.0);
    const py = py0 + bob, ang = Math.atan2(qy - py0, qx - px) * 0.9 - 0.1 * f;
    // shadow on the stage: same x, on the stage plane in front of the mountain, softer and smaller when she is high
    const gp = Pt(CXm - 1.2, NY - 0.4, BASE), alt = clamp01((gp[1] - py) / 260);
    ctx.save(); ctx.globalAlpha = f; ctx.fillStyle = 'rgba(0,0,0,0.17)'; ctx.beginPath(); ctx.ellipse(px + 18, gp[1], 62 - alt * 18, 10 - alt * 3, 0.04, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.scale(1.0, 1.0); drawPlane(ctx, pal); ctx.restore();
  }
}

export function MountainIntro3D({ theme, size = 1 }) {
  const entered = useSlideEntered();
  const canvasRef = useRef(null);
  camera();
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    const frame = (T) => drawIntroFrame(ctx, theme, T);
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!entered) { frame(0); return undefined; }
    if (reduce) { frame(INTRO_T_END + 1); return undefined; }
    let raf, start = null;
    const tick = (ts) => { if (start === null) start = ts; const T = (ts - start) / 1000; frame(Math.min(T, INTRO_T_END + 1)); if (T < INTRO_T_END + 0.2) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [entered, theme]);
  return (
    <div style={{ width: '100%', maxWidth: `${540 * size}px`, margin: '0 auto' }}>
      <canvas ref={canvasRef} width={LW * Q} height={LH * Q} style={{ width: '100%', height: 'auto', display: 'block' }} />
    </div>
  );
}
