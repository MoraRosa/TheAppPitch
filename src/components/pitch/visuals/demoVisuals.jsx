// ─── PRODUCT DEMO DECK — INTERACTIVE MOCKUPS ──────────────────────────────────
// Each of these is a small, real, clickable mini-interface — not a screenshot.
// They stand in for product photography we don't have yet: click a tab, add
// something to a cart, swap a theme. They use theme.colors so they repaint
// automatically with the presenter's active theme (including Showroom).

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { Check, UserPlus, CheckCircle2, CreditCard, Truck, Mail, Package, Sparkles, Store, ShoppingCart, Users, FileText, PieChart, Calendar, Briefcase, ClipboardList, Lock } from 'lucide-react';
import { SiShopify, SiMailchimp, SiGooglesheets, SiCalendly, SiQuickbooks, SiNotion, SiTrello, SiStripe, SiDropbox, SiZoom, SiHubspot, SiGmail, SiAirtable } from 'react-icons/si';
import DeviceFrame from './DeviceFrame.jsx';
import ProductImg from './ProductImg.jsx';
import AutoCursor from './AutoCursor.jsx';
import { sleep, glide, pointAndClick, typeText } from '../../../utils/demoScript.js';
import { ProductDetailView, BlogPostView, ContactView, CONTACT_SEND_MS, CheckoutView, SHIP_CALC_MS, PAY_MS } from './storefrontViews.jsx';
import { useSlideEntered } from '../../../context/SlideTransitionContext.jsx';
import { ScrollReveal, CountUp, Reveal } from '../motion.jsx';
import { COMPANY, PRICING } from '../../../data/config.js';
import { COMPETITOR_COST_STACK } from '../../../data/financials.js';
import { EMBER_MOSS_BRAND, EMBER_MOSS_PRODUCTS, EMBER_MOSS_JOURNAL, EMBER_MOSS_TESTIMONIALS, EMBER_MOSS_FAQ, STOREFRONT_THEME_SWATCHES } from '../../../data/decks/emberMoss.js';



