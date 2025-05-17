/**
 * @fileoverview Injects traceId from a CorrelationContext.
 * Separated so you can plug in OpenTelemetry or a mock context.
 */

import type { CorrelationContext, LogEnricher } from "../types";
import type { LogRecord } from "../types";

export class CorrelationEnricher implements LogEnricher {
  constructor(private readonly ctx: CorrelationContext) {}

  public enrich(record: LogRecord): LogRecord {
    const traceId = this.ctx.getTraceId();
    // Only include traceId when available for lean records.
    return traceId ? { ...record, traceId } : record;
  }
}
