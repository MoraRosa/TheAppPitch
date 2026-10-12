/**
 * FaqBlock -- Question / answer list rendered as native <details> so
 * collapse/expand works without JS and the marketing bundle stays
 * stateless. Answers are plain text in the current seeds; a real
 * markdown pipeline lands with Phase 2E.
 *
 * Block schema (migration 20260512000008 -- 'faq'):
 *   heading, intro,
 *   items: [{ question, answer }]
 *
 * @module marketing/blocks/FaqBlock
 */

import React from "react";
import styled from "styled-components";
import {
  Section,
  SectionInner,
  SectionHeading,
  SectionIntro,
  splitParagraphs,
} from "./_section.js";

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-3);
`;

const Item = styled.details`
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral200);
  border-radius: var(--brand-radius-md);
  padding: var(--brand-space-3) var(--brand-space-4);
  background: var(--brand-color-neutral0);

  &[open] {
    background: var(--brand-color-neutral50);
  }
`;

const Question = styled.summary`
  font-weight: var(--brand-fontWeight-semibold);
  font-size: var(--brand-fontSize-base);
  color: var(--brand-color-neutral900);
  cursor: pointer;
  list-style: none;
  &::-webkit-details-marker {
    display: none;
  }
  &::before {
    content: "+ ";
    color: var(--brand-color-primary600);
    font-weight: var(--brand-fontWeight-bold);
  }
  details[open] > &::before {
    content: "- ";
  }
`;

const Answer = styled.div`
  margin-top: var(--brand-space-3);
  color: var(--brand-color-neutral700);
  font-size: var(--brand-fontSize-sm);
  line-height: var(--brand-lineHeight-normal);

  p {
    margin: 0 0 var(--brand-space-2);
  }
  p:last-child {
    margin-bottom: 0;
  }
`;

export default function FaqBlock({ block }) {
  const items = Array.isArray(block.items) ? block.items : [];

  return (
    <Section>
      <SectionInner $max="default">
        {block.heading ? (
          <SectionHeading>{block.heading}</SectionHeading>
        ) : null}
        {block.intro ? <SectionIntro>{block.intro}</SectionIntro> : null}
        <List>
          {items.map((item, idx) => (
            <Item key={`${idx}-${item.question?.slice(0, 24) || idx}`}>
              <Question>{item.question}</Question>
              <Answer>
                {splitParagraphs(item.answer).map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </Answer>
            </Item>
          ))}
        </List>
      </SectionInner>
    </Section>
  );
}
