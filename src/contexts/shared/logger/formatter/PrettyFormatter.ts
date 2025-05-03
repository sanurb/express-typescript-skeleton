/**
 * @fileoverview Human-readable formatter for development.
 */

import type { LogRecord } from "../types";
import type { Formatter } from "./Formatter";

export class PrettyFormatter implements Formatter {
  public format(record: LogRecord): string {
    const { timestamp, level, context, message, meta, traceId } = record;
    const parts: string[] = [`[${timestamp}]`, level.toUpperCase()];
    if (context) {
      parts.push(`[${context}]`);
    }
    if (traceId) {
      parts.push(`(trace=${traceId})`);
    }
    parts.push(message);
    if (meta) {
      parts.push("\n", JSON.stringify(meta, null, 2));
    }
    return parts.join(" ");
  }
}