// ── 1. welcome — hero storefront frame ──────────────────────────────────────────
// Ember & Moss is the example brand shown throughout the storefront-facing
// slides — drop the real photos into /public/demo-assets/ember-moss/ (see
// build notes) and this repaints itself automatically, no code changes.
function MockupWelcome({ theme, size, isFullscreen, autoDemo = false, paceMs = 20000 }) {
  const t = theme.colors;
  const [heroFailed, setHeroFailed] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [view, setView] = useState({ type: 'home' });
  const [cart, setCart] = useState({});
  const featured = EMBER_MOSS_PRODUCTS.slice(0, 3);
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);
  const slideEntered = useSlideEntered();
  const frameRef = useRef(null);

  const goHome = () => setView({ type: 'home' });
  const openShop = () => setView({ type: 'shop' });
  const openProduct = (p) => setView({ type: 'product', product: p });
  const openPost = (post) => setView({ type: 'post', post });
  const addToCart = (p) => setCart(c => ({ ...c, [p.name]: (c[p.name] || 0) + 1 }));
  const setQty = (name, qty) => setCart(c => {
    if (qty <= 0) { const { [name]: _, ...rest } = c; return rest; }
    return { ...c, [name]: qty };
  });

  // Motion-graphics beat: this is the audience's very first look at the
  // storefront, so it gets a guided tour with a visible cursor: read down the
  // landing page, click a featured product, add it to the cart, click Shop,
  // browse the full catalog, then click Contact. A real click, wheel or touch
  // anywhere hands control straight back.
  const liveRef = useRef(true);
  const cursorRef = useRef(null);
  const contactRef = useRef(null);
  const cancelAuto = () => { liveRef.current = false; cursorRef.current?.hide(); };

  useEffect(() => {
    if (!autoDemo || !slideEntered) return;
    liveRef.current = true;
    setView({ type: 'home' }); setCart({});
    const frame = frameRef.current;
    const isLive = () => liveRef.current;
    const k = paceMs / 36000; // baseline tour (incl. contact form) is timed against a 36s slide
    const wait = (ms) => sleep(ms * k);
    const glideTo = (to, ms) => glide(frameRef.current, to, Math.max(900, ms * k), isLive);
    const click = (selector, onClick) => pointAndClick({ cursorRef, frameRef, selector, isLive, moveMs: Math.max(500, 800 * k), onClick });
    const stop = () => cancelAuto();
    frame?.addEventListener('wheel', stop, { passive: true });
    frame?.addEventListener('touchstart', stop, { passive: true });

    // click a form field, then type into it like a person would
    const fill = async (field, text, cps) => {
      if (!(await click(`[data-demo="contact-${field}"]`, () => contactRef.current?.focus(field)))) return false;
      await wait(250);
      return typeText(text, isLive, (v) => contactRef.current?.setValue(field, v), cps);
    };

    (async () => {
      await wait(700);
      await glideTo('bottom', 3400);                 // read all the way down the homepage
      await wait(500);
      await glideTo(0, 1800);                        // ...and back up
      await wait(300);
      if (!(await click('[data-demo="featured-1"]', () => openProduct(featured[1])))) return;
      await wait(700);
      if (!(await click('[data-demo="add-to-cart"]', () => addToCart(featured[1])))) return;
      await wait(700);
      if (!(await click('[data-demo="nav-shop"]', openShop))) return;   // the REAL shop page
      await wait(800);
      await glideTo('bottom', 3000);                 // scroll the full catalog
      await wait(400);
      await glideTo(0, 1500);
      await wait(300);
      if (!(await click('[data-demo="nav-contact"]', () => setView({ type: 'contact' })))) return;
      await wait(900);                               // let the contact page land
      if (!(await fill('name', 'Mira Halloran', 18))) return;
      await wait(250);
      if (!(await fill('email', 'mira@example.com', 20))) return;
      await wait(250);
      if (!(await fill('message', 'Hi! Do you ship Dragon Mint Tea internationally?', 30))) return;
      await wait(500);
      if (!(await click('[data-demo="contact-send"]', () => contactRef.current?.send()))) return;
      cursorRef.current?.hide();                     // paper plane takes over from here
      await sleep(CONTACT_SEND_MS + 1800);           // fly away, then hold on the sent screen
    })();

    return () => {
      liveRef.current = false;
      frame?.removeEventListener('wheel', stop);
      frame?.removeEventListener('touchstart', stop);
    };
  }, [autoDemo, slideEntered, paceMs]);

  return (
    <DeviceFrame theme={theme} size={size} url={EMBER_MOSS_BRAND.url} fill scrollRef={frameRef} overlay={<AutoCursor ref={cursorRef} theme={theme} size={size} />}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${12 * size}px` }}>
        <button onClick={() => { cancelAuto(); goHome(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${13 * size}px`, color: t.text }}>Ember &amp; Moss</button>
        <div style={{ display: 'flex', gap: `${10 * size}px`, alignItems: 'center' }}>
          <button data-demo="nav-shop" onClick={() => { cancelAuto(); openShop(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Shop</button>
          <button data-demo="nav-contact" onClick={() => { cancelAuto(); setView({ type: 'contact' }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contact</button>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Cart{cartCount > 0 ? ` (${cartCount})` : ''}</span>
        </div>
      </div>

      {view.type === 'product' && (
        <ProductDetailView theme={theme} size={size} product={view.product} onBack={() => { cancelAuto(); goHome(); }} onAddToCart={(p) => { cancelAuto(); addToCart(p); }} cartQty={cart[view.product.name] || 0} />
      )}
      {view.type === 'post' && (
        <BlogPostView theme={theme} size={size} post={view.post} onBack={() => { cancelAuto(); goHome(); }} />
      )}
      {view.type === 'contact' && (
        <ContactView ref={contactRef} theme={theme} size={size} onBack={() => { cancelAuto(); goHome(); }} onInteract={cancelAuto} />
      )}

      {view.type === 'shop' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${14 * size}px` }}>
            <SectionLabel size={size} theme={theme}>All Products</SectionLabel>
            <button onClick={() => { cancelAuto(); goHome(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint }}>&larr; Home</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${10 * size}px` }}>
            {EMBER_MOSS_PRODUCTS.map(p => {
              const qty = cart[p.name] || 0;
              return (
                <ScrollReveal key={p.name} y={16} amount={0.4} style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${8 * size}px`, textAlign: 'center' }}>
                  <button onClick={() => { cancelAuto(); openProduct(p); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'center', font: 'inherit' }}>
                    <div style={{ marginBottom: `${6 * size}px` }}>
                      <ProductImg src={p.img} alt={p.name} size={size} />
                    </div>
                    <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: `${7.5 * size}px`, color: t.text, marginBottom: `${3 * size}px` }}>{p.name}</div>
                  </button>
                  <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, marginBottom: `${6 * size}px` }}>{p.price}</div>
                  {qty === 0 ? (
                    <button onClick={() => { cancelAuto(); setQty(p.name, 1); }} style={{
                      width: '100%', padding: `${5 * size}px`, border: 'none', borderRadius: `${4 * size}px`,
                      background: t.accent, color: theme.isLight ? '#fff' : t.bg,
                      fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${7.5 * size}px`, cursor: 'pointer',
                    }}>Add to cart</button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${t.accent}`, borderRadius: `${4 * size}px`, overflow: 'hidden' }}>
                      <button onClick={() => { cancelAuto(); setQty(p.name, qty - 1); }} style={{ flex: 1, border: 'none', background: 'transparent', color: t.accent, fontFamily: theme.fonts.mono, fontSize: `${10 * size}px`, cursor: 'pointer', padding: `${4 * size}px 0` }}>−</button>
                      <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.text, minWidth: `${16 * size}px` }}>{qty}</span>
                      <button onClick={() => { cancelAuto(); setQty(p.name, qty + 1); }} style={{ flex: 1, border: 'none', background: 'transparent', color: t.accent, fontFamily: theme.fonts.mono, fontSize: `${10 * size}px`, cursor: 'pointer', padding: `${4 * size}px 0` }}>+</button>
                    </div>
                  )}
                </ScrollReveal>
              );
            })}
          </div>
        </>
      )}

      {view.type === 'home' && (
        <>
          {/* ── Hero ── */}
          <div style={{
            position: 'relative', borderRadius: `${6 * size}px`, padding: `${18 * size}px`,
            overflow: 'hidden', minHeight: `${100 * size}px`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            background: heroFailed ? `linear-gradient(135deg, ${t.accent}18, ${t.accent}05)` : '#1B3B2E',
            border: `1px solid ${t.accent}30`, marginBottom: `${22 * size}px`,
          }}>
            {!heroFailed && (
              <img src="./demo-assets/ember-moss/hero-apothecary.jpg" alt="" onError={() => setHeroFailed(true)} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              }} />
            )}
            {!heroFailed && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.05))' }} />}
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.type.headWeight, fontSize: `${16 * size}px`, color: heroFailed ? t.text : '#F5F1E4', marginBottom: `${5 * size}px` }}>
                Everyday magic, handmade by dragons.
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: `${9 * size}px`, color: heroFailed ? t.textMuted : '#E7DFC8', marginBottom: `${10 * size}px`, maxWidth: '85%' }}>
                One login runs the storefront, the shop, and everything behind it.
              </div>
              <button onClick={() => { cancelAuto(); openShop(); }} style={{
                display: 'inline-block', padding: `${6 * size}px ${13 * size}px`, border: 'none', cursor: 'pointer',
                background: t.accent, color: theme.isLight ? '#fff' : t.bg,
                borderRadius: theme.space.radius === '0px' ? '0px' : `${5 * size}px`,
                fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${8.5 * size}px`,
              }}>Shop the collection</button>
            </div>
          </div>

          {/* ── Featured products ── */}
          <SectionLabel size={size} theme={theme}>Featured</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${8 * size}px`, marginBottom: `${22 * size}px` }}>
            {featured.map((p, i) => (
              <button key={p.name} data-demo={`featured-${i}`} onClick={() => { cancelAuto(); openProduct(p); }} style={{
                border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${7 * size}px`, textAlign: 'center',
                background: 'none', cursor: 'pointer', font: 'inherit',
              }}>
                <div style={{ marginBottom: `${5 * size}px` }}>
                  <ProductImg src={p.img} alt={p.name} size={size} />
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: `${7.5 * size}px`, color: t.text }}>{p.name}</div>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.accent }}>{p.price}</div>
              </button>
            ))}
          </div>

          {/* ── From the journal ── */}
          <SectionLabel size={size} theme={theme}>From the Journal</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${8 * size}px`, marginBottom: `${22 * size}px` }}>
            {EMBER_MOSS_JOURNAL.map(post => (
              <button key={post.title} onClick={() => { cancelAuto(); openPost(post); }} style={{
                border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, overflow: 'hidden',
                background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', font: 'inherit',
              }}>
                <ProductImg src={post.img} alt={post.title} size={size} radius={0} aspect="16/10" fallbackIcon={post.icon} />
                <div style={{ padding: `${8 * size}px` }}>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${7.5 * size}px`, color: t.text, marginBottom: `${3 * size}px`, lineHeight: 1.3 }}>{post.title}</div>
                  <div style={{ fontFamily: theme.fonts.body, fontSize: `${7 * size}px`, color: t.textFaint, lineHeight: 1.4 }}>{post.excerpt}</div>
                </div>
              </button>
            ))}
          </div>

          {/* ── Testimonials ── */}
          <SectionLabel size={size} theme={theme}>What People Are Saying</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${8 * size}px`, marginBottom: `${22 * size}px` }}>
            {EMBER_MOSS_TESTIMONIALS.map(rev => (
              <div key={rev.name} style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${8 * size}px`, background: t.bgAlt }}>
                <div style={{ color: t.accent, fontSize: `${8 * size}px`, marginBottom: `${4 * size}px`, letterSpacing: '1px' }}>{'\u2605'.repeat(rev.rating)}{'\u2606'.repeat(5 - rev.rating)}</div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: `${7.5 * size}px`, color: t.textMuted, lineHeight: 1.5, marginBottom: `${5 * size}px`, fontStyle: 'italic' }}>&ldquo;{rev.quote}&rdquo;</div>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{rev.name}</div>
              </div>
            ))}
          </div>

          {/* ── FAQ ── */}
          <SectionLabel size={size} theme={theme}>Questions</SectionLabel>
          <div style={{ marginBottom: `${18 * size}px` }}>
            {EMBER_MOSS_FAQ.map((item, i) => (
              <div key={item.q} style={{ borderBottom: `1px solid ${t.border}` }}>
                <button onClick={() => { cancelAuto(); setOpenFaq(openFaq === i ? null : i); }} style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: `${8 * size}px 0`, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: `${8.5 * size}px`, color: t.text }}>{item.q}</span>
                  <span style={{ color: t.accent, fontSize: `${10 * size}px`, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.15s ease' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ fontFamily: theme.fonts.body, fontSize: `${8 * size}px`, color: t.textMuted, lineHeight: 1.6, paddingBottom: `${8 * size}px` }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* ── Footer ── */}
          <div style={{
            borderTop: `1px solid ${t.border}`, paddingTop: `${10 * size}px`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: `${6 * size}px`,
          }}>
            <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${9 * size}px`, color: t.textFaint }}>Ember &amp; Moss</span>
            <button onClick={() => { cancelAuto(); setView({ type: 'contact' }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, letterSpacing: '0.06em', textDecoration: 'underline' }}>Contact</button>
            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, letterSpacing: '0.06em' }}>&copy; 2026 · emberandmoss.shop</span>
          </div>
        </>
      )}
    </DeviceFrame>
  );
}


function SectionLabel({ size, theme, children }) {
  const t = theme.colors;
  return (
    <div style={{
      fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.accent,
      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: `${8 * size}px`,
    }}>
      {children}
    </div>
  );
}


// Placeholder mark for Peak — no real logo exists yet, so this is a simple
// literal "summit" glyph (a peak, for Peak) in the theme's accent color.
// Swap this out the day a real logo exists; nothing else references it.
function PeakMark({ size, color }) {
  // Unique gradient id per instance — this renders twice on the page
  // (Problem slide + Portal slide) and SVG gradient ids are global, so a
  // fixed id would make the second instance silently reuse the first's glow.
  const [gid] = useState(() => `pk${Math.random().toString(36).slice(2, 8)}`);
  return (
    <svg width={54 * size} height={54 * size} viewBox="-14 -18 92 88" style={{ overflow: 'visible', filter: `drop-shadow(0 0 ${8 * size}px ${color}40)` }}>
      <defs>
        <radialGradient id={`${gid}-glow`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* soft summit glow, drawn first so every peak sits on top of it */}
      <circle cx="32" cy="22" r="34" fill={`url(#${gid}-glow)`} />
      {/* two lower, translucent peaks give the main peak depth/scale */}
      <path d="M2 54 L18 24 L34 54 Z" fill={color} opacity="0.28" />
      <path d="M30 54 L48 20 L66 54 Z" fill={color} opacity="0.4" />
      {/* main peak */}
      <path d="M32 6 L58 54 H6 Z" fill={color} />
      {/* snow cap */}
      <path d="M32 6 L41 23 L32 18 L23 23 Z" fill="#fff" fillOpacity="0.92" />
      {/* summit flag — the "goal reached" beat */}
      <line x1="32" y1="6" x2="32" y2="-11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M32 -11 L45 -6.5 L32 -2 Z" fill={color} />
    </svg>
  );
}


// ── 2. problem — "the flood" ─────────────────────────────────────────────────────
// The story this slide has to tell: a merchant's tools each have their own
// login, none of them talk to each other, and keeping up with them is its own
// job. So instead of ten tidy boxes, the scene BUILDS into overwhelm the moment
// the slide opens (think the Hogwarts-letters scene): login windows pile up,
// wax-sealed letters pour in from every edge and swarm around the business,
// notifications pop up about things that don't match, the sync lines between
// tools snap, and a live counter climbs. Then everything gets pulled into one
// point and the platform resolves. Replay runs the WHOLE build again.

// tiny seeded RNG so the "random" scene is identical on every run
function rng(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

// One wax-sealed letter in the flood, sealed in a tool's brand colour.
function Letter({ w, seal, urgent }) {
  return (
    <svg viewBox="0 0 40 30" width={w} height={w * 0.75} style={{ display: 'block', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.28))' }} aria-hidden>
      <rect x="1" y="1" width="38" height="28" rx="3" fill="#FBF7EE" stroke="#B9AF9C" strokeWidth="1.2" />
      <path d="M2 3 L20 17 L38 3" fill="none" stroke="#B9AF9C" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="20" cy="16" r="5.2" fill={seal} />
      <circle cx="20" cy="16" r="2.4" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1" />
      {urgent && <circle cx="35.5" cy="4.5" r="4.2" fill="#DB3521" stroke="#fff" strokeWidth="1.2" />}
    </svg>
  );
}

// Live counters. They climb while the chaos builds, then tick down to 1 / 1 / 0.
function ChaosHUD({ theme, size, merged, durationMs }) {
  const t = theme.colors;
  const [v, setV] = useState({ tabs: 1, logins: 1, unread: 0 });
  const curRef = useRef(v);
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const push = (nv) => {
      const c = curRef.current;
      if (c.tabs === nv.tabs && c.logins === nv.logins && c.unread === nv.unread) return;
      curRef.current = nv; setV(nv);
    };
    if (!merged) {
      const step = (now) => {
        const p = Math.min(1, (now - t0) / durationMs);
        push({ tabs: Math.round(1 + 22 * p), logins: Math.round(1 + 11 * p), unread: Math.round(214 * Math.pow(p, 1.7)) });
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    } else {
      const from = { ...curRef.current };
      const step = (now) => {
        const q = Math.max(0, Math.min(1, (now - t0 - 300) / 1000));
        const e = 1 - Math.pow(1 - q, 3);
        push({ tabs: Math.round(from.tabs + (1 - from.tabs) * e), logins: Math.round(from.logins + (1 - from.logins) * e), unread: Math.round(from.unread * (1 - e)) });
        if (q < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(raf);
  }, [merged, durationMs]);

  const col = merged ? (t.positive || t.accent) : (t.negative || '#DB3521');
  const chip = (label, val) => (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: `${4 * size}px`, padding: `${4 * size}px ${8 * size}px`,
      borderRadius: `${5 * size}px`, background: t.surface || t.bg, border: `1px solid ${col}`, transition: 'border-color 0.4s ease',
    }}>
      <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${12 * size}px`, color: col, minWidth: `${17 * size}px`, textAlign: 'right', transition: 'color 0.4s ease' }}>{val}</span>
      <span style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
  return (
    <div style={{ position: 'absolute', top: `${10 * size}px`, right: `${10 * size}px`, zIndex: 7, display: 'flex', gap: `${5 * size}px` }}>
      {chip('tabs open', v.tabs)}{chip('logins', v.logins)}{chip('unread', v.unread)}
    </div>
  );
}

function MockupProblem({ theme, size, paceMs = 24000 }) {
  const t = theme.colors;
  const [merged, setMerged] = useState(false);
  const [pains, setPains] = useState(0);
  // Infinite CSS keyframe animations inserted while an ancestor is
  // mid-transform can get stuck at their first frame in some browsers.
  // slideEntered comes from PresentMode's real onAnimationComplete event, and
  // everything below mounts (keyed by animKey) only once it flips true.
  const slideEntered = useSlideEntered();
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => { if (slideEntered) setAnimKey(k => k + 1); }, [slideEntered]);

  // How long the chaos builds before it all collapses: the slide's pace (real
  // narration length once recorded, else autoMs), leaving the tail for the
  // resolution. The narration ends on "watch what happens when they collapse
  // into one", so that's where the collapse lands.
  const C = Math.max(8000, paceMs * 0.78);
  useEffect(() => {
    if (!slideEntered || animKey === 0) return;
    setMerged(false); setPains(0);
    const ids = [0.22, 0.5, 0.76].map((f, i) => setTimeout(() => setPains(i + 1), C * f));
    ids.push(setTimeout(() => setMerged(true), C));
    return () => ids.forEach(clearTimeout);
  }, [slideEntered, animKey, C]);
  const replay = () => { setMerged(false); setPains(0); setAnimKey(k => k + 1); };

  // measure the scene so everything can be placed (and sucked back) in real px
  const sceneRef = useRef(null);
  const [box, setBox] = useState({ w: 720, h: 420 });
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const read = () => setBox({ w: el.offsetWidth || 720, h: el.offsetHeight || 420 });
    read();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(read) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);
  const cx = box.w / 2, cy = box.h / 2;

  // in the order they arrive — the first few land at the edges, the last ones bury the middle
  const tools = [
    { name: 'Shopify',    Icon: SiShopify,      color: '#95BF47', status: 'Session expired' },
    { name: 'Gmail',      Icon: SiGmail,        color: '#EA4335', status: 'New sign-in detected' },
    { name: 'Sheets',     Icon: SiGooglesheets, color: '#188038', status: 'Request access' },
    { name: 'Mailchimp',  Icon: SiMailchimp,    color: '#FFE01B', status: 'Verify it\u2019s you' },
    { name: 'QuickBooks', Icon: SiQuickbooks,   color: '#2CA01C', status: '2-step code needed' },
    { name: 'Calendly',   Icon: SiCalendly,     color: '#006BFF', status: 'Sign in again' },
    { name: 'Trello',     Icon: SiTrello,       color: '#0052CC', status: 'Link expired' },
    { name: 'Airtable',   Icon: SiAirtable,     color: '#FCB400', status: 'Wrong password' },
    { name: 'Stripe',     Icon: SiStripe,       color: '#635BFF', status: 'New device login' },
    { name: 'Notion',     Icon: SiNotion,       color: t.text,    status: 'Workspace locked' },
    { name: 'Dropbox',    Icon: SiDropbox,      color: '#0061FF', status: 'Storage full' },
    { name: 'Zoom',       Icon: SiZoom,         color: '#2D8CFF', status: 'Update required' },
  ];
  const slots = [
    [.02, .06], [.97, .04], [.04, .92], [.95, .9], [.34, .02], [.66, .96],
    [0, .46], [1, .5], [.3, .4], [.7, .36], [.48, .68], [.52, .2],
  ];
  const ww = 108 * size, wh = 78 * size;
  const winPos = slots.map(([fx, fy]) => ({ x: fx * (box.w - ww), y: fy * (box.h - wh) }));
  const winAt = (i) => (C * (0.03 + 0.55 * (i / (tools.length - 1)))) / 1000;

  // the flood: letters pour in from every edge, loop through the middle, land anywhere
  const flood = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 56 }, (_, i) => {
      const side = Math.floor(r() * 4), e = r();
      const start = side === 0 ? { x: e, y: -0.14 } : side === 1 ? { x: 1.12, y: e } : side === 2 ? { x: e, y: 1.14 } : { x: -0.12, y: e };
      return {
        start, way: { x: 0.28 + r() * 0.44, y: 0.22 + r() * 0.5 }, land: { x: 0.04 + r() * 0.9, y: 0.05 + r() * 0.86 },
        spin: (r() < 0.5 ? -1 : 1) * (360 + r() * 360), rot: (r() - 0.5) * 70, dur: 1.3 + r() * 0.9,
        seal: i % 12, urgent: r() < 0.35, w: 26 + r() * 16, flutter: 1.4 + r() * 1.6,
      };
    });
  }, []);
  // ...and a swarm that never lands, buzzing around the business
  const swarm = useMemo(() => {
    const r = rng(29);
    return Array.from({ length: 22 }, (_, i) => ({
      rx: 110 + r() * 220, ry: 60 + r() * 150, dx: 2.4 + r() * 2.4, dy: 1.9 + r() * 2.2,
      spin: 2 + r() * 3, phase: -r() * 5, seal: (i * 5) % 12, w: 30 + r() * 14, urgent: r() < 0.45,
    }));
  }, []);

  const toasts = [
    { i: 0, text: 'Order #1046 isn\u2019t in your sheet',   fx: .02, fy: .24 },
    { i: 1, text: '47 unread \u2014 which one matters?',      fx: .98, fy: .22 },
    { i: 4, text: 'Invoice doesn\u2019t match Stripe',        fx: 0,   fy: .72 },
    { i: 5, text: 'Double-booked Thursday, 2pm',              fx: 1,   fy: .76 },
    { i: 3, text: 'Subscriber list is out of date',           fx: .5,  fy: .1 },
    { i: 2, text: 'Stock count is wrong. Again.',             fx: .5,  fy: .9 },
    { i: 8, text: 'Payout doesn\u2019t match orders',         fx: .2,  fy: .52 },
    { i: 9, text: 'Which doc is the latest one?',             fx: .8,  fy: .5 },
  ];
  const tw = 160 * size, th = 32 * size;
  const links = [[0, 8], [1, 9], [2, 10], [3, 11], [6, 8], [7, 9], [4, 10]];
  const painPoints = ['10 logins a day', '~5 hrs/week stitching data', '0% of it talking to each other'];
  const red = t.negative || '#DB3521';
  const live = animKey > 0;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div ref={sceneRef} style={{
        position: 'relative', flex: '1 1 auto', minHeight: `${260 * size}px`,
        border: `1px dashed ${t.border}`, borderRadius: `${10 * size}px`,
        marginBottom: `${12 * size}px`, overflow: 'hidden',
      }}>
        {merged && (
          <div style={{
            position: 'absolute', top: `${10 * size}px`, left: `${10 * size}px`, zIndex: 8,
            display: 'flex', alignItems: 'center', gap: `${6 * size}px`,
            padding: `${5 * size}px ${11 * size}px`, borderRadius: `${5 * size}px`, background: t.accent,
          }}>
            <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${9.5 * size}px`, letterSpacing: '0.1em', color: theme.isLight ? '#fff' : t.bg }}>
              AFTER — 1 platform
            </span>
          </div>
        )}

        {/* ── the business's own dashboard — calm at first, then buried ── */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', zIndex: 1, width: '64%',
          border: `1px solid ${t.border}`, borderRadius: `${8 * size}px`, overflow: 'hidden',
          background: t.surface || t.bg, boxShadow: `0 ${10 * size}px ${28 * size}px rgba(0,0,0,0.12)`,
          opacity: merged ? 1 : 0.8,
          transform: merged ? 'translate(-50%, -50%) scale(1.12)' : 'translate(-50%, -50%) scale(1)',
          transition: 'opacity 0.6s ease 0.55s, transform 0.6s cubic-bezier(0.4,0,0.2,1) 0.55s',
        }}>
          {!merged && (
            <>
              <div style={{ display: 'flex', gap: `${6 * size}px`, padding: `${8 * size}px ${12 * size}px`, background: t.bgAlt, borderBottom: `1px solid ${t.border}` }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: `${6 * size}px`, height: `${6 * size}px`, borderRadius: '50%', background: t.border }} />)}
              </div>
              <div style={{ padding: `${18 * size}px` }}>
                <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${12 * size}px`, letterSpacing: '0.06em', marginBottom: `${10 * size}px`, color: t.text }}>YOUR BUSINESS</div>
                {[72, 50, 62].map((w, i) => (
                  <div key={i} style={{ height: `${9 * size}px`, width: `${w}%`, borderRadius: `${3 * size}px`, background: t.bgAlt, marginBottom: `${7 * size}px` }} />
                ))}
              </div>
            </>
          )}
          {merged && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: `${28 * size}px ${18 * size}px`, gap: `${10 * size}px`,
              animation: 'revealIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.9s both',
            }}>
              <PeakMark size={size} color={t.accent} />
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${18 * size}px`, color: t.text, letterSpacing: '0.02em' }}>{COMPANY.name.toUpperCase()}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: `${5 * size}px`, fontFamily: theme.fonts.mono, fontSize: `${9.5 * size}px`, color: t.positive || t.accent }}>
                <Check size={12 * size} strokeWidth={2.5} /> One dashboard. Everything visible.
              </div>
            </div>
          )}
        </div>

        {live && (
          <div key={animKey} style={{ position: 'absolute', inset: 0 }}>
            {/* 1 · every tool has its own login — and its own problem */}
            {tools.map((tool, i) => {
              const rot = ((i * 53) % 11) - 5;
              const p = winPos[i];
              return (
                <motion.div key={tool.name}
                  initial={{ opacity: 0, scale: 0.4, x: 0, y: 0, rotate: rot - 12 }}
                  animate={merged
                    ? { x: cx - (p.x + ww / 2), y: cy - (p.y + wh / 2), scale: 0.08, rotate: rot + 420, opacity: 0 }
                    : { opacity: 1, scale: 1, x: 0, y: 0, rotate: rot }}
                  transition={merged ? { duration: 0.8, delay: i * 0.03, ease: [0.5, 0, 0.9, 0.4] } : { type: 'spring', stiffness: 260, damping: 15, delay: winAt(i) }}
                  style={{ position: 'absolute', left: p.x, top: p.y, width: ww, zIndex: 2 }}>
                  <div style={{
                    border: `1px solid ${t.border}`, borderRadius: `${7 * size}px`, overflow: 'hidden', background: t.surface || t.bg,
                    boxShadow: `0 ${6 * size}px ${16 * size}px rgba(0,0,0,0.16)`,
                    animation: `jitter ${2.4 + (i % 4) * 0.35}s ease-in-out ${i * 0.17}s infinite`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: `${6 * size}px`, padding: `${6 * size}px ${8 * size}px`, borderBottom: `1px solid ${t.border}`, background: t.bgAlt }}>
                      <span style={{ position: 'relative', display: 'flex' }}>
                        <tool.Icon size={15 * size} color={tool.color} />
                        <span style={{ position: 'absolute', top: `-${3 * size}px`, right: `-${3 * size}px`, width: `${7 * size}px`, height: `${7 * size}px`, borderRadius: '50%', background: red, animation: `pulseDot 1.6s ease-in-out ${i * 0.15}s infinite` }} />
                      </span>
                      <span style={{ fontFamily: theme.fonts.mono, fontSize: `${9 * size}px`, color: t.textMuted, whiteSpace: 'nowrap' }}>{tool.name}</span>
                    </div>
                    <div style={{ padding: `${6 * size}px ${8 * size}px ${8 * size}px` }}>
                      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: red, marginBottom: `${5 * size}px`, whiteSpace: 'nowrap' }}>{tool.status}</div>
                      <div style={{ height: `${8 * size}px`, borderRadius: `${2 * size}px`, border: `1px solid ${t.border}`, background: t.bgAlt, marginBottom: `${4 * size}px` }} />
                      <div style={{ height: `${8 * size}px`, borderRadius: `${2 * size}px`, border: `1px solid ${t.border}`, background: t.bgAlt, marginBottom: `${5 * size}px`, fontFamily: theme.fonts.mono, fontSize: `${6 * size}px`, lineHeight: `${8 * size}px`, color: t.textFaint, paddingLeft: `${4 * size}px`, letterSpacing: '0.1em' }}>{'\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}</div>
                      <div style={{ height: `${9 * size}px`, borderRadius: `${2 * size}px`, background: tool.color, opacity: 0.85 }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* 2 · the flood: letters pour in from every edge and bury everything */}
            {flood.map((l, i) => {
              const lw = l.w * size;
              const px = (f) => f * box.w - lw / 2, py = (f) => f * box.h - lw * 0.375;
              const delay = (C * (0.1 + 0.78 * Math.pow(i / (flood.length - 1), 1.5))) / 1000;
              return (
                <motion.div key={i}
                  initial={{ left: px(l.start.x), top: py(l.start.y), opacity: 0, scale: 0.6, rotate: 0 }}
                  animate={merged
                    ? { left: cx - lw / 2, top: cy - lw * 0.375, scale: 0, rotate: l.rot + 540, opacity: 0 }
                    : { left: [px(l.start.x), px(l.way.x), px(l.land.x)], top: [py(l.start.y), py(l.way.y), py(l.land.y)], rotate: [0, l.spin * 0.6, l.rot], scale: [0.6, 1.15, 1], opacity: [0, 1, 1] }}
                  transition={merged ? { duration: 0.75, delay: (i % 12) * 0.03, ease: [0.5, 0, 0.9, 0.4] } : { duration: l.dur, delay, times: [0, 0.55, 1], ease: 'easeOut' }}
                  style={{ position: 'absolute', zIndex: 3 }}>
                  <div style={{ animation: `flutter ${l.flutter}s ease-in-out ${delay + l.dur}s infinite alternate` }}>
                    <Letter w={lw} seal={tools[l.seal].color} urgent={l.urgent} />
                  </div>
                </motion.div>
              );
            })}

            {/* 3 · a swarm that never lands — it just keeps circling the business */}
            {swarm.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.3 }}
                animate={merged ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                transition={merged ? { duration: 0.5 } : { delay: (C * (0.22 + 0.5 * (i / swarm.length))) / 1000, duration: 0.5 }}
                style={{ position: 'absolute', left: '50%', top: '50%', zIndex: 4, marginLeft: `${-s.w * size / 2}px`, marginTop: `${-s.w * size * 0.375}px` }}>
                <div style={{ '--rx': `${s.rx * size}px`, animation: `swayX ${s.dx}s ease-in-out ${s.phase}s infinite alternate` }}>
                  <div style={{ '--ry': `${s.ry * size}px`, animation: `swayY ${s.dy}s ease-in-out ${s.phase}s infinite alternate` }}>
                    <div style={{ animation: `spinL ${s.spin}s linear infinite` }}>
                      <Letter w={s.w * size} seal={tools[s.seal].color} urgent={s.urgent} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* 4 · the tools don't talk to each other: every sync line is broken */}
            <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
              {links.map(([a, b], k) => (
                <motion.line key={k} x1={winPos[a].x + ww / 2} y1={winPos[a].y + wh / 2} x2={winPos[b].x + ww / 2} y2={winPos[b].y + wh / 2}
                  stroke={red} strokeWidth={1.6 * size} strokeDasharray={`${5 * size} ${4 * size}`} strokeLinecap="round"
                  initial={{ opacity: 0 }} animate={{ opacity: merged ? 0 : 0.85 }}
                  transition={{ delay: merged ? 0 : (C * (0.45 + 0.4 * (k / links.length))) / 1000, duration: 0.4 }} />
              ))}
            </svg>
            {links.map(([a, b], k) => (
              <motion.div key={k} initial={{ scale: 0, opacity: 0 }}
                animate={merged ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={merged ? { duration: 0.3 } : { type: 'spring', stiffness: 400, damping: 12, delay: (C * (0.45 + 0.4 * (k / links.length))) / 1000 + 0.25 }}
                style={{
                  position: 'absolute', zIndex: 5, width: `${15 * size}px`, height: `${15 * size}px`, borderRadius: '50%',
                  left: (winPos[a].x + winPos[b].x) / 2 + ww / 2 - 7.5 * size, top: (winPos[a].y + winPos[b].y) / 2 + wh / 2 - 7.5 * size,
                  background: red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${9 * size}px`, boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}>{'\u2715'}</motion.div>
            ))}

            {/* 5 · notifications about things that don't line up */}
            {toasts.map((n, j) => (
              <motion.div key={j} initial={{ opacity: 0, y: -14 * size, scale: 0.85 }}
                animate={merged ? { opacity: 0, scale: 0.5, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
                transition={merged ? { duration: 0.35 } : { type: 'spring', stiffness: 300, damping: 16, delay: (C * (0.15 + 0.62 * (j / (toasts.length - 1)))) / 1000 }}
                style={{
                  position: 'absolute', zIndex: 6, width: tw, left: n.fx * (box.w - tw), top: n.fy * (box.h - th),
                  display: 'flex', alignItems: 'center', gap: `${7 * size}px`, padding: `${6 * size}px ${8 * size}px`,
                  borderRadius: `${6 * size}px`, background: t.surface || t.bg, border: `1px solid ${t.border}`, borderLeft: `${3 * size}px solid ${red}`,
                  boxShadow: `0 ${6 * size}px ${16 * size}px rgba(0,0,0,0.22)`,
                }}>
                {(() => { const I = tools[n.i].Icon; return <I size={13 * size} color={tools[n.i].color} />; })()}
                <span style={{ fontFamily: theme.fonts.body, fontSize: `${8 * size}px`, color: t.text, lineHeight: 1.25 }}>{n.text}</span>
              </motion.div>
            ))}

            <ChaosHUD theme={theme} size={size} merged={merged} durationMs={C} />
          </div>
        )}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', gap: `${10 * size}px`, marginBottom: `${10 * size}px`, flexShrink: 0,
        opacity: merged ? 0 : 1, maxHeight: merged ? 0 : `${28 * size}px`, overflow: 'hidden', transition: 'opacity 0.3s ease, max-height 0.3s ease',
      }}>
        {painPoints.map((pt, i) => (
          <span key={pt} style={{
            display: 'flex', alignItems: 'center', gap: `${5 * size}px`, fontFamily: theme.fonts.mono, fontWeight: 600, fontSize: `${9.5 * size}px`,
            color: t.text, letterSpacing: '0.01em', whiteSpace: 'nowrap',
            opacity: pains > i ? 1 : 0, transform: pains > i ? 'none' : `translateY(${6 * size}px)`, transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}>
            <span style={{ width: `${5 * size}px`, height: `${5 * size}px`, borderRadius: '50%', background: red, flexShrink: 0 }} />
            {pt}
          </span>
        ))}
      </div>

      <button onClick={() => (merged ? replay() : setMerged(true))} style={{
        width: '100%', padding: `${10 * size}px`, flexShrink: 0,
        border: `1px solid ${t.accent}`, borderRadius: `${6 * size}px`,
        background: merged ? 'transparent' : t.accent, color: merged ? t.accent : (theme.isLight ? '#fff' : t.bg),
        fontFamily: theme.fonts.mono, fontWeight: 600, fontSize: `${11 * size}px`, letterSpacing: '0.06em', cursor: 'pointer',
      }}>
        {merged ? '\u21BA Replay the chaos' : 'Consolidate \u2192'}
      </button>
      <style>{`
        @keyframes jitter { 0%, 100% { transform: rotate(-1.5deg); } 50% { transform: rotate(1.5deg); } }
        @keyframes pulseDot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } }
        @keyframes revealIn { from { opacity: 0; transform: scale(0.75); } to { opacity: 1; transform: scale(1); } }
        @keyframes swayX { from { transform: translateX(calc(var(--rx) * -1)); } to { transform: translateX(var(--rx)); } }
        @keyframes swayY { from { transform: translateY(calc(var(--ry) * -1)); } to { transform: translateY(var(--ry)); } }
        @keyframes spinL { to { transform: rotate(360deg); } }
        @keyframes flutter { from { transform: rotate(-5deg) translateY(0); } to { transform: rotate(6deg) translateY(-3px); } }
      `}</style>
    </div>
  );
}

// ── 3. platform — the map ────────────────────────────────────────────────────────
// Eight big poster-cards that fill the whole visual side. A cursor walks the
// narration's list in order — storefront, products & inventory, orders,
// payments, shipping, customers, content, costing — and each card comes alive
// with its own tiny animation as it's clicked (the storefront repaints in three
// themes, stock bars fill, an order flips to Shipped, revenue counts up, a truck
// drives, customers pop in, a post publishes, the margin ring fills). Then a
// data bus draws through the middle and every module snaps onto it: "built in,
// connected, nothing bolted on."

function HeroStorefront({ theme, size, playKey }) {
  const looks = [
    { bg: '#1B3B2E', fg: '#F5F1E4', ac: '#C9A227', tag: 'BOTANICAL' },
    { bg: '#111111', fg: '#FFD400', ac: '#FFD400', tag: 'WORKSHOP' },
    { bg: '#FFD9EC', fg: '#C2185B', ac: '#C2185B', tag: 'BUBBLEGUM' },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!playKey) return undefined;
    const ids = [setTimeout(() => setI(1), 300), setTimeout(() => setI(2), 720), setTimeout(() => setI(0), 1140)];
    return () => ids.forEach(clearTimeout);
  }, [playKey]);
  const L = looks[i];
  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: `${8 * size}px`, background: L.bg, padding: `${12 * size}px ${12 * size}px ${11 * size}px`, transition: 'background 0.35s ease' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: `${17 * size}px`, color: L.fg, lineHeight: 1.1, transition: 'color 0.35s ease' }}>Ember &amp; Moss</div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: L.ac, letterSpacing: '0.08em', marginTop: `${4 * size}px`, transition: 'color 0.35s ease' }}>{L.tag} {'\u00B7'} LIVE</div>
      <motion.span animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}
        style={{ position: 'absolute', top: `${9 * size}px`, right: `${9 * size}px`, width: `${7 * size}px`, height: `${7 * size}px`, borderRadius: '50%', background: '#3DDC84' }} />
    </div>
  );
}

function HeroProducts({ theme, size, playKey }) {
  const t = theme.colors;
  const stock = [42, 18, 65];
  return (
    <div style={{ display: 'flex', gap: `${6 * size}px`, width: '100%' }}>
      {EMBER_MOSS_PRODUCTS.slice(0, 3).map((p, j) => {
        const low = stock[j] < 25;
        return (
          <div key={p.name} style={{ flex: 1, minWidth: 0 }}>
            <ProductImg src={p.img} alt={p.name} size={size} radius={4} />
            <div style={{ height: `${4 * size}px`, borderRadius: '100px', background: t.bgAlt, margin: `${5 * size}px 0 ${3 * size}px`, overflow: 'hidden' }}>
              <motion.div key={`b-${playKey}`} initial={{ width: 0 }} animate={{ width: `${(stock[j] / 70) * 100}%` }} transition={{ delay: 0.15 + j * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '100%', borderRadius: '100px', background: low ? (t.negative || '#DB3521') : t.accent }} />
            </div>
            <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${8.5 * size}px`, color: low ? (t.negative || '#DB3521') : t.textMuted, whiteSpace: 'nowrap' }}>{stock[j]}{low ? ' !' : ''}</div>
          </div>
        );
      })}
    </div>
  );
}

function HeroOrders({ theme, size, playKey }) {
  const t = theme.colors;
  const [st, setSt] = useState('Processing');
  useEffect(() => {
    if (!playKey) return undefined;
    setSt('Processing');
    const id = setTimeout(() => setSt('Shipped'), 800);
    return () => clearTimeout(id);
  }, [playKey]);
  const good = t.positive || t.accent;
  const rows = [{ id: '#1049', s: 'Shipped' }, { id: '#1048', s: st }, { id: '#1047', s: 'New' }];
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: `${5 * size}px` }}>
      {rows.map((o, j) => {
        const shipped = o.s === 'Shipped';
        return (
          <motion.div key={`${o.id}-${playKey}`} initial={{ opacity: 0, x: -10 * size }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * 0.1, duration: 0.35 }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${6 * size}px ${8 * size}px`, borderRadius: `${5 * size}px`, border: `1px solid ${shipped ? good : t.border}`, background: shipped ? `${good}12` : 'transparent', transition: 'all 0.3s ease' }}>
            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8.5 * size}px`, color: t.text, fontWeight: 600 }}>{o.id}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: `${3 * size}px`, fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: shipped ? good : o.s === 'New' ? t.accent : t.textMuted }}>
              {shipped && <Check size={9 * size} strokeWidth={3} />}{o.s}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function HeroPayments({ theme, size, playKey }) {
  const t = theme.colors;
  const bars = [30, 44, 38, 58, 52, 74, 90];
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${26 * size}px`, color: t.text, lineHeight: 1 }}>
        <AnimNum key={`p-${playKey}`} value={9170} prefix="$" ms={900} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: `${3 * size}px`, height: `${34 * size}px`, margin: `${8 * size}px 0 ${5 * size}px` }}>
        {bars.map((h, j) => (
          <motion.div key={`${playKey}-${j}`} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.1 + j * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: 1, borderRadius: `${2 * size}px`, background: j === bars.length - 1 ? t.accent : `${t.accent}55` }} />
        ))}
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint }}>via Stripe Connect</div>
    </div>
  );
}

function HeroShipping({ theme, size, playKey }) {
  const t = theme.colors;
  const good = t.positive || t.accent;
  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', height: `${34 * size}px`, marginBottom: `${6 * size}px` }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${5 * size}px`, borderBottom: `2px dashed ${t.border}` }} />
        <motion.div key={`t-${playKey}`} initial={{ left: '0%' }} animate={{ left: '72%' }} transition={{ duration: 1.1, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: `${2 * size}px` }}>
          <Truck size={24 * size} color={t.accent} strokeWidth={1.8} />
        </motion.div>
        <Package size={18 * size} color={t.textFaint} strokeWidth={1.8} style={{ position: 'absolute', right: 0, bottom: `${2 * size}px` }} />
      </div>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${9.5 * size}px`, color: t.text }}>3{'\u2013'}5 days {'\u00B7'} $5.00</div>
      <motion.div key={`l-${playKey}`} initial={{ opacity: 0.35 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        style={{ display: 'flex', alignItems: 'center', gap: `${4 * size}px`, fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: good, marginTop: `${3 * size}px` }}>
        <Check size={9 * size} strokeWidth={3} /> label printed
      </motion.div>
    </div>
  );
}

function HeroCustomers({ theme, size, playKey }) {
  const t = theme.colors;
  const initials = ['A', 'S', 'M', 'D', 'L'];
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', marginBottom: `${9 * size}px` }}>
        {initials.map((c, j) => (
          <motion.div key={`${playKey}-${j}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 14, delay: 0.05 + j * 0.09 }}
            style={{ width: `${26 * size}px`, height: `${26 * size}px`, borderRadius: '50%', background: `${t.accent}${['22', '33', '22', '33', '22'][j]}`, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${9.5 * size}px`, marginLeft: j ? `-${8 * size}px` : 0, border: `2px solid ${t.surface || t.bg}` }}>{c}</motion.div>
        ))}
      </div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${24 * size}px`, color: t.text, lineHeight: 1 }}>
        <AnimNum key={`c-${playKey}`} value={1204} prefix="" ms={900} />
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.positive || t.accent, marginTop: `${4 * size}px` }}>+12 this week</div>
    </div>
  );
}

