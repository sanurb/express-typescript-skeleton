/**
 * @fileoverview Declarative route mounts for Express.
 */

import { ROUTE_PATHS } from "../config/constants";
import { healthRouter } from "../core/health/api/health_router";
import type { RouteMapping } from "./types";

/** Immutable list of [path, router] tuples. */
export const ROUTE_MAPPINGS: readonly RouteMapping[] = [
  [ROUTE_PATHS.HEALTH, healthRouter],
] as const;

/**
 * Mount each router at its path.
 * @returns The configured app.
 */
export function applyRoutes(
  app: import("express").Express,
  routes: readonly RouteMapping[],
): import("express").Express {
  for (const [path, router] of routes) {
    app.use(path, router);
  }
  return app;
}
