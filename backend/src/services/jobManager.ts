import { supabaseAdmin } from "../database/supabaseAdmin";

export interface JobState {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  sections: {
    contact?: unknown;
    education?: unknown;
    experience?: unknown;
    projects?: unknown;
    skills?: unknown;
    certifications?: unknown;
    achievements?: unknown;
    languages?: unknown;
    publications?: unknown;
    volunteer?: unknown;
    uncategorized?: string[];
  };
  diagnostics?: {
    pages?: number;
    words?: number;
    mapped?: number;
    coverage?: number;
    omissions?: string[];
    preprocessedBlocks?: unknown[];
    ocrUsed?: boolean;
    parserUsed?: "docx" | "pdf_layout" | "gemini_ocr" | "raw_fallback";
    sectionFlags?: {
      detectedHeadings: string[];
      emptyParsedSections: string[];
      confidenceOverrides: Record<string, number>;
    };
  };
  error?: string;
  createdAt: number;
}

export const jobManager = {
  async createJob(userId: string, resumeId?: string): Promise<string> {
    const { data, error } = await supabaseAdmin
      .from("conversion_jobs")
      .insert({
        user_id: userId,
        resume_id: resumeId || null,
        status: "pending",
        progress: 0,
        sections: {},
        diagnostics: {},
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(`Failed to create conversion job: ${error?.message}`);
    }
    return data.id;
  },
  async getJob(id: string): Promise<JobState | undefined> {
    const { data, error } = await supabaseAdmin
      .from("conversion_jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return undefined;

    return {
      id: data.id,
      status: data.status as JobState["status"],
      progress: data.progress,
      sections: data.sections || {},
      diagnostics: data.diagnostics?.pages ? data.diagnostics : undefined,
      error: data.error || undefined,
      createdAt: new Date(data.created_at).getTime(),
    };
  },
  async updateJob(id: string, patch: Partial<JobState>): Promise<JobState | undefined> {
    const { data: current, error: fetchErr } = await supabaseAdmin
      .from("conversion_jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !current) return undefined;

    const mergedSections = {
      ...(current.sections || {}),
      ...(patch.sections || {}),
    };

    const mergedDiagnostics = patch.diagnostics
      ? {
          pages: patch.diagnostics.pages ?? current.diagnostics?.pages ?? 1,
          words: patch.diagnostics.words ?? current.diagnostics?.words ?? 0,
          mapped: patch.diagnostics.mapped ?? current.diagnostics?.mapped ?? 0,
          coverage: patch.diagnostics.coverage ?? current.diagnostics?.coverage ?? 0,
          omissions: patch.diagnostics.omissions ?? current.diagnostics?.omissions ?? [],
          preprocessedBlocks:
            patch.diagnostics.preprocessedBlocks ?? current.diagnostics?.preprocessedBlocks ?? [],
          ocrUsed: patch.diagnostics.ocrUsed ?? current.diagnostics?.ocrUsed ?? false,
          parserUsed:
            patch.diagnostics.parserUsed ?? current.diagnostics?.parserUsed ?? "raw_fallback",
          sectionFlags:
            patch.diagnostics.sectionFlags ?? current.diagnostics?.sectionFlags ?? undefined,
        }
      : current.diagnostics;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFields: Record<string, any> = {};
    if (patch.status !== undefined) updateFields.status = patch.status;
    if (patch.progress !== undefined) updateFields.progress = patch.progress;
    if (patch.error !== undefined) updateFields.error = patch.error;
    updateFields.sections = mergedSections;
    updateFields.diagnostics = mergedDiagnostics;

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from("conversion_jobs")
      .update(updateFields)
      .eq("id", id)
      .select("*")
      .single();

    if (updateErr || !updated) return undefined;

    return {
      id: updated.id,
      status: updated.status as JobState["status"],
      progress: updated.progress,
      sections: updated.sections || {},
      diagnostics: updated.diagnostics?.pages ? updated.diagnostics : undefined,
      error: updated.error || undefined,
      createdAt: new Date(updated.created_at).getTime(),
    };
  },
};
