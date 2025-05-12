import type { ErrorRequestHandler } from "express";
import { handleError } from "../../../contexts/shared/problem/error_handler";

/**
 * Minimal Express error middleware:
 * - delegates to handleError()
 * - serializes AppError via .toProblem()
 */
export const expressErrorMiddleware: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  const appError = handleError(err);
  // Send RFC7807 JSON
  res.status(appError.status).json(appError.toProblem());
};
