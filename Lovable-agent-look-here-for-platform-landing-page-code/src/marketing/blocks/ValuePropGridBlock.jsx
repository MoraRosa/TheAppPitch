/**
 * ValuePropGridBlock -- 2 / 3 / 4 column grid of value props.
 *
 * Block schema (migration 20260512000007 -- 'value_prop_grid'):
 *   heading, intro, columns (2 | 3 | 4),
 *   items: [{ icon, title, body }]
 *
 * The icon string is a lookup key the staff CMS will eventually wire
 * into an SVG sprite; until that lands we render the raw key as a
 * label only when it would otherwise leave a blank visual cue. The
 * absence of a real icon sprite is tracked in the Phase 2E follow-on
 * (a11y + visual polish pass).
 *
 * @module marketing/blocks/ValuePropGridBlock
 */

import React from "react";
import styled from "styled-components";
import { media } from "../../shared/brand.js";
import {
  Section,
  SectionInner,
  SectionHeading,
  SectionIntro,
} from "./_section.js";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$columns}, minmax(0, 1fr));
  gap: var(--brand-space-6);
  ${media.down.md} {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.article`
  background: var(--brand-color-neutral0);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral100);
  border-radius: var(--brand-radius-xl);
  padding: var(--brand-space-6);
  box-shadow: var(--brand-shadow-card);
  transition:
    transform var(--brand-motion-base) var(--brand-motion-ease),
    box-shadow var(--brand-motion-base) var(--brand-motion-ease);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--brand-shadow-lg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;

const ItemTitle = styled.h3`
  font-size: var(--brand-fontSize-base);
  margin: 0 0 var(--brand-space-2);
  color: var(--brand-color-neutral900);
`;

const ItemBody = styled.p`
  font-size: var(--brand-fontSize-sm);
  line-height: var(--brand-lineHeight-normal);
  color: var(--brand-color-neutral700);
  margin: 0;
`;

const IconBadge = styled.span`
  display: inline-block;
  font-size: var(--brand-fontSize-xs);
  font-weight: var(--brand-fontWeight-semibold);
  letter-spacing: var(--brand-letterSpacing-wide);
  text-transform: uppercase;
  color: var(--brand-color-primary600);
  margin-bottom: var(--brand-space-2);
`;

export default function ValuePropGridBlock({ block }) {
  const items = Array.isArray(block.items) ? block.items : [];
  const columns = [2, 3, 4].includes(block.columns) ? block.columns : 3;

  return (
    <Section>
      <SectionInner $max="wide">
        {block.heading ? (
          <SectionHeading>{block.heading}</SectionHeading>
        ) : null}
        {block.intro ? <SectionIntro>{block.intro}</SectionIntro> : null}
        <Grid $columns={columns}>
          {items.map((item, idx) => (
            <Item key={`${item.title || "item"}-${idx}`}>
              {item.icon ? <IconBadge>{item.icon}</IconBadge> : null}
              <ItemTitle>{item.title}</ItemTitle>
              {item.body ? <ItemBody>{item.body}</ItemBody> : null}
            </Item>
          ))}
        </Grid>
      </SectionInner>
    </Section>
  );
}
