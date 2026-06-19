import type { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { sendSuccess } from "../utils/responseHelper";
import {
  CreateResumeSchema,
  UpdateResumeSchema,
  ListResumesQuerySchema,
} from "../validators/resumeValidators";
import {
  listResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  getResumeVersions,
} from "../services/resumeService";

/** Extract a required string param — throws 400 if somehow an array */
function paramId(req: Request, name = "id"): string {
  const v = req.params[name];
  if (!v || Array.isArray(v)) throw AppError.badRequest(`Missing route parameter: ${name}`);
  return v;
}

/**
 * GET /api/resumes
 * List authenticated user's resumes with pagination.
 */
export async function list(req: Request, res: Response): Promise<void> {
  const query = ListResumesQuerySchema.parse(req.query);
  const result = await listResumes(req.user.id, query);
  sendSuccess(res, result);
}

/**
 * GET /api/resumes/:id
 * Get single resume (ownership verified).
 */
export async function getById(req: Request, res: Response): Promise<void> {
  const resume = await getResumeById(paramId(req), req.user.id);
  sendSuccess(res, { resume });
}

/**
 * POST /api/resumes
 * Create a new resume.
 */
export async function create(req: Request, res: Response): Promise<void> {
  const input = CreateResumeSchema.parse(req.body);
  const resume = await createResume(req.user.id, input);
  sendSuccess(res, { resume }, 201);
}

/**
 * PUT /api/resumes/:id
 * Update resume (auto-saves version snapshot).
 */
export async function update(req: Request, res: Response): Promise<void> {
  const input = UpdateResumeSchema.parse(req.body);
  const resume = await updateResume(paramId(req), req.user.id, input);
  sendSuccess(res, { resume });
}

/**
 * DELETE /api/resumes/:id
 * Soft-delete resume (sets deleted_at).
 */
export async function remove(req: Request, res: Response): Promise<void> {
  await deleteResume(paramId(req), req.user.id);
  sendSuccess(res, { deleted: true });
}

/**
 * GET /api/resumes/:id/versions
 * Get version history for a resume.
 */
export async function versions(req: Request, res: Response): Promise<void> {
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const data = await getResumeVersions(paramId(req), req.user.id, limit);
  sendSuccess(res, { versions: data });
}
