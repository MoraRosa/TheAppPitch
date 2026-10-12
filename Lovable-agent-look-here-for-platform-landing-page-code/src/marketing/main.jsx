/**
 * Marketing Entry Point (peakenterprise.ca)
 *
 * Public, unauthenticated. This bundle MUST NOT import @theapp/api-client
 * or any other module that talks to authenticated endpoints -- the
 * marketing surface has zero auth surface area by design.
 *
 * Bootstrapped through vite-react-ssg: at build time the SSG runner
 * walks `routes`, executes loaders, and emits a static HTML file per
 * pre-renderable path. The `setup` callback runs both server-side
 * (during pre-render) and client-side (during hydration); the
 * isClient guard scopes brand var injection and the JSON-LD <script>
 * mount to the browser, where they belong.
 */

import { ViteReactSSG } from "vite-react-ssg";
import getStyledComponentsCollector from "./ssg/styledComponentsCollector.js";
import { routes } from "./routes.jsx";
import { mountJsonLdOrganization } from "./seo/jsonLdOrganization.js";

export const createRoot = ViteReactSSG(
  {
    routes,
    // Opt in to the v7 state-update transition wrapping so route
    // transitions are non-blocking (and to silence the React Router
    // future-flag warning we'd otherwise see every boot). All other
    // v7 flags stay default until we have a reason to flip them.
    future: { v7_startTransition: true },
  },
  ({ isClient }) => {
    if (isClient) {
      mountJsonLdOrganization();
    }
  },
  // styled-components style collector: gathers per-route component
  // styles during SSG and inlines them into <head>. Those rules consume
  // the --brand-* variables established by the platform-head-css plugin
  // (see vite.config.js), so the two together give the prerendered page
  // a complete, JS-free first paint. We use a local collector rather
  // than vite-react-ssg's built-in one because the built-in relies on
  // the framework's React 19 streaming render to populate the sheet,
  // which never happens; see ssg/styledComponentsCollector.js.
  { getStyleCollector: getStyledComponentsCollector },
);
