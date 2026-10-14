# Peak: investor materials rebuild plan (living document)

Handoff-ready: an agent (or you) can continue from this file without the chat history.
Last updated: October 2026. Update the status table and open questions at the end of every sprint.

## 0. Principles

- **One source of truth.** Every number, price, claim and source lives in `src/data/facts.js`. Slides, plan, financials, founder page and exports read from it. Never type a figure into a slide.
- **Living, not frozen.** The decks and plan grow with the business. Monthly routine: update `TRACTION_FACTS` and add a row to `MRR_TRACKER` in `facts.js`, run the build, push. Re-check `OPEN_QUESTIONS` at the same time.
- **Modelled is labelled.** Anything projected (unit economics, stage revenue, the $1M split) says "modelled" or "illustrative" on the slide.
- **Perfection over speed.** Work in stages. The demo deck (`demoSlides.js` and `demoVisuals.jsx`) is the quality bar for storytelling and visual polish; the investor deck is different in purpose (it proves a business) but must reach the same bar.
- **Delivery.** Each sprint ships as one terminal script (`bash peak-update-<name>.sh`) with the patch built in. It pulls, applies, builds and pushes to `main`. Test it against the live repo before handing it over.

## 1. Facts (confirmed by Hikmah)

- Product is at **MVP**. Live: storefront, cart and checkout, connected shipping, scheduling, Stripe Connect payments, transaction fees (0.5-1%), custom domains.
- First official user: **2 September 2026**. Today: **8 active users, 2 paying, $60 MRR** (subscriptions; fees tracked separately). 2 of 8 is an early signal, never a conversion rate.
- Plans (per month): **Free** (minimal storage), **Starter $30, Grow $49.99 (show $50), Pro $100**. Grow and Pro have a **3-day trial**.
- Themes: **4 storefront** (Soft Pink, Editorial, Brutalism, Axiom) + **3 admin** (Pink, Midnight Ledger, Bare). A 5th storefront theme (Soft Matter, claymorphism) is in progress. Every theme is a fully unique experience.
- Modules (plain names first): Storefront, Products, Orders, Payments, Shipping, Scheduling, Customers (Constellation), Costing (Pulse), Tasks (Compass), Email, Content. Compass and Email are shipped.
- Live sites for proof: circleofcarecounselling.com and huchflex-p340.peakenterprise.ca (both paying, **verbal consent to show their websites and maybe logos**), grolead.com (founder test account on a custom domain).
- Raising **$100,000 in grants + $1,000,000 from investors.** No grants named on slides. Zensurance is not pursued.
- **Stages are paying merchants:** Stage 1 = 40, Stage 2 = 400, Stage 3 = 4,000, then hire (marketing, branding).
- Grant use: **50% development, 30% marketing, 20% business setup** (paperwork, accounting, legal, insurance). The $1M split is an illustrative draft.
- Known weakness: no strong brand identity; a rename is planned. It belongs in the SWOT.
- Audience is non-technical: plain module names.
- The old waitlist ("15 beta merchants") is dead and removed everywhere.

## 2. Researched numbers

Full brief with sources: `docs/market-research.md`. Headlines:

- Canada: **1,079,188 small employer businesses (98.2%)**, ISED Key Small Business Statistics 2025; **3.48M** businesses with no employees (revenue above $30K), Statistics Canada, Dec 2024. Show them separately.
- Peak's industry group: **531,475** small employer businesses (an upper bound by industry). Stage 3 = 0.75% of it.
- US: 36.2M small businesses, about 30.4M with no employees (SBA).
- Global e-commerce platforms: **$9.07B (2025) to $16.5B (2030)**, one analyst estimate with caveats. Replaces the unsourced $14B.
- Benchmarks: LTV:CAC 3:1, SMB SaaS payback under 12 months; median pre-seed about $1M (Carta); seed investors typically look for $10K-$50K MRR.

## 3. Unit economics (modelled)

- ARPU today **$30**; illustrative 60/30/10 mix **$43**. At 5% monthly churn: LTV about **$600 / $860** (revenue basis).
- **CAC is not measured** (no paid acquisition). Targets, not claims: LTV:CAC of 3:1 or better, payback under 12 months.
- The old $1,580 LTV / $150 CAC / 10.5x came from a $79 ARPU no plan charges. Retired.

## 4. Stage ladder (paying merchants; modelled)

| Stage | MRR at $30 to $43 | ARR | Sign-ups needed at 10% / 20% / 30% |
|---|---|---|---|
| 40 | $1,200-$1,720 | $14.4K-$20.6K | 400 / 200 / 134 |
| 400 | $12,000-$17,200 | $144K-$206K | 4,000 / 2,000 / 1,334 |
| 4,000 | $120,000-$172,000 | $1.44M-$2.06M | 40,000 / 20,000 / 13,334 |

