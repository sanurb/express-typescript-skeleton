import type { LoggerConfig } from "./types";

export const DEFAULT_LOGGER_CONFIG = {
  level: "info",
  format: "json",
  transports: ["console"],
  context: "core",
  transportLevels: {
    console: "debug",
    pino: "info",
  },
} satisfies LoggerConfig;

export const DEV_LOGGER_CONFIG: Partial<LoggerConfig> = {
  format: "pretty",
  transports: ["pretty"],
};
