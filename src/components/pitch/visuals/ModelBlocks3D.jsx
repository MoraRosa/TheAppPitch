import React, { useEffect, useRef } from 'react';
import { useSlideEntered } from '../../../context/SlideTransitionContext.jsx';
import { PLANS, FREE_PLAN, TRIAL, STAGE_TARGETS, TRACTION_FACTS, ARPU_TODAY, ARPU_MIX } from '../../../data/facts.js';
import { clamp01, eo3, eoBack, hexToRgb, mix, css, hull } from './MarketField3D.jsx';

// ─── Business model slide ───────────────────────────────────────────────────────────
// Top: the plans as simple cards. Below: the growth stages as lit 3D columns.
// Each column carries its own data. The paying-merchant count is embossed (raised) on the top face,
// the stage label and the monthly revenue are debossed (carved in) on the front face.
// Same engine as the market slide: rotate the plane, look down from an elevation, light from the upper left,
// one pre-blurred shadow layer, and ONE clock (T) that drives the columns, the numbers and the cards.
// NOW is measured. S1 to S3 are modelled (revenue at the $30 to $43 per merchant range in facts.js).

const LW = 640, LH = 392, Q = 2;
const THETA = (10 * Math.PI) / 180, ELEV = (36 * Math.PI) / 180; // right side forward, gentle angle
const COS_T = Math.cos(THETA), SIN_T = Math.sin(THETA), SIN_E = Math.sin(ELEV), COS_E = Math.cos(ELEV);
export const MODEL_T_END = 7.2;

const LIGHT = (() => { const v = [-0.5, 0.42, 0.78], l = Math.hypot(...v); return v.map(x => x / l); })();
const shade = (nx, ny, nz) => { const l = Math.hypot(nx, ny, nz) || 1; return clamp01(0.12 + 1.05 * Math.max(0, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / l)); };
const rotN = (nx, ny) => [nx * COS_T - ny * SIN_T, nx * SIN_T + ny * COS_T];
const SH_TOP = shade(0, 0, 1), SH_S = shade(...rotN(0, 1), 0), SH_E = shade(...rotN(1, 0), 0), SH_W = shade(...rotN(-1, 0), 0);

const W = 2.9, DEP = 2.3, GAP = 0.55;
// Heights are a staged ladder, not to scale (the numbers carry the scale).
const COLS = [
  { id: 'now', tag: 'NOW', count: TRACTION_FACTS.paidUsers, lo: TRACTION_FACTS.mrr, hi: null, H: 2.2, d: 1.5, now: true },
  { id: 's1', tag: 'S1', count: STAGE_TARGETS[0].payingUsers, H: 3.8, d: 2.7 },
  { id: 's2', tag: 'S2', count: STAGE_TARGETS[1].payingUsers, H: 6.0, d: 3.9 },
  { id: 's3', tag: 'S3', count: STAGE_TARGETS[2].payingUsers, H: 8.3, d: 5.1 },
].map((c, i) => ({
  ...c, x: i * (W + GAP), y: 0, w: W, dep: DEP,
  lo: c.lo ?? c.count * ARPU_TODAY, hi: c.now ? null : c.count * ARPU_MIX,
}));
const PLAT = { x0: -1.0, x1: 3 * (W + GAP) + W + 1.0, y0: -1.0, y1: DEP + 1.0, h: 0.3 };
const CX = (PLAT.x0 + PLAT.x1) / 2, CY = (PLAT.y0 + PLAT.y1) / 2;
const rot = (x, y) => [(x - CX) * COS_T - (y - CY) * SIN_T, (x - CX) * SIN_T + (y - CY) * COS_T];

