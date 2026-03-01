// ─── CLIENT-SIDE PDF GENERATOR ────────────────────────────────────────────────
// Generates PDF from live app data — always reflects current content.
// No server. No upload. No stale files.

import jsPDF from 'jspdf';
import { PLAN_SECTIONS } from '../data/plan.js';
import { SLIDES } from '../data/slides.js';
import { MILESTONES, UNIT_ECONOMICS } from '../data/financials.js';
import { FOUNDER } from '../data/founder.js';

// ── Shared helpers ─────────────────────────────────────────────────────────────
function addPageHeader(doc, title, theme) {
  doc.setFillColor(...hexToRgb(theme.colors.bgAlt || '#F7F2E8'));
  doc.rect(0, 0, 210, 18, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...hexToRgb(theme.colors.textFaint || '#A89880'));
  doc.setFont('helvetica', 'normal');
  doc.text('THEAPP — INVESTOR MATERIALS', 14, 7);
  doc.text(title.toUpperCase(), 196, 7, { align: 'right' });
  doc.setDrawColor(...hexToRgb(theme.colors.border || '#D4C9B0'));
  doc.line(14, 10, 196, 10);
}

function addPageFooter(doc, pageNum, totalPages, theme) {
  const y = 285;
  doc.setDrawColor(...hexToRgb(theme.colors.border || '#D4C9B0'));
  doc.line(14, y, 196, y);
  doc.setFontSize(7);
  doc.setTextColor(...hexToRgb(theme.colors.textFaint || '#A89880'));
  doc.text(`TheApp · ${new Date().getFullYear()}`, 14, y + 5);
  doc.text(`${pageNum} / ${totalPages}`, 196, y + 5, { align: 'right' });
}

function wrapAndWrite(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line, i) => doc.text(line, x, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b];
}

function accentLine(doc, x, y, theme) {
  doc.setDrawColor(...hexToRgb(theme.colors.accent));
  doc.setLineWidth(0.8);
  doc.line(x, y, x + 32, y);
  doc.setLineWidth(0.2);
}

