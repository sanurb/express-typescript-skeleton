import { context } from "../global-context/context";
import type { BaseProblem } from "./base_problem";

/**
 * The sole “throwable” error in your app.
 * Always `throw new AppError({...})` and let the handler do the rest.
 */
export class AppError extends Error implements BaseProblem {
  public readonly type: string;
  public readonly title: string;
  public readonly status: number;
  public readonly detail?: string;
  public readonly instance?: string;
  public readonly isCatastrophic: boolean;

  constructor(params: {
    /** URI for problem type. */
    type: string;
    /** Human summary. */
    title: string;
    /** HTTP status. */
    status: number;
    /** Long form detail. */
    detail?: string;
    /** Unique occurrence URI. */
    instance?: string;
    /** Should this tear down the process? */
    isCatastrophic?: boolean;
  }) {
    super(params.title);
    this.type = params.type;
    this.title = params.title;
    this.status = params.status;
    this.detail = params.detail;
    this.instance = params.instance;
    this.isCatastrophic = params.isCatastrophic ?? false;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Serialize to an RFC7807 problem + attach context (requestId).
   */
  public toProblem(): BaseProblem {
    const store = context<{ requestId?: string }>().getStore?.();
    const extensions = store?.requestId
      ? { requestId: store.requestId }
      : undefined;

    const problem: BaseProblem = {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.detail,
      instance: this.instance,
      ...(extensions && { extensions }),
    };

    return problem;
  }
}

/**
 * Factory alias so you can `throw createAppError({...})` instead of `new`.
 */
export function createAppError(
  params: ConstructorParameters<typeof AppError>[0],
): AppError {
  return new AppError(params);
}
