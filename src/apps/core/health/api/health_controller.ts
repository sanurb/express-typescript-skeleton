import { ROUTES } from "@/apps/http/routes/registry";
import { Get, Router, Send } from "@reflet/express";
import { UseStatus } from "@reflet/express-middlewares";
import { Status } from "@reflet/http";

@Send()
@Router(ROUTES.HEALTH.path)
export class HealthRouter {
  @UseStatus(Status.Ok)
  @Get("/")
  getHealth(): string {
    return "OK";
  }
}
