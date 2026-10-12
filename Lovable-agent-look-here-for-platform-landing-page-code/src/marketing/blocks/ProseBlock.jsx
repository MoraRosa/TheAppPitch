/**
 * ProseBlock -- Long-form text section.
 *
 * Block schema (migration 20260512000009 -- 'prose'):
 *   heading, eyebrow, body_markdown (required),
 *   max_width ("narrow" | "default" | "wide")
 *
 * The seeded body_markdown payloads are plain prose -- the staff CMS
 * will eventually push markdown through a sanitised pre-render path
 * (same posture as document body_html_cached). Until then, paragraph
 * splitting on blank lines is enough for the trust + about pages.
 *
 * @module marketing/blocks/ProseBlock
 */

import React from "react";
import styled from "styled-components";
import {
  Section,
  SectionInner,
  SectionHeading,
  splitParagraphs,
} from "./_section.js";

const Eyebrow = styled.p`
  font-size: var(--brand-fontSize-xs);
  font-weight: var(--brand-fontWeight-semibold);
  letter-spacing: var(--brand-letterSpacing-wide);
  text-transform: uppercase;
  color: var(--brand-color-primary600);
  margin: 0 0 var(--brand-space-2);
`;

const Body = styled.div`
  color: var(--brand-color-neutral700);
  font-size: var(--brand-fontSize-base);
  line-height: var(--brand-lineHeight-relaxed);

  p {
    margin: 0 0 var(--brand-space-4);
  }
  p:last-child {
    margin-bottom: 0;
  }
`;

export default function ProseBlock({ block }) {
  const maxWidth = ["narrow", "default", "wide"].includes(block.max_width)
    ? block.max_width
    : "default";
  const paragraphs = splitParagraphs(block.body_markdown);

  return (
    <Section>
      <SectionInner $max={maxWidth}>
        {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
        {block.heading ? (
          <SectionHeading>{block.heading}</SectionHeading>
        ) : null}
        <Body>
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </Body>
      </SectionInner>
    </Section>
  );
}
