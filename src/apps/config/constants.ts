export const EXPRESS_SETTINGS = {
  CATCH_ASYNC_ERRORS: "catch async errors",
  JSON_LIMIT: "100mb",
  URLENCODED_EXTENDED: true,
} as const;

export const REQUEST_ID_HEADER = "x-request-id" as const;

export const DEFAULT_CSP_DIRECTIVES = {
  defaultSrc: ["'self'"], // Only allow resources from same origin
  scriptSrc: ["'self'", "'unsafe-inline'"], // Required for Swagger UI
  styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for Swagger UI
  imgSrc: ["'self'", "data:", "https:"], // Allow images from same origin, data URIs, and HTTPS
  connectSrc: ["'self'"], // Allow API calls to same origin and frontends
  fontSrc: ["'self'", "https:", "data:"], // Allow fonts from same origin, HTTPS, and data URIs
  objectSrc: ["'none'"], // Block <object>, <embed>, and <applet> elements
  mediaSrc: ["'none'"], // Block media elements
  frameSrc: ["'none'"], // Block iframes
  frameAncestors: ["'none'"], // Prevent site from being embedded
  formAction: ["'self'"], // Only allow forms to submit to same origin
} as const;

/**
 * Any application-specific headers not in @reflet/http.
 */
export const CUSTOM_HEADERS = {
  PermissionsPolicy: "Permissions-Policy" as const,
};
