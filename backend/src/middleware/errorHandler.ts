import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { sendError } from "../utils/responseHelper";
import { env } from "../config/env";

/**
 * Centralized error handler. Must be the last middleware registered.
 * Never exposes stack traces in production.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,

  _next: NextFunction,
): void {
  // Zod validation errors → 400
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    sendError(res, message, "VALIDATION_ERROR", 400);
    return;
  }

  // Known operational errors → use their status + code
  if (err instanceof AppError && err.isOperational) {
    sendError(res, err.message, err.code, err.statusCode);
    return;
  }

  // Unknown errors → log full error, return generic message
  console.error("[Unhandled Error]", {
    message: err.message,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  sendError(
    res,
    env.NODE_ENV === "development" ? err.message : "Internal server error",
    "INTERNAL_ERROR",
    500,
  );
}