let CAM = null;
function camera() {
  if (CAM) return CAM;
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  const add = (x, y, z) => { const [xr, yr] = rot(x, y); x0 = Math.min(x0, xr); x1 = Math.max(x1, xr); const sy = yr * SIN_E - z * COS_E; y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); };
  [[PLAT.x0, PLAT.y0], [PLAT.x1, PLAT.y0], [PLAT.x1, PLAT.y1], [PLAT.x0, PLAT.y1]].forEach(([x, y]) => add(x, y, 0));
  COLS.forEach(c => { add(c.x, c.y, PLAT.h + c.H); add(c.x + c.w, c.y + c.dep, PLAT.h + c.H); });
  y0 -= 0.9; // room above for the "we are here" tag
  const padX = 14, padY = 10, u = Math.min((LW - 2 * padX) / (x1 - x0), (LH - 2 * padY) / (y1 - y0));
  const ox = (LW - (x1 - x0) * u) / 2 - x0 * u, oy = (LH - (y1 - y0) * u) / 2 - y0 * u + 4;
  CAM = { u, ox, oy };
  return CAM;
}
const SX = (xr) => camera().ox + xr * camera().u;
const SY = (yr, z) => camera().oy + (yr * SIN_E - z * COS_E) * camera().u;
const Pt = (x, y, z) => { const [xr, yr] = rot(x, y); return [SX(xr), SY(yr, z)]; };

function palette(theme) {
  const t = theme.colors;
  const bg = hexToRgb(t.bg, [250, 250, 247]), tx = hexToRgb(t.text, [20, 22, 28]), ac = hexToRgb(t.accent, [194, 65, 12]);
  const Wh = [255, 255, 255], K = [0, 0, 0];
  return {
    bg, tx, ac, Wh,
    plat: { lit: mix(bg, tx, 0.03), dark: mix(bg, tx, 0.28) },
    block: { lit: mix(mix(bg, tx, 0.03), ac, 0.05), dark: mix(mix(bg, tx, 0.45), ac, 0.1) },
    star: { lit: mix(ac, Wh, 0.12), dark: mix(ac, K, 0.5) },
  };
}

