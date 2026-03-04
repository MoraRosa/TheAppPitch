// ─── CLIENT-SIDE PDF GENERATOR ────────────────────────────────────────────────
// Two-column slide layout matching the app's SlideRenderer design.

import jsPDF from 'jspdf';
import { PLAN_SECTIONS } from '../data/plan.js';
import { SLIDES } from '../data/slides.js';
import { MILESTONES, UNIT_ECONOMICS, FUNDING_BREAKDOWN_SMALL, COMPETITOR_COST_STACK, MERCHANT_GROWTH } from '../data/financials.js';
import { FOUNDER } from '../data/founder.js';
import { COMPANY, COMPETITORS, FOUNDER_INFO, FUNDING } from '../data/config.js';

function hexToRgb(hex) {
  const c = (hex || '#888888').replace('#', '');
  return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)];
}

function accentRule(doc, x, y, theme) {
  doc.setDrawColor(...hexToRgb(theme.colors.accent));
  doc.setLineWidth(0.7);
  doc.line(x, y, x + 28, y);
  doc.setLineWidth(0.2);
}

function pageFooter(doc, num, total, theme) {
  const y = 195;
  doc.setDrawColor(...hexToRgb(theme.colors.border));
  doc.line(8, y, 289, y);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(theme.colors.textFaint));
  doc.text('THEAPP — INVESTOR PITCH', 10, y + 4);
  doc.text(`${num} / ${total}`, 287, y + 4, { align: 'right' });
}

// ── Right-side visual renderers for PDF ───────────────────────────────────────

function drawRightProblem(doc, x, y, w, h, theme) {
  const t = theme.colors;
  const tools = COMPETITOR_COST_STACK.slice(0, 5);
  const maxCost = 300;
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(t.accent));
  doc.text('MONTHLY TOOL SPEND', x, y + 6);
  let cy = y + 12;
  tools.forEach((tool, i) => {
    const label = tool.tool.split('/')[0].trim();
    const barW = (tool.max / maxCost) * (w - 4);
    doc.setFontSize(7);
    doc.setTextColor(...hexToRgb(t.textMuted));
    doc.text(label, x, cy);
    doc.setFontSize(7);
    doc.setTextColor(...hexToRgb(t.accent));
    doc.text(`$${tool.min}–${tool.max}`, x + w - 2, cy, { align: 'right' });
    cy += 3;
    doc.setFillColor(...hexToRgb(t.bgAlt || t.bgDeep));
    doc.rect(x, cy, w - 4, 3, 'F');
    doc.setFillColor(...hexToRgb(t.accent));
    doc.rect(x, cy, barW, 3, 'F');
    cy += 7;
  });
}

function drawRightSolution(doc, x, y, w, h, theme) {
  const t = theme.colors;
  const modules = ['Storefront', 'Pulse', 'Constellation CRM', 'Compass', 'Orders', 'Email'];
  const cols = 2, cellW = (w - 4) / cols, cellH = 14;
  modules.forEach((mod, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const cx = x + col * (cellW + 2), cy = y + 6 + row * (cellH + 2);
    doc.setDrawColor(...hexToRgb(t.border));
    doc.rect(cx, cy, cellW, cellH);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(t.text));
    doc.text(mod, cx + 3, cy + 6);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(t.accent));
    doc.text('✓ Built-in', cx + 3, cy + 10);
  });
}

function drawRightDiff(doc, x, y, w, h, theme) {
  const t = theme.colors;
  const rows = ['Ingredients', 'Suppliers', 'Batch Costing', 'Packaging', 'QuickBooks'];
  const colW = (w - 4) / 2;
  doc.setFontSize(6.5);
  doc.setTextColor(...hexToRgb(t.textFaint));
  doc.text('SHOPIFY', x + colW / 2, y + 5, { align: 'center' });
  doc.setTextColor(...hexToRgb(t.accent));
  doc.text('THEAPP', x + colW + 2 + colW / 2, y + 5, { align: 'center' });
  let cy = y + 10;
  rows.forEach(row => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setFillColor(...hexToRgb(t.bgAlt || '#EDE7D9'));
    doc.rect(x, cy, colW, 7, 'F');
    doc.setTextColor(...hexToRgb(t.textFaint));
    doc.text(`${row} → Sheet`, x + 2, cy + 5);
    doc.setFillColor(...hexToRgb(t.bgAlt || '#EDE7D9'));
    doc.rect(x + colW + 2, cy, colW, 7, 'F');
    doc.setDrawColor(...hexToRgb(t.accent));
    doc.rect(x + colW + 2, cy, colW, 7);
    doc.setTextColor(...hexToRgb(t.text));
    doc.text(`${row} ✓`, x + colW + 4, cy + 5);
    cy += 9;
  });
}

