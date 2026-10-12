/**
 * TrustStripBlock -- Logos and trust points strip.
 *
 * Block schema (migration 20260512000007 -- 'trust_strip'):
 *   heading,
 *   logos: [{ image_id (required), label, href }]
 *   points: [{ icon, title, body }]
 *
 * The seeded landing/trust pages currently use `points` only; logo
 * rendering is a no-op until media references are resolved server-
 * side (Phase 5 staff CMS).
 *
 * @module marketing/blocks/TrustStripBlock
 */

import React from "react";
import styled from "styled-components";
import { Section, SectionInner, SectionHeading } from "./_section.js";

const PointsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(var(--brand-size-gridColMin), 1fr)
  );
  gap: var(--brand-space-6);
`;

const Point = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-2);
`;

const PointTitle = styled.h3`
  font-size: var(--brand-fontSize-sm);
  margin: 0;
  color: var(--brand-color-neutral900);
`;

const PointBody = styled.p`
  font-size: var(--brand-fontSize-sm);
  line-height: var(--brand-lineHeight-normal);
  margin: 0;
  color: var(--brand-color-neutral700);
`;

const IconLabel = styled.span`
  font-size: var(--brand-fontSize-xs);
  font-weight: var(--brand-fontWeight-semibold);
  letter-spacing: var(--brand-letterSpacing-wide);
  text-transform: uppercase;
  color: var(--brand-color-primary600);
`;

export default function TrustStripBlock({ block }) {
  const points = Array.isArray(block.points) ? block.points : [];

  if (points.length === 0) return null;

  return (
    <Section>
      <SectionInner $max="wide">
        {block.heading ? (
          <SectionHeading>{block.heading}</SectionHeading>
        ) : null}
        <PointsRow>
          {points.map((p, idx) => (
            <Point key={`${p.title || "point"}-${idx}`}>
              {p.icon ? <IconLabel>{p.icon}</IconLabel> : null}
              <PointTitle>{p.title}</PointTitle>
              {p.body ? <PointBody>{p.body}</PointBody> : null}
            </Point>
          ))}
        </PointsRow>
      </SectionInner>
    </Section>
  );
}
