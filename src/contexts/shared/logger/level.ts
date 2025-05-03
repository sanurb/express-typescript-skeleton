/**
 * @fileoverview Log‐level ordering and comparison helper.
 */

import type { LogLevel } from "./types";

/** Defines the order of log levels for comparisons. */
export const LOG_LEVELS: readonly LogLevel[] = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "silent",
] as const;

/**
 * Returns true if `level` is at or above (i.e. as severe as)
 * the configured `minLevel`.
 */
export function isLevelEnabled(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(minLevel);
}
