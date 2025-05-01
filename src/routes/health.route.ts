import type { Express } from "ultimate-express";
import { getHealth } from "../controllers/health_controller";

export const mountHealthRoutes = (app: Express): void => {
  app.get("/health", getHealth);
};