function drawRightModel(doc, x, y, w, h, theme) {
  const t = theme.colors;
  const pts = MERCHANT_GROWTH.filter((_, i) => i % 2 === 0);
  const maxMrr = Math.max(...pts.map(p => p.mrr));
  const chartH = 50, chartW = w - 4;
  doc.setFontSize(6.5);
  doc.setTextColor(...hexToRgb(t.accent));
  doc.text('MRR GROWTH · 3 YEARS', x, y + 5);
  // Draw area
  const svgPts = pts.map((p, i) => ({
    px: x + (i / (pts.length - 1)) * chartW,
    py: y + 10 + chartH - (p.mrr / maxMrr) * chartH * 0.9,
  }));
  // Fill area
  doc.setFillColor(...hexToRgb(t.accent));
  for (let i = 0; i < svgPts.length - 1; i++) {
    doc.triangle(
      svgPts[i].px, svgPts[i].py,
      svgPts[i+1].px, svgPts[i+1].py,
      svgPts[i].px, y + 10 + chartH,
      'F'
    );
  }
  // Line
  doc.setDrawColor(...hexToRgb(t.accent));
  doc.setLineWidth(0.8);
  svgPts.forEach((pt, i) => {
    if (i === 0) return;
    doc.line(svgPts[i-1].px, svgPts[i-1].py, pt.px, pt.py);
  });
  doc.setLineWidth(0.2);
  // Year labels
  ['Y1','Y2','Y3'].forEach((lbl, i) => {
    doc.setFontSize(6);
    doc.setTextColor(...hexToRgb(t.textFaint));
    doc.text(lbl, x + (i / 2) * chartW, y + 10 + chartH + 5);
  });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(t.text));
  doc.text('$79K', x, y + 10 + chartH + 18);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(t.accent));
  doc.text('MRR · Year 3', x + 22, y + 10 + chartH + 18);
}

function drawRightTraction(doc, x, y, w, h, theme) {
  const t = theme.colors;
  const items = [
    { label: 'Multi-tenant DB', pct: 100 },
    { label: 'Dual Auth', pct: 100 },
    { label: 'REST API 23+ endpoints', pct: 100 },
    { label: 'Pulse (Production)', pct: 100 },
    { label: 'Stripe Connect', pct: 35 },
    { label: 'Beta Launch', pct: 20 },
  ];
  doc.setFontSize(6.5);
  doc.setTextColor(...hexToRgb(t.accent));
  doc.text('BUILD PROGRESS', x, y + 5);
  let cy = y + 11;
  items.forEach(item => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(item.pct === 100 ? t.text : t.textMuted));
    doc.text(item.label, x, cy);
    doc.setTextColor(...hexToRgb(t.accent));
    doc.text(`${item.pct}%`, x + w - 2, cy, { align: 'right' });
    cy += 3;
    doc.setFillColor(...hexToRgb(t.bgAlt || '#EDE7D9'));
    doc.rect(x, cy, w - 4, 2.5, 'F');
    doc.setFillColor(...hexToRgb(t.accent));
    doc.rect(x, cy, ((w - 4) * item.pct) / 100, 2.5, 'F');
    cy += 6;
  });
}

function drawRightCompetition(doc, x, y, w, h, theme) {
  const t = theme.colors;
  const rows = COMPETITORS.map(c => ({
    co:       c.co,
    storefront: c.storefront ? '✓' : '×',
    crm:      c.crm     ? '✓' : '×',
    costing:  c.costing ? '✓' : (c.co === COMPANY.name ? '✓' : '~'),
    price:    c.price,
  }));
  const headers = ['', 'Store', 'CRM', 'Cost', 'Price'];
  const colWidths = [22, 12, 12, 12, 20];
  let cx = x;
  headers.forEach((h, i) => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(t.textFaint));
    doc.text(h, cx, y + 6);
    cx += colWidths[i];
  });
  doc.setDrawColor(...hexToRgb(t.border));
  doc.line(x, y + 8, x + w - 2, y + 8);
  let ry = y + 14;
  rows.forEach(row => {
    const isOurs = row.co === COMPANY.name;
    const cols2 = [row.co, row.storefront, row.crm, row.costing, row.price];
    cx = x;
    cols2.forEach((val, i) => {
      doc.setFontSize(i === 0 ? 7.5 : 8);
      doc.setFont('helvetica', isOurs ? 'bold' : 'normal');
      doc.setTextColor(...hexToRgb(
        isOurs ? t.accent :
        (val === '✓' ? t.text : val === '×' ? t.textFaint : t.textMuted)
      ));
      doc.text(String(val), cx, ry);
      cx += colWidths[i];
    });
    ry += 8;
    doc.setDrawColor(...hexToRgb(t.border));
    doc.line(x, ry - 3, x + w - 2, ry - 3);
  });
}

