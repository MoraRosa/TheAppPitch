/**
 * DocsIndex -- /docs landing. Mounted inside DocsLayout so the sidebar
 * TOC is already visible; this component renders the welcome heading,
 * an intro paragraph, and tile cards for each published doc so a
 * first-time visitor has a hub view as well as the sidebar list.
 *
 * Reads the docs list from the parent route (docs-section) rather than
 * its own loader to keep the section to one CMS round-trip on initial
 * load.
 *
 * @module marketing/pages/DocsIndex
 */

import React from "react";
import { Link, useRouteLoaderData } from "react-router-dom";
import styled from "styled-components";
import PageHead from "../seo/PageHead.jsx";
import { MARKETING_COPY } from "../copy.js";

const Heading = styled.h1`
  font-size: var(--brand-fontSizeFluid-headingSm);
  margin: 0 0 var(--brand-space-3);
  color: var(--brand-color-neutral900);
`;

const Intro = styled.p`
  font-size: var(--brand-fontSize-base);
  color: var(--brand-color-neutral500);
  margin: 0 0 var(--brand-space-8);
  max-width: 60ch;
`;

const Grid = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--brand-size-gridColMinLg), 1fr)
  );
  gap: var(--brand-space-4);
`;

const Card = styled.li`
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral100);
  border-radius: var(--brand-radius-md);
  background: var(--brand-color-neutral0);
`;

const CardLink = styled(Link)`
  display: block;
  padding: var(--brand-space-5);
  color: inherit;
  text-decoration: none;

  &:hover {
    border-color: var(--brand-color-primary600);
  }
`;

const CardTitle = styled.h2`
  font-size: var(--brand-fontSize-base);
  margin: 0 0 var(--brand-space-2);
  color: var(--brand-color-neutral900);
`;

const CardSummary = styled.p`
  margin: 0;
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral500);
  line-height: var(--brand-lineHeight-normal);
`;

const Empty = styled.p`
  color: var(--brand-color-neutral500);
  font-size: var(--brand-fontSize-sm);
`;

export default function DocsIndex() {
  const data = useRouteLoaderData("docs-section");
  const documents = Array.isArray(data?.documents) ? data.documents : [];
  const copy = MARKETING_COPY.docs;

  return (
    <>
      <PageHead
        title={copy.indexTitle}
        description={copy.indexIntro}
        canonicalPath="/docs"
      />
      <Heading>{copy.indexTitle}</Heading>
      <Intro>{copy.indexIntro}</Intro>

      {documents.length > 0 ? (
        <Grid>
          {documents.map((doc) => (
            <Card key={doc.slug}>
              <CardLink to={`/docs/${doc.slug}`}>
                <CardTitle>{doc.title}</CardTitle>
                {doc.summary ? <CardSummary>{doc.summary}</CardSummary> : null}
              </CardLink>
            </Card>
          ))}
        </Grid>
      ) : (
        <Empty>{copy.emptyState}</Empty>
      )}
    </>
  );
}
