/**
 * AI functions — all calls go to the backend /api/ai/* endpoints.
 * The function signatures are kept identical to the previous version so
 * no other frontend code needs to change.
 *
 * The Gemini API key is never used here — it lives securely in the backend.
 */
import { apiClient } from "./apiClient";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RewriteBulletInput {
  bullet: string;
  role?: string;
}

export interface GenerateSummaryInput {
  role: string;
  seniority?: string;
  skills?: string;
  existingSummary?: string;
}

export interface JobMatchInput {
  jobDescription: string;
  resumeText: string;
}

export interface JobMatchResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
}

export interface SuggestSkillsInput {
  role: string;
  currentSkills?: string;
}

export interface ParseResumeInput {
  resumeText: string;
}

export interface ParsedResume {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: Array<{ degree: string; school: string; year: string; cgpa?: string }>;
  experience: Array<{ role: string; company: string; period: string; bullets: string[] }>;
  projects: Array<{ name: string; tools: string; bullets: string[] }>;
  skills: Array<{ category: string; items: string }>;
}

// ── TanStack Start compatibility shim ─────────────────────────────────────────
// The old API used createServerFn which returned a function taking { data: input }.
// We replicate that shape so call sites don't need to change.

function serverFnCompat<TInput, TOutput>(
  backendPath: string,
): (args: { data: TInput }) => Promise<TOutput> {
  return async ({ data }: { data: TInput }) => {
    return apiClient.post<TOutput>(backendPath, data);
  };
}

// ── Exported functions (same signatures as before) ────────────────────────────

/**
 * Rewrite a single resume bullet with stronger action verb and quantified impact.
 * Backend: POST /api/ai/improve-bullet
 */
export const rewriteBullet = serverFnCompat<RewriteBulletInput, { bullet: string }>(
  "/ai/improve-bullet",
);

/**
 * Generate a professional resume summary.
 * Backend: POST /api/ai/generate-summary
 */
export const generateSummary = serverFnCompat<GenerateSummaryInput, { summary: string }>(
  "/ai/generate-summary",
);

/**
 * Match resume against a job description and get ATS score + keywords.
 * Backend: POST /api/ai/job-match
 */
export const matchJobDescription = serverFnCompat<JobMatchInput, JobMatchResult>("/ai/job-match");

/**
 * Suggest missing skills for a given role.
 * Backend: POST /api/ai/suggest-skills
 */
export const suggestSkills = serverFnCompat<SuggestSkillsInput, { skills: string[] }>(
  "/ai/suggest-skills",
);

/**
 * Parse raw resume text into structured data for the native editor.
 * Backend: POST /api/ai/convert-imported-resume
 */
export const parseResumeStructure = serverFnCompat<ParseResumeInput, ParsedResume>(
  "/ai/convert-imported-resume",
);

/**
 * Get tailored interview questions based on the resume.
 * Backend: POST /api/ai/interview
 */
export const getInterviewQuestions = serverFnCompat<
  { resumeText: string; jobDescription?: string; count?: number },
  { questions: Array<{ question: string; tip: string; category: string }> }
>("/ai/interview");

/**
 * Full ATS-style review of the resume.
 * Backend: POST /api/ai/review
 */
export const reviewResume = serverFnCompat<
  { resumeText: string; jobDescription?: string },
  {
    atsScore: number;
    readability: number;
    keywordCoverage: number;
    items: Array<{ kind: "good" | "warn" | "tip"; message: string }>;
    strongest: string;
    suggestions: string[];
  }
>("/ai/review");

/**
 * Rewrite an entire resume section.
 * Backend: POST /api/ai/rewrite-section
 */
export const rewriteSection = serverFnCompat<
  { section: string; content: string; context?: string },
  { content: string }
>("/ai/rewrite-section");
