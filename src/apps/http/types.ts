import type { IncomingMessage, ServerResponse } from "node:http";
import type { Express } from "express";

export type HttpHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => void | Promise<void>;

export type HttpMiddleware = (next: HttpHandler) => HttpHandler;

export type Middleware = (app: Express) => Express;

export interface HttpServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  getRawServer(): import("http").Server;
}
