// ─── SHARED STOREFRONT VIEWS ────────────────────────────────────────────────────
// Reusable pieces of the Ember & Moss storefront demo. Any mockup that shows a
// "real" storefront (Welcome's landing page, Customer's shop) can drop a
// product card or journal card into these instead of building its own detail
// page — this is the plumbing pass: one implementation, multiple call sites,
// no drift between them.

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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
          <button data-demo="add-to-cart" onClick={() => onAddToCart?.(product)} style={{
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
// Self-animating: a demo script drives it through the ref (focus / setValue /
// send) — the same paths a visitor's clicks take — so it can fill itself in,
// send, and land on the kawaii "sent" screen. `onInteract` lets a real click
// cancel a running demo.
export const CONTACT_SEND_MS = 1750; // paper plane flight, then the sent screen

const PINK = '#F4A6C0';

// Quadratic bezier the paper plane flies along (button -> up and away).
function planePath(s) {
  const P0 = [0, 0], P1 = [45 * s, -80 * s], P2 = [250 * s, -230 * s];
  const at = (u) => {
    const x = (1 - u) * (1 - u) * P0[0] + 2 * (1 - u) * u * P1[0] + u * u * P2[0];
    const y = (1 - u) * (1 - u) * P0[1] + 2 * (1 - u) * u * P1[1] + u * u * P2[1];
    const dx = 2 * (1 - u) * (P1[0] - P0[0]) + 2 * u * (P2[0] - P1[0]);
    const dy = 2 * (1 - u) * (P1[1] - P0[1]) + 2 * u * (P2[1] - P1[1]);
    return { x, y, rot: (Math.atan2(dy, dx) * 180) / Math.PI + 45 };
  };
  return at;
}

function PaperPlane({ size, color, origin }) {
  const at = planePath(size);
  const N = 18;
  const pts = Array.from({ length: N + 1 }, (_, i) => at(Math.pow(i / N, 1.6))); // accelerates away
  const times = pts.map((_, i) => i / N);
  const dur = (CONTACT_SEND_MS - 250) / 1000;
  const w = 30 * size;
  // little hearts/sparkles left hanging along the flight path
  const trail = [0.1, 0.2, 0.31, 0.43, 0.55, 0.68].map((u, i) => ({ ...at(u), delay: dur * Math.pow(u, 1 / 1.6), heart: i % 2 === 0 }));
  return (
    <div aria-hidden style={{ position: 'absolute', left: origin.x + origin.w / 2, top: origin.y + origin.h / 2, width: 0, height: 0, pointerEvents: 'none', zIndex: 5 }}>
      {trail.map((d, i) => (
        <motion.span key={i} initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.5], y: [0, -10 * size] }}
          transition={{ delay: d.delay, duration: 0.9, ease: 'easeOut' }}
          style={{ position: 'absolute', left: d.x, top: d.y, marginLeft: -4 * size, marginTop: -4 * size, fontSize: `${12 * size}px`, lineHeight: 1, color: d.heart ? PINK : color }}>
          {d.heart ? '\u2665' : '\u2726'}
        </motion.span>
      ))}
      <motion.div initial={{ x: 0, y: 0, rotate: pts[0].rot, scale: 0.6, opacity: 0 }}
        animate={{ x: pts.map(p => p.x), y: pts.map(p => p.y), rotate: pts.map(p => p.rot), scale: [0.6, 1.15, 1, 0.9, 0.6], opacity: [0, 1, 1, 1, 0] }}
        transition={{ duration: dur, delay: 0.12, times, ease: 'linear', scale: { duration: dur, delay: 0.12, times: [0, 0.12, 0.5, 0.8, 1] }, opacity: { duration: dur, delay: 0.12, times: [0, 0.06, 0.7, 0.85, 1] } }}
        style={{ position: 'absolute', left: -w / 2, top: -w / 2, width: w, height: w, filter: `drop-shadow(0 ${2 * size}px ${3 * size}px ${color}55)` }}>
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M22 2 L2 9.5 L10 13 Z" fill={color} />
          <path d="M22 2 L10 13 L13.5 21.5 Z" fill={color} opacity="0.62" />
          <path d="M10 13 L12 17.5 L13.5 21.5" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}

