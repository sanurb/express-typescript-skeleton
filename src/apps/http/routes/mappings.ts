import { ROUTES } from "./registry";
import type { RouteMapping } from "./types";

export const ROUTE_MAPPINGS: RouteMapping[] = Object.values(ROUTES).map(
  ({ path, router }) => [path, router],
);
