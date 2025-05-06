/**
 * @fileoverview Application setup: wires config, HTTP server, and process signals.
 */

import { env } from "./apps/config/envs";
import { ExpressHttpServer } from "./apps/http/server/express-server";
import { logger } from "./contexts/shared/logger";

/** Compose all application concerns and launch. */
export async function bootstrap(): Promise<ExpressHttpServer> {
  const server = new ExpressHttpServer(env);

  server.on("beforeStart", () => logger.info("Starting server..."));
  server.on("afterStart", () =>
    logger.info(`Server listening on port ${env.PORT}`),
  );
  server.on("beforeStop", () => logger.info("Stopping server…"));
  server.on("afterStop", () => logger.info("Server stopped."));

  await server.start();
  return server;
}
