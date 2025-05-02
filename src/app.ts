import { type Express, json, urlencoded } from "express";
import express from "express";
import responseTime from "response-time";
import { env } from "./app/config/envs";
import { healthRouter } from "./app/health/api/health_router";

export const app: Express = express();

if (env.OPENAI_API_KEY === undefined)
  console.error("env.OPENAI_API_KEY is not defined.");

app.set("catch async errors", true);
app.set("port", env.PORT ?? 3000);

app.use(responseTime());
app.use(json({ limit: "100mb" }));
app.use(urlencoded({ extended: true }));

app.use("/api/health", healthRouter);
