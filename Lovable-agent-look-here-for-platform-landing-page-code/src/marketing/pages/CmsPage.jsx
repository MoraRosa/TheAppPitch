/**
 * CmsPage -- Generic page route that loads a CMS page by slug and
 * renders its blocks. Used for landing, pricing, trust, about, and any
 * future top-level marketing route the staff CMS adds without a code
 * deploy.
 *
 * The slug is supplied by the route (not useParams) so the route table
 * stays the source of truth and the URL space stays decoupled from the
 * storage slug. Data comes from the route loader (see routes.jsx);
 * react-router blocks render until the loader resolves, so there is
 * no in-component loading state. Errors bubble to the layout's
 * errorElement.
 *
 * @module marketing/pages/CmsPage
 */

import React from "react";
import { useLoaderData } from "react-router-dom";
import BlockRenderer from "../blocks/BlockRenderer.jsx";
import PageHead from "../seo/PageHead.jsx";
import NotFound from "./NotFound.jsx";

export default function CmsPage() {
  const data = useLoaderData();

  if (!data || !data.page) return <NotFound />;

  const { page, refs } = data;

  return (
    <>
      <PageHead
        title={page.title}
        description={page.meta_description}
        keywords={page.meta_keywords}
        canonicalPath={page.canonical_path}
      />
      <BlockRenderer blocks={page.blocks} refs={refs} />
    </>
  );
}
