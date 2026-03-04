// ─── CLIENT-SIDE PPTX GENERATOR ───────────────────────────────────────────────
// Two-column layout matching the app's SlideRenderer.
// Right-side visuals approximated with text tables and shapes in PPTX format.

import PptxGenJS from 'pptxgenjs';
import { SLIDES } from '../data/slides.js';
import { COMPETITOR_COST_STACK, FUNDING_BREAKDOWN_SMALL, MERCHANT_GROWTH } from '../data/financials.js';
import { COMPANY, COMPETITORS, FUNDING } from '../data/config.js';

export async function generatePitchDeckPPTX(theme) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = `${COMPANY.name} — Investor Pitch Deck`;

  const isLight = theme.isLight;
  const c = (hex) => (hex || '#888888').replace('#', '');

  const bg       = c(theme.colors.bg);
  const bgAlt    = c(theme.colors.bgAlt || theme.colors.bg);
  const textMain = c(theme.colors.text);
  const textMute = c(theme.colors.textMuted);
  const textFaint= c(theme.colors.textFaint || theme.colors.textMuted);
  const accent   = c(theme.colors.accent);
  const border   = c(theme.colors.border);

  // Layout constants (inches, 16:9 = 13.33 × 7.5)
  const W = 13.33, H = 7.5;
  const LEFT_W = 7.3;
  const RIGHT_X = 7.5;
  const RIGHT_W = W - RIGHT_X - 0.3;
  const PAD = 0.55;

  SLIDES.forEach((slide, idx) => {
    const s = pptx.addSlide();

    // Backgrounds
    s.background = { color: bg };
    s.addShape(pptx.ShapeType.rect, { x: RIGHT_X - 0.05, y: 0, w: W - RIGHT_X + 0.05, h: H, fill: { color: bgAlt }, line: { color: bgAlt } });

    // Top accent bar
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.07, fill: { color: accent }, line: { color: accent } });

    // Column divider
    s.addShape(pptx.ShapeType.line, { x: LEFT_W + 0.1, y: 0.07, w: 0, h: H - 0.45, line: { color: border, width: 0.5 } });

    // ── LEFT COLUMN ──────────────────────────────────────────────────────────
    // Eyebrow
    s.addText(slide.eyebrow.toUpperCase(), {
      x: PAD, y: 0.55, w: LEFT_W - PAD * 2, h: 0.3,
      fontSize: 8, color: accent, fontFace: 'Arial', charSpacing: 3,
    });

    // Headline
    s.addText(slide.headline, {
      x: PAD, y: 0.95, w: LEFT_W - PAD * 2, h: 2.4,
      fontSize: 24, bold: true, color: textMain,
      fontFace: 'Arial', valign: 'top', breakLine: true,
    });

    // Accent rule
    s.addShape(pptx.ShapeType.rect, {
      x: PAD, y: 3.5, w: 0.6, h: 0.04,
      fill: { color: accent }, line: { color: accent },
    });

    // Body
    s.addText(slide.body, {
      x: PAD, y: 3.65, w: LEFT_W - PAD * 2, h: 2.6,
      fontSize: 11, color: textMute,
      fontFace: 'Arial', valign: 'top', breakLine: true, lineSpacingMultiple: 1.4,
    });

    // Ghost tag
    s.addText(slide.tag, {
      x: LEFT_W - 1.5, y: H - 1.5, w: 1.4, h: 1.3,
      fontSize: 64, bold: true,
      color: isLight ? 'E8E0D0' : '2A2420',
      fontFace: 'Arial', align: 'right', valign: 'bottom',
    });

    // ── RIGHT COLUMN ─────────────────────────────────────────────────────────
    addRightVisual(s, pptx, slide, RIGHT_X, RIGHT_W, H, accent, textMute, textFaint, textMain, border, bgAlt, bg);

    // Footer
    s.addShape(pptx.ShapeType.line, {
      x: 0, y: H - 0.38, w: W, h: 0,
      line: { color: border, width: 0.5 },
    });
    s.addText('THEAPP — INVESTOR PITCH', {
      x: PAD, y: H - 0.35, w: 4, h: 0.25,
      fontSize: 6.5, color: textFaint, fontFace: 'Arial',
    });
    s.addText(`${idx + 1} / ${SLIDES.length}`, {
      x: W - 1.5, y: H - 0.35, w: 1.2, h: 0.25,
      fontSize: 6.5, color: textFaint, fontFace: 'Arial', align: 'right',
    });
  });

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  await pptx.writeFile({ fileName: `${COMPANY.name.toLowerCase().replace(/\s+/g, '-')}-pitch-deck-${dateStr}.pptx` });
}