function HeroContent({ theme, size, playKey }) {
  const t = theme.colors;
  const post = EMBER_MOSS_JOURNAL[0];
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: `${7 * size}px`, alignItems: 'flex-start', marginBottom: `${7 * size}px` }}>
        <div style={{ width: `${34 * size}px`, flexShrink: 0 }}><ProductImg src={post.img} alt={post.title} size={size} radius={4} fallbackIcon={post.icon} /></div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${7.5 * size}px`, color: t.text, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</div>
      </div>
      <div style={{ height: `${5 * size}px`, borderRadius: '100px', background: t.bgAlt, marginBottom: `${7 * size}px`, overflow: 'hidden' }}>
        <motion.div key={`bar-${playKey}`} initial={{ width: 0 }} animate={{ width: '88%' }} transition={{ delay: 0.1, duration: 0.8 }} style={{ height: '100%', background: `${t.accent}66` }} />
      </div>
      <motion.span key={`pub-${playKey}`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.9 }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: `${3 * size}px`, padding: `${3 * size}px ${8 * size}px`, borderRadius: '100px', background: t.positive || t.accent, color: '#fff', fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${7 * size}px` }}>
        <Check size={8 * size} strokeWidth={3.5} /> Published
      </motion.span>
    </div>
  );
}

function HeroCosting({ theme, size, playKey }) {
  const t = theme.colors;
  const r = 22 * size, c = r + 5 * size;
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: `${6 * size}px` }}>
      <div style={{ position: 'relative', width: `${c * 2}px`, height: `${c * 2}px` }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${c * 2} ${c * 2}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={c} cy={c} r={r} fill="none" stroke={t.bgAlt} strokeWidth={6 * size} />
          <motion.circle key={`ring-${playKey}`} cx={c} cy={c} r={r} fill="none" stroke={t.positive || t.accent} strokeWidth={6 * size} strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 0.62 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${12 * size}px`, color: t.text }}>
          <AnimNum key={`m-${playKey}`} value={62} prefix="" suffix="%" ms={1000} />
        </div>
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textMuted, whiteSpace: 'nowrap' }}>cost $6.85 {'\u2192'} price $18</div>
    </div>
  );
}

function MockupPlatform({ theme, size, paceMs = 26000 }) {
  const t = theme.colors;
  const onAccent = theme.isLight ? '#fff' : t.bg;
  const slideEntered = useSlideEntered();
  const sceneRef = useRef(null);
  const box = useBox(sceneRef);
  const cursorRef = useRef(null);
  const liveRef = useRef(false);
  const [active, setActive] = useState(-1);
  const [plays, setPlays] = useState(() => Array(8).fill(0));
  const [connected, setConnected] = useState(false);
  const [checks, setChecks] = useState(0);

  const MODULES = [
    { Icon: Store,      title: 'Storefront', cap: 'Your branded shop, live',    Hero: HeroStorefront },
    { Icon: Package,    title: 'Products',   cap: 'Catalog + live inventory',   Hero: HeroProducts },
    { Icon: ShoppingCart, title: 'Orders',   cap: 'Checkout to doorstep',       Hero: HeroOrders },
    { Icon: CreditCard, title: 'Payments',   cap: 'Paid straight to you',       Hero: HeroPayments },
    { Icon: Truck,      title: 'Shipping',   cap: 'Rates and labels built in',  Hero: HeroShipping },
    { Icon: Users,      title: 'Customers',  cap: 'Everyone who\u2019s bought', Hero: HeroCustomers },
    { Icon: FileText,   title: 'Content',    cap: 'Journal posts that sell',    Hero: HeroContent },
    { Icon: PieChart,   title: 'Costing',    cap: 'Know your real margin',      Hero: HeroCosting },
  ];

  const cancelAuto = () => { liveRef.current = false; cursorRef.current?.hide(); };
  const activate = (i) => { setActive(i); setPlays((p) => p.map((v, j) => (j === i ? v + 1 : v))); };

  useEffect(() => {
    if (!slideEntered) return undefined;
    liveRef.current = true;
    setActive(-1); setConnected(false); setChecks(0); setPlays(Array(8).fill(0));
    const isLive = () => liveRef.current;
    const k = paceMs / 26000;
    const wait = (ms) => sleep(ms * k);
    (async () => {
      await wait(1300);                                // the cards finish arriving
      for (let i = 0; i < 8; i++) {
        const ok = await pointAndClick({
          cursorRef, frameRef: sceneRef, scroll: false, isLive, moveMs: Math.max(450, 650 * k),
          selector: `[data-demo="mod-${i}"]`, onClick: () => activate(i),
        });
        if (!ok) return;
        await wait(1050);                              // let that card's little animation play
        if (!isLive()) return;
      }
      cursorRef.current?.hide();
      setActive(-1);
      await wait(500);
      if (!isLive()) return;
      setConnected(true);                              // the bus draws and every module snaps onto it
      for (let c = 1; c <= 3; c++) { await wait(750); if (!isLive()) return; setChecks(c); }
    })();
    return () => { liveRef.current = false; };
  }, [slideEntered, paceMs]);

  // ── geometry (real px, measured) ──
  const pad = 14 * size, gap = 12 * size, rowGap = 34 * size, headH = 38 * size, footH = 36 * size;
  const cardW = (box.w - pad * 2 - gap * 3) / 4;
  const cardH = (box.h - headH - footH - rowGap - 4 * size) / 2;
  const pos = (i) => ({ x: pad + (i % 4) * (cardW + gap), y: headH + Math.floor(i / 4) * (cardH + rowGap) });
  const busY = headH + cardH + rowGap / 2;
  const mono = (sz, color, extra) => ({ fontFamily: theme.fonts.mono, fontSize: `${sz * size}px`, color, letterSpacing: '0.06em', textTransform: 'uppercase', ...extra });
  const good = t.positive || t.accent;
  const checkItems = ['Built in', 'Connected', 'Nothing bolted on'];

  return (
    <div ref={sceneRef} style={{ position: 'relative', width: '100%', height: '100%', minHeight: `${300 * size}px`, overflow: 'hidden' }}>
      {slideEntered && (
        <>
          {/* header */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            style={{ position: 'absolute', left: pad, right: pad, top: 4 * size, height: headH - 8 * size, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: `${7 * size}px` }}>
              <PeakMark size={size * 0.7} color={t.accent} />
              <span style={mono(9.5, t.text, { fontWeight: 700 })}>The platform</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: `${6 * size}px`, ...mono(8.5, active >= 0 ? t.accent : t.textFaint) }}>
              {active >= 0 ? <span>{active + 1} / 8 {'\u00B7'} {MODULES[active].title}</span> : <><Lock size={10 * size} color={connected ? t.accent : t.textFaint} /> 8 modules {'\u00B7'} one login</>}
            </div>
          </motion.div>

          {/* the data bus: every module hooks onto it once the tour is done */}
          {connected && (
            <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
              <motion.line x1={pad} y1={busY} x2={box.w - pad} y2={busY} stroke={t.accent} strokeWidth={3 * size} strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.2 }} animate={{ pathLength: 1, opacity: 0.9 }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
              {MODULES.map((_, i) => {
                const p = pos(i), cx = p.x + cardW / 2, top = i < 4;
                const y1 = top ? p.y + cardH : p.y, y2 = busY;
                return (
                  <g key={i}>
                    <motion.line x1={cx} y1={y1} x2={cx} y2={y2} stroke={t.accent} strokeWidth={2.4 * size} strokeLinecap="round"
                      initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.6 + (i % 4) * 0.1, duration: 0.4 }} />
                    <circle r={3.2 * size} fill={t.accent}>
                      <animateMotion dur="1.8s" begin={`${1 + (i % 4) * 0.3}s`} repeatCount="indefinite" path={top ? `M ${cx} ${y1} L ${cx} ${y2}` : `M ${cx} ${y2} L ${cx} ${y1}`} />
                    </circle>
                  </g>
                );
              })}
              <circle r={4 * size} fill={t.accent}>
                <animateMotion dur="3.2s" begin="1s" repeatCount="indefinite" path={`M ${pad} ${busY} L ${box.w - pad} ${busY}`} />
              </circle>
            </svg>
          )}
          {connected && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
              style={{ position: 'absolute', zIndex: 4, left: box.w / 2, top: busY, transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: `${5 * size}px`,
                padding: `${4 * size}px ${12 * size}px`, borderRadius: '100px', background: t.accent, color: onAccent, ...mono(8.5, onAccent, { fontWeight: 700 }), whiteSpace: 'nowrap', boxShadow: `0 ${4 * size}px ${14 * size}px ${t.accent}55` }}>
              <Lock size={9 * size} /> One database {'\u00B7'} one login
            </motion.div>
          )}

          {/* the eight modules */}
          {MODULES.map((m, i) => {
            const p = pos(i), on = active === i;
            return (
              <motion.div key={m.title} initial={{ opacity: 0, y: 20 * size, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.1 + i * 0.07 }}
                style={{ position: 'absolute', left: p.x, top: p.y, width: cardW, height: cardH, zIndex: 2 }}>
                <div data-demo={`mod-${i}`} onClick={() => { cancelAuto(); activate(i); }} style={{
                  height: '100%', boxSizing: 'border-box', cursor: 'pointer', borderRadius: `${10 * size}px`, background: t.surface || t.bg,
                  border: `${on ? 2 : 1}px solid ${on ? t.accent : t.border}`, padding: `${11 * size}px ${11 * size}px ${10 * size}px`,
                  boxShadow: on ? `0 ${10 * size}px ${26 * size}px ${t.accent}40` : `0 ${4 * size}px ${12 * size}px rgba(0,0,0,0.07)`,
                  transform: on ? `translateY(${-4 * size}px) scale(1.035)` : 'none', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: `${7 * size}px` }}>
                    <span style={{ width: `${30 * size}px`, height: `${30 * size}px`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? t.accent : `${t.accent}1A`, color: on ? onAccent : t.accent, transition: 'all 0.3s ease' }}>
                      <m.Icon size={16 * size} color="currentColor" strokeWidth={2} />
                    </span>
                    <span style={mono(8, on ? t.accent : t.textFaint, { fontWeight: 700 })}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${14 * size}px`, color: t.text, lineHeight: 1.1 }}>{m.title}</div>
                  <div style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted, lineHeight: 1.35, margin: `${3 * size}px 0 ${8 * size}px` }}>{m.cap}</div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 0 }}>
                    <m.Hero theme={theme} size={size} playKey={plays[i]} />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* footer: built in / connected / nothing bolted on */}
          <div style={{ position: 'absolute', left: pad, right: pad, bottom: 8 * size, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: `${14 * size}px` }}>
              {checkItems.map((c, j) => (
                <span key={c} style={{ display: 'flex', alignItems: 'center', gap: `${5 * size}px`, ...mono(8.5, checks > j ? t.text : t.textFaint, { fontWeight: 600, transition: 'color 0.3s ease' }) }}>
                  <span style={{ width: `${13 * size}px`, height: `${13 * size}px`, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: checks > j ? good : 'transparent', border: `1.5px solid ${checks > j ? good : t.border}`, transition: 'all 0.3s ease' }}>
                    {checks > j && <Check size={8 * size} color="#fff" strokeWidth={3.5} />}
                  </span>
                  {c}
                </span>
              ))}
            </div>
          </div>

          <AutoCursor ref={cursorRef} theme={theme} size={size} />
        </>
      )}
    </div>
  );
}


