import { useState } from "react";

const AESTHETICS = [
  {
    id: "A",
    name: "Founder's Manuscript",
    tagline: "Like a handcrafted business journal. Warm ivory, ink, editorial weight.",
    vibe: "High-end magazine meets founder diary. Think Monocle or The Gentlewoman — lots of breathing room, serif headlines, subtle warm paper texture, thin ink-like rules, editorial grid with intentional asymmetry.",
    palette: ["#F7F2E8", "#1C1510", "#C9A96E", "#8B7355", "#E8E0D0"],
    paletteNames: ["Ivory Paper", "Deep Ink", "Warm Gold", "Walnut", "Parchment"],
    fonts: ["Cormorant Garamond", "DM Sans"],
    mood: "Confident. Considered. Premium. Human.",
    bestFor: "Investors who respect craft and intentionality",
    bg: "#F7F2E8",
    text: "#1C1510",
    accent: "#C9A96E",
    border: "#D4C9B0",
    isLight: true,
    sampleHeadline: "One platform. Every small business. Built in Canada.",
    sampleSub: "TheApp replaces the stack of disconnected tools that small makers are forced to stitch together.",
  },
  {
    id: "B",
    name: "Midnight Operator",
    tagline: "Dark, precise, technical. Like a well-funded startup's investor deck.",
    vibe: "Deep charcoal backgrounds, sharp geometric accents, monospace data labels, clean sans-serif. Feels like the cockpit of a serious product. Linear gradients, subtle grid lines, crisp data visualization aesthetic.",
    palette: ["#0D0F14", "#1A1D26", "#4A9EFF", "#E8EDF5", "#2A2F3E"],
    paletteNames: ["Deep Space", "Surface", "Electric Blue", "Off-White", "Muted"],
    fonts: ["Inter", "Space Mono"],
    mood: "Technical. Precise. Ambitious. Scalable.",
    bestFor: "Tech investors, grant evaluators who want to see a real operator",
    bg: "#0D0F14",
    text: "#E8EDF5",
    accent: "#4A9EFF",
    border: "#2A2F3E",
    isLight: false,
    sampleHeadline: "One platform. Every small business. Built in Canada.",
    sampleSub: "TheApp replaces the stack of disconnected tools that small makers are forced to stitch together.",
  },
  {
    id: "C",
    name: "Warm Brutalist",
    tagline: "Raw editorial power. Oversized type, structured grids, terracotta warmth.",
    vibe: "Think Neue Haas Grotesk at 120px, hard borders, strong column grids, warm terracotta and cream. Feels like a premium brand agency's annual report. Nothing soft — but not cold either. Structured and human at the same time.",
    palette: ["#F2EBE0", "#1A1210", "#C4603A", "#2B4A3F", "#D4C5B0"],
    paletteNames: ["Cream", "Almost Black", "Terracotta", "Forest", "Sand"],
    fonts: ["Playfair Display", "DM Sans"],
    mood: "Assertive. Warm. Design-forward. Memorable.",
    bestFor: "Anyone who appreciates bold design as a signal of product quality",
    bg: "#F2EBE0",
    text: "#1A1210",
    accent: "#C4603A",
    border: "#1A1210",
    isLight: true,
    sampleHeadline: "One platform. Every small business. Built in Canada.",
    sampleSub: "TheApp replaces the stack of disconnected tools that small makers are forced to stitch together.",
  },
  {
    id: "D",
    name: "Dark Editorial",
    tagline: "The pitch deck that looks like it belongs in a gallery. Dark, gold, refined.",
    vibe: "Deep near-black backgrounds, champagne and gold type accents, wide editorial margins, italic serif headlines, very generous spacing. Feels like a Wallpaper* magazine spread or a luxury brand lookbook. Every element placed with intention.",
    palette: ["#0E0C09", "#1C1814", "#C9A96E", "#8A7D6E", "#F5F0E8"],
    paletteNames: ["Near Black", "Dark Surface", "Champagne Gold", "Muted Warm", "Cream Text"],
    fonts: ["Cormorant Garamond", "DM Sans"],
    mood: "Luxurious. Refined. Cinematic. Authoritative.",
    bestFor: "Presentations where you want people to feel the premium before they read a word",
    bg: "#0E0C09",
    text: "#F5F0E8",
    accent: "#C9A96E",
    border: "#2A2420",
    isLight: false,
    sampleHeadline: "One platform. Every small business. Built in Canada.",
    sampleSub: "TheApp replaces the stack of disconnected tools that small makers are forced to stitch together.",
  },
  {
    id: "E",
    name: "Canadian Print",
    tagline: "Clean, red-accented, bold. Confidence of a national brand. No frills, all substance.",
    vibe: "Crisp white, strong black type, strategic use of red as the only accent. Very Swiss-influenced grid, but with warmth. Looks like a serious Canadian company's annual report or a Maclean's feature piece. Zero decoration — power comes from pure typographic hierarchy.",
    palette: ["#FAFAF8", "#111111", "#CC2929", "#555555", "#E8E8E4"],
    paletteNames: ["White", "Black", "Canadian Red", "Slate", "Light Grey"],
    fonts: ["Libre Baskerville", "DM Sans"],
    mood: "Trustworthy. National. Confident. Clear.",
    bestFor: "Grant applications, community-focused investors, Canadian audiences",
    bg: "#FAFAF8",
    text: "#111111",
    accent: "#CC2929",
    border: "#E0E0DC",
    isLight: true,
    sampleHeadline: "One platform. Every small business. Built in Canada.",
    sampleSub: "TheApp replaces the stack of disconnected tools that small makers are forced to stitch together.",
  },
];

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;1,400&family=Libre+Baskerville:ital,wght@0,700;1,400&display=swap');`;