function addRightVisual(s, pptx, slide, rx, rw, H, accent, textMute, textFaint, textMain, border, bgAlt, bg) {
  const pad = rx + 0.35;
  const contentY = 0.55;

  switch (slide.slug) {

    case 'hook': {
      const items = [
        { val: '10', label: 'TOOLS REPLACED' },
        { val: '$850', label: 'SAVED / MONTH' },
        { val: '1', label: 'PLATFORM' },
      ];
      items.forEach((item, i) => {
        const y = contentY + i * 2.0;
        s.addShape(pptx.ShapeType.rect, { x: pad, y, w: rw - 0.3, h: 1.7, fill: { color: bgAlt }, line: { color: border, width: 0.5 } });
        s.addShape(pptx.ShapeType.rect, { x: pad, y, w: 0.06, h: 1.7, fill: { color: accent }, line: { color: accent } });
        s.addText(item.val, { x: pad + 0.2, y: y + 0.2, w: rw - 0.6, h: 0.9, fontSize: 28, bold: true, color: accent, fontFace: 'Arial' });
        s.addText(item.label, { x: pad + 0.2, y: y + 1.1, w: rw - 0.6, h: 0.4, fontSize: 7, color: textMute, fontFace: 'Arial', charSpacing: 2 });
      });
      break;
    }

    case 'problem': {
      s.addText('MONTHLY TOOL SPEND', { x: pad, y: contentY, w: rw - 0.3, h: 0.3, fontSize: 7, color: accent, fontFace: 'Arial', charSpacing: 2 });
      const tools = COMPETITOR_COST_STACK.slice(0, 5);
      const maxCost = 300;
      tools.forEach((tool, i) => {
        const y = contentY + 0.45 + i * 1.1;
        const label = tool.tool.split('/')[0].trim();
        s.addText(label, { x: pad, y, w: rw * 0.6, h: 0.3, fontSize: 8, color: textMute, fontFace: 'Arial' });
        s.addText(`$${tool.min}–${tool.max}`, { x: pad + rw * 0.6, y, w: rw * 0.35, h: 0.3, fontSize: 8, color: accent, fontFace: 'Arial', align: 'right' });
        s.addShape(pptx.ShapeType.rect, { x: pad, y: y + 0.32, w: rw - 0.3, h: 0.18, fill: { color: bgAlt }, line: { color: bgAlt } });
        s.addShape(pptx.ShapeType.rect, { x: pad, y: y + 0.32, w: ((rw - 0.3) * tool.max) / maxCost, h: 0.18, fill: { color: accent }, line: { color: accent } });
      });
      break;
    }

    case 'solution': {
      const modules = [
        ['◈', 'Storefront', '5 themes'],
        ['◎', 'Pulse', 'Production costing'],
        ['◐', 'Constellation', 'CRM'],
        ['◑', 'Compass', 'Task management'],
        ['◒', 'Orders', 'Commerce'],
        ['◓', 'Email', 'Marketing'],
      ];
      modules.forEach((mod, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = pad + col * ((rw - 0.3) / 2 + 0.1);
        const y = contentY + row * 2.1;
        const mw = (rw - 0.5) / 2;
        s.addShape(pptx.ShapeType.rect, { x, y, w: mw, h: 1.9, fill: { color: bgAlt }, line: { color: border, width: 0.5 } });
        s.addText(mod[0], { x: x + 0.15, y: y + 0.2, w: mw - 0.3, h: 0.5, fontSize: 18, color: accent, fontFace: 'Arial' });
        s.addText(mod[1], { x: x + 0.15, y: y + 0.75, w: mw - 0.3, h: 0.4, fontSize: 9, bold: true, color: textMain, fontFace: 'Arial' });
        s.addText(mod[2], { x: x + 0.15, y: y + 1.2, w: mw - 0.3, h: 0.4, fontSize: 7.5, color: accent, fontFace: 'Arial', charSpacing: 1 });
      });
      break;
    }

    case 'differentiator': {
      const rows = ['Ingredients', 'Suppliers', 'Batch Costing', 'Packaging', 'QuickBooks'];
      const colW = (rw - 0.5) / 2;
      s.addText('SHOPIFY', { x: pad, y: contentY, w: colW, h: 0.3, fontSize: 7, color: textFaint, fontFace: 'Arial', align: 'center', charSpacing: 2 });
      s.addText('THEAPP', { x: pad + colW + 0.1, y: contentY, w: colW, h: 0.3, fontSize: 7, color: accent, fontFace: 'Arial', align: 'center', charSpacing: 2 });
      rows.forEach((row, i) => {
        const y = contentY + 0.4 + i * 1.18;
        s.addShape(pptx.ShapeType.rect, { x: pad, y, w: colW, h: 1.0, fill: { color: bgAlt }, line: { color: border, width: 0.5 } });
        s.addText(`${row} → Sheet`, { x: pad + 0.1, y: y + 0.3, w: colW - 0.2, h: 0.4, fontSize: 8, color: textFaint, fontFace: 'Arial', strike: true });
        s.addShape(pptx.ShapeType.rect, { x: pad + colW + 0.1, y, w: colW, h: 1.0, fill: { color: bgAlt }, line: { color: accent, width: 0.75 } });
        s.addText(`${row}  ✓`, { x: pad + colW + 0.2, y: y + 0.3, w: colW - 0.2, h: 0.4, fontSize: 8, color: textMain, fontFace: 'Arial' });
      });
      break;
    }

    case 'market': {
      // Simple concentric circle approximation
      [[0.9, 0.12], [0.62, 0.28], [0.35, 0.65]].forEach(([r, opacity], i) => {
        const cx = pad + rw * 0.4, cy = H * 0.38, rPx = r * Math.min(rw, H * 0.7) * 0.5;
        s.addShape(pptx.ShapeType.ellipse, {
          x: cx - rPx, y: cy - rPx * 0.75, w: rPx * 2, h: rPx * 1.5,
          fill: { color: accent, transparency: Math.round((1 - opacity) * 100) },
          line: { color: accent, width: 0.5 },
        });
      });
      [['TAM', '$14B+ Global SaaS'], ['SAM', '3.8M CA Businesses'], ['SOM', '100K Target']].forEach(([lbl, sub], i) => {
        const y = H * 0.55 + i * 0.65;
        s.addText(lbl, { x: pad, y, w: 0.7, h: 0.4, fontSize: 8, color: accent, fontFace: 'Arial', bold: true, charSpacing: 1 });
        s.addText(sub, { x: pad + 0.75, y, w: rw - 0.8, h: 0.4, fontSize: 8, color: textMute, fontFace: 'Arial' });
      });
      break;
    }

    case 'model': {
      s.addText('MRR GROWTH · 3 YEARS', { x: pad, y: contentY, w: rw - 0.3, h: 0.3, fontSize: 7, color: accent, fontFace: 'Arial', charSpacing: 2 });
      // Simple bar chart approximation
      const pts = MERCHANT_GROWTH.filter((_, i) => i % 3 === 0);
      const maxMrr = Math.max(...pts.map(p => p.mrr));
      const chartH = 3.5, chartW = rw - 0.6, barW = chartW / pts.length * 0.6;
      pts.forEach((p, i) => {
        const bh = (p.mrr / maxMrr) * chartH;
        const x = pad + (i / pts.length) * chartW;
        const y = contentY + 0.5 + chartH - bh;
        s.addShape(pptx.ShapeType.rect, { x, y, w: barW, h: bh, fill: { color: accent, transparency: 25 }, line: { color: accent, width: 0.5 } });
      });
      s.addText('$79K MRR · Year 3', { x: pad, y: contentY + 4.3, w: rw - 0.3, h: 0.5, fontSize: 16, bold: true, color: accent, fontFace: 'Arial' });
      break;
    }

    case 'traction': {
      const items = [
        { label: 'Multi-tenant DB', pct: 100 },
        { label: 'Dual Auth', pct: 100 },
        { label: 'REST API 23+ endpoints', pct: 100 },
        { label: 'Pulse', pct: 100 },
        { label: 'Stripe Connect', pct: 35 },
        { label: 'Beta Launch', pct: 20 },
      ];
      s.addText('BUILD PROGRESS', { x: pad, y: contentY, w: rw - 0.3, h: 0.3, fontSize: 7, color: accent, fontFace: 'Arial', charSpacing: 2 });
      items.forEach((item, i) => {
        const y = contentY + 0.45 + i * 1.05;
        s.addText(item.label, { x: pad, y, w: rw * 0.7, h: 0.3, fontSize: 8, color: item.pct === 100 ? textMain : textMute, fontFace: 'Arial' });
        s.addText(`${item.pct}%`, { x: pad + rw * 0.7, y, w: rw * 0.25, h: 0.3, fontSize: 8, color: accent, fontFace: 'Arial', align: 'right' });
        s.addShape(pptx.ShapeType.rect, { x: pad, y: y + 0.32, w: rw - 0.3, h: 0.15, fill: { color: bgAlt }, line: { color: bgAlt } });
        s.addShape(pptx.ShapeType.rect, { x: pad, y: y + 0.32, w: ((rw - 0.3) * item.pct) / 100, h: 0.15, fill: { color: accent }, line: { color: accent } });
      });
      break;
    }

    case 'roadmap': {
      const phases = [
        { label: 'NOW', items: 'Cart + Payments · BARE Theme · Beta Launch' },
        { label: '6 MO', items: 'Scheduling · 100+ merchants · First Hire' },
        { label: '18 MO', items: 'AI Agent API · US Entry · 500+ merchants' },
      ];
      phases.forEach((phase, i) => {
        const y = contentY + i * 2.1;
        s.addShape(pptx.ShapeType.ellipse, { x: pad, y: y + 0.1, w: 0.22, h: 0.22, fill: { color: i === 0 ? accent : bgAlt }, line: { color: accent, width: 1 } });
        if (i < phases.length - 1) {
          s.addShape(pptx.ShapeType.line, { x: pad + 0.11, y: y + 0.33, w: 0, h: 1.75, line: { color: border, width: 0.5 } });
        }
        s.addText(phase.label, { x: pad + 0.35, y, w: 0.9, h: 0.35, fontSize: 7.5, color: accent, fontFace: 'Arial', bold: true, charSpacing: 1 });
        s.addText(phase.items, { x: pad + 0.35, y: y + 0.38, w: rw - 0.65, h: 1.5, fontSize: 9, color: textMute, fontFace: 'Arial', breakLine: true, lineSpacingMultiple: 1.5 });
      });
      break;
    }

    case 'competition': {
      const rows = COMPETITORS.map(c => ({
        co:    c.co,
        s:     c.storefront ? '✓' : '×',
        c:     c.crm        ? '✓' : '×',
        p:     c.costing    ? '✓' : '×',
        price: c.price,
      }));
      const headers = ['', 'Store', 'CRM', 'Costing', 'Price'];
      const cw = [1.5, 0.75, 0.75, 0.85, 0.9];
      let cx = pad;
      headers.forEach((h, i) => {
        s.addText(h, { x: cx, y: contentY, w: cw[i], h: 0.3, fontSize: 7, color: textFaint, fontFace: 'Arial', charSpacing: 1 });
        cx += cw[i];
      });
      s.addShape(pptx.ShapeType.line, { x: pad, y: contentY + 0.32, w: rw - 0.3, h: 0, line: { color: border, width: 0.5 } });
      rows.forEach((row, i) => {
        const y = contentY + 0.45 + i * 1.42;
        const isOurs = row.co === COMPANY.name;
        if (isOurs) s.addShape(pptx.ShapeType.rect, { x: pad - 0.1, y: y - 0.08, w: rw - 0.1, h: 1.3, fill: { color: bgAlt }, line: { color: accent, width: 0.75 } });
        const vals = [row.co, row.s, row.c, row.p, row.price];
        cx = pad;
        vals.forEach((val, j) => {
          s.addText(val, {
            x: cx, y: y + 0.2, w: cw[j], h: 0.8,
            fontSize: j === 0 ? 9 : 10,
            bold: isOurs,
            color: isOurs ? accent : (val === '✓' ? textMain : val === '×' ? textFaint : textMute),
            fontFace: 'Arial', valign: 'middle', align: j === 0 ? 'left' : 'center',
          });
          cx += cw[j];
        });
        if (!isOurs) s.addShape(pptx.ShapeType.line, { x: pad, y: y + 1.3, w: rw - 0.3, h: 0, line: { color: border, width: 0.3 } });
      });
      break;
    }

    case 'ask': {
      const items = FUNDING_BREAKDOWN_SMALL;
      const total = items.reduce((s, i) => s + i.amount, 0);
      s.addText(`$${(FUNDING.currentGrant.amount / 1000).toFixed(0)}K GRANT BREAKDOWN`, { x: pad, y: contentY, w: rw - 0.3, h: 0.3, fontSize: 7, color: accent, fontFace: 'Arial', charSpacing: 2 });
      items.forEach((item, i) => {
        const y = contentY + 0.45 + i * 1.3;
        s.addText(item.label, { x: pad, y, w: rw * 0.7, h: 0.35, fontSize: 8.5, color: textMute, fontFace: 'Arial' });
        s.addText(`$${item.amount.toLocaleString()}`, { x: pad + rw * 0.68, y, w: rw * 0.27, h: 0.35, fontSize: 8.5, color: accent, fontFace: 'Arial', align: 'right' });
        s.addShape(pptx.ShapeType.rect, { x: pad, y: y + 0.38, w: rw - 0.3, h: 0.2, fill: { color: bgAlt }, line: { color: bgAlt } });
        s.addShape(pptx.ShapeType.rect, { x: pad, y: y + 0.38, w: ((rw - 0.3) * item.amount) / total, h: 0.2, fill: { color: accent }, line: { color: accent } });
      });
      s.addShape(pptx.ShapeType.line, { x: pad, y: contentY + 0.45 + items.length * 1.3, w: rw - 0.3, h: 0, line: { color: border, width: 0.5 } });
      s.addText(`$${FUNDING.currentGrant.amount.toLocaleString()}`, { x: pad, y: contentY + 0.55 + items.length * 1.3, w: rw - 0.3, h: 0.7, fontSize: 22, bold: true, color: accent, fontFace: 'Arial' });
      break;
    }
  }
}
