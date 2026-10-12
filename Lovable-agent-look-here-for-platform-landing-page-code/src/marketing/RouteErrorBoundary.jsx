/**
 * RouteErrorBoundary -- adapts react-router's useRouteError() to the
 * ErrorState component contract. Lives in its own module (rather than
 * inline in routes.jsx) so the route table stays a pure data export and
 * this stays a pure component export -- satisfying react-refresh's
 * component-only-file rule for fast refresh.
 *
 * @module marketing/RouteErrorBoundary
 */

import React from "react";
import { useRouteError } from "react-router-dom";
import ErrorState from "./pages/ErrorState.jsx";

export default function RouteErrorBoundary() {
  const error = useRouteError();
  return <ErrorState error={error} />;
}
