// ─── PRODUCT DEMO DECK — INTERACTIVE MOCKUPS ──────────────────────────────────
// Each of these is a small, real, clickable mini-interface — not a screenshot.
// They stand in for product photography we don't have yet: click a tab, add
// something to a cart, swap a theme. They use theme.colors so they repaint
// automatically with the presenter's active theme (including Showroom).

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Check } from 'lucide-react';
import { SiShopify, SiMailchimp, SiGooglesheets, SiCalendly, SiQuickbooks, SiNotion, SiTrello, SiStripe, SiDropbox, SiZoom } from 'react-icons/si';
import DeviceFrame from './DeviceFrame.jsx';
import ProductImg from './ProductImg.jsx';
import { ProductDetailView, BlogPostView, ContactView } from './storefrontViews.jsx';
import { COMPANY } from '../../../data/config.js';
import { EMBER_MOSS_BRAND, EMBER_MOSS_PRODUCTS, EMBER_MOSS_JOURNAL, EMBER_MOSS_TESTIMONIALS, EMBER_MOSS_FAQ, STOREFRONT_THEME_SWATCHES } from '../../../data/decks/emberMoss.js';

// ── shared bits ────────────────────────────────────────────────────────────────
function Chip({ label, active, onClick, theme, size }) {
  const t = theme.colors;
  return (
    <button onClick={onClick} style={{
      padding: `${5 * size}px ${10 * size}px`,
      borderRadius: '100px',
      border: `1px solid ${active ? t.accent : t.border}`,
      background: active ? t.accent : 'transparent',
      color: active ? (theme.isLight ? '#fff' : t.bg) : t.textMuted,
      fontFamily: theme.fonts.body, fontWeight: 500,
      fontSize: `${9.5 * size}px`, cursor: 'pointer',
      transition: 'all 0.15s ease',
    }}>
      {label}
    </button>
  );
}

