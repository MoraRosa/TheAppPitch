/**
 * styledComponentsCollector -- unit tests.
 *
 * Guards the FOUC fix: the collector MUST capture non-empty
 * `<style data-styled>` tags for a styled-components tree, because the
 * built-in vite-react-ssg collector returns empty tags under React 19
 * (its sheet is fed only by the framework's streaming render, which
 * ServerStyleSheet does not observe).
 */
import { describe, it, expect } from "vitest";
import React from "react";
import styled from "styled-components";
import getStyledComponentsCollector from "./styledComponentsCollector.js";

const Box = styled.div`
  color: rebeccapurple;
  padding: 8px;
`;

describe("styledComponentsCollector", () => {
  it("captures non-empty style tags for a styled tree", async () => {
    const collector = await getStyledComponentsCollector();
    collector.collect(React.createElement(Box, null, "hello"));
    const tags = collector.toString();
    collector.cleanup();

    expect(tags).toContain("data-styled");
    expect(tags).toContain("rebeccapurple");
  });

  it("returns an empty string before collect is called", async () => {
    const collector = await getStyledComponentsCollector();
    expect(collector.toString()).toBe("");
    collector.cleanup();
  });

  it("returns a React element from collect so the framework can render it", async () => {
    const collector = await getStyledComponentsCollector();
    const out = collector.collect(React.createElement(Box, null, "x"));
    collector.cleanup();
    expect(React.isValidElement(out)).toBe(true);
  });
});
