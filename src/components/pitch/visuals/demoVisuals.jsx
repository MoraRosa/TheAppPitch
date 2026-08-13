// ─── PRODUCT DEMO DECK — INTERACTIVE MOCKUPS ──────────────────────────────────
// Each of these is a small, real, clickable mini-interface — not a screenshot.
// They stand in for product photography we don't have yet: click a tab, add
// something to a cart, swap a theme. They use theme.colors so they repaint
// automatically with the presenter's active theme (including Showroom).

import { useState } from 'react';
import DeviceFrame from './DeviceFrame.jsx';
import { COMPANY } from '../../../data/config.js';

// Product photos live in /public/demo-assets/<brand>/<file>. Renders the real
// image once it exists; falls back to a soft placeholder swatch until then —
// nothing breaks in the meantime, it just looks a little plainer.
function ProductImg({ src, alt, radius = 4, size = 1, aspect = '1' }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div style={{ width: '100%', aspectRatio: aspect, borderRadius: `${radius * size}px`, background: 'linear-gradient(135deg, #00000010, #00000004)' }} />;
  }
  return (
    <img src={src} alt={alt} onError={() => setFailed(true)} style={{
      width: '100%', aspectRatio: aspect, objectFit: 'cover',
      borderRadius: `${radius * size}px`, display: 'block',
    }} />
  );
}

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
  return (
    <DeviceFrame theme={theme} size={size} url="emberandmoss.shop">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${14 * size}px` }}>
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${13 * size}px`, color: t.text }}>Ember &amp; Moss</span>
        <div style={{ display: 'flex', gap: `${10 * size}px` }}>
          {['Shop', 'Dragons', 'Cart'].map(l => (
            <span key={l} style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l}</span>
          ))}
        </div>
      </div>
      <div style={{
        position: 'relative', borderRadius: `${6 * size}px`, padding: `${20 * size}px`,
        overflow: 'hidden', minHeight: `${120 * size}px`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        background: heroFailed
          ? `linear-gradient(135deg, ${t.accent}18, ${t.accent}05)`
          : '#1B3B2E',
        border: `1px solid ${t.accent}30`,
      }}>
        {!heroFailed && (
          <img src="/demo-assets/ember-moss/hero-apothecary.jpg" alt="" onError={() => setHeroFailed(true)} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          }} />
        )}
        {!heroFailed && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.05))' }} />}
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.type.headWeight, fontSize: `${17 * size}px`, color: heroFailed ? t.text : '#F5F1E4', marginBottom: `${6 * size}px` }}>
            Everyday magic, handmade by dragons.
          </div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: `${9.5 * size}px`, color: heroFailed ? t.textMuted : '#E7DFC8', marginBottom: `${12 * size}px`, maxWidth: '85%' }}>
            One login runs the storefront, the shop, and everything behind it.
          </div>
          <span style={{
            display: 'inline-block', padding: `${7 * size}px ${14 * size}px`,
            background: t.accent, color: theme.isLight ? '#fff' : t.bg,
            borderRadius: theme.space.radius === '0px' ? '0px' : `${5 * size}px`,
            fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${9 * size}px`,
          }}>Shop the collection</span>
        </div>
      </div>
    </DeviceFrame>
  );
}

// ── 2. problem — scattered tools consolidate on click ──────────────────────────
function MockupProblem({ theme, size }) {
  const t = theme.colors;
  const [merged, setMerged] = useState(false);
  const tools = ['Shopify', 'Mailchimp', 'Sheets', 'Calendly', 'QuickBooks', 'Notion'];
  return (
    <div style={{ width: '100%' }}>
      <div style={{
        position: 'relative', height: `${120 * size}px`,
        border: `1px dashed ${t.border}`, borderRadius: `${8 * size}px`,
        marginBottom: `${12 * size}px`, overflow: 'hidden',
      }}>
        {!merged ? tools.map((tool, i) => {
          const positions = [
            { top: '10%', left: '6%' }, { top: '55%', left: '2%' }, { top: '15%', left: '62%' },
            { top: '60%', left: '68%' }, { top: '38%', left: '32%' }, { top: '5%', left: '38%' },
          ];
          return (
            <span key={tool} style={{
              position: 'absolute', ...positions[i],
              padding: `${5 * size}px ${9 * size}px`,
              border: `1px solid ${t.border}`, borderRadius: '100px',
              background: t.bgAlt, fontFamily: theme.fonts.mono,
              fontSize: `${8 * size}px`, color: t.textMuted,
              transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (i * 3 % 7)}deg)`,
            }}>{tool}</span>
          );
        }) : (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeSlideIn 0.35s ease both',
          }}>
            <div style={{
              padding: `${12 * size}px ${20 * size}px`, borderRadius: `${8 * size}px`,
              background: t.accent, color: theme.isLight ? '#fff' : t.bg,
              fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${14 * size}px`,
            }}>{COMPANY.name}</div>
          </div>
        )}
      </div>
      <button onClick={() => setMerged(m => !m)} style={{
        width: '100%', padding: `${8 * size}px`,
        border: `1px solid ${t.accent}`, borderRadius: `${5 * size}px`,
        background: merged ? 'transparent' : t.accent,
        color: merged ? t.accent : (theme.isLight ? '#fff' : t.bg),
        fontFamily: theme.fonts.mono, fontWeight: 600, fontSize: `${9 * size}px`,
        letterSpacing: '0.06em', cursor: 'pointer',
      }}>
        {merged ? '\u21ba Show the tab chaos' : 'Consolidate \u2192'}
      </button>
      <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
}

// ── 3. platform — module tour ────────────────────────────────────────────────────
function MockupPlatform({ theme, size }) {
  const t = theme.colors;
  const modules = [
    { icon: '\u25c8', name: 'Storefront', desc: 'Branded, theme-driven storefront pages.' },
    { icon: '\u25a4', name: 'Products', desc: 'Catalog, variants, and inventory in one place.' },
    { icon: '\u25c9', name: 'Orders', desc: 'From cart to fulfillment, tracked end to end.' },
    { icon: '\u25c6', name: 'Payments', desc: 'Stripe and PayPal, built in, no extra setup.' },
    { icon: '\u25b3', name: 'Shipping', desc: 'Rates and fulfillment configured per business.' },
    { icon: '\u25cf', name: 'Customers', desc: 'Accounts, order history, and reviews.' },
    { icon: '\u25a1', name: 'Content', desc: 'Blog, FAQ, banners, and legal pages.' },
    { icon: '\u25c7', name: 'Costing', desc: 'Ingredients, suppliers, and batch cost, synced.' },
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

// ── 4. customer — browse, add to cart ────────────────────────────────────────────
const EMBER_MOSS_PRODUCTS = [
  { name: 'Moon Dew Facial Mist', price: '$34', img: '/demo-assets/ember-moss/moon-dew-mist.jpg' },
  { name: 'Solar Radiance Elixir', price: '$48', img: '/demo-assets/ember-moss/solar-radiance.jpg' },
  { name: 'Dragon Mint Tea', price: '$22', img: '/demo-assets/ember-moss/dragon-mint-tea.jpg' },
  { name: 'Phoenix Ember Candle', price: '$28', img: '/demo-assets/ember-moss/phoenix-ember.jpg' },
];
function MockupCustomer({ theme, size }) {
  const t = theme.colors;
  const products = EMBER_MOSS_PRODUCTS;
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  return (
    <DeviceFrame theme={theme} size={size} url="emberandmoss.shop/shop">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${10 * size}px` }}>
        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Shop</span>
        <button onClick={() => setOpen(o => !o)} style={{
          position: 'relative', border: `1px solid ${t.border}`, borderRadius: '100px',
          padding: `${4 * size}px ${9 * size}px`, background: 'transparent', cursor: 'pointer',
          fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.text,
        }}>
          Cart {cart.length > 0 && <span style={{ color: t.accent, fontWeight: 700 }}>({cart.length})</span>}
        </button>
      </div>

      {!open ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: `${8 * size}px` }}>
          {products.map(p => (
            <div key={p.name} style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${8 * size}px`, textAlign: 'center' }}>
              <div style={{ marginBottom: `${6 * size}px` }}>
                <ProductImg src={p.img} alt={p.name} size={size} />
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: `${8 * size}px`, color: t.text, marginBottom: '2px' }}>{p.name}</div>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, marginBottom: `${6 * size}px` }}>{p.price}</div>
              <button onClick={() => setCart(c => [...c, p])} style={{
                width: '100%', padding: `${5 * size}px`, border: 'none', borderRadius: `${4 * size}px`,
                background: t.accent, color: theme.isLight ? '#fff' : t.bg,
                fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${7.5 * size}px`, cursor: 'pointer',
              }}>Add to cart</button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {cart.length === 0 ? (
            <div style={{ fontFamily: theme.fonts.body, fontSize: `${9 * size}px`, color: t.textFaint, padding: `${16 * size}px 0`, textAlign: 'center' }}>
              Cart is empty — add something first.
            </div>
          ) : (
            <>
              {cart.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: `${6 * size}px 0`, borderBottom: `1px solid ${t.border}` }}>
                  <span style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.text }}>{p.name}</span>
                  <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8.5 * size}px`, color: t.accent }}>{p.price}</span>
                </div>
              ))}
              <button style={{
                width: '100%', marginTop: `${10 * size}px`, padding: `${8 * size}px`, border: 'none',
                borderRadius: `${4 * size}px`, background: t.accent, color: theme.isLight ? '#fff' : t.bg,
                fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${9 * size}px`, cursor: 'pointer',
              }}>Checkout \u2192</button>
            </>
          )}
        </div>
      )}
    </DeviceFrame>
  );
}

