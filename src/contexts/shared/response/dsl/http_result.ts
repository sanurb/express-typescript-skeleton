import { Status } from "@reflet/http";
import type { JsonValue } from "type-fest";

/**
 * Shared options for all HTTP results.
 */
export type HttpResultOptions = {
  readonly headers?: Readonly<Record<string, string>>;
  readonly meta?: Readonly<Record<string, JsonValue>>;
  readonly trace?: string;
  readonly extensions?: Readonly<Record<string, JsonValue>>;
};

/**
 * Represents a successful HTTP result.
 */
export type HttpResultOk<T> = {
  readonly type: "ok";
  readonly status: number;
  readonly data: T;
} & Readonly<Partial<HttpResultOptions>>;

/**
 * Represents a problem (error) HTTP result, following RFC7807.
 */
export type HttpResultProblem = {
  readonly type: "problem";
  readonly status: number;
  readonly title: string;
  readonly detail?: string;
} & Readonly<Partial<HttpResultOptions>>;

/**
 * Discriminated union of all possible HTTP results.
 */
export type HttpResult<T = unknown> = HttpResultOk<T> | HttpResultProblem;

/**
 * Factory for successful HTTP results.
 * @throws {Error} If status is not a valid 2xx or 3xx HTTP status code.
 */
export function createOkResult<T>(
  data: T,
  options?: HttpResultOptions & { status?: number },
): HttpResultOk<T> {
  const status = options?.status ?? Status.Ok;
  if (status < Status.Success.Ok || status >= Status.ClientError.BadRequest) {
    throw new Error(
      `Invalid status for ok result: ${status}. Must be 2xx or 3xx.`,
    );
  }
  return {
    type: "ok",
    status,
    data,
    ...options,
  };
}

/**
 * Factory for problem (error) HTTP results.
 * @throws {Error} If status is not a valid 4xx or 5xx HTTP status code, or if title is empty.
 */
export function createProblemResult(
  status: number,
  title: string,
  options?: Omit<HttpResultProblem, "type" | "status" | "title">,
): HttpResultProblem {
  if (status < Status.ClientError.BadRequest || status >= 600) {
    throw new Error(
      `Invalid status for problem result: ${status}. Must be 4xx or 5xx.`,
    );
  }
  if (!title || title.trim().length === 0) {
    throw new Error("Problem result title must be a non-empty string.");
  }
  return {
    type: "problem",
    status,
    title,
    ...options,
  };
}

/**
 * Map of standard error helpers for DRY generation.
 */
const errorHelpers: Record<
  "forbidden" | "unauthorized" | "notFound" | "badRequest",
  [number, string]
> = {
  forbidden: [Status.Forbidden, "Forbidden"],
  unauthorized: [Status.Unauthorized, "Unauthorized"],
  notFound: [Status.NotFound, "Not Found"],
  badRequest: [Status.BadRequest, "Bad Request"],
};

/**
 * Type for generated error helpers.
 */
type ErrorHelper = (
  detail?: string,
  options?: HttpResultOptions,
) => HttpResultProblem;

type HttpResultStatic = {
  ok: typeof createOkResult;
  problem: typeof createProblemResult;
} & {
  [K in keyof typeof errorHelpers]: ErrorHelper;
};

/**
 * Top-level helpers for common error semantics, auto-generated from errorHelpers map.
 */
export const HttpResult: HttpResultStatic = Object.entries(errorHelpers).reduce(
  (acc, [key, [status, title]]) => {
    (acc as Partial<HttpResultStatic>)[key as keyof typeof errorHelpers] = (
      detail?: string,
      options?: HttpResultOptions,
    ) => createProblemResult(status, title, { detail, ...options });
    return acc;
  },
  {
    ok: createOkResult,
    problem: createProblemResult,
  } as Partial<HttpResultStatic>,
) as HttpResultStatic;

/**
 * Pattern matching utility for HttpResult.
 */
export function matchHttpResult<T, U>(
  result: HttpResult<T>,
  handlers: {
    ok: (ok: HttpResultOk<T>) => U;
    problem: (problem: HttpResultProblem) => U;
  },
): U {
  return result.type === "ok" ? handlers.ok(result) : handlers.problem(result);
}

export type { JsonValue };
