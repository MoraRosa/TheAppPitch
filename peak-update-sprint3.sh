#!/usr/bin/env bash
# Sprint 3 for TheAppPitch (investor deck B). One commit on top of your current main.
# Run from the repo root:   bash peak-update-sprint3.sh
set -euo pipefail
if [ -d .git/rebase-apply ]; then git am --abort; fi
git pull --ff-only
cat > /tmp/peak-sprint3.patch <<'PEAK_PATCH_END'
From 3e618ddb73f7a9698bc2db74100d015717a4f7aa Mon Sep 17 00:00:00 2001
From: Claude <claude@example.com>
Date: Mon, 12 Oct 2026 07:46:40 +0000
Subject: [PATCH] feat(deck): sprint 3 - investor deck B: mountain-climb
 roadmap, plans+model, funds split, team and closing QR slides; refresh export
 content

---
 src/components/pitch/visuals/demoVisuals.jsx  |  29 ++-
 .../pitch/visuals/investorVisuals.jsx         | 188 ++++++++----------
 src/data/decks/index.js                       |  10 +-
 src/data/founder.js                           |   2 +-
 src/data/slides.js                            |  24 ++-
 src/utils/generatePDF.js                      |  12 +-
 src/utils/generatePPTX.js                     |  20 +-
 7 files changed, 151 insertions(+), 134 deletions(-)