function MockupCustomer({ theme, size, autoDemo = false, paceMs = 20000 }) {
  const t = theme.colors;
  const products = EMBER_MOSS_PRODUCTS;
  const [cart, setCart] = useState({});          // { productName: qty }
  const [view, setView] = useState('shop');      // 'shop' | 'cart' | product object
  const slideEntered = useSlideEntered();
  const frameRef = useRef(null);

  const setQty = (name, qty) => setCart(c => {
    if (qty <= 0) { const { [name]: _, ...rest } = c; return rest; }
    return { ...c, [name]: qty };
  });
  const addOne = (p) => setQty(p.name, (cart[p.name] || 0) + 1);

  // Motion-graphics beat: in presentation mode the storefront demos ITSELF
  // with a visible cursor — read down the grid, open a product, add it to the
  // cart, open the cart, then walk the WHOLE checkout: address typed in,
  // shipping + tax calculated, card entered, paid, and the confirmation + receipt
  // email land. Any real click, wheel or touch hands control back.
  const liveRef = useRef(true);
  const cursorRef = useRef(null);
  const checkoutRef = useRef(null);
  const cancelAuto = () => { liveRef.current = false; cursorRef.current?.hide(); };
  useEffect(() => { if (frameRef.current) frameRef.current.scrollTop = 0; }, [view]);   // every new page starts at the top
  useEffect(() => {
    if (!autoDemo || !slideEntered) return;
    liveRef.current = true;
    setView('shop'); setCart({});
    const frame = frameRef.current;
    const isLive = () => liveRef.current;
    // Baseline script plays out in ~46s; stretch/shrink it to however long this
    // slide actually gets (real narration length once recorded, else autoMs).
    const k = paceMs / 46000;
    const wait = (ms) => sleep(ms * k);
    const glideTo = (to, ms) => glide(frameRef.current, to, Math.max(900, ms * k), isLive);
    const click = (selector, onClick) => pointAndClick({ cursorRef, frameRef, selector, isLive, moveMs: Math.max(500, 800 * k), onClick });
    const stop = () => cancelAuto();
    frame?.addEventListener('wheel', stop, { passive: true });
    frame?.addEventListener('touchstart', stop, { passive: true });

    // click a checkout field, then type into it like a person would
    const fill = async (field, text, cps) => {
      if (!(await click(`[data-demo="co-${field}"]`, () => checkoutRef.current?.focus(field)))) return false;
      await wait(200);
      return typeText(text, isLive, (v) => checkoutRef.current?.setValue(field, v), cps / Math.max(0.7, k));
    };

    (async () => {
      await wait(700);
      await glideTo('bottom', 3000);                 // browse all the way down the grid
      await wait(300);
      await glideTo(0, 1500);
      await wait(300);
      if (!(await click('[data-demo="product-2"]', () => setView(products[2])))) return;   // Dragon Mint Tea
      await wait(700);
      if (!(await click('[data-demo="add-to-cart"]', () => addOne(products[2])))) return;
      await wait(600);
      if (!(await click('[data-demo="nav-cart"]', () => setView('cart')))) return;
      await wait(700);
      if (!(await click('[data-demo="checkout"]', () => setView('checkout')))) return;
      await wait(800);

      // 1 · where should we send it?
      if (!(await fill('name', 'Mira Halloran', 18))) return;
      await wait(200);
      if (!(await fill('street', '88 Juniper Lane', 22))) return;
      await wait(200);
      if (!(await fill('city', 'Austin, TX 78701', 22))) return;
      await wait(400);

      // 2 · shipping + tax get calculated
      if (!(await click('[data-demo="co-continue"]', () => checkoutRef.current?.calcShipping()))) return;
      await sleep(SHIP_CALC_MS + 1500 * k);          // the truck drives, rates and tax land in the summary
      if (!isLive()) return;
      if (!(await click('[data-demo="co-continue"]', () => checkoutRef.current?.toPayment()))) return;
      await wait(900);

      // 3 · payment details
      if (!(await fill('card', '4242 4242 4242 4242', 26))) return;
      await wait(200);
      if (!(await fill('exp', '08 / 28', 14))) return;
      await wait(200);
      if (!(await fill('cvc', '123', 10))) return;
      await wait(500);
      if (!(await click('[data-demo="co-pay"]', () => checkoutRef.current?.pay()))) return;
      cursorRef.current?.hide();                     // card is charged — let the confirmation take over
      await sleep(PAY_MS + 500);
      await glideTo(0, 700);
      await wait(2800);                              // parcel pops, receipt email lands, chips tick off
      await glideTo('bottom', 2400);
    })();

    return () => {
      liveRef.current = false;
      frame?.removeEventListener('wheel', stop);
      frame?.removeEventListener('touchstart', stop);
    };
  }, [autoDemo, slideEntered, paceMs]);

  const cartEntries = Object.entries(cart).map(([name, qty]) => ({ ...products.find(p => p.name === name), qty }));
  const cartCount = cartEntries.reduce((s, e) => s + e.qty, 0);
  const subtotal = cartEntries.reduce((s, e) => s + parseFloat(e.price.replace('$', '')) * e.qty, 0);
  const isProductView = typeof view === 'object';

  return (
    <DeviceFrame theme={theme} size={size} url={`${EMBER_MOSS_BRAND.url}/${view === 'checkout' ? 'checkout' : view === 'cart' ? 'cart' : 'shop'}`} fill scrollRef={frameRef} overlay={<AutoCursor ref={cursorRef} theme={theme} size={size} />}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${10 * size}px` }}>
        <button data-demo="nav-shop" onClick={() => { cancelAuto(); setView('shop'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Shop</button>
        <button data-demo="nav-cart" onClick={() => { cancelAuto(); setView(view === 'cart' ? 'shop' : 'cart'); }} style={{
          position: 'relative', border: `1px solid ${t.border}`, borderRadius: '100px',
          padding: `${4 * size}px ${9 * size}px`, background: 'transparent', cursor: 'pointer',
          fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.text,
        }}>
          {view === 'cart' ? '← Shop' : `Cart ${cartCount > 0 ? `(${cartCount})` : ''}`}
        </button>
      </div>

      {isProductView && (
        <ProductDetailView theme={theme} size={size} product={view} onBack={() => { cancelAuto(); setView('shop'); }} onAddToCart={(p) => { cancelAuto(); addOne(p); }} cartQty={cart[view.name] || 0} />
      )}

      {view === 'shop' && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: `${8 * size}px`,
          paddingRight: '2px',
        }}>
          {products.map((p, i) => {
            const qty = cart[p.name] || 0;
            return (
              <ScrollReveal key={p.name} delay={(i % 4) * 0.06} y={16} amount={0.4} style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${8 * size}px`, textAlign: 'center' }}>
                <button data-demo={`product-${i}`} onClick={() => { cancelAuto(); setView(p); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'center', font: 'inherit' }}>
                  <div style={{ marginBottom: `${6 * size}px` }}>
                    <ProductImg src={p.img} alt={p.name} size={size} />
                  </div>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: `${8 * size}px`, color: t.text, marginBottom: '2px' }}>{p.name}</div>
                </button>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, marginBottom: `${6 * size}px` }}>{p.price}</div>
                {qty === 0 ? (
                  <button onClick={() => { cancelAuto(); setQty(p.name, 1); }} style={{
                    width: '100%', padding: `${5 * size}px`, border: 'none', borderRadius: `${4 * size}px`,
                    background: t.accent, color: theme.isLight ? '#fff' : t.bg,
                    fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${7.5 * size}px`, cursor: 'pointer',
                  }}>Add to cart</button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${t.accent}`, borderRadius: `${4 * size}px`, overflow: 'hidden' }}>
                    <button onClick={() => { cancelAuto(); setQty(p.name, qty - 1); }} style={{ flex: 1, border: 'none', background: 'transparent', color: t.accent, fontFamily: theme.fonts.mono, fontSize: `${10 * size}px`, cursor: 'pointer', padding: `${4 * size}px 0` }}>−</button>
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.text, minWidth: `${16 * size}px` }}>{qty}</span>
                    <button onClick={() => { cancelAuto(); setQty(p.name, qty + 1); }} style={{ flex: 1, border: 'none', background: 'transparent', color: t.accent, fontFamily: theme.fonts.mono, fontSize: `${10 * size}px`, cursor: 'pointer', padding: `${4 * size}px 0` }}>+</button>
                  </div>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {view === 'checkout' && (
        <CheckoutView ref={checkoutRef} theme={theme} size={size} items={cartEntries} subtotal={subtotal}
          onBack={() => { cancelAuto(); setView('cart'); }} onInteract={cancelAuto}
          onPlaced={() => setCart({})} onAgain={() => setView('shop')} />
      )}

      {view === 'cart' && (
        <div>
          {cartEntries.length === 0 ? (
            <div style={{ fontFamily: theme.fonts.body, fontSize: `${9 * size}px`, color: t.textFaint, padding: `${16 * size}px 0`, textAlign: 'center' }}>
              Cart is empty — add something first.
            </div>
          ) : (
            <>
              <div style={{ marginBottom: `${10 * size}px` }}>
                {cartEntries.map(e => (
                  <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: `${8 * size}px`, padding: `${6 * size}px 0`, borderBottom: `1px solid ${t.border}` }}>
                    <div style={{ width: `${28 * size}px`, flexShrink: 0 }}>
                      <ProductImg src={e.img} alt={e.name} size={size} radius={4} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.text }}>{e.name}</div>
                      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint }}>{e.price} × {e.qty}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: `${4 * size}px` }}>
                      <button onClick={() => setQty(e.name, e.qty - 1)} style={{ border: `1px solid ${t.border}`, borderRadius: '50%', width: `${16 * size}px`, height: `${16 * size}px`, background: 'transparent', color: t.textMuted, fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, cursor: 'pointer', lineHeight: 1 }}>−</button>
                      <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.text, minWidth: `${12 * size}px`, textAlign: 'center' }}>{e.qty}</span>
                      <button onClick={() => setQty(e.name, e.qty + 1)} style={{ border: `1px solid ${t.border}`, borderRadius: '50%', width: `${16 * size}px`, height: `${16 * size}px`, background: 'transparent', color: t.textMuted, fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, cursor: 'pointer', lineHeight: 1 }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: `${8 * size}px`, borderTop: `1px solid ${t.border}`, marginBottom: `${10 * size}px` }}>
                <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Subtotal</span>
                <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${11 * size}px`, color: t.text }}>${subtotal.toFixed(2)}</span>
              </div>
              <button data-demo="checkout" onClick={() => { cancelAuto(); setView('checkout'); }} style={{
                width: '100%', padding: `${8 * size}px`, border: 'none',
                borderRadius: `${4 * size}px`, background: t.accent, color: theme.isLight ? '#fff' : t.bg,
                fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${9 * size}px`, cursor: 'pointer',
              }}>Checkout →</button>
            </>
          )}
        </div>
      )}
    </DeviceFrame>
  );
}


