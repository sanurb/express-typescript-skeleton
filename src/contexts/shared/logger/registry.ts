/**
 * @fileoverview Plugin registries for formatters & transports.
 * Avoids switch/case to honor Open/Closed: new plugins register themselves.
 */

import type { Formatter, Transport, TransportType } from "./types";

const formatterMap = new Map<string, () => Formatter>();
export function registerFormatter(
  format: string,
  factory: () => Formatter,
): void {
  formatterMap.set(format, factory);
}
export function resolveFormatter(format: string): Formatter {
  const factory = formatterMap.get(format);
  if (!factory) {
    throw new Error(`Formatter not found: ${format}`);
  }
  return factory();
}

const transportMap = new Map<TransportType, () => Transport>();
export function registerTransport(
  type: TransportType,
  factory: () => Transport,
): void {
  transportMap.set(type, factory);
}
export function resolveTransport(type: TransportType): Transport {
  const factory = transportMap.get(type);
  if (!factory) {
    throw new Error(`Transport not found: ${type}`);
  }
  return factory();
}
