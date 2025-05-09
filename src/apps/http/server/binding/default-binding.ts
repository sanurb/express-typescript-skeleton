/**
 * @fileoverview
 * Plain Node.js HTTP server binding.
 */

import { once } from "node:events";
import { createServer } from "node:http";
import type { Express } from "express";

import type { AppEnvironment } from "@/apps/config/envs";
import type { HttpBinding, HttpListener } from "./http-binding";

class DefaultListener implements HttpListener {
  constructor(
    public readonly server: ReturnType<typeof createServer>,
    public readonly url: string,
  ) {}

  async close(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

/**
 * Binds using `http.createServer(app).listen(...)`.
 */
export class DefaultBinding implements HttpBinding {
  async bind(app: Express, cfg: AppEnvironment): Promise<HttpListener> {
    const server = createServer(app);
    server.listen({
      port: cfg.PORT,
      host: cfg.HOST ?? "0.0.0.0",
    });

    // wait for the 'listening' event
    await once(server, "listening");

    const url = `http://${cfg.HOST}:${cfg.PORT}`;
    return new DefaultListener(server, url);
  }
}
