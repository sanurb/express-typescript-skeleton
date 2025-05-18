import type { ProblemDetails } from "../types/http_result.interface";

export const buildProblemDetails = (
  status: number,
  title: string,
  detail?: string,
  extensions?: ProblemDetails["extensions"],
  type = "about:blank",
  instance?: string,
): ProblemDetails => ({
  type,
  title,
  status,
  detail,
  instance,
  extensions,
});
