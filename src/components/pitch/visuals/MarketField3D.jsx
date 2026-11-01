import React, { useEffect, useRef } from 'react';
import { useSlideEntered } from '../../../context/SlideTransitionContext.jsx';
import { CANADA_GRID } from '../../../data/canadaGrid.js';
import { MARKET_FACTS, TARGET_INDUSTRIES_TOTAL, STAGE_TARGETS } from '../../../data/facts.js';

// ─── Market slide: a lit, true-3D field in the shape of Canada ──────────────────
// One tile is about 1,000 small employer businesses. The tiles rise from the ground in a wave,
// about half grow an accent riser (the industries Peak serves), then a mountain range lifts out
// of Alberta for the 4,000 Stage 3 goal. One clock drives the picture AND the numbers, so every
// number arrives with its own step and never restarts.
//
// Projection: rotate the plane about the vertical axis, then look down at it from an elevation angle.
//   screenX = xr,  screenY = yr * sin(E) - z * cos(E)
// Light comes from the upper left, so each face is shaded by how much it faces the light.

const LW = 640, LH = 470, Q = 2;          // logical canvas size, pixel ratio
const THETA = (-28 * Math.PI) / 180;       // rotation about the vertical axis
const ELEV = (42 * Math.PI) / 180;         // camera elevation above the plane
const COS_T = Math.cos(THETA), SIN_T = Math.sin(THETA), SIN_E = Math.sin(ELEV), COS_E = Math.cos(ELEV);
const GAP = 0.07, BASE_H = 0.55, RISER_H = 0.95; // tile gap, slab height, riser height (cell units)
export const MARKET_T_END = 8.2;           // seconds until everything has landed

const clamp01 = v => Math.max(0, Math.min(1, v));
const eo3 = p => 1 - Math.pow(1 - p, 3);
const eoBack = p => { const c = 1.35; const x = p - 1; return 1 + (c + 1) * x * x * x + c * x * x; };