// ── 5. merchant — dashboard tabs ─────────────────────────────────────────────────
// Order status counts are derived from the ORDERS list itself — not a
// separately invented number — so the donut can never disagree with the
// Orders tab.
function OrderStatusDonut({ theme, size, orders, statusColor }) {
  const t = theme.colors;
  const counts = orders.reduce((acc, o) => { acc[o.s] = (acc[o.s] || 0) + 1; return acc; }, {});
  const entries = Object.entries(counts);
  const total = orders.length;
  const r = 28;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    setRevealed(false);
    const id = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(id);
  }, [orders]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: `${10 * size}px`, width: '100%' }}>
      <svg width={72 * size} height={72 * size} viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke={t.border} strokeWidth="11" />
        {entries.map(([status, count], i) => {
          const dash = (count / total) * circumference;
          const startOffset = -cumulative;
          const el = (
            <circle key={status} cx="40" cy="40" r={r} fill="none"
              stroke={statusColor[status] || t.textFaint} strokeWidth="11"
              strokeDasharray={revealed ? `${dash} ${circumference - dash}` : `0 ${circumference}`}
              strokeDashoffset={startOffset}
              strokeLinecap="butt"
              transform="rotate(-90 40 40)"
              style={{ transition: `stroke-dasharray 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.12}s` }}
            />
          );
          cumulative += dash;
          return el;
        })}
        <text x="40" y="44" textAnchor="middle" fontSize="16" fontFamily={theme.fonts.display} fontWeight="700" fill={t.text}
          style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.4s ease 0.5s' }}>{total}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${3 * size}px` }}>
        {entries.map(([status, count], i) => (
          <div key={status} style={{
            display: 'flex', alignItems: 'center', gap: `${5 * size}px`,
            opacity: revealed ? 1 : 0, transform: revealed ? 'translateX(0)' : 'translateX(6px)',
            transition: `opacity 0.4s ease ${i * 0.08 + 0.3}s, transform 0.4s ease ${i * 0.08 + 0.3}s`,
          }}>
            <span style={{ width: `${7 * size}px`, height: `${7 * size}px`, borderRadius: '50%', background: statusColor[status] || t.textFaint, flexShrink: 0 }} />
            <span style={{ fontFamily: theme.fonts.body, fontSize: `${7 * size}px`, color: t.textMuted }}>{status} ({count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisitorsLineChart({ theme, size, data }) {
  const t = theme.colors;
  const max = Math.max(...data);
  const VW = 220, VH = 50;
  const pathD = data.map((v, i) => {
    const x = (i / (data.length - 1)) * VW;
    const y = VH - (v / max) * VH * 0.9;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  const areaD = pathD + ` L ${VW} ${VH} L 0 ${VH} Z`;

  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    setRevealed(false);
    const id = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(id);
  }, [data]);

  return (
    <div style={{
      width: '100%', overflow: 'hidden',
      clipPath: revealed ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
      transition: 'clip-path 0.9s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <svg width="100%" height={`${60 * size}px`} viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.accent} stopOpacity="0.25" />
            <stop offset="100%" stopColor={t.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#visitorsGrad)" />
        <path d={pathD} fill="none" stroke={t.accent} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {data.map((v, i) => {
          const x = (i / (data.length - 1)) * VW;
          const y = VH - (v / max) * VH * 0.9;
          return <circle key={i} cx={x} cy={y} r="2.5" fill={t.accent} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
    </div>
  );
}

function MockupMerchant({ theme, size, paceMs = 18000 }) {
  const t = theme.colors;
  const tabs = ['Overview', 'Orders', 'Products', 'Customers'];
  const [tab, setTab] = useState(0);
  const slideEntered = useSlideEntered();

  // Motion-graphics beat: a visible cursor runs the dashboard — reads down the
  // Overview, then clicks through Orders, Products and Customers, stopping on
  // one meaningful row in each (an order in progress, the low-stock item, the
  // top customer). A real click, wheel or touch hands control straight back.
  const [hot, setHot] = useState(null);
  const frameRef = useRef(null);
  const cursorRef = useRef(null);
  const liveRef = useRef(false);
  const cancelAuto = () => { liveRef.current = false; cursorRef.current?.hide(); };
  useEffect(() => {
    if (!slideEntered) return;
    setTab(0); setHot(null);
    liveRef.current = true;
    const frame = frameRef.current;
    const isLive = () => liveRef.current;
    const k = paceMs / 15000; // baseline script plays out in ~15s; stretched to the slide's pace
    const wait = (ms) => sleep(ms * k);
    const glideTo = (to, ms) => glide(frameRef.current, to, Math.max(900, ms * k), isLive);
    const click = (selector, onClick) => pointAndClick({ cursorRef, frameRef, selector, isLive, moveMs: Math.max(500, 800 * k), onClick });
    const stop = () => cancelAuto();
    frame?.addEventListener('wheel', stop, { passive: true });
    frame?.addEventListener('touchstart', stop, { passive: true });

    (async () => {
      await wait(900);
      await glideTo('bottom', 2800);                 // read down the overview: KPIs, revenue, orders, visitors
      await wait(300);
      await glideTo(0, 1400);
      if (!(await click('[data-demo="tab-1"]', () => setTab(1)))) return;
      await wait(600);
      if (!(await click('[data-demo="order-#1046"]', () => setHot('order-#1046')))) return;   // an order in progress
      await wait(900);
      if (!(await click('[data-demo="tab-2"]', () => { setHot(null); setTab(2); }))) return;
      await wait(600);
      if (!(await click('[data-demo="product-Solar Radiance Elixir"]', () => setHot('product-Solar Radiance Elixir')))) return;   // low stock
      await wait(1000);
      if (!(await click('[data-demo="tab-3"]', () => { setHot(null); setTab(3); }))) return;
      await wait(600);
      if (!(await click('[data-demo="customer-A. Reyes"]', () => setHot('customer-A. Reyes')))) return;   // top customer
      await wait(1500);
      cursorRef.current?.hide();
    })();

    return () => {
      liveRef.current = false;
      frame?.removeEventListener('wheel', stop);
      frame?.removeEventListener('touchstart', stop);
    };
  }, [slideEntered, paceMs]);
  const goToTab = (i) => { cancelAuto(); setHot(null); setTab(i); };
  const rowHot = (key) => (hot === key ? { background: `${t.accent}14`, boxShadow: `inset 2px 0 0 ${t.accent}` } : null);

  const REVENUE_7D = [820, 1140, 960, 1480, 1290, 1860, 1620];
  const maxRev = Math.max(...REVENUE_7D);
  const VISITORS_7D = [140, 165, 152, 210, 188, 240, 209];

  const ORDERS = [
    { id: '#1048', c: 'R. Alvarez', items: 3, total: '$96',  s: 'Shipped',    tag: null },
    { id: '#1047', c: 'S. Kim',     items: 1, total: '$34',  s: 'Delivered',  tag: 'Gift' },
    { id: '#1046', c: 'D. Osei',    items: 2, total: '$62',  s: 'Processing', tag: null },
    { id: '#1045', c: 'L. Fontaine',items: 4, total: '$142', s: 'Fulfilled',  tag: null },
    { id: '#1044', c: 'T. Nguyen',  items: 1, total: '$28',  s: 'Refunded',   tag: null },
    { id: '#1043', c: 'A. Reyes',   items: 2, total: '$70',  s: 'Delivered',  tag: null },
    { id: '#1042', c: 'A. Reyes',   items: 1, total: '$48',  s: 'Fulfilled',  tag: 'Gift' },
    { id: '#1041', c: 'J. Okoye',   items: 3, total: '$88',  s: 'Processing', tag: null },
    { id: '#1040', c: 'M. Chen',    items: 2, total: '$56',  s: 'Fulfilled',  tag: null },
  ];
  const STATUS_COLOR = {
    Fulfilled:  t.positive,
    Delivered:  t.positive,
    Shipped:    t.accent,
    Processing: t.textFaint,
    Refunded:   t.negative,
  };

  const CUSTOMERS = [
    { name: 'A. Reyes',    orders: 6, spent: '$412' },
    { name: 'J. Okoye',    orders: 2, spent: '$110' },
    { name: 'M. Chen',     orders: 4, spent: '$268' },
    { name: 'S. Kim',      orders: 1, spent: '$34'  },
    { name: 'D. Osei',     orders: 3, spent: '$186' },
    { name: 'L. Fontaine', orders: 5, spent: '$390' },
  ];

  return (
    <DeviceFrame theme={theme} size={size} url={`${COMPANY.url}/merchant`} fill scrollRef={frameRef} overlay={<AutoCursor ref={cursorRef} theme={theme} size={size} />}>
      <div style={{ display: 'flex', gap: `${4 * size}px`, marginBottom: `${10 * size}px`, borderBottom: `1px solid ${t.border}`, paddingBottom: `${6 * size}px` }}>
        {tabs.map((label, i) => (
          <button key={label} data-demo={`tab-${i}`} onClick={() => goToTab(i)} style={{
            padding: `${5 * size}px ${9 * size}px`, border: 'none', borderRadius: `${4 * size}px`,
            background: tab === i ? t.accent : 'transparent',
            color: tab === i ? (theme.isLight ? '#fff' : t.bg) : t.textMuted,
            fontFamily: theme.fonts.body, fontWeight: 500, fontSize: `${8 * size}px`, cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      {tab === 0 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${8 * size}px`, marginBottom: `${12 * size}px` }}>
            {[
              { l: 'Revenue', to: 9170, prefix: '$', d: '+18%' },
              { l: 'Orders', to: ORDERS.length * 4, d: '+6%' },
              { l: 'Visitors', to: 1204, d: '+11%' },
            ].map((k, i) => (
              <ScrollReveal key={k.l} delay={i * 0.1} y={14} amount={0.5} style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${8 * size}px` }}>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k.l}</div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${14 * size}px`, color: t.text }}>
                  <CountUp to={k.to} prefix={k.prefix || ''} duration={1} delay={i * 0.1} />
                </div>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.positive }}>{k.d} ↑</div>
              </ScrollReveal>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: `${8 * size}px`, marginBottom: `${8 * size}px` }}>
            <div style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${10 * size}px` }}>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: `${8 * size}px` }}>Revenue · Last 7 Days</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: `${5 * size}px`, height: `${56 * size}px` }}>
                {REVENUE_7D.map((v, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${(v / maxRev) * 100}%`, borderRadius: `${2 * size}px ${2 * size}px 0 0`,
                    background: i === REVENUE_7D.length - 1 ? t.accent : `${t.accent}55`,
                    animation: `barGrowUp 0.5s ease ${i * 0.05}s both`,
                  }} />
                ))}
              </div>
            </div>

            <div style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${10 * size}px`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: `${6 * size}px`, alignSelf: 'flex-start' }}>Order Status</div>
              <OrderStatusDonut theme={theme} size={size} orders={ORDERS} statusColor={STATUS_COLOR} />
            </div>
          </div>

          <div style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${10 * size}px` }}>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: `${8 * size}px` }}>Visitors · Last 7 Days</div>
            <VisitorsLineChart theme={theme} size={size} data={VISITORS_7D} />
          </div>

          <style>{`@keyframes barGrowUp { from { height: 0; } }`}</style>
        </div>
      )}
      {tab === 1 && (
        <div>
          {ORDERS.map(o => (
            <div key={o.id} data-demo={`order-${o.id}`} onClick={cancelAuto} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${7 * size}px ${4 * size}px`, borderBottom: `1px solid ${t.border}`, fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, transition: 'background 0.3s ease', ...rowHot(`order-${o.id}`) }}>
              <div>
                <span style={{ color: t.text, fontWeight: 500 }}>{o.id}</span>{' '}
                <span style={{ color: t.textFaint }}>· {o.c} · {o.items} item{o.items > 1 ? 's' : ''}</span>
                {o.tag && <span style={{ marginLeft: `${5 * size}px`, fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.accent, border: `1px solid ${t.accent}`, borderRadius: '100px', padding: '1px 5px' }}>{o.tag}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * size}px` }}>
                <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textMuted }}>{o.total}</span>
                <span style={{ color: STATUS_COLOR[o.s], fontSize: `${7.5 * size}px`, fontFamily: theme.fonts.mono, letterSpacing: '0.04em' }}>{o.s}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === 2 && (
        <div>
          {EMBER_MOSS_PRODUCTS.map(p => (
            <div key={p.name} data-demo={`product-${p.name}`} onClick={cancelAuto} style={{ display: 'flex', alignItems: 'center', gap: `${8 * size}px`, padding: `${6 * size}px ${4 * size}px`, borderBottom: `1px solid ${t.border}`, transition: 'background 0.3s ease', ...rowHot(`product-${p.name}`) }}>
              <div style={{ width: `${24 * size}px`, flexShrink: 0 }}>
                <ProductImg src={p.img} alt={p.name} size={size} radius={3} />
              </div>
              <span style={{ flex: 1, fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted }}>{p.name}</span>
              <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: p.stock < 20 ? t.negative : t.accent }}>{p.stock} in stock</span>
            </div>
          ))}
        </div>
      )}
      {tab === 3 && (
        <div>
          {CUSTOMERS.map(c => (
            <div key={c.name} data-demo={`customer-${c.name}`} onClick={cancelAuto} style={{ display: 'flex', alignItems: 'center', gap: `${8 * size}px`, padding: `${6 * size}px ${4 * size}px`, borderBottom: `1px solid ${t.border}`, transition: 'background 0.3s ease', ...rowHot(`customer-${c.name}`) }}>
              <div style={{
                width: `${18 * size}px`, height: `${18 * size}px`, borderRadius: '50%', flexShrink: 0,
                background: `${t.accent}22`, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, fontWeight: 700,
              }}>{c.name[0]}</div>
              <span style={{ flex: 1, fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted }}>{c.name} · {c.orders} order{c.orders > 1 ? 's' : ''}</span>
              <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.accent }}>{c.spent}</span>
            </div>
          ))}
        </div>
      )}
    </DeviceFrame>
  );
}

// ── 6. storefront-theme — live theme switch ──────────────────────────────────────
function MockupThemeSwitch({ theme, size, paceMs = 18000 }) {
  const t = theme.colors;
  const [mt, setMt] = useState(STOREFRONT_THEME_SWATCHES[0]);
  const products = EMBER_MOSS_PRODUCTS.slice(0, 3);
  const slideEntered = useSlideEntered();

  // Motion-graphics beat: a visible cursor picks each theme swatch in turn and
  // the storefront repaints itself — with a slow scroll down each new look so
  // the whole page (not just the top) is seen in that theme. This IS the
  // "watch it repaint live" moment. A real click, wheel or touch takes over.
  const wrapRef = useRef(null);      // whole visual: swatches live OUTSIDE the browser frame
  const frameRef = useRef(null);     // the scrolling storefront preview
  const cursorRef = useRef(null);
  const liveRef = useRef(false);
  const cancelAuto = () => { liveRef.current = false; cursorRef.current?.hide(); };
  useEffect(() => {
    if (!slideEntered) return;
    liveRef.current = true;
    setMt(STOREFRONT_THEME_SWATCHES[0]);
    const frame = frameRef.current;
    const isLive = () => liveRef.current;
    const swatches = STOREFRONT_THEME_SWATCHES;
    const steps = swatches.length - 1;
    const k = paceMs / 20000;
    const moveMs = Math.max(600, 900 * k);
    const look = Math.max(1400, Math.min(2600, 2000 * k));   // slow scroll down each new look
    const back = Math.max(800, 1000 * k);
    // time to spend on each theme so the whole cycle fills ~88% of the slide
    const dwell = Math.max(1800, (paceMs * 0.88 - steps * (moveMs + 360) - 900 * k) / (swatches.length));
    const lookAround = async () => {
      const t0 = performance.now();
      await glide(frameRef.current, 'bottom', look, isLive);   // see the whole page in this theme
      await glide(frameRef.current, 0, back, isLive);
      // previews that fit the frame don't scroll at all, so wait out whatever is left of this theme's time
      await sleep(Math.max(300, dwell - (performance.now() - t0)));
    };
    const stop = () => cancelAuto();
    frame?.addEventListener('wheel', stop, { passive: true });
    frame?.addEventListener('touchstart', stop, { passive: true });

    (async () => {
      await sleep(900 * k);
      await lookAround();                            // start on the first theme, then go through the rest
      for (let i = 1; i < swatches.length; i++) {
        const ok = await pointAndClick({
          cursorRef, frameRef: wrapRef, scroll: false, isLive, moveMs,
          selector: `[data-demo="swatch-${swatches[i].id}"]`,
          onClick: () => setMt(swatches[i]),
        });
        if (!ok) return;
        await sleep(400 * k);
        await lookAround();
        if (!isLive()) return;
      }
      cursorRef.current?.hide();
    })();

    return () => {
      liveRef.current = false;
      frame?.removeEventListener('wheel', stop);
      frame?.removeEventListener('touchstart', stop);
    };
  }, [slideEntered, paceMs]);
  const pickTheme = (candidate) => { cancelAuto(); setMt(candidate); };

  const Preview = {
    elegant: ElegantPreview,
    brutalist: BrutalistPreview,
    bubbly: BubblyPreview,
    minimal: MinimalPreview,
  }[mt.style];

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AutoCursor ref={cursorRef} theme={theme} size={size} />
      <div style={{ flex: '1 1 auto', minHeight: 0, marginBottom: `${10 * size}px` }}>
        <DeviceFrame theme={theme} size={size} url={EMBER_MOSS_BRAND.url} fill scrollRef={frameRef}>
          <Preview mt={mt} size={size} products={products} />
        </DeviceFrame>
      </div>
      <div style={{ display: 'flex', gap: `${6 * size}px`, flexWrap: 'wrap', flexShrink: 0 }}>
        {STOREFRONT_THEME_SWATCHES.map(candidate => (
          <button key={candidate.id} data-demo={`swatch-${candidate.id}`} onClick={() => pickTheme(candidate)} style={{
            display: 'flex', alignItems: 'center', gap: `${5 * size}px`,
            padding: `${5 * size}px ${9 * size}px`, borderRadius: '100px',
            border: `1px solid ${mt.id === candidate.id ? t.accent : t.border}`,
            background: mt.id === candidate.id ? `${t.accent}12` : 'transparent',
            cursor: 'pointer',
          }}>
            <span style={{ width: `${8 * size}px`, height: `${8 * size}px`, borderRadius: '50%', background: candidate.accent, display: 'inline-block' }} />
            <span style={{ fontFamily: theme.fonts.body, fontSize: `${8 * size}px`, color: t.text }}>{candidate.label}</span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: `${6 * size}px`, fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.04em' }}>
        ↑ same products, same photos, same copy — only the layout changes
      </div>
    </div>
  );
}

// ── Elegant (Botanical) — hairline borders, rectangular frames, full page ────
function ElegantPreview({ mt, size, products }) {
  return (
    <div style={{ background: mt.bg, minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${14 * size}px ${18 * size}px`, borderBottom: `1px solid ${mt.accent}30` }}>
        <span style={{ fontFamily: mt.font, fontWeight: 600, fontSize: `${13 * size}px`, color: mt.text, letterSpacing: '0.02em' }}>{EMBER_MOSS_BRAND.name}</span>
        <div style={{ display: 'flex', gap: `${12 * size}px` }}>
          {['Shop', 'Journal', 'Cart'].map(l => <span key={l} style={{ fontFamily: mt.font, fontSize: `${8 * size}px`, color: mt.text, opacity: 0.7 }}>{l}</span>)}
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: `${24 * size}px ${18 * size}px` }}>
        <div style={{ fontFamily: mt.font, fontStyle: 'italic', fontSize: `${16 * size}px`, color: mt.text, marginBottom: `${6 * size}px` }}>{EMBER_MOSS_BRAND.tagline}</div>
        <div style={{ width: `${32 * size}px`, height: '1px', background: mt.accent, margin: '0 auto' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${12 * size}px`, padding: `0 ${18 * size}px ${20 * size}px` }}>
        {products.map(p => (
          <div key={p.name} style={{ border: `1px solid ${mt.accent}30`, borderRadius: `${3 * size}px`, overflow: 'hidden' }}>
            <ProductImg src={p.img} alt={p.name} size={size} radius={0} />
            <div style={{ padding: `${8 * size}px`, textAlign: 'center' }}>
              <div style={{ fontFamily: mt.font, fontSize: `${7.5 * size}px`, color: mt.text, marginBottom: '2px' }}>{p.name}</div>
              <div style={{ fontFamily: mt.font, fontSize: `${7 * size}px`, color: mt.accent }}>{p.price}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${mt.accent}30`, padding: `${18 * size}px`, textAlign: 'center' }}>
        <div style={{ fontFamily: mt.font, fontStyle: 'italic', fontSize: `${9.5 * size}px`, color: mt.text, opacity: 0.85, maxWidth: '70%', margin: '0 auto', lineHeight: 1.6 }}>{EMBER_MOSS_BRAND.manifesto}</div>
      </div>
    </div>
  );
}

// ── Brutalist (Workshop) — hard borders, offset shadow, industrial ───────────
function BrutalistPreview({ mt, size, products }) {
  return (
    <div style={{ background: mt.bg, minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${12 * size}px ${16 * size}px`, borderBottom: `3px solid ${mt.accent}` }}>
        <span style={{ fontFamily: mt.font, fontWeight: 700, fontSize: `${13 * size}px`, color: mt.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{EMBER_MOSS_BRAND.name}</span>
        <span style={{ fontFamily: mt.font, fontSize: `${7 * size}px`, color: mt.bg, background: mt.accent, padding: `${3 * size}px ${7 * size}px`, fontWeight: 700 }}>SHOP →</span>
      </div>
      <div style={{ padding: `${20 * size}px ${16 * size}px 10px` }}>
        <div style={{ fontFamily: mt.font, fontWeight: 700, fontSize: `${15 * size}px`, color: mt.accent, textTransform: 'uppercase', lineHeight: 1.2 }}>{EMBER_MOSS_BRAND.tagline}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${14 * size}px`, padding: `${14 * size}px ${16 * size}px` }}>
        {products.map((p, i) => (
          <div key={p.name} style={{
            border: `2px solid ${mt.text}`, background: mt.bg,
            boxShadow: `${3 * size}px ${3 * size}px 0 ${mt.accent}`,
            transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
          }}>
            <ProductImg src={p.img} alt={p.name} size={size} radius={0} />
            <div style={{ padding: `${5 * size}px`, borderTop: `2px solid ${mt.text}` }}>
              <div style={{ fontFamily: mt.font, fontSize: `${6.5 * size}px`, color: mt.text, marginBottom: '2px' }}>{p.name}</div>
              <div style={{ fontFamily: mt.font, fontSize: `${7 * size}px`, color: mt.accent, fontWeight: 700 }}>{p.price}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: mt.accent, padding: `${16 * size}px`, textAlign: 'center' }}>
        <div style={{ fontFamily: mt.font, fontWeight: 700, fontSize: `${9.5 * size}px`, color: mt.bg, letterSpacing: '0.02em' }}>{EMBER_MOSS_BRAND.manifesto.toUpperCase()}</div>
      </div>
    </div>
  );
}

// ── Bubbly (Bubblegum) — pastel, rounded, maximalist ──────────────────────────
function BubblyPreview({ mt, size, products }) {
  return (
    <div style={{ background: mt.bg, minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: `${10 * size}px`, padding: `${12 * size}px`, flexWrap: 'wrap' }}>
        {[EMBER_MOSS_BRAND.name, 'New In', 'Cart ♡'].map(l => (
          <span key={l} style={{
            fontFamily: mt.font, fontWeight: 700, fontSize: `${8.5 * size}px`, color: '#fff',
            background: mt.accent, borderRadius: '100px', padding: `${5 * size}px ${12 * size}px`,
          }}>{l}</span>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: `${10 * size}px ${18 * size}px ${18 * size}px` }}>
        <div style={{ fontFamily: mt.font, fontWeight: 800, fontSize: `${17 * size}px`, color: mt.text }}>{EMBER_MOSS_BRAND.tagline}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${12 * size}px`, padding: `0 ${16 * size}px ${18 * size}px` }}>
        {products.map((p, i) => (
          <div key={p.name} style={{
            background: '#fff', borderRadius: `${18 * size}px`, padding: `${7 * size}px`, textAlign: 'center',
            boxShadow: `0 ${5 * size}px ${12 * size}px rgba(255,62,158,0.18)`,
            transform: `rotate(${i === 1 ? 0 : (i === 0 ? -3 : 3)}deg)`,
          }}>
            <ProductImg src={p.img} alt={p.name} size={size} radius={14} />
            <div style={{ fontFamily: mt.font, fontWeight: 700, fontSize: `${6.5 * size}px`, color: mt.text, marginTop: `${4 * size}px` }}>{p.name}</div>
            <div style={{ fontFamily: mt.font, fontWeight: 700, fontSize: `${7 * size}px`, color: mt.accent }}>{p.price}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: `${14 * size}px`, borderTop: `2px dashed ${mt.accent}50` }}>
        <div style={{ fontFamily: mt.font, fontWeight: 600, fontSize: `${9 * size}px`, color: mt.accent }}>{EMBER_MOSS_BRAND.manifesto} ✨</div>
      </div>
    </div>
  );
}

// ── Minimal (Directorate) — institutional, no ornament ────────────────────────
function MinimalPreview({ mt, size, products }) {
  return (
    <div style={{ background: mt.bg, minHeight: '100%', display: 'flex' }}>
      <div style={{ width: `${64 * size}px`, flexShrink: 0, borderRight: `1px solid ${mt.accent}30`, padding: `${16 * size}px ${10 * size}px`, display: 'flex', flexDirection: 'column', gap: `${10 * size}px` }}>
        <div style={{ width: `${20 * size}px`, height: `${20 * size}px`, borderRadius: '50%', border: `2px solid ${mt.accent}`, margin: '0 auto' }} />
        {['Catalog', 'Journal', 'Status'].map(l => (
          <div key={l} style={{ fontFamily: mt.font, fontSize: `${6 * size}px`, color: mt.text, textAlign: 'center', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{l}</div>
        ))}
      </div>
      <div style={{ flex: 1, padding: `${18 * size}px` }}>
        <div style={{ fontFamily: mt.font, fontWeight: 600, fontSize: `${9 * size}px`, color: mt.accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: `${4 * size}px` }}>{EMBER_MOSS_BRAND.name}</div>
        <div style={{ fontFamily: mt.font, fontWeight: 600, fontSize: `${12 * size}px`, color: mt.text, marginBottom: `${16 * size}px` }}>{EMBER_MOSS_BRAND.tagline}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${14 * size}px`, marginBottom: `${16 * size}px` }}>
          {products.map(p => (
            <div key={p.name}>
              <ProductImg src={p.img} alt={p.name} size={size} radius={2} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: `${5 * size}px` }}>
                <span style={{ fontFamily: mt.font, fontSize: `${6.5 * size}px`, color: mt.text }}>{p.name}</span>
                <span style={{ fontFamily: mt.font, fontSize: `${6.5 * size}px`, color: mt.accent }}>{p.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${mt.accent}30`, paddingTop: `${10 * size}px` }}>
          <div style={{ fontFamily: mt.font, fontSize: `${7 * size}px`, color: mt.text, letterSpacing: '0.06em' }}>{EMBER_MOSS_BRAND.manifesto}</div>
        </div>
      </div>
    </div>
  );
}




// ── 7. workflow — clickable horizontal steps ────────────────────────────────────
function MockupWorkflow({ theme, size, paceMs = 20000 }) {
  const t = theme.colors;
  const steps = [
    { l: 'Sign up',      d: 'Merchant creates an account and picks a business type.' },
    { l: 'Storefront',   d: 'Theme selected, branding applied, storefront goes live.' },
    { l: 'Products',     d: 'Catalog and inventory added, ready to sell.' },
    { l: 'Order placed', d: 'A customer discovers the store and checks out.' },
    { l: 'Payment',      d: 'Stripe processes the transaction automatically.' },
    { l: 'Fulfilled',    d: 'Merchant ships it — the order closes the loop, and the customer is notified.' },
  ];
  const [active, setActive] = useState(0);
  const products = EMBER_MOSS_PRODUCTS.slice(0, 3);
  const slideEntered = useSlideEntered();

  // Motion-graphics beat: walk through all six steps automatically once the
  // slide opens, ~1.1s apart, so the "one continuous path" reads as motion
  // rather than a static diagram. Clicking a dot takes over immediately.
  const autoRef = useRef(false);
  useEffect(() => {
    if (!slideEntered) return;
    setActive(0);
    autoRef.current = true;
    const gap = Math.max(800, (paceMs * 0.82) / Math.max(steps.length - 1, 1));
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i >= steps.length) { clearInterval(id); return; }
      if (autoRef.current) setActive(i);
    }, gap);
    return () => clearInterval(id);
  }, [slideEntered, paceMs]);
  const goToStep = (i) => { autoRef.current = false; setActive(i); };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: `${12 * size}px`, flexShrink: 0 }}>
        {steps.map((s, i) => (
          <div key={s.l} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <button onClick={() => goToStep(i)} style={{
              width: `${24 * size}px`, height: `${24 * size}px`, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${t.accent}`, cursor: 'pointer',
              background: active === i ? t.accent : (i < active ? `${t.accent}22` : 'transparent'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: theme.fonts.mono, fontSize: `${9 * size}px`, fontWeight: 600,
              color: active === i ? (theme.isLight ? '#fff' : t.bg) : t.accent,
              transition: 'background 0.25s ease',
            }}>{i + 1}</button>
            {i < steps.length - 1 && <div style={{ flex: 1, height: '2px', background: i < active ? t.accent : t.border, transition: 'background 0.25s ease' }} />}
          </div>
        ))}
      </div>

      {/* caption */}
      <div style={{ marginBottom: `${10 * size}px`, flexShrink: 0 }}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: `${9 * size}px`, color: t.accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: `${3 * size}px` }}>
          Step {active + 1} · {steps[active].l}
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: `${10 * size}px`, color: t.textMuted }}>
          {steps[active].d}
        </div>
      </div>

      {/* the actual visual, per step */}
      <div style={{ flex: '1 1 auto', minHeight: `${140 * size}px` }}>
        {active === 0 && <WorkflowSignup theme={theme} size={size} />}
        {active === 1 && <WorkflowStorefront theme={theme} size={size} />}
        {active === 2 && <WorkflowProducts theme={theme} size={size} products={products} />}
        {active === 3 && <WorkflowOrder theme={theme} size={size} products={products} />}
        {active === 4 && <WorkflowPayment theme={theme} size={size} />}
        {active === 5 && <WorkflowFulfilled theme={theme} size={size} />}
      </div>
    </div>
  );
}

