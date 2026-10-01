// ─── SHARED STOREFRONT VIEWS ────────────────────────────────────────────────────
// Reusable pieces of the Ember & Moss storefront demo. Any mockup that shows a
// "real" storefront (Welcome's landing page, Customer's shop) can drop a
// product card or journal card into these instead of building its own detail
// page — this is the plumbing pass: one implementation, multiple call sites,
// no drift between them.

import { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { MapPin, CreditCard, Gift, Check, Lock, Mail, PackageCheck, Bell, Truck } from 'lucide-react';
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


// ── Checkout ────────────────────────────────────────────────────────────────
// Self-animating like the contact form: a demo script drives it through the ref
// (focus / setValue / calcShipping / toPayment / pay), and a visitor's own
// clicks take the same paths. Address -> shipping + tax calculated -> card ->
// paid -> confirmation, receipt email, and the platform quietly doing the rest.
export const SHIP_CALC_MS = 1300;   // the truck's trip while rates are "calculated"
export const PAY_MS = 1700;         // card is charged, then the parcel pops
const TAX_RATE = 0.0825;
const SHIP_STANDARD = 5;
const money = (n) => `$${n.toFixed(2)}`;

// a number that glides to its new value instead of jumping
function Money({ value }) {
  const [shown, setShown] = useState(value ?? 0);
  const fromRef = useRef(value ?? 0);
  useEffect(() => {
    if (value == null) return undefined;
    const from = fromRef.current, t0 = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 600), e = 1 - Math.pow(1 - p, 3);
      const v = from + (value - from) * e;
      fromRef.current = v; setShown(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{value == null ? '\u2014' : money(shown)}</span>;
}

function CheckoutSteps({ theme, size, step }) {
  const t = theme.colors;
  const onAccent = theme.isLight ? '#fff' : t.bg;
  const items = [{ Icon: MapPin, label: 'Shipping' }, { Icon: CreditCard, label: 'Payment' }, { Icon: Gift, label: 'Done' }];
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: `${12 * size}px`, maxWidth: `${380 * size}px` }}>
      {items.map((s, i) => (
        <Fragment key={s.label}>
          <div style={{ display: 'flex', alignItems: 'center', gap: `${5 * size}px` }}>
            <motion.div animate={step === i ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.5 }} style={{
              width: `${20 * size}px`, height: `${20 * size}px`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step >= i ? t.accent : 'transparent', border: `1.5px solid ${step >= i ? t.accent : t.border}`, transition: 'background 0.3s ease, border-color 0.3s ease',
            }}>
              {step > i ? <Check size={11 * size} color={onAccent} strokeWidth={3} /> : <s.Icon size={10 * size} color={step >= i ? onAccent : t.textFaint} />}
            </motion.div>
            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: step >= i ? t.text : t.textFaint, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</span>
          </div>
          {i < 2 && (
            <div style={{ flex: 1, height: `${2 * size}px`, margin: `0 ${8 * size}px`, borderRadius: '2px', background: t.border, position: 'relative', overflow: 'hidden' }}>
              <motion.div initial={false} animate={{ width: step > i ? '100%' : '0%' }} transition={{ duration: 0.5 }} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: t.accent }} />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

function CoField({ theme, size, k, label, vals, focus, onInteract, mask, style }) {
  const t = theme.colors;
  return (
    <div style={style}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: `${3 * size}px` }}>{label}</div>
      <div data-demo={`co-${k}`} onClick={() => onInteract?.()} style={{
        border: `1px solid ${focus === k ? t.accent : t.border}`, borderRadius: `${4 * size}px`, padding: `${6 * size}px ${9 * size}px`,
        background: t.bgAlt, boxShadow: focus === k ? `0 0 0 ${2 * size}px ${t.accent}26` : 'none',
        fontFamily: theme.fonts.body, fontSize: `${8 * size}px`, color: t.text, lineHeight: 1.5, minHeight: `${11 * size}px`,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease', wordBreak: 'break-word',
      }}>
        {mask ? '\u2022'.repeat(vals[k].length) : vals[k]}
        {focus === k && <span style={{ display: 'inline-block', width: `${1.5 * size}px`, height: `${9 * size}px`, background: t.accent, marginLeft: `${1 * size}px`, verticalAlign: 'text-bottom', animation: 'cvBlink 1s steps(2, start) infinite' }} />}
      </div>
    </div>
  );
}

// a delivery truck with a smile, wheels spinning
function KawaiiTruck({ size, color }) {
  const wheel = (cx) => (
    <g>
      <circle cx={cx} cy="24" r="4.4" fill="#4A3F52" />
      <g style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'coSpin 0.5s linear infinite' }}>
        <circle cx={cx} cy="24" r="1.5" fill="#fff" />
        <line x1={cx} y1="20.6" x2={cx} y2="22.2" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
      </g>
    </g>
  );
  return (
    <svg viewBox="0 0 54 30" width={46 * size} height={46 * size * 30 / 54} aria-hidden style={{ display: 'block' }}>
      <rect x="2" y="3" width="32" height="19" rx="4.5" fill={color} />
      <path d="M34 9 h8.5 l7.5 7.5 v5.5 h-16 z" fill={color} opacity="0.82" />
      <path d="M38 11.2 h4 l4 4.2 h-8 z" fill="#fff" opacity="0.85" />
      <circle cx="14" cy="11.5" r="1.5" fill="#fff" /><circle cx="24" cy="11.5" r="1.5" fill="#fff" />
      <path d="M16.5 15 Q19 17.8 21.5 15" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="10.5" cy="15" rx="2.3" ry="1.5" fill={PINK} opacity="0.9" /><ellipse cx="27.5" cy="15" rx="2.3" ry="1.5" fill={PINK} opacity="0.9" />
      {wheel(14)}{wheel(42)}
    </svg>
  );
}

