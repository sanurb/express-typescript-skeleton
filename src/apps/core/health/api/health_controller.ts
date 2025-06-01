import { Get, Router, Send } from "@reflet/express";
import { UseStatus } from "@reflet/express-middlewares";
import { Status } from "@reflet/http";
import { HEALTH_PATH } from "./health_paths";

@Send()
@Router(HEALTH_PATH)
export class HealthRouter {
  @UseStatus(Status.Ok)
  @Get("/")
  getHealth(): string {
    return "OK";
  }
}
