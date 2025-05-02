import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Singleton } from "tstl";
import typia from "typia";

/**
 * Application environment configuration variables.
 */
export interface AppEnvironment {
  OPENAI_API_KEY?: string;
  PORT: `${number}`;
}

const environmentSingleton = new Singleton<AppEnvironment>(() => {
  const baseEnv = dotenv.config();
  dotenvExpand.expand(baseEnv);
  return typia.assert<AppEnvironment>(process.env);
});

export const env: AppEnvironment = environmentSingleton.get();
