/**
 * PricingCardGridMetaBlock -- Tier cards driven by the live catalog.
 *
 * Block schema (migration 20260512000008 -- 'pricing_card_grid_meta'):
 *   heading, intro, footnote,
 *   currency_label, interval_label, monthly_label, annual_label,
 *   annual_discount_note,
 *   cta_label   (default CTA copy applied to every sellable card),
 *   cta_labels  (optional map: plan code -> CTA copy override),
 *   enterprise_card: { name, description, cta_label, cta_href }
 *
 * The block carries copy ONLY. Cards render from refs.plans (delivered
 * by hydrateBlockRefs server-side). A plan with no rows in
 * platform_plan_prices (enterprise, in the current seed) is excluded
 * from the regular grid -- the hand-authored enterprise_card slot
 * handles that tier with its own CTA. This is the no-hardcoding rule
 * applied: nothing in this component refers to "enterprise" by code.
 *
 * Each sellable card renders a CTA that bounces to the account host's
 * /register surface with the chosen plan/price intent carried in query
 * params. Same cross-host pattern as MarketingLayout's "Sign in" link:
 * absolute URL to https://app.peakenterprise.ca in prod, /account-prefixed
 * relative path in dev (where both SPAs share one Vite port). The
 * register flow preserves the params through verify-email and
 * select-business so the resulting checkout session targets the
 * intended price row without a second tier picker.
 *
 * CTA copy resolves in priority order: block.cta_labels[plan.code] ->
 * block.cta_label -> "Get started". Staff edit the per-plan map in
 * the CMS to tune persuasive copy per tier (Starter "Start small",
 * Pro "Go pro", etc.) without code changes; unknown plan codes fall
 * through cleanly to the default.
 *
 * @module marketing/blocks/PricingCardGridMetaBlock
 */

import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  Section,
  SectionInner,
  SectionHeading,
  SectionIntro,
} from "./_section.js";
import { platformAccountUrl } from "@theapp/utils/platformUrl";

const Toggles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--brand-space-6);
  justify-content: center;
  margin-bottom: var(--brand-space-8);
`;

const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--brand-space-2);
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral700);
`;

const ToggleLabel = styled.span`
  text-transform: uppercase;
  font-size: var(--brand-fontSize-xs);
  letter-spacing: var(--brand-letterSpacing-wide);
  color: var(--brand-color-neutral500);
`;

const ToggleButton = styled.button`
  padding: var(--brand-space-1) var(--brand-space-3);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral200);
  background: ${(p) =>
    p.$active
      ? "var(--brand-color-primary600)"
      : "var(--brand-color-neutral0)"};
  color: ${(p) =>
    p.$active
      ? "var(--brand-color-neutral0)"
      : "var(--brand-color-neutral700)"};
  border-radius: var(--brand-radius-sm);
  font-weight: var(--brand-fontWeight-semibold);
  cursor: pointer;
  font-size: var(--brand-fontSize-sm);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(var(--brand-size-gridColMin), 1fr)
  );
  gap: var(--brand-space-4);
`;

const Card = styled.article`
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral200);
  border-radius: var(--brand-radius-xl);
  padding: var(--brand-space-6);
  background: var(--brand-color-neutral0);
  box-shadow: var(--brand-shadow-card);
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-3);
  transition:
    transform var(--brand-motion-base) var(--brand-motion-ease),
    box-shadow var(--brand-motion-base) var(--brand-motion-ease),
    border-color var(--brand-motion-base) var(--brand-motion-ease);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--brand-shadow-lg);
    border-color: var(--brand-color-primary100);
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;

const CardName = styled.h3`
  margin: 0;
  font-size: var(--brand-fontSize-base);
  color: var(--brand-color-neutral900);
`;

// eslint-disable-next-line no-restricted-syntax -- Styled component for price display (not a money value variable)
const CardPrice = styled.div`
  font-size: var(--brand-fontSize-2xl);
  font-weight: var(--brand-fontWeight-bold);
  color: var(--brand-color-neutral900);
`;

const CardSub = styled.div`
  font-size: var(--brand-fontSize-xs);
  color: var(--brand-color-neutral500);
`;

const CardDesc = styled.p`
  margin: 0;
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral700);
  line-height: var(--brand-lineHeight-normal);
`;

const CardCta = styled.a`
  display: inline-block;
  margin-top: auto;
  padding: var(--brand-space-2) var(--brand-space-4);
  background: var(--brand-color-primary600);
  color: var(--brand-color-onPrimary);
  text-align: center;
  border-radius: var(--brand-radius-md);
  text-decoration: none;
  font-weight: var(--brand-fontWeight-semibold);
  font-size: var(--brand-fontSize-sm);
  transition: background var(--brand-motion-fast) var(--brand-motion-ease);
  &:hover {
    background: var(--brand-color-primary700);
  }
