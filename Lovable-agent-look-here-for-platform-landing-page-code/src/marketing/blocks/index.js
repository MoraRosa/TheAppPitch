/**
 * Block registry -- maps the block `type` codes defined in
 * supabase/migrations/platform/20260512000007..09 to their React
 * components. The page renderer (BlockRenderer) consults this map to
 * resolve a block to a component; unknown types are skipped silently
 * so a forward-compatible CMS payload (a new block type added before
 * the marketing bundle ships) does not break the page render.
 *
 * Type codes mirror platform_content_block_types.code exactly.
 *
 * @module marketing/blocks
 */

import HeroBlock from "./HeroBlock.jsx";
import ValuePropGridBlock from "./ValuePropGridBlock.jsx";
import TrustStripBlock from "./TrustStripBlock.jsx";
import CtaBandBlock from "./CtaBandBlock.jsx";
import FaqBlock from "./FaqBlock.jsx";
import ProseBlock from "./ProseBlock.jsx";
import QuoteBlock from "./QuoteBlock.jsx";
import ComparisonTableBlock from "./ComparisonTableBlock.jsx";
import PricingCardGridMetaBlock from "./PricingCardGridMetaBlock.jsx";
import InquiryFormBlock from "./InquiryFormBlock.jsx";

export const BLOCK_REGISTRY = Object.freeze({
  hero: HeroBlock,
  value_prop_grid: ValuePropGridBlock,
  trust_strip: TrustStripBlock,
  cta_band: CtaBandBlock,
  faq: FaqBlock,
  prose: ProseBlock,
  quote: QuoteBlock,
  comparison_table: ComparisonTableBlock,
  pricing_card_grid_meta: PricingCardGridMetaBlock,
  inquiry_form: InquiryFormBlock,
});

export function resolveBlockComponent(type) {
  return BLOCK_REGISTRY[type] || null;
}