Sign-up rates are planning sensitivities, not measurements.

## 5. Wording that survives due diligence

"Shopify has no native production costing, so makers add a separate costing app and keep two systems in sync. Peak puts costing, inventory, storefront, bookings and customers in one database, so there is nothing to sync."

## 6. Sprint status and revised roadmap

| # | Sprint | Status |
|---|---|---|
| 1 | Truth pass: `facts.js`, retire stale claims, delete `plan-old.js` | Done |
| - | Market research: sourced Canada/US/global numbers | Done |
| 2 | Investor deck A: problem, solution, product proof, traction (content, demo components) | Done (content). Visual pass pending |
| 3 | Investor deck B: market, model, competition, roadmap climb, ask, team, closing QR | Done (content). Visual pass pending |
| 4 | **Business plan, grant-ready**: fill the gaps (3-year scenarios, simple financials for the first weeks of revenue), tidy the plan text, export it as a Word document for MNP, grant forms and lenders | **Next** |
| 5 | **Investor visual pass 1** (see section 7): slides 1, 4, 5, 9 | Planned |
| 6 | Financials page (live MRR tracker, stage ladder, unit economics, use of funds) + plan pages redesign, reusing the sprint 5 components | Planned |
| 7 | **Investor visual pass 2**: slides 6, 7, 10, 11, then a full-deck polish review | Planned |
| 8 | Exports and narration: regenerate PDF/PPTX, narration scripts for both decks, audio README, final stale-fact sweep and tests | Planned (last) |

Why this order: the business plan feeds real applications now (the FACE PBEP application, other grants, MNP if selected), so it moves first and does not depend on visuals. The visual passes decide the final look, so the Financials page reuses their components instead of being built twice. Exports and narration come last because they depend on the final visuals and story. Reorder freely; the one firm rule is "exports and narration last".

## 7. Investor visual overhaul

Goal: reach the demo deck's level of storytelling and polish, in a style that proves a business instead of showing a product. Each slide gets one story beat, one purposeful animation, and all data from `facts.js`.

| Slide | Today | Visual state |
|---|---|---|
| 1 Hook | old hook visual | Old: redo |
| 2 Problem | demo "flood" component | Demo quality |
| 3 Solution | demo module cards | Demo quality |
| 4 Differentiator | old two-column comparison | Old: redo ("two systems to sync" vs "one database") |
| 5 Market | plain concentric rings, correct numbers | Old: redo (rings fill with real numbers; the 0.75% Stage 3 slice) |
| 6 Model | plan cards + chart | Accurate, plain: pass 2 |
| 7 Traction | counters + live site cards | Accurate, plain: pass 2 (screenshots and logos when available) |
| 8 Roadmap | mountain climb | Demo quality |
| 9 Competition | small table | Old: redo (animated gap) |
| 10 Ask | two bar groups | Accurate, plain: pass 2 (money flowing into the stages) |
| 11 Team | founder card + hires | Accurate, plain: pass 2 |
| 12 Close | demo QR | Demo quality |

## 8. Open questions

- Does huchflex stay on its peakenterprise.ca subdomain or has it moved to its own domain?
- Screenshots and logos for the live sites (consent covers websites and maybe logos).
- Sole-operator split by industry (StatCan table 33-10-0765) and Alberta by industry (33-10-0764).
- Show the $9.07B global figure with its caveat, or drop it?
- Shopify market share and merchant counts from a primary source before use on the competition slide.
- The $1M use-of-funds split (illustrative).
- API endpoint and table counts (23+, 21+): re-count or drop (audience is non-technical).
- Slide order: team before the ask?
- Wording check: "Runs Lumina, a live e-commerce brand" on the team slide.
- Primary merchant survey to replace the business plan placeholders.

## 9. Notes to track (removed from the plan pages)

The plan pages no longer show "pending" notes. These items are tracked here instead and get added to the plan when the data exists.

- **Alberta market detail:** small employer businesses by industry (Statistics Canada table 33-10-0764) and digital adoption rates. The Alberta total (137,182 small employer businesses) is already in the plan.
- **Target market demographics:** age, income, occupation, current tool spend, buying habits. Needs a primary survey of local merchants.
- **Competitor detail:** market share, advertising spend, distribution. The Shopify share of about 26% came from analyst marketing material and needs a primary source before use.
- **3-year scenarios:** pessimistic and ideal cases. Can be modelled from the stage ladder once survey pricing validation is in.
- **FACE Propelling Black Entrepreneurship Program (Cohort 6):** application submitted 13 October 2026. Services (business plan, financial statements, tax filing, legal) are available if selected; the grant-ready business plan is the starting package.
