// ─── SHARED STOREFRONT VIEWS ────────────────────────────────────────────────────
// Reusable pieces of the Ember & Moss storefront demo. Any mockup that shows a
// "real" storefront (Welcome's landing page, Customer's shop) can drop a
// product card or journal card into these instead of building its own detail
// page — this is the plumbing pass: one implementation, multiple call sites,
// no drift between them.

import ProductImg from './ProductImg.jsx';
import { EMBER_MOSS_PRODUCTS, EMBER_MOSS_JOURNAL_BODY, EMBER_MOSS_CONTACT } from '../../../data/decks/emberMoss.js';

function BackLink({ theme, size, onBack, label = 'Back' }) {
  const t = theme.colors;
  return (
    <button onClick={onBack} style={{
      display: 'inline-flex', alignItems: 'center', gap: `${4 * size}px`,
      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textFaint,
      letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: `${12 * size}px`,
    }}>
      ← {label}
    </button>
  );
}

// ── Product detail page ─────────────────────────────────────────────────────
export function ProductDetailView({ theme, size, product, onBack, onAddToCart, cartQty = 0 }) {
  const t = theme.colors;
  const related = EMBER_MOSS_PRODUCTS.filter(p => p.name !== product.name).slice(0, 3);

  return (
    <div>
      <BackLink theme={theme} size={size} onBack={onBack} label="Shop" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: `${14 * size}px`, marginBottom: `${20 * size}px` }}>
        <ProductImg src={product.img} alt={product.name} size={size} radius={6} fallbackIcon="🌿" />
        <div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${13 * size}px`, color: t.text, marginBottom: `${4 * size}px` }}>{product.name}</div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: `${11 * size}px`, color: t.accent, marginBottom: `${8 * size}px` }}>{product.price}</div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: `${8 * size}px`, color: t.textMuted, lineHeight: 1.6, marginBottom: `${10 * size}px` }}>{product.description}</div>
          {product.details && (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginBottom: `${12 * size}px` }}>
              {product.details.map(d => (
                <li key={d} style={{ fontFamily: theme.fonts.body, fontSize: `${7 * size}px`, color: t.textFaint, marginBottom: `${2 * size}px`, paddingLeft: `${10 * size}px`, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: t.accent }}>·</span>{d}
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => onAddToCart?.(product)} style={{
            padding: `${7 * size}px ${16 * size}px`, border: 'none', borderRadius: `${5 * size}px`,
            background: t.accent, color: theme.isLight ? '#fff' : t.bg,
            fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${8.5 * size}px`, cursor: 'pointer',
          }}>
            {cartQty > 0 ? `In cart (${cartQty}) — add another` : 'Add to cart'}
          </button>
        </div>
      </div>

      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: `${8 * size}px` }}>You might also like</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${8 * size}px` }}>
        {related.map(p => (
          <div key={p.name} style={{ textAlign: 'center' }}>
            <ProductImg src={p.img} alt={p.name} size={size} radius={4} />
            <div style={{ fontFamily: theme.fonts.body, fontSize: `${6.5 * size}px`, color: t.textMuted, marginTop: `${3 * size}px` }}>{p.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Blog post reader ────────────────────────────────────────────────────────
export function BlogPostView({ theme, size, post, onBack }) {
  const t = theme.colors;
  const paragraphs = EMBER_MOSS_JOURNAL_BODY[post.title] || [post.excerpt];

  return (
    <div>
      <BackLink theme={theme} size={size} onBack={onBack} label="Journal" />
      <ProductImg src={post.img} alt={post.title} size={size} radius={6} aspect="16/8" fallbackIcon={post.icon} />
      <div style={{ marginTop: `${12 * size}px` }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${14 * size}px`, color: t.text, lineHeight: 1.25, marginBottom: `${10 * size}px` }}>{post.title}</div>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted, lineHeight: 1.75, marginBottom: `${8 * size}px` }}>{p}</p>
        ))}
      </div>
    </div>
  );
}

// ── Contact page ────────────────────────────────────────────────────────────
export function ContactView({ theme, size, onBack, brandName = 'Ember & Moss' }) {
  const t = theme.colors;
  return (
    <div>
      <BackLink theme={theme} size={size} onBack={onBack} label="Home" />
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${14 * size}px`, color: t.text, marginBottom: `${6 * size}px` }}>Say hello.</div>
      <div style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted, lineHeight: 1.6, marginBottom: `${14 * size}px`, maxWidth: '80%' }}>{EMBER_MOSS_CONTACT.note}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: `${8 * size}px`, marginBottom: `${12 * size}px`, maxWidth: '360px' }}>
        {['Name', 'Email'].map(label => (
          <div key={label}>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: `${3 * size}px` }}>{label}</div>
            <div style={{ border: `1px solid ${t.border}`, borderRadius: `${4 * size}px`, padding: `${7 * size}px ${9 * size}px`, background: t.bgAlt }} />
          </div>
        ))}
        <div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: `${3 * size}px` }}>Message</div>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: `${4 * size}px`, padding: `${7 * size}px ${9 * size}px`, height: `${36 * size}px`, background: t.bgAlt }} />
        </div>
      </div>

      <button style={{
        padding: `${7 * size}px ${16 * size}px`, border: 'none', borderRadius: `${5 * size}px`,
        background: t.accent, color: theme.isLight ? '#fff' : t.bg,
        fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${8.5 * size}px`, cursor: 'pointer', marginBottom: `${14 * size}px`,
      }}>Send message</button>

      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.04em' }}>{EMBER_MOSS_CONTACT.email}</div>
    </div>
  );
}