// ── 5. merchant — dashboard tabs ─────────────────────────────────────────────────
function MockupMerchant({ theme, size }) {
  const t = theme.colors;
  const tabs = ['Overview', 'Orders', 'Products', 'Customers'];
  const [tab, setTab] = useState(0);
  return (
    <DeviceFrame theme={theme} size={size} url={`${COMPANY.url}/merchant`}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${8 * size}px` }}>
          {[{ l: 'Revenue', v: '$4,120' }, { l: 'Orders', v: '38' }, { l: 'Visitors', v: '1,204' }].map(k => (
            <div key={k.l} style={{ border: `1px solid ${t.border}`, borderRadius: `${5 * size}px`, padding: `${8 * size}px` }}>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k.l}</div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${14 * size}px`, color: t.text }}>{k.v}</div>
            </div>
          ))}
        </div>
      )}
      {tab === 1 && (
        <div>
          {[{ id: '#1042', c: 'A. Reyes', s: 'Fulfilled' }, { id: '#1041', c: 'J. Okoye', s: 'Processing' }, { id: '#1040', c: 'M. Chen', s: 'Fulfilled' }].map(o => (
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: `${6 * size}px 0`, borderBottom: `1px solid ${t.border}`, fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px` }}>
              <span style={{ color: t.textMuted }}>{o.id} \u00b7 {o.c}</span>
              <span style={{ color: o.s === 'Fulfilled' ? t.accent : t.textFaint }}>{o.s}</span>
            </div>
          ))}
        </div>
      )}
      {tab === 2 && (
        <div>
          {['Shea Body Butter', 'Fragrance Oil', 'Coconut Body Oil'].map(p => (
            <div key={p} style={{ display: 'flex', justifyContent: 'space-between', padding: `${6 * size}px 0`, borderBottom: `1px solid ${t.border}`, fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted }}>
              <span>{p}</span><span style={{ color: t.accent }}>In stock</span>
            </div>
          ))}
        </div>
      )}
      {tab === 3 && (
        <div>
          {['A. Reyes \u00b7 6 orders', 'J. Okoye \u00b7 2 orders', 'M. Chen \u00b7 4 orders'].map(cst => (
            <div key={cst} style={{ padding: `${6 * size}px 0`, borderBottom: `1px solid ${t.border}`, fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted }}>{cst}</div>
          ))}
        </div>
      )}
    </DeviceFrame>
  );
}

// ── 6. storefront-theme — live theme switch ──────────────────────────────────────
const MINI_THEMES = [
  { id: 'a', label: 'Ember & Moss', bg: '#1B3B2E', accent: '#C9A227', text: '#F5F1E4', font: "'Cormorant Garamond', serif" },
  { id: 'b', label: 'Studio', bg: '#111111', accent: '#F2E205', text: '#F5F5F5', font: "'Space Mono', monospace" },
  { id: 'c', label: 'Blush', bg: '#FCEFEF', accent: '#D6597A', text: '#402A2E', font: "'Quicksand', sans-serif" },
  { id: 'd', label: 'Slate', bg: '#F4F6F8', accent: '#3B5BDB', text: '#1B2430', font: "'Inter', sans-serif" },
];
function MockupThemeSwitch({ theme, size }) {
  const t = theme.colors;
  const [mt, setMt] = useState(MINI_THEMES[0]);
  return (
    <div style={{ width: '100%' }}>
      <div style={{
        border: `1px solid ${t.border}`, borderRadius: `${6 * size}px`, overflow: 'hidden',
        background: mt.bg, transition: 'background 0.25s ease', marginBottom: `${10 * size}px`,
      }}>
        <div style={{ padding: `${12 * size}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: mt.font, fontWeight: 700, fontSize: `${11 * size}px`, color: mt.text, transition: 'color 0.25s ease' }}>brand.</span>
          <span style={{ width: `${9 * size}px`, height: `${9 * size}px`, borderRadius: '50%', background: mt.accent }} />
        </div>
        <div style={{ padding: `0 ${12 * size}px ${12 * size}px`, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: `${6 * size}px` }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ borderRadius: `${4 * size}px`, overflow: 'hidden', border: `1px solid ${mt.accent}30` }}>
              <div style={{ aspectRatio: '1', background: `${mt.accent}22` }} />
              <div style={{ padding: `${4 * size}px`, fontFamily: mt.font, fontSize: `${6.5 * size}px`, color: mt.text }}>Item {i + 1}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: `${6 * size}px`, flexWrap: 'wrap' }}>
        {MINI_THEMES.map(candidate => (
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
        {after ? '\u2190 Show Before' : 'Show After \u2192'}
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
      <div style={{
        fontFamily: theme.fonts.display, fontWeight: theme.type.displayWeight,
        fontSize: `${20 * size}px`, color: t.accent, marginBottom: `${16 * size}px`,
      }}>
        \u25b6 Live now
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `${4 * size}px`, flexWrap: 'wrap' }}>
        {flow.map((step, i) => (
          <span key={step} style={{ display: 'flex', alignItems: 'center', gap: `${4 * size}px` }}>
            <span style={{
              fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textMuted,
              border: `1px solid ${t.border}`, borderRadius: '100px', padding: `${4 * size}px ${8 * size}px`,
            }}>{step}</span>
            {i < flow.length - 1 && <span style={{ color: t.textFaint, fontSize: `${9 * size}px` }}>\u2192</span>}
          </span>
        ))}
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