// ── Step 1: Sign up — a real-looking signup form, email verifies itself ──────
function WorkflowSignup({ theme, size }) {
  const t = theme.colors;
  const [verified, setVerified] = useState(false);
  useEffect(() => { setVerified(false); const id = setTimeout(() => setVerified(true), 900); return () => clearTimeout(id); }, []);
  return (
    <DeviceFrame theme={theme} size={size} url="peakenterprise.ca/signup" fill>
      <div style={{ maxWidth: '260px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${6 * size}px`, marginBottom: `${14 * size}px` }}>
          <UserPlus size={16 * size} color={t.accent} />
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${11 * size}px`, color: t.text }}>Create your account</span>
        </div>
        {['Business name', 'Email'].map(label => (
          <div key={label} style={{ marginBottom: `${8 * size}px` }}>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: `${3 * size}px` }}>{label}</div>
            <div style={{ border: `1px solid ${t.border}`, borderRadius: `${4 * size}px`, padding: `${7 * size}px ${9 * size}px`, background: t.bgAlt, fontFamily: theme.fonts.body, fontSize: `${8 * size}px`, color: t.textMuted }}>
              {label === 'Business name' ? 'Ember & Moss' : 'hello@emberandmoss.shop'}
            </div>
          </div>
        ))}
        <button style={{ width: '100%', padding: `${8 * size}px`, border: 'none', borderRadius: `${4 * size}px`, background: t.accent, color: theme.isLight ? '#fff' : t.bg, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${8.5 * size}px`, marginBottom: `${10 * size}px` }}>Create account</button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: `${6 * size}px`, padding: `${7 * size}px ${9 * size}px`,
          borderRadius: `${4 * size}px`, background: verified ? `${t.positive || t.accent}14` : t.bgAlt,
          border: `1px solid ${verified ? (t.positive || t.accent) : t.border}`, transition: 'all 0.3s ease',
        }}>
          {verified ? <CheckCircle2 size={12 * size} color={t.positive || t.accent} /> : <Mail size={12 * size} color={t.textFaint} />}
          <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: verified ? (t.positive || t.accent) : t.textFaint }}>
            {verified ? 'Email verified' : 'Verifying email…'}
          </span>
        </div>
      </div>
    </DeviceFrame>
  );
}

// ── Step 2: Storefront — theme applied, storefront live ──────────────────────
function WorkflowStorefront({ theme, size }) {
  const t = theme.colors;
  const mt = STOREFRONT_THEME_SWATCHES[0];
  return (
    <DeviceFrame theme={theme} size={size} url={EMBER_MOSS_BRAND.url} fill>
      <div style={{ display: 'flex', alignItems: 'center', gap: `${6 * size}px`, marginBottom: `${10 * size}px` }}>
        <Sparkles size={14 * size} color={t.accent} />
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Theme applied · Botanical</span>
      </div>
      <div style={{ background: mt.bg, borderRadius: `${6 * size}px`, overflow: 'hidden', border: `1px solid ${mt.accent}30` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${8 * size}px ${12 * size}px`, borderBottom: `1px solid ${mt.accent}30` }}>
          <span style={{ fontFamily: mt.font, fontWeight: 600, fontSize: `${10 * size}px`, color: mt.text }}>{EMBER_MOSS_BRAND.name}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: `${3 * size}px`, fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.positive || t.accent }}>
            <span style={{ width: `${5 * size}px`, height: `${5 * size}px`, borderRadius: '50%', background: t.positive || t.accent }} /> LIVE
          </span>
        </div>
        <div style={{ padding: `${14 * size}px`, textAlign: 'center' }}>
          <div style={{ fontFamily: mt.font, fontStyle: 'italic', fontSize: `${11 * size}px`, color: mt.text }}>{EMBER_MOSS_BRAND.tagline}</div>
        </div>
      </div>
    </DeviceFrame>
  );
}

// ── Step 3: Products — catalog added, ready to sell ──────────────────────────
function WorkflowProducts({ theme, size, products }) {
  const t = theme.colors;
  return (
    <DeviceFrame theme={theme} size={size} url={`${COMPANY.url}/merchant/products`} fill>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${10 * size}px` }}>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textFaint, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Catalog</span>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.positive || t.accent }}>{EMBER_MOSS_PRODUCTS.length} products · ready to sell</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${8 * size}px` }}>
        {products.map(p => (
          <div key={p.name} style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${7 * size}px`, textAlign: 'center' }}>
            <ProductImg src={p.img} alt={p.name} size={size} />
            <div style={{ fontFamily: theme.fonts.body, fontSize: `${7 * size}px`, color: t.text, marginTop: `${5 * size}px` }}>{p.name}</div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.accent }}>{p.price}</div>
          </div>
        ))}
      </div>
    </DeviceFrame>
  );
}

// ── Step 4: Order placed — customer checks out ────────────────────────────────
function WorkflowOrder({ theme, size, products }) {
  const t = theme.colors;
  const cartItems = products.slice(0, 2);
  const subtotal = cartItems.reduce((s, p) => s + parseFloat(p.price.replace('$', '')), 0);
  return (
    <DeviceFrame theme={theme} size={size} url={`${EMBER_MOSS_BRAND.url}/checkout`} fill>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${10 * size}px` }}>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textFaint, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Checkout</span>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent }}>Order #1049</span>
      </div>
      {cartItems.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: `${8 * size}px`, padding: `${6 * size}px 0`, borderBottom: `1px solid ${t.border}` }}>
          <div style={{ width: `${26 * size}px`, flexShrink: 0 }}><ProductImg src={p.img} alt={p.name} size={size} radius={4} /></div>
          <span style={{ flex: 1, fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.text }}>{p.name}</span>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8.5 * size}px`, color: t.accent }}>{p.price}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${8 * size}px 0`, marginTop: `${4 * size}px`, borderTop: `1px solid ${t.border}` }}>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textFaint, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total</span>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${11 * size}px`, color: t.text }}>${subtotal.toFixed(2)}</span>
      </div>
    </DeviceFrame>
  );
}

