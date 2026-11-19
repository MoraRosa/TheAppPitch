// Ideal customer profile (ICP). Source of truth for the /icp page.
// Mirrors Section 2 of the business plan Claude Doc. Update both together.
// Evidence tags: tested = customers said or did it; partly = early signals from a small group; assumed = reasoned, not yet checked with customers.

export const ICP_VERSION = 'v0.2';
export const ICP_UPDATED = '19 Nov 2026';

export const ICP_LEAD =
  "Peak's ideal customer is a non-technical owner of a small product or service business who is tired of stitching tools together and wants one system they can run themselves.";

export const ICP_BASIS =
  'This is a hypothesis. It rests on the first paying merchants and conversations with early users, a small group.';

export const ICP_EVIDENCE_KEY = [
  { tag: 'tested',  label: 'Tested',        text: 'Customers said or did it.' },
  { tag: 'partly',  label: 'Partly tested', text: 'Early signals from a small group.' },
  { tag: 'assumed', label: 'Assumed',       text: 'Reasoned, not yet checked with customers.' },
];

export const ICP_ROWS = [
  { part: 'Who',                 answer: 'Non-technical owner-operators of small product or service businesses with 1 to 5 people, in Canada, starting in Alberta.', evidence: 'partly',  confidence: 3 },
  { part: 'Role',                answer: 'The owner, who also runs the website, orders, email and bookkeeping.',                                                       evidence: 'partly',  confidence: 3 },
  { part: 'Trigger',             answer: 'Ease of use, and consolidating several tools into one login.',                                                               evidence: 'partly',  confidence: 3 },
  { part: 'Pain and cost',       answer: 'Three or more disconnected tools, or outgrowing a WordPress, Shopify or Wix site. Hours a week and dollars a month are not yet measured.', evidence: 'assumed', confidence: 2 },
  { part: 'Current alternative', answer: 'Shopify, WordPress, Wix, Mailchimp and spreadsheets stitched together.',                                                      evidence: 'partly',  confidence: 3 },
  { part: 'Fit signals',         answer: 'Uses three or more tools, is moving off WordPress, Shopify or Wix, and sells products or services directly to customers.',  evidence: 'partly',  confidence: 2 },
  { part: 'Anti-persona',        answer: 'Technical owners who build their own stack, businesses with 20 or more staff, and enterprise.',                              evidence: 'assumed', confidence: 3 },
];

export const ICP_NEXT_EVIDENCE = [
  "Each paying merchant's own words on what they used before and what pushed them to try Peak.",
  'Hours a week and dollars a month spent on the tools they replaced.',
  'Which fit signals each merchant actually matched.',
];

export const ICP_LOG = [
  { version: 'v0.1', when: 'Earlier draft', change: 'Led with production costing.' },
  { version: 'v0.2', when: 'Oct 2026',      change: 'Product and service businesses, non-technical owners, one connected system. Costing is one module.' },
  { version: 'v0.2', when: '19 Nov 2026',   change: 'Added evidence tags and confidence scores, placed as section 2 of the business plan.' },
];
