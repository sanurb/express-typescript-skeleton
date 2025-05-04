import { HashSet } from "tstl";
import type { JsonObject, JsonPrimitive, JsonValue } from "type-fest";

/**
 * @param input  Any value you might pass to JSON.stringify.
 * @returns      A `JsonValue` with:
 *  - primitives unchanged,
 *  - Date → ISO string,
 *  - RegExp → toString(),
 *  - Map → object,
 *  - Set → array,
 *  - circular → "[Circular]",
 *  - functions/symbols/undefined → null.
 */
export function sanitizeForSerialization(input: unknown): JsonValue {
  const visited = new HashSet<object>();

  function recurse(value: unknown): JsonValue {
    // 1) Primitives
    if (
      value === null ||
      typeof value === "boolean" ||
      typeof value === "number" ||
      typeof value === "string"
    ) {
      return value as JsonPrimitive;
    }

    // 2) Dates & RegExps
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (value instanceof RegExp) {
      return value.toString();
    }

    // 3) Objects (including Arrays, Maps, Sets)
    if (typeof value === "object" && value !== null) {
      if (visited.has(value)) {
        return "[Circular]";
      }
      visited.insert(value);

      // — Arrays
      if (Array.isArray(value)) {
        const out: JsonValue[] = [];
        for (const el of value) {
          out.push(recurse(el));
        }
        return out; // JsonValue[] is a valid JsonArray
      }

      // — Map → object
      if (value instanceof Map) {
        const out: JsonObject = {};
        for (const [k, v] of value.entries()) {
          const key = typeof k === "string" ? k : JSON.stringify(k as unknown);
          out[key] = recurse(v);
        }
        return out;
      }

      // — Set → array
      if (value instanceof Set) {
        const out: JsonValue[] = [];
        for (const v of value.values()) {
          out.push(recurse(v));
        }
        return out;
      }

      // — Plain object
      const out: JsonObject = {};
      for (const key of Object.keys(value)) {
        out[key] = recurse((value as Record<string, unknown>)[key]);
      }
      return out;
    }

    // 4) Everything else → null
    return null;
  }

  return recurse(input);
}
