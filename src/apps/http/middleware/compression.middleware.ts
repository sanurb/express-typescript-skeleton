/**
 * @fileoverview
 * Provides HTTP gzip compression middleware for Express.js applications.
 *
 * Compression is conditionally applied based on response size and
 * client request headers.
 *
 */

import compression from "compression";
import type { Request, Response } from "express";

/**
 * HTTP header used to explicitly disable gzip compression.
 *
 * If a request includes this header, compression will be bypassed,
 * regardless of response size or content type.
 *
 * Clients may use this header in cases where compression would add
 * unnecessary latency or CPU overhead, such as on low-powered devices
 * or mobile networks.
 *
 * @internal
 */
const HEADER_SKIP_COMPRESSION = "x-no-compression";

/**
 * Default gzip compression level used for HTTP responses.
 *
 * @defaultValue `6`
 * Level 6 provides a good balance between compression ratio
 * and CPU usage in production environments.
 *
 * See the Node.js `zlib` documentation for valid values and tradeoffs:
 * {@link https://nodejs.org/api/zlib.html#zlib-constants | Node.js zlib constants}.
 *
 * @remarks
 * Valid levels range from 0 (no compression) to 9 (maximum compression).
 */
const COMPRESSION_LEVEL_DEFAULT = 6;

/**
 * Minimum response size (in bytes) required to trigger compression.
 *
 * @defaultValue `1024`
 * Responses smaller than this threshold will not be compressed to
 * avoid wasting CPU cycles on marginal gains.
 *
 * @remarks
 * This setting reduces compression overhead for small responses where
 * the gzip header might exceed the actual payload savings.
 */
const COMPRESSION_THRESHOLD_BYTES = 1024;

/**
 * Determines whether gzip compression should be applied to a response.
 *
 * This function is passed to the Express `compression` middleware
 * as a custom filter. If the client request contains the
 * `x-no-compression` header, compression is skipped. Otherwise,
 * the default `compression.filter()` logic is used to decide.
 *
 * @param req - The incoming HTTP request object.
 * @param res - The outgoing HTTP response object.
 * @returns `true` if compression should be applied; otherwise `false`.
 *
 * @remarks
 * This is a defensive mechanism to let clients opt-out of compression
 * based on their own heuristics or context.
 *
 * @see {@link compression.filter} for the default behavior.
 *
 */
function shouldCompress(req: Request, res: Response): boolean {
  if (req.headers[HEADER_SKIP_COMPRESSION]) {
    return false;
  }

  return compression.filter(req, res);
}

/**
 * Express middleware for dynamic gzip compression of HTTP responses.
 *
 * This middleware selectively compresses response bodies over 1KB in size,
 * unless the client opts out via the `x-no-compression` header.
 *
 * @remarks
 * This middleware should be applied globally in production-grade APIs
 * and web applications to reduce bandwidth and improve perceived latency.
 *
 * @example
 * ```ts
 * import express from 'express';
 * import { compressionMiddleware } from './compression.middleware';
 *
 * const app = express();
 * app.use(compressionMiddleware);
 * ```
 *
 * @see {@link shouldCompress} for the compression filter logic.
 * @see {@link https://nodejs.org/api/zlib.html | Node.js zlib module documentation}
 *
 * @public
 */
export const compressionMiddleware = compression({
  filter: shouldCompress,
  level: COMPRESSION_LEVEL_DEFAULT,
  threshold: COMPRESSION_THRESHOLD_BYTES,
});
