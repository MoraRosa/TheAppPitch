/**
 * Vitest global setup for @theapp/platform.
 *
 * Installs @testing-library/jest-dom matchers and stubs jsdom's missing
 * scroll APIs. Mirrors apps/merchant/vitest.setup.js so behaviour is
 * identical across the four frontend apps.
 */

import "@testing-library/jest-dom/vitest";
import "vitest-axe/extend-expect";
import { vi } from "vitest";

window.scrollTo = vi.fn();
Element.prototype.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();
