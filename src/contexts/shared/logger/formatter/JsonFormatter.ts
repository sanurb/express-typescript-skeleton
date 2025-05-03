/**
 * @fileoverview JSON formatter: outputs compact JSON lines.
 */

import type { LogRecord } from "../types";
import type { Formatter } from "./Formatter";

export class JsonFormatter implements Formatter {
  public format(record: LogRecord): string {
    return JSON.stringify(record);
  }
}
