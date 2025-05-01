import responseTime from "response-time";
import { type Express, json, urlencoded } from "ultimate-express";
import express from "ultimate-express";
import { SGlobal } from "./SGlobal";
import { mountRoutes } from "./routes";

export const app: Express = express();
if (SGlobal.env.OPENAI_API_KEY === undefined)
  console.error("env.OPENAI_API_KEY is not defined.");

app.set("catch async errors", true);
app.set("port", SGlobal.env.PORT ?? 3000);

app.use(responseTime());
app.use(json({ limit: "100mb" }));
app.use(urlencoded({ extended: true }));

// only 1-level deep routers can be optimized
mountRoutes(app);
