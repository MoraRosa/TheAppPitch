/**
 * PageJsonLd -- Inline <script type="application/ld+json"> emitter.
 * Renders nothing visible; serialises the given payload into a script
 * tag in the current DOM position. Safe in both SSR (vite-react-ssg
 * prerender, where the markup is captured into the static HTML) and
 * CSR (rendered into the document on hydration).
 *
 * Google and other search engines accept JSON-LD anywhere in the
 * document (head or body); inlining at the call site keeps the data
 * colocated with the route that produced it and avoids a head-manager
 * dependency.
 *
 * Pure presentational shell: all schema selection and field mapping
 * lives in seo/jsonLdBuilders.js per Rule 32.
 *
 * @module marketing/seo/PageJsonLd
 */

import React from "react";

/**
 * @param {object} props
 * @param {object|null} props.payload  schema.org JSON-LD object, or null
 *   to render nothing (e.g. when a builder returned null because the
 *   document was missing required fields).
 */
export default function PageJsonLd({ payload }) {
  if (!payload) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
