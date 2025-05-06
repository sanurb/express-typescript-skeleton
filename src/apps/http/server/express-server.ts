/**
 * @fileoverview Express-based HttpServer implementation.
 */

import type http from "node:http";
import express, { type Express } from "express";
import { EventEmitter } from "tseep";

import type { AppEnvironment } from "@/apps/config/envs";
import { MIDDLEWARE_PIPELINE, applyMiddleware } from "../middleware";
import { ROUTE_MAPPINGS, applyRoutes } from "../routes";
import type { HttpServer } from "../types";

/**
 * Concrete HttpServer that uses Express under the hood.
 * - Applies middleware & routes declaratively.
 * - Emits typed lifecycle events.
 */
export class ExpressHttpServer extends EventEmitter implements HttpServer {
  private readonly app: Express = express();
  private rawServer?: http.Server;

  constructor(private readonly cfg: AppEnvironment) {
    super();
    applyMiddleware(this.app, MIDDLEWARE_PIPELINE);
    applyRoutes(this.app, ROUTE_MAPPINGS);
  }

  public async start(): Promise<void> {
    this.emit("beforeStart");
    this.rawServer = this.app.listen(this.cfg.PORT);
    await new Promise<void>((res, rej) => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      this.rawServer!.once("listening", () => {
        this.emit("afterStart");
        res();
      }).once("error", rej);
    });
  }

  public async stop(): Promise<void> {
    this.emit("beforeStop");
    if (!this.rawServer) {
      this.emit("afterStop");
      return;
    }
    await new Promise<void>((res, rej) => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      this.rawServer!.close((err) => (err ? rej(err) : res()));
    });
    this.emit("afterStop");
  }

  public getRawServer(): http.Server {
    if (!this.rawServer) {
      throw new Error("Server has not been started");
    }
    return this.rawServer;
  }
}
