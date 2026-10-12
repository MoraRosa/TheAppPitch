/**
 * QuoteBlock -- Pull quote / short testimonial.
 *
 * Block schema (migration 20260512000009 -- 'quote'):
 *   quote (required),
 *   attribution_name, attribution_title, attribution_company,
 *   logo_image_id (deferred until media refs land)
 *
 * @module marketing/blocks/QuoteBlock
 */

import React from "react";
import styled from "styled-components";
import { Section, SectionInner } from "./_section.js";

const Card = styled.figure`
  margin: 0;
  padding: var(--brand-space-8);
  border-left: var(--brand-borderWidth-emphasis) solid
    var(--brand-color-primary600);
  background: var(--brand-color-neutral50);
  border-radius: var(--brand-radius-md);
`;

const Quote = styled.blockquote`
  margin: 0;
  font-size: var(--brand-fontSize-xl);
  line-height: var(--brand-lineHeight-normal);
  color: var(--brand-color-neutral900);
  font-style: italic;
`;

const Attribution = styled.figcaption`
  margin-top: var(--brand-space-4);
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral500);
`;

export default function QuoteBlock({ block }) {
  if (!block.quote) return null;

  const parts = [
    block.attribution_name,
    block.attribution_title,
    block.attribution_company,
  ].filter(Boolean);

  return (
    <Section>
      <SectionInner $max="narrow">
        <Card>
          <Quote>&ldquo;{block.quote}&rdquo;</Quote>
          {parts.length > 0 ? (
            <Attribution>{parts.join(" -- ")}</Attribution>
          ) : null}
        </Card>
      </SectionInner>
    </Section>
  );
}
