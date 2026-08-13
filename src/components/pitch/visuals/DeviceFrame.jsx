// ─── DEVICE FRAME ──────────────────────────────────────────────────────────────
// Reusable "browser window" chrome that wraps the demo-deck mockups so they
// read as a real app surface rather than a floating card. Theme-driven, no
// fixed colors, so it adapts to whichever theme is active — including Showroom.

export default function DeviceFrame({ theme, url, size = 1, children, minHeight }) {
  const t = theme.colors;
  return (
    <div style={{
      width: '100%',
      border: `1px solid ${t.border}`,
      borderRadius: `${8 * size}px`,
      overflow: 'hidden',
      background: t.surface || t.bg,
      boxShadow: `0 ${8 * size}px ${24 * size}px -12px rgba(0,0,0,0.18)`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: `${8 * size}px`,
        padding: `${8 * size}px ${12 * size}px`,
        background: t.bgAlt, borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{ display: 'flex', gap: `${5 * size}px` }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: `${7 * size}px`, height: `${7 * size}px`, borderRadius: '50%',
              background: t.border,
            }} />
          ))}
        </div>
        {url && (
          <div style={{
            flex: 1, textAlign: 'center',
            fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`,
            color: t.textFaint, letterSpacing: '0.04em',
          }}>
            {url}
          </div>
        )}
      </div>
      <div style={{ padding: `${12 * size}px`, minHeight: minHeight ? `${minHeight * size}px` : undefined }}>
        {children}
      </div>
    </div>
  );
}
