import type { AppError } from "./app_error";

/**
 * Type guard: checks if value is an AppError.
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "status" in error &&
    "title" in error &&
    "isCatastrophic" in error
  );
}

/**
 * Type guard: checks if value is a native Error.
 */
export function isNativeError(value: unknown): value is Error {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
}
