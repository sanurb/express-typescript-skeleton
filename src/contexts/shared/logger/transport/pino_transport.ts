import pino from "pino";
import type { Transport } from "../types";

export class PinoTransport implements Transport {
  public static readonly transportType = "pino" as const;

  private readonly dest = pino.destination({ sync: false });

  public log(formatted: string): void {
    this.dest.write(`${formatted}\n`);
  }
  public async flush(): Promise<void> {
    this.dest.flushSync();
  }
  public async shutdown(): Promise<void> {
    this.dest.end();
  }
}
