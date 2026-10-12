/**
 * NotFound -- 404 page for unknown marketing routes and for CMS slugs
 * that resolve to a missing / unpublished page or document. Sets the
 * robots noindex meta so this page is never indexed regardless of
 * referer.
 *
 * @module marketing/pages/NotFound
 */

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PageHead from "../seo/PageHead.jsx";

const Wrap = styled.div`
  padding: var(--brand-space-16) 0;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: var(--brand-fontSize-4xl);
  margin: 0 0 var(--brand-space-3);
  color: var(--brand-color-neutral900);
`;

const Body = styled.p`
  margin: 0 0 var(--brand-space-6);
  color: var(--brand-color-neutral500);
`;

const Home = styled(Link)`
  color: var(--brand-color-primary600);
  font-weight: var(--brand-fontWeight-semibold);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default function NotFound() {
  return (
    <Wrap>
      <PageHead title="Page not found" noindex />
      <Heading>Page not found</Heading>
      <Body>The page you were looking for isn&apos;t here.</Body>
      <Home to="/">Back to home</Home>
    </Wrap>
  );
}
