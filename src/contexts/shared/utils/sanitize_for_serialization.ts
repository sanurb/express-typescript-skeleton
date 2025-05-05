/**
 * @fileoverview
 * Sanitizes arbitrary inputs into a JSON‐safe structure:
 *  - Primitives are passed through unchanged.
 *  - Dates ↦ ISO strings.
 *  - RegExps ↦ `.toString()`.
 *  - Maps ↦ plain objects.
 *  - Sets ↦ arrays.
 *  - Errors ↦ `{name,message,stack}`.
 *  - Circular references ↦ the string `"[Circular]"`.
 *  - Everything else unsupported (functions, symbols, BigInt, etc.) ↦ `null`.
 */

import { HashMap, HashSet } from "tstl";
import type {
  JsonArray,
  JsonObject,
  JsonPrimitive,
  JsonValue,
} from "type-fest";

type RecurseFn = (value: unknown) => JsonValue;
type Handler = (value: unknown, recurse: RecurseFn) => JsonValue;

/**
 * Returns the internal [[Class]] tag of any value.
 *
 * @param value The value to inspect.
 * @returns The tag, e.g. "[object Date]", "[object Map]", etc.
 */
function getObjectTag(value: unknown): string {
  return Object.prototype.toString.call(value);
}

/**
 * Initializes the dispatch table mapping [[Class]] tags to handlers.
 *
 * @returns A `HashMap` from tag to handler function.
 */
function createHandlers(): HashMap<string, Handler> {
  const table = new HashMap<string, Handler>();

  /** A read‐only list of `[tag, handler]` entries. */
  const entries: ReadonlyArray<readonly [string, Handler]> = [
    // Primitives & unsupported
    ["[object Boolean]", () => null],
    ["[object Number]", () => null],
    ["[object String]", () => null],
    ["[object Symbol]", () => null],
    ["[object BigInt]", () => null],
    ["[object Function]", () => null],

    // Built-ins
    ["[object Date]", (v) => (v as Date).toISOString()],
    ["[object RegExp]", (v) => (v as RegExp).toString()],

    // Arrays
    [
      "[object Array]",
      (v, recurse) => (v as Array<unknown>).map(recurse) as JsonArray,
    ],

    // Maps ↦ objects
    [
      "[object Map]",
      (v, recurse) => {
        const result: JsonObject = {};
        for (const [key, val] of v as Map<unknown, unknown>) {
          const k = typeof key === "string" ? key : JSON.stringify(key);
          result[k] = recurse(val);
        }
        return result;
      },
    ],

    // Sets ↦ arrays
    [
      "[object Set]",
      (v, recurse) => Array.from(v as Set<unknown>).map(recurse) as JsonArray,
    ],

    // Errors ↦ {name,message,stack}
    [
      "[object Error]",
      (v, recurse) => {
        const err = v as Error;
        const o: JsonObject = {
          name: err.name,
          message: err.message,
        };
        if (typeof err.stack === "string") {
          o.stack = err.stack;
        }
        return recurse(o);
      },
    ],

    // Plain objects (falls back to this if no tag matches)
    [
      "[object Object]",
      (v, recurse) => {
        const result: JsonObject = {};
        const obj = v as Record<string, unknown>;
        for (const key of Object.keys(obj)) {
          result[key] = recurse(obj[key]);
        }
        return result;
      },
    ],
  ];

  for (const [tag, fn] of entries) {
    table.emplace(tag, fn);
  }

  return table;
}

/**
 * @param input Any value you might pass to `JSON.stringify`.
 * @returns A `JsonValue` that is safe to feed to JSON.stringify:
 *   - cycles → `"[Circular]"`,
 *   - unsupported → `null`,
 *   - all other types handled per above.
 */
export function sanitizeForSerialization(input: unknown): JsonValue {
  const visited = new HashSet<object>();
  const handlers = createHandlers();

  /**
   * Recursively sanitizes a value, using our dispatch table and
   * cycle detection.
   *
   * @param value The value to sanitize.
   * @returns A JSON-compatible value.
   */
  function recurse(value: unknown): JsonValue {
    // 1) Primitives pass through.
    if (
      value === null ||
      typeof value === "boolean" ||
      typeof value === "number" ||
      typeof value === "string"
    ) {
      return value as JsonPrimitive;
    }

    // 2) Anything object‐like?
    if (typeof value === "object") {
      // 2a) Cycle guard
      if (value !== null) {
        if (visited.has(value)) {
          return "[Circular]";
        }
        visited.insert(value);
      }

      // 2b) Dispatch by [[Class]] tag
      const tag = getObjectTag(value);
      const iter = handlers.find(tag);

      if (!iter.equals(handlers.end())) {
        // `second` is the handler fn
        const out = iter.second(value, recurse);
        visited.erase(value as object);
        return out;
      }

      // 2c) Fallback: everything else → null
      visited.erase(value as object);
      return null;
    }

    // 3) Functions, symbols, bigint, undefined, etc. → null
    return null;
  }

  return recurse(input);
}
