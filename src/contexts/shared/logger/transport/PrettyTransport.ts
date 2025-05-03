import type { DestinationStream } from "pino";
import prettyFactory from "pino-pretty";
import type { PrettyOptions } from "pino-pretty";
import type { Transport } from "../types";

export class PrettyTransport implements Transport {
  private readonly stream: DestinationStream;

  constructor(opts: Partial<PrettyOptions> = {}) {
    const defaults: PrettyOptions = {
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
      singleLine: false,
      // pretty prints synchronously so we never lose logs on exit
      sync: true,
    };

    this.stream = prettyFactory({ ...defaults, ...opts }) as DestinationStream;
  }

  public log(jsonLine: string): void {
    this.stream.write(`${jsonLine}\n`);
  }

  public async flush(): Promise<void> {
    // all writes are sync by default, so nothing to do
  }

  public async shutdown(): Promise<void> {
    // nothing to do here either
  }
}
