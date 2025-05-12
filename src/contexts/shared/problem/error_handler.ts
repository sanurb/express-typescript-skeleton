import type * as Http from "node:http";
import { isProduction } from "std-env";
import { logger } from "../logger";
import { AppError } from "./app_error";
import { isAppError, isNativeError } from "./type_guards";

let serverRef: Http.Server | undefined;

/**
 * Wire process-level error events to our handler.
 */
export function listenToProcessErrors(server: Http.Server): void {
  serverRef = server;
  process.on("uncaughtException", (e) => void handleError(e));
  process.on("unhandledRejection", (e) => void handleError(e));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

/**
 * Main orchestrator: normalize → report → (maybe) shutdown.
 * Returns the HTTP status to use in a response.
 */
export function handleError(error: unknown): AppError {
  const appError = normalizeError(error);
  report(appError);
  if (appError.isCatastrophic) {
    shutdown("catastrophic");
  }
  return appError;
}

/**
 * Coerce anything into an AppError.
 */
export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }
  if (isNativeError(error)) {
    return new AppError({
      type: "about:blank",
      title: error.message,
      status: 500,
      detail: isProduction ? undefined : error.stack,
      isCatastrophic: false,
    });
  }
  return new AppError({
    type: "about:blank",
    title: String(error),
    status: 500,
    isCatastrophic: false,
  });
}

/**
 * Structured logging (and metrics hook).
 */
function report(error: AppError): void {
  const problem = error.toProblem();
  logger.error("Problem occurred", { ...problem });
  // e.g. metrics.fire('error', { type: error.type, requestId: problem.extensions?.requestId });
}

/**
 * Tear down HTTP server and exit.
 */
function shutdown(reason: "SIGTERM" | "SIGINT" | "catastrophic"): void {
  logger.error(`Shutting down (${reason})`);
  if (serverRef) {
    serverRef.close();
  }
  process.exit(reason === "catastrophic" ? 1 : 0);
}
