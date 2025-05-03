import { EventEmitter } from "tseep";
import type {
  LogDispatcher,
  LogLevel,
  LogRecord,
  LoggerConfig,
  Transport,
  TransportType,
} from "../types";

interface TransportEntry {
  readonly instance: Transport;
  readonly minLevel: LogLevel;
}

// Matches the `public static readonly transportType` on each class
interface TypedTransportConstructor {
  readonly transportType: TransportType;
}

export interface DispatcherEvents {
  transportError: (err: Error, transport: Transport) => void;
}

export class DefaultLogDispatcher
  extends EventEmitter
  implements LogDispatcher
{
  private readonly entries: readonly TransportEntry[];

  constructor(cfg: LoggerConfig, transports: readonly Transport[]) {
    super();
    this.entries = transports.map((t) => {
      const ctor = t.constructor as unknown as TypedTransportConstructor;
      const type = ctor.transportType;

      const minLevel = cfg.transportLevels?.[type] ?? cfg.level;
      return { instance: t, minLevel };
    });
  }

  public dispatch(record: LogRecord, formatted: string): void {
    for (const { instance, minLevel } of this.entries) {
      if (!this.shouldLog(record.level, minLevel)) continue;
      try {
        instance.log(formatted);
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        this.emit("transportError", error, instance);
      }
    }
  }

  public async flush(): Promise<void> {
    await Promise.all(this.entries.map((e) => e.instance.flush()));
  }

  public async shutdown(): Promise<void> {
    await Promise.all(this.entries.map((e) => e.instance.shutdown()));
  }

  private shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
    return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(minLevel);
  }
}
