/**
 * @fileoverview
 * Compose all application concerns and launch.
 */

import { env } from "./apps/config/envs";
import { ListhenBinding } from "./apps/http/server/binding/listhen-binding";
import { ExpressHttpServer } from "./apps/http/server/express-server";
import { castStringToBoolean } from "./contexts/shared/domain/parsing/string_to_boolean";
import { logger } from "./contexts/shared/logger";

export async function bootstrap(): Promise<ExpressHttpServer> {
  const binding = new ListhenBinding({
    port: env.PORT,
    hostname: env.HOST,
    https: castStringToBoolean(env.HTTPS),
    showURL: true,
    open: false,
    clipboard: false,
    qr: true,
  });

  const server = new ExpressHttpServer(env, binding);

  server.on("beforeStart", () => logger.info("Starting server…"));
  server.on("afterStart", () => {
    logger.info(`Server listening at ${server.getUrl()}`);
  });
  server.on("beforeStop", () => logger.info("Stopping server…"));
  server.on("afterStop", () => logger.info("Server stopped."));

  await server.start();
  return server;
}
