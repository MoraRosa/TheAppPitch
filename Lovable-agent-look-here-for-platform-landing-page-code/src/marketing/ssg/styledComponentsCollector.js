/**
 * styledComponentsCollector -- SSG style collector for styled-components
 * that works under React 19.
 *
 * Why this exists rather than using
 * `vite-react-ssg/style-collectors/styled-components`: the built-in
 * collector relies on `ServerStyleSheet.getStyleTags()` being populated
 * by vite-react-ssg's own render pass. Under React 19 that render pass
 * uses `renderToPipeableStream` (the streaming server API), and
 * styled-components v6's `ServerStyleSheet` only captures rules from the
 * synchronous `renderToString` / `renderToStaticMarkup` path. The result
 * is that the built-in collector emits ZERO `data-styled` rules into the
 * prerendered HTML, so every prerendered marketing page ships without its
 * component CSS and flashes unstyled until the client bundle hydrates.
 *
 * This collector implements the styled-components-documented extraction
 * (see styled-components "Server Side Rendering"): wrap the app with
 * `sheet.collectStyles(app)`, render it once synchronously with
 * `renderToString`, then read `sheet.getStyleTags()`. The extra render
 * happens only at build time (one pass per prerendered path) and its
 * HTML output is discarded -- vite-react-ssg still performs its own
 * render for the actual markup. We only borrow the synchronous pass to
 * make the sheet observe the rules.
 *
 * The collector conforms to the vite-react-ssg style-collector contract:
 *   collect(app)  -> returns the app wrapped so the framework's render
 *                    also feeds this sheet (harmless if the framework
 *                    streams; the captured tags come from our own pass).
 *   toString()    -> the collected `<style data-styled>` tags string.
 *   cleanup()     -> seals the sheet for garbage collection.
 *
 * @module marketing/ssg/styledComponentsCollector
 */

import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";

/**
 * Factory matching the `getStyleCollector` option shape expected by
 * ViteReactSSG. Returns a fresh collector per prerendered path so sheets
 * never leak rules across pages.
 *
 * @returns {Promise<{ collect: (app: import('react').ReactNode) => import('react').ReactNode, toString: () => string, cleanup: () => void }>}
 */
export default async function styledComponentsCollector() {
  const sheet = new ServerStyleSheet();
  let styleTags = "";

  return {
    collect(app) {
      const wrapped = sheet.collectStyles(app);
      // Synchronous pass purely to populate the sheet under React 19,
      // whose default server render (renderToPipeableStream) does not
      // feed ServerStyleSheet. The markup is intentionally discarded.
      renderToString(wrapped);
      styleTags = sheet.getStyleTags();
      return wrapped;
    },
    toString() {
      return styleTags;
    },
    cleanup() {
      sheet.seal();
    },
  };
}
