import type { Response } from "express";

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  code: string;
}

/**
 * Send a consistent success response.
 */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  res.status(statusCode).json({ success: true, data } satisfies SuccessResponse<T>);
}

/**
 * Send a consistent error response. Never exposes stack traces.
 */
export function sendError(res: Response, message: string, code: string, statusCode = 500): void {
  res.status(statusCode).json({ success: false, message, code } satisfies ErrorResponse);
}
