/**
 * DocsLayout -- Two-column shell for the /docs section. Renders a
 * sticky sidebar table of contents (sourced from the published docs
 * list) on the left and the matched child route via <Outlet /> on the
 * right. Used by both the /docs index and /docs/:slug detail routes
 * so the TOC stays visible during in-section navigation.
 *
 * The TOC reads useLoaderData() because this component IS the parent
 * route element -- the loader on the parent route is the docs list
 * call. Child routes (DocsIndex, DocumentDetail) get parent data via
 * useRouteLoaderData("docs-section") when they need it.
 *
 * On narrow viewports the sidebar collapses above the main content,
 * keeping the same DOM order so screen readers and keyboard users hit
 * the section nav first.
 *
 * @module marketing/pages/DocsLayout
 */

import React from "react";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import styled from "styled-components";
import { media } from "../../shared/brand.js";
import { MARKETING_COPY } from "../copy.js";

const Shell = styled.div`
  display: grid;
  grid-template-columns: var(--brand-size-sidebarCol) 1fr;
  gap: var(--brand-space-10);
  max-width: var(--brand-size-contentMax);
  margin: 0 auto;
  padding: var(--brand-space-10) var(--brand-space-4);

  ${media.down.lg} {
    grid-template-columns: 1fr;
    gap: var(--brand-space-6);
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: var(--brand-space-6);
  align-self: start;

  ${media.down.lg} {
    position: static;
  }
`;

const SidebarHeading = styled.h2`
  font-size: var(--brand-fontSize-xs);
  font-weight: var(--brand-fontWeight-semibold);
  letter-spacing: var(--brand-letterSpacing-wide);
  text-transform: uppercase;
  color: var(--brand-color-neutral500);
  margin: 0 0 var(--brand-space-3);
`;

const TocList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-1);
`;

const TocItem = styled.li`
  margin: 0;
`;

const TocLink = styled(NavLink)`
  display: block;
  padding: var(--brand-space-2) var(--brand-space-3);
  border-radius: var(--brand-radius-sm);
  font-size: var(--brand-fontSize-sm);
  line-height: var(--brand-lineHeight-snug);
  color: var(--brand-color-neutral700);
  text-decoration: none;

  &:hover {
    color: var(--brand-color-primary600);
    background: var(--brand-color-neutral50);
  }

  &.active {
    color: var(--brand-color-primary600);
    background: var(--brand-color-neutral50);
    font-weight: var(--brand-fontWeight-semibold);
  }
`;

const TocEmpty = styled.p`
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral500);
  margin: 0;
`;

const Content = styled.div`
  min-width: 0;
`;

export default function DocsLayout() {
  const data = useLoaderData();
  const documents = Array.isArray(data?.documents) ? data.documents : [];
  const copy = MARKETING_COPY.docs;

  return (
    <Shell>
      <Sidebar aria-label={copy.sidebarNavLabel}>
        <SidebarHeading>{copy.sectionLabel}</SidebarHeading>
        {documents.length > 0 ? (
          <TocList>
            {documents.map((doc) => (
              <TocItem key={doc.slug}>
                <TocLink to={`/docs/${doc.slug}`} end>
                  {doc.title}
                </TocLink>
              </TocItem>
            ))}
          </TocList>
        ) : (
          <TocEmpty>{copy.emptyState}</TocEmpty>
        )}
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </Shell>
  );
}
