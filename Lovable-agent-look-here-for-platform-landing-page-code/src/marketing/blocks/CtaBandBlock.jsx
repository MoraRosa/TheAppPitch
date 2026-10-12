/**
 * CtaBandBlock -- Wide call-to-action band, usually near the page foot.
 *
 * Block schema (migration 20260512000007 -- 'cta_band'):
 *   headline (required), subheadline,
 *   primary_cta_label / primary_cta_href,
 *   secondary_cta_label / secondary_cta_href,
 *   tone ("neutral" | "accent" | "inverse")
 *
 * CTA hrefs run through resolveAccountHref so account-side paths
 * authored as "/register" or "/login" in the seed bounce to the
 * merchant account host (https://app.peakenterprise.ca in prod, /account
 * in dev). Marketing-host paths and absolute URLs pass through.
 *
 * @module marketing/blocks/CtaBandBlock
 */

import React from "react";
import styled, { css } from "styled-components";
import { Section, SectionInner } from "./_section.js";
import { resolveAccountHref } from "./_accountHref.js";

const toneStyles = {
  neutral: css`
    background: var(--brand-color-neutral50);
    color: var(--brand-color-neutral900);
  `,
  accent: css`
    background: var(--brand-color-primary50);
    color: var(--brand-color-primary900);
  `,
  inverse: css`
    background: var(--brand-color-neutral900);
    color: var(--brand-color-neutral0);
  `,
};

const Band = styled.div`
  ${(p) => toneStyles[p.$tone] || toneStyles.neutral}
  border-radius: var(--brand-radius-xl);
  padding: var(--brand-space-12) var(--brand-space-8);
  text-align: center;
`;

const Headline = styled.h2`
  font-size: var(--brand-fontSizeFluid-band);
  margin: 0 0 var(--brand-space-3);
`;

const Subheadline = styled.p`
  font-size: var(--brand-fontSize-base);
  margin: 0 0 var(--brand-space-6);
  opacity: 0.85;
`;

const Ctas = styled.div`
  display: flex;
  gap: var(--brand-space-3);
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryCta = styled.a`
  display: inline-block;
  padding: var(--brand-space-3) var(--brand-space-6);
  background: var(--brand-color-primary600);
  color: var(--brand-color-neutral0);
  font-weight: var(--brand-fontWeight-semibold);
  border-radius: var(--brand-radius-md);
  text-decoration: none;
  &:hover {
    background: var(--brand-color-primary700);
  }
`;

const SecondaryCta = styled.a`
  display: inline-block;
  padding: var(--brand-space-3) var(--brand-space-6);
  background: transparent;
  color: inherit;
  border: var(--brand-borderWidth-hairline) solid currentColor;
  border-radius: var(--brand-radius-md);
  text-decoration: none;
  font-weight: var(--brand-fontWeight-semibold);
  opacity: 0.85;
  &:hover {
    opacity: 1;
  }
`;

export default function CtaBandBlock({ block }) {
  const tone = ["neutral", "accent", "inverse"].includes(block.tone)
    ? block.tone
    : "neutral";

  return (
    <Section>
      <SectionInner $max="wide">
        <Band $tone={tone}>
          <Headline>{block.headline}</Headline>
          {block.subheadline ? (
            <Subheadline>{block.subheadline}</Subheadline>
          ) : null}
          {(block.primary_cta_label || block.secondary_cta_label) && (
            <Ctas>
              {block.primary_cta_label ? (
                <PrimaryCta
                  href={resolveAccountHref(block.primary_cta_href) || "#"}
                >
                  {block.primary_cta_label}
                </PrimaryCta>
              ) : null}
              {block.secondary_cta_label ? (
                <SecondaryCta
                  href={resolveAccountHref(block.secondary_cta_href) || "#"}
                >
                  {block.secondary_cta_label}
                </SecondaryCta>
              ) : null}
            </Ctas>
          )}
        </Band>
      </SectionInner>
    </Section>
  );
}
