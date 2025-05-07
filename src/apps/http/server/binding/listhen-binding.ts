/**
 * @fileoverview
 * Listhen-based HTTP binding for rich dev experience.
 */

import type { Express } from "express";
import { listen } from "listhen";

import type { HttpBinding, HttpListener } from "./http-binding";

class ListhenListener implements HttpListener {
  constructor(private readonly listener: Awaited<ReturnType<typeof listen>>) {}

  get server() {
    return this.listener.server;
  }

  get url() {
    return this.listener.url;
  }

  async close(): Promise<void> {
    await this.listener.close();
  }
}

/**
 * Uses `await listen(app, options)` under the hood.
 */
export class ListhenBinding implements HttpBinding {
  constructor(private readonly options: Parameters<typeof listen>[1]) {}

  async bind(app: Express): Promise<HttpListener> {
    const listener = await listen(app, this.options);
    return new ListhenListener(listener);
  }
}