function CardPreview({ theme, size, vals, paying }) {
  const t = theme.colors;
  const digits = vals.card.replace(/\D/g, '');
  const groups = [0, 1, 2, 3].map((i) => digits.slice(i * 4, i * 4 + 4).padEnd(4, '\u2022'));
  return (
    <motion.div animate={paying ? { rotate: [0, -3, 3, -2, 0], scale: [1, 1.05, 1] } : { rotate: 0, scale: 1 }} transition={{ duration: 0.7 }} style={{
      position: 'relative', width: '100%', maxWidth: `${236 * size}px`, aspectRatio: '1.62', borderRadius: `${12 * size}px`, marginBottom: `${12 * size}px`,
      background: `linear-gradient(135deg, ${t.accent}, ${t.accent}B8)`, padding: `${12 * size}px ${14 * size}px`, color: '#fff',
      boxShadow: `0 ${8 * size}px ${20 * size}px ${t.accent}40`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: `${24 * size}px`, height: `${17 * size}px`, borderRadius: `${3.5 * size}px`, background: 'linear-gradient(135deg,#F7DE92,#E2B955)' }} />
        <svg viewBox="0 0 40 24" width={34 * size} height={34 * size * 0.6} aria-hidden>
          <path d="M9 9 Q12 5.5 15 9 M25 9 Q28 5.5 31 9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <path d="M16.5 14 Q20 18.5 23.5 14" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="6.5" cy="14" rx="3.4" ry="2.2" fill={PINK} opacity="0.95" /><ellipse cx="33.5" cy="14" rx="3.4" ry="2.2" fill={PINK} opacity="0.95" />
        </svg>
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${10.5 * size}px`, letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>{groups.join('  ')}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, letterSpacing: '0.08em', opacity: 0.92 }}>
        <span>{(vals.name || 'YOUR NAME').toUpperCase()}</span><span>{vals.exp || 'MM / YY'}</span>
      </div>
    </motion.div>
  );
}

function KawaiiParcel({ size, color }) {
  const w = 86 * size;
  return (
    <svg viewBox="0 0 64 64" width={w} height={w} aria-hidden>
      <rect x="8" y="22" width="48" height="34" rx="6" fill="#E9C99B" stroke="#C9A06A" strokeWidth="1.6" />
      <rect x="5" y="14" width="54" height="12" rx="4" fill="#F1D7AE" stroke="#C9A06A" strokeWidth="1.6" />
      <rect x="28" y="14" width="8" height="42" fill={color} opacity="0.9" />
      <ellipse cx="25.5" cy="11.5" rx="6.5" ry="4.2" fill={color} transform="rotate(-18 25.5 11.5)" />
      <ellipse cx="38.5" cy="11.5" rx="6.5" ry="4.2" fill={color} transform="rotate(18 38.5 11.5)" />
      <circle cx="32" cy="13" r="3.2" fill={color} stroke="#fff" strokeOpacity="0.5" strokeWidth="1" />
      <path d="M16.5 40 Q20 36.5 23.5 40 M40.5 40 Q44 36.5 47.5 40" fill="none" stroke="#5A3A46" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M29 45 Q32 48.5 35 45" fill="none" stroke="#5A3A46" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="14" cy="46" rx="4" ry="2.6" fill={PINK} opacity="0.9" /><ellipse cx="50" cy="46" rx="4" ry="2.6" fill={PINK} opacity="0.9" />
    </svg>
  );
}

function OrderDone({ theme, size, snap, vals, total, orderNo, onAgain }) {
  const t = theme.colors;
  const first = (vals.name || 'Mira').split(' ')[0];
  const burst = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2, r = (60 + (i % 3) * 14) * size;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.9, heart: i % 2 === 0, rot: (i % 2 ? 1 : -1) * 30, delay: 0.1 + i * 0.03 };
  });
  const chips = [{ Icon: Mail, text: 'Receipt emailed' }, { Icon: PackageCheck, text: 'Inventory updated' }, { Icon: Bell, text: 'Merchant notified' }, { Icon: Truck, text: 'Shipping label queued' }];
  return (
    <div style={{ padding: `${10 * size}px 0 ${4 * size}px` }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: `${6 * size}px` }}>
          {burst.map((b, i) => (
            <motion.span key={i} aria-hidden initial={{ x: 0, y: 0, opacity: 0, scale: 0.2, rotate: 0 }}
              animate={{ x: b.x, y: b.y, opacity: [0, 1, 1, 0], scale: [0.2, 1.1, 1, 0.7], rotate: b.rot }} transition={{ delay: b.delay, duration: 1.4, ease: 'easeOut' }}
              style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -7 * size, marginTop: -7 * size, fontSize: `${15 * size}px`, lineHeight: 1, color: b.heart ? PINK : t.accent }}>
              {b.heart ? '\u2665' : '\u2726'}
            </motion.span>
          ))}
          <motion.div initial={{ scale: 0, y: 14 * size }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 240, damping: 12, delay: 0.05 }}>
            <motion.div animate={{ y: [0, -9 * size, 0], scaleY: [1, 1.04, 0.93, 1] }} transition={{ delay: 0.8, duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}>
              <KawaiiParcel size={size} color={t.accent} />
            </motion.div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${17 * size}px`, color: t.text, marginBottom: `${3 * size}px` }}>Order confirmed!</div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.textMuted, letterSpacing: '0.04em' }}>#{orderNo} {'\u00B7'} thank you, {first}!</div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: `${12 * size}px`, marginTop: `${14 * size}px`, alignItems: 'start' }}>
        <motion.div initial={{ opacity: 0, y: 22 * size, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.85 }}
          style={{ position: 'relative' }}>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: `${7 * size}px`, overflow: 'hidden', background: t.surface || t.bg, boxShadow: `0 ${6 * size}px ${18 * size}px rgba(0,0,0,0.12)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: `${6 * size}px`, padding: `${6 * size}px ${9 * size}px`, background: t.bgAlt, borderBottom: `1px solid ${t.border}` }}>
            <Mail size={10 * size} color={t.accent} />
            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textMuted, flex: 1 }}>Ember &amp; Moss</span>
            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint }}>just now</span>
          </div>
          <div style={{ padding: `${9 * size}px ${10 * size}px` }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${9.5 * size}px`, color: t.text, marginBottom: `${4 * size}px` }}>Your order #{orderNo} is confirmed {'\u2665'}</div>
            <div style={{ fontFamily: theme.fonts.body, fontSize: `${7.5 * size}px`, color: t.textMuted, lineHeight: 1.55, marginBottom: `${7 * size}px` }}>Hi {first} {'\u2014'} we&rsquo;re wrapping it up now. A small dragon has been notified.</div>
            {snap.map((e) => (
              <div key={e.name} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.fonts.body, fontSize: `${7.5 * size}px`, color: t.text, padding: `${3 * size}px 0`, borderTop: `1px dashed ${t.border}` }}>
                <span>{e.qty} {'\u00D7'} {e.name}</span><span>{e.price}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${8 * size}px`, color: t.text, padding: `${4 * size}px 0 ${8 * size}px`, borderTop: `1px solid ${t.border}` }}>
              <span>Total</span><span>{money(total)}</span>
            </div>
            <div style={{ display: 'inline-block', padding: `${5 * size}px ${12 * size}px`, borderRadius: `${4 * size}px`, background: t.accent, color: theme.isLight ? '#fff' : t.bg, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${7.5 * size}px` }}>Track my order</div>
          </div>
          </div>
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 1.1 }}
            style={{ position: 'absolute', top: `${-6 * size}px`, right: `${-6 * size}px`, width: `${16 * size}px`, height: `${16 * size}px`, borderRadius: '50%', background: '#DB3521', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: `${8 * size}px`, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>1</motion.span>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: `${6 * size}px` }}>
          {chips.map(({ Icon, text }, i) => (
            <motion.div key={text} initial={{ opacity: 0, x: 14 * size }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 1.2 + i * 0.28 }}
              style={{ display: 'flex', alignItems: 'center', gap: `${7 * size}px`, padding: `${6 * size}px ${8 * size}px`, borderRadius: `${100}px`, border: `1px solid ${t.border}`, background: t.surface || t.bg }}>
              <Icon size={10 * size} color={t.accent} />
              <span style={{ fontFamily: theme.fonts.body, fontSize: `${7.5 * size}px`, color: t.text, flex: 1 }}>{text}</span>
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14, delay: 1.45 + i * 0.28 }}
                style={{ width: `${13 * size}px`, height: `${13 * size}px`, borderRadius: '50%', background: t.positive || t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={8 * size} color="#fff" strokeWidth={3.5} />
              </motion.span>
            </motion.div>
          ))}
          <button onClick={onAgain} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: `${2 * size}px`, textAlign: 'left', fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, textDecoration: 'underline' }}>Back to the shop</button>
        </div>
      </div>
    </div>
  );
}

