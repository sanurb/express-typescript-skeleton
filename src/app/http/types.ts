import type { Express, Router } from "express";

export type Middleware = (app: Express) => Express;
export type RouteMapping = readonly [string, Router];

export interface HttpServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  getRawServer(): import("http").Server;
}