// ── Step 5: Payment — processed automatically ─────────────────────────────────
function WorkflowPayment({ theme, size }) {
  const t = theme.colors;
  const [done, setDone] = useState(false);
  useEffect(() => { setDone(false); const id = setTimeout(() => setDone(true), 800); return () => clearTimeout(id); }, []);
  return (
    <DeviceFrame theme={theme} size={size} url="checkout.stripe.com" fill>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: `${10 * size}px` }}>
        <div style={{
          width: `${44 * size}px`, height: `${44 * size}px`, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: done ? `${t.positive || t.accent}18` : t.bgAlt,
          transition: 'background 0.3s ease',
        }}>
          {done ? <CheckCircle2 size={22 * size} color={t.positive || t.accent} /> : <CreditCard size={20 * size} color={t.textFaint} />}
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${12 * size}px`, color: t.text }}>
          {done ? 'Payment successful' : 'Processing payment…'}
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textFaint }}>$82.00 · •••• 4242</div>
      </div>
    </DeviceFrame>
  );
}

// ── Step 6: Fulfilled — shipped, customer notified ────────────────────────────
function WorkflowFulfilled({ theme, size }) {
  const t = theme.colors;
  const events = [
    { time: '9:02 AM',  label: 'Label created',              Icon: FileText },
    { time: '11:40 AM', label: 'Picked up by carrier',       Icon: Package },
    { time: '2:15 PM',  label: 'In transit — Calgary, AB',   Icon: Truck },
    { time: '4:50 PM',  label: 'Out for delivery',           Icon: Truck },
    { time: '6:12 PM',  label: 'Delivered',                  Icon: CheckCircle2 },
  ];
  const n = events.length;

  const emails = [
    { from: 'Ember & Moss', subject: 'Welcome! Here\u2019s 10% off', time: '9:15 AM', body: 'Thanks for creating an account. Use code WELCOME10 on your first order.' },
    { from: 'Ember & Moss', subject: 'Your order shipped!', time: '6:14 PM', body: 'Order #1049 is on its way. Sent automatically \u2014 the merchant didn\u2019t lift a finger.' },
    { from: 'Ember & Moss', subject: 'New arrivals this week', time: 'Yesterday', body: 'Three new scents just landed \u2014 including a Dragon Mint Tea restock.' },
  ];
  const targetIndex = 1; // the "shipped" email the auto-sequence clicks into
  const ROW_H = 34; // px at size=1 — kept fixed so the fake cursor's target position is predictable

  // Motion-graphics beat: after the tracking timeline settles, a fake
  // cursor drifts down to the "shipped" email and clicks it open — the
  // customer's actual experience, not just a static preview. Any real
  // click on any email cancels the script and opens that email instead.
  const [stage, setStage] = useState('list'); // 'list' | 'clicking' | 'open'
  const [openIndex, setOpenIndex] = useState(targetIndex);
  const liveRef = useRef(true);
  useEffect(() => {
    liveRef.current = true;
    setStage('list');
    setOpenIndex(targetIndex);
    const base = 0.15 * n * 1000;
    const t1 = setTimeout(() => { if (liveRef.current) setStage('clicking'); }, base + 1400);
    const t2 = setTimeout(() => { if (liveRef.current) setStage('open'); }, base + 2300);
    return () => { liveRef.current = false; clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const openEmail = (i) => { liveRef.current = false; setOpenIndex(i); setStage('open'); };
  const backToList = () => { liveRef.current = false; setStage('list'); };

  const cursorTop = (ROW_H * targetIndex + ROW_H / 2) * size;

  // Motion-graphics beat: a UPS/FedEx-style tracking timeline that draws
  // itself in top-to-bottom the moment this step becomes active — the dot
  // and connecting line for each stop land in sequence. Completed stops
  // turn positive-green (progress/success), the final "Delivered" stop
  // lands in the theme's accent colour instead, so the eye reads it as the
  // milestone rather than just one more checkmark.
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${10 * size}px`, height: '100%' }}>
      <DeviceFrame theme={theme} size={size} url={`${COMPANY.url}/merchant/orders`}>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: `${10 * size}px` }}>Order #1049 · Tracking</div>
        <div style={{ position: 'relative', paddingLeft: `${4 * size}px` }}>
          {events.map((ev, i) => {
            const isLast = i === n - 1;
            const dotColor = isLast ? t.accent : (t.positive || '#22c55e');
            return (
              <div key={ev.label} style={{ display: 'flex', gap: `${10 * size}px`, position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${18 * size}px`, flexShrink: 0 }}>
                  <Reveal delay={0.15 * i} scale={0.4} duration={0.4} style={{
                    width: `${18 * size}px`, height: `${18 * size}px`, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    background: dotColor, border: `1.5px solid ${dotColor}`,
                  }}>
                    <ev.Icon size={9 * size} color={theme.isLight ? '#fff' : t.bg} strokeWidth={2.2} />
                  </Reveal>
                  {!isLast && (
                    <Reveal delay={0.15 * i + 0.1} as="div" y={0} scale={1} duration={0.35}
                      style={{ width: '2px', flex: 1, minHeight: `${16 * size}px`, background: t.positive || '#22c55e', opacity: 0.35, transformOrigin: 'top' }} />
                  )}
                </div>
                <Reveal delay={0.15 * i + 0.05} y={4} duration={0.4} style={{ paddingBottom: `${14 * size}px` }}>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: isLast ? 700 : 500, fontSize: `${8.5 * size}px`, color: isLast ? t.accent : (t.positive || '#22c55e') }}>{ev.label}</div>
                  <div style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint }}>{ev.time}</div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </DeviceFrame>
      <DeviceFrame theme={theme} size={size} url="inbox">
        <Reveal delay={0.15 * n + 0.2} y={10} duration={0.45} style={{ display: 'flex', alignItems: 'center', gap: `${6 * size}px`, marginBottom: `${8 * size}px` }}>
          <Mail size={13 * size} color={t.accent} />
          <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Customer inbox</span>
        </Reveal>

        {stage !== 'open' ? (
          <div style={{ position: 'relative' }}>
            {emails.map((e, i) => (
              <Reveal key={e.subject} delay={0.15 * n + 0.35 + i * 0.12} y={8} duration={0.35}
                onClick={() => openEmail(i)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: `${2 * size}px`, cursor: 'pointer',
                  padding: `${7 * size}px ${6 * size}px`, minHeight: `${ROW_H * size}px`, boxSizing: 'border-box',
                  borderBottom: `1px solid ${t.border}`,
                  background: i === targetIndex && stage === 'clicking' ? `${t.accent}14` : 'transparent',
                  transition: 'background 0.3s ease',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${7.5 * size}px`, color: t.text }}>{e.from}</span>
                  <span style={{ fontFamily: theme.fonts.mono, fontSize: `${6 * size}px`, color: t.textFaint }}>{e.time}</span>
                </div>
                <span style={{ fontFamily: theme.fonts.body, fontSize: `${7 * size}px`, color: t.textMuted }}>{e.subject}</span>
              </Reveal>
            ))}
            <motion.div
              initial={false}
              animate={{
                opacity: stage === 'clicking' ? 1 : 0,
                x: stage === 'clicking' ? 8 * size : 40 * size,
                y: stage === 'clicking' ? cursorTop : -10 * size,
                scale: stage === 'clicking' ? [1, 0.75, 1] : 1,
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute', top: 0, left: 0, width: `${9 * size}px`, height: `${9 * size}px`,
                borderRadius: '50%', background: t.accent, boxShadow: `0 0 0 ${4 * size}px ${t.accent}33`,
                pointerEvents: 'none',
              }}
            />
          </div>
        ) : (
          <Reveal y={8} duration={0.4}>
            <button onClick={backToList} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: `${8 * size}px`,
              fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint,
            }}>&larr; Inbox</button>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, marginBottom: `${4 * size}px` }}>{emails[openIndex].from} · {emails[openIndex].time}</div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${8.5 * size}px`, color: t.text, marginBottom: `${6 * size}px` }}>{emails[openIndex].subject}</div>
            <div style={{ fontFamily: theme.fonts.body, fontSize: `${7.5 * size}px`, color: t.textMuted, lineHeight: 1.5 }}>{emails[openIndex].body}</div>
          </Reveal>
        )}
      </DeviceFrame>
    </div>
  );
}

// ── 8. portal — six subscriptions in, ONE core out ───────────────────────────────
// The story: you're paying for six tools that don't know about each other (big
// logos, big prices, a running total, and the broken "seams" between them). Then
// all six get pulled into Peak — and Peak is shown for what it is, the CORE:
// a glowing hub with the whole workflow running off it — business, storefront,
// customer, order, payment, fulfillment — lighting up in order, one connected
// loop, with the old tools reduced to a "replaces" list and the savings counted up.

// measure an element's layout size (unscaled px) so a scene can be placed in real px
function useBox(ref, fallback = { w: 720, h: 420 }) {
  const [box, setBox] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => setBox({ w: el.offsetWidth || fallback.w, h: el.offsetHeight || fallback.h });
    read();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(read) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);
  return box;
}

// an integer that glides to its new value
function AnimNum({ value, prefix = '$', suffix = '', ms = 700 }) {
  const [shown, setShown] = useState(0);
  const fromRef = useRef(0);
  useEffect(() => {
    const from = fromRef.current, t0 = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      const v = from + (value - from) * e;
      fromRef.current = v; setShown(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return <>{prefix}{Math.round(shown).toLocaleString('en-US')}{suffix}</>;
}

function MockupPortal({ theme, size, paceMs = 24000 }) {
  const t = theme.colors;
  const onAccent = theme.isLight ? '#fff' : t.bg;
  const [after, setAfter] = useState(false);
  const [landed, setLanded] = useState(0);      // subscription cards landed so far (drives the running total)
  const [active, setActive] = useState(-1);     // workflow node currently lit
  const slideEntered = useSlideEntered();
  const wrapRef = useRef(null);
  const cursorRef = useRef(null);
  const liveRef = useRef(false);
  const sceneRef = useRef(null);
  const box = useBox(sceneRef);

  const SUBS = [
    { name: 'Shopify',    Icon: SiShopify,    color: '#95BF47', min: 30 },
    { name: 'Mailchimp',  Icon: SiMailchimp,  color: '#FFE01B', min: 20 },
    { name: 'HubSpot',    Icon: SiHubspot,    color: '#FF7A59', min: 50 },
    { name: 'Calendly',   Icon: SiCalendly,   color: '#006BFF', min: 20 },
    { name: 'QuickBooks', Icon: SiQuickbooks, color: '#2CA01C', min: 25 },
    { name: 'Notion',     Icon: SiNotion,     color: t.text,    min: 15 },
  ];
  const FLOW = [
    { label: 'Business',    Icon: Briefcase },
    { label: 'Storefront',  Icon: Store },
    { label: 'Customer',    Icon: Users },
    { label: 'Order',       Icon: ClipboardList },
    { label: 'Payment',     Icon: CreditCard },
    { label: 'Fulfillment', Icon: Truck },
  ];
  const total = SUBS.reduce((s, x) => s + x.min, 0);
  const peakLow = parseInt(PRICING.starter.replace(/[^0-9–-]/g, '').split(/[–-]/)[0], 10);
  const savings = total - peakLow;
  const runningTotal = SUBS.slice(0, landed).reduce((s, x) => s + x.min, 0);
  const red = t.negative || '#DB3521';

  // the narration says "Before: ... After: ..." — a cursor glides to the button and
  // clicks it a little over a third of the way in (a real click takes over).
  useEffect(() => {
    if (!slideEntered) return undefined;
    setAfter(false);
    liveRef.current = true;
    const isLive = () => liveRef.current;
    const flipAt = Math.max(5000, paceMs * 0.36);
    (async () => {
      await sleep(Math.max(1500, flipAt - 1300));       // the cards land, the total ticks, the seams show
      if (!isLive()) return;
      await pointAndClick({ cursorRef, frameRef: wrapRef, scroll: false, isLive, moveMs: 900, selector: '[data-demo="portal-toggle"]', onClick: () => setAfter(true) });
      cursorRef.current?.hide();
    })();
    return () => { liveRef.current = false; };
  }, [slideEntered, paceMs]);

  // the six cards land one by one and the running total ticks up
  useEffect(() => {
    if (after || !slideEntered) return undefined;
    setLanded(0);
    const ids = SUBS.map((_, i) => setTimeout(() => setLanded(i + 1), 650 + i * 380));
    return () => ids.forEach(clearTimeout);
  }, [after, slideEntered]);

  // after: the workflow lights up business -> fulfillment in the order the narration says it, then keeps looping
  useEffect(() => {
    if (!after) { setActive(-1); return undefined; }
    const step = Math.max(700, paceMs * 0.04);
    let i = 0, iv;
    const start = setTimeout(() => {
      setActive(0);
      iv = setInterval(() => { i = (i + 1) % FLOW.length; setActive(i); }, step);
    }, 2300);
    return () => { clearTimeout(start); clearInterval(iv); };
  }, [after, paceMs]);

  const toggle = () => { liveRef.current = false; cursorRef.current?.hide(); setAfter(a => !a); };

  // ── geometry (real px, measured) ──
  const pad = 16 * size, gap = 12 * size, topH = 30 * size, bottomH = 66 * size;
  const areaTop = topH, areaH = Math.max(120, box.h - topH - bottomH);
  const cardW = (box.w - pad * 2 - gap * 2) / 3;
  const cardH = Math.min(136 * size, (areaH - gap) / 2);
  const gy0 = areaTop + (areaH - (cardH * 2 + gap)) / 2;
  const cardPos = SUBS.map((_, i) => ({ x: pad + (i % 3) * (cardW + gap), y: gy0 + Math.floor(i / 3) * (cardH + gap) }));
  const seams = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) seams.push({ x: pad + (c + 1) * cardW + c * gap + gap / 2, y: gy0 + r * (cardH + gap) + cardH / 2 });
  for (let c = 0; c < 3; c++) seams.push({ x: pad + c * (cardW + gap) + cardW / 2, y: gy0 + cardH + gap / 2 });

  const hubX = box.w / 2, hubY = areaTop + areaH / 2, hubR = 60 * size;
  const nodeW = 98 * size, nodeH = 68 * size;
  const rx = Math.max(90 * size, box.w / 2 - nodeW / 2 - pad), ry = Math.max(60 * size, areaH / 2 - nodeH / 2 - 2 * size);
  const nodes = FLOW.map((f, i) => {
    const a = (-90 + i * 60) * Math.PI / 180;
    return { ...f, x: hubX + rx * Math.cos(a), y: hubY + ry * Math.sin(a) };
  });

  const mono = (sz, color, extra) => ({ fontFamily: theme.fonts.mono, fontSize: `${sz * size}px`, color, letterSpacing: '0.06em', textTransform: 'uppercase', ...extra });

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AutoCursor ref={cursorRef} theme={theme} size={size} />
      <div ref={sceneRef} style={{
        flex: '1 1 auto', minHeight: `${240 * size}px`, position: 'relative', overflow: 'hidden',
        border: `1px solid ${after ? t.accent : t.border}`, borderRadius: `${8 * size}px`, marginBottom: `${10 * size}px`, transition: 'border-color 0.6s ease',
      }}>
        {/* ── BEFORE: six subscriptions, big and loud ── */}
        <motion.div initial={false} animate={{ opacity: after ? 0 : 1 }} transition={{ duration: 0.3 }}
          style={{ position: 'absolute', left: pad, top: 10 * size, ...mono(8.5, t.textFaint) }}>What you&apos;re paying for today</motion.div>

        {SUBS.map((s, i) => (
          <motion.div key={s.name}
            initial={{ opacity: 0, y: 20 * size, scale: 0.9, x: 0, rotate: 0 }}
            animate={after
              ? { x: hubX - (cardPos[i].x + cardW / 2), y: hubY - (cardPos[i].y + cardH / 2), scale: 0.08, opacity: 0, rotate: (i % 2 ? 1 : -1) * 220 }
              : { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
            transition={after ? { duration: 0.8, delay: i * 0.05, ease: [0.5, 0, 0.9, 0.4] } : { type: 'spring', stiffness: 230, damping: 18, delay: 0.5 + i * 0.38 }}
            style={{ position: 'absolute', left: cardPos[i].x, top: cardPos[i].y, width: cardW, height: cardH, zIndex: 2, pointerEvents: 'none' }}>
            <div style={{
              height: '100%', border: `1px solid ${t.border}`, borderRadius: `${9 * size}px`, background: t.surface || t.bg,
              boxShadow: `0 ${5 * size}px ${14 * size}px rgba(0,0,0,0.08)`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: `${6 * size}px`,
            }}>
              <s.Icon size={38 * size} color={s.color} />
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${11 * size}px`, color: t.text }}>{s.name}</div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${22 * size}px`, color: red, lineHeight: 1 }}>
                ${s.min}<span style={{ fontFamily: theme.fonts.mono, fontWeight: 500, fontSize: `${9 * size}px`, color: t.textFaint }}>+/mo</span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* the seams between the tools — where the money and the hours leak */}
        {seams.map((m, k) => (
          <motion.div key={k} initial={{ scale: 0, opacity: 0 }}
            animate={after ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={after ? { duration: 0.25 } : { type: 'spring', stiffness: 420, damping: 12, delay: 3.1 + k * 0.1 }}
            style={{
              position: 'absolute', zIndex: 3, left: m.x - 8 * size, top: m.y - 8 * size, width: `${16 * size}px`, height: `${16 * size}px`, borderRadius: '50%',
              background: red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${9 * size}px`, boxShadow: '0 1px 4px rgba(0,0,0,0.3)', pointerEvents: 'none',
            }}>{'\u2715'}</motion.div>
        ))}

        {!after && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ position: 'absolute', left: pad, right: pad, bottom: 12 * size, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: `${12 * size}px` }}>
            <div>
              <div style={mono(8.5, t.textFaint)}>Starting at</div>
              <div style={mono(7, t.textFaint, { textTransform: 'none', marginTop: `${3 * size}px` }) }>{'\u2026'}plus every hour you spend stitching them together</div>
            </div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${30 * size}px`, color: red, lineHeight: 1, whiteSpace: 'nowrap' }}>
              <AnimNum value={runningTotal} prefix="$" suffix="/mo" ms={420} />
            </div>
          </motion.div>
        )}

        {/* ── AFTER: Peak is the core ── */}
        {after && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ position: 'absolute', left: pad, top: 10 * size, ...mono(8.5, t.accent) }}>One subscription</motion.div>

            <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
              {nodes.map((n, i) => {
                const nx = nodes[(i + 1) % nodes.length];
                const live = active === i;
                const arrived = active === (i + 1) % nodes.length;
                return (
                  <g key={i}>
                    {/* spoke: hub -> node */}
                    <motion.line x1={hubX} y1={hubY} x2={n.x} y2={n.y} stroke={t.accent} strokeLinecap="round"
                      initial={{ opacity: 0 }} animate={{ opacity: live ? 0.95 : 0.3, strokeWidth: (live ? 2.8 : 1.6) * size }} transition={{ duration: 0.3, delay: live ? 0 : (active < 0 ? 1 + i * 0.2 : 0) }} />
                    {/* the loop: node -> next node */}
                    <motion.line x1={n.x} y1={n.y} x2={nx.x} y2={nx.y} stroke={t.accent} strokeLinecap="round" strokeDasharray={`${5 * size} ${5 * size}`}
                      initial={{ opacity: 0 }} animate={{ opacity: arrived ? 0.9 : 0.22, strokeWidth: (arrived ? 2.4 : 1.4) * size }} transition={{ duration: 0.3, delay: active < 0 ? 1.4 + i * 0.2 : 0 }} />
                    {/* a data packet running out from the core to this node, forever */}
                    <circle r={3 * size} fill={t.accent}>
                      <animateMotion dur="2.4s" begin={`${1.6 + i * 0.4}s`} repeatCount="indefinite" path={`M ${hubX} ${hubY} L ${n.x} ${n.y}`} />
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* the core */}
            <div style={{ position: 'absolute', left: hubX - hubR, top: hubY - hubR, width: hubR * 2, height: hubR * 2, zIndex: 3 }}>
              {[0, 1.4].map((d) => (
                <span key={d} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `${2 * size}px solid ${t.accent}`, opacity: 0, animation: `hubRing 2.8s ease-out ${1.2 + d}s infinite` }} />
              ))}
              <motion.span initial={{ scale: 0.4, opacity: 0.7 }} animate={{ scale: 4.2, opacity: 0 }} transition={{ delay: 0.62, duration: 1, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `${3 * size}px solid ${t.accent}` }} />
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 13, delay: 0.55 }}
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%', background: t.surface || t.bg, border: `${2.5 * size}px solid ${t.accent}`,
                  boxShadow: `0 0 ${34 * size}px ${t.accent}55, 0 ${8 * size}px ${22 * size}px rgba(0,0,0,0.14)`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: `${2 * size}px`,
                }}>
                <PeakMark size={size * 1.15} color={t.accent} />
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${14 * size}px`, color: t.text, letterSpacing: '0.04em' }}>{COMPANY.name.toUpperCase()}</div>
                <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${8 * size}px`, color: t.accent }}>{PRICING.starter}/mo</div>
              </motion.div>
            </div>

            {/* the workflow, in the order it actually runs */}
            {nodes.map((n, i) => {
              const live = active === i;
              return (
                <motion.div key={n.label} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.95 + i * 0.2 }}
                  style={{ position: 'absolute', zIndex: 4, left: n.x - nodeW / 2, top: n.y - nodeH / 2, width: nodeW, height: nodeH }}>
                  <div style={{
                    height: '100%', borderRadius: `${10 * size}px`, background: t.surface || t.bg, position: 'relative',
                    border: `${live ? 2 : 1}px solid ${live ? t.accent : t.border}`,
                    boxShadow: live ? `0 0 ${20 * size}px ${t.accent}66` : `0 ${4 * size}px ${12 * size}px rgba(0,0,0,0.08)`,
                    transform: live ? 'scale(1.08)' : 'scale(1)', transition: 'all 0.3s ease',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: `${5 * size}px`,
                  }}>
                    <span style={{ position: 'absolute', top: `${-7 * size}px`, left: `${-7 * size}px`, width: `${16 * size}px`, height: `${16 * size}px`, borderRadius: '50%', background: t.accent, color: onAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${8 * size}px` }}>{i + 1}</span>
                    <span style={{ width: `${30 * size}px`, height: `${30 * size}px`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: live ? t.accent : `${t.accent}1A`, color: live ? onAccent : t.accent, transition: 'background 0.3s ease, color 0.3s ease' }}>
                      <n.Icon size={16 * size} color="currentColor" strokeWidth={2} />
                    </span>
                    <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${9.5 * size}px`, color: t.text }}>{n.label}</span>
                  </div>
                </motion.div>
              );
            })}

            {/* what it replaced, and what that's worth */}
            <motion.div initial={{ opacity: 0, y: 12 * size }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4, duration: 0.5 }}
              style={{ position: 'absolute', left: pad, right: pad, bottom: 10 * size, zIndex: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: `${12 * size}px` }}>
              <div style={{ maxWidth: '62%' }}>
                <div style={mono(7.5, t.textFaint, { marginBottom: `${4 * size}px` })}>Replaces</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${4 * size}px ${10 * size}px` }}>
                  {SUBS.map((s) => (
                    <span key={s.name} style={{ display: 'flex', alignItems: 'center', gap: `${4 * size}px`, fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textMuted }}>
                      <Check size={9 * size} color={t.positive || t.accent} strokeWidth={3} />
                      <s.Icon size={11 * size} color={s.color} />{s.name}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={mono(8.5, t.textFaint)}>You save</div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${28 * size}px`, color: t.positive || t.accent, lineHeight: 1.05, whiteSpace: 'nowrap' }}>
                  <AnimNum value={savings} prefix={'~$'} suffix="/mo" ms={1100} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <button data-demo="portal-toggle" onClick={toggle} style={{
        width: '100%', padding: `${9 * size}px`, border: `1px solid ${t.accent}`,
        borderRadius: `${5 * size}px`, background: after ? 'transparent' : t.accent,
        color: after ? t.accent : onAccent,
        fontFamily: theme.fonts.mono, fontWeight: 600, fontSize: `${9.5 * size}px`, letterSpacing: '0.06em', cursor: 'pointer', flexShrink: 0,
      }}>
        {after ? '\u2190 Back to six subscriptions' : `Move it all into ${COMPANY.name} \u2192`}
      </button>
      <style>{`@keyframes hubRing { 0% { transform: scale(1); opacity: 0.45; } 100% { transform: scale(1.9); opacity: 0; } }`}</style>
    </div>
  );
}


// ── 9. why — audience chips ──────────────────────────────────────────────────────
function MockupWhy({ theme, size, paceMs = 19000 }) {
  const t = theme.colors;
  const audiences = [
    { Icon: Package,  label: 'Makers',             url: 'costing',  line: 'Ingredients, suppliers, and batch cost — no more spreadsheets.', detail: 'Costing built into every product' },
    { Icon: Calendar, label: 'Service businesses', url: 'bookings', line: 'Bookings, customers, and invoicing without five different logins.', detail: 'Book online, get paid automatically' },
    { Icon: Store,    label: 'Retailers',          url: 'inventory', line: 'A storefront and back office that actually share the same data.', detail: 'One inventory, every channel' },
  ];
  const slideEntered = useSlideEntered();

  // Motion-graphics beat: the deck picks each audience in turn and shows what
  // the platform does FOR THEM — a live mini-screen per audience (batch costing,
  // a booking that becomes a paid invoice, one inventory feeding every
  // channel). Clicking a tab takes over and stops the tour.
  const [spot, setSpot] = useState(0);
  const timersRef = useRef([]);
  useEffect(() => {
    if (!slideEntered) return;
    setSpot(0);
    const gap = Math.max(3600, (paceMs * 0.8) / audiences.length);
    timersRef.current = [1, 2].map((i) => setTimeout(() => setSpot(i), i * gap));
    return () => timersRef.current.forEach(clearTimeout);
  }, [slideEntered, paceMs]);
  const pick = (i) => { timersRef.current.forEach(clearTimeout); setSpot(i); };
  const a = audiences[spot];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* audience tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${8 * size}px`, marginBottom: `${10 * size}px`, flexShrink: 0 }}>
        {audiences.map((x, i) => (
          <Reveal key={x.label} delay={i * 0.1} y={12}>
            <button onClick={() => pick(i)} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `${6 * size}px`, cursor: 'pointer',
              padding: `${8 * size}px ${6 * size}px`, borderRadius: `${7 * size}px`,
              border: `1px solid ${spot === i ? t.accent : t.border}`,
              background: spot === i ? `${t.accent}14` : (t.surface || t.bg),
              boxShadow: spot === i ? `0 ${5 * size}px ${14 * size}px ${t.accent}22` : 'none',
              transition: 'all 0.35s ease',
            }}>
              <x.Icon size={13 * size} color={t.accent} strokeWidth={1.8} />
              <span style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: `${8.5 * size}px`, color: spot === i ? t.text : t.textMuted }}>{x.label}</span>
            </button>
          </Reveal>
        ))}
      </div>

      {/* what it does for them */}
      <motion.div key={`cap-${spot}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ marginBottom: `${8 * size}px`, flexShrink: 0 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: `${9 * size}px`, color: t.textMuted, lineHeight: 1.5, marginBottom: `${3 * size}px` }}>{a.line}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${4 * size}px` }}>
          <Check size={9 * size} color={t.positive || t.accent} strokeWidth={2.5} />
          <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.positive || t.accent }}>{a.detail}</span>
        </div>
      </motion.div>

      {/* the live mini-screen */}
      <div style={{ flex: '1 1 auto', minHeight: `${120 * size}px`, marginBottom: `${10 * size}px` }}>
        <motion.div key={`panel-${spot}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} style={{ height: '100%' }}>
          <DeviceFrame theme={theme} size={size} url={`${EMBER_MOSS_BRAND.url}/admin/${a.url}`}>
            {spot === 0 && <WhyMakers theme={theme} size={size} />}
            {spot === 1 && <WhyService theme={theme} size={size} />}
            {spot === 2 && <WhyRetail theme={theme} size={size} />}
          </DeviceFrame>
        </motion.div>
      </div>

      <Reveal delay={0.45} y={10} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `${12 * size}px`,
        padding: `${10 * size}px`, borderRadius: `${8 * size}px`, background: t.bgAlt, flexShrink: 0,
      }}>
        <PeakMark size={size * 0.6} color={t.accent} />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${10 * size}px`, color: t.text }}>Not another website builder.</div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint }}>The infrastructure behind the storefront, too.</div>
        </div>
      </Reveal>
    </div>
  );
}

