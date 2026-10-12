/**
 * ComparisonTableBlock -- Feature-by-tier matrix.
 *
 * Block schema (migration 20260512000008 -- 'comparison_table'):
 *   heading, intro,
 *   plan_codes:  column order
 *   groups:      [{ key, label }] optional row sections
 *   rows:        [{ label, tooltip, group, feature_key, format }]
 *
 * No hardcoded per-tier values. Cells render values resolved from the
 * live platform_plans.features_json blob (delivered via refs.plans by
 * hydrateBlockRefs server-side). Plan codes the catalog does not know
 * about are silently dropped, matching the contract the block-type
 * comment commits to.
 *
 * Format keys (from migration):
 *   number          - -1 -> "Unlimited"; missing -> em-dash
 *   boolean         - true -> check; false / missing -> em-dash
 *   text            - pass through; missing -> em-dash
 *   duration_days   - "<N> days"; -1 -> "Unlimited"
 *   bytes           - integer bytes humanised (KB/MB/GB/TB, binary);
 *                     -1 -> "Unlimited"; missing -> em-dash
 *
 * @module marketing/blocks/ComparisonTableBlock
 */

import React from "react";
import styled from "styled-components";
import {
  Section,
  SectionInner,
  SectionHeading,
  SectionIntro,
} from "./_section.js";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--brand-fontSize-sm);

  th,
  td {
    padding: var(--brand-space-3) var(--brand-space-4);
    border-bottom: var(--brand-borderWidth-hairline) solid
      var(--brand-color-neutral100);
    text-align: left;
    vertical-align: top;
  }
  thead th {
    background: var(--brand-color-neutral50);
    font-weight: var(--brand-fontWeight-semibold);
    color: var(--brand-color-neutral900);
    border-bottom: var(--brand-borderWidth-hairline) solid
      var(--brand-color-neutral200);
    text-align: center;
  }
  thead th:first-child {
    text-align: left;
  }
  td:not(:first-child) {
    text-align: center;
    color: var(--brand-color-neutral700);
  }
  tr.group-head td {
    background: var(--brand-color-neutral50);
    font-weight: var(--brand-fontWeight-semibold);
    color: var(--brand-color-neutral900);
    text-transform: uppercase;
    letter-spacing: var(--brand-letterSpacing-wide);
    font-size: var(--brand-fontSize-xs);
  }
`;

const ScrollWrap = styled.div`
  overflow-x: auto;
`;

function resolvePath(obj, path) {
  if (!obj || !path) return undefined;
  const parts = String(path).split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}

const EMDASH = "\u2014";
const CHECK = "\u2713";

function trimDecimal(n) {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

function formatBytes(value) {
  if (!Number.isFinite(value) || value < 0) return null;
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  const TB = GB * 1024;
  if (value >= TB) return `${trimDecimal(value / TB)} TB`;
  if (value >= GB) return `${trimDecimal(value / GB)} GB`;
  if (value >= MB) return `${trimDecimal(value / MB)} MB`;
  if (value >= KB) return `${trimDecimal(value / KB)} KB`;
  return `${value} bytes`;
}

function formatCell(value, format) {
  if (format === "number") {
    if (value === -1) return "Unlimited";
    if (value === null || value === undefined) return EMDASH;
    return String(value);
  }
  if (format === "boolean") {
    return value === true ? CHECK : EMDASH;
  }
  if (format === "text") {
    return value === null || value === undefined || value === ""
      ? EMDASH
      : String(value);
  }
  if (format === "duration_days") {
    if (value === -1) return "Unlimited";
    if (value === null || value === undefined) return EMDASH;
    return `${value} days`;
  }
  if (format === "bytes") {
    if (value === -1) return "Unlimited";
    if (value === null || value === undefined) return EMDASH;
    return formatBytes(value) || EMDASH;
  }
  if (format === "money") {
    if (value === null || value === undefined) return EMDASH;
    if (value === 0) return "Free";
    const dollars = (value / 100).toFixed(0);
    return `$${dollars}`;
  }
  return EMDASH;
}

export default function ComparisonTableBlock({ block, refs }) {
  const allPlans = Array.isArray(refs?.plans) ? refs.plans : [];
  const planByCode = new Map(allPlans.map((p) => [p.code, p]));

  const planCodes = Array.isArray(block.plan_codes) ? block.plan_codes : [];
  const visiblePlans = planCodes
    .map((code) => planByCode.get(code))
    .filter(Boolean);

  if (visiblePlans.length === 0) return null;

  const groups = Array.isArray(block.groups) ? block.groups : [];
  const rows = Array.isArray(block.rows) ? block.rows : [];

  const groupOrder = groups.length ? groups : [{ key: "_all", label: "" }];
  const rowsByGroup = new Map(groupOrder.map((g) => [g.key, []]));
  for (const row of rows) {
    const key = groups.length ? row.group : "_all";
    if (!rowsByGroup.has(key)) rowsByGroup.set(key, []);
    rowsByGroup.get(key).push(row);
  }

  return (
    <Section>
      <SectionInner $max="wide">
        {block.heading ? (
          <SectionHeading>{block.heading}</SectionHeading>
        ) : null}
        {block.intro ? <SectionIntro>{block.intro}</SectionIntro> : null}
        <ScrollWrap>
          <Table>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                {visiblePlans.map((plan) => (
                  <th scope="col" key={plan.code}>
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupOrder.map((group) => {
                const groupRows = rowsByGroup.get(group.key) || [];
                if (groupRows.length === 0) return null;
                return (
                  <React.Fragment key={group.key}>
                    {group.label ? (
                      <tr className="group-head">
                        <td colSpan={visiblePlans.length + 1}>{group.label}</td>
                      </tr>
                    ) : null}
                    {groupRows.map((row, idx) => (
                      <tr key={`${group.key}-${idx}`}>
                        <th scope="row" title={row.tooltip || undefined}>
                          {row.label}
                        </th>
                        {visiblePlans.map((plan) => (
                          <td key={plan.code}>
                            {formatCell(
                              resolvePath(plan.features_json, row.feature_key),
                              row.format,
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </ScrollWrap>
      </SectionInner>
    </Section>
  );
}
