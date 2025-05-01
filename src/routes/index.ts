import type { Express } from "ultimate-express";
import { mountHealthRoutes } from "./health.route";

export const mountRoutes = (app: Express): void => {
  mountHealthRoutes(app);
};
