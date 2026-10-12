/**
 * MarketingFooterNav -- Site-wide footer link block for peakenterprise.ca.
 * Mounted via BrandLayout's footerNav slot. Groups are hardcoded
 * because the labels are TheApp-platform routes (legal index, blog
 * index, etc.); per-row link content (e.g. individual legal pages)
 * comes from the CMS via the document list pages, not from a footer
 * config.
 *
 * @module marketing/MarketingFooterNav
 */

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Grid = styled.nav`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(var(--brand-size-gridColMinSm), 1fr)
  );
  gap: var(--brand-space-6);
  text-align: left;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-2);
`;

const GroupLabel = styled.h3`
  font-size: var(--brand-fontSize-xs);
  font-weight: var(--brand-fontWeight-semibold);
  letter-spacing: var(--brand-letterSpacing-wide);
  text-transform: uppercase;
  color: var(--brand-color-neutral500);
  margin: 0 0 var(--brand-space-1);
`;

const GroupLink = styled(Link)`
  color: var(--brand-color-neutral700);
  text-decoration: none;
  font-size: var(--brand-fontSize-sm);
  &:hover {
    color: var(--brand-color-primary600);
  }
`;

const groups = [
  {
    label: "Product",
    links: [
      { to: "/pricing", label: "Pricing" },
      { to: "/trust", label: "Trust" },
      { to: "/docs", label: "Docs" },
    ],
  },
  {
    label: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/blog", label: "Blog" },
      { to: "/changelog", label: "Changelog" },
    ],
  },
  {
    label: "Legal",
    links: [{ to: "/legal", label: "Legal" }],
  },
];

export default function MarketingFooterNav() {
  return (
    <Grid>
      {groups.map((g) => (
        <Group key={g.label}>
          <GroupLabel>{g.label}</GroupLabel>
          {g.links.map((l) => (
            <GroupLink key={l.to} to={l.to}>
              {l.label}
            </GroupLink>
          ))}
        </Group>
      ))}
    </Grid>
  );
}
