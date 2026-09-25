// ─── GENERIC DECK EXPORT ──────────────────────────────────────────────────────
// Turns ANY deck from the registry (data/decks/index.js) into a PDF or PPTX,
// straight from its slide data. Add a deck → it is downloadable automatically.
// The investor deck keeps its bespoke exporters (generatePDF/generatePPTX);
// everything else goes through here.
//
// Split into build* (pure, no DOM/save — testable in Node) and download*
// (triggers the browser save).

import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import { COMPANY } from '../data/config.js';

const hexToRgb = (hex) => {
  const c = (hex || '#888888').replace('#', '');
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
};
const bare = (hex) => (hex || '#888888').replace('#', '');

export const deckFileName = (deck, ext) => {
  const co = COMPANY.name.toLowerCase().replace(/\s+/g, '-');
  const stamp = new Date().toISOString().slice(0, 10);
  return `${co}-${deck.id}-${stamp}.${ext}`;
};

// ── PDF (A4 landscape, mm) ────────────────────────────────────────────────────
export function buildDeckPDF(deck, theme) {
  const t = theme.colors;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
  const W = 297, H = 210;
  const LEFT_W = W * 0.6, PAD = 16;
  const total = deck.slides.length;

  deck.slides.forEach((slide, idx) => {
    if (idx > 0) doc.addPage();

    doc.setFillColor(...hexToRgb(t.bg));            doc.rect(0, 0, W, H, 'F');
    doc.setFillColor(...hexToRgb(t.bgAlt || t.bg)); doc.rect(LEFT_W, 0, W - LEFT_W, H, 'F');
    doc.setFillColor(...hexToRgb(t.accent));        doc.rect(0, 0, W, 2.5, 'F');

    // Measure first so the whole text block can be vertically centred.
    doc.setFont('helvetica', 'bold'); doc.setFontSize(24);
    const head = doc.splitTextToSize(slide.headline, LEFT_W - PAD * 2);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11.5);
    const body = doc.splitTextToSize(slide.body, LEFT_W - PAD * 2);
    const headH = head.length * 24 * 0.3528 * 1.2;
    const bodyH = body.length * 11.5 * 0.3528 * 1.5;
    const block = 6 + 8 + headH + 10 + bodyH;
    let y = (H - block) / 2 + 2;

    // Eyebrow
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.setTextColor(...hexToRgb(t.accent));
    doc.text(slide.eyebrow.toUpperCase().split('').join(' '), PAD, y);
    y += 14;

    // Headline
    doc.setFontSize(24);
    doc.setTextColor(...hexToRgb(t.text));
    doc.text(head, PAD, y, { lineHeightFactor: 1.2 });
    y += headH + 2;

    // Rule
    doc.setDrawColor(...hexToRgb(t.accent)); doc.setLineWidth(0.7);
    doc.line(PAD, y, PAD + 16, y);
    y += 9;

    // Body
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11.5);
    doc.setTextColor(...hexToRgb(t.textMuted));
    doc.text(body, PAD, y, { lineHeightFactor: 1.5 });

    // Right panel: oversized slide number
    doc.setFont('helvetica', 'bold'); doc.setFontSize(120);
    doc.setTextColor(...hexToRgb(t.border));
    doc.text(slide.tag || String(idx + 1).padStart(2, '0'), W - 14, H - 28, { align: 'right' });

    // Footer
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5);
    doc.setTextColor(...hexToRgb(t.textFaint));
    doc.text(`${COMPANY.name.toUpperCase()} — ${deck.name.toUpperCase()}`, PAD, H - 10);
    doc.text(`${idx + 1} / ${total}`, W - 14, H - 10, { align: 'right' });
  });

  return doc;
}

export async function downloadDeckPDF(theme, deck) {
  buildDeckPDF(deck, theme).save(deckFileName(deck, 'pdf'));
}

// ── PPTX (16:9, inches) ───────────────────────────────────────────────────────
export function buildDeckPPTX(deck, theme) {
  const t = theme.colors;
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = `${COMPANY.name} — ${deck.name}`;
  const W = 13.33, H = 7.5, LEFT_W = 8, PAD = 0.7;

  deck.slides.forEach((slide, idx) => {
    const s = pptx.addSlide();
    s.background = { color: bare(t.bg) };
    s.addShape(pptx.ShapeType.rect, { x: LEFT_W, y: 0, w: W - LEFT_W, h: H, fill: { color: bare(t.bgAlt || t.bg) }, line: { color: bare(t.bgAlt || t.bg) } });
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.07, fill: { color: bare(t.accent) }, line: { color: bare(t.accent) } });

    s.addText(slide.eyebrow.toUpperCase(), { x: PAD, y: 0.9, w: LEFT_W - PAD * 2, h: 0.3, fontSize: 9, bold: true, color: bare(t.accent), fontFace: 'Arial', charSpacing: 3 });
    s.addText(slide.headline, { x: PAD, y: 1.3, w: LEFT_W - PAD * 2, h: 2.2, fontSize: 28, bold: true, color: bare(t.text), fontFace: 'Arial', valign: 'top' });
    s.addShape(pptx.ShapeType.rect, { x: PAD, y: 3.65, w: 0.6, h: 0.04, fill: { color: bare(t.accent) }, line: { color: bare(t.accent) } });
    s.addText(slide.body, { x: PAD, y: 3.85, w: LEFT_W - PAD * 2, h: 2.6, fontSize: 13, color: bare(t.textMuted), fontFace: 'Arial', valign: 'top', lineSpacingMultiple: 1.4 });

    s.addText(slide.tag || String(idx + 1).padStart(2, '0'), { x: LEFT_W, y: 3.9, w: W - LEFT_W - 0.4, h: 3, fontSize: 130, bold: true, color: bare(t.border), fontFace: 'Arial', align: 'right', valign: 'bottom' });
    s.addText(`${COMPANY.name.toUpperCase()} — ${deck.name.toUpperCase()}`, { x: PAD, y: H - 0.5, w: 7, h: 0.3, fontSize: 7, color: bare(t.textFaint), fontFace: 'Arial' });
    s.addText(`${idx + 1} / ${deck.slides.length}`, { x: W - 2, y: H - 0.5, w: 1.6, h: 0.3, fontSize: 7, color: bare(t.textFaint), fontFace: 'Arial', align: 'right' });

    // Presenter notes travel with the .pptx (not shown on slides)
    if (slide.speakerNote) s.addNotes(slide.speakerNote);
  });

  return pptx;
}

export async function downloadDeckPPTX(theme, deck) {
  await buildDeckPPTX(deck, theme).writeFile({ fileName: deckFileName(deck, 'pptx') });
}
