import { Status } from "@reflet/http";
import type { Request, Response } from "express";

/** Responds with a 200 OK status and 'OK' message. */
export function getHealth(_req: Request, res: Response): void {
  res.status(Status.Ok).send("OK");
}
