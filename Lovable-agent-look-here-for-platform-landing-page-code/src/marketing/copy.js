/**
 * Static copy for the marketing surface (peakenterprise.ca). Mirrors the
 * staff app's features/cms/copy.js pattern so every user-visible string
 * in the marketing bundle has one home -- audit-friendly, translation-
 * ready, and keeps the JSX layer prop-driven.
 *
 * Scope today: docs section only. The legacy marketing surfaces
 * (DocumentList, DocumentDetail, MarketingFooterNav, route table
 * titles/intros, NotFound, etc.) still have inline strings and will be
 * migrated in a dedicated copy sweep -- see the Phase 4.X "marketing
 * copy data layer" roadmap entry. Adding more keys here is expected;
 * deleting the existing ones is a public-facing copy change.
 *
 * @module marketing/copy
 */

import { APP_METADATA } from "@theapp/config";

export const MARKETING_COPY = Object.freeze({
  docs: {
    sectionLabel: "Docs",
    sidebarNavLabel: "Documentation navigation",
    indexTitle: "Documentation",
    indexIntro:
      "Guides, references, and walkthroughs for getting the most out " +
      `of ${APP_METADATA.NAME}.`,
    emptyState: "No docs published yet.",
  },
});

export default MARKETING_COPY;