let SHADOW = null, SHADOW_KEY = '';
function shadowLayer(pal, make) {
  const key = pal.bg.join() + pal.tx.join();
  if (SHADOW && SHADOW_KEY === key) return SHADOW;
  const cv = make(LW * Q, LH * Q); if (!cv) return null;
  const g = cv.getContext('2d'); g.scale(Q, Q);
  const OFF = 4000;
  g.shadowColor = css(mix(pal.tx, [0, 0, 0], 0.4), 0.4); g.shadowBlur = 20 * Q; g.shadowOffsetX = (OFF + 4) * Q; g.shadowOffsetY = 14 * Q;
  g.fillStyle = '#000'; g.beginPath();
  [[PLAT.x0, PLAT.y0], [PLAT.x1, PLAT.y0], [PLAT.x1, PLAT.y1], [PLAT.x0, PLAT.y1]].forEach(([x, y], i) => { const [xr, yr] = rot(x, y); const X = SX(xr) - OFF, Y = SY(yr, 0); i ? g.lineTo(X, Y) : g.moveTo(X, Y); });
  g.closePath(); g.fill();
  SHADOW = cv; SHADOW_KEY = key; return cv;
}
const makeBrowserCanvas = (w, h) => { if (typeof document === 'undefined') return null; const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

const kfmt = (v) => { const k = v / 1000; return k < 10 ? k.toFixed(1) : String(Math.round(k)); };
export const revenueText = (c, p) => (c.hi == null ? `$${Math.round(c.lo * p)}` : `$${kfmt(c.lo * p)}-${kfmt(c.hi * p)}K`);
const countText = (c, p) => Math.round(c.count * p).toLocaleString('en-US');

// `make` lets tests supply a node-canvas factory for the shadow layer.
export function drawModelFrame(ctx, theme, T, make = makeBrowserCanvas) {
  const pal = palette(theme), U = camera().u;
  const dispFont = (px) => `${theme.type.displayWeight} ${px}px ${theme.fonts.display}`;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, LW * Q, LH * Q);
  const sh = shadowLayer(pal, make), sa = eo3(clamp01(T / 1.2));
  if (sh) { ctx.globalAlpha = sa; ctx.drawImage(sh, 0, 0); ctx.globalAlpha = 1; }
  ctx.setTransform(Q, 0, 0, Q, 0, 0);

  const poly = (pts, fill, stroke) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 0.7; ctx.stroke(); } };
  const box = (x0, y0, x1, y1, z0, z1, pl) => {
    if (z1 - z0 <= 0.001) return;
    const c = (a, b, z) => Pt(a, b, z);
    if (SIN_T < 0) poly([c(x0, y0, z0), c(x0, y1, z0), c(x0, y1, z1), c(x0, y0, z1)], css(mix(pl.dark, pl.lit, SH_W)));
    else poly([c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1)], css(mix(pl.dark, pl.lit, SH_E)));
    poly([c(x0, y1, z0), c(x1, y1, z0), c(x1, y1, z1), c(x0, y1, z1)], css(mix(pl.dark, pl.lit, SH_S)));
    poly([c(x0, y0, z1), c(x1, y0, z1), c(x1, y1, z1), c(x0, y1, z1)], css(mix(pl.dark, pl.lit, SH_TOP)));
    ctx.beginPath(); ctx.moveTo(...c(x0, y1, z1)); ctx.lineTo(...c(x0, y0, z1)); ctx.lineTo(...c(x1, y0, z1));
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 0.8; ctx.stroke();
  };
  // affine maps that lay text flat on a face (local units are screen-sized pixels of the unfolded face)
  const topM = (c, z) => { const o = Pt(c.x, c.y, z), a = Pt(c.x + c.w, c.y, z), b = Pt(c.x, c.y + c.dep, z), pw = c.w * U, ph = c.dep * U; return [(a[0] - o[0]) / pw, (a[1] - o[1]) / pw, (b[0] - o[0]) / ph, (b[1] - o[1]) / ph, o[0], o[1]]; };
  const frontM = (c, zt, zb) => { const yy = c.y + c.dep, o = Pt(c.x, yy, zt), a = Pt(c.x + c.w, yy, zt), b = Pt(c.x, yy, zb), pw = c.w * U, ph = (zt - zb) * U; return [(a[0] - o[0]) / pw, (a[1] - o[1]) / pw, (b[0] - o[0]) / ph, (b[1] - o[1]) / ph, o[0], o[1]]; };

  // the stage they stand on
  const pg = eo3(clamp01(T / 0.7));
  ctx.globalAlpha = pg; box(PLAT.x0, PLAT.y0, PLAT.x1, PLAT.y1, 0, PLAT.h, pal.plat); ctx.globalAlpha = 1;

  // cast shadows: light from the upper left, shadows fall to the lower right, kept on the stage
  ctx.save(); ctx.beginPath();
  [[PLAT.x0, PLAT.y0], [PLAT.x1, PLAT.y0], [PLAT.x1, PLAT.y1], [PLAT.x0, PLAT.y1]].forEach(([x, y], i) => { const q = Pt(x, y, PLAT.h); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
  ctx.closePath(); ctx.clip();
  COLS.forEach(c => {
    const g = eoBack(clamp01((T - c.d) / 1.0)); if (g <= 0.02) return;
    const H = c.H * Math.min(1, g), sd = [0.3, -0.5], L = H * 0.5;
    const pts = [[c.x, c.y], [c.x + c.w, c.y], [c.x + c.w, c.y + c.dep], [c.x, c.y + c.dep]];
    const all = [...pts.map(([x, y]) => Pt(x, y, PLAT.h)), ...pts.map(([x, y]) => Pt(x + sd[0] * L, y + sd[1] * L, PLAT.h))];
    poly(hull(all), css(mix(pal.tx, [0, 0, 0], 0.5), 0.2));
  });
  ctx.restore();

  // columns, left to right (the right side is nearer the camera)
  COLS.forEach(c => {
    const g = eoBack(clamp01((T - c.d) / 1.0)); if (g <= 0) return;
    const H = c.H * Math.max(0, g), zt = PLAT.h + H, pl = c.now ? pal.star : pal.block;
    box(c.x, c.y, c.x + c.w, c.y + c.dep, PLAT.h, zt, pl);
    if (H < 0.9) return;

    const pCount = eo3(clamp01((T - (c.d + 0.35)) / 1.1));
    const aTop = eo3(clamp01((T - (c.d + 0.45)) / 0.45));
    const aFront = eo3(clamp01((T - (c.d + 0.8)) / 0.5));

    // front face: stage label and revenue, carved in (debossed)
    if (aFront > 0) {
      const base = mix(pl.dark, pl.lit, SH_S);
      const dark = css(mix(base, [0, 0, 0], 0.5)), light = css(mix(base, pal.Wh, 0.6), 0.9);
      ctx.save(); ctx.transform(...frontM(c, zt, PLAT.h)); ctx.globalAlpha = aFront;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const cx = (c.w * U) / 2;
      const carve = (txt, font, y) => { ctx.font = font; ctx.fillStyle = light; ctx.fillText(txt, cx + 0.9, y + 0.9); ctx.fillStyle = dark; ctx.fillText(txt, cx, y); };
      carve(c.tag, dispFont(c.now ? 24 : 26), 24);
      carve(revenueText(c, pCount), dispFont(14), 54);
      ctx.restore();
    }

    // top face: the merchant count, raised (embossed), built from a few thin extruded layers
    if (aTop > 0) {
      const topFace = mix(pl.dark, pl.lit, SH_TOP), side = mix(pl.dark, pl.lit, SH_E);
      const txt = countText(c, pCount), pw = c.w * U, ph = c.dep * U;
      const layers = 3, lift = 0.012;
      ctx.save(); ctx.globalAlpha = aTop; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      let size = txt.length <= 3 ? 46 : 40;
      ctx.save(); ctx.transform(...topM(c, zt)); ctx.font = dispFont(size); const mw = ctx.measureText(txt).width; ctx.restore();
      if (mw > pw * 0.88) size = Math.floor(size * (pw * 0.88) / mw);
      for (let i = 0; i <= layers; i++) {
        ctx.save(); ctx.transform(...topM(c, zt + i * lift));
        ctx.font = dispFont(size);
        if (i === 0) { ctx.fillStyle = css(mix(topFace, [0, 0, 0], 0.55), 0.35); ctx.fillText(txt, pw / 2 + 1.6, ph / 2 + 1.8); }
        ctx.fillStyle = i < layers ? css(mix(side, [0, 0, 0], 0.45)) : css(mix(topFace, [0, 0, 0], 0.2));
        ctx.fillText(txt, pw / 2, ph / 2);
        if (i === layers) { ctx.lineWidth = 0.8; ctx.strokeStyle = css(mix(topFace, pal.Wh, 0.95), 0.9); ctx.strokeText(txt, pw / 2 - 0.6, ph / 2 - 0.6); }
        ctx.restore();
      }
      ctx.restore();
    }
  });
}

const planCards = [
  { id: 'free', name: FREE_PLAN.name, shown: 0, display: '$0', note: FREE_PLAN.note },
  ...PLANS.map(p => ({ id: p.id, name: p.name, display: p.display, shown: parseFloat(p.display.replace(/[^0-9.]/g, '')), note: TRIAL.plans.includes(p.name) ? `${TRIAL.days}-day trial` : '', popular: p.id === 'starter' })),
];

export function ModelBlocks3D({ theme, size = 1 }) {
  const t = theme.colors;
  const entered = useSlideEntered();
  const canvasRef = useRef(null);
  const ui = useRef({});
  camera();

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    const setUI = (T) => {
      const U = ui.current;
      planCards.forEach((p, i) => {
        const el = U['c' + p.id], n = U['n' + p.id]; if (!el || !n) return;
        const a = eo3(clamp01((T - (0.15 + i * 0.22)) / 0.6));
        el.style.opacity = a; el.style.transform = `translateY(${(1 - a) * 10}px)`;
        n.textContent = '$' + Math.round(p.shown * eo3(clamp01((T - (0.3 + i * 0.22)) / 0.8)));
      });
      if (U.pop) { const a = eoBack(clamp01((T - 1.2) / 0.5)); U.pop.style.opacity = clamp01(a); U.pop.style.transform = `translate(-50%, 0) scale(${0.6 + 0.4 * Math.min(1, a)})`; }
      if (U.here) { const a = eo3(clamp01((T - 3.0) / 0.6)); U.here.style.opacity = a; U.here.style.transform = `translate(-50%, calc(-100% + ${(1 - a) * -8}px))`; }
      if (U.cap) { const a = eo3(clamp01((T - 6.3) / 0.7)); U.cap.style.opacity = a; }
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
  const now = COLS[0];
  const [hx, hy] = Pt(now.x + now.w / 2, now.y, PLAT.h + now.H);
  const mono = { fontFamily: theme.fonts.mono, textTransform: 'uppercase' };
  return (
    <div style={{ width: '100%', maxWidth: `${500 * size}px`, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: `${8 * size}px` }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: `${6 * size}px`, paddingTop: `${8 * size}px` }}>
        {planCards.map(p => (
          <div key={p.id} ref={el => { ui.current['c' + p.id] = el; }}
            style={{ position: 'relative', opacity: 0, textAlign: 'center', padding: `${9 * size}px ${4 * size}px ${7 * size}px`, background: t.bg, border: `1px solid ${p.popular ? t.accent : t.border}`, borderRadius: theme.space.radius || '2px', boxShadow: p.popular ? `0 ${4 * size}px ${14 * size}px ${t.accent}22` : 'none' }}>
            {p.popular && (
              <div ref={el => { ui.current.pop = el; }} style={{ ...mono, position: 'absolute', top: `${-7 * size}px`, left: '50%', opacity: 0, whiteSpace: 'nowrap', padding: `${2 * size}px ${6 * size}px`, borderRadius: '999px', background: t.accent, color: t.bg, fontSize: `${6.5 * size}px`, letterSpacing: '0.1em' }}>Most popular</div>
            )}
            <div style={{ ...mono, fontSize: `${7.5 * size}px`, letterSpacing: '0.1em', color: t.textMuted }}>{p.name}</div>
            <div style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${21 * size}px`, lineHeight: 1.1, color: p.popular ? t.accent : t.text, marginTop: `${3 * size}px` }}>
              <span ref={el => { ui.current['n' + p.id] = el; }}>$0</span>
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontSize: `${7.5 * size}px`, color: t.textFaint, marginTop: `${2 * size}px`, minHeight: `${10 * size}px` }}>{p.note || '\u00a0'}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <canvas ref={canvasRef} width={LW * Q} height={LH * Q} style={{ width: '100%', height: 'auto', display: 'block' }} />
        <div ref={el => { ui.current.here = el; }} style={{ ...mono, position: 'absolute', ...pct(hx, hy - 6), opacity: 0, whiteSpace: 'nowrap', fontSize: `${7 * size}px`, letterSpacing: '0.1em', color: t.accent, textAlign: 'center', pointerEvents: 'none' }}>
          We are here
          <div style={{ width: 0, height: 0, margin: `${2 * size}px auto 0`, borderLeft: `${4 * size}px solid transparent`, borderRight: `${4 * size}px solid transparent`, borderTop: `${5 * size}px solid ${t.accent}` }} />
        </div>
      </div>
      <div ref={el => { ui.current.cap = el; }} style={{ ...mono, opacity: 0, textAlign: 'center', fontSize: `${7.5 * size}px`, letterSpacing: '0.08em', color: t.textMuted }}>
        S1 to S3 modelled at ${ARPU_TODAY} to ${ARPU_MIX} per merchant
      </div>
    </div>
  );
}