diff --git a/src/components/pitch/visuals/demoVisuals.jsx b/src/components/pitch/visuals/demoVisuals.jsx
index 35d9632..0ca5680 100644
--- a/src/components/pitch/visuals/demoVisuals.jsx
+++ b/src/components/pitch/visuals/demoVisuals.jsx
@@ -17,6 +17,7 @@ import { ProductDetailView, BlogPostView, ContactView, CONTACT_SEND_MS, Checkout
 import { useSlideEntered } from '../../../context/SlideTransitionContext.jsx';
 import { ScrollReveal, CountUp, Reveal } from '../motion.jsx';
 import { COMPANY, PRICING } from '../../../data/config.js';
+import { STAGE_TARGETS, ASK, TRACTION_FACTS } from '../../../data/facts.js';
 import { COMPETITOR_COST_STACK } from '../../../data/financials.js';
 import { EMBER_MOSS_BRAND, EMBER_MOSS_PRODUCTS, EMBER_MOSS_JOURNAL, EMBER_MOSS_TESTIMONIALS, EMBER_MOSS_FAQ, STOREFRONT_THEME_SWATCHES } from '../../../data/decks/emberMoss.js';
 
@@ -3109,7 +3110,7 @@ function WhyRetail({ theme, u, box, k, cursorRef, wrapRef }) {
 // (browsers won't let a script open a tab by itself); Enter opens it too.
 const LIVE_URL = 'https://peakenterprise.ca/';
 
-function MockupLiveDemo({ theme, size, paceMs = 22000 }) {
+function MockupLiveDemo({ theme, size, paceMs = 22000, names: namesProp, summitLabel, eyebrow, showAction = true }) {
   const t = theme.colors;
   const onAccent = theme.isLight ? '#fff' : t.bg;
   const slideEntered = useSlideEntered();
@@ -3127,7 +3128,7 @@ function MockupLiveDemo({ theme, size, paceMs = 22000 }) {
   const k = paceMs / 22000;
 
   // the trail: base, six waypoints, summit
-  const names = ['Business', 'Storefront', 'Customer', 'Checkout', 'Dashboard', 'Order'];
+  const names = namesProp || ['Business', 'Storefront', 'Customer', 'Checkout', 'Dashboard', 'Order'];
   const sides = ['r', 'l', 'r', 'l', 'r', 'l'];
   const trail = [[0.17, 0.88], [0.27, 0.75], [0.37, 0.64], [0.34, 0.53], [0.45, 0.43], [0.43, 0.33], [0.49, 0.23], [0.52, 0.14]].map(([x, y]) => pt(x, y));
   const travel = 1.1 * k, hold = 0.35 * k, t0 = 1.5 * k;
@@ -3168,7 +3169,7 @@ function MockupLiveDemo({ theme, size, paceMs = 22000 }) {
 
   // the cursor presses the live-site button once the summit is reached
   useEffect(() => {
-    if (!slideEntered) return undefined;
+    if (!slideEntered || !showAction) return undefined;
     let live = true;
     const isLive = () => live;
     let rel;
@@ -3184,7 +3185,7 @@ function MockupLiveDemo({ theme, size, paceMs = 22000 }) {
 
   // Enter opens the live site (a real key press is allowed to open a tab; a script is not)
   useEffect(() => {
-    if (!slideEntered) return undefined;
+    if (!slideEntered || !showAction) return undefined;
     const onKey = (e) => { if (e.key === 'Enter' && !e.repeat) window.open(LIVE_URL, '_blank', 'noopener,noreferrer'); };
     window.addEventListener('keydown', onKey);
     return () => window.removeEventListener('keydown', onKey);
@@ -3289,7 +3290,7 @@ function MockupLiveDemo({ theme, size, paceMs = 22000 }) {
             <motion.div initial={{ opacity: 0, y: 8 * u, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: tSummit + 0.3 }}
               style={{ position: 'absolute', left: apex[0], top: apex[1] - 44 * u, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: `${6 * u}px`, padding: `${4 * u}px ${12 * u}px`, borderRadius: '100px', background: t.accent, color: onAccent, boxShadow: `0 ${4 * u}px ${14 * u}px ${t.accent}66`, whiteSpace: 'nowrap', ...mono(8.5, onAccent, { fontWeight: 700 }) }}>
               <motion.span animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ width: `${6 * u}px`, height: `${6 * u}px`, borderRadius: '50%', background: '#3DDC84' }} />
-              {COMPANY.name} {'\u00B7'} live now
+              {summitLabel || <>{COMPANY.name} {'\u00B7'} live now</>}
             </motion.div>
 
             <motion.div initial={{ opacity: 0, scale: 0.3, y: 10 * u }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 12, delay: tSummit + 0.7 }}
@@ -3298,14 +3299,14 @@ function MockupLiveDemo({ theme, size, paceMs = 22000 }) {
             </motion.div>
 
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} style={{ position: 'absolute', left: 14 * u, top: 12 * u, ...mono(8, t.accent, { fontWeight: 700 }) }}>
-              From first idea to first order
+              {eyebrow || 'From first idea to first order'}
             </motion.div>
           </>
         )}
       </div>
 
       {/* ── the action strip: QR from the very first second, then the button ── */}
-      <div style={{ display: 'flex', alignItems: 'center', gap: `${16 * u}px`, flexShrink: 0 }}>
+      <div style={{ display: showAction ? 'flex' : 'none', alignItems: 'center', gap: `${16 * u}px`, flexShrink: 0 }}>
         {slideEntered && (
           <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.5 }}
             style={{ position: 'relative', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: `${5 * u}px`, padding: `${9 * u}px`, background: '#fff', borderRadius: `${12 * u}px`, border: `1px solid ${t.border}`, boxShadow: `0 ${6 * u}px ${18 * u}px rgba(0,0,0,0.12)` }}>
@@ -3350,6 +3351,20 @@ function MockupLiveDemo({ theme, size, paceMs = 22000 }) {
   );
 }
 
+// Investor deck roadmap: the same mountain climb, with the funding stages as waypoints and no QR strip.
+export function RoadmapClimb(props) {
+  const [s1, s2, s3] = STAGE_TARGETS;
+  const names = [
+    `Today \u00B7 ${TRACTION_FACTS.paidUsers} paying`,
+    `Grants \u00B7 $${ASK.grants / 1000}K`,
+    `Stage 1 \u00B7 ${s1.payingUsers.toLocaleString()}`,
+    `Stage 2 \u00B7 ${s2.payingUsers.toLocaleString()}`,
+    `Investment \u00B7 $${ASK.investment / 1e6}M`,
+    `Stage 3 \u00B7 ${s3.payingUsers.toLocaleString()}`,
+  ];
+  return <MockupLiveDemo {...props} names={names} summitLabel="Then we hire" eyebrow="Milestones, not dates" showAction={false} />;
+}
+
 export const DEMO_VISUALS = {
   welcome: MockupWelcome,
   problem: MockupProblem,
diff --git a/src/components/pitch/visuals/investorVisuals.jsx b/src/components/pitch/visuals/investorVisuals.jsx
index 9b6be84..2189237 100644
--- a/src/components/pitch/visuals/investorVisuals.jsx
+++ b/src/components/pitch/visuals/investorVisuals.jsx
@@ -4,7 +4,7 @@
 
 import React from 'react';
 import { COMPETITOR_COST_STACK, MERCHANT_GROWTH, FUNDING_BREAKDOWN_SMALL } from '../../../data/financials.js';
-import { COMPANY, COMPETITORS, TRACTION, MARKET } from '../../../data/config.js';
+import { COMPANY, COMPETITORS, TRACTION, MARKET, PRICING, FUNDING, FOUNDER_INFO } from '../../../data/config.js';
 import { LIVE_SITES, PRODUCT } from '../../../data/facts.js';
 import { CountUp } from '../motion.jsx';
 
@@ -217,57 +217,50 @@ function VisualMarket({ theme, size }) {
 // ── Model: MRR growth chart — fully responsive SVG ───────────────────────────
 function VisualModel({ theme, size }) {
   const t = theme.colors;
+  const plans = [
+    { name: 'Free',    price: '$0',            note: 'Minimal storage' },
+    { name: 'Starter', price: PRICING.starter, note: 'Per month' },
+    { name: 'Grow',    price: PRICING.growth,  note: `${PRICING.trialDays}-day trial` },
+    { name: 'Pro',     price: PRICING.pro,     note: `${PRICING.trialDays}-day trial` },
+  ];
   const points = MERCHANT_GROWTH;
   const maxMrr = Math.max(...points.map(p => p.mrr));
-  const VW = 200, VH = 90;
-  const pathD = points.map((p, i) => {
-    const x = (i / (points.length - 1)) * VW;
-    const y = VH - (p.mrr / maxMrr) * VH * 0.88;
-    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
-  }).join(' ');
-  const areaD = pathD + ` L ${VW} ${VH} L 0 ${VH} Z`;
-
+  const VW = 200, VH = 70;
+  const xy = (p, i) => [(i / (points.length - 1)) * VW, VH - (p.mrr / maxMrr) * VH * 0.88];
+  const pathD = points.map((p, i) => { const [x, y] = xy(p, i); return `${i === 0 ? 'M' : 'L'} ${x} ${y}`; }).join(' ');
+  const label = (txt, extra) => (
+    <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.12em', textTransform: 'uppercase', ...extra }}>{txt}</div>
+  );
   return (
-    <div style={{ width: '100%' }}>
-      <div style={{
-        fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`,
-        color: t.accent, letterSpacing: '0.12em',
-        marginBottom: `${8 * size}px`, textTransform: 'uppercase',
-      }}>
-        MRR Growth · 3 Years
+    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: `${10 * size}px` }}>
+      {label('Plans, per month')}
+      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: `${6 * size}px` }}>
+        {plans.map((p, i) => (
+          <div key={p.name} style={{ padding: `${8 * size}px ${6 * size}px`, background: t.bgAlt, border: `1px solid ${i === 0 ? t.border : t.accent}`, borderRadius: theme.space.radius || '2px', textAlign: 'center', animation: `fadeSlideIn 0.35s ease ${i * 0.08}s both` }}>
+            <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.name}</div>
+            <div style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${18 * size}px`, color: t.text, margin: `${3 * size}px 0` }}>{p.price}</div>
+            <div style={{ fontFamily: theme.fonts.body, fontSize: `${7.5 * size}px`, color: t.textMuted }}>{p.note}</div>
+          </div>
+        ))}
       </div>
-
-      <svg
-        width="100%" height={`${110 * size}px`}
-        viewBox={`0 0 ${VW} ${VH}`}
-        preserveAspectRatio="none"
-        style={{ display: 'block' }}
-      >
-        <defs>
-          <linearGradient id="mrrGradV" x1="0" y1="0" x2="0" y2="1">
-            <stop offset="0%" stopColor={t.accent} stopOpacity="0.3" />
-            <stop offset="100%" stopColor={t.accent} stopOpacity="0" />
-          </linearGradient>
-        </defs>
-        <path d={areaD} fill="url(#mrrGradV)" />
+      <div style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted }}>
+        Plus a platform fee ({PRICING.transactionFee}) on every sale through Stripe.
+      </div>
+      {label('Paying merchants and MRR by stage (modelled)', { marginTop: `${4 * size}px` })}
+      <svg width="100%" height={`${70 * size}px`} viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" style={{ display: 'block' }}>
+        <path d={pathD + ` L ${VW} ${VH} L 0 ${VH} Z`} fill={t.accent} fillOpacity="0.15" />
         <path d={pathD} fill="none" stroke={t.accent} strokeWidth="2" vectorEffect="non-scaling-stroke" />
-        {points.map((p, i) => {
-          const x = (i / (points.length - 1)) * VW;
-          const y = VH - (p.mrr / maxMrr) * VH * 0.88;
-          return <circle key={i} cx={x} cy={y} r="3" fill={t.accent} vectorEffect="non-scaling-stroke" />;
-        })}
+        {points.map((p, i) => { const [x, y] = xy(p, i); return <circle key={i} cx={x} cy={y} r="3" fill={t.accent} vectorEffect="non-scaling-stroke" />; })}
       </svg>
-
-      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: `${5 * size}px` }}>
-        {MERCHANT_GROWTH.map(p => p.short).map(y => (
-          <span key={y} style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textFaint, letterSpacing: '0.1em' }}>{y}</span>
+      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
+        {points.map(p => (
+          <span key={p.period} style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.06em', textAlign: 'center' }}>
+            {p.short}<br />{p.merchants.toLocaleString()}
+          </span>
         ))}
       </div>
-      <div style={{ marginTop: `${14 * size}px`, fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${22 * size}px`, color: t.text }}>
-        ${Math.round(points[points.length - 1].mrr / 1000)}K{' '}
-        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${9 * size}px`, color: t.accent }}>
-          MRR · Stage 3 (modelled)
-        </span>
+      <div style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted, lineHeight: 1.5 }}>
+        Stage 3 is about ${Math.round(points[points.length - 1].mrr / 1000)}K MRR at a $${PRICING.arpuMix} average plan. CAC is not measured yet: targets are LTV:CAC of 3:1 or better and payback inside 12 months.
       </div>
     </div>
   );
@@ -317,43 +310,6 @@ function VisualTraction({ theme, size }) {
 }
 
 // ── Roadmap: horizontal timeline ──────────────────────────────────────────────
-function VisualRoadmap({ theme, size }) {
-  const t = theme.colors;
-  const phases = [
-    { label: 'Now', items: ['Cart + Payments', 'BARE Theme', 'Beta Launch'] },
-    { label: '6 mo', items: ['Scheduling', '100+ merchants', 'First Hire'] },
-    { label: '18 mo', items: ['AI Agent API', 'US Entry', '500+ merchants'] },
-  ];
-  return (
-    <div style={{ width: '100%' }}>
-      {phases.map((phase, i) => (
-        <div key={i} style={{
-          display: 'grid', gridTemplateColumns: `${40 * size}px 1fr`,
-          gap: `${10 * size}px`, marginBottom: `${14 * size}px`,
-          animation: `fadeSlideIn 0.4s ease ${i * 0.12}s both`,
-        }}>
-          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
-            <div style={{
-              width: `${10 * size}px`, height: `${10 * size}px`,
-              borderRadius: '50%', background: i === 0 ? t.accent : t.border,
-              border: `2px solid ${t.accent}`, flexShrink: 0,
-            }} />
-            {i < phases.length - 1 && (
-              <div style={{ width: '1px', flex: 1, background: t.border, minHeight: `${20 * size}px` }} />
-            )}
-          </div>
-          <div>
-            <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.1em', marginBottom: '4px' }}>{phase.label}</div>
-            {phase.items.map((item, j) => (
-              <div key={j} style={{ fontFamily: theme.fonts.body, fontSize: `${10 * size}px`, color: t.textMuted, lineHeight: 1.6 }}>— {item}</div>
-            ))}
-          </div>
-        </div>
-      ))}
-    </div>
-  );
-}
-
 // ── Competition: comparison table ─────────────────────────────────────────────
 function VisualCompetition({ theme, size }) {
   const t = theme.colors;
@@ -379,7 +335,7 @@ function VisualCompetition({ theme, size }) {
         Platform Comparison
       </div>
       <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: `${4 * size}px 8px`, alignItems: 'center' }}>
-        {['', 'Store', 'CRM', 'Costing', 'Price'].map((h, i) => (
+        {['', 'Store', 'Customers', 'Costing', 'Price'].map((h, i) => (
           <div key={i} style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px' }}>{h}</div>
         ))}
         {rows.map((row, i) => (
@@ -410,35 +366,67 @@ function VisualCompetition({ theme, size }) {
 // ── Ask: funding breakdown ────────────────────────────────────────────────────
 function VisualAsk({ theme, size }) {
   const t = theme.colors;
-  const items = FUNDING_BREAKDOWN_SMALL;
-  const total = items.reduce((s, i) => s + i.amount, 0);
-  return (
-    <div style={{ width: '100%' }}>
-      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.12em', marginBottom: `${10 * size}px`, textTransform: 'uppercase' }}>
-        $10K Grant Breakdown
+  const Block = ({ title, total, items, delay }) => (
+    <div style={{ marginBottom: `${14 * size}px` }}>
+      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: `${6 * size}px` }}>
+        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{title}</span>
+        <span style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${20 * size}px`, color: t.text }}>{total}</span>
       </div>
       {items.map((item, i) => (
-        <div key={i} style={{ marginBottom: `${8 * size}px`, animation: `fadeSlideIn 0.4s ease ${i * 0.08}s both` }}>
+        <div key={item.label} style={{ marginBottom: `${6 * size}px`, animation: `fadeSlideIn 0.4s ease ${delay + i * 0.07}s both` }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
-            <span style={{ fontFamily: theme.fonts.body, fontSize: `${9 * size}px`, color: t.textMuted }}>{item.label}</span>
-            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${9 * size}px`, color: t.accent }}>${item.amount.toLocaleString()}</span>
+            <span style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted }}>{item.label}</span>
+            <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8.5 * size}px`, color: t.accent }}>{item.pct}%</span>
           </div>
-          <div style={{ height: `${5 * size}px`, background: t.bgAlt, borderRadius: '2px', overflow: 'hidden' }}>
-            <div style={{
-              height: '100%', width: `${(item.amount / total) * 100}%`,
-              background: t.accent, opacity: 0.8,
-            }} />
+          <div style={{ height: `${4 * size}px`, background: t.bgAlt, borderRadius: '2px', overflow: 'hidden' }}>
+            <div style={{ height: '100%', width: `${item.pct}%`, background: t.accent, opacity: 0.85 }} />
           </div>
         </div>
       ))}
-      <div style={{ marginTop: `${12 * size}px`, paddingTop: `${8 * size}px`, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between' }}>
-        <span style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.textFaint, letterSpacing: '0.1em' }}>TOTAL</span>
-        <span style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${20 * size}px`, color: t.accent }}>$10,000</span>
+    </div>
+  );
+  return (
+    <div style={{ width: '100%' }}>
+      <Block title="Grants: reach Stage 1 to 2" total={`$${(FUNDING.currentGrant.amount / 1000).toFixed(0)}K`} items={FUNDING.currentGrant.breakdown} delay={0} />
+      <Block title="Investment: reach Stage 3, first hires" total={`$${(FUNDING.seedRound.min / 1e6).toFixed(0)}M`} items={FUNDING.seedRound.breakdown} delay={0.3} />
+      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textFaint, letterSpacing: '0.08em' }}>
+        Investment split is an illustrative draft.
       </div>
     </div>
   );
 }
 