// ── BUSINESS PLAN PDF ─────────────────────────────────────────────────────────
export async function generateBusinessPlanPDF(theme) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const totalPages = PLAN_SECTIONS.length + 1;
  const accent = hexToRgb(theme.colors.accent);
  const textColor = hexToRgb(theme.colors.text);
  const mutedColor = hexToRgb(theme.colors.textMuted);

  // ── Cover page
  doc.setFillColor(...hexToRgb(theme.colors.bg));
  doc.rect(0, 0, 210, 297, 'F');

  // Accent top strip
  doc.setFillColor(...accent);
  doc.rect(0, 0, 210, 4, 'F');

  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(theme.colors.accent));
  doc.setFont('helvetica', 'normal');
  doc.text('THEAPP — BUSINESS PLAN', 14, 24);

  doc.setFontSize(32);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'bold');
  doc.text('TheApp', 14, 52);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text('Complete Business Plan', 14, 64);

  accentLine(doc, 14, 74, theme);

  doc.setFontSize(11);
  doc.setTextColor(...mutedColor);
  doc.text('One platform. One login. Operational in under an hour.', 14, 84);

  // Stats
  const stats = [
    ['5', 'Beta Merchants'],
    ['$948K', 'ARR · Year 3'],
    ['$14B+', 'TAM'],
  ];
  let sx = 14;
  stats.forEach(([val, label]) => {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text(val, sx, 120);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(theme.colors.accent));
    doc.text(label.toUpperCase(), sx, 127);
    sx += 60;
  });

  accentLine(doc, 14, 136, theme);

  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.text(`${FOUNDER.name} · ${FOUNDER.title}`, 14, 146);
  doc.text(`Generated ${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 153);
  doc.text('Confidential — For investor review only', 14, 160);

  addPageFooter(doc, 1, totalPages, theme);

  // ── Section pages
  PLAN_SECTIONS.forEach((section, idx) => {
    doc.addPage();
    const pageNum = idx + 2;

    doc.setFillColor(...hexToRgb(theme.colors.bg));
    doc.rect(0, 0, 210, 297, 'F');

    addPageHeader(doc, section.title, theme);

    // Section number
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(theme.colors.accent));
    doc.text(section.number, 14, 26);

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text(section.title, 14, 36);

    accentLine(doc, 14, 42, theme);

    // Body
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);

    let y = 52;
    const paragraphs = section.content.split('\n\n');
    paragraphs.forEach(para => {
      if (y > 272) { doc.addPage(); y = 24; }
      y = wrapAndWrite(doc, para.trim(), 14, y, 182, 5.5);
      y += 5;
    });

    addPageFooter(doc, pageNum, totalPages, theme);
  });

  doc.save('theapp-business-plan.pdf');
}

// ── PITCH DECK PDF ────────────────────────────────────────────────────────────
export async function generatePitchDeckPDF(theme) {
  // Landscape A4 for slide format
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
  const W = 297, H = 210;
  const accent = hexToRgb(theme.colors.accent);
  const textColor = hexToRgb(theme.colors.text);
  const mutedColor = hexToRgb(theme.colors.textMuted);
  const bg = hexToRgb(theme.colors.bg);

  SLIDES.forEach((slide, idx) => {
    if (idx > 0) doc.addPage();

    // Background
    doc.setFillColor(...bg);
    doc.rect(0, 0, W, H, 'F');

    // Accent top bar
    doc.setFillColor(...accent);
    doc.rect(0, 0, W, 3, 'F');

    // Slide number — large ghost
    doc.setFontSize(72);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(
      ...hexToRgb(theme.isLight ? '#E8E0D0' : (theme.colors.surface || '#1C1814'))
    );
    doc.text(slide.tag, W - 20, H - 16, { align: 'right' });

    // Eyebrow
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...accent);
    doc.text(slide.eyebrow.toUpperCase(), 20, 22);

    // Headline
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    const headLines = doc.splitTextToSize(slide.headline, 200);
    headLines.forEach((line, i) => doc.text(line, 20, 40 + i * 10));

    const bodyY = 40 + headLines.length * 10 + 8;

    // Accent rule
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.6);
    doc.line(20, bodyY, 52, bodyY);

    // Body
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    const bodyLines = doc.splitTextToSize(slide.body, 200);
    bodyLines.forEach((line, i) => doc.text(line, 20, bodyY + 8 + i * 5.5));

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(...hexToRgb(theme.colors.textFaint || '#A89880'));
    doc.text('THEAPP — INVESTOR PITCH', 20, H - 8);
    doc.text(`${idx + 1} / ${SLIDES.length}`, W - 20, H - 8, { align: 'right' });
    doc.setDrawColor(...hexToRgb(theme.colors.border || '#D4C9B0'));
    doc.line(20, H - 13, W - 20, H - 13);
  });

  doc.save('theapp-pitch-deck.pdf');
}

// ── FINANCIALS PDF ────────────────────────────────────────────────────────────
export async function generateFinancialsPDF(theme) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const accent = hexToRgb(theme.colors.accent);
  const textColor = hexToRgb(theme.colors.text);
  const mutedColor = hexToRgb(theme.colors.textMuted);

  doc.setFillColor(...hexToRgb(theme.colors.bg));
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFillColor(...accent);
  doc.rect(0, 0, 210, 4, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...accent);
  doc.text('THEAPP — FINANCIAL PROJECTIONS', 14, 22);

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Financial Summary', 14, 40);

  accentLine(doc, 14, 47, theme);

  // Unit economics table
  doc.setFontSize(10);
  doc.setTextColor(...accent);
  doc.text('UNIT ECONOMICS', 14, 60);

  const ueRows = [
    ['ARPU / month', `$${UNIT_ECONOMICS.arpu}`],
    ['Monthly Churn', `${UNIT_ECONOMICS.monthlyChurn * 100}%`],
    ['Lifetime Value (LTV)', `$${UNIT_ECONOMICS.ltv.toLocaleString()}`],
    ['Customer Acquisition Cost (CAC)', `$${UNIT_ECONOMICS.cac}`],
    ['LTV : CAC Ratio', `${UNIT_ECONOMICS.ltvCacRatio}×`],
    ['Payback Period', `${UNIT_ECONOMICS.paybackMonths} months`],
  ];

  let y = 68;
  ueRows.forEach(([label, val]) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text(val, 130, y);
    doc.setDrawColor(...hexToRgb(theme.colors.border || '#D4C9B0'));
    doc.line(14, y + 2, 196, y + 2);
    y += 9;
  });

  // Milestones
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...accent);
  doc.text('3-YEAR MILESTONES', 14, y);
  y += 10;

  MILESTONES.forEach(m => {
    doc.setFillColor(...hexToRgb(theme.colors.bgAlt || '#EDE7D9'));
    doc.rect(14, y - 5, 182, 18, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text(m.label, 20, y + 3);
    doc.setFontSize(10);
    doc.setTextColor(...accent);
    doc.text(`${m.merchants} merchants · $${m.arr.toLocaleString()} ARR`, 20, y + 10);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text(m.note, 130, y + 6);
    y += 24;
  });

  addPageFooter(doc, 1, 1, theme);
  doc.save('theapp-financials.pdf');
}
