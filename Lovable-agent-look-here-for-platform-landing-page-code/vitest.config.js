/**
 * Vitest configuration for @theapp/platform.
 *
 * jsdom environment so component and runtime helpers that touch
 * document.documentElement / document.head can be tested without a
 * browser. Mirrors the apps/merchant and apps/buyer setup so the
 * test surface stays consistent across all four frontend apps.
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    include: ["src/**/*.test.{js,jsx,ts,tsx}"],
    exclude: ["node_modules/**", "dist/**"],
    isolate: true,
    testTimeout: 10000,
  },
});
