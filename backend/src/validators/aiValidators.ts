import { z } from "zod";

export const GenerateSummarySchema = z.object({
  role: z.string().min(1).max(200),
  seniority: z.string().max(50).optional(),
  skills: z.string().max(500).optional(),
  existingSummary: z.string().max(2000).optional(),
});

export const ImproveBulletSchema = z.object({
  bullet: z.string().min(1).max(800),
  role: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
});

export const RewriteSectionSchema = z.object({
  section: z.enum(["summary", "experience", "projects", "skills"]),
  content: z.string().min(1).max(10000),
  context: z.string().max(500).optional(), // e.g. job role context
});

export const JobMatchSchema = z.object({
  jobDescription: z.string().min(20).max(8000),
  resumeText: z.string().min(20).max(20000),
});

export const ReviewResumeSchema = z.object({
  resumeText: z.string().min(10).max(20000),
  jobDescription: z.string().max(8000).optional(),
});

export const InterviewQuestionsSchema = z.object({
  resumeText: z.string().min(10).max(20000),
  jobDescription: z.string().max(8000).optional(),
  count: z.number().int().min(3).max(15).default(5),
});

export const ConvertImportedResumeSchema = z.object({
  resumeText: z.string().max(100000).optional(),
  layout: z.any().optional(),
  resumeId: z.string().uuid().optional(),
});

export type GenerateSummaryInput = z.infer<typeof GenerateSummarySchema>;
export type ImproveBulletInput = z.infer<typeof ImproveBulletSchema>;
export type RewriteSectionInput = z.infer<typeof RewriteSectionSchema>;
export type JobMatchInput = z.infer<typeof JobMatchSchema>;
export type ReviewResumeInput = z.infer<typeof ReviewResumeSchema>;
export type InterviewQuestionsInput = z.infer<typeof InterviewQuestionsSchema>;
export type ConvertImportedResumeInput = z.infer<typeof ConvertImportedResumeSchema>;
