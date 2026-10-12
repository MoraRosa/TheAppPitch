/**
 * PageHead -- Effect-only component that mirrors page metadata into
 * <head>: document.title, meta description, meta keywords, canonical.
 * No external head-manager dep -- the marketing bundle is small enough
 * that a 60-line useEffect beats pulling in react-helmet-async, and
 * Phase 2E (vite-react-ssg) will pick the same tags up at build time.
 *
 * Renders nothing. Mount once per page route below the route's data
 * fetch so the title only changes after data is ready.
 *
 * @module marketing/seo/PageHead
 */

import { useEffect } from "react";
import { APP_METADATA } from "@theapp/config";
import { absoluteUrl } from "./marketingBaseUrl.js";

const SITE_NAME = APP_METADATA.NAME;

function setMeta(name, content, attr = "name") {
  if (!content) return removeMeta(name, attr);
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(name, attr = "name") {
  const el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (el) el.parentNode.removeChild(el);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    if (el) el.parentNode.removeChild(el);
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * @param {object} props
 * @param {string}  props.title             Required. Page title.
 * @param {string}  [props.description]     Meta description.
 * @param {string}  [props.keywords]        Meta keywords (comma-joined).
 * @param {string}  [props.canonicalPath]   "/pricing" -> absolute URL.
 * @param {string}  [props.ogType]          "website" (default) | "article".
 * @param {boolean} [props.noindex]         Add <meta name="robots" content="noindex">.
 */
export default function PageHead({
  title,
  description,
  keywords,
  canonicalPath,
  ogType = "website",
  noindex = false,
}) {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const previousTitle = document.title;
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    setMeta("description", description || "");
    setMeta("keywords", keywords || "");

    const canonicalHref = canonicalPath ? absoluteUrl(canonicalPath) : null;
    setCanonical(canonicalHref);

    setMeta("og:title", fullTitle, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:description", description || "", "property");
    if (canonicalHref) setMeta("og:url", canonicalHref, "property");
    else removeMeta("og:url", "property");

    setMeta("twitter:card", "summary", "name");
    setMeta("twitter:title", fullTitle, "name");
    setMeta("twitter:description", description || "", "name");

    if (noindex) {
      setMeta("robots", "noindex,nofollow");
    } else {
      removeMeta("robots");
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, keywords, canonicalPath, ogType, noindex]);

  return null;
}
