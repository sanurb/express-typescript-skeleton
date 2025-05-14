import type { UserConfig } from "@commitlint/types";

const config = {
  extends: ["@commitlint/config-conventional"],
  ignores: [
    (message) =>
      /Signed-off-by: dependabot\[bot]\s+<support@github\.com>$/m.test(message),
  ],
} satisfies UserConfig;

export default config;
