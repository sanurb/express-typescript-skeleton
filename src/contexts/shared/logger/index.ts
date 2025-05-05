/**
 * @fileoverview Composition root: wires record factory, enrichers, formatter,
 * transports, and dispatcher into the public Logger API.
 */

import { Singleton } from "tstl";
import { DEFAULT_LOGGER_CONFIG, DEV_LOGGER_CONFIG } from "./constants";
import { defaultCorrelationContext } from "./correlation/CorrelationContext";
import { DefaultLogDispatcher } from "./dispatcher/LogDispatcher";
import { CorrelationEnricher } from "./enricher/CorrelationEnricher";
import { StaticContextEnricher } from "./enricher/StaticContextEnricher";
import { DefaultLogRecordFactory } from "./factory/LogRecordFactory";
import { JsonFormatter } from "./formatter/JsonFormatter";
import { PrettyFormatter } from "./formatter/PrettyFormatter";
import { isLevelEnabled } from "./level";
import { registerFormatter, resolveFormatter } from "./registry";
import { registerTransport, resolveTransport } from "./registry";
import { ConsoleTransport } from "./transport/ConsoleTransport";
import { PinoTransport } from "./transport/PinoTransport";
import { PrettyTransport } from "./transport/PrettyTransport";
import type {
  Formatter,
  LogEnricher,
  LogLevel,
  LogMeta,
  Logger,
  LoggerConfig,
  Transport,
} from "./types";

// --- Register built-ins ---
registerFormatter("json", () => new JsonFormatter());
registerFormatter("pretty", () => new PrettyFormatter());
(
  ConsoleTransport as unknown as typeof ConsoleTransport & {
    transportType: "console";
  }
).transportType = "console";
(
  PinoTransport as unknown as typeof PinoTransport & {
    transportType: "pino";
  }
).transportType = "pino";

registerTransport("console", () => new ConsoleTransport());
registerTransport("pino", () => new PinoTransport());
registerTransport(
  "pretty",
  () =>
    new PrettyTransport({
      translateTime: "SYS:standard",
    }),
);

export function createLogger(overrides?: Partial<LoggerConfig>): Logger {
  const base = { ...DEFAULT_LOGGER_CONFIG };
  if (process.env.NODE_ENV !== "production") {
    Object.assign(base, DEV_LOGGER_CONFIG);
  }
  const cfg = { ...base, ...overrides };
  const recordFactory = new DefaultLogRecordFactory();

  const enrichers: LogEnricher[] = [
    new StaticContextEnricher(cfg.context),
    new CorrelationEnricher(defaultCorrelationContext),
  ];

  const formatter: Formatter = resolveFormatter(cfg.format);
  const transports: Transport[] = cfg.transports.map((t) =>
    resolveTransport(t),
  );
  const dispatcher = new DefaultLogDispatcher(cfg, transports);

  function log(level: LogLevel, msg: string, meta?: LogMeta): void {
    if (!isLevelEnabled(level, cfg.level)) return;

    let rec = recordFactory.create(level, msg, meta);
    for (const e of enrichers) {
      rec = e.enrich(rec);
    }

    const formatted = formatter.format(rec);
    dispatcher.dispatch(rec, formatted);
  }

  const api: Logger = {
    trace: (m, md) => log("trace", m, md),
    debug: (m, md) => log("debug", m, md),
    info: (m, md) => log("info", m, md),
    warn: (m, md) => log("warn", m, md),
    error: (m, md) => log("error", m, md),
    fatal: (m, md) => log("fatal", m, md),

    child(_bindings: LogMeta): Logger {
      // You can push a child-specific enricher here if needed.
      return createLogger({ ...cfg });
    },

    isLevelEnabled(level: LogLevel): boolean {
      return isLevelEnabled(level, cfg.level);
    },

    flush: () => dispatcher.flush(),
    shutdown: () => dispatcher.shutdown(),
  };

  return api;
}

const loggerSingleton = new Singleton<Logger>(() => createLogger());
export const logger: Logger = loggerSingleton.get();