export const CheckoutView = forwardRef(function CheckoutView({ theme, size, items, subtotal: subtotalProp, onBack, onInteract, onPlaced, onAgain, orderNo = 1047 }, ref) {
  const t = theme.colors;
  const onAccent = theme.isLight ? '#fff' : t.bg;
  const [snap] = useState(items);          // freeze the order: the cart empties once it's placed
  const [subtotal] = useState(subtotalProp);
  const [vals, setVals] = useState({ name: '', street: '', city: '', card: '', exp: '', cvc: '' });
  const [focus, setFocus] = useState(null);
  const [step, setStep] = useState(0);     // 0 shipping · 1 payment · 2 done
  const [ship, setShip] = useState('idle'); // idle · calc · ready
  const [paying, setPaying] = useState(false);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };

  const shipping = ship === 'ready' ? SHIP_STANDARD : null;
  const tax = ship === 'ready' ? Math.round(subtotal * TAX_RATE * 100) / 100 : null;
  const total = subtotal + (shipping || 0) + (tax || 0);

  const calcShipping = () => { if (ship !== 'idle') return; setFocus(null); setShip('calc'); later(() => setShip('ready'), SHIP_CALC_MS); };
  const toPayment = () => { setFocus(null); setStep(1); };
  const pay = () => {
    if (paying || step !== 1) return;
    setFocus(null); setPaying(true);
    later(() => { setPaying(false); setStep(2); onPlaced?.(); }, PAY_MS);
  };
  useImperativeHandle(ref, () => ({ focus: setFocus, setValue: (f, v) => setVals((s) => ({ ...s, [f]: v })), calcShipping, toPayment, pay }));

  // a visitor clicking through by hand: fill sample details so it never looks empty
  const fillDemo = (which) => setVals((v) => (which === 'address'
    ? { ...v, name: v.name || 'Mira Halloran', street: v.street || '88 Juniper Lane', city: v.city || 'Austin, TX 78701' }
    : { ...v, card: v.card || '4242 4242 4242 4242', exp: v.exp || '08 / 28', cvc: v.cvc || '123' }));
  const onContinue = () => {
    onInteract?.(); fillDemo('address');
    if (ship === 'idle') { calcShipping(); later(toPayment, SHIP_CALC_MS + 500); } else if (ship === 'ready') toPayment();
  };
  const onPay = () => { onInteract?.(); fillDemo('payment'); pay(); };

  const label = { fontFamily: theme.fonts.mono, fontSize: `${6.5 * size}px`, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: `${6 * size}px` };
  const line = (name, node, strong) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${3 * size}px 0`, fontFamily: strong ? theme.fonts.display : theme.fonts.body, fontWeight: strong ? 700 : 400, fontSize: `${(strong ? 10.5 : 8) * size}px`, color: strong ? t.text : t.textMuted }}>
      <span>{name}</span>{node}
    </div>
  );
  const flash = (key, node) => (
    <motion.span key={key} initial={{ backgroundColor: `${t.accent}40` }} animate={{ backgroundColor: `${t.accent}00` }} transition={{ duration: 1 }} style={{ borderRadius: `${3 * size}px`, padding: `0 ${3 * size}px`, color: t.text }}>{node}</motion.span>
  );

  if (step === 2) {
    return (
      <div style={{ position: 'relative' }}>
        <CheckoutSteps theme={theme} size={size} step={2} />
        <OrderDone theme={theme} size={size} snap={snap} vals={vals} total={total} orderNo={orderNo} onAgain={() => { onInteract?.(); onAgain?.(); }} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <style>{'@keyframes cvBlink{to{visibility:hidden}} @keyframes coSpin{to{transform:rotate(360deg)}} @keyframes coDots{0%,100%{opacity:.25}50%{opacity:1}}'}</style>
      <BackLink theme={theme} size={size} onBack={onBack} label="Cart" />
      <CheckoutSteps theme={theme} size={size} step={step} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: `${14 * size}px`, alignItems: 'start' }}>
        {/* ── left: the step ── */}
        <div>
          {step === 0 && (
            <>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${11 * size}px`, color: t.text, marginBottom: `${8 * size}px` }}>Where should we send it?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${7 * size}px`, marginBottom: `${10 * size}px` }}>
                <CoField theme={theme} size={size} k="name" label="Full name" vals={vals} focus={focus} onInteract={onInteract} />
                <CoField theme={theme} size={size} k="street" label="Street address" vals={vals} focus={focus} onInteract={onInteract} />
                <CoField theme={theme} size={size} k="city" label="City, state, ZIP" vals={vals} focus={focus} onInteract={onInteract} />
              </div>
              {ship !== 'idle' && (
                <motion.div initial={{ opacity: 0, y: 8 * size }} animate={{ opacity: 1, y: 0 }} style={{ border: `1px solid ${t.border}`, borderRadius: `${6 * size}px`, padding: `${8 * size}px ${10 * size}px`, marginBottom: `${10 * size}px`, background: t.surface || t.bg }}>
                  {ship === 'calc' ? (
                    <>
                      <div style={{ ...label, marginBottom: `${4 * size}px` }}>Finding the best rates{'\u2026'}</div>
                      <div style={{ position: 'relative', height: `${28 * size}px`, overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${3 * size}px`, borderBottom: `2px dashed ${t.border}` }} />
                        <motion.div initial={{ left: '-16%' }} animate={{ left: '104%' }} transition={{ duration: SHIP_CALC_MS / 1000, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: `${1 * size}px` }}>
                          <KawaiiTruck size={size} color={t.accent} />
                        </motion.div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={label}>Shipping</div>
                      {[{ n: 'Standard', d: '3\u20135 days', p: money(SHIP_STANDARD), on: true }, { n: 'Express', d: '1\u20132 days', p: money(12), on: false }].map((r, i) => (
                        <motion.div key={r.n} initial={{ opacity: 0, x: -10 * size }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.12 }}
                          style={{ display: 'flex', alignItems: 'center', gap: `${7 * size}px`, padding: `${5 * size}px ${7 * size}px`, marginBottom: i ? 0 : `${4 * size}px`, borderRadius: `${5 * size}px`, border: `1px solid ${r.on ? t.accent : t.border}`, background: r.on ? `${t.accent}12` : 'transparent' }}>
                          <span style={{ width: `${10 * size}px`, height: `${10 * size}px`, borderRadius: '50%', border: `1.5px solid ${r.on ? t.accent : t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {r.on && <span style={{ width: `${5 * size}px`, height: `${5 * size}px`, borderRadius: '50%', background: t.accent }} />}
                          </span>
                          <span style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${8 * size}px`, color: t.text }}>{r.n}</span>
                          <span style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, flex: 1 }}>{r.d}</span>
                          <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.text }}>{r.p}</span>
                        </motion.div>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
              <button data-demo="co-continue" onClick={onContinue} style={{
                width: '100%', padding: `${8 * size}px`, border: 'none', borderRadius: `${5 * size}px`, background: t.accent, color: onAccent,
                fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${8.5 * size}px`, cursor: 'pointer', opacity: ship === 'ready' ? 1 : 0.55, transition: 'opacity 0.3s ease',
              }}>Continue to payment {'\u2192'}</button>
            </>
          )}

          {step === 1 && (
            <>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${11 * size}px`, color: t.text, marginBottom: `${8 * size}px` }}>How would you like to pay?</div>
              <CardPreview theme={theme} size={size} vals={vals} paying={paying} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${7 * size}px`, marginBottom: `${10 * size}px` }}>
                <CoField theme={theme} size={size} k="card" label="Card number" vals={vals} focus={focus} onInteract={onInteract} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${7 * size}px` }}>
                  <CoField theme={theme} size={size} k="exp" label="Expiry" vals={vals} focus={focus} onInteract={onInteract} />
                  <CoField theme={theme} size={size} k="cvc" label="CVC" vals={vals} focus={focus} onInteract={onInteract} mask />
                </div>
              </div>
              <button data-demo="co-pay" onClick={onPay} disabled={paying} style={{
                width: '100%', padding: `${8 * size}px`, border: 'none', borderRadius: `${5 * size}px`, background: t.accent, color: onAccent,
                fontFamily: theme.fonts.body, fontWeight: 600, fontSize: `${8.5 * size}px`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `${6 * size}px`,
                transform: paying ? 'scale(0.97)' : 'none', transition: 'transform 0.2s ease',
              }}>
                {paying ? (
                  <><span style={{ width: `${9 * size}px`, height: `${9 * size}px`, borderRadius: '50%', border: `${1.6 * size}px solid ${onAccent}55`, borderTopColor: onAccent, animation: 'coSpin 0.7s linear infinite' }} />Paying{'\u2026'}</>
                ) : (<><Lock size={9 * size} />Pay {money(total)}</>)}
              </button>
            </>
          )}
        </div>

        {/* ── right: the order summary, recalculating live ── */}
        <div style={{ border: `1px solid ${t.border}`, borderRadius: `${7 * size}px`, padding: `${10 * size}px`, background: t.bgAlt }}>
          <div style={label}>Order summary</div>
          {snap.map((e) => (
            <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: `${7 * size}px`, paddingBottom: `${8 * size}px`, marginBottom: `${6 * size}px`, borderBottom: `1px solid ${t.border}` }}>
              <div style={{ width: `${26 * size}px`, flexShrink: 0 }}><ProductImg src={e.img} alt={e.name} size={size} radius={4} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: `${8 * size}px`, color: t.text }}>{e.name}</div>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint }}>Qty {e.qty}</div>
              </div>
              <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.text }}>{e.price}</span>
            </div>
          ))}
          {line('Subtotal', <span style={{ color: t.text }}><Money value={subtotal} /></span>)}
          {line('Shipping', ship === 'calc'
            ? <span style={{ color: t.textFaint, animation: 'coDots 0.9s ease-in-out infinite' }}>calculating{'\u2026'}</span>
            : flash(`s-${ship}`, <Money value={shipping} />))}
          {line(`Tax (${(TAX_RATE * 100).toFixed(2)}%)`, flash(`t-${ship}`, <Money value={tax} />))}
          <div style={{ borderTop: `1px solid ${t.border}`, marginTop: `${4 * size}px`, paddingTop: `${4 * size}px` }}>
            {line('Total', <span style={{ color: t.accent }}><Money value={total} /></span>, true)}
          </div>
        </div>
      </div>
    </div>
  );
});
