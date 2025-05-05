/**
 * @fileoverview Express server setup
 */

import type { Express, Router } from "express";
import express from "express";
import responseTime from "response-time";
import { EventEmitter } from "tseep";
import type { AppEnvironment } from "./config/envs";
import { healthRouter } from "./health/api/health_router";

/**
 * A function that configures middleware on an Express app.
 * @param app The Express application to configure.
 * @returns The same app, with side‐effects applied.
 */
export type Middleware = (app: Express) => Express;

/**
 * A tuple of [mountPath, router].
 */
export type RouteMapping = readonly [string, Router];

/**
 * Declarative list of middleware steps.
 */
export const MIDDLEWARE: readonly Middleware[] = [
  (app) => {
    app.set("catch async errors", true);
    return app;
  },
  (app) => {
    app.use(responseTime());
    return app;
  },
  (app) => {
    app.use(express.json({ limit: "100mb" }));
    return app;
  },
  (app) => {
    app.use(express.urlencoded({ extended: true }));
    return app;
  },
];

/**
 * Declarative list of [path, router] mounts.
 */
export const ROUTES: readonly RouteMapping[] = [["/api/health", healthRouter]];

/**
 * Apply middleware in the order given.
 * @param app The Express application.
 * @param middlewareList Ordered middleware functions.
 * @returns The configured Express app.
 */
export function applyMiddleware(
  app: Express,
  middlewareList: readonly Middleware[],
): Express {
  return middlewareList.reduce((acc, fn) => fn(acc), app);
}

/**
 * Mount each router at its path.
 * @param app The Express application.
 * @param routes Ordered [path, router] tuples.
 * @returns The configured Express app.
 */
export function applyRoutes(
  app: Express,
  routes: readonly RouteMapping[],
): Express {
  for (const [path, router] of routes) {
    app.use(path, router);
  }
  return app;
}

/**
 * A thin HTTP server wrapper that emits lifecycle events.
 */
export class Server extends EventEmitter {
  private readonly app: Express;
  private httpServer?: import("http").Server;

  /**
   * @param cfg Validated environment schema.
   */
  constructor(private readonly cfg: AppEnvironment) {
    super();
    this.app = express();
    applyMiddleware(this.app, MIDDLEWARE);
    applyRoutes(this.app, ROUTES);
  }

  /**
   * Start listening on cfg.PORT.
   * Emits 'beforeStart' and then 'afterStart'.
   */
  public async start(): Promise<void> {
    this.emit("beforeStart");
    await new Promise<void>((resolve, reject) => {
      this.httpServer = this.app
        .listen(this.cfg.PORT)
        .once("listening", () => {
          this.emit("afterStart");
          resolve();
        })
        .once("error", (err) => reject(err));
    });
  }

  /**
   * Stop the HTTP server if running.
   * Emits 'beforeStop' then 'afterStop'.
   */
  public async stop(): Promise<void> {
    this.emit("beforeStop");
    if (!this.httpServer) {
      this.emit("afterStop");
      return;
    }
    await new Promise<void>((resolve, reject) => {
      if (!this.httpServer) return;
      this.httpServer.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.emit("afterStop");
          resolve();
        }
      });
    });
  }

  /**
   * Retrieve the raw http.Server instance.
   * @throws if start() has never been called.
   */
  public getHttpServer(): import("http").Server {
    if (!this.httpServer) {
      throw new Error("Server has not been started");
    }
    return this.httpServer;
  }
}
