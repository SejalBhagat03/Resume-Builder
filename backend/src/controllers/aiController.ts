import type { Request, Response } from "express";
import { z } from "zod";
import { sendSuccess } from "../utils/responseHelper";
import { AppError } from "../utils/AppError";
import { jobManager } from "../services/jobManager";
import {
  GenerateSummarySchema,
  ImproveBulletSchema,
  RewriteSectionSchema,
  JobMatchSchema,
  ReviewResumeSchema,
  InterviewQuestionsSchema,
  ConvertImportedResumeSchema,
} from "../validators/aiValidators";
import {
  generateSummary,
  improveBullet,
  rewriteSection,
  jobMatch,
  reviewResume,
  generateInterviewQuestions,
  convertImportedResume,
  runConvertJob,
  suggestSkills,
} from "../services/aiService";

/**
 * POST /api/ai/generate-summary
 */
export async function handleGenerateSummary(req: Request, res: Response): Promise<void> {
  const input = GenerateSummarySchema.parse(req.body);
  const result = await generateSummary(input, req.user.id);
  sendSuccess(res, result);
}

/**
 * POST /api/ai/improve-bullet
 */
export async function handleImproveBullet(req: Request, res: Response): Promise<void> {
  const input = ImproveBulletSchema.parse(req.body);
  const result = await improveBullet(input, req.user.id);
  sendSuccess(res, result);
}

/**
 * POST /api/ai/rewrite-section
 */
export async function handleRewriteSection(req: Request, res: Response): Promise<void> {
  const input = RewriteSectionSchema.parse(req.body);
  const result = await rewriteSection(input, req.user.id);
  sendSuccess(res, result);
}

/**
 * POST /api/ai/job-match
 */
export async function handleJobMatch(req: Request, res: Response): Promise<void> {
  const input = JobMatchSchema.parse(req.body);
  const result = await jobMatch(input, req.user.id);
  sendSuccess(res, result);
}

/**
 * POST /api/ai/review
 */
export async function handleReview(req: Request, res: Response): Promise<void> {
  const input = ReviewResumeSchema.parse(req.body);
  const result = await reviewResume(input, req.user.id);
  sendSuccess(res, result);
}

/**
 * POST /api/ai/interview
 */
export async function handleInterview(req: Request, res: Response): Promise<void> {
  const input = InterviewQuestionsSchema.parse(req.body);
  const result = await generateInterviewQuestions(input, req.user.id);
  sendSuccess(res, result);
}

/**
 * POST /api/ai/convert-imported-resume
 */
export async function handleConvertImported(req: Request, res: Response): Promise<void> {
  const input = ConvertImportedResumeSchema.parse(req.body);
  const result = await convertImportedResume(input, req.user.id);
  sendSuccess(res, result);
}

/**
 * POST /api/ai/suggest-skills
 */
export async function handleSuggestSkills(req: Request, res: Response): Promise<void> {
  const schema = z.object({
    role: z.string().min(1).max(200),
    currentSkills: z.string().max(2000).optional(),
  });
  const input = schema.parse(req.body);
  const result = await suggestSkills(input, req.user.id);
  sendSuccess(res, result);
}

/**
 * POST /api/ai/convert-jobs
 */
export async function handleCreateConvertJob(req: Request, res: Response): Promise<void> {
  const input = ConvertImportedResumeSchema.parse(req.body);
  const jobId = await jobManager.createJob(req.user.id, input.resumeId);

  // Launch the parsing job in the background (non-blocking)
  runConvertJob(jobId, input, req.user.id).catch(async (err) => {
    console.error(`[Background Job Error] Job ${jobId} failed:`, err);
    await jobManager.updateJob(jobId, {
      status: "failed",
      error: err instanceof Error ? err.message : "Failed to parse resume",
    });
  });

  sendSuccess(res, { jobId });
}

/**
 * GET /api/ai/convert-jobs/:id
 */
export async function handleGetConvertJob(req: Request, res: Response): Promise<void> {
  const job = await jobManager.getJob(req.params.id as string);
  if (!job) {
    throw new AppError("Job not found", 404, "JOB_NOT_FOUND");
  }
  sendSuccess(res, job);
}
