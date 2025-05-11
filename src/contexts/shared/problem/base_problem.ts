/**
 * @fileoverview
 * RFC7807 core problem detail object.
 */

export interface BaseProblem {
  /** A URI identifying the problem’s type. */
  readonly type: string;

  /** Short, human-readable summary of the problem. */
  readonly title: string;

  /** HTTP status code for this problem. */
  readonly status?: number;

  /** Detailed, human-readable explanation. */
  readonly detail?: string;

  /** A URI reference that identifies the specific occurrence. */
  readonly instance?: string;

  /** Custom fields: requestId, retryable, tags, serviceId… */
  extensions?: Record<string, unknown>;
}
