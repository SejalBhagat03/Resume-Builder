import type { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../database/supabaseAdmin";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

// Extend Express Request to include the authenticated user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: {
        id: string;
        email?: string;
      };
    }
  }
}

/**
 * Authentication middleware.
 * Extracts the Bearer token from the Authorization header,
 * verifies it with Supabase, and attaches req.user.
 * Falls back to a mock user in development if auth fails.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  const handleDevFallback = (reason: string) => {
    if (env.NODE_ENV === "development") {
      console.info(`[Auth] Dev fallback active (${reason}). Using mock user.`);
      req.user = {
        id: "00000000-0000-0000-0000-000000000000",
        email: "dev-user@example.com",
      };
      next();
      return true;
    }
    return false;
  };

  if (!authHeader?.startsWith("Bearer ")) {
    if (handleDevFallback("No Bearer token provided")) return;
    next(AppError.unauthorized("Missing or malformed Authorization header"));
    return;
  }

  const token = authHeader.slice(7); // Remove "Bearer "

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      if (handleDevFallback(error ? error.message : "User not found")) return;
      next(AppError.unauthorized("Invalid or expired token"));
      return;
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };
    next();
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Verification exception";
    if (handleDevFallback(errMsg)) return;
    next(AppError.unauthorized("Token verification failed"));
  }
}