function drawRightAsk(doc, x, y, w, h, theme) {
  const t = theme.colors;
  const items = FUNDING_BREAKDOWN_SMALL;
  const total = items.reduce((s, i) => s + i.amount, 0);
  doc.setFontSize(6.5);
  doc.setTextColor(...hexToRgb(t.accent));
  doc.text(`$${(FUNDING.currentGrant.amount / 1000).toFixed(0)}K GRANT BREAKDOWN`, x, y + 5);
  let cy = y + 12;
  items.forEach(item => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(t.textMuted));
    doc.text(item.label, x, cy);
    doc.setTextColor(...hexToRgb(t.accent));
    doc.text(`$${item.amount.toLocaleString()}`, x + w - 2, cy, { align: 'right' });
    cy += 3;
    doc.setFillColor(...hexToRgb(t.bgAlt || '#EDE7D9'));
    doc.rect(x, cy, w - 4, 3, 'F');
    doc.setFillColor(...hexToRgb(t.accent));
    doc.rect(x, cy, ((w - 4) * item.amount) / total, 3, 'F');
    cy += 7;
  });
  doc.setDrawColor(...hexToRgb(t.border));
  doc.line(x, cy, x + w - 4, cy);
  cy += 5;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(t.accent));
  doc.text(`$${FUNDING.currentGrant.amount.toLocaleString()}`, x, cy);
}

function drawSlideRight(doc, slide, x, y, w, h, theme) {
  switch (slide.slug) {
    case 'problem':      return drawRightProblem(doc, x, y, w, h, theme);
    case 'solution':     return drawRightSolution(doc, x, y, w, h, theme);
    case 'differentiator': return drawRightDiff(doc, x, y, w, h, theme);
    case 'model':        return drawRightModel(doc, x, y, w, h, theme);
    case 'traction':     return drawRightTraction(doc, x, y, w, h, theme);
    case 'competition':  return drawRightCompetition(doc, x, y, w, h, theme);
    case 'ask':          return drawRightAsk(doc, x, y, w, h, theme);
    default: {
      // Hook, market, roadmap — show key stat
      const stat = slide.stat;
      if (stat) {
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...hexToRgb(theme.colors.accent));
        doc.text(stat.value, x, y + 30);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...hexToRgb(theme.colors.textMuted));
        doc.text(stat.label.toUpperCase(), x, y + 38);
      }
    }
  }
}

// ── PITCH DECK PDF ────────────────────────────────────────────────────────────
export async function generatePitchDeckPDF(theme) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
  const W = 297, H = 210;
  const t = theme.colors;
  const total = SLIDES.length;

  // Layout constants
  const LEFT_W = W * 0.56;   // 55% for content
  const RIGHT_X = LEFT_W + 1;
  const RIGHT_W = W - RIGHT_X - 8;
  const PAD_X = 12, PAD_Y = 20;
  const CONTENT_H = H - 20;

  SLIDES.forEach((slide, idx) => {
    if (idx > 0) doc.addPage();

    // Background
    doc.setFillColor(...hexToRgb(t.bg));
    doc.rect(0, 0, W, H, 'F');

    // Right panel bg
    doc.setFillColor(...hexToRgb(t.bgAlt || t.bg));
    doc.rect(RIGHT_X, 0, W - RIGHT_X, H, 'F');

    // Accent top bar
    doc.setFillColor(...hexToRgb(t.accent));
    doc.rect(0, 0, W, 2.5, 'F');

    // Divider between columns
    doc.setDrawColor(...hexToRgb(t.border));
    doc.line(LEFT_W, 2.5, LEFT_W, H - 15);

    // ── LEFT COLUMN ──────────────────────────────────────────────────────────
    // Eyebrow
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(t.accent));
    doc.text(slide.eyebrow.toUpperCase(), PAD_X, PAD_Y);

    // Headline
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(t.text));
    const headLines = doc.splitTextToSize(slide.headline, LEFT_W - PAD_X * 2);
    headLines.forEach((line, i) => doc.text(line, PAD_X, PAD_Y + 10 + i * 8));
    const afterHead = PAD_Y + 10 + headLines.length * 8;

    // Accent rule
    accentRule(doc, PAD_X, afterHead + 3, theme);

    // Body
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(t.textMuted));
    const bodyLines = doc.splitTextToSize(slide.body, LEFT_W - PAD_X * 2);
    bodyLines.forEach((line, i) => doc.text(line, PAD_X, afterHead + 10 + i * 5));

    // Ghost slide tag
    doc.setFontSize(52);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(theme.isLight ? '#E8E0D0' : (t.surface || '#1C1814').replace('#', '').padStart(6, '0')));
    doc.text(slide.tag, LEFT_W - PAD_X, H - 20, { align: 'right' });

    // ── RIGHT COLUMN ─────────────────────────────────────────────────────────
    drawSlideRight(doc, slide, RIGHT_X + 8, 14, RIGHT_W, CONTENT_H, theme);

    pageFooter(doc, idx + 1, total, theme);
  });

  doc.save('theapp-pitch-deck.pdf');
}

