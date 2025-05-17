/**
 * @fileoverview Builds the base LogRecord.
 * Isolated for easy testing & mocking of timestamp logic.
 */

import type { LogLevel, LogMeta, LogRecord, LogRecordFactory } from "../types";

export class DefaultLogRecordFactory implements LogRecordFactory {
  public create(level: LogLevel, message: string, meta?: LogMeta): LogRecord {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
    };
  }
}
