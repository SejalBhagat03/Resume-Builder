import type { Request, Response, NextFunction } from "express";

/**
 * Lightweight structured request logger.
 * Logs method, path, status, and duration on response finish.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? "ERROR" : res.statusCode >= 400 ? "WARN" : "INFO";
    const timestamp = new Date().toISOString();

    console.log(
      JSON.stringify({
        level,
        timestamp,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userId: req.user?.id ?? null,
      }),
    );
  });

  next();
}
