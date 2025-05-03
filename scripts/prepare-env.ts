/**
 * @fileoverview Ensures that a .env file exists by copying from
 * .env.local or .env.example in priority order.
 */

import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT_DIR = join(__dirname, "..");
const ENV_PATH = join(ROOT_DIR, ".env");

interface EnvCandidate {
  readonly path: string;
  readonly log: string;
}

const ENV_CANDIDATES: readonly EnvCandidate[] = [
  {
    path: join(ROOT_DIR, ".env.local"),
    log: "Copied .env.local → .env",
  },
  {
    path: join(ROOT_DIR, ".env.example"),
    log: "Copied .env.example → .env (please fill in missing values)",
  },
];

/**
 * Copies the first available environment template to `.env`, if it doesn't exist.
 */
export function prepareEnv(): void {
  if (existsSync(ENV_PATH)) return;

  const fallback = ENV_CANDIDATES.find(({ path }) => existsSync(path));

  if (fallback) {
    copyFileSync(fallback.path, ENV_PATH);
    console.log(fallback.log);
  } else {
    console.warn(
      "No .env, .env.local, or .env.example found. Skipping .env setup.",
    );
  }
}

prepareEnv();
