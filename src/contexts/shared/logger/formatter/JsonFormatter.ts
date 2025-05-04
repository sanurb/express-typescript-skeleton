/**
 * @fileoverview
 * Formats a LogRecord as a newline-terminated JSON string,
 * sanitizing cycles in `meta` before feeding into Typia’s AOT serializer.
 */

import type { JsonValue } from "type-fest";
import typia from "typia";
import { sanitizeForSerialization } from "../../utils/sanitize_for_serialization";
import type { LogRecord } from "../types";
import type { Formatter } from "./Formatter";

interface SerializableLog {
  readonly timestamp: string;
  readonly level: string;
  readonly message: string;
  readonly context?: string;
  readonly meta?: unknown;
}

/**
 * JSON formatter that applies cycle-safe sanitization to `meta`,
 * then uses a precompiled Typia serializer to emit stable JSON.
 */
export class JsonFormatter implements Formatter {
  /** AOT-compiled, Type‐safe stringify for our exact record shape. */
  private static readonly assertStringify =
    typia.json.createAssertStringify<SerializableLog>();

  /**
   * @param sanitizer
   *   A function that removes cycles and non-JSONable values,
   *   producing a JsonValue. Defaults to our reusable helper.
   */
  public constructor(
    private readonly sanitizer: (
      v: unknown,
    ) => JsonValue = sanitizeForSerialization,
  ) {}

  /**
   * @param record The raw log record.
   * @returns A single JSON document (ending in `\n`) for transport.
   */
  public format(record: LogRecord): string {
    const sanitizedMeta =
      record.meta === undefined ? undefined : this.sanitizer(record.meta);

    const safeRecord: SerializableLog = {
      timestamp: record.timestamp,
      level: record.level,
      message: record.message,
      context: record.context,
      meta: sanitizedMeta,
    };

    return `${JsonFormatter.assertStringify(safeRecord)}\n`;
  }
}
