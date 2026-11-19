import React, { useEffect, useRef } from 'react';
import { useSlideEntered } from '../../../context/SlideTransitionContext.jsx';
import { LIVE_SITES, PRODUCT, TRACTION_FACTS } from '../../../data/facts.js';
import { clamp01, eo3, eoBack, hexToRgb, mix, css, hull } from './MarketField3D.jsx';

// ─── Traction slide: the live sites stand up as lit frames, three counters rise in front ─────────
// Same engine and language as slides 5 and 6: rotate the plane, look down from an elevation,
// light from the upper left, one pre-blurred shadow layer, one clock (T) for everything.
// Each frame shows a screenshot when the site has `shot` set in facts.js (file in public/proof/),
// otherwise a quiet monogram, so nothing is faked. The counters carry the numbers:
// embossed on the top face, debossed label on the front face.

const LW = 640, LH = 340, Q = 2;
const THETA = (10 * Math.PI) / 180, ELEV = (34 * Math.PI) / 180;
const COS_T = Math.cos(THETA), SIN_T = Math.sin(THETA), SIN_E = Math.sin(ELEV), COS_E = Math.cos(ELEV);
export const TRACTION_T_END = 7.0;

const LIGHT = (() => { const v = [-0.5, 0.42, 0.78], l = Math.hypot(...v); return v.map(x => x / l); })();
const shade = (nx, ny, nz) => { const l = Math.hypot(nx, ny, nz) || 1; return clamp01(0.12 + 1.05 * Math.max(0, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / l)); };
const rotN = (nx, ny) => [nx * COS_T - ny * SIN_T, nx * SIN_T + ny * COS_T];
const SH_TOP = shade(0, 0, 1), SH_S = shade(...rotN(0, 1), 0), SH_E = shade(...rotN(1, 0), 0), SH_W = shade(...rotN(-1, 0), 0);

// frames (the live sites), standing at the back
const FW = 3.0, FT = 0.3, FH = 3.7, FGAP = 0.42;
const FRAMES = LIVE_SITES.map((s, i) => ({ ...s, i, x: i * (FW + FGAP), y: 0, w: FW, dep: FT, H: FH, d: 0.5 + i * 0.5 }));
const FRAMES_W = LIVE_SITES.length * FW + (LIVE_SITES.length - 1) * FGAP;
// counters (the numbers), low plinths in front
const PW = 3.5, PD = 2.1, PGAP = 0.6, PY = 3.6;
const PX0 = (FRAMES_W - (3 * PW + 2 * PGAP)) / 2 + 0.85; // the right-forward turn slides the front row left on screen
const COUNTERS = [
  { id: 'users', tag: 'USERS', value: TRACTION_FACTS.activeUsers, H: 0.9, d: 3.3 },
  { id: 'paying', tag: 'PAYING', value: TRACTION_FACTS.paidUsers, H: 0.9, d: 4.2, accent: true },
  { id: 'mrr', tag: 'MRR', value: TRACTION_FACTS.mrr, prefix: '$', H: 0.9, d: 5.1 },
].map((c, i) => ({ ...c, x: PX0 + i * (PW + PGAP), y: PY, w: PW, dep: PD }));
const PLAT = { x0: -1.0, x1: FRAMES_W + 1.0, y0: -1.0, y1: PY + PD + 0.9, h: 0.3 };
const CX = (PLAT.x0 + PLAT.x1) / 2, CY = (PLAT.y0 + PLAT.y1) / 2;
const rot = (x, y) => [(x - CX) * COS_T - (y - CY) * SIN_T, (x - CX) * SIN_T + (y - CY) * COS_T];

