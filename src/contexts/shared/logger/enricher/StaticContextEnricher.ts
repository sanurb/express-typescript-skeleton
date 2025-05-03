/**
 * @fileoverview Adds a static `context` field to every record.
 */

import type { LogEnricher } from "../types";
import type { LogRecord } from "../types";

export class StaticContextEnricher implements LogEnricher {
  constructor(private readonly context?: string) {}

  public enrich(record: LogRecord): LogRecord {
    // Only attach if provided, avoids extra JSON keys otherwise.
    return this.context ? { ...record, context: this.context } : record;
  }
}
