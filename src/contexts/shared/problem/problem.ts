/**
 * @fileoverview
 * Derives a discriminated Problem union from ProblemType & problemSpecs.
 */

import type { EmptyObject } from "type-fest";
import type { BaseProblem } from "./base_problem";
import type { problemSpecs } from "./problem_specs";
import type { ProblemType } from "./problem_types";

/**
 * CoreProblem ties a BaseProblem to a specific ProblemType key,
 * enforcing the correct 'status' and requiring 'detail'.
 */
type CoreProblem<T extends ProblemType> = BaseProblem & {
  readonly type: T;
  readonly status: (typeof problemSpecs)[T]["status"];
  readonly detail: string;
};

/**
 * Extras allows per-type extension.  If you need e.g. `errors` on
 * VALIDATION_FAILED, add it here.
 */
type Extras<T extends ProblemType> =
  T extends typeof ProblemType.VALIDATION_FAILED
    ? { readonly errors: ReadonlyArray<{ field: string; message: string }> }
    : EmptyObject;

/**
 * Our one true Problem union.  Exhaustive over all ProblemType entries.
 * Adding a new ProblemType + problemSpecs entry automatically flows into here.
 */
export type Problem = {
  [P in ProblemType]: CoreProblem<P> & Extras<P>;
}[ProblemType];
