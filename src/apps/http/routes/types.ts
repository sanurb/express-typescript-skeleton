import type { Registration } from "@reflet/express";
import type { Router as ExpressRouter } from "express";
import type { ROUTES } from "./registry";

export type RouteMapping = readonly [
  string,
  ExpressRouter | Registration.Class | Registration.Instance,
];

export type RouteKey = keyof typeof ROUTES;
export type RouteMeta = (typeof ROUTES)[RouteKey];
