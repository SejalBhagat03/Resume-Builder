import { supabaseAdmin } from "../database/supabaseAdmin";
import { AppError } from "../utils/AppError";
import type {
  CreateResumeInput,
  UpdateResumeInput,
  ListResumesQuery,
} from "../validators/resumeValidators";

// ── Types matching the DB schema ──────────────────────────────────────────────

export interface DbResume {
  id: string;
  user_id: string;
  title: string;
  profile_type: string;
  template: string;
  data: Record<string, unknown>;
  ats_score: number;
  downloads: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Service functions ─────────────────────────────────────────────────────────

/**
 * List all non-deleted resumes owned by the user (paginated).
 */
export async function listResumes(
  userId: string,
  query: ListResumesQuery,
): Promise<{ resumes: DbResume[]; total: number }> {
  const { page, limit } = query;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from("resumes")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new AppError(`Failed to list resumes: ${error.message}`, 500, "DB_ERROR");
  }

  return { resumes: (data as DbResume[]) ?? [], total: count ?? 0 };
}

/**
 * Get a single resume by ID. Verifies ownership.
 */
export async function getResumeById(id: string, userId: string): Promise<DbResume> {
  const { data, error } = await supabaseAdmin
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .single();

  if (error || !data) {
    throw AppError.notFound("Resume not found");
  }

  return data as DbResume;
}

/**
 * Create a new resume for the user.
 */
export async function createResume(userId: string, input: CreateResumeInput): Promise<DbResume> {
  const { data, error } = await supabaseAdmin
    .from("resumes")
    .insert({
      user_id: userId,
      title: input.title,
      profile_type: input.profileType,
      template: input.template,
      data: input.data ?? {},
      ats_score: 60,
      downloads: 0,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError(`Failed to create resume: ${error?.message}`, 500, "DB_ERROR");
  }

  return data as DbResume;
}

/**
 * Update a resume by ID. Verifies ownership.
 * Saves a version snapshot in resume_versions before updating.
 */
export async function updateResume(
  id: string,
  userId: string,
  input: UpdateResumeInput,
): Promise<DbResume> {
  // 1. Fetch current to snapshot
  const current = await getResumeById(id, userId);

  // 2. Save version snapshot
  if (input.data !== undefined) {
    await supabaseAdmin.from("resume_versions").insert({
      resume_id: id,
      user_id: userId,
      data: current.data,
      note: input.versionNote ?? null,
    });
  }

  // 3. Build update payload
  const updatePayload: Record<string, unknown> = {};
  if (input.title !== undefined) updatePayload.title = input.title;
  if (input.profileType !== undefined) updatePayload.profile_type = input.profileType;
  if (input.template !== undefined) updatePayload.template = input.template;
  if (input.data !== undefined) updatePayload.data = input.data;
  if (input.atsScore !== undefined) updatePayload.ats_score = input.atsScore;
  if (input.downloads !== undefined) updatePayload.downloads = input.downloads;

  const { data, error } = await supabaseAdmin
    .from("resumes")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError(`Failed to update resume: ${error?.message}`, 500, "DB_ERROR");
  }

  return data as DbResume;
}

/**
 * Soft-delete a resume by setting deleted_at. Verifies ownership.
 */
export async function deleteResume(id: string, userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("resumes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new AppError(`Failed to delete resume: ${error.message}`, 500, "DB_ERROR");
  }
}

/**
 * Get version history for a resume. Verifies ownership.
 */
export async function getResumeVersions(
  resumeId: string,
  userId: string,
  limit = 20,
): Promise<unknown[]> {
  const { data, error } = await supabaseAdmin
    .from("resume_versions")
    .select("id, resume_id, note, created_at")
    .eq("resume_id", resumeId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new AppError(`Failed to get versions: ${error.message}`, 500, "DB_ERROR");
  }

  return data ?? [];
}