`;

const Note = styled.p`
  text-align: center;
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral500);
  margin: var(--brand-space-6) 0 0;
`;

function formatAmount(cents, currency) {
  if (cents == null) return null;
  const major = (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
    maximumFractionDigits: 0,
  });
  return major;
}

function buildIntentHref(plan, price) {
  const params = new URLSearchParams({ plan: plan.code });
  if (price?.id) params.set("price", price.id);
  if (price?.interval) params.set("interval", price.interval);
  if (price?.currency) params.set("currency", price.currency);
  return platformAccountUrl(`/register?${params.toString()}`);
}

function resolveCtaLabel(block, planCode) {
  const overrides =
    block && typeof block.cta_labels === "object" && block.cta_labels
      ? block.cta_labels
      : null;
  const override = overrides ? overrides[planCode] : null;
  if (typeof override === "string" && override.trim()) return override;
  if (typeof block?.cta_label === "string" && block.cta_label.trim()) {
    return block.cta_label;
  }
  return "Get started";
}

export default function PricingCardGridMetaBlock({ block, refs }) {
  const sellable = useMemo(() => {
    const allPlans = Array.isArray(refs?.plans) ? refs.plans : [];
    return allPlans
      .filter((p) => Array.isArray(p.prices) && p.prices.length > 0)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }, [refs?.plans]);

  const currencies = useMemo(() => {
    const set = new Set();
    for (const p of sellable) for (const pr of p.prices) set.add(pr.currency);
    return Array.from(set).sort();
  }, [sellable]);

  const intervals = useMemo(() => {
    const set = new Set();
    for (const p of sellable) for (const pr of p.prices) set.add(pr.interval);
    return Array.from(set);
  }, [sellable]);

  const [currency, setCurrency] = useState(currencies[0] || "");
  const [interval, setInterval] = useState(intervals[0] || "");

  const monthlyLabel = block.monthly_label || "Monthly";
  const annualLabel = block.annual_label || "Annual";
  const intervalLabelFor = (i) =>
    i === "month" ? monthlyLabel : i === "year" ? annualLabel : i;

  return (
    <Section>
      <SectionInner $max="wide">
        {block.heading ? (
          <SectionHeading>{block.heading}</SectionHeading>
        ) : null}
        {block.intro ? <SectionIntro>{block.intro}</SectionIntro> : null}

        {(currencies.length > 1 || intervals.length > 1) && (
          <Toggles>
            {currencies.length > 1 && (
              <ToggleGroup>
                {block.currency_label ? (
                  <ToggleLabel>{block.currency_label}</ToggleLabel>
                ) : null}
                {currencies.map((c) => (
                  <ToggleButton
                    key={c}
                    type="button"
                    $active={c === currency}
                    onClick={() => setCurrency(c)}
                  >
                    {c.toUpperCase()}
                  </ToggleButton>
                ))}
              </ToggleGroup>
            )}
            {intervals.length > 1 && (
              <ToggleGroup>
                {block.interval_label ? (
                  <ToggleLabel>{block.interval_label}</ToggleLabel>
                ) : null}
                {intervals.map((i) => (
                  <ToggleButton
                    key={i}
                    type="button"
                    $active={i === interval}
                    onClick={() => setInterval(i)}
                  >
                    {intervalLabelFor(i)}
                  </ToggleButton>
                ))}
              </ToggleGroup>
            )}
          </Toggles>
        )}

        <Grid>
          {sellable.map((plan) => {
            const price = plan.prices.find(
              (pr) => pr.currency === currency && pr.interval === interval,
            );
            return (
              <Card key={plan.code}>
                <CardName>{plan.name}</CardName>
                {price ? (
                  <>
                    <CardPrice>
                      {formatAmount(price.unit_amount_minor, price.currency)}
                    </CardPrice>
                    <CardSub>per {price.interval}</CardSub>
                    <CardCta
                      href={buildIntentHref(plan, price)}
                      data-testid={`pricing-cta-${plan.code}`}
                    >
                      {resolveCtaLabel(block, plan.code)}
                    </CardCta>
                  </>
                ) : (
                  <CardSub>{"\u2014"}</CardSub>
                )}
              </Card>
            );
          })}
          {block.enterprise_card ? (
            <Card>
              <CardName>{block.enterprise_card.name}</CardName>
              <CardDesc>{block.enterprise_card.description}</CardDesc>
              {block.enterprise_card.cta_label ? (
                <CardCta href={block.enterprise_card.cta_href || "#"}>
                  {block.enterprise_card.cta_label}
                </CardCta>
              ) : null}
            </Card>
          ) : null}
        </Grid>

        {interval === "year" && block.annual_discount_note ? (
          <Note>{block.annual_discount_note}</Note>
        ) : null}
        {block.footnote ? <Note>{block.footnote}</Note> : null}
      </SectionInner>
    </Section>
  );
}
