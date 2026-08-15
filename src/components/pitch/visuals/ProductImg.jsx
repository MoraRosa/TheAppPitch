// ─── PRODUCT IMAGE (WITH GRACEFUL FALLBACK) ────────────────────────────────────
// Product/blog photos live in /public/demo-assets/<brand>/<file>. Renders the
// real image once it exists; falls back to a soft placeholder (optionally with
// an icon, e.g. a blog post's emoji) until then — nothing breaks in the
// meantime, it just looks a little plainer. Shared across any mockup or view
// that needs to show a photo — one implementation, no drift.

import { useState } from 'react';

export default function ProductImg({ src, alt, radius = 4, size = 1, aspect = '1', fallbackIcon = null }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div style={{
        width: '100%', aspectRatio: aspect, borderRadius: `${radius * size}px`,
        background: 'linear-gradient(135deg, #00000010, #00000004)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: fallbackIcon ? `${22 * size}px` : undefined,
      }}>
        {fallbackIcon}
      </div>
    );
  }
  return (
    <img src={src} alt={alt} onError={() => setFailed(true)} style={{
      width: '100%', aspectRatio: aspect, objectFit: 'cover',
      borderRadius: `${radius * size}px`, display: 'block',
    }} />
  );
}