// A happy little envelope: closed-eye smile, blushing cheeks, heart seal.
function KawaiiEnvelope({ size, color }) {
  const w = 84 * size;
  return (
    <svg viewBox="0 0 64 56" width={w} height={w * 0.875} aria-hidden>
      <rect x="4" y="10" width="56" height="40" rx="7" fill="#fff" stroke={color} strokeWidth="2.5" />
      <path d="M6 14 L32 34 L58 14" fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M22 33 Q25 30 28 33 M36 33 Q39 30 42 33" fill="none" stroke="#5A3A46" strokeWidth="2" strokeLinecap="round" />
      <path d="M29 38 Q32 41.5 35 38" fill="none" stroke="#5A3A46" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="19" cy="38.5" rx="4" ry="2.6" fill={PINK} opacity="0.85" />
      <ellipse cx="45" cy="38.5" rx="4" ry="2.6" fill={PINK} opacity="0.85" />
      <path d="M32 26 C32 26 27.5 22.6 27.5 19.6 C27.5 17.7 29 16.6 30.4 16.6 C31.3 16.6 31.8 17.1 32 17.6 C32.2 17.1 32.7 16.6 33.6 16.6 C35 16.6 36.5 17.7 36.5 19.6 C36.5 22.6 32 26 32 26 Z" fill={PINK} transform="translate(0 -3)" />
    </svg>
  );
}

