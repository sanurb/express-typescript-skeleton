import type { Express } from "express";
import { SecurityMiddlewareBuilder } from "../middleware/security_middleware_factory";

export function configureSecurity(app: Express): Express {
  return SecurityMiddlewareBuilder.create()
    .allowUnsafeEval() // for Swagger UI
    .withAllowedOrigins(["localhost:8080"])
    .inProduction() // forces HTTPS & CORS & mixed‐content block
    .build()
    .reduce((acc, mw) => mw(acc), app);
}
