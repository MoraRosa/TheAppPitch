/**
 * DocumentList -- Index page for one of the document types (legal,
 * blog, changelog). The parent route supplies docType, the page title,
 * and the route prefix used to build per-row links (e.g. "blog" ->
 * "/blog/<slug>"). One component covers every index because the
 * shape (title + summary + date) is identical across types.
 *
 * @module marketing/pages/DocumentList
 */

import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import styled from "styled-components";
import PageHead from "../seo/PageHead.jsx";

const Wrap = styled.div`
  max-width: var(--brand-size-proseMax);
  margin: 0 auto;
  padding: var(--brand-space-12) 0;
`;

const Heading = styled.h1`
  font-size: var(--brand-fontSizeFluid-headingSm);
  margin: 0 0 var(--brand-space-3);
  color: var(--brand-color-neutral900);
`;

const Intro = styled.p`
  font-size: var(--brand-fontSize-base);
  color: var(--brand-color-neutral500);
  margin: 0 0 var(--brand-space-8);
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-6);
`;

const Item = styled.li`
  border-bottom: var(--brand-borderWidth-hairline) solid
    var(--brand-color-neutral100);
  padding-bottom: var(--brand-space-6);
  &:last-child {
    border-bottom: none;
  }
`;

const ItemTitle = styled.h2`
  font-size: var(--brand-fontSize-base);
  margin: 0 0 var(--brand-space-2);
`;

const ItemLink = styled(Link)`
  color: var(--brand-color-neutral900);
  text-decoration: none;
  &:hover {
    color: var(--brand-color-primary600);
  }
`;

const ItemMeta = styled.div`
  font-size: var(--brand-fontSize-xs);
  color: var(--brand-color-neutral500);
  margin-bottom: var(--brand-space-2);
`;

const ItemSummary = styled.p`
  margin: 0;
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral700);
  line-height: var(--brand-lineHeight-normal);
`;

const Empty = styled.p`
  color: var(--brand-color-neutral500);
  font-size: var(--brand-fontSize-sm);
`;

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

/**
 * Data shape: useLoaderData() returns { documents: [...], pagination: {...} }
 * (or null if the SSG soft-skip emitted no payload). The non-data props
 * (title, intro, routePrefix, canonicalPath) come from the route table
 * since they are content scaffolding, not CMS-driven.
 *
 * @param {object} props
 * @param {string} props.title      Heading text.
 * @param {string} [props.intro]    Intro paragraph.
 * @param {string} props.routePrefix  "/legal" | "/blog" | "/changelog".
 * @param {string} [props.canonicalPath]
 * @param {string} [props.emptyLabel]  Shown when the list is empty.
 */
export default function DocumentList({
  title,
  intro,
  routePrefix,
  canonicalPath,
  emptyLabel = "Nothing here yet.",
}) {
  const data = useLoaderData();
  const documents = Array.isArray(data?.documents) ? data.documents : [];

  return (
    <Wrap>
      <PageHead
        title={title}
        description={intro}
        canonicalPath={canonicalPath}
      />
      <Heading>{title}</Heading>
      {intro ? <Intro>{intro}</Intro> : null}

      {documents.length > 0 ? (
        <List>
          {documents.map((doc) => {
            const dateLabel = formatDate(doc.effective_at || doc.published_at);
            return (
              <Item key={doc.slug}>
                <ItemTitle>
                  <ItemLink to={`${routePrefix}/${doc.slug}`}>
                    {doc.title}
                  </ItemLink>
                </ItemTitle>
                {dateLabel ? <ItemMeta>{dateLabel}</ItemMeta> : null}
                {doc.summary ? <ItemSummary>{doc.summary}</ItemSummary> : null}
              </Item>
            );
          })}
        </List>
      ) : (
        <Empty>{emptyLabel}</Empty>
      )}
    </Wrap>
  );
}