export default function AestheticExplorer() {
  const [active, setActive] = useState("A");
  const [hovering, setHovering] = useState(null);

  const current = AESTHETICS.find((a) => a.id === active);

  const headlineFont = {
    A: "'Cormorant Garamond', serif",
    B: "'Space Mono', monospace",
    C: "'Playfair Display', serif",
    D: "'Cormorant Garamond', serif",
    E: "'Libre Baskerville', serif",
  }[active];

  const headlineFontStyle = {
    A: "italic",
    B: "normal",
    C: "italic",
    D: "italic",
    E: "normal",
  }[active];

  const headlineFontWeight = {
    A: 300,
    B: 700,
    C: 700,
    D: 300,
    E: 700,
  }[active];

  return (
    <div style={{ minHeight: "100vh", background: "#0A0806", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        ${fontImport}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; }

        @keyframes previewFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .preview-animate { animation: previewFade 0.35s ease forwards; }

        @keyframes chipPop {
          from { transform: scale(0.95); opacity: 0.6; }
          to { transform: scale(1); opacity: 1; }
        }
        .chip-active { animation: chipPop 0.2s ease forwards; }

        .tab-btn {
          background: none;
          border: 1px solid #2a2420;
          color: #8a7d6e;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .tab-btn:hover {
          border-color: #5a4f42;
          color: #c9a96e;
        }
        .tab-btn.active {
          background: #1e1a16;
          border-color: #c9a96e;
          color: #c9a96e;
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "24px 32px 20px",
        borderBottom: "1px solid #1e1a16",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            color: "#4a3f30",
            letterSpacing: "0.25em",
            marginBottom: 4,
          }}>
            THEAPP PITCH SITE — AESTHETIC DIRECTION
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 22,
            color: "#F5F0E8",
            fontWeight: 300,
          }}>
            Choose your visual identity
          </div>
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: "#4a3f30",
          maxWidth: 280,
          lineHeight: 1.6,
        }}>
          5 distinct directions. Each is a complete design system — not just a color swap.
        </div>
      </div>

      {/* Tab selector */}
      <div style={{
        padding: "16px 32px",
        borderBottom: "1px solid #1e1a16",
        display: "flex",
        gap: 8,
        overflowX: "auto",
      }}>
        {AESTHETICS.map((a) => (
          <button
            key={a.id}
            className={`tab-btn ${active === a.id ? "active" : ""}`}
            onClick={() => setActive(a.id)}
          >
            {a.id} — {a.name}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1200 }}>

        {/* LEFT — Live Preview */}
        <div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            color: "#4a3f30",
            letterSpacing: "0.2em",
            marginBottom: 12,
          }}>
            LIVE PREVIEW — {current.name.toUpperCase()}
          </div>

          {/* Preview card */}
          <div
            key={active}
            className="preview-animate"
            style={{
              background: current.bg,
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${current.border}`,
              minHeight: 420,
            }}
          >
            {/* Simulated nav */}
            <div style={{
              borderBottom: `1px solid ${current.border}`,
              padding: "14px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div style={{
                fontFamily: headlineFont,
                fontSize: 15,
                fontStyle: headlineFontStyle,
                fontWeight: headlineFontWeight,
                color: current.text,
              }}>
                TheApp
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                {["Pitch", "Plan", "Financials"].map((item) => (
                  <span key={item} style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    color: current.isLight ? current.text + "99" : current.text + "80",
                    fontWeight: 400,
                  }}>
                    {item}
                  </span>
                ))}
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: current.accent,
                  fontWeight: 500,
                  borderBottom: `1px solid ${current.accent}`,
                  paddingBottom: 1,
                }}>
                  Download
                </span>
              </div>
            </div>

            {/* Hero section */}
            <div style={{ padding: "40px 32px 28px" }}>
              {/* Eyebrow */}
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.25em",
                color: current.accent,
                marginBottom: 16,
                textTransform: "uppercase",
              }}>
                {active === "B" ? "// INVESTOR_PITCH_DECK.EXE" : active === "E" ? "CANADA · SAAS · 2026" : "THE APP — INVESTOR PITCH · 2026"}
              </div>

              {/* Headline */}
              <h1 style={{
                fontFamily: headlineFont,
                fontStyle: headlineFontStyle,
                fontWeight: headlineFontWeight,
                fontSize: active === "C" ? 32 : active === "B" ? 20 : 30,
                lineHeight: 1.15,
                color: active === "C" ? current.accent : current.text,
                marginBottom: 16,
                maxWidth: 460,
              }}>
                {current.sampleHeadline}
              </h1>

              {/* Body */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: 13,
                lineHeight: 1.7,
                color: current.isLight ? current.text + "99" : current.text + "90",
                maxWidth: 400,
                marginBottom: 28,
              }}>
                {current.sampleSub}
              </p>

              {/* CTA row */}
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button style={{
                  background: active === "C" ? current.text : current.accent,
                  color: active === "C" ? current.bg : (current.isLight ? "#fff" : "#0E0C09"),
                  border: "none",
                  padding: "10px 22px",
                  borderRadius: active === "C" ? 0 : 6,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: active === "C" ? "0.05em" : 0,
                }}>
                  View Pitch Deck
                </button>
                <button style={{
                  background: "none",
                  color: current.isLight ? current.text + "99" : current.text + "80",
                  border: `1px solid ${current.border}`,
                  padding: "10px 22px",
                  borderRadius: active === "C" ? 0 : 6,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                }}>
                  Download PDF
                </button>
              </div>
            </div>

            {/* Stats strip */}
            <div style={{
              borderTop: `1px solid ${current.border}`,
              padding: "20px 32px",
              display: "flex",
              gap: 32,
            }}>
              {[
                { num: "5", label: "Beta merchants" },
                { num: "$948K", label: "ARR · Year 3" },
                { num: "3.8M", label: "CA small businesses" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{
                    fontFamily: headlineFont,
                    fontStyle: active === "A" || active === "D" ? "italic" : "normal",
                    fontSize: active === "B" ? 18 : 22,
                    fontWeight: active === "B" ? 700 : 300,
                    color: current.text,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}>
                    {stat.num}
                  </div>
                  <div style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 8,
                    color: current.accent,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name + tagline */}
          <div key={active} className="preview-animate">
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 26,
              color: "#F5F0E8",
              fontWeight: 300,
              marginBottom: 4,
            }}>
              {current.name}
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#8a7d6e",
              lineHeight: 1.6,
            }}>
              {current.tagline}
            </div>
          </div>

          {/* Palette */}
          <div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: "#4a3f30",
              letterSpacing: "0.2em",
              marginBottom: 10,
            }}>
              COLOUR PALETTE
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {current.palette.map((color, i) => (
                <div key={color} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: color,
                    border: "1px solid #2a2420",
                    marginBottom: 4,
                  }} />
                  <div style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 7,
                    color: "#4a3f30",
                    maxWidth: 42,
                    lineHeight: 1.3,
                    textAlign: "center",
                  }}>
                    {current.paletteNames[i]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{
            background: "#0E0C09",
            border: "1px solid #1e1a16",
            borderRadius: 10,
            padding: "16px 18px",
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: "#4a3f30",
              letterSpacing: "0.2em",
              marginBottom: 8,
            }}>
              DESIGN LANGUAGE
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "#8a7d6e",
              lineHeight: 1.7,
            }}>
              {current.vibe}
            </p>
          </div>

          {/* Mood + Best for */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{
              background: "#0E0C09",
              border: "1px solid #1e1a16",
              borderRadius: 10,
              padding: "14px 16px",
            }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#4a3f30", letterSpacing: "0.2em", marginBottom: 6 }}>
                MOOD
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#c9a96e", lineHeight: 1.6 }}>
                {current.mood}
              </div>
            </div>
            <div style={{
              background: "#0E0C09",
              border: "1px solid #1e1a16",
              borderRadius: 10,
              padding: "14px 16px",
            }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#4a3f30", letterSpacing: "0.2em", marginBottom: 6 }}>
                WORKS BEST FOR
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8a7d6e", lineHeight: 1.6 }}>
                {current.bestFor}
              </div>
            </div>
          </div>

          {/* Typography sample */}
          <div style={{
            background: "#0E0C09",
            border: "1px solid #1e1a16",
            borderRadius: 10,
            padding: "14px 16px",
          }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#4a3f30", letterSpacing: "0.2em", marginBottom: 10 }}>
              TYPOGRAPHY PAIRING
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
              {current.fonts.map((font, i) => (
                <div key={font}>
                  <div style={{
                    fontFamily: `'${font}', ${i === 0 ? "serif" : "sans-serif"}`,
                    fontSize: i === 0 ? 20 : 13,
                    color: "#F5F0E8",
                    fontStyle: (active === "A" || active === "D") && i === 0 ? "italic" : "normal",
                    fontWeight: i === 0 ? 300 : 400,
                    marginBottom: 2,
                  }}>
                    Aa Bb Cc
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#4a3f30" }}>
                    {font} · {i === 0 ? "Display" : "Body"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation flag */}
          {(active === "A" || active === "D") && (
            <div style={{
              background: "linear-gradient(135deg, #1e1a0e, #1a160a)",
              border: "1px solid #c9a96e40",
              borderRadius: 10,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <div style={{ fontSize: 16 }}>✦</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#c9a96e", lineHeight: 1.5 }}>
                <strong>Strong match</strong> for your warm & editorial preference.{" "}
                {active === "A" ? "A is the light-mode version." : "D is the dark-mode version."}{" "}
                These two can even be combined — light for the business plan, dark for the pitch deck.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom note */}
      <div style={{
        padding: "16px 32px 32px",
        borderTop: "1px solid #1e1a16",
        marginTop: 8,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        color: "#4a3f30",
        lineHeight: 1.7,
        maxWidth: 700,
      }}>
        <strong style={{ color: "#8a7d6e" }}>Mixing is valid.</strong> You can use A (light) for the readable business plan sections and D (dark) for the pitch deck presenter — they share the same font DNA (Cormorant Garamond + DM Sans) so they feel like one cohesive system. Many premium investor sites do exactly this.
      </div>
    </div>
  );
}
