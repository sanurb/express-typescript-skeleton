/**
 * @fileoverview Utility for strictly converting string values into booleans.
 */

const BOOLEAN_LITERAL_MAP: Record<string, boolean> = {
  true: true,
  "1": true,
  yes: true,
  on: true,
  false: false,
  "0": false,
  no: false,
  off: false,
};

/**
 * Converts a string into its boolean equivalent if possible.
 *
 * @param input - A string to interpret as boolean.
 * @returns A boolean value corresponding to the input.
 * @throws {Error} If the string is not a valid boolean representation.
 */
export function castStringToBoolean(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  if (Object.prototype.hasOwnProperty.call(BOOLEAN_LITERAL_MAP, normalized)) {
    return BOOLEAN_LITERAL_MAP[normalized];
  }

  throw new Error(`Invalid boolean string: "${value}"`);
}
