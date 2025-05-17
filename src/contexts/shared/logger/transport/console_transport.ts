import type { Transport } from "../types";

export class ConsoleTransport implements Transport {
  /** Marker for DefaultLogDispatcher to pick up the type. */
  public static readonly transportType = "console" as const;

  public log(formatted: string): void {
    process.stdout.write(`${formatted}\n`);
  }
  public async flush(): Promise<void> {}
  public async shutdown(): Promise<void> {}
}
