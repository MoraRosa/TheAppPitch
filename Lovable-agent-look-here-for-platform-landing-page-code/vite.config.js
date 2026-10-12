import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { platformHeadCss } from "./src/shared/brand.js";

// Inline the platform head CSS (the :root brand-token block plus the
// base reset, generated from the single source of truth in
// src/shared/brand.js) into BOTH entries' static <head> at build/serve
// time. This is the sole mechanism that establishes the --brand-*
// variables the styled-components chrome consumes; there is no runtime
// JS injection, so the token table ships exactly once per document and
// first paint is correct with zero JavaScript (no FOUC).
//
// Both entries need it: the account entry (account.html) is a plain SPA
// shell, and the marketing entry (index.html) is prerendered by
// vite-react-ssg. vite-react-ssg reads the client-built dist/index.html
// as its page template, so the tag injected here at client-build time
// is present on every prerendered page.
const platformHeadCssPlugin = () => ({
  name: "platform-head-css",
  transformIndexHtml(html) {
    const tag = `<style>\n${platformHeadCss()}\n</style>`;
    return html.replace("</head>", `  ${tag}\n  </head>`);
  },
});

// Two-entry multi-page config:
//   index.html   -> marketing  (theapp.com)
//   account.html -> account    (app.theapp.com)
//
// Vite serves both during dev on a single port, and emits two distinct
// HTML files into dist/ that the production reverse proxy maps to the
// matching host. Sharing the package keeps brand tokens and chrome in
// one place; splitting the entries keeps the marketing bundle free of
// any auth surface area.
//
// Dev URL parity: the production reverse proxy maps app.theapp.com/*
// onto account.html so the account SPA is reached at clean paths like
// /login or /reset-password. To mirror that contract on a single Vite
// port, the dev server rewrites any navigation request under /account
// or /account/* to /account.html, and the account BrowserRouter mounts
// with basename="/account" in dev (basename="/" in prod). The result:
// the URL contract is identical in dev and prod minus the /account
// prefix, and no .html ever shows up in the address bar.
const accountDevMiddleware = () => ({
  name: "account-dev-rewrite",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url || "";
      const [pathname] = url.split("?");
      if (pathname === "/account" || pathname.startsWith("/account/")) {
        // Only rewrite navigation/HTML requests, not assets the SPA
        // emits with their own extensions (e.g. /account/foo.svg if
        // one ever existed). Asset requests carry an extension after
        // the last "/" segment; navigation requests do not.
        const lastSegment = pathname.split("/").pop() || "";
        if (!lastSegment.includes(".")) {
          req.url = "/account.html";
        }
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), accountDevMiddleware(), platformHeadCssPlugin()],
  // Load .env from workspace root (single source of truth for all apps)
  envDir: path.resolve(__dirname, "../../"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Workspace package aliases for proper bundling resolution
      "@theapp/shared/locale": path.resolve(
        __dirname,
        "../../packages/shared/src/contexts/LocaleContext.jsx",
      ),
      "@theapp/shared": path.resolve(__dirname, "../../packages/shared/src"),
      "@theapp/merchant-auth": path.resolve(
        __dirname,
        "../../packages/merchant-auth/src",
      ),
      "@theapp/utils": path.resolve(__dirname, "../../packages/utils/src"),
      "@theapp/api-client": path.resolve(
        __dirname,
        "../../packages/api-client/src",
      ),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        marketing: path.resolve(__dirname, "index.html"),
        account: path.resolve(__dirname, "account.html"),
      },
    },
  },
  // styled-components ships as CJS with a default export; when Vite's
  // SSR pipeline externalises it, the ESM interop wraps it such that
  // `styled.div` resolves to undefined and the SSR bundle crashes.
  // Bundling it into the SSR build instead makes Vite handle the
  // interop correctly. Same fix applies to any future CSS-in-JS dep.
  ssr: {
    noExternal: ["styled-components"],
  },
  // Read by vite-react-ssg only (the SPA `vite build` ignores this).
  // 'nested' writes /foo -> dist/foo/index.html (and /legal/tos ->
  // dist/legal/tos/index.html), which every static host serves at /foo
  // without rewrites. The default 'flat' would emit dist/foo.html and
  // force the production proxy to translate the URL.
  ssgOptions: {
    dirStyle: "nested",
    entry: "src/marketing/main.jsx",
    htmlEntry: "index.html",
  },
});
