/**
 * @fileoverview Composeable Express middleware pipeline.
 */

import type { Express } from "express";
import express from "express";
import responseTime from "response-time";

import { EXPRESS_SETTINGS } from "../config/constants";
import type { Middleware } from "./types";

export const MIDDLEWARE_PIPELINE: readonly Middleware[] = [
  (app) => {
    app.set(EXPRESS_SETTINGS.CATCH_ASYNC_ERRORS, true);
    return app;
  },
  (app) => {
    app.use(responseTime());
    return app;
  },
  (app) => {
    app.use(express.json({ limit: EXPRESS_SETTINGS.JSON_LIMIT }));
    return app;
  },
  (app) => {
    app.use(
      express.urlencoded({ extended: EXPRESS_SETTINGS.URLENCODED_EXTENDED }),
    );
    return app;
  },
];

/**
 * Apply each middleware in order.
 * @returns The fully configured app.
 */
export function applyMiddleware(
  app: Express,
  pipeline: readonly Middleware[],
): Express {
  return pipeline.reduce((cfg, fn) => fn(cfg), app);
}
