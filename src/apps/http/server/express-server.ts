/**
 * @fileoverview
 * Express-based HttpServer implementation, fully decoupled
 * from its transport via HttpBinding.
 */

import type http from "node:http";
import express, { type Express } from "express";
import { EventEmitter } from "tseep";

import type { AppEnvironment } from "@/apps/config/envs";
import { MIDDLEWARE_PIPELINE, applyMiddleware } from "../middleware";
import { applyRoutes } from "../routes/apply_routes";
import { ROUTE_MAPPINGS } from "../routes/mappings";
import type { HttpServer } from "../types";
import { DefaultBinding } from "./binding/default-binding";
import type { HttpBinding } from "./binding/http-binding";

/**
 * Concrete HttpServer that uses Express under the hood and
 * delegates “listen/close” to an injected HttpBinding.
 */
export class ExpressHttpServer extends EventEmitter implements HttpServer {
  private readonly app: Express = express();
  private listener?: Awaited<ReturnType<HttpBinding["bind"]>>;

  /**
   * @param cfg  Your validated env schema
   * @param binding  Strategy for binding (defaults to Node’s HTTP)
   */
  constructor(
    private readonly cfg: AppEnvironment,
    private readonly binding: HttpBinding = new DefaultBinding(),
  ) {
    super();
    applyMiddleware(this.app, MIDDLEWARE_PIPELINE);
    applyRoutes(this.app, ROUTE_MAPPINGS);
  }

  public async start(): Promise<void> {
    this.emit("beforeStart");

    this.listener = await this.binding.bind(this.app, this.cfg);

    this.emit("afterStart");
  }

  public async stop(): Promise<void> {
    this.emit("beforeStop");

    if (this.listener) {
      await this.listener.close();
    }

    this.emit("afterStop");
  }

  /**
   * Expose the raw HTTP server for advanced use (e.g. WebSocket upgrades).
   */
  public getRawServer(): http.Server {
    if (!this.listener) {
      throw new Error("Server has not been started");
    }
    return this.listener.server;
  }

  /**
   * The public URL this server is serving on (http://host:port/…).
   */
  public getUrl(): string {
    if (!this.listener) {
      throw new Error("Server has not been started");
    }
    return this.listener.url;
  }
}
