import supertest from "supertest";
import type uWS from "uWebSockets.js";
import { us_listen_socket_close, us_socket_local_port } from "uWebSockets.js";
import type { TemplatedApp } from "uWebSockets.js";

type SupportedUwsApp =
  | TemplatedApp
  | {
      uwsApp?: TemplatedApp;
      uws_instance?: TemplatedApp;
    };

/**
 * A wrapper that provides the minimal interface required by Supertest:
 * `.listen()` and `.address()`. It adapts uWebSockets.js apps to Supertest.
 */
class AppWrapper {
  private readonly app: TemplatedApp;
  private token: uWS.us_listen_socket | null = null;
  private port: number | null = null;

  constructor(inputApp: SupportedUwsApp) {
    this.app =
      // biome-ignore lint/suspicious/noExplicitAny: safely access internal uWS instance from non-standard app shape
      (inputApp as any).uwsApp ??
      // biome-ignore lint/suspicious/noExplicitAny: safely access internal uWS instance from non-standard app shape
      (inputApp as any).uws_instance ??
      (inputApp as TemplatedApp);
  }

  listen(port: number): { _handle: true; close: (cb?: () => void) => void } {
    this.app.listen(port, (token: uWS.us_listen_socket | false) => {
      if (!token) {
        throw new Error("Failed to start uWS.js app");
      }

      this.token = token;
      this.port = us_socket_local_port(token);
    });

    return {
      _handle: true,
      close: this.close.bind(this),
    };
  }

  close(callback?: () => void): void {
    if (this.token) {
      us_listen_socket_close(this.token);
      this.token = null;
      this.port = null;
    }

    callback?.();
  }

  address(): { port: number } | null {
    return this.port !== null ? { port: this.port } : null;
  }
}

/**
 * Wraps a µExpress/uWebSockets.js instance into a `supertest`-compatible server.
 *
 * Supertest only requires `.listen()` and `.address()` on the app,
 * so this wrapper provides the minimal interface needed.
 *
 * @param app - µExpress, HyperExpress, or uWebSockets.js TemplatedApp instance.
 * @returns A Supertest instance.
 */
export function createUwsSupertest(app: SupportedUwsApp) {
  const wrapped = new AppWrapper(app);
  return supertest(wrapped as unknown as Parameters<typeof supertest>[0]);
}
