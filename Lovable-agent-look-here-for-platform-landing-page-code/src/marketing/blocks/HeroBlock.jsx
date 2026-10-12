/**
 * HeroBlock -- Top-of-page banner block.
 *
 * Block schema (see migration 20260512000007 -- 'hero'):
 *   eyebrow, headline (required), subheadline,
 *   primary_cta_label / primary_cta_href,
 *   secondary_cta_label / secondary_cta_href,
 *   alignment ("left" | "center"), image_id (not yet rendered)
 *
 * CTA hrefs run through resolveAccountHref so account-side paths
 * authored as "/register" or "/login" in the seed bounce to the
 * merchant account host (https://app.peakenterprise.ca in prod, /account
 * in dev). Marketing-host paths and absolute URLs pass through.
 *
 * @module marketing/blocks/HeroBlock
 */

import React from "react";
import styled from "styled-components";
import { Section, SectionInner } from "./_section.js";
import { resolveAccountHref } from "./_accountHref.js";

const Eyebrow = styled.p`
  font-size: var(--brand-fontSize-sm);
  font-weight: var(--brand-fontWeight-semibold);
  letter-spacing: var(--brand-letterSpacing-wide);
  text-transform: uppercase;
  color: var(--brand-color-primary600);
  margin: 0 0 var(--brand-space-3);
`;

const Headline = styled.h1`
  font-size: var(--brand-fontSizeFluid-display);
  line-height: var(--brand-lineHeight-tight);
  margin: 0 0 var(--brand-space-4);
  color: var(--brand-color-neutral900);
`;

const Subheadline = styled.p`
  font-size: var(--brand-fontSize-base);
  line-height: var(--brand-lineHeight-normal);
  color: var(--brand-color-neutral500);
  margin: 0 0 var(--brand-space-8);
  max-width: var(--brand-size-panelMax);
`;

const Ctas = styled.div`
  display: flex;
  gap: var(--brand-space-3);
  flex-wrap: wrap;
`;

const PrimaryCta = styled.a`
  display: inline-block;
  padding: var(--brand-space-3) var(--brand-space-6);
  background: var(--brand-color-primary600);
  color: var(--brand-color-onPrimary);
  font-weight: var(--brand-fontWeight-semibold);
  border-radius: var(--brand-radius-md);
  box-shadow: var(--brand-shadow-sm);
  text-decoration: none;
  transition:
    background var(--brand-motion-fast) var(--brand-motion-ease),
    transform var(--brand-motion-fast) var(--brand-motion-ease),
    box-shadow var(--brand-motion-fast) var(--brand-motion-ease);

  &:hover {
    background: var(--brand-color-primary700);
    transform: translateY(-1px);
    box-shadow: var(--brand-shadow-md);
  }
  &:active {
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;

const SecondaryCta = styled.a`
  display: inline-block;
  padding: var(--brand-space-3) var(--brand-space-6);
  background: transparent;
  color: var(--brand-color-neutral900);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral300);
  border-radius: var(--brand-radius-md);
  text-decoration: none;
  font-weight: var(--brand-fontWeight-semibold);
  transition:
    border-color var(--brand-motion-fast) var(--brand-motion-ease),
    background var(--brand-motion-fast) var(--brand-motion-ease);

  &:hover {
    border-color: var(--brand-color-primary500);
    background: var(--brand-color-primary50);
  }
`;

export default function HeroBlock({ block }) {
  const align = block.alignment === "center" ? "center" : "left";
  const ctasStyle = align === "center" ? { justifyContent: "center" } : null;
  const innerStyle = { textAlign: align };
  const subStyle =
    align === "center" ? { marginLeft: "auto", marginRight: "auto" } : null;

  return (
    <Section>
      <SectionInner $max="wide" style={innerStyle}>
        {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
        <Headline>{block.headline}</Headline>
        {block.subheadline ? (
          <Subheadline style={subStyle}>{block.subheadline}</Subheadline>
        ) : null}
        {(block.primary_cta_label || block.secondary_cta_label) && (
          <Ctas style={ctasStyle}>
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
      </SectionInner>
    </Section>
  );
}