let CAM = null;
function camera() {
  if (CAM) return CAM;
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  const add = (x, y, z) => { const [xr, yr] = rot(x, y); x0 = Math.min(x0, xr); x1 = Math.max(x1, xr); const sy = yr * SIN_E - z * COS_E; y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); };
  [[PLAT.x0, PLAT.y0], [PLAT.x1, PLAT.y0], [PLAT.x1, PLAT.y1], [PLAT.x0, PLAT.y1]].forEach(([x, y]) => add(x, y, 0));
  FRAMES.forEach(f => { add(f.x, f.y, PLAT.h + f.H); add(f.x + f.w, f.y, PLAT.h + f.H); });
  const padX = 12, padY = 10, u = Math.min((LW - 2 * padX) / (x1 - x0), (LH - 2 * padY) / (y1 - y0));
  const ox = (LW - (x1 - x0) * u) / 2 - x0 * u, oy = (LH - (y1 - y0) * u) / 2 - y0 * u;
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
    frame: { lit: mix(mix(bg, tx, 0.03), ac, 0.04), dark: mix(mix(bg, tx, 0.5), ac, 0.08) },
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

// `images` maps a frame's name to a loaded screenshot (if any). `make` lets tests supply a node-canvas factory.
export function drawTractionFrame(ctx, theme, T, images = {}, make = makeBrowserCanvas) {
  const pal = palette(theme), U = camera().u;
  const dispFont = (px) => `${theme.type.displayWeight} ${px}px ${theme.fonts.display}`;
  const bodyFont = (px, w = 500) => `${w} ${px}px ${theme.fonts.body}`;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, LW * Q, LH * Q);
  const sh = shadowLayer(pal, make), sa = eo3(clamp01(T / 1.2));
  if (sh) { ctx.globalAlpha = sa; ctx.drawImage(sh, 0, 0); ctx.globalAlpha = 1; }
  ctx.setTransform(Q, 0, 0, Q, 0, 0);

  const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
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
  const topM = (c, z) => { const o = Pt(c.x, c.y, z), a = Pt(c.x + c.w, c.y, z), b = Pt(c.x, c.y + c.dep, z), pw = c.w * U, ph = c.dep * U; return [(a[0] - o[0]) / pw, (a[1] - o[1]) / pw, (b[0] - o[0]) / ph, (b[1] - o[1]) / ph, o[0], o[1]]; };
  const frontM = (c, zt, zb) => { const yy = c.y + c.dep, o = Pt(c.x, yy, zt), a = Pt(c.x + c.w, yy, zt), b = Pt(c.x, yy, zb), pw = c.w * U, ph = (zt - zb) * U; return [(a[0] - o[0]) / pw, (a[1] - o[1]) / pw, (b[0] - o[0]) / ph, (b[1] - o[1]) / ph, o[0], o[1]]; };

  // the stage
  const pg = eo3(clamp01(T / 0.7));
  ctx.globalAlpha = pg; box(PLAT.x0, PLAT.y0, PLAT.x1, PLAT.y1, 0, PLAT.h, pal.plat); ctx.globalAlpha = 1;

  // cast shadows, kept on the stage
  ctx.save(); ctx.beginPath();
  [[PLAT.x0, PLAT.y0], [PLAT.x1, PLAT.y0], [PLAT.x1, PLAT.y1], [PLAT.x0, PLAT.y1]].forEach(([x, y], i) => { const q = Pt(x, y, PLAT.h); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
  ctx.closePath(); ctx.clip();
  [...FRAMES, ...COUNTERS].forEach(c => {
    const g = eoBack(clamp01((T - c.d) / 1.0)); if (g <= 0.02) return;
    const H = c.H * Math.min(1, g), sd = [0.3, -0.5], L = H * 0.5;
    const pts = [[c.x, c.y], [c.x + c.w, c.y], [c.x + c.w, c.y + c.dep], [c.x, c.y + c.dep]];
    const all = [...pts.map(([x, y]) => Pt(x, y, PLAT.h)), ...pts.map(([x, y]) => Pt(x + sd[0] * L, y + sd[1] * L, PLAT.h))];
    poly(hull(all), css(mix(pal.tx, [0, 0, 0], 0.5), 0.2));
  });
  ctx.restore();

  // frames (back row), each with its site on the front face
  FRAMES.forEach(f => {
    const g = eoBack(clamp01((T - f.d) / 1.0)); if (g <= 0) return;
    const H = f.H * Math.max(0, g), zt = PLAT.h + H;
    box(f.x, f.y, f.x + f.w, f.y + f.dep, PLAT.h, zt, pal.frame);
    if (g < 0.97) return;
    const a = eo3(clamp01((T - (f.d + 0.85)) / 0.5)); if (a <= 0) return;
    const pw = f.w * U, ph = f.H * U, m = 5;
    ctx.save(); ctx.transform(...frontM(f, zt, PLAT.h)); ctx.globalAlpha = a;
    // browser chrome
    ctx.fillStyle = css(mix(pal.bg, pal.Wh, 0.5)); ctx.fillRect(m, m, pw - 2 * m, 13);
    ['#d9d9d4', '#d9d9d4', '#d9d9d4'].forEach((c, k) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(m + 6 + k * 6, m + 6.5, 1.9, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = css(mix(pal.bg, pal.tx, 0.08)); ctx.fillRect(m + 27, m + 3.5, pw - 2 * m - 33, 6);
    // page: screenshot if we have one, otherwise a quiet monogram on a tint
    const hy = m + 15, hh = ph * 0.56, hw = pw - 2 * m;
    const tint = mix(pal.bg, f.paying ? pal.ac : pal.tx, f.paying ? 0.16 : 0.1);
    ctx.fillStyle = css(tint); ctx.fillRect(m, hy, hw, hh);
    const img = images[f.name];
    if (img && img.width) {
      const sc = Math.max(hw / img.width, hh / img.height), sw = hw / sc, sh2 = hh / sc;
      ctx.drawImage(img, 0, 0, sw, sh2, m, hy, hw, hh);
    } else {
      ctx.fillStyle = css(mix(tint, pal.tx, 0.22)); ctx.font = dispFont(34); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(f.name.trim()[0].toUpperCase(), pw / 2, hy + hh / 2 + 1);
    }
    // name and badge
    ctx.fillStyle = css(mix(pal.tx, pal.bg, 0.1)); ctx.font = bodyFont(11.5, 600); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(f.name, pw / 2, hy + hh + 17);
    const label = f.paying ? 'PAYING' : (f.tag || 'LIVE').toUpperCase();
    ctx.font = `500 7.5px ${theme.fonts.mono}`;
    const lw = ctx.measureText(label).width + 12, ly = hy + hh + 31;
    ctx.fillStyle = f.paying ? css(pal.ac) : css(mix(pal.bg, pal.tx, 0.14));
    ctx.beginPath(); ctx.moveTo(pw / 2 - lw / 2 + 5, ly - 6); ctx.arcTo(pw / 2 + lw / 2, ly - 6, pw / 2 + lw / 2, ly + 6, 5); ctx.arcTo(pw / 2 + lw / 2, ly + 6, pw / 2 - lw / 2, ly + 6, 5); ctx.arcTo(pw / 2 - lw / 2, ly + 6, pw / 2 - lw / 2, ly - 6, 5); ctx.arcTo(pw / 2 - lw / 2, ly - 6, pw / 2 + lw / 2, ly - 6, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = f.paying ? css(pal.Wh) : css(mix(pal.tx, pal.bg, 0.35)); ctx.fillText(label, pw / 2, ly + 0.5);
    ctx.restore();
  });

  // counters (front row): number embossed on top, label carved into the front
  COUNTERS.forEach(c => {
    const g = eoBack(clamp01((T - c.d) / 1.0)); if (g <= 0) return;
    const H = c.H * Math.max(0, g), zt = PLAT.h + H, pl = c.accent ? pal.star : pal.block;
    box(c.x, c.y, c.x + c.w, c.y + c.dep, PLAT.h, zt, pl);
    if (g < 0.9) return;
    const p = eo3(clamp01((T - (c.d + 0.35)) / 1.1));
    const aTop = eo3(clamp01((T - (c.d + 0.4)) / 0.45)), aFront = eo3(clamp01((T - (c.d + 0.7)) / 0.45));
    const txt = (c.prefix || '') + Math.round(c.value * p).toLocaleString('en-US');
    // front
    if (aFront > 0) {
      const base = mix(pl.dark, pl.lit, SH_S);
      ctx.save(); ctx.transform(...frontM(c, zt, PLAT.h)); ctx.globalAlpha = aFront;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = dispFont(13);
      const cx = (c.w * U) / 2, cy = (c.H * U) / 2;
      ctx.fillStyle = css(mix(base, pal.Wh, 0.6), 0.9); ctx.fillText(c.tag, cx + 0.8, cy + 0.8);
      ctx.fillStyle = css(mix(base, [0, 0, 0], 0.5)); ctx.fillText(c.tag, cx, cy);
      ctx.restore();
    }
    // top
    if (aTop > 0) {
      const topFace = mix(pl.dark, pl.lit, SH_TOP), side = mix(pl.dark, pl.lit, SH_E);
      const pw = c.w * U, ph = c.dep * U, layers = 3, lift = 0.012;
      ctx.save(); ctx.globalAlpha = aTop; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      let size = 46;
      ctx.save(); ctx.transform(...topM(c, zt)); ctx.font = dispFont(size); const mw = ctx.measureText(txt).width; ctx.restore();
      if (mw > pw * 0.8) size = Math.floor(size * (pw * 0.8) / mw);
      for (let i = 0; i <= layers; i++) {
        ctx.save(); ctx.transform(...topM(c, zt + i * lift)); ctx.font = dispFont(size);
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

export function TractionWall3D({ theme, size = 1 }) {
  const t = theme.colors;
  const entered = useSlideEntered();
  const canvasRef = useRef(null);
  const ui = useRef({});
  const imgs = useRef({});
  camera();

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || './';
    let lastT = 0, raf, start = null, alive = true;
    const frame = (T) => {
      lastT = T; drawTractionFrame(ctx, theme, T, imgs.current);
      const a = eo3(clamp01((T - 6.0) / 0.7));
      if (ui.current.tick) ui.current.tick.style.opacity = a;
    };
    LIVE_SITES.forEach(s => {
      if (!s.shot || imgs.current[s.name]) return;
      const im = new Image(); im.onload = () => { imgs.current[s.name] = im; if (alive) frame(lastT); }; im.src = `${base}proof/${s.shot}`;
    });
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!entered) { frame(0); return () => { alive = false; }; }
    if (reduce) { frame(TRACTION_T_END + 1); return () => { alive = false; }; }
    const tick = (ts) => { if (start === null) start = ts; const T = (ts - start) / 1000; frame(Math.min(T, TRACTION_T_END + 1)); if (T < TRACTION_T_END + 0.2) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, [entered, theme]);

  const chip = (f, k) => (
    <span key={k} style={{ flexShrink: 0, paddingRight: `${6 * size}px` }}>
      <span style={{ display: 'inline-block', fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, letterSpacing: '0.04em', color: t.textMuted, border: `1px solid ${t.border}`, background: t.bg, borderRadius: '999px', padding: `${3.5 * size}px ${9 * size}px`, whiteSpace: 'nowrap' }}>
        <span style={{ color: t.accent, marginRight: `${5 * size}px` }}>{'\u2713'}</span>{f}
      </span>
    </span>
  );
  return (
    <div style={{ width: '100%', maxWidth: `${520 * size}px`, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: `${8 * size}px` }}>
      <canvas ref={canvasRef} width={LW * Q} height={LH * Q} style={{ width: '100%', height: 'auto', display: 'block' }} />
      <div ref={el => { ui.current.tick = el; }} style={{ opacity: 0, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
        <div className="peak-ticker" style={{ display: 'flex', width: 'max-content' }}>
          {[...PRODUCT.liveNow, ...PRODUCT.liveNow].map((f, k) => chip(f, k))}
        </div>
      </div>
      <style>{`@keyframes peakTicker { to { transform: translateX(-50%); } } .peak-ticker { animation: peakTicker 26s linear infinite; } @media (prefers-reduced-motion: reduce) { .peak-ticker { animation: none; } }`}</style>
    </div>
  );
}