const whyLabel = (theme, size, t) => ({ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' });

// Makers — costing is built into the product: cost bars grow in, margin counts up.
function WhyMakers({ theme, size }) {
  const t = theme.colors;
  const rows = [
    { item: 'Shea butter',  from: 'Fair-trade co-op',  cost: 2.10 },
    { item: 'Moss extract', from: 'Own garden',        cost: 1.35 },
    { item: 'Mint oil',     from: 'Prairie Botanicals', cost: 1.80 },
    { item: 'Packaging',    from: 'Local print shop',  cost: 1.60 },
  ];
  const total = rows.reduce((s, r) => s + r.cost, 0); // 6.85
  const price = 18;
  const margin = Math.round((1 - total / price) * 100); // 62
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: `${14 * size}px`, alignItems: 'center' }}>
      <div>
        <div style={{ ...whyLabel(theme, size, t), marginBottom: `${8 * size}px` }}>Whispering Moss Soap · cost per bar</div>
        {rows.map((r, i) => (
          <div key={r.item} style={{ marginBottom: `${7 * size}px` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.fonts.body, fontSize: `${7.5 * size}px`, marginBottom: `${3 * size}px` }}>
              <span style={{ color: t.text, fontWeight: 500 }}>{r.item} <span style={{ color: t.textFaint, fontWeight: 400 }}>· {r.from}</span></span>
              <span style={{ fontFamily: theme.fonts.mono, color: t.textMuted }}>${r.cost.toFixed(2)}</span>
            </div>
            <div style={{ height: `${4 * size}px`, borderRadius: '100px', background: t.bgAlt, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${(r.cost / 2.5) * 100}%` }} transition={{ delay: 0.35 + i * 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '100%', borderRadius: '100px', background: t.accent }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', borderLeft: `1px solid ${t.border}`, paddingLeft: `${12 * size}px` }}>
        <div style={whyLabel(theme, size, t)}>Margin</div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${26 * size}px`, color: t.positive || t.accent, lineHeight: 1.1, margin: `${4 * size}px 0` }}>
          <CountUp to={margin} suffix="%" duration={1.4} delay={0.6} />
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, lineHeight: 1.7 }}>
          Cost ${total.toFixed(2)}<br />Price ${price.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

// Service businesses — a booking lands on the calendar, then becomes a paid invoice.
function WhyService({ theme, size }) {
  const t = theme.colors;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const taken = { Mon: [1], Tue: [0, 2], Wed: [1], Fri: [0] };
  const [stage, setStage] = useState(0); // 0 empty, 1 booked, 2 confirmed, 3 paid
  useEffect(() => {
    const ids = [setTimeout(() => setStage(1), 700), setTimeout(() => setStage(2), 1700), setTimeout(() => setStage(3), 2900)];
    return () => ids.forEach(clearTimeout);
  }, []);
  const slot = (filled, hot) => ({
    height: `${11 * size}px`, borderRadius: `${3 * size}px`, marginBottom: `${4 * size}px`,
    border: `1px solid ${hot ? t.accent : t.border}`,
    background: hot ? t.accent : (filled ? `${t.textFaint}30` : 'transparent'),
    transition: 'all 0.4s ease',
  });
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: `${14 * size}px`, alignItems: 'center' }}>
      <div>
        <div style={{ ...whyLabel(theme, size, t), marginBottom: `${8 * size}px` }}>This week · bookings</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: `${5 * size}px` }}>
          {days.map((d) => (
            <div key={d}>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, textAlign: 'center', marginBottom: `${4 * size}px` }}>{d}</div>
              {[0, 1, 2].map((r) => <div key={r} style={slot((taken[d] || []).includes(r), d === 'Thu' && r === 1 && stage >= 1)} />)}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${6 * size}px` }}>
        {[
          { on: stage >= 1, Icon: Calendar, text: 'Consult · Thu 2:00 PM' },
          { on: stage >= 2, Icon: Mail, text: 'Confirmation sent' },
          { on: stage >= 3, Icon: CreditCard, text: 'Invoice #204 · $120 paid' },
        ].map(({ on, Icon, text }) => (
          <div key={text} style={{
            display: 'flex', alignItems: 'center', gap: `${6 * size}px`, padding: `${5 * size}px ${7 * size}px`, borderRadius: `${5 * size}px`,
            border: `1px solid ${on ? (t.positive || t.accent) : t.border}`, opacity: on ? 1 : 0.35, transition: 'all 0.4s ease',
          }}>
            <Icon size={9 * size} color={on ? (t.positive || t.accent) : t.textFaint} />
            <span style={{ fontFamily: theme.fonts.body, fontSize: `${7 * size}px`, color: t.text }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Retailers — one inventory number; every channel sells from it and stays in sync.
function WhyRetail({ theme, size }) {
  const t = theme.colors;
  const channels = ['Online store', 'Market stall (POS)', 'Wholesale'];
  const [stock, setStock] = useState(54);
  const [last, setLast] = useState(-1);
  useEffect(() => {
    const sale = (ms, ch) => setTimeout(() => { setStock((s) => s - 1); setLast(ch); }, ms);
    const ids = [sale(900, 0), sale(2100, 1), sale(3300, 2)];
    return () => ids.forEach(clearTimeout);
  }, []);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: `${14 * size}px`, alignItems: 'center' }}>
      <div style={{ textAlign: 'center', padding: `${8 * size}px`, borderRadius: `${6 * size}px`, background: t.bgAlt }}>
        <div style={whyLabel(theme, size, t)}>Whispering Moss Soap</div>
        <motion.div key={stock} initial={{ scale: 1.25, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35 }}
          style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: `${28 * size}px`, color: t.text, lineHeight: 1.15, margin: `${3 * size}px 0` }}>{stock}</motion.div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.accent }}>in stock · one count</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${6 * size}px` }}>
        {channels.map((c, i) => (
          <div key={c} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${6 * size}px ${8 * size}px`, borderRadius: `${5 * size}px`,
            border: `1px solid ${last === i ? t.accent : t.border}`, background: last === i ? `${t.accent}14` : 'transparent', transition: 'all 0.35s ease',
          }}>
            <span style={{ fontFamily: theme.fonts.body, fontSize: `${7.5 * size}px`, color: t.text }}>{c}</span>
            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: last === i ? t.accent : t.textFaint }}>
              {last === i ? 'sale · −1' : `${stock} available`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


// ── 10. live-demo — minimal cue card ─────────────────────────────────────────────
function MockupLiveDemo({ theme, size }) {
  const t = theme.colors;
  const flow = ['Business', 'Storefront', 'Customer', 'Checkout', 'Dashboard', 'Order'];
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <a href="https://peakenterprise.ca/" target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-flex', alignItems: 'center', gap: `${6 * size}px`,
        fontFamily: theme.fonts.display, fontWeight: theme.type.displayWeight,
        fontSize: `${20 * size}px`, color: t.accent, marginBottom: `${16 * size}px`,
        textDecoration: 'none', cursor: 'pointer',
      }}>
        ▶ Live now
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${9 * size}px`, color: t.textFaint, fontWeight: 400 }}>peakenterprise.ca ↗</span>
      </a>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `${4 * size}px`, flexWrap: 'wrap', marginBottom: `${20 * size}px` }}>
        {flow.map((step, i) => (
          <Reveal key={step} delay={0.2 + i * 0.1} x={-8} y={0} as="span" style={{ display: 'flex', alignItems: 'center', gap: `${4 * size}px` }}>
            <span style={{
              fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textMuted,
              border: `1px solid ${t.border}`, borderRadius: '100px', padding: `${4 * size}px ${8 * size}px`,
            }}>{step}</span>
            {i < flow.length - 1 && <span style={{ color: t.textFaint, fontSize: `${9 * size}px` }}>→</span>}
          </Reveal>
        ))}
      </div>
      <div style={{
        display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: `${6 * size}px`,
        padding: `${10 * size}px`, background: '#fff', borderRadius: `${8 * size}px`,
        border: `1px solid ${t.border}`,
      }}>
        <QRCode
          value="https://peakenterprise.ca/"
          size={64 * size}
          fgColor={t.bgDeep || '#111'}
          bgColor="#ffffff"
          style={{ width: `${64 * size}px`, height: `${64 * size}px` }}
        />
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: '#666', letterSpacing: '0.06em' }}>Scan to open</span>
      </div>
    </div>
  );
}

export const DEMO_VISUALS = {
  welcome: MockupWelcome,
  problem: MockupProblem,
  platform: MockupPlatform,
  customer: MockupCustomer,
  merchant: MockupMerchant,
  'storefront-theme': MockupThemeSwitch,
  workflow: MockupWorkflow,
  portal: MockupPortal,
  why: MockupWhy,
  'live-demo': MockupLiveDemo,
};
