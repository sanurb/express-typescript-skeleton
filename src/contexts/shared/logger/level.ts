/**
 * @fileoverview Log‐level ordering and comparison helper.
 */

import { LOG_LEVELS, type LogLevel } from "./types";

/**
 * Returns true if `level` is at or above (i.e. as severe as)
 * the configured `minLevel`.
 */
export function isLevelEnabled(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(minLevel);
}