// ── 1. welcome — hero storefront frame ──────────────────────────────────────────
// Ember & Moss is the example brand shown throughout the storefront-facing
// slides — drop the real photos into /public/demo-assets/ember-moss/ (see
// build notes) and this repaints itself automatically, no code changes.
function MockupWelcome({ theme, size, isFullscreen }) {
  const t = theme.colors;
  const [heroFailed, setHeroFailed] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [view, setView] = useState({ type: 'home' });
  const [cart, setCart] = useState({});
  const featured = EMBER_MOSS_PRODUCTS.slice(0, 3);
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);

  const goHome = () => setView({ type: 'home' });
  const openProduct = (p) => setView({ type: 'product', product: p });
  const openPost = (post) => setView({ type: 'post', post });
  const addToCart = (p) => setCart(c => ({ ...c, [p.name]: (c[p.name] || 0) + 1 }));

  return (
    <DeviceFrame theme={theme} size={size} url={EMBER_MOSS_BRAND.url} fill>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${12 * size}px` }}>
        <button onClick={goHome} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${13 * size}px`, color: t.text }}>Ember &amp; Moss</button>
        <div style={{ display: 'flex', gap: `${10 * size}px`, alignItems: 'center' }}>
          <button onClick={goHome} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Shop</button>
          <button onClick={() => setView({ type: 'contact' })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contact</button>
          <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Cart{cartCount > 0 ? ` (${cartCount})` : ''}</span>
        </div>
      </div>

      {view.type === 'product' && (
        <ProductDetailView theme={theme} size={size} product={view.product} onBack={goHome} onAddToCart={addToCart} cartQty={cart[view.product.name] || 0} />
      )}
      {view.type === 'post' && (
        <BlogPostView theme={theme} size={size} post={view.post} onBack={goHome} />
      )}
      {view.type === 'contact' && (
        <ContactView theme={theme} size={size} onBack={goHome} />
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
              <span style={{
                display: 'inline-block', padding: `${6 * size}px ${13 * size}px`,
                background: t.accent, color: theme.isLight ? '#fff' : t.bg,
                borderRadius: theme.space.radius === '0px' ? '0px' : `${5 * size}px`,
                fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${8.5 * size}px`,
              }}>Shop the collection</span>
            </div>
          </div>

          {/* ── Featured products ── */}
          <SectionLabel size={size} theme={theme}>Featured</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${8 * size}px`, marginBottom: `${22 * size}px` }}>
            {featured.map(p => (
              <button key={p.name} onClick={() => openProduct(p)} style={{
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
              <button key={post.title} onClick={() => openPost(post)} style={{
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
                <div style={{ color: t.accent, fontSize: `${8 * size}px`, marginBottom: `${4 * size}px`, letterSpacing: '1px' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
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
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
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
            <button onClick={() => setView({ type: 'contact' })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, letterSpacing: '0.06em', textDecoration: 'underline' }}>Contact</button>
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


// ── 2. problem — scattered tools consolidate on click ──────────────────────────
function MockupProblem({ theme, size }) {
  const t = theme.colors;
  const [merged, setMerged] = useState(false);

  const tools = [
    { name: 'Shopify',    Icon: SiShopify,      color: '#95BF47' },
    { name: 'Mailchimp',  Icon: SiMailchimp,    color: '#FFE01B' },
    { name: 'Sheets',     Icon: SiGooglesheets, color: '#188038' },
    { name: 'Calendly',   Icon: SiCalendly,     color: '#006BFF' },
    { name: 'QuickBooks', Icon: SiQuickbooks,   color: '#2CA01C' },
    { name: 'Notion',     Icon: SiNotion,       color: t.text },
    { name: 'Trello',     Icon: SiTrello,       color: '#0052CC' },
    { name: 'Stripe',     Icon: SiStripe,       color: '#635BFF' },
    { name: 'Dropbox',    Icon: SiDropbox,      color: '#0061FF' },
    { name: 'Zoom',       Icon: SiZoom,         color: '#2D8CFF' },
  ];
  // Scattered around the edges, leaving the center clear for the dashboard behind them
  const positions = [
    { top: '2%',  left: '2%'  }, { top: '2%',  left: '28%' }, { top: '2%',  left: '54%' }, { top: '2%',  left: '80%' },
    { top: '40%', left: '0%'  },                                                            { top: '40%', left: '82%' },
    { top: '76%', left: '2%'  }, { top: '76%', left: '28%' }, { top: '76%', left: '54%' }, { top: '76%', left: '80%' },
  ];
  // Fly-away direction derived from each tile's position relative to center —
  // scales to any tool count without hand-picking a direction per tile.
  const flyTo = positions.map(p => {
    const left = parseFloat(p.left), top = parseFloat(p.top);
    const dx = (left - 46) * 2.4, dy = (top - 40) * 2.2;
    return { x: dx, y: dy, r: dx > 0 ? 22 : -22 };
  });
  const painPoints = ['10 logins a day', '~5 hrs/week stitching data', '$0 of it talking to each other'];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        position: 'relative', flex: '1 1 auto', minHeight: `${260 * size}px`,
        border: `1px dashed ${t.border}`, borderRadius: `${10 * size}px`,
        marginBottom: `${12 * size}px`, overflow: 'hidden',
      }}>
        {/* ── background: the business's own dashboard, buried under tools ── */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', zIndex: 1,
          width: '64%',
          border: `1px solid ${t.border}`, borderRadius: `${8 * size}px`, overflow: 'hidden',
          background: t.surface || t.bg,
          boxShadow: `0 ${10 * size}px ${28 * size}px rgba(0,0,0,0.12)`,
          opacity: merged ? 1 : 0.4,
          filter: merged ? 'saturate(1)' : 'saturate(0.3)',
          transform: merged ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%) scale(1)',
          transition: 'opacity 0.6s ease 0.3s, filter 0.6s ease 0.3s, transform 0.6s cubic-bezier(0.4,0,0.2,1) 0.3s',
        }}>
          <div style={{ display: 'flex', gap: `${6 * size}px`, padding: `${8 * size}px ${12 * size}px`, background: t.bgAlt, borderBottom: `1px solid ${t.border}` }}>
            {[0, 1, 2].map(i => <span key={i} style={{ width: `${6 * size}px`, height: `${6 * size}px`, borderRadius: '50%', background: t.border }} />)}
          </div>
          <div style={{ padding: `${18 * size}px` }}>
            <div style={{
              fontFamily: theme.fonts.mono, fontSize: `${11 * size}px`, letterSpacing: '0.06em', marginBottom: `${10 * size}px`,
              color: merged ? t.accent : t.textFaint, transition: 'color 0.4s ease 0.5s',
            }}>
              {merged ? COMPANY.name.toUpperCase() : 'YOUR BUSINESS'}
            </div>
            {[72, 50, 62].map((w, i) => (
              <div key={i} style={{ height: `${9 * size}px`, width: `${w}%`, borderRadius: `${3 * size}px`, background: t.bgAlt, marginBottom: `${7 * size}px` }} />
            ))}
            <div style={{
              display: 'flex', alignItems: 'center', gap: `${6 * size}px`, marginTop: `${12 * size}px`,
              fontFamily: theme.fonts.mono, fontSize: `${10 * size}px`, color: t.positive || t.accent,
              opacity: merged ? 1 : 0, transition: 'opacity 0.4s ease 0.9s',
            }}>
              <Check size={13 * size} strokeWidth={2.5} /> One dashboard. Everything visible.
            </div>
          </div>
        </div>

        {/* ── foreground: the scattered tools burying it ── */}
        {tools.map((tool, i) => (
          <div key={tool.name} style={{
            position: 'absolute', ...positions[i], zIndex: 2,
            width: `${104 * size}px`,
            border: `1px solid ${t.border}`, borderRadius: `${7 * size}px`, overflow: 'hidden',
            background: t.surface || t.bg,
            boxShadow: `0 ${6 * size}px ${16 * size}px rgba(0,0,0,0.14)`,
            opacity: merged ? 0 : 1,
            pointerEvents: merged ? 'none' : 'auto',
            animation: merged ? 'none' : `jitter 2.8s ease-in-out ${i * 0.18}s infinite`,
            transform: merged ? `translate(${flyTo[i].x * size}px, ${flyTo[i].y * size}px) scale(0.5) rotate(${flyTo[i].r}deg)` : 'none',
            transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: `${6 * size}px`, padding: `${7 * size}px ${9 * size}px`, borderBottom: `1px solid ${t.border}`, background: t.bgAlt }}>
              <span style={{ position: 'relative', display: 'flex' }}>
                <tool.Icon size={17 * size} color={tool.color} />
                <span style={{
                  position: 'absolute', top: `-${3 * size}px`, right: `-${3 * size}px`,
                  width: `${7 * size}px`, height: `${7 * size}px`, borderRadius: '50%',
                  background: t.negative || '#DB3521',
                  animation: `pulseDot 1.6s ease-in-out ${i * 0.15}s infinite`,
                }} />
              </span>
              <span style={{ fontFamily: theme.fonts.mono, fontSize: `${9.5 * size}px`, color: t.textMuted, whiteSpace: 'nowrap' }}>{tool.name}</span>
            </div>
            <div style={{ padding: `${8 * size}px ${9 * size}px` }}>
              <div style={{ height: `${4 * size}px`, width: '80%', borderRadius: '2px', background: t.bgAlt, marginBottom: `${5 * size}px` }} />
              <div style={{ height: `${4 * size}px`, width: '55%', borderRadius: '2px', background: t.bgAlt }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', gap: `${10 * size}px`, marginBottom: `${10 * size}px`, flexShrink: 0,
        opacity: merged ? 0 : 1, maxHeight: merged ? 0 : `${28 * size}px`, overflow: 'hidden',
        transition: 'opacity 0.3s ease, max-height 0.3s ease',
      }}>
        {painPoints.map(pt => (
          <span key={pt} style={{ fontFamily: theme.fonts.mono, fontSize: `${9 * size}px`, color: t.textFaint, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{pt}</span>
        ))}
      </div>

      <button onClick={() => setMerged(m => !m)} style={{
        width: '100%', padding: `${10 * size}px`, flexShrink: 0,
        border: `1px solid ${t.accent}`, borderRadius: `${6 * size}px`,
        background: merged ? 'transparent' : t.accent,
        color: merged ? t.accent : (theme.isLight ? '#fff' : t.bg),
        fontFamily: theme.fonts.mono, fontWeight: 600, fontSize: `${11 * size}px`,
        letterSpacing: '0.06em', cursor: 'pointer',
      }}>
        {merged ? '↺ Show the tab chaos' : 'Consolidate →'}
      </button>
      <style>{`
        @keyframes jitter { 0%, 100% { transform: rotate(-1.5deg); } 50% { transform: rotate(1.5deg); } }
        @keyframes pulseDot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } }
      `}</style>
    </div>
  );
}

// ── 3. platform — module tour ────────────────────────────────────────────────────
function MockupPlatform({ theme, size }) {
  const t = theme.colors;
  const modules = [
    { icon: '◈', name: 'Storefront', desc: 'Branded, theme-driven storefront pages.' },
    { icon: '▤', name: 'Products', desc: 'Catalog, variants, and inventory in one place.' },
    { icon: '◉', name: 'Orders', desc: 'From cart to fulfillment, tracked end to end.' },
    { icon: '◆', name: 'Payments', desc: 'Stripe and PayPal, built in, no extra setup.' },
    { icon: '△', name: 'Shipping', desc: 'Rates and fulfillment configured per business.' },
    { icon: '●', name: 'Customers', desc: 'Accounts, order history, and reviews.' },
    { icon: '□', name: 'Content', desc: 'Blog, FAQ, banners, and legal pages.' },
    { icon: '◇', name: 'Costing', desc: 'Ingredients, suppliers, and batch cost, synced.' },
  ];
  const [active, setActive] = useState(0);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: `${6 * size}px`, marginBottom: `${10 * size}px` }}>
        {modules.map((m, i) => (
          <button key={m.name} onClick={() => setActive(i)} style={{
            padding: `${8 * size}px ${4 * size}px`, textAlign: 'center',
            border: `1px solid ${active === i ? t.accent : t.border}`,
            background: active === i ? `${t.accent}12` : 'transparent',
            borderRadius: `${5 * size}px`, cursor: 'pointer',
          }}>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: `${14 * size}px`, color: t.accent, marginBottom: '2px' }}>{m.icon}</div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: `${7.5 * size}px`, color: t.text }}>{m.name}</div>
          </button>
        ))}
      </div>
      <div style={{
        padding: `${10 * size}px ${12 * size}px`, borderRadius: `${5 * size}px`,
        background: t.bgAlt, border: `1px solid ${t.border}`,
        fontFamily: theme.fonts.body, fontSize: `${9.5 * size}px`, color: t.textMuted,
        minHeight: `${28 * size}px`,
      }}>
        {modules[active].desc}
      </div>
    </div>
  );
}

function MockupCustomer({ theme, size }) {
  const t = theme.colors;
  const products = EMBER_MOSS_PRODUCTS;
  const [cart, setCart] = useState({});          // { productName: qty }
  const [view, setView] = useState('shop');      // 'shop' | 'cart' | product object

  const setQty = (name, qty) => setCart(c => {
    if (qty <= 0) { const { [name]: _, ...rest } = c; return rest; }
    return { ...c, [name]: qty };
  });
  const addOne = (p) => setQty(p.name, (cart[p.name] || 0) + 1);
  const cartEntries = Object.entries(cart).map(([name, qty]) => ({ ...products.find(p => p.name === name), qty }));
  const cartCount = cartEntries.reduce((s, e) => s + e.qty, 0);
  const subtotal = cartEntries.reduce((s, e) => s + parseFloat(e.price.replace('$', '')) * e.qty, 0);
  const isProductView = typeof view === 'object';

  return (
    <DeviceFrame theme={theme} size={size} url={`${EMBER_MOSS_BRAND.url}/shop`} fill>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${10 * size}px` }}>
        <button onClick={() => setView('shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Shop</button>
        <button onClick={() => setView(view === 'cart' ? 'shop' : 'cart')} style={{
          position: 'relative', border: `1px solid ${t.border}`, borderRadius: '100px',
          padding: `${4 * size}px ${9 * size}px`, background: 'transparent', cursor: 'pointer',
          fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.text,
        }}>
          {view === 'cart' ? '← Shop' : `Cart ${cartCount > 0 ? `(${cartCount})` : ''}`}
        </button>
      </div>

      {isProductView && (
        <ProductDetailView theme={theme} size={size} product={view} onBack={() => setView('shop')} onAddToCart={addOne} cartQty={cart[view.name] || 0} />
      )}

      {view === 'shop' && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: `${8 * size}px`,
          paddingRight: '2px',
        }}>
          {products.map(p => {
            const qty = cart[p.name] || 0;
            return (
              <div key={p.name} style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${8 * size}px`, textAlign: 'center' }}>
                <button onClick={() => setView(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'center', font: 'inherit' }}>
                  <div style={{ marginBottom: `${6 * size}px` }}>
                    <ProductImg src={p.img} alt={p.name} size={size} />
                  </div>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: `${8 * size}px`, color: t.text, marginBottom: '2px' }}>{p.name}</div>
                </button>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, marginBottom: `${6 * size}px` }}>{p.price}</div>
                {qty === 0 ? (
                  <button onClick={() => setQty(p.name, 1)} style={{
                    width: '100%', padding: `${5 * size}px`, border: 'none', borderRadius: `${4 * size}px`,
                    background: t.accent, color: theme.isLight ? '#fff' : t.bg,
                    fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${7.5 * size}px`, cursor: 'pointer',
                  }}>Add to cart</button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${t.accent}`, borderRadius: `${4 * size}px`, overflow: 'hidden' }}>
                    <button onClick={() => setQty(p.name, qty - 1)} style={{ flex: 1, border: 'none', background: 'transparent', color: t.accent, fontFamily: theme.fonts.mono, fontSize: `${10 * size}px`, cursor: 'pointer', padding: `${4 * size}px 0` }}>−</button>
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.text, minWidth: `${16 * size}px` }}>{qty}</span>
                    <button onClick={() => setQty(p.name, qty + 1)} style={{ flex: 1, border: 'none', background: 'transparent', color: t.accent, fontFamily: theme.fonts.mono, fontSize: `${10 * size}px`, cursor: 'pointer', padding: `${4 * size}px 0` }}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
              <button style={{
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

function MockupMerchant({ theme, size }) {
  const t = theme.colors;
  const tabs = ['Overview', 'Orders', 'Products', 'Customers'];
  const [tab, setTab] = useState(0);

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
    <DeviceFrame theme={theme} size={size} url={`${COMPANY.url}/merchant`} fill>
      <div style={{ display: 'flex', gap: `${4 * size}px`, marginBottom: `${10 * size}px`, borderBottom: `1px solid ${t.border}`, paddingBottom: `${6 * size}px` }}>
        {tabs.map((label, i) => (
          <button key={label} onClick={() => setTab(i)} style={{
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
            {[{ l: 'Revenue', v: '$9,170', d: '+18%' }, { l: 'Orders', v: String(ORDERS.length * 4), d: '+6%' }, { l: 'Visitors', v: '1,204', d: '+11%' }].map(k => (
              <div key={k.l} style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${8 * size}px` }}>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k.l}</div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${14 * size}px`, color: t.text }}>{k.v}</div>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.positive }}>{k.d} ↑</div>
              </div>
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
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${7 * size}px 0`, borderBottom: `1px solid ${t.border}`, fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px` }}>
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
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: `${8 * size}px`, padding: `${6 * size}px 0`, borderBottom: `1px solid ${t.border}` }}>
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
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: `${8 * size}px`, padding: `${6 * size}px 0`, borderBottom: `1px solid ${t.border}` }}>
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
function MockupThemeSwitch({ theme, size }) {
  const t = theme.colors;
  const [mt, setMt] = useState(STOREFRONT_THEME_SWATCHES[0]);
  const products = EMBER_MOSS_PRODUCTS.slice(0, 3);

  const Preview = {
    elegant: ElegantPreview,
    brutalist: BrutalistPreview,
    bubbly: BubblyPreview,
    minimal: MinimalPreview,
  }[mt.style];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: '1 1 auto', minHeight: 0, marginBottom: `${10 * size}px` }}>
        <DeviceFrame theme={theme} size={size} url={EMBER_MOSS_BRAND.url} fill>
          <Preview mt={mt} size={size} products={products} />
        </DeviceFrame>
      </div>
      <div style={{ display: 'flex', gap: `${6 * size}px`, flexWrap: 'wrap', flexShrink: 0 }}>
        {STOREFRONT_THEME_SWATCHES.map(candidate => (
          <button key={candidate.id} onClick={() => setMt(candidate)} style={{
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
function MockupWorkflow({ theme, size }) {
  const t = theme.colors;
  const steps = [
    { l: 'Sign up', d: 'Merchant creates an account and picks a business type.' },
    { l: 'Storefront', d: 'Theme selected, branding applied, storefront goes live.' },
    { l: 'Products', d: 'Catalog and inventory added, ready to sell.' },
    { l: 'Order placed', d: 'A customer discovers the store and checks out.' },
    { l: 'Payment', d: 'Stripe or PayPal processes the transaction automatically.' },
    { l: 'Fulfilled', d: 'Merchant ships it — the order closes the loop.' },
  ];
  const [active, setActive] = useState(0);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: `${14 * size}px` }}>
        {steps.map((s, i) => (
          <div key={s.l} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <button onClick={() => setActive(i)} style={{
              width: `${18 * size}px`, height: `${18 * size}px`, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${t.accent}`, cursor: 'pointer',
              background: active === i ? t.accent : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`,
              color: active === i ? (theme.isLight ? '#fff' : t.bg) : t.accent,
            }}>{i + 1}</button>
            {i < steps.length - 1 && <div style={{ flex: 1, height: '1px', background: t.border }} />}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: `${4 * size}px` }}>
        {steps[active].l}
      </div>
      <div style={{ fontFamily: theme.fonts.body, fontSize: `${9.5 * size}px`, color: t.textMuted }}>
        {steps[active].d}
      </div>
    </div>
  );
}

// ── 8. portal — before / after toggle ────────────────────────────────────────────
function MockupPortal({ theme, size }) {
  const t = theme.colors;
  const [after, setAfter] = useState(false);
  const scattered = ['Storefront', 'CRM', 'Orders', 'Payments', 'Content', 'Shipping'];
  return (
    <div style={{ width: '100%' }}>
      <div style={{
        border: `1px solid ${t.border}`, borderRadius: `${6 * size}px`, padding: `${14 * size}px`,
        minHeight: `${110 * size}px`, marginBottom: `${10 * size}px`, position: 'relative', overflow: 'hidden',
      }}>
        {!after ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: `${8 * size}px` }}>
            {scattered.map(s => (
              <div key={s} style={{
                padding: `${8 * size}px`, textAlign: 'center', borderRadius: `${4 * size}px`,
                border: `1px dashed ${t.border}`, fontFamily: theme.fonts.mono,
                fontSize: `${7.5 * size}px`, color: t.textFaint,
              }}>{s}</div>
            ))}
          </div>
        ) : (
          <div style={{ animation: 'fadeSlideIn 0.3s ease both', display: 'flex', gap: `${10 * size}px` }}>
            <div style={{ width: `${60 * size}px`, borderRight: `1px solid ${t.border}`, paddingRight: `${10 * size}px` }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${10 * size}px`, color: t.accent, marginBottom: `${8 * size}px` }}>{COMPANY.name}</div>
              {scattered.slice(0, 4).map(s => (
                <div key={s} style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textMuted, marginBottom: `${5 * size}px` }}>{s}</div>
              ))}
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.body, fontSize: `${9 * size}px`, color: t.textMuted, textAlign: 'center' }}>
              One nav.<br />Everything connected.
            </div>
          </div>
        )}
      </div>
      <button onClick={() => setAfter(a => !a)} style={{
        width: '100%', padding: `${8 * size}px`, border: `1px solid ${t.accent}`,
        borderRadius: `${5 * size}px`, background: after ? 'transparent' : t.accent,
        color: after ? t.accent : (theme.isLight ? '#fff' : t.bg),
        fontFamily: theme.fonts.mono, fontWeight: 600, fontSize: `${9 * size}px`, letterSpacing: '0.06em', cursor: 'pointer',
      }}>
        {after ? '← Show Before' : 'Show After →'}
      </button>
      <style>{`@keyframes fadeSlideIn { from { opacity:0; } to { opacity:1; } }`}</style>
    </div>
  );
}

// ── 9. why — audience chips ──────────────────────────────────────────────────────
function MockupWhy({ theme, size }) {
  const t = theme.colors;
  const audiences = [
    { id: 'makers', label: 'Makers', line: 'Ingredients, suppliers, and batch cost — no more spreadsheets.' },
    { id: 'service', label: 'Service businesses', line: 'Bookings, customers, and invoicing without five different logins.' },
    { id: 'retail', label: 'Retailers', line: 'A storefront and back office that actually share the same data.' },
  ];
  const [active, setActive] = useState('makers');
  const current = audiences.find(a => a.id === active);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: `${6 * size}px`, marginBottom: `${12 * size}px`, flexWrap: 'wrap' }}>
        {audiences.map(a => (
          <Chip key={a.id} label={a.label} active={active === a.id} onClick={() => setActive(a.id)} theme={theme} size={size} />
        ))}
      </div>
      <div style={{
        padding: `${12 * size}px`, borderRadius: `${6 * size}px`, background: t.bgAlt,
        border: `1px solid ${t.border}`, fontFamily: theme.fonts.body,
        fontSize: `${10 * size}px`, color: t.text, minHeight: `${30 * size}px`,
      }}>
        {current.line}
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
          <span key={step} style={{ display: 'flex', alignItems: 'center', gap: `${4 * size}px` }}>
            <span style={{
              fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textMuted,
              border: `1px solid ${t.border}`, borderRadius: '100px', padding: `${4 * size}px ${8 * size}px`,
            }}>{step}</span>
            {i < flow.length - 1 && <span style={{ color: t.textFaint, fontSize: `${9 * size}px` }}>→</span>}
          </span>
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
