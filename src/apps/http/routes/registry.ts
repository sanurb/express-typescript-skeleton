import { HealthRouter } from "@/apps/core/health/api/health_controller";
import { HEALTH_PATH } from "@/apps/core/health/api/health_paths";

export const ROUTES = {
  HEALTH: {
    path: HEALTH_PATH,
    router: HealthRouter,
  },
} as const;
