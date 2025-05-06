/**
 * @fileoverview Composable Express middleware pipeline with minimal boilerplate.
 */

import {
  type ErrorRequestHandler,
  type Express,
  type RequestHandler,
  json,
  urlencoded,
} from "express";
import responseTime from "response-time";

import { EXPRESS_SETTINGS } from "../config/constants";
import { compressionMiddleware } from "./middleware/compression.middleware";
import { addRequestId } from "./middleware/request_id.middleware";
import type { Middleware } from "./types";

/**
 * Wraps `app.use(...)` as a `Middleware`.
 * Add any number of RequestHandlers or Routers.
 *
 * @param handlers - Express middleware or routers to attach.
 * @returns A `Middleware` that applies them.
 */
export function use(
  ...handlers: Array<RequestHandler | ErrorRequestHandler>
): Middleware {
  return (app: Express) => {
    app.use(...handlers);
    return app;
  };
}

/**
 * Wraps `app.set(key, value)` as a `Middleware`.
 *
 * @param key - Express setting name.
 * @param value - Value for that setting.
 * @returns A `Middleware` that sets it.
 */
export function set<
  K extends Parameters<Express["set"]>[0],
  V extends Parameters<Express["set"]>[1],
>(key: K, value: V): Middleware {
  return (app: Express) => {
    app.set(key, value);
    return app;
  };
}

/**
 * Declarative, ordered list of all middleware.
 * To add a new step: import it and call `use(...)` or `set(...)`, no extra wrapper needed.
 */
export const MIDDLEWARE_PIPELINE = [
  use(addRequestId),
  set(EXPRESS_SETTINGS.CATCH_ASYNC_ERRORS, true),
  use(responseTime()),
  use(json({ limit: EXPRESS_SETTINGS.JSON_LIMIT })),
  use(compressionMiddleware),
  use(urlencoded({ extended: EXPRESS_SETTINGS.URLENCODED_EXTENDED })),
] as const;

/**
 * Apply each middleware in order.
 *
 * @param app - Express application instance.
 * @param pipeline - Ordered list of `Middleware`.
 * @returns The configured app.
 */
export function applyMiddleware(
  app: Express,
  pipeline: readonly Middleware[],
): Express {
  return pipeline.reduce((cfg, fn) => fn(cfg), app);
}
