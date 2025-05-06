/**
 * @fileoverview
 * Fluent builder for security‐focused Express middleware:
 *  • Helmet with CSP, HSTS, etc.
 *  • Custom security headers
 *  • Optional CORS
 */

import { CUSTOM_HEADERS, DEFAULT_CSP_DIRECTIVES } from "@apps/config/constants";
import { RequestHeader, ResponseHeader } from "@reflet/http";
import type { NextFunction, Request, Response } from "express";
import helmet, { type HelmetOptions } from "helmet";
import { disable, use } from "../middleware";
import type { Middleware } from "../types";

/**
 * Builds an array of security middleware steps, with
 * low coupling (each concern isolated) and high cohesion.
 */
export class SecurityMiddlewareBuilder {
  private readonly cspDirectives: Record<string, string[]>;
  private readonly helmetOptions: HelmetOptions;
  private allowedOrigins: string[] = [];
  private prodMode = false;

  private constructor() {
    // Clone default CSP directives into mutable arrays.
    this.cspDirectives = Object.fromEntries(
      Object.entries(DEFAULT_CSP_DIRECTIVES).map(([key, arr]) => [
        key,
        [...arr],
      ]),
    );

    this.helmetOptions = {
      contentSecurityPolicy: {
        directives: this.cspDirectives,
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin" },
      crossOriginResourcePolicy: { policy: "same-origin" },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: "deny" },
      hsts: {
        maxAge: 31_536_000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      permittedCrossDomainPolicies: { permittedPolicies: "none" },
      referrerPolicy: { policy: "no-referrer" },
      xssFilter: true,
    };
  }

  /**
   * Start a new builder.
   */
  public static create(): SecurityMiddlewareBuilder {
    return new SecurityMiddlewareBuilder();
  }

  /**
   * Allow `'unsafe-eval'` in our CSP (e.g. for Swagger UI).
   */
  public allowUnsafeEval(): this {
    this.cspDirectives.scriptSrc.push("'unsafe-eval'");
    return this;
  }

  /**
   * Whitelist origins for CSP `connect-src` and CORS.
   */
  public withAllowedOrigins(origins: readonly string[]): this {
    this.allowedOrigins = [...origins];
    this.cspDirectives.connectSrc.push(...this.allowedOrigins);
    return this;
  }

  /**
   * Enable production‐only enhancements:
   *  • upgradeInsecureRequests
   *  • blockAllMixedContent
   *  • CORS
   */
  public inProduction(): this {
    this.prodMode = true;
    this.cspDirectives.upgradeInsecureRequests = [];
    this.cspDirectives.blockAllMixedContent = [];
    return this;
  }

  /**
   * Assemble the final middleware array.
   */
  public build(): readonly Middleware[] {
    const steps: Middleware[] = [];

    /**
     * Disables the `X-Powered-By` header.
     * Prevents fingerprinting.
     * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#recommendation_16}
     */
    steps.push(disable(ResponseHeader.XPoweredBy));

    // Helmet core (CSP, HSTS, etc.)
    steps.push(use(helmet(this.helmetOptions)));

    // Custom headers (Permissions-Policy, X-Frame-Options…)
    steps.push(use(this.addCustomHeaders));

    // Conditional CORS in prod
    if (this.prodMode && this.allowedOrigins.length > 0) {
      steps.push(use(this.addCorsHeader));
    }

    return steps;
  }

  /**
   * @internal
   * Adds extra headers not covered by Helmet.
   */
  private addCustomHeaders(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    res.setHeader(
      CUSTOM_HEADERS.PermissionsPolicy,
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
    );
    res.setHeader(ResponseHeader.XContentTypeOptions, "nosniff");
    res.setHeader(ResponseHeader.XFrameOptions, "DENY");
    next();
  }

  /**
   * @internal
   * Only allow our configured origins through CORS.
   */
  private addCorsHeader(req: Request, res: Response, next: NextFunction): void {
    const origin = req.header(RequestHeader.Origin);

    if (origin !== undefined && this.allowedOrigins.includes(origin)) {
      res.setHeader(ResponseHeader.AccessControlAllowOrigin, origin);
    }

    next();
  }
}
