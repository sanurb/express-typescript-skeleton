/**
 * @fileoverview Applies route mappings to an Express application.
 */

import type { Registration } from "@reflet/express";
import { register } from "@reflet/express";

import type {
  Application as ExpressApp,
  Router as ExpressRouter,
} from "express";
import type { RouteMapping } from "./types";

/**
 * Mounts routers—either Reflet-decorated or classic Express ones—at their corresponding paths.
 *
 * @param app The Express app instance.
 * @param routes The list of path-router mappings to apply.
 */
export function applyRoutes(
  app: ExpressApp,
  routes: readonly RouteMapping[],
): void {
  const refletRouters: Registration[] = [];

  for (const [path, router] of routes) {
    if (typeof router === "function" || typeof router === "object") {
      refletRouters.push([path, router]);
    } else {
      app.use(path, router as ExpressRouter);
    }
  }

  if (refletRouters.length > 0) {
    register(app, refletRouters);
  }
}
