/**
 * @fileoverview Entrypoint: bootstrap app and handle OS signals.
 */

import { bootstrap } from "./app";

void (async (): Promise<void> => {
  const server = await bootstrap();

  for (const sig of ["SIGINT", "SIGTERM", "SIGUSR2"] as const) {
    process.on(sig, async () => {
      try {
        await server.stop();
      } finally {
        process.exit();
      }
    });
  }
})();
