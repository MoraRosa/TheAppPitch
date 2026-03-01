// ─── CLIENT-SIDE PPTX GENERATOR ───────────────────────────────────────────────
// Generates a real .pptx from live slide data using pptxgenjs.
// Always reflects current content. No server needed.

import PptxGenJS from 'pptxgenjs';
import { SLIDES } from '../data/slides.js';

export async function generatePitchDeckPPTX(theme) {
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_WIDE'; // 16:9
  pptx.title = 'TheApp — Investor Pitch Deck';
  pptx.subject = 'TheApp Investor Presentation';
  pptx.author = 'TheApp';

  const isLight = theme.isLight;
  const bg = theme.colors.bg.replace('#', '');
  const textMain = theme.colors.text.replace('#', '');
  const textMuted = theme.colors.textMuted.replace('#', '');
  const accentColor = theme.colors.accent.replace('#', '');
  const borderColor = theme.colors.border.replace('#', '');

  // Define master slide
  pptx.defineSlideMaster({
    title: 'THEAPP_MASTER',
    background: { color: bg },
    objects: [
      // Accent top bar
      { rect: { x: 0, y: 0, w: '100%', h: 0.06, fill: { color: accentColor } } },
      // Bottom rule
      { line: { x: 0.5, y: 7.1, w: 12.5, line: { color: borderColor, width: 0.5 } } },
      // Footer left
      { text: {
        text: 'THEAPP — INVESTOR PITCH',
        options: { x: 0.5, y: 7.15, w: 4, h: 0.25, fontSize: 7, color: textMuted, fontFace: 'Arial' }
      }},
    ],
    slideNumber: { x: 12.3, y: 7.15, color: accentColor, fontFace: 'Arial', fontSize: 7 },
  });

  SLIDES.forEach((slide, idx) => {
    const s = pptx.addSlide({ masterName: 'THEAPP_MASTER' });

    // Ghost slide number background
    s.addText(slide.tag, {
      x: 9.5, y: 4.5, w: 3, h: 2.5,
      fontSize: 88, bold: true,
      color: isLight ? 'E8E0D0' : (theme.colors.surface || '1C1814').replace('#', ''),
      align: 'right', valign: 'bottom',
      fontFace: 'Arial',
      transparency: 0,
    });

    // Eyebrow
    s.addText(slide.eyebrow.toUpperCase(), {
      x: 0.5, y: 0.45, w: 8, h: 0.3,
      fontSize: 8, color: accentColor,
      fontFace: 'Arial', charSpacing: 3,
    });

    // Headline
    s.addText(slide.headline, {
      x: 0.5, y: 0.85, w: 10.5, h: 2.2,
      fontSize: 26, bold: true, color: textMain,
      fontFace: 'Arial', valign: 'top',
      breakLine: true,
    });

    // Accent rule (as thin rect)
    s.addShape(pptx.ShapeType.rect, {
      x: 0.5, y: 3.2, w: 0.8, h: 0.04,
      fill: { color: accentColor }, line: { color: accentColor },
    });

    // Body
    s.addText(slide.body, {
      x: 0.5, y: 3.35, w: 10, h: 2.5,
      fontSize: 12, color: textMuted,
      fontFace: 'Arial', valign: 'top',
      breakLine: true, lineSpacingMultiple: 1.4,
    });

    // Slide label bottom right
    s.addText(`${idx + 1} / ${SLIDES.length}`, {
      x: 11.5, y: 7.15, w: 1.5, h: 0.25,
      fontSize: 7, color: textMuted,
      fontFace: 'Arial', align: 'right',
    });
  });

  await pptx.writeFile({ fileName: 'theapp-pitch-deck.pptx' });
}