+// ── Team: founder + first hires ───────────────────────────────────────────
+function VisualTeam({ theme, size }) {
+  const t = theme.colors;
+  const initials = FOUNDER_INFO.name.split(' ').map(w => w[0]).join('').slice(0, 2);
+  const hires = ['Marketing', 'Branding (including the rename)', 'Engineering', 'Customer success'];
+  return (
+    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: `${12 * size}px` }}>
+      <div style={{ display: 'flex', alignItems: 'center', gap: `${12 * size}px`, padding: `${12 * size}px`, background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: theme.space.radius || '2px' }}>
+        <div style={{ width: `${44 * size}px`, height: `${44 * size}px`, borderRadius: '50%', background: t.accent, color: theme.isLight ? '#fff' : t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.display, fontWeight: 700, fontSize: `${16 * size}px`, flexShrink: 0 }}>{initials}</div>
+        <div>
+          <div style={{ fontFamily: theme.fonts.display, fontStyle: theme.type.displayStyle, fontWeight: theme.type.displayWeight, fontSize: `${16 * size}px`, color: t.text }}>{FOUNDER_INFO.name}</div>
+          <div style={{ fontFamily: theme.fonts.mono, fontSize: `${7.5 * size}px`, color: t.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{FOUNDER_INFO.title}</div>
+          <div style={{ fontFamily: theme.fonts.body, fontSize: `${8.5 * size}px`, color: t.textMuted }}>{FOUNDER_INFO.location}</div>
+        </div>
+      </div>
+      <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${5 * size}px` }}>
+        {['Built the whole platform, solo', 'Runs Lumina, a live e-commerce brand', `${TRACTION.paidUsers} paying merchants`].map(c => (
+          <span key={c} style={{ fontFamily: theme.fonts.mono, fontSize: `${7 * size}px`, color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: '999px', padding: `${3 * size}px ${8 * size}px` }}>{c}</span>
+        ))}
+      </div>
+      <div style={{ fontFamily: theme.fonts.mono, fontSize: `${8 * size}px`, color: t.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>First hires, after Stage 3</div>
+      {hires.map((h, i) => (
+        <div key={h} style={{ display: 'flex', alignItems: 'center', gap: `${8 * size}px`, animation: `fadeSlideIn 0.35s ease ${i * 0.1}s both` }}>
+          <span style={{ width: `${7 * size}px`, height: `${7 * size}px`, borderRadius: '50%', border: `2px solid ${t.accent}`, flexShrink: 0 }} />
+          <span style={{ fontFamily: theme.fonts.body, fontSize: `${9.5 * size}px`, color: t.text }}>{h}</span>
+        </div>
+      ))}
+    </div>
+  );
+}
+
 export const INVESTOR_VISUALS = {
   hook: VisualHook,
   problem: VisualProblem,
@@ -447,7 +435,7 @@ export const INVESTOR_VISUALS = {
   market: VisualMarket,
   model: VisualModel,
   traction: VisualTraction,
-  roadmap: VisualRoadmap,
+  team: VisualTeam,
   competition: VisualCompetition,
   ask: VisualAsk,
 };
diff --git a/src/data/decks/index.js b/src/data/decks/index.js
index 8a17c44..5ffdfe7 100644
--- a/src/data/decks/index.js
+++ b/src/data/decks/index.js
@@ -5,7 +5,7 @@
 import { INVESTOR_SLIDES } from './investorSlides.js';
 import { DEMO_SLIDES } from './demoSlides.js';
 import { INVESTOR_VISUALS } from '../../components/pitch/visuals/investorVisuals.jsx';
-import { DEMO_VISUALS } from '../../components/pitch/visuals/demoVisuals.jsx';
+import { DEMO_VISUALS, RoadmapClimb } from '../../components/pitch/visuals/demoVisuals.jsx';
 
 export const DECKS = {
   investor: {
@@ -15,7 +15,13 @@ export const DECKS = {
     audience: 'Investors & grant reviewers',
     slides: INVESTOR_SLIDES,
     // Sprint 2: problem + solution reuse the animated demo components (flood, module cards).
-    visuals: { ...INVESTOR_VISUALS, problem: DEMO_VISUALS.problem, solution: DEMO_VISUALS.platform },
+    visuals: {
+      ...INVESTOR_VISUALS,
+      problem: DEMO_VISUALS.problem,
+      solution: DEMO_VISUALS.platform,
+      roadmap: RoadmapClimb,            // Sprint 3: the funding stages as a mountain climb
+      close: DEMO_VISUALS['live-demo'], // Sprint 3: closing slide with the QR
+    },
     suggestedTheme: 'canadian',
     animated: true,
   },
diff --git a/src/data/founder.js b/src/data/founder.js
index 04be920..20f73ea 100644
--- a/src/data/founder.js
+++ b/src/data/founder.js
@@ -11,7 +11,7 @@ export const FOUNDER = {
   bio: `A full-stack developer with 5 years of experience building production software. ${COMPANY.name} was built entirely solo, from database architecture to deployment because the tools small business owners actually need did not exist in one place, so the decision was to build them.`,
   // ← REPLACE bio with your real story
   
-  whyUnique: `Building ${COMPANY.name} from scratch | multi-tenant database, dual auth systems, production costing engine, five isolated theme systems | demonstrates not just technical ability but product thinking. This is not a prototype. It is a platform.`,
+  whyUnique: `Building ${COMPANY.name} from scratch | multi-tenant database, dual auth systems, production costing engine, isolated theme systems | demonstrates not just technical ability but product thinking. This is not a prototype. It is a platform.`,
 
   skills: [
     "React 18/19 + TypeScript",
diff --git a/src/data/slides.js b/src/data/slides.js
index 2ba9975..66a345d 100644
--- a/src/data/slides.js
+++ b/src/data/slides.js
@@ -2,7 +2,7 @@
 // Theme-agnostic. All visual decisions live in /themes.
 // Every number comes from facts.js (via config.js). Do not type figures in here.
 
-import { COMPANY, TRACTION, PRICING, MARKET, FUNDING } from './config.js';
+import { COMPANY, TRACTION, PRICING, MARKET, FUNDING, FOUNDER_INFO } from './config.js';
 import { STAGE_TARGETS, WORDING } from './facts.js';
 
 const [S1, S2, S3] = STAGE_TARGETS.map(s => s.payingUsers.toLocaleString());
@@ -81,6 +81,7 @@ export const SLIDES = [
   {
     id: 8,
     slug: "roadmap",
+    autoMs: 26000,
     eyebrow: "Roadmap",
     headline: `${S1} paying merchants, then ${S2}, then ${S3}.`,
     body: `Stage 1 is ${S1} paying merchants. Stage 2 is ${S2}. Stage 3 is ${S3}, and then we hire for marketing and branding. Milestones are earned, not dated.`,
@@ -101,10 +102,29 @@ export const SLIDES = [
     slug: "ask",
     eyebrow: "The Ask",
     headline: `${fmtK(FUNDING.currentGrant.amount)} in grants and $${(FUNDING.seedRound.min / 1e6).toFixed(0)}M from investors to reach ${S3} paying merchants.`,
-    body: `Grants take us from ${S1} to ${S2} paying merchants: product hardening, infrastructure, onboarding, first marketing tests. The investment takes us to ${S3} and funds our first hires, including brand and the rename.`,
+    body: `Grants take us from ${S1} to ${S2} paying merchants: product hardening, infrastructure, onboarding, first marketing tests. The investment takes us to ${S3} and funds our first hires, including brand and the rename. Grants are 50% development, 30% marketing and 20% business setup: accounting, legal and insurance.`,
     speakerNote: "End with the human story. One developer, a live product, paying customers. The ask turns a working product into a company.",
     tag: "10",
   },
+  {
+    id: 11,
+    slug: "team",
+    eyebrow: "The Team",
+    headline: "One developer built it. The raise adds the first team.",
+    body: `${FOUNDER_INFO.name} designed, built and launched ${COMPANY.name} alone, and also runs Lumina, a live e-commerce brand. After Stage 3 we hire marketing and branding first, then engineering and customer success.`,
+    speakerNote: "Own the solo-founder risk out loud, then show the plan that removes it: the hires, in order.",
+    tag: "11",
+  },
+  {
+    id: 12,
+    slug: "close",
+    eyebrow: "Try it yourself",
+    headline: "Scan it. The platform is live.",
+    body: `${COMPANY.name} is live at ${COMPANY.url}. Scan the code or open the live site, and see the merchants already running on it.`,
+    autoMs: 22000,
+    speakerNote: "Leave the QR on screen. Let people scan while you take questions.",
+    tag: "12",
+  },
 ];
 
 export const SLIDE_COUNT = SLIDES.length;
diff --git a/src/utils/generatePDF.js b/src/utils/generatePDF.js
index 2275b46..46685fb 100644
--- a/src/utils/generatePDF.js
+++ b/src/utils/generatePDF.js
@@ -7,6 +7,7 @@ import { SLIDES } from '../data/slides.js';
 import { MILESTONES, UNIT_ECONOMICS, FUNDING_BREAKDOWN_SMALL, COMPETITOR_COST_STACK, MERCHANT_GROWTH } from '../data/financials.js';
 import { FOUNDER } from '../data/founder.js';
 import { COMPANY, COMPETITORS, FOUNDER_INFO, FUNDING, TRACTION, STAGES, MARKET } from '../data/config.js';
+import { PRODUCT } from '../data/facts.js';
 
 function hexToRgb(hex) {
   const c = (hex || '#888888').replace('#', '');
@@ -166,17 +167,10 @@ function drawRightModel(doc, x, y, w, h, theme) {
 
 function drawRightTraction(doc, x, y, w, h, theme) {
   const t = theme.colors;
-  const items = [
-    { label: 'Multi-tenant DB', pct: 100 },
-    { label: 'Dual Auth', pct: 100 },
-    { label: 'REST API 23+ endpoints', pct: 100 },
-    { label: 'Pulse (Production)', pct: 100 },
-    { label: 'Stripe Connect', pct: 35 },
-    { label: 'Beta Launch', pct: 20 },
-  ];
+  const items = PRODUCT.liveNow.map(label => ({ label, pct: 100 }));
   doc.setFontSize(6.5);
   doc.setTextColor(...hexToRgb(t.accent));
-  doc.text('BUILD PROGRESS', x, y + 5);
+  doc.text('LIVE NOW', x, y + 5);
   let cy = y + 11;
   items.forEach(item => {
     doc.setFontSize(7);
diff --git a/src/utils/generatePPTX.js b/src/utils/generatePPTX.js
index b886504..980dba4 100644
--- a/src/utils/generatePPTX.js
+++ b/src/utils/generatePPTX.js
@@ -5,7 +5,8 @@
 import PptxGenJS from 'pptxgenjs';
 import { SLIDES } from '../data/slides.js';
 import { COMPETITOR_COST_STACK, FUNDING_BREAKDOWN_SMALL, MERCHANT_GROWTH } from '../data/financials.js';
-import { COMPANY, COMPETITORS, FUNDING, MARKET } from '../data/config.js';
+import { COMPANY, COMPETITORS, FUNDING, MARKET, TRACTION, STAGES } from '../data/config.js';
+import { PRODUCT } from '../data/facts.js';
 
 export async function generatePitchDeckPPTX(theme) {
   const pptx = new PptxGenJS();
@@ -210,15 +211,8 @@ function addRightVisual(s, pptx, slide, rx, rw, H, accent, textMute, textFaint,
     }
 
     case 'traction': {
-      const items = [
-        { label: 'Multi-tenant DB', pct: 100 },
-        { label: 'Dual Auth', pct: 100 },
-        { label: 'REST API 23+ endpoints', pct: 100 },
-        { label: 'Pulse', pct: 100 },
-        { label: 'Stripe Connect', pct: 35 },
-        { label: 'Beta Launch', pct: 20 },
-      ];
-      s.addText('BUILD PROGRESS', { x: pad, y: contentY, w: rw - 0.3, h: 0.3, fontSize: 7, color: accent, fontFace: 'Arial', charSpacing: 2 });
+      const items = PRODUCT.liveNow.map(label => ({ label, pct: 100 }));
+      s.addText('LIVE NOW', { x: pad, y: contentY, w: rw - 0.3, h: 0.3, fontSize: 7, color: accent, fontFace: 'Arial', charSpacing: 2 });
       items.forEach((item, i) => {
         const y = contentY + 0.45 + i * 1.05;
         s.addText(item.label, { x: pad, y, w: rw * 0.7, h: 0.3, fontSize: 8, color: item.pct === 100 ? textMain : textMute, fontFace: 'Arial' });
@@ -231,9 +225,9 @@ function addRightVisual(s, pptx, slide, rx, rw, H, accent, textMute, textFaint,
 
     case 'roadmap': {
       const phases = [
-        { label: 'NOW', items: 'Cart + Payments · BARE Theme · Beta Launch' },
-        { label: '6 MO', items: 'Scheduling · 100+ merchants · First Hire' },
-        { label: '18 MO', items: 'AI Agent API · US Entry · 500+ merchants' },
+        { label: 'TODAY', items: `${TRACTION.activeUsers} active users · ${TRACTION.paidUsers} paying · $${TRACTION.mrr} MRR` },
+        { label: 'GRANTS', items: `$${FUNDING.currentGrant.amount / 1000}K → Stage 1 (${STAGES[0].payingUsers}) to Stage 2 (${STAGES[1].payingUsers}) paying merchants` },
+        { label: 'INVESTMENT', items: `$${FUNDING.seedRound.min / 1e6}M → Stage 3 (${STAGES[2].payingUsers.toLocaleString()} paying), then hire marketing and branding` },
       ];
       phases.forEach((phase, i) => {
         const y = contentY + i * 2.1;
-- 
2.43.0
PEAK_PATCH_END
git am --3way /tmp/peak-sprint3.patch
npm install --silent
npm run build
git push origin HEAD:main
echo "Done: Sprint 3 pushed."
