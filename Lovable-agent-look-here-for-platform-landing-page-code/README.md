# @theapp/platform

Peak's own customer-facing surface. Two Vite entry points in one
package, served on two different production hosts.

## Entry points

| Entry          | Production host     | Bundle contents                                              | Auth                  |
| -------------- | ------------------- | ------------------------------------------------------------ | --------------------- |
| `index.html`   | `peakenterprise.ca` | Marketing, pricing, docs, blog, legal. No api-client import. | None                  |
| `account.html` | `peakenterprise.ca` | Signup, login, billing, business switcher, account settings. | `merchantAuth` plugin |

## Naming convention (read this before contributing)

The word "platform" means **two different things** depending on whether
you are looking at the backend or the frontend:

- **Backend** -- `platform_*` tables / `platformAuth` plugin / `services/core/platformAuth/`:
  - `platform_users` =&gt; Peak staff identity (used by `apps/staff`).
  - `platform_subscriptions`, `platform_plans`, `platform_invoices`,
    `platform_customers` =&gt; the merchant-as-customer relationship
    with Peak-as-seller (used by `apps/platform/account`).
- **Frontend** -- the directory `apps/platform`:
  - **Marketing** entry: Peak's public site. No auth.
  - **Account** entry: merchant account/billing. Calls `merchantAuth`,
    NEVER `platformAuth`.

Peak staff tooling lives in a separate frontend, `apps/staff`, which
is the only consumer of `platformAuth`. Keeping the staff bundle in a
separate package means none of its source ever ships to public users.

## Scripts

```
npm run dev        # vite --port 5173 (serves both index.html and account.html)
npm run build      # builds both entries into dist/
npm run test       # vitest
```

In dev, visit:

- `http://localhost:5173/` for the marketing entry
- `http://localhost:5173/account.html` for the account entry

In production, the reverse proxy maps each host to the right HTML file.

## Crawler files (`public/`)

- `robots.txt` -- allows the marketing surface and points at the sitemap.
- `sitemap.xml` -- enumerates the static top-level marketing routes
  (per-document URLs land with Phase 2E once vite-react-ssg can crawl
  the CMS at build time).
- `llms.txt` -- summary for AI crawlers / answer engines.

The Vite dev server and the marketing build both serve these from
`/robots.txt`, `/sitemap.xml`, `/llms.txt`. **Production proxy
requirement:** these files apply only to the marketing host
(`theapp.com`). The proxy MUST serve a different `robots.txt` for the
account host (`app.theapp.com`) that disallows all crawling, because
that surface is authenticated and must never be indexed regardless of
referer or session state.