function SentPanel({ theme, size, onAgain }) {
  const t = theme.colors;
  const burst = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = (58 + (i % 3) * 12) * size;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r, heart: i % 2 === 0, rot: (i % 2 ? 1 : -1) * 25, delay: 0.12 + i * 0.03 };
  });
  return (
    <div style={{ textAlign: 'center', padding: `${26 * size}px 0 ${6 * size}px` }}>
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: `${10 * size}px` }}>
        {burst.map((b, i) => (
          <motion.span key={i} aria-hidden initial={{ x: 0, y: 0, opacity: 0, scale: 0.2, rotate: 0 }}
            animate={{ x: b.x, y: b.y, opacity: [0, 1, 1, 0], scale: [0.2, 1.1, 1, 0.7], rotate: b.rot }}
            transition={{ delay: b.delay, duration: 1.3, ease: 'easeOut' }}
            style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -7 * size, marginTop: -7 * size, fontSize: `${15 * size}px`, lineHeight: 1, color: b.heart ? PINK : t.accent }}>
            {b.heart ? '\u2665' : '\u2726'}
          </motion.span>
        ))}
        <motion.div initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 13, delay: 0.05 }}>
          <motion.div animate={{ y: [0, -3 * size, 0] }} transition={{ delay: 0.9, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
            <KawaiiEnvelope size={size} color={t.accent} />
          </motion.div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${17 * size}px`, color: t.text, marginBottom: `${5 * size}px` }}>Message sent!</div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted, lineHeight: 1.6, maxWidth: '78%', margin: `0 auto ${10 * size}px` }}>
          A very small dragon is carrying it to the inbox right now.
        </div>
        <span style={{ display: 'inline-block', fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.accent, border: `1px solid ${t.accent}`, borderRadius: '100px', padding: `${3 * size}px ${9 * size}px`, marginBottom: `${10 * size}px` }}>
          We usually reply within a day
        </span>
        <div>
          <button onClick={onAgain} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, textDecoration: 'underline' }}>Send another</button>
        </div>
      </motion.div>
    </div>
  );
}

export const ContactView = forwardRef(function ContactView({ theme, size, onBack, onInteract }, ref) {
  const t = theme.colors;
  const [vals, setVals] = useState({ name: '', email: '', message: '' });
  const [focus, setFocus] = useState(null);
  const [stage, setStage] = useState('form'); // 'form' | 'sending' | 'sent'
  const [origin, setOrigin] = useState(null);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const send = () => {
    if (stage !== 'form') return;
    const btn = btnRef.current;
    if (btn) setOrigin({ x: btn.offsetLeft, y: btn.offsetTop, w: btn.offsetWidth, h: btn.offsetHeight });
    setFocus(null);
    setStage('sending');
    timerRef.current = setTimeout(() => setStage('sent'), CONTACT_SEND_MS);
  };
  const reset = () => { clearTimeout(timerRef.current); setVals({ name: '', email: '', message: '' }); setStage('form'); };

  useImperativeHandle(ref, () => ({
    focus: setFocus,
    setValue: (field, v) => setVals((s) => ({ ...s, [field]: v })),
    send,
  }));

  const label = { fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: `${3 * size}px` };
  const field = (key, extra = {}) => (
    <div>
      <div style={label}>{key === 'name' ? 'Name' : key === 'email' ? 'Email' : 'Message'}</div>
      <div data-demo={`contact-${key}`} onClick={() => onInteract?.()} style={{
        border: `1px solid ${focus === key ? t.accent : t.border}`, borderRadius: `${4 * size}px`, padding: `${7 * size}px ${9 * size}px`,
        background: t.bgAlt, boxShadow: focus === key ? `0 0 0 ${2 * size}px ${t.accent}26` : 'none',
        fontFamily: theme.fonts.body, fontSize: `${8 * size}px`, color: t.text, lineHeight: 1.5, minHeight: `${11 * size}px`,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease', wordBreak: 'break-word', ...extra,
      }}>
        {vals[key]}
        {focus === key && <span style={{ display: 'inline-block', width: `${1.5 * size}px`, height: `${9 * size}px`, background: t.accent, marginLeft: `${1 * size}px`, verticalAlign: 'text-bottom', animation: 'cvBlink 1s steps(2, start) infinite' }} />}
      </div>
    </div>
  );

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <style>{'@keyframes cvBlink{to{visibility:hidden}}'}</style>
      <BackLink theme={theme} size={size} onBack={onBack} label="Home" />
      {stage === 'sent' ? (
        <SentPanel theme={theme} size={size} onAgain={() => { onInteract?.(); reset(); }} />
      ) : (
        <>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${14 * size}px`, color: t.text, marginBottom: `${6 * size}px` }}>Say hello.</div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted, lineHeight: 1.6, marginBottom: `${14 * size}px`, maxWidth: '80%' }}>{EMBER_MOSS_CONTACT.note}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: `${8 * size}px`, marginBottom: `${12 * size}px`, maxWidth: '360px' }}>
            {field('name')}
            {field('email')}
            {field('message', { minHeight: `${36 * size}px` })}
          </div>

          <button ref={btnRef} data-demo="contact-send" onClick={() => { onInteract?.(); send(); }} disabled={stage === 'sending'} style={{
            padding: `${7 * size}px ${16 * size}px`, border: 'none', borderRadius: `${5 * size}px`,
            background: t.accent, color: theme.isLight ? '#fff' : t.bg,
            fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${8.5 * size}px`, cursor: 'pointer', marginBottom: `${14 * size}px`,
            transform: stage === 'sending' ? 'scale(0.94)' : 'none', opacity: stage === 'sending' ? 0.85 : 1, transition: 'transform 0.2s ease, opacity 0.2s ease',
          }}>{stage === 'sending' ? 'Sending\u2026' : 'Send message'}</button>

          <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textFaint, letterSpacing: '0.04em' }}>{EMBER_MOSS_CONTACT.email}</div>
          {stage === 'sending' && origin && <PaperPlane size={size} color={t.accent} origin={origin} />}
        </>
      )}
    </div>
  );
});
