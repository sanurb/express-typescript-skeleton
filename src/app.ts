import compression from "compression";
import responseTime from "response-time";
import { type Express, json, urlencoded } from "ultimate-express";
import express from "ultimate-express";
import { mountRoutes } from "./routes";

export const app: Express = express();

app.set("catch async errors", true);
app.set("port", process.env.PORT ?? 3000);

app.use(responseTime());
app.use(json({ limit: "100mb" }));
app.use(compression({ threshold: 1 }));
app.use(urlencoded({ extended: true }));

// only 1-level deep routers can be optimized
mountRoutes(app);
