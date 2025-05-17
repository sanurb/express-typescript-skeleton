/**
 * @fileoverview Stub for correlation (e.g. OpenTelemetry, CLS).
 */

import type { CorrelationContext } from "../types";

/**
 * Default no-op context: always returns undefined.
 */
export const defaultCorrelationContext: CorrelationContext = {
  getTraceId(): string | undefined {
    return undefined;
  },
};
