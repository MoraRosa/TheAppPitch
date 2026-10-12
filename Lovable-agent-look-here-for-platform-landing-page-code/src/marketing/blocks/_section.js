/**
 * Shared block primitives -- a Section wrapper for vertical rhythm and
 * a simple paragraph splitter. Each block component composes these so
 * the page renderer gets consistent spacing without each block
 * re-deriving padding tokens.
 *
 * No logic, no fetches. Pure presentational primitives.
 *
 * @module marketing/blocks/_section
 */

import styled from "styled-components";

export const Section = styled.section`
  padding: var(--brand-space-12) 0;
  & + & {
    border-top: 1px solid var(--brand-color-neutral100);
  }
`;

export const SectionInner = styled.div`
  max-width: ${(props) =>
    props.$max === "narrow"
      ? "640px"
      : props.$max === "wide"
        ? "100%"
        : "900px"};
  margin: 0 auto;
`;

export const SectionHeading = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin: 0 0 var(--brand-space-3);
  color: var(--brand-color-neutral900);
`;

export const SectionIntro = styled.p`
  font-size: 1.05rem;
  color: var(--brand-color-neutral500);
  margin: 0 0 var(--brand-space-8);
`;

/**
 * Split a string on blank-line boundaries into paragraph chunks.
 * The CMS body_markdown / faq.answer / prose.body_markdown payloads
 * in the current seeds are plain text -- a real markdown pipeline
 * (sanitised + converted server-side and cached) is a Phase 2E item.
 */
export function splitParagraphs(text) {
  if (!text || typeof text !== "string") return [];
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
