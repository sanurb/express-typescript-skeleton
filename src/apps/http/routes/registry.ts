import { HealthRouter } from "@/apps/core/health/api/health_controller";

export const ROUTES = {
  HEALTH: {
    path: "/api/health",
    router: HealthRouter,
  },
} as const;
