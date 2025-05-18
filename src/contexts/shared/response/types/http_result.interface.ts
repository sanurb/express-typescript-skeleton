import type { BaseProblem } from "../../problem/base_problem";

export interface ProblemDetails extends BaseProblem {}

export interface HttpSuccess<T> {
  readonly ok: true;
  readonly status: number;
  readonly data: T;
}

export interface HttpFailure {
  readonly ok: false;
  readonly status: number;
  readonly problem: ProblemDetails;
}

export type HttpResultType<T = unknown> = HttpSuccess<T> | HttpFailure;
