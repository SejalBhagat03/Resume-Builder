import { z } from "zod";

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const EducationItemSchema = z.object({
  degree: z.string().max(200),
  school: z.string().max(200),
  year: z.string().max(50),
  cgpa: z.string().max(20).optional(),
});

const ExperienceItemSchema = z.object({
  role: z.string().max(200),
  company: z.string().max(200),
  period: z.string().max(100),
  bullets: z.array(z.string().max(500)).max(20),
});

const ProjectItemSchema = z.object({
  name: z.string().max(200),
  tools: z.string().max(500),
  bullets: z.array(z.string().max(500)).max(20),
});

const SkillItemSchema = z.object({
  category: z.string().max(100),
  items: z.string().max(1000),
});

const CustomizationSchema = z.object({
  accentColor: z.string().max(30).optional(),
  fontSize: z.enum(["sm", "md", "lg"]).optional(),
  spacing: z.enum(["sm", "md", "lg"]).optional(),
});

const ImportedPdfSchema = z.object({
  storagePath: z.string().optional(),
  pageCount: z.number().int().min(0),
  uploadedAt: z.string(),
});

const ResumeDataSchema = z.object({
  fullName: z.string().max(200).default(""),
  email: z.string().max(200).default(""),
  phone: z.string().max(50).default(""),
  location: z.string().max(200).default(""),
  summary: z.string().max(5000).default(""),
  website: z.string().max(300).optional().default(""),
  linkedin: z.string().max(300).optional().default(""),
  github: z.string().max(300).optional().default(""),
  education: z.array(EducationItemSchema).max(20).default([]),
  experience: z.array(ExperienceItemSchema).max(20).default([]),
  projects: z.array(ProjectItemSchema).max(20).default([]),
  skills: z.array(SkillItemSchema).max(30).default([]),
  certifications: z.array(z.string().max(500)).max(30).default([]),
  achievements: z.array(z.string().max(500)).max(30).default([]),
  languages: z.array(z.string().max(200)).max(30).default([]),
  publications: z.array(z.string().max(1000)).max(30).default([]),
  volunteer: z.array(z.string().max(1000)).max(30).default([]),
  customization: CustomizationSchema.optional(),
  importedLayout: z.any().optional(), // Large complex object — validated loosely
  rawText: z.string().max(100000).optional(),
  isVisualMode: z.boolean().optional(),
  importedPdf: ImportedPdfSchema.optional(),
});

// ── Request validators ────────────────────────────────────────────────────────

export const CreateResumeSchema = z.object({
  title: z.string().min(1).max(300).default("Untitled Resume"),
  profileType: z
    .enum(["fresh", "experienced", "internship", "academic", "custom"])
    .default("custom"),
  template: z
    .enum(["ats-professional", "modern", "minimal", "creative", "two-column"])
    .default("ats-professional"),
  data: ResumeDataSchema.optional(),
});

export const UpdateResumeSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  profileType: z.enum(["fresh", "experienced", "internship", "academic", "custom"]).optional(),
  template: z.enum(["ats-professional", "modern", "minimal", "creative", "two-column"]).optional(),
  data: ResumeDataSchema.optional(),
  atsScore: z.number().int().min(0).max(100).optional(),
  downloads: z.number().int().min(0).optional(),
  versionNote: z.string().max(500).optional(), // Optional label for the version snapshot
});

export const ListResumesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateResumeInput = z.infer<typeof CreateResumeSchema>;
export type UpdateResumeInput = z.infer<typeof UpdateResumeSchema>;
export type ListResumesQuery = z.infer<typeof ListResumesQuerySchema>;
