import type { Express, Router } from "express";
import type { IncomingMessage, ServerResponse } from "node:http";

export type HttpHandler =
  (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;

export type HttpMiddleware =
  (next: HttpHandler) => HttpHandler;

export type Middleware = (app: Express) => Express;
export type RouteMapping = readonly [string, Router];

export interface HttpServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  getRawServer(): import("http").Server;
}
