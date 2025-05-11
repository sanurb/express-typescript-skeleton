/**
 * @fileoverview
 * Canonical URIs for all RFC7807 problem types used across the system.
 */

export const ProblemType = {
  HTTP_NO_CONTENT: "https://httpstatuses.io/204",
  HTTP_BAD_REQUEST: "https://httpstatuses.io/400",
  HTTP_UNAUTHORIZED: "https://httpstatuses.io/401",
  HTTP_FORBIDDEN: "https://httpstatuses.io/403",
  HTTP_NOT_FOUND: "https://httpstatuses.io/404",
  HTTP_INTERNAL_SERVER_ERROR: "https://httpstatuses.io/500",
  VALIDATION_FAILED: "https://httpstatuses.io/422",
} as const;

export type ProblemType = (typeof ProblemType)[keyof typeof ProblemType];
