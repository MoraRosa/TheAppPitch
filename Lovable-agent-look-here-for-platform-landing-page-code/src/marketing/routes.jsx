/**
 * Marketing route table (peakenterprise.ca)
 *
 * Exports a react-router-dom data-router RouteObject[] consumed by
 * vite-react-ssg at build time (to enumerate paths and run loaders)
 * and by the client router at runtime (to dispatch navigations).
 *
 * Loaders fetch from the public CMS endpoints via fetchCmsForSsg --
 * Node-side at build time, browser-side during dev. The route table
 * is the single source of truth for "which CMS slug answers this URL"
 * so the URL space stays decoupled from the storage slug; renaming a
 * route does not require renaming a CMS row.
 *
 * Errors thrown by loaders bubble to the layout's errorElement; the
 * RouteErrorBoundary wrapper turns react-router's useRouteError() into
 * the existing ErrorState component contract.
 *
 * Parameterised routes (legal/:slug, blog/:slug, changelog/:slug) carry
 * a getStaticPaths that enumerates published slugs at build time so
 * vite-react-ssg can emit one HTML file per document.
 *
 * @module marketing/routes
 */

import React from "react";
import MarketingLayout from "./MarketingLayout.jsx";
import RouteErrorBoundary from "./RouteErrorBoundary.jsx";
import CmsPage from "./pages/CmsPage.jsx";
import DocsIndex from "./pages/DocsIndex.jsx";
import DocsLayout from "./pages/DocsLayout.jsx";
import DocumentDetail from "./pages/DocumentDetail.jsx";
import DocumentList from "./pages/DocumentList.jsx";
import NotFound from "./pages/NotFound.jsx";
import { fetchCmsForSsg } from "./ssg/serverFetch.js";

const LOCALE = "en";
const LIST_LIMIT = 20;
// Cap for the build-time enumeration call. Aligns with the public CMS
// list endpoint's hard maximum (see backend/src/plugins/platformContent
// schema). When a single document type exceeds this, the catch-all
// route still serves the unlisted slugs at runtime via the loader; the
// only loss is that the unlisted slug will not be present in the SSG
// output.
const STATIC_PATHS_LIMIT = 100;

function pageLoader(slug) {
  return () => fetchCmsForSsg(`pages/${slug}`, { locale: LOCALE });
}

function documentLoader(docType) {
  return ({ params }) =>
    fetchCmsForSsg(`documents/${docType}/${params.slug}`, { locale: LOCALE });
}

function documentListLoader(docType) {
  return () =>
    fetchCmsForSsg("documents", {
      type: docType,
      locale: LOCALE,
      limit: LIST_LIMIT,
      offset: 0,
    });
}

/**
 * Build-time enumeration of published slugs for a document type. Called
 * once per detail route during `vite-react-ssg build`. Returns paths in
 * the format vite-react-ssg expects: relative to the parent route, no
 * leading slash (e.g. "legal/tos" for a route at path "legal/:slug").
 *
 * Returns [] when CMS_SSG_BASE_URL is unset (the soft-skip mode the ADR
 * documents) so local `pnpm build` emits only the static top-level
 * pages without requiring a running backend.
 */
async function documentStaticPaths(docType, prefix) {
  const data = await fetchCmsForSsg("documents", {
    type: docType,
    locale: LOCALE,
    limit: STATIC_PATHS_LIMIT,
    offset: 0,
  });
  const docs = Array.isArray(data?.documents) ? data.documents : [];
  return docs.map((d) => `${prefix}/${d.slug}`);
}

export const routes = [
  {
    path: "/",
    element: <MarketingLayout />,
    entry: "src/marketing/MarketingLayout.jsx",
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <CmsPage />, loader: pageLoader("landing") },
      { path: "pricing", element: <CmsPage />, loader: pageLoader("pricing") },
      { path: "trust", element: <CmsPage />, loader: pageLoader("trust") },
      { path: "about", element: <CmsPage />, loader: pageLoader("about") },
      {
        path: "contact",
        element: <CmsPage />,
        loader: pageLoader("contact"),
      },

      {
        path: "legal",
        element: (
          <DocumentList
            title="Legal"
            intro="Terms, policies, and disclosures."
            routePrefix="/legal"
            canonicalPath="/legal"
          />
        ),
        loader: documentListLoader("legal"),
      },
      {
        path: "legal/:slug",
        element: <DocumentDetail />,
        loader: documentLoader("legal"),
        getStaticPaths: () => documentStaticPaths("legal", "legal"),
      },

      {
        path: "blog",
        element: (
          <DocumentList
            title="Blog"
            intro="Updates from the team."
            routePrefix="/blog"
            canonicalPath="/blog"
          />
        ),
        loader: documentListLoader("blog"),
      },
      {
        path: "blog/:slug",
        element: <DocumentDetail />,
        loader: documentLoader("blog"),
        getStaticPaths: () => documentStaticPaths("blog", "blog"),
      },

      {
        path: "changelog",
        element: (
          <DocumentList
            title="Changelog"
            intro="What shipped and when."
            routePrefix="/changelog"
            canonicalPath="/changelog"
          />
        ),
        loader: documentListLoader("changelog"),
      },
      {
        path: "changelog/:slug",
        element: <DocumentDetail />,
        loader: documentLoader("changelog"),
        getStaticPaths: () => documentStaticPaths("changelog", "changelog"),
      },

      {
        path: "docs",
        // Pathless id so DocsIndex + future docs children can read the
        // parent loader's list payload via useRouteLoaderData. One CMS
        // round-trip per section navigation.
        id: "docs-section",
        element: <DocsLayout />,
        loader: documentListLoader("docs"),
        children: [
          { index: true, element: <DocsIndex /> },
          {
            path: ":slug",
            element: <DocumentDetail />,
            loader: documentLoader("docs"),
            getStaticPaths: () => documentStaticPaths("docs", "docs"),
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routes;
