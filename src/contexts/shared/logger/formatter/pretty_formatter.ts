/**
 * @fileoverview Human-readable formatter for development.
 */

import type { JsonValue } from "type-fest";
import typia from "typia";

import { sanitizeForSerialization } from "../../utils/sanitize_for_serialization";

import type { LogRecord } from "../types";
import type { Formatter } from "./formatter.interface";
import type { SerializableLog } from "./serializable_log.interface";

/**
 * Developer-friendly formatter with structured meta output.
 */
export class PrettyFormatter implements Formatter {
  /** AOT-compiled Typia serializer for validated output. */
  private static readonly assertStringify =
    typia.json.createAssertStringify<SerializableLog>();

  public constructor(
    private readonly sanitize: (
      input: unknown,
    ) => JsonValue = sanitizeForSerialization,
  ) {}

  public format(record: LogRecord): string {
    const { timestamp, level, context, message, meta, traceId } = record;

    const baseParts = [
      `[${timestamp}]`,
      level.toUpperCase(),
      context && `[${context}]`,
      traceId && `(trace=${traceId})`,
      message,
    ].filter(Boolean) as string[];

    const safeRecord: SerializableLog = {
      timestamp,
      level,
      context,
      message,
      meta: meta !== undefined ? this.sanitize(meta) : undefined,
    };

    const serializedMeta = meta && PrettyFormatter.assertStringify(safeRecord);

    return [
      ...baseParts,
      ...(serializedMeta ? [`\n${serializedMeta}`] : []),
    ].join(" ");
  }
}
