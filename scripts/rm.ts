/**
 * @fileoverview Deletes given paths recursively and forcibly.
 * Designed for use in build scripts and CI environments.
 */

import { rmSync } from "node:fs";
import { join } from "node:path";

const ROOT_DIR = process.cwd();
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("🛑 rm.ts: Expected at least one argument (path to delete).");
  process.exit(1);
}

for (const relativePath of args) {
  const absolutePath = join(ROOT_DIR, relativePath);

  rmSync(absolutePath, { recursive: true, force: true });

  console.log(`rm.ts: Deleted "${absolutePath}"`);
}
