import "dotenv/config"; // Must be first — loads .env before anything else
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env";
import { requestLogger } from "./middleware/requestLogger";
import { authMiddleware } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { generalLimiter, aiLimiter, uploadLimiter } from "./middleware/rateLimiter";

import resumeRoutes from "./routes/resumes";
import aiRoutes from "./routes/ai";
import uploadRoutes from "./routes/upload";

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, postman, curl)
      if (!origin) return callback(null, true);

      const allowed = [env.FRONTEND_URL];

      // In development, allow all variations of localhost/127.0.0.1
      if (env.NODE_ENV === "development") {
        const isLocal =
          origin.startsWith("http://localhost:") ||
          origin.startsWith("http://127.0.0.1:") ||
          origin.startsWith("https://localhost:") ||
          origin.startsWith("https://127.0.0.1:");
        if (isLocal) {
          return callback(null, true);
        }
      }

      if (allowed.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked] Origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ── Structured request logging ────────────────────────────────────────────────
app.use(requestLogger);

// ── Global rate limiting ──────────────────────────────────────────────────────
app.use(generalLimiter);

// ── Health check (public) ─────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    },
  });
});

// ── Authenticated routes ──────────────────────────────────────────────────────
// All /api/* routes require a valid Supabase JWT
app.use("/api/resumes", authMiddleware, resumeRoutes);
app.use("/api/ai", authMiddleware, aiLimiter, aiRoutes);
app.use("/api/upload", authMiddleware, uploadLimiter, uploadRoutes);

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    code: "NOT_FOUND",
  });
});

// ── Centralized error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`\n🚀 Resume Builder Backend running on http://localhost:${env.PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   Allowed origin: ${env.FRONTEND_URL}`);
  console.log(`   Supabase: ${env.SUPABASE_URL}`);
  console.log(`\n📋 API Endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /api/resumes`);
  console.log(`   POST /api/resumes`);
  console.log(`   PUT  /api/resumes/:id`);
  console.log(`   DELETE /api/resumes/:id`);
  console.log(`   POST /api/ai/generate-summary`);
  console.log(`   POST /api/ai/improve-bullet`);
  console.log(`   POST /api/ai/job-match`);
  console.log(`   POST /api/ai/review`);
  console.log(`   POST /api/ai/interview`);
  console.log(`   POST /api/ai/convert-imported-resume`);
  console.log(`   POST /api/upload/pdf\n`);
});

export default app;
