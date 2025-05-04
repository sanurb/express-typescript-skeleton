/**
 * @fileoverview JSON formatter for log records, using Typia for
 * AOT-compiled, cycle-safe serialization without runtime overhead.
 */

import typia from "typia";
import type { Formatter, LogRecord } from "../types";

/**
 * A closed, exact shape for log entries.  No index signatures,
 * unions, or intersections—ensures Typia’s generated code never throws.
 */
interface SerializableLog {
  readonly timestamp: string;
  readonly level: string;
  readonly message: string;
  readonly context?: string;
  readonly meta?: unknown;
}

/**
 * Formats a LogRecord into a newline-terminated JSON string.
 *
 * We pre-generate a Typia serializer for `SerializableLog` so that
 * serialization is zero-overhead (no `try`/`catch`, no fallback)
 * and handles cyclic structures safely.
 */
export class JsonFormatter implements Formatter {
  /** AOT-compiled stringify function for our exact record shape. */
  private static readonly assertStringify =
    typia.json.createAssertStringify<SerializableLog>();

  /**
   * @param record The raw log record.
   * @returns A single JSON document (with `\n`) ready for transport.
   */
  public format(record: LogRecord): string {
    const safe: SerializableLog = {
      timestamp: record.timestamp,
      level: record.level,
      message: record.message,
      context: record.context,
      meta: record.meta,
    };

    return `${JsonFormatter.assertStringify(safe)}\n`;
  }
}
