/**
 * @fileoverview
 * Abstraction over “bind an Express app to an HTTP listener”.
 */

import type http from "node:http";
import type { AppEnvironment } from "@/apps/config/envs";
import type { Express } from "express";

/**
 * Result of binding: gives you back the raw server (for shutdown)
 * plus the public URL you can log or display.
 */
export interface HttpListener {
  /** Underlying Node HTTP server (or wrapper). */
  readonly server: http.Server;
  /** URL on which this listener is serving (e.g. http://localhost:3001). */
  readonly url: string;
  /** Gracefully close / shutdown the server. */
  close(): Promise<void>;
}

/**
 * A transport strategy that knows how to bind an Express app
 * given your environment config.
 */
export interface HttpBinding {
  /**
   * Bind the given Express app, returning a `HttpListener` that
   * was actually started.
   */
  bind(app: Express, cfg: AppEnvironment): Promise<HttpListener>;
}
