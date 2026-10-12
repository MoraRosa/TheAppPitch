/**
 * DocumentDetail -- Renders a single long-form document (legal page,
 * blog post, changelog entry, sub-processor list, docs page).
 *
 * Data comes from the route loader (see routes.jsx); the loader
 * receives { params } from react-router and resolves the slug there.
 * One component serves /legal/:slug, /blog/:slug, /changelog/:slug
 * because every type's payload shares the same shape.
 *
 * body_html is the server-side-sanitized cached payload (DOMPurify at
 * write time, see migration
 * 20260512000006_create_platform_content_document_revisions.sql);
 * dangerouslySetInnerHTML here is the documented contract.
 *
 * @module marketing/pages/DocumentDetail
 */

import React from "react";
import { useLoaderData } from "react-router-dom";
import styled from "styled-components";
import PageHead from "../seo/PageHead.jsx";
import PageJsonLd from "../seo/PageJsonLd.jsx";
import {
  buildArticleJsonLd,
  buildDetailPageBreadcrumbs,
} from "../seo/jsonLdBuilders.js";
import { getMarketingBaseUrl } from "../seo/marketingBaseUrl.js";
import NotFound from "./NotFound.jsx";

const Article = styled.article`
  max-width: var(--brand-size-proseMax);
  margin: 0 auto;
  padding: var(--brand-space-12) 0;
`;

const Header = styled.header`
  margin-bottom: var(--brand-space-8);
`;

const Title = styled.h1`
  font-size: var(--brand-fontSizeFluid-heading);
  margin: 0 0 var(--brand-space-3);
  color: var(--brand-color-neutral900);
  line-height: var(--brand-lineHeight-tight);
`;

const Summary = styled.p`
  font-size: var(--brand-fontSize-base);
  color: var(--brand-color-neutral500);
  margin: 0 0 var(--brand-space-4);
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--brand-space-3);
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral500);
`;

const Body = styled.div`
  color: var(--brand-color-neutral900);
  font-size: var(--brand-fontSize-base);
  line-height: var(--brand-lineHeight-relaxed);

  h2 {
    font-size: var(--brand-fontSize-2xl);
    margin: var(--brand-space-8) 0 var(--brand-space-3);
  }
  h3 {
    font-size: var(--brand-fontSize-base);
    margin: var(--brand-space-6) 0 var(--brand-space-2);
  }
  p {
    margin: 0 0 var(--brand-space-4);
  }
  ul,
  ol {
    margin: 0 0 var(--brand-space-4) var(--brand-space-6);
  }
  li {
    margin-bottom: var(--brand-space-2);
  }
  a {
    color: var(--brand-color-primary600);
  }
  code {
    font-family: var(--brand-font-mono);
    font-size: var(--brand-fontSize-sm);
  }
  pre {
    background: var(--brand-color-neutral50);
    padding: var(--brand-space-3) var(--brand-space-4);
    border-radius: var(--brand-radius-md);
    overflow-x: auto;
  }
`;

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export default function DocumentDetail() {
  const data = useLoaderData();

  if (!data || !data.document) return <NotFound />;

  const doc = data.document;
  const dateLabel = formatDate(doc.effective_at || doc.published_at);
  const siteBaseUrl = getMarketingBaseUrl();
  const articleLd = buildArticleJsonLd({ siteBaseUrl, doc });
  const breadcrumbLd = buildDetailPageBreadcrumbs({ siteBaseUrl, doc });

  return (
    <>
      <PageHead
        title={doc.title}
        description={doc.meta_description || doc.summary}
        canonicalPath={doc.canonical_path}
        ogType="article"
      />
      <PageJsonLd payload={articleLd} />
      <PageJsonLd payload={breadcrumbLd} />
      <Article>
        <Header>
          <Title>{doc.title}</Title>
          {doc.summary ? <Summary>{doc.summary}</Summary> : null}
          <MetaRow>
            {doc.author_name ? <span>{doc.author_name}</span> : null}
            {dateLabel ? <span>{dateLabel}</span> : null}
            {Array.isArray(doc.tags) && doc.tags.length > 0 ? (
              <span>{doc.tags.join(", ")}</span>
            ) : null}
          </MetaRow>
        </Header>
        <Body dangerouslySetInnerHTML={{ __html: doc.body_html || "" }} />
      </Article>
    </>
  );
}
