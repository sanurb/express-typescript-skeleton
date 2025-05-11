/**
 * @fileoverview
 * Defines the HTTP status code and any additional flags for each ProblemType.
 */

import { ProblemType } from "./problem_types";

interface Spec {
  readonly status: number;
}

/**
 * problemSpecs maps each ProblemType URI to its HTTP status code.
 * When adding a new ProblemType, extend this map accordingly.
 */
export const problemSpecs: Readonly<Record<ProblemType, Spec>> = {
  [ProblemType.HTTP_NO_CONTENT]: { status: 204 },
  [ProblemType.HTTP_BAD_REQUEST]: { status: 400 },
  [ProblemType.HTTP_UNAUTHORIZED]: { status: 401 },
  [ProblemType.HTTP_FORBIDDEN]: { status: 403 },
  [ProblemType.HTTP_NOT_FOUND]: { status: 404 },
  [ProblemType.HTTP_INTERNAL_SERVER_ERROR]: { status: 500 },
  [ProblemType.VALIDATION_FAILED]: { status: 422 },
} as const;
