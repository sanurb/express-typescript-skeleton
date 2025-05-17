/**
 * @fileoverview Formatter interface: pure log→string conversion.
 */

import type { LogRecord } from "../types";

export interface Formatter {
  format(record: LogRecord): string;
}