// ── BUSINESS PLAN PDF ─────────────────────────────────────────────────────────
export async function generateBusinessPlanPDF(theme) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const t = theme.colors;
  const total = PLAN_SECTIONS.length + 1;

  // Cover
  doc.setFillColor(...hexToRgb(t.bg));
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFillColor(...hexToRgb(t.accent));
  doc.rect(0, 0, 210, 3, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(t.accent));
  doc.text(`${COMPANY.name.toUpperCase()} — BUSINESS PLAN`, 14, 20);

  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(t.text));
  doc.text(COMPANY.name, 14, 48);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(t.textMuted));
  doc.text('Complete Business Plan', 14, 58);

  accentRule(doc, 14, 66, theme);

  doc.setFontSize(10);
  doc.setTextColor(...hexToRgb(t.textMuted));
  doc.text('One platform. One login. Operational in under an hour.', 14, 76);

  [['5', 'Beta Merchants'], ['$948K', 'ARR · Year 3'], ['$14B+', 'TAM']].forEach(([val, label], i) => {
    const sx = 14 + i * 60;
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(t.text));
    doc.text(val, sx, 108);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(t.accent));
    doc.text(label.toUpperCase(), sx, 114);
  });

  accentRule(doc, 14, 122, theme);

  doc.setFontSize(8);
  doc.setTextColor(...hexToRgb(t.textMuted));
  doc.text(`${FOUNDER.name} · ${FOUNDER.title}`, 14, 132);
  doc.text(`Generated ${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 139);
  doc.text('Confidential — For investor review only', 14, 146);

  // Page footer on cover
  doc.setDrawColor(...hexToRgb(t.border));
  doc.line(14, 284, 196, 284);
  doc.setFontSize(6.5);
  doc.setTextColor(...hexToRgb(t.textFaint));
  doc.text('THEAPP · BUSINESS PLAN', 14, 289);
  doc.text(`1 / ${total}`, 196, 289, { align: 'right' });

  // Sections
  PLAN_SECTIONS.forEach((section, idx) => {
    doc.addPage();
    doc.setFillColor(...hexToRgb(t.bg));
    doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(...hexToRgb(t.accent));
    doc.rect(0, 0, 210, 2, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(t.accent));
    doc.text(section.number, 14, 18);

    doc.setFontSize(17);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(t.text));
    doc.text(section.title, 14, 28);

    accentRule(doc, 14, 34, theme);

    let y = 44;

    const addPageIfNeeded = () => {
      if (y > 270) {
        doc.addPage();
        doc.setFillColor(...hexToRgb(t.bg));
        doc.rect(0, 0, 210, 297, 'F');
        y = 20;
      }
    };

    const writePara = (text, fontSize = 9.5, color = t.textMuted, bold = false) => {
      addPageIfNeeded();
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(...hexToRgb(color));
      const lines = doc.splitTextToSize((text || '').trim(), 182);
      lines.forEach(line => {
        addPageIfNeeded();
        doc.text(line, 14, y);
        y += fontSize * 0.55;
      });
      y += 3;
    };

    if (section.blocks) {
      section.blocks.forEach(block => {
        if (block.type === 'text') {
          writePara(block.text);
        } else if (block.type === 'label') {
          y += 2;
          writePara(block.text.toUpperCase(), 7, t.accent, false);
          y += 1;
        } else if (block.type === 'callout') {
          y += 2;
          doc.setDrawColor(...hexToRgb(t.accent));
          doc.setLineWidth(0.5);
          doc.line(14, y - 2, 14, y + 14);
          writePara(block.text, 9.5, t.text, false);
          y += 2;
        } else if (block.type === 'bullets') {
          block.items.forEach(item => {
            addPageIfNeeded();
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...hexToRgb(t.accent));
            doc.text('—', 14, y);
            doc.setTextColor(...hexToRgb(t.textMuted));
            const lines = doc.splitTextToSize(item, 170);
            lines.forEach((line, li) => {
              doc.text(line, 22, y + li * 5);
            });
            y += lines.length * 5 + 2;
          });
        } else if (block.type === 'weakness') {
          y += 2;
          writePara(block.title, 10, t.text, true);
          writePara('Challenge: ' + block.challenge, 8.5, t.textMuted);
          writePara('Mitigation: ' + block.mitigation, 8.5, t.textMuted);
          y += 2;
        } else if (block.type === 'swot') {
          const quads = [
            { label: 'Strengths',     items: block.strengths },
            { label: 'Weaknesses',    items: block.weaknesses },
            { label: 'Opportunities', items: block.opportunities },
            { label: 'Threats',       items: block.threats },
          ];
          quads.forEach(q => {
            y += 2;
            writePara(q.label.toUpperCase(), 7, t.accent);
            q.items.forEach(item => writePara('— ' + item, 8.5, t.textMuted));
          });
        } else if (block.type === 'placeholder') {
          y += 2;
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...hexToRgb(t.textFaint));
          const lines = doc.splitTextToSize('⏳ ' + block.text, 182);
          lines.forEach(line => { doc.text(line, 14, y); y += 4.5; });
          y += 2;
        }
      });
    } else if (section.content) {
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRgb(t.textMuted));
      section.content.split('\n\n').forEach(para => {
        writePara(para);
      });
    }

    // Footer
    doc.setDrawColor(...hexToRgb(t.border));
    doc.line(14, 284, 196, 284);
    doc.setFontSize(6.5);
    doc.setTextColor(...hexToRgb(t.textFaint));
    doc.text(`${COMPANY.name.toUpperCase()} · BUSINESS PLAN`, 14, 289);
    doc.text(`${idx + 2} / ${total}`, 196, 289, { align: 'right' });
  });

  doc.save(`${COMPANY.name.toLowerCase().replace(/\s+/g, '-')}-business-plan.pdf`);
}

// ── FINANCIALS PDF ────────────────────────────────────────────────────────────
export async function generateFinancialsPDF(theme) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const t = theme.colors;

  doc.setFillColor(...hexToRgb(t.bg));
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFillColor(...hexToRgb(t.accent));
  doc.rect(0, 0, 210, 3, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(t.accent));
  doc.text('THEAPP — FINANCIAL PROJECTIONS', 14, 18);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(t.text));
  doc.text('Financial Summary', 14, 34);

  accentRule(doc, 14, 40, theme);

  // Unit economics
  doc.setFontSize(8);
  doc.setTextColor(...hexToRgb(t.accent));
  doc.text('UNIT ECONOMICS', 14, 52);

  const ueRows = [
    ['ARPU / month', `$${UNIT_ECONOMICS.arpu}`],
    ['Monthly Churn', `${UNIT_ECONOMICS.monthlyChurn * 100}%`],
    ['Lifetime Value', `$${UNIT_ECONOMICS.ltv.toLocaleString()}`],
    ['Customer Acquisition Cost', `$${UNIT_ECONOMICS.cac}`],
    ['LTV : CAC', `${UNIT_ECONOMICS.ltvCacRatio}×`],
    ['Payback Period', `${UNIT_ECONOMICS.paybackMonths} months`],
  ];

  let y = 60;
  ueRows.forEach(([label, val]) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(t.textMuted));
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(t.text));
    doc.text(val, 130, y);
    doc.setDrawColor(...hexToRgb(t.border));
    doc.line(14, y + 2, 196, y + 2);
    y += 9;
  });

  // Milestones
  y += 8;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRgb(t.accent));
  doc.text('3-YEAR MILESTONES', 14, y);
  y += 8;

  MILESTONES.forEach(m => {
    doc.setFillColor(...hexToRgb(t.bgAlt || '#EDE7D9'));
    doc.rect(14, y - 4, 182, 18, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRgb(t.text));
    doc.text(m.label, 20, y + 2);
    doc.setFontSize(9);
    doc.setTextColor(...hexToRgb(t.accent));
    doc.text(`${m.merchants} merchants · $${m.arr.toLocaleString()} ARR`, 20, y + 8);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(t.textMuted));
    doc.text(m.note, 130, y + 5);
    y += 24;
  });

  doc.setDrawColor(...hexToRgb(t.border));
  doc.line(14, 284, 196, 284);
  doc.setFontSize(6.5);
  doc.setTextColor(...hexToRgb(t.textFaint));
  doc.text('THEAPP · FINANCIAL PROJECTIONS', 14, 289);
  doc.text('1 / 1', 196, 289, { align: 'right' });

  doc.save('theapp-financials.pdf');
}
