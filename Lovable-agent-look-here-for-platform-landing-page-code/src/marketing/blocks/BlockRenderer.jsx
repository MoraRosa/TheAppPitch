/**
 * BlockRenderer -- Walks the `blocks` array from a published page
 * revision and renders each block via the registry. Each block JSONB
 * row is shaped { type, ...props }; we pass the whole block down as
 * `block` plus the page-level `refs` payload so data-driven blocks
 * (comparison_table, pricing_card_grid_meta) can resolve catalog data
 * without re-fetching on the client.
 *
 * Unknown block types are skipped silently. A future addition (e.g.
 * a `media_carousel` type added to the schema before this bundle is
 * redeployed) must not crash an in-flight page render.
 *
 * @module marketing/blocks/BlockRenderer
 */

import React from "react";
import { resolveBlockComponent } from "./index.js";

export default function BlockRenderer({ blocks, refs }) {
  const list = Array.isArray(blocks) ? blocks : [];

  return (
    <>
      {list.map((block, idx) => {
        if (!block || typeof block !== "object") return null;
        const Component = resolveBlockComponent(block.type);
        if (!Component) return null;
        return (
          <Component
            key={`${block.type}-${idx}`}
            block={block}
            refs={refs || {}}
          />
        );
      })}
    </>
  );
}
