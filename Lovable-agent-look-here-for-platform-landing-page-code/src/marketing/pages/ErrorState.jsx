/**
 * ErrorState -- Rendered when a CMS fetch fails for a reason other
 * than 404 (network, 5xx, schema). Shows the error code (debuggable
 * by support without leaking internals) and a single retry hint.
 * Status code is intentionally NOT shown -- support escalations key
 * off the code string from the API envelope.
 *
 * @module marketing/pages/ErrorState
 */

import React from "react";
import styled from "styled-components";
import PageHead from "../seo/PageHead.jsx";

const Wrap = styled.div`
  padding: var(--brand-space-16) 0;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: var(--brand-fontSize-2xl);
  margin: 0 0 var(--brand-space-3);
  color: var(--brand-color-neutral900);
`;

const Body = styled.p`
  margin: 0;
  color: var(--brand-color-neutral500);
  font-size: var(--brand-fontSize-sm);
`;

const Code = styled.code`
  display: inline-block;
  margin-top: var(--brand-space-3);
  font-family: var(--brand-font-mono);
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral700);
`;

export default function ErrorState({ error }) {
  const code = error?.code || "unknown_error";
  return (
    <Wrap>
      <PageHead title="Something went wrong" noindex />
      <Heading>Something went wrong</Heading>
      <Body>
        We couldn&apos;t load this page. Please refresh and try again.
      </Body>
      <Code>{code}</Code>
    </Wrap>
  );
}
