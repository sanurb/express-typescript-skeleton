import type { JsonValue } from "type-fest";

export const LOG_LEVELS = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "silent",
] as const;

export type LogLevelAsType = typeof LOG_LEVELS;
export type LogLevel = LogLevelAsType[number];

export const LOG_FORMATS = ["json", "pretty"] as const;

export type LogFormatAsType = typeof LOG_FORMATS;
export type LogFormat = LogFormatAsType[number];

export const TRANSPORT_TYPES = ["console", "pino", "pretty"] as const;

export type TransportTypeAsType = typeof TRANSPORT_TYPES;
export type TransportType = TransportTypeAsType[number];

/**
 * Global logger configuration, validated at startup.
 */
export interface LoggerConfig {
  readonly level: LogLevel;
  readonly format: LogFormat;
  readonly transports: readonly TransportType[];
  readonly context?: string;
  /**
   * Optional overrides for per-transport levels.
   * If absent, transports inherit `level`.
   */
  readonly transportLevels?: Partial<Record<TransportType, LogLevel>>;
}

export type LogMeta = Record<string, JsonValue>;

/**
 * The raw data object before formatting.
 * This is the **single source of truth** for structured logging.
 */
export interface LogRecord {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly message: string;
  readonly meta: LogMeta | undefined;
  readonly context?: string;
  readonly traceId?: string;
}

/**
 * Builds a base LogRecord from inputs.
 * Isolated so timestamp and static fields can be tested/mocked.
 */
export interface LogRecordFactory {
  create(level: LogLevel, message: string, meta?: LogMeta): LogRecord;
}

/**
 * Enriches a LogRecord (e.g. add traceId, static context).
 * Runs before formatting so formatters need not know enrichment logic.
 */
export interface LogEnricher {
  enrich(record: LogRecord): LogRecord;
}

/**
 * Converts a LogRecord to a string for output.
 * Must be synchronous to avoid backpressure complexity in formatter.
 */
export interface Formatter {
  format(record: LogRecord): string;
}

/**
 * Receives formatted lines and handles I/O, buffering, errors.
 * Owns lifecycle (flush/shutdown).
 */
export interface Transport {
  /** Called on each formatted line. */
  log(formatted: string): void;

  /** Flush buffered writes (if any). */
  flush(): Promise<void>;

  /** Gracefully close underlying destinations. */
  shutdown(): Promise<void>;
}

/**
 * Orchestrates record creation, enrichment, level filtering, and dispatch.
 * Now adheres to SRP: no formatting or I/O here.
 */
export interface LogDispatcher {
  dispatch(record: LogRecord, formatted: string): void;
  flush(): Promise<void>;
  shutdown(): Promise<void>;
}

/**
 * Public API for application code.
 */
export interface Logger {
  trace(message: string, meta?: LogMeta): void;
  debug(message: string, meta?: LogMeta): void;
  info(message: string, meta?: LogMeta): void;
  warn(message: string, meta?: LogMeta): void;
  error(message: string, meta?: LogMeta): void;
  fatal(message: string, meta?: LogMeta): void;

  /** Create a child with additional static bindings (e.g. module name). */
  child(bindings: Record<string, JsonValue>): Logger;

  flush(): Promise<void>;
  shutdown(): Promise<void>;
  isLevelEnabled(level: LogLevel): boolean;
}

/**
 * Provides correlation IDs (e.g. OpenTelemetry). Decoupled for testing.
 */
export interface CorrelationContext {
  getTraceId(): string | undefined;
}
