import { AsyncLocalStorage } from "node:async_hooks";
import type { RequestContextStore } from "./types";

let currentContext: AsyncLocalStorage<unknown>;

export function context<T = RequestContextStore>(): AsyncLocalStorage<T> {
  if (currentContext === undefined) {
    currentContext = new AsyncLocalStorage<T>();
  }

  return currentContext as AsyncLocalStorage<T>;
}
