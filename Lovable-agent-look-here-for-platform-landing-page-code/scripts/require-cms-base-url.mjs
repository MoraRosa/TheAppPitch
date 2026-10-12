/**
 * require-cms-base-url -- Pre-build guard for the strict marketing
 * SSG path.
 *
 * The default `pnpm build` in apps/platform runs in soft mode when
 * CMS_SSG_BASE_URL is unset (loaders return null, the verifier checks
 * shells only). That is the right local-dev behaviour but is the wrong
 * default for a deploy: a missing env var would silently ship empty
 * marketing pages.
 *
 * `pnpm build:strict` (and the matching root script) prepend this
 * guard so operators get a fast, unambiguous failure before the SSG
 * spins up. Wire this into any deploy pipeline that must NEVER ship
 * shells.
 *
 * @module scripts/require-cms-base-url
 */

const v = process.env.CMS_SSG_BASE_URL;
if (!v || typeof v !== "string" || v.trim() === "") {
  console.error(
    "require-cms-base-url: CMS_SSG_BASE_URL is not set.\n" +
      "  Strict marketing builds require a reachable CMS origin so the\n" +
      "  SSG loaders can fetch real content. Either:\n" +
      "    - set CMS_SSG_BASE_URL=https://api.theapp.com (or your env's\n" +
      "      backend origin) and re-run, or\n" +
      "    - run `pnpm build` (no :strict) to emit shells in soft mode.",
  );
  process.exit(2);
}
console.log(`require-cms-base-url: ok (CMS_SSG_BASE_URL=${v})`);
