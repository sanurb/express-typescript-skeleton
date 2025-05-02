import { Router } from "express";
import { getHealth } from "./health_controller";

const healthRouter = Router();

healthRouter.get("/", getHealth);

export { healthRouter };
