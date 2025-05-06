import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { context } from "../../../contexts/shared/global-context/context";

/**
 * This is an express middleware that:
 * - Generate/Use request id (depending on if you already have one in the request header)
 * - Add it to the request context
 *
 * **Important:** this should be your first middleware
 */

const REQUEST_ID_HEADER = "x-request-id";

function sanitizeRequestId(rawHeader: string | string[] | undefined): string {
  if (typeof rawHeader === "string") return rawHeader;
  if (Array.isArray(rawHeader)) return rawHeader[0];
  return randomUUID();
}

export function addRequestId(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): void {
  const requestId = sanitizeRequestId(req.headers[REQUEST_ID_HEADER]);

  req.headers[REQUEST_ID_HEADER] = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  const currentStore = context().getStore();

  if (currentStore) {
    currentStore.requestId = requestId;
    next();
    return;
  }

  context().run({ requestId }, next);
}