function hexToRgb(c, fb) {
  if (typeof c === 'string') {
    const m = /^#?([0-9a-f]{6}|[0-9a-f]{3})/i.exec(c.trim());
    if (m) { let h = m[1]; if (h.length === 3) h = h.split('').map(x => x + x).join(''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  }
  return fb;
}
const mix = (a, b, p) => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];
const css = (a, al = 1) => `rgba(${Math.round(a[0])},${Math.round(a[1])},${Math.round(a[2])},${al})`;
function seeded(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// light direction in view space (upper left, in front, above)
const LIGHT = (() => { const v = [-0.5, 0.42, 0.78], l = Math.hypot(...v); return v.map(x => x / l); })();
const shade = (nx, ny, nz) => { const l = Math.hypot(nx, ny, nz) || 1; return clamp01(0.12 + 1.05 * Math.max(0, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / l)); };
const rotN = (nx, ny) => [nx * COS_T - ny * SIN_T, nx * SIN_T + ny * COS_T];
const SHADE_TOP = shade(0, 0, 1);
const SHADE_S = shade(...rotN(0, 1), 0), SHADE_W = shade(...rotN(-1, 0), 0), SHADE_E = shade(...rotN(1, 0), 0);

// The mountains (the 4,000 goal): offsets from the 2x2 block at Calgary, half base, height, delay
const PEAKS = [
  { dx: -2.2, dy: -1.1, hb: 2.1, H: 10.0, d: 5.30 },
  { dx: 0.6, dy: -1.3, hb: 2.5, H: 13.5, d: 5.50 },
  { dx: -1.0, dy: 1.2, hb: 1.9, H: 8.5, d: 5.70 },
  { dx: 2.6, dy: 0.9, hb: 2.2, H: 11.0, d: 5.90 },
];

let GEO = null;
function buildGeo() {
  if (GEO) return GEO;
  const { cols, rows, flat, peak } = CANADA_GRID;
  const cx = cols / 2, cy = rows / 2;
  const rot = (x, y) => [(x - cx) * COS_T - (y - cy) * SIN_T, (x - cx) * SIN_T + (y - cy) * COS_T];
  const cells = [];
  for (let i = 0; i < flat.length; i += 2) {
    const c = flat[i], r = flat[i + 1];
    const x0 = c + GAP, x1 = c + 1 - GAP, y0 = r + GAP, y1 = r + 1 - GAP;
    const P = [rot(x0, y0), rot(x1, y0), rot(x1, y1), rot(x0, y1)]; // xr, yr per corner
    const m = rot(c + 0.5, r + 0.5);
    cells.push({ c, r, P, xr: m[0], yr: m[1] });
  }
  const minX = Math.min(...cells.map(k => k.xr)), maxX = Math.max(...cells.map(k => k.xr));
  const rnd = seeded(11);
  const pool = cells.slice();
  for (let k = pool.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [pool[k], pool[j]] = [pool[j], pool[k]]; }
  const want = Math.round(cells.length * (TARGET_INDUSTRIES_TOTAL / MARKET_FACTS.canada.smallEmployers.value));
  cells.forEach(k => { const nx = (k.xr - minX) / (maxX - minX); k.d1 = 0.25 + nx * 1.7 + rnd() * 0.25; k.ind = false; });
  pool.slice(0, want).forEach((k, n) => { k.ind = true; const nx = (k.xr - minX) / (maxX - minX); k.d2 = 2.85 + nx * 0.8 + (n / want) * 0.9; });
  cells.sort((a, b) => a.yr - b.yr);

  const bc = rot(peak[0] + 1, peak[1] + 1); // centre of the 2x2 block at Calgary, rotated
  const peaks = PEAKS.map(p => {
    const px = peak[0] + 1 + p.dx, py = peak[1] + 1 + p.dy, hb = p.hb;
    const m = rot(px, py);
    return { ...p, px, py, yr: m[1],
      C: [rot(px - hb, py - hb), rot(px + hb, py - hb), rot(px + hb, py + hb), rot(px - hb, py + hb)], A: m };
  }).sort((a, b) => a.yr - b.yr);

  // bounds in screen units, including the tallest mountain
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  cells.forEach(k => k.P.forEach(([xr, yr]) => { x0 = Math.min(x0, xr); x1 = Math.max(x1, xr); y0 = Math.min(y0, yr * SIN_E - (BASE_H + RISER_H) * COS_E); y1 = Math.max(y1, yr * SIN_E); }));
  peaks.forEach(p => { y0 = Math.min(y0, p.A[1] * SIN_E - (BASE_H + p.H) * COS_E - 1.5); x0 = Math.min(x0, p.A[0] - p.hb); x1 = Math.max(x1, p.A[0] + p.hb); });
  const pad = 22, u = Math.min((LW - 2 * pad) / (x1 - x0), (LH - 2 * pad - 14) / (y1 - y0));
  const ox = (LW - (x1 - x0) * u) / 2 - x0 * u, oy = (LH - (y1 - y0) * u) / 2 - y0 * u + 6;
  GEO = { cells, peaks, u, ox, oy, shadowCanvas: null, shadowKey: '' };
  return GEO;
}

function palette(theme) {
  const t = theme.colors;
  const bg = hexToRgb(t.bg, [250, 250, 247]), tx = hexToRgb(t.text, [20, 22, 28]), ac = hexToRgb(t.accent, [194, 65, 12]);
  const W = [255, 255, 255], K = [0, 0, 0];
  return {
    bg, tx, ac,
    base: { lit: mix(bg, tx, 0.07), dark: mix(bg, tx, 0.46) },
    ind: { lit: mix(ac, W, 0.5), dark: mix(ac, K, 0.18) },
    peak: { lit: mix(ac, K, 0.04), dark: mix(ac, K, 0.7) },
    snow: [250, 250, 252],
  };
}

function shadowLayer(geo, pal) {
  const key = pal.bg.join() + pal.tx.join();
  if (geo.shadowCanvas && geo.shadowKey === key) return geo.shadowCanvas;
  if (typeof document === 'undefined') return null;
  const cv = document.createElement('canvas'); cv.width = LW * Q; cv.height = LH * Q;
  const g = cv.getContext('2d'); g.scale(Q, Q);
  const OFF = 4000; // draw the shapes far off-canvas and let only their blurred shadow land on it
  g.shadowColor = css(mix(pal.tx, [0, 0, 0], 0.4), 0.42); g.shadowBlur = 18 * Q; g.shadowOffsetX = (OFF + 5) * Q; g.shadowOffsetY = 15 * Q;
  g.fillStyle = '#000';
  g.beginPath();
  geo.cells.forEach(k => {
    k.P.forEach(([xr, yr], i) => { const X = geo.ox + xr * geo.u - OFF, Y = geo.oy + yr * SIN_E * geo.u; i ? g.lineTo(X, Y) : g.moveTo(X, Y); });
    g.closePath();
  });
  g.fill();
  geo.shadowCanvas = cv; geo.shadowKey = key;
  return cv;
}

function hull(pts) { // convex hull (monotone chain)
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  p.forEach(q => { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
  p.slice().reverse().forEach(q => { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); });
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

export function drawMarketFrame(ctx, theme, T) {
  const geo = buildGeo(), pal = palette(theme), { u, ox, oy } = geo;
  const SX = xr => ox + xr * u, SY = (yr, z) => oy + (yr * SIN_E - z * COS_E) * u;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, LW * Q, LH * Q);

  // soft shadow under the whole field
  const sh = shadowLayer(geo, pal), sa = eo3(clamp01((T - 0.2) / 1.6));
  if (sh && sa > 0) { ctx.globalAlpha = sa; ctx.drawImage(sh, 0, 0); ctx.globalAlpha = 1; }
  ctx.setTransform(Q, 0, 0, Q, 0, 0);

  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 0.6; ctx.stroke(); }
  };
  const cube = (k, z0, z1, pal2) => {
    const P = k.P;
    const g = (i, z) => [SX(P[i][0]), SY(P[i][1], z)];
    const top = css(mix(pal2.dark, pal2.lit, SHADE_TOP)), s = css(mix(pal2.dark, pal2.lit, SHADE_S));
    if (SIN_T < 0) poly([g(0, z0), g(3, z0), g(3, z1), g(0, z1)], css(mix(pal2.dark, pal2.lit, SHADE_W)));
    else poly([g(1, z0), g(2, z0), g(2, z1), g(1, z1)], css(mix(pal2.dark, pal2.lit, SHADE_E)));
    poly([g(3, z0), g(2, z0), g(2, z1), g(3, z1)], s);
    poly([g(0, z1), g(1, z1), g(2, z1), g(3, z1)], top);
    // bevel: a bright lip on the lit edges, like clay
    ctx.beginPath(); ctx.moveTo(...g(3, z1)); ctx.lineTo(...g(0, z1)); ctx.lineTo(...g(1, z1));
    ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 0.7; ctx.stroke();
  };

  geo.cells.forEach(k => {
    const g1 = eo3(clamp01((T - k.d1) / 0.75));
    if (g1 <= 0) return;
    ctx.globalAlpha = Math.min(1, g1 * 1.8);
    const h = BASE_H * g1;
    cube(k, 0, h, pal.base);
    if (k.ind) {
      const g2 = eoBack(clamp01((T - k.d2) / 0.85));
      if (g2 > 0) { ctx.globalAlpha = Math.min(1, g2 * 2); cube(k, BASE_H, BASE_H + RISER_H * Math.max(0, g2), pal.ind); }
    }
    ctx.globalAlpha = 1;
  });

  // cast shadows of the mountains (light from the upper left, so shadows fall to the lower right)
  geo.peaks.forEach(p => {
    const g = eo3(clamp01((T - p.d) / 1.6)); if (g <= 0) return;
    const H = p.H * g, sd = [0.55, 0.42];
    const ground = p.C.map(([xr, yr]) => [SX(xr), SY(yr, BASE_H)]);
    const ap = [SX(p.A[0] + sd[0] * H * 0.55), SY(p.A[1] + sd[1] * H * 0.55, BASE_H)];
    poly(hull([...ground, ap]), css(mix(pal.tx, [0, 0, 0], 0.5), 0.26 * g));
  });

  // the mountains
  geo.peaks.forEach(p => {
    const g = eo3(clamp01((T - p.d) / 1.6)); if (g <= 0) return;
    const H = p.H * g, hb = p.hb, zb = BASE_H;
    const apex = [SX(p.A[0]), SY(p.A[1], zb + H)];
    const corner = i => [SX(p.C[i][0]), SY(p.C[i][1], zb)];
    // visible faces: [outward normal in the plane, first corner, second corner]
    const defs = [
      { n: [0, 1], a: 3, b: 2 },
      { n: [-1, 0], a: 0, b: 3 },
      { n: [1, 0], a: 1, b: 2 },
    ];
    defs.forEach(f => {
      const [nxr, nyr] = rotN(f.n[0], f.n[1]);
      const nv = [nxr * H, nyr * H, hb];
      if (nyr * H * COS_E + hb * SIN_E <= 0) return; // faces away from the camera
      const sFac = shade(nv[0], nv[1], nv[2]);
      const col = mix(pal.peak.dark, pal.peak.lit, sFac);
      const A = corner(f.a), B = corner(f.b);
      poly([A, B, apex], css(col), css(mix(col, [255, 255, 255], 0.25), 0.5), 0.6);
      // snow cap
      const k = 0.3, lerp = (P, Q2) => [apex[0] + (P[0] - apex[0]) * k, apex[1] + (P[1] - apex[1]) * k];
      poly([apex, lerp(A, apex), lerp(B, apex)], css(mix(pal.snow, col, 0.18 + 0.4 * (1 - sFac))));
    });
  });

  // label above the tallest mountain
  const la = clamp01((T - 7.0) / 0.6);
  if (la > 0) {
    const tall = geo.peaks.reduce((a, b) => (b.H > a.H ? b : a));
    const X = SX(tall.A[0]), Y = SY(tall.A[1], BASE_H + tall.H) - 12;
    ctx.globalAlpha = la; ctx.textAlign = 'center'; ctx.font = `600 13px ${theme.fonts.body || 'sans-serif'}`;
    ctx.lineJoin = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = css(pal.bg); ctx.strokeText('Peak, Stage 3: 4,000', X, Y);
    ctx.fillStyle = css(pal.tx); ctx.fillText('Peak, Stage 3: 4,000', X, Y); ctx.globalAlpha = 1;
  }
}

export function MarketField3D({ theme, size = 1 }) {
  const t = theme.colors;
  const entered = useSlideEntered();
  const canvasRef = useRef(null);
  const ui = useRef({});
  const employerM = MARKET_FACTS.canada.smallEmployers.value / 1e6;
  const industriesK = Math.round(TARGET_INDUSTRIES_TOTAL / 1000);
  const stage3 = STAGE_TARGETS[STAGE_TARGETS.length - 1].payingUsers;

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    const setUI = (T) => {
      const U = ui.current; if (!U.n1) return;
      const row = (el, start) => { const a = eo3(clamp01((T - start) / 0.55)); el.style.opacity = a; el.style.transform = `translateY(${(1 - a) * 9}px)`; };
      row(U.r1, 0.3); row(U.r2, 2.85); row(U.r3, 5.3);
      U.n1.textContent = `${(employerM * eo3(clamp01((T - 0.35) / 1.7))).toFixed(2)}M`;
      U.n2.textContent = `${Math.round(industriesK * eo3(clamp01((T - 2.9) / 1.5)))}K`;
      U.n3.textContent = Math.round(stage3 * eo3(clamp01((T - 5.4) / 1.4))).toLocaleString();
      U.cap.style.opacity = eo3(clamp01((T - 1.8) / 0.8));
    };
    const frame = (T) => { drawMarketFrame(ctx, theme, T); setUI(T); };
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!entered) { frame(0); return undefined; }
    if (reduce) { frame(MARKET_T_END + 1); return undefined; }
    let raf, start = null;
    const tick = (ts) => {
      if (start === null) start = ts;
      const T = (ts - start) / 1000;
      frame(Math.min(T, MARKET_T_END + 1));
      if (T < MARKET_T_END + 0.2) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [entered, theme]);

  const rowStyle = { display: 'flex', alignItems: 'baseline', gap: `${8 * size}px`, width: '100%', opacity: 0 };
  const mkRow = (id, color, label) => (
    <div key={id} ref={el => { ui.current['r' + id] = el; }} style={rowStyle}>
      <span style={{ width: `${9 * size}px`, height: `${9 * size}px`, borderRadius: '50%', background: color, flexShrink: 0, alignSelf: 'center' }} />
      <span ref={el => { ui.current['n' + id] = el; }} style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${20 * size}px`, color: t.text, minWidth: `${74 * size}px` }}>0</span>
      <span style={{ fontFamily: theme.fonts.body, fontSize: `${9 * size}px`, color: t.textMuted }}>{label}</span>
    </div>
  );
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: `${6 * size}px` }}>
      <canvas ref={canvasRef} width={LW * Q} height={LH * Q} style={{ width: '100%', maxWidth: `${470 * size}px`, height: 'auto', display: 'block' }} />
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: `${5 * size}px` }}>
        {mkRow(1, t.textFaint, 'small employer businesses in Canada')}
        {mkRow(2, t.accent, 'in the industries Peak serves')}
        {mkRow(3, t.accent, 'Stage 3 goal: under 1% of them')}
      </div>
      <div ref={el => { ui.current.cap = el; }} style={{ opacity: 0, fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
        One tile is about 1,000 businesses · Plus {(MARKET_FACTS.canada.nonEmployers.value / 1e6).toFixed(2)}M with no employees, not shown
      </div>
    </div>
  );
}
