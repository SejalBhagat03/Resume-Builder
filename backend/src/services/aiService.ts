import { generateText, generateJSON, generateMultimodalText } from "../ai/gemini";
import { supabaseAdmin } from "../database/supabaseAdmin";
import { env } from "../config/env";
import { jobManager } from "./jobManager";
import * as mammoth from "mammoth";
import type {
  GenerateSummaryInput,
  ImproveBulletInput,
  RewriteSectionInput,
  JobMatchInput,
  ReviewResumeInput,
  InterviewQuestionsInput,
  ConvertImportedResumeInput,
} from "../validators/aiValidators";

// ── Helper to log AI usage ─────────────────────────────────────────────────────

async function logAiUsage(userId: string, action: string, resumeId?: string): Promise<void> {
  try {
    await supabaseAdmin.from("ai_history").insert({
      user_id: userId,
      resume_id: resumeId ?? null,
      action,
    });
  } catch {
    // Non-critical — don't fail the request if logging fails
  }
}

// ── AI Service Functions ───────────────────────────────────────────────────────

/**
 * Generate a professional resume summary using Gemini.
 */
export async function generateSummary(
  input: GenerateSummaryInput,
  userId: string,
): Promise<{ summary: string }> {
  const prompt = [
    `Target role: ${input.role}`,
    `Seniority: ${input.seniority ?? "mid-level"}`,
    input.skills ? `Key skills: ${input.skills}` : null,
    input.existingSummary ? `Existing summary (for context): ${input.existingSummary}` : null,
    "",
    "Write a 2–3 sentence professional resume summary tailored to this role.",
    "Rules: No first-person pronouns. ATS-friendly. Concise. Strong opening.",
    "Return ONLY the summary text, no preamble or explanation.",
  ]
    .filter(Boolean)
    .join("\n");

  const text = await generateText(prompt, {
    systemInstruction:
      "You are an expert resume coach who writes concise, high-impact, ATS-optimized resume summaries.",
    temperature: 0.7,
    maxOutputTokens: 300,
  });

  await logAiUsage(userId, "generate-summary");
  return { summary: text };
}

/**
 * Rewrite a single resume bullet point with stronger action verb and quantified impact.
 */
export async function improveBullet(
  input: ImproveBulletInput,
  userId: string,
): Promise<{ bullet: string }> {
  const prompt = [
    input.role ? `Role context: ${input.role}` : null,
    input.company ? `Company: ${input.company}` : null,
    `Original bullet:\n${input.bullet}`,
    "",
    "Rewrite this resume bullet using:",
    "- A strong action verb at the start",
    "- Quantified impact where reasonable (%, $, time, users)",
    "- Concise ATS-friendly language",
    "- Single sentence only",
    "",
    "Return ONLY the rewritten bullet, no preamble or explanation.",
  ]
    .filter(Boolean)
    .join("\n");

  const text = await generateText(prompt, {
    systemInstruction:
      "You are an expert resume coach. Improve resume bullets to be concise, quantified, ATS-friendly, starting with a strong action verb.",
    temperature: 0.6,
    maxOutputTokens: 200,
  });

  await logAiUsage(userId, "improve-bullet");
  return { bullet: text.replace(/^[-•*]\s*/, "") };
}

/**
 * Rewrite an entire section of the resume.
 */
export async function rewriteSection(
  input: RewriteSectionInput,
  userId: string,
): Promise<{ content: string }> {
  const prompt = [
    `Section: ${input.section}`,
    input.context ? `Context (role/industry): ${input.context}` : null,
    `Current content:\n${input.content}`,
    "",
    "Rewrite this resume section to be more impactful, concise, and ATS-friendly.",
    "Preserve all factual information. Do not invent details.",
    "Return only the improved content, no explanation.",
  ]
    .filter(Boolean)
    .join("\n");

  const text = await generateText(prompt, {
    systemInstruction:
      "You are an expert resume writer who improves resume sections while preserving all factual accuracy.",
    temperature: 0.6,
    maxOutputTokens: 1000,
  });

  await logAiUsage(userId, "rewrite-section");
  return { content: text };
}

// ── Job Match ─────────────────────────────────────────────────────────────────

interface JobMatchResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
}

/**
 * Compare resume against a job description and return ATS-style analysis.
 */
export async function jobMatch(input: JobMatchInput, userId: string): Promise<JobMatchResult> {
  const prompt = [
    "JOB DESCRIPTION:",
    input.jobDescription,
    "",
    "RESUME:",
    input.resumeText,
    "",
    "Analyze the match between this resume and job description.",
    "Return STRICT JSON only (no markdown fences). Use exactly this schema:",
    "{",
    '  "score": number (0-100, ATS match score),',
    '  "matchedKeywords": string[] (keywords from JD present in resume),',
    '  "missingKeywords": string[] (important JD keywords absent from resume),',
    '  "missingSkills": string[] (technical skills in JD but not in resume),',
    '  "suggestions": string[] (3-5 specific actionable improvements)',
    "}",
  ].join("\n");

  const raw = await generateJSON<JobMatchResult>(prompt, {
    systemInstruction:
      "You are an expert ATS analyst. Return only valid JSON with no markdown or extra text.",
    temperature: 0.3,
    maxOutputTokens: 1500,
  });

  await logAiUsage(userId, "job-match");

  return {
    score: Math.max(0, Math.min(100, Number(raw.score) || 0)),
    matchedKeywords: Array.isArray(raw.matchedKeywords) ? raw.matchedKeywords.slice(0, 40) : [],
    missingKeywords: Array.isArray(raw.missingKeywords) ? raw.missingKeywords.slice(0, 40) : [],
    missingSkills: Array.isArray(raw.missingSkills) ? raw.missingSkills.slice(0, 20) : [],
    suggestions: Array.isArray(raw.suggestions) ? raw.suggestions.slice(0, 8) : [],
  };
}

// ── Resume Review ─────────────────────────────────────────────────────────────

interface ReviewResult {
  atsScore: number;
  readability: number;
  keywordCoverage: number;
  items: Array<{ kind: "good" | "warn" | "tip"; message: string }>;
  strongest: string;
  suggestions: string[];
}

/**
 * Full ATS-style review of the resume.
 */
export async function reviewResume(
  input: ReviewResumeInput,
  userId: string,
): Promise<ReviewResult> {
  const prompt = [
    "RESUME TEXT:",
    input.resumeText,
    input.jobDescription ? `\nJOB DESCRIPTION:\n${input.jobDescription}` : "",
    "",
    "Perform a comprehensive ATS and readability review.",
    "Return STRICT JSON only (no markdown fences). Use exactly this schema:",
    "{",
    '  "atsScore": number (0-100),',
    '  "readability": number (0-100),',
    '  "keywordCoverage": number (0-100),',
    '  "items": [{ "kind": "good"|"warn"|"tip", "message": string }],',
    '  "strongest": string (which section is strongest: Experience/Projects/Skills/Education),',
    '  "suggestions": string[] (3-5 specific improvements)',
    "}",
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await generateJSON<ReviewResult>(prompt, {
    systemInstruction: "You are an expert ATS analyst and resume coach. Return only valid JSON.",
    temperature: 0.3,
    maxOutputTokens: 1500,
  });

  await logAiUsage(userId, "review");

  return {
    atsScore: Math.max(0, Math.min(100, Number(raw.atsScore) || 60)),
    readability: Math.max(0, Math.min(100, Number(raw.readability) || 70)),
    keywordCoverage: Math.max(0, Math.min(100, Number(raw.keywordCoverage) || 60)),
    items: Array.isArray(raw.items) ? raw.items.slice(0, 10) : [],
    strongest: raw.strongest ?? "Experience",
    suggestions: Array.isArray(raw.suggestions) ? raw.suggestions.slice(0, 8) : [],
  };
}

// ── Interview Questions ────────────────────────────────────────────────────────

interface InterviewQuestion {
  question: string;
  tip: string;
  category: string;
}

/**
 * Generate tailored interview questions based on the resume.
 */
export async function generateInterviewQuestions(
  input: InterviewQuestionsInput,
  userId: string,
): Promise<{ questions: InterviewQuestion[] }> {
  const prompt = [
    "RESUME:",
    input.resumeText,
    input.jobDescription ? `\nJOB DESCRIPTION:\n${input.jobDescription}` : "",
    "",
    `Generate ${input.count} tailored interview questions based on this resume.`,
    "Return STRICT JSON only. Schema:",
    "[{",
    '  "question": string,',
    '  "tip": string (how to answer well),',
    '  "category": string (e.g. "Technical", "Behavioral", "Project")',
    "}]",
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await generateJSON<InterviewQuestion[]>(prompt, {
    systemInstruction: "You are an expert interview coach. Return only valid JSON array.",
    temperature: 0.7,
    maxOutputTokens: 1500,
  });

  await logAiUsage(userId, "interview");

  return {
    questions: Array.isArray(raw) ? raw.slice(0, input.count) : [],
  };
}

// ── Convert Imported Resume ────────────────────────────────────────────────────

interface ParsedResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: Array<{ degree: string; school: string; year: string; cgpa?: string }>;
  experience: Array<{ role: string; company: string; period: string; bullets: string[] }>;
  projects: Array<{ name: string; tools: string; bullets: string[] }>;
  skills: Array<{ category: string; items: string }>;
  certifications?: string[];
  achievements?: string[];
  languages?: string[];
  publications?: string[];
  volunteer?: string[];
}

/**
 * Parse raw resume text into structured data for the native editor.
 */
export async function convertImportedResume(
  input: ConvertImportedResumeInput,
  userId: string,
): Promise<ParsedResumeData> {
  const prompt = [
    "You are a high-fidelity resume parsing AI. Your task is to scan the following raw resume text and extract all details into a clean, complete structured JSON object.",
    "",
    "RESUME TEXT TO PARSE:",
    input.resumeText,
    "",
    "EXTRACT RULES:",
    "1. Parse EVERY SINGLE education entry, work experience, project, skill category, certification, achievement, language, publication, and volunteer/leadership role listed in the text. Do not summarize, skip, truncate, or omit anything.",
    "2. Do not invent, hallucinate, or assume any information. Only use facts present in the text.",
    '3. If a field is not present in the text (like "cgpa" or "tools" or "location"), use an empty string "" or an empty array [] - do NOT skip the entire entry.',
    "4. For work experience and projects, extract all details and descriptions as bullet points. If the text has paragraphs instead of bullet points, split them into clean, logical bullet points.",
    "5. Raw text from PDFs can sometimes interleave column text. Use your language understanding to reconstruct the correct sentences and sections logically.",
    "",
    "Return STRICT JSON only (no markdown code blocks, no trailing commas, no extra text).",
    "JSON Schema:",
    "{",
    '  "fullName": "Full name of the person",',
    '  "email": "Email address",',
    '  "phone": "Phone number",',
    '  "location": "City, State or City, Country",',
    '  "summary": "A 2-3 sentence professional summary summarizing their experience and strengths (if not present in the text, write one based on their background)",',
    '  "education": [',
    "    {",
    '      "degree": "Degree and major (e.g., B.S. in Computer Science)",',
    '      "school": "School or University name",',
    '      "year": "Graduation year or date range (e.g., 2018 - 2022 or May 2022)",',
    '      "cgpa": "CGPA, GPA or Grade (e.g., 3.8/4.0 or 8.5/10, leave empty string if not mentioned)"',
    "    }",
    "  ],",
    '  "experience": [',
    "    {",
    '      "role": "Job Title (e.g., Software Engineer Intern)",',
    '      "company": "Company Name",',
    '      "period": "Employment period (e.g., June 2021 - Present)",',
    '      "bullets": ["Detailed bullet point 1", "Detailed bullet point 2"]',
    "    }",
    "  ],",
    '  "projects": [',
    "    {",
    '      "name": "Project Name",',
    '      "tools": "Technologies/languages used (comma-separated list, e.g. React, Python, PostgreSQL)",',
    '      "bullets": ["Action-oriented project bullet point 1", "Action-oriented project bullet point 2"]',
    "    }",
    "  ],",
    '  "skills": [',
    "    {",
    '      "category": "Skill category (e.g., Languages, Tools, Databases)",',
    '      "items": "Comma-separated list of skills (e.g., Python, C++, Java)"',
    "    }",
    "  ],",
    '  "certifications": ["Certification name, issuer, date"],',
    '  "achievements": ["Award or achievement details"],',
    '  "languages": ["Language name and level"],',
    '  "publications": ["Publication title, publisher, year"],',
    '  "volunteer": ["Role and volunteer details"]',
    "}",
  ].join("\n");

  try {
    const raw = await generateJSON<ParsedResumeData>(prompt, {
      systemInstruction:
        "You are an advanced, high-fidelity resume parsing AI. Your goal is to convert messy raw resume text into perfect, structured JSON matching the provided schema exactly. You must preserve all details, correct any reading layout errors, and never omit records or truncate bullets.",
      temperature: 0.1,
      maxOutputTokens: 6000,
    });

    await logAiUsage(userId, "convert-imported-resume");
    return raw;
  } catch (err) {
    if (env.NODE_ENV === "development") {
      console.warn(
        `[AI] Gemini parsing failed (${err instanceof Error ? err.message : "Unknown error"}). Falling back to local regex extraction.`,
      );

      // Extract basic info via regex patterns
      const extractedName = extractName(input.resumeText || "");
      const extractedEmail = extractEmail(input.resumeText || "");
      const extractedPhone = extractPhone(input.resumeText || "");

      return {
        fullName: extractedName,
        email: extractedEmail,
        phone: extractedPhone,
        location: "City, Country",
        summary: "Professional profile imported and structured in development fallback mode.",
        education: [
          {
            degree: "Bachelor of Science",
            school: "University",
            year: "2018 - 2022",
            cgpa: "3.5",
          },
        ],
        experience: [
          {
            role: "Software Engineer",
            company: "Enterprise Corp",
            period: "2022 - Present",
            bullets: [
              "Developed high-performance web applications using modern technologies.",
              "Designed and built REST APIs and integrated database systems.",
            ],
          },
        ],
        projects: [
          {
            name: "Portfolio Project",
            tools: "React, Node.js, TypeScript",
            bullets: [
              "Designed and implemented user interface components.",
              "Integrated real-time database synchronizations.",
            ],
          },
        ],
        skills: [
          {
            category: "Technologies",
            items: "React, TypeScript, Node.js, Express, JavaScript",
          },
        ],
        certifications: ["Certified AWS Cloud Practitioner"],
        achievements: ["Dean's List 2024", "Won First Place in Hackathon"],
        languages: ["English (Native)", "Spanish (Conversational)"],
        publications: ["A Survey on AI-Assisted Development (IEEE 2025)"],
        volunteer: ["Volunteer Web Developer at NGO", "Student Coordinator for Club"],
      };
    }
    throw err;
  }
}

function extractName(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length > 0) {
    const match = lines[0].match(/^[A-Z][a-zA-Z\-']+(\s+[A-Z][a-zA-Z\-']+){1,2}/);
    if (match) return match[0];
    return lines[0].slice(0, 30);
  }
  return "Developer User";
}

function extractEmail(text: string): string {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : "dev@example.com";
}

function extractPhone(text: string): string {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : "123-456-7890";
}

/**
 * Suggest skills based on role and current skills.
 */
export async function suggestSkills(
  input: { role: string; currentSkills?: string },
  userId: string,
): Promise<{ skills: string[] }> {
  const prompt = [
    `Target role: ${input.role}`,
    `Current skills: ${input.currentSkills ?? "(none listed)"}`,
    "",
    "List 8-12 high-value missing skills that hiring managers look for in this role.",
    "Return ONLY a comma-separated list of skill names, no explanations.",
  ].join("\n");

  const text = await generateText(prompt, {
    systemInstruction:
      "You recommend resume skills that hiring managers look for. Return only a comma-separated skill list.",
    temperature: 0.5,
    maxOutputTokens: 200,
  });

  await logAiUsage(userId, "suggest-skills");

  return {
    skills: text
      .split(/,|\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 12),
  };
}

/* ── Asynchronous Background Job Processing ── */

export async function runConvertJob(
  jobId: string,
  input: ConvertImportedResumeInput,
  userId: string,
): Promise<void> {
  await jobManager.updateJob(jobId, { status: "processing", progress: 5 });

  let ocrUsed = false;
  let parserUsed: "docx" | "pdf_layout" | "gemini_ocr" | "raw_fallback" = "raw_fallback";

  try {
    // Stage A: Layout preprocessing or file extraction
    let preprocessed: { textBlocks: { text: string; isHeader: boolean }[]; rawText: string } = {
      textBlocks: [],
      rawText: input.resumeText || "",
    };

    let fileDownloaded = false;

    if (input.resumeId) {
      try {
        // Look up the uploads table for this resume ID
        const { data: uploadRecord } = await supabaseAdmin
          .from("uploads")
          .select("*")
          .eq("resume_id", input.resumeId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (uploadRecord?.storage_path) {
          const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage
            .from("imported_resumes")
            .download(uploadRecord.storage_path);

          if (fileBlob && !downloadError) {
            const buffer = Buffer.from(await fileBlob.arrayBuffer());
            const mimeType = uploadRecord.mime_type || "application/pdf";
            const storagePathLower = uploadRecord.storage_path.toLowerCase();

            if (
              mimeType.includes("word") ||
              mimeType.includes("officedocument") ||
              storagePathLower.endsWith(".docx")
            ) {
              parserUsed = "docx";
              const mammothResult = await mammoth.convertToHtml({ buffer });
              const html = mammothResult.value;
              preprocessed.textBlocks = parseMammothHtmlToBlocks(html);
              preprocessed.rawText = preprocessed.textBlocks.map((b) => b.text).join("\n");
              fileDownloaded = true;
            } else if (
              mimeType.startsWith("image/") ||
              mimeType.includes("png") ||
              mimeType.includes("jpeg") ||
              mimeType.includes("webp")
            ) {
              ocrUsed = true;
              parserUsed = "gemini_ocr";
              const ocrText = await generateMultimodalText(
                "Extract all readable text from this resume image. Preserve the original reading order, columns, and headings. Return the plain text output with section headings clearly separated. Do not include any metadata or comments.",
                buffer,
                mimeType,
              );
              preprocessed.rawText = ocrText;
              preprocessed.textBlocks = ocrText
                .split(/\n+/)
                .map((line) => {
                  const cleanLine = line.trim();
                  return {
                    text: cleanLine,
                    isHeader: isLineHeader(cleanLine, false, 14),
                  };
                })
                .filter((b) => b.text.length > 0);
              fileDownloaded = true;
            } else if (mimeType === "application/pdf") {
              // PDF processing: Check if client layout is present
              let isScanned = true;
              if (input.layout && input.layout.pages && input.layout.pages.length > 0) {
                const totalChars = input.layout.pages
                  .flatMap(
                    (p: { textItems?: Array<{ text: string }> }) =>
                      p.textItems?.map((i: { text: string }) => i.text) || [],
                  )
                  .join("").length;
                if (totalChars > 150) {
                  isScanned = false;
                }
              }

              if (isScanned) {
                ocrUsed = true;
                parserUsed = "gemini_ocr";
                const ocrText = await generateMultimodalText(
                  "Extract all readable text from this PDF document. Perform OCR on the pages. Preserve the original reading order, columns, and headings. Return the plain text output with section headings clearly separated.",
                  buffer,
                  mimeType,
                );
                preprocessed.rawText = ocrText;
                preprocessed.textBlocks = ocrText
                  .split(/\n+/)
                  .map((line) => {
                    const cleanLine = line.trim();
                    return {
                      text: cleanLine,
                      isHeader: isLineHeader(cleanLine, false, 14),
                    };
                  })
                  .filter((b) => b.text.length > 0);
                fileDownloaded = true;
              }
            }
          }
        }
      } catch (dbErr) {
        console.warn(
          "[aiService] Could not parse uploaded file from storage, falling back to client parameters:",
          dbErr,
        );
      }
    }

    // Fallback if file wasn't downloaded or wasn't processed above
    if (!fileDownloaded) {
      if (input.layout && input.layout.pages && input.layout.pages.length > 0) {
        parserUsed = "pdf_layout";
        preprocessed = preprocessLayout(input.layout);
      } else {
        parserUsed = "raw_fallback";
        preprocessed.textBlocks = [{ text: input.resumeText || "", isHeader: false }];
      }
    }

    // Stage B: Deterministic local parsing (Regex)
    const contact = localRegexParse(preprocessed.rawText);
    await jobManager.updateJob(jobId, {
      progress: 20,
      sections: { contact },
      diagnostics: {
        preprocessedBlocks: preprocessed.textBlocks,
        ocrUsed,
        parserUsed,
      },
    });

    // Stage C: Section boundary classification
    const sectionsText = classifyBlocks(preprocessed.textBlocks);

    // Stream uncategorized segments immediately
    await jobManager.updateJob(jobId, {
      sections: { uncategorized: sectionsText.uncategorized },
    });

    interface EducationEntry {
      degree: string;
      school: string;
      year: string;
      cgpa: string;
      confidence: number;
    }
    interface SkillsEntry {
      category: string;
      items: string;
      confidence: number;
    }
    interface ExperienceEntry {
      role: string;
      company: string;
      period: string;
      bullets: string[];
      confidence: number;
    }
    interface ProjectEntry {
      name: string;
      tools: string;
      bullets: string[];
      confidence: number;
    }

    let education: EducationEntry[] = [];
    let skills: SkillsEntry[] = [];
    let experience: ExperienceEntry[] = [];
    let projects: ProjectEntry[] = [];
    let certifications: { items: string[]; confidence: number } = { items: [], confidence: 0 };
    let achievements: { items: string[]; confidence: number } = { items: [], confidence: 0 };
    let languages: { items: string[]; confidence: number } = { items: [], confidence: 0 };
    let publications: { items: string[]; confidence: number } = { items: [], confidence: 0 };
    let volunteer: { items: string[]; confidence: number } = { items: [], confidence: 0 };

    // Call Gemini for Education
    if (sectionsText.education.length > 0) {
      try {
        const edText = sectionsText.education.join("\n\n");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await generateJSON<any>(
          `Extract education history from this text. TEXT:\n${edText}\n\nSchema:\n[{ "degree": string, "school": string, "year": string, "cgpa": string, "confidence": number (0-100) }]`,
          { temperature: 0.1 },
        );
        education = Array.isArray(res) ? res : [res];
      } catch (err) {
        console.warn(`[AI Job] Education parsing failed for ${jobId}:`, err);
      }
    }
    await jobManager.updateJob(jobId, { progress: 20, sections: { education } });

    // Call Gemini for Skills
    if (sectionsText.skills.length > 0) {
      try {
        const skText = sectionsText.skills.join("\n\n");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await generateJSON<any>(
          `Extract skills from this text. Group them into categories. TEXT:\n${skText}\n\nSchema:\n[{ "category": string, "items": string (comma-separated), "confidence": number (0-100) }]`,
          { temperature: 0.1 },
        );
        skills = Array.isArray(res) ? res : [res];
      } catch (err) {
        console.warn(`[AI Job] Skills parsing failed for ${jobId}:`, err);
      }
    }
    await jobManager.updateJob(jobId, { progress: 30, sections: { skills } });

    // Call Gemini for Experience
    if (sectionsText.experience.length > 0) {
      try {
        const exText = sectionsText.experience.join("\n\n");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await generateJSON<any>(
          `Extract work experiences from this text. Split paragraphs into clean, logical bullet points. Rules: Do NOT merge multiple jobs. Preserve chronological order. Preserve original bullet text. TEXT:\n${exText}\n\nSchema:\n[{ "role": string, "company": string, "period": string, "bullets": [string], "confidence": number (0-100) }]`,
          { temperature: 0.1 },
        );
        experience = Array.isArray(res) ? res : [res];
      } catch (err) {
        console.warn(`[AI Job] Experience parsing failed for ${jobId}:`, err);
      }
    }
    await jobManager.updateJob(jobId, { progress: 45, sections: { experience } });

    // Call Gemini for Projects
    if (sectionsText.projects.length > 0) {
      try {
        const prText = sectionsText.projects.join("\n\n");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await generateJSON<any>(
          `Extract projects from this text. Rules: Do NOT merge multiple projects. Each project must be a separate object. TEXT:\n${prText}\n\nSchema:\n[{ "name": string, "tools": string (comma-separated), "bullets": [string], "confidence": number (0-100) }]`,
          { temperature: 0.1 },
        );
        projects = Array.isArray(res) ? res : [res];
      } catch (err) {
        console.warn(`[AI Job] Projects parsing failed for ${jobId}:`, err);
      }
    }
    await jobManager.updateJob(jobId, { progress: 60, sections: { projects } });

    // Call Gemini for Certifications
    if (sectionsText.certifications.length > 0) {
      try {
        const certText = sectionsText.certifications.join("\n\n");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await generateJSON<any>(
          `Extract certifications, licenses, or courses from this text. TEXT:\n${certText}\n\nSchema:\n{ "items": [string], "confidence": number (0-100) }`,
          { temperature: 0.1 },
        );
        certifications =
          res && Array.isArray(res.items)
            ? res
            : { items: Array.isArray(res) ? res : [], confidence: 80 };
      } catch (err) {
        console.warn(`[AI Job] Certifications parsing failed for ${jobId}:`, err);
      }
    }
    await jobManager.updateJob(jobId, { progress: 70, sections: { certifications } });

    // Call Gemini for Achievements
    if (sectionsText.achievements.length > 0) {
      try {
        const achText = sectionsText.achievements.join("\n\n");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await generateJSON<any>(
          `Extract key achievements, awards, and honors from this text. TEXT:\n${achText}\n\nSchema:\n{ "items": [string], "confidence": number (0-100) }`,
          { temperature: 0.1 },
        );
        achievements =
          res && Array.isArray(res.items)
            ? res
            : { items: Array.isArray(res) ? res : [], confidence: 80 };
      } catch (err) {
        console.warn(`[AI Job] Achievements parsing failed for ${jobId}:`, err);
      }
    }
    await jobManager.updateJob(jobId, { progress: 80, sections: { achievements } });

    // Call Gemini for Languages
    if (sectionsText.languages.length > 0) {
      try {
        const langText = sectionsText.languages.join("\n\n");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await generateJSON<any>(
          `Extract languages and language proficiencies from this text. TEXT:\n${langText}\n\nSchema:\n{ "items": [string], "confidence": number (0-100) }`,
          { temperature: 0.1 },
        );
        languages =
          res && Array.isArray(res.items)
            ? res
            : { items: Array.isArray(res) ? res : [], confidence: 80 };
      } catch (err) {
        console.warn(`[AI Job] Languages parsing failed for ${jobId}:`, err);
      }
    }
    await jobManager.updateJob(jobId, { progress: 85, sections: { languages } });

    // Call Gemini for Publications
    if (sectionsText.publications.length > 0) {
      try {
        const pubText = sectionsText.publications.join("\n\n");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await generateJSON<any>(
          `Extract publications, research papers, and patents from this text. TEXT:\n${pubText}\n\nSchema:\n{ "items": [string], "confidence": number (0-100) }`,
          { temperature: 0.1 },
        );
        publications =
          res && Array.isArray(res.items)
            ? res
            : { items: Array.isArray(res) ? res : [], confidence: 80 };
      } catch (err) {
        console.warn(`[AI Job] Publications parsing failed for ${jobId}:`, err);
      }
    }
    await jobManager.updateJob(jobId, { progress: 90, sections: { publications } });

    // Call Gemini for Volunteer
    if (sectionsText.volunteer.length > 0) {
      try {
        const volText = sectionsText.volunteer.join("\n\n");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await generateJSON<any>(
          `Extract volunteer work, leadership roles, activities, and positions of responsibility from this text. TEXT:\n${volText}\n\nSchema:\n{ "items": [string], "confidence": number (0-100) }`,
          { temperature: 0.1 },
        );
        volunteer =
          res && Array.isArray(res.items)
            ? res
            : { items: Array.isArray(res) ? res : [], confidence: 80 };
      } catch (err) {
        console.warn(`[AI Job] Volunteer parsing failed for ${jobId}:`, err);
      }
    }
    await jobManager.updateJob(jobId, { progress: 95, sections: { volunteer } });

    // Stage E: Diagnostics & Omissions check
    const totalWords = countWords(preprocessed.rawText);
    const mappedText = [
      contact.fullName,
      contact.email,
      contact.phone,
      contact.location,
      ...education.map((e) => `${e.degree} ${e.school}`),
      ...skills.map((s) => `${s.category} ${s.items}`),
      ...experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
      ...projects.flatMap((p) => [p.name, p.tools, ...p.bullets]),
      ...(certifications?.items || []),
      ...(achievements?.items || []),
      ...(languages?.items || []),
      ...(publications?.items || []),
      ...(volunteer?.items || []),
    ].join(" ");
    const mappedWords = countWords(mappedText);
    const coverage = totalWords === 0 ? 0 : Math.round((mappedWords / totalWords) * 100);

    const commonSkillsList = [
      "React",
      "Angular",
      "Vue",
      "Node",
      "Express",
      "TypeScript",
      "JavaScript",
      "Python",
      "Java",
      "C++",
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "GCP",
      "Jenkins",
      "Git",
      "SQL",
      "PostgreSQL",
      "MongoDB",
      "HTML",
      "CSS",
      "Tailwind",
      "Django",
      "Flask",
      "Spring",
      "Redis",
      "Elasticsearch",
      "Figma",
      "Redux",
      "GraphQL",
      "Sass",
      "Webpack",
      "Vite",
      "Next.js",
      "CI/CD",
      "Linux",
    ];
    const omissions: string[] = [];
    const lowerRawText = preprocessed.rawText.toLowerCase();
    const lowerMappedText = mappedText.toLowerCase();

    for (const skill of commonSkillsList) {
      const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const skillRegex = new RegExp(`\\b${escaped}\\b`, "i");
      if (skillRegex.test(lowerRawText) && !skillRegex.test(lowerMappedText)) {
        omissions.push(skill);
      }
    }

    // Track detected section headings based on which lists in sectionsText are not empty
    const detectedHeadings: string[] = [];
    const sectionKeys: (keyof SectionTextGroups)[] = [
      "education",
      "experience",
      "projects",
      "skills",
      "certifications",
      "achievements",
      "languages",
      "publications",
      "volunteer",
    ];
    for (const key of sectionKeys) {
      if (sectionsText[key] && sectionsText[key].length > 0) {
        detectedHeadings.push(key.toUpperCase());
      }
    }

    const emptyParsedSections: string[] = [];
    const confidenceOverrides: Record<string, number> = {};

    const checkEmpty = (
      key: string,
      items: unknown[] | { items: unknown[]; confidence?: number } | null | undefined,
    ) => {
      let isEmpty = true;
      if (Array.isArray(items)) {
        isEmpty = items.length === 0;
      } else if (items && "items" in items && Array.isArray(items.items)) {
        isEmpty = items.items.length === 0;
      } else if (items) {
        isEmpty = false;
      }

      const upperKey = key.toUpperCase();
      if (isEmpty) {
        if (detectedHeadings.includes(upperKey)) {
          emptyParsedSections.push(key);
          confidenceOverrides[key] = 30;
        } else {
          confidenceOverrides[key] = 0;
        }
      } else {
        let sum = 0;
        let count = 0;
        if (Array.isArray(items)) {
          for (const item of items) {
            sum += (item as { confidence?: number }).confidence ?? 100;
            count++;
          }
        } else if (items && "items" in items && Array.isArray(items.items)) {
          sum = (items as { confidence?: number }).confidence ?? 80;
          count = 1;
        } else if (items) {
          sum = (items as { confidence?: number }).confidence ?? 100;
          count = 1;
        }
        confidenceOverrides[key] = count > 0 ? Math.round(sum / count) : 100;
      }
    };

    checkEmpty("education", education);
    checkEmpty("skills", skills);
    checkEmpty("experience", experience);
    checkEmpty("projects", projects);
    checkEmpty("certifications", certifications);
    checkEmpty("achievements", achievements);
    checkEmpty("languages", languages);
    checkEmpty("publications", publications);
    checkEmpty("volunteer", volunteer);

    const sectionFlags = {
      detectedHeadings,
      emptyParsedSections,
      confidenceOverrides,
    };

    const pages = input.layout?.pages?.length || 1;

    await jobManager.updateJob(jobId, {
      status: "completed",
      progress: 100,
      diagnostics: {
        pages,
        words: totalWords,
        mapped: mappedWords,
        coverage: Math.min(100, coverage),
        omissions,
        preprocessedBlocks: preprocessed.textBlocks,
        ocrUsed,
        parserUsed,
        sectionFlags,
      },
    });
  } catch (err) {
    console.error(`[AI Job] Asynchronous execution failed for job ${jobId}:`, err);
    await jobManager.updateJob(jobId, {
      status: "failed",
      error: err instanceof Error ? err.message : "Background parsing failed",
    });
  }
}

/* ── Helper Functions for Parsing ── */

/* eslint-disable @typescript-eslint/no-explicit-any */
function preprocessLayout(layout: any): { textBlocks: any[]; rawText: string } {
  const textBlocks: any[] = [];
  let combinedText = "";

  if (!layout || !layout.pages || layout.pages.length === 0) {
    return { textBlocks: [], rawText: "" };
  }

  for (const page of layout.pages) {
    const items: any[] = page.textItems || [];
    if (items.length === 0) continue;

    const pageWidth = page.viewport.width;
    const pageMiddle = pageWidth / 2;

    // Simple column split detection
    let isMultiColumn = false;
    const searchStart = pageWidth * 0.3;
    const searchEnd = pageWidth * 0.7;

    const centerItems = items.filter((item) => {
      const itemEnd = item.x + item.width;
      return (
        (item.x > searchStart && item.x < searchEnd) ||
        (itemEnd > searchStart && itemEnd < searchEnd)
      );
    });

    if (centerItems.length < items.length * 0.25) {
      isMultiColumn = true;
    }

    let sortedItems: any[] = [];
    if (isMultiColumn) {
      const leftCol = items.filter((item) => item.x + item.width / 2 < pageMiddle);
      const rightCol = items.filter((item) => item.x + item.width / 2 >= pageMiddle);

      const sortFn = (a: any, b: any) => {
        if (Math.abs(a.y - b.y) > 10) return a.y - b.y;
        return a.x - b.x;
      };

      leftCol.sort(sortFn);
      rightCol.sort(sortFn);
      sortedItems = [...leftCol, ...rightCol];
    } else {
      sortedItems = [...items].sort((a: any, b: any) => {
        if (Math.abs(a.y - b.y) > 10) return a.y - b.y;
        return a.x - b.x;
      });
    }

    // Group items into lines
    const lines: { text: string; isBold: boolean; fontSize: number; y: number }[] = [];
    let currentLineItems: any[] = [];

    for (const item of sortedItems) {
      if (currentLineItems.length === 0) {
        currentLineItems.push(item);
      } else {
        const first = currentLineItems[0];
        const sameLine = Math.abs(first.y - item.y) < 8;
        if (sameLine) {
          currentLineItems.push(item);
        } else {
          currentLineItems.sort((a, b) => a.x - b.x);
          const text = currentLineItems
            .map((i) => i.text)
            .join(" ")
            .trim();
          const isBold = currentLineItems.some((i) => i.isBold);
          const fontSize = Math.max(...currentLineItems.map((i) => i.fontSize));
          const y = first.y;
          if (text) lines.push({ text, isBold, fontSize, y });
          currentLineItems = [item];
        }
      }
    }

    if (currentLineItems.length > 0) {
      currentLineItems.sort((a, b) => a.x - b.x);
      const text = currentLineItems
        .map((i) => i.text)
        .join(" ")
        .trim();
      const isBold = currentLineItems.some((i) => i.isBold);
      const fontSize = Math.max(...currentLineItems.map((i) => i.fontSize));
      const y = currentLineItems[0].y;
      if (text) lines.push({ text, isBold, fontSize, y });
    }

    // Group lines into blocks
    let currentBlock: string[] = [];
    let lastY = -1;

    for (const line of lines) {
      const isHeader = isLineHeader(line.text, line.isBold, line.fontSize);

      if (isHeader) {
        if (currentBlock.length > 0) {
          textBlocks.push({ text: currentBlock.join("\n"), isHeader: false });
          currentBlock = [];
        }
        textBlocks.push({ text: line.text, isHeader: true });
        lastY = -1;
      } else {
        const gap = lastY === -1 ? 0 : line.y - lastY;
        if (lastY !== -1 && gap > 24) {
          if (currentBlock.length > 0) {
            textBlocks.push({ text: currentBlock.join("\n"), isHeader: false });
          }
          currentBlock = [line.text];
        } else {
          currentBlock.push(line.text);
        }
        lastY = line.y;
      }
    }
    if (currentBlock.length > 0) {
      textBlocks.push({ text: currentBlock.join("\n"), isHeader: false });
    }
  }

  combinedText = textBlocks.map((b) => b.text).join("\n");
  return { textBlocks, rawText: combinedText };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const CANONICAL_SECTIONS: Record<string, keyof SectionTextGroups> = {
  "positions of responsibility": "volunteer",
  "position of responsibility": "volunteer",
  "extracurricular activities": "volunteer",
  "professional experience": "experience",
  "professional background": "experience",
  "educational background": "education",
  "academic background": "education",
  "personal projects": "projects",
  "academic projects": "projects",
  "notable projects": "projects",
  "core competencies": "skills",
  "community service": "volunteer",
  "work experience": "experience",
  "career objective": "summary",
  "skills summary": "skills",
  "technical skills": "skills",
  "key projects": "projects",
  "side projects": "projects",
  "online courses": "certifications",
  "volunteer work": "volunteer",
  accomplishments: "achievements",
  "language skills": "languages",
  "spoken languages": "languages",
  extracurricular: "volunteer",
  certifications: "certifications",
  qualifications: "education",
  schooling: "education",
  academics: "education",
  education: "education",
  experience: "experience",
  employment: "experience",
  "work history": "experience",
  "career history": "experience",
  projects: "projects",
  portfolio: "projects",
  "tech stack": "skills",
  expertise: "skills",
  "key skills": "skills",
  technologies: "skills",
  skills: "skills",
  studies: "education",
  summary: "summary",
  profile: "summary",
  "about me": "summary",
  objective: "summary",
  licenses: "certifications",
  courses: "certifications",
  training: "certifications",
  credentials: "certifications",
  achievements: "achievements",
  awards: "achievements",
  honors: "achievements",
  recognition: "achievements",
  languages: "languages",
  publications: "publications",
  research: "publications",
  patents: "publications",
  volunteering: "volunteer",
  leadership: "volunteer",
  activities: "volunteer",
  "social work": "volunteer",
  volunteer: "volunteer",
};

function isLineHeader(text: string, isBold: boolean, fontSize: number): boolean {
  const clean = text
    .toLowerCase()
    .trim()
    .replace(/[:\-\s]+/g, " ");
  if (clean.length > 35 || clean.length < 2) return false;

  const matchesKeyword = Object.keys(CANONICAL_SECTIONS).some(
    (kw) => clean === kw || clean.startsWith(kw + " ") || clean.endsWith(" " + kw),
  );
  return matchesKeyword && (isBold || fontSize > 12);
}

interface SectionTextGroups {
  summary: string[];
  education: string[];
  experience: string[];
  projects: string[];
  skills: string[];
  certifications: string[];
  achievements: string[];
  languages: string[];
  publications: string[];
  volunteer: string[];
  uncategorized: string[];
}

function classifyBlocks(blocks: { text: string; isHeader: boolean }[]): SectionTextGroups {
  const sections: SectionTextGroups = {
    summary: [],
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    languages: [],
    publications: [],
    volunteer: [],
    uncategorized: [],
  };

  let currentSection: keyof SectionTextGroups = "uncategorized";

  for (const block of blocks) {
    if (block.isHeader) {
      const clean = block.text
        .toLowerCase()
        .trim()
        .replace(/[:\-\s]+/g, " ");

      let matchedSection: keyof SectionTextGroups = "uncategorized";
      const sortedKeys = Object.keys(CANONICAL_SECTIONS).sort((a, b) => b.length - a.length);

      for (const key of sortedKeys) {
        if (
          clean === key ||
          clean.startsWith(key + " ") ||
          clean.endsWith(" " + key) ||
          clean.includes(key)
        ) {
          matchedSection = CANONICAL_SECTIONS[key];
          break;
        }
      }
      currentSection = matchedSection;
    } else {
      sections[currentSection].push(block.text);
    }
  }

  return sections;
}

function localRegexParse(text: string): {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  portfolio?: string;
} {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);

  // Custom domains or behance/dribbble/portfolio URLs
  const links =
    text.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi) || [];
  let website = "";
  for (const link of links) {
    const lowerLink = link.toLowerCase();
    if (
      !lowerLink.includes("linkedin.com") &&
      !lowerLink.includes("github.com") &&
      !lowerLink.includes("@")
    ) {
      website = link;
      break;
    }
  }

  let linkedin = "";
  if (linkedinMatch) {
    const matchStr = linkedinMatch[0];
    linkedin = matchStr.toLowerCase().startsWith("http") ? matchStr : `https://${matchStr}`;
  }
  let github = "";
  if (githubMatch) {
    const matchStr = githubMatch[0];
    github = matchStr.toLowerCase().startsWith("http") ? matchStr : `https://${matchStr}`;
  }
  if (website && !website.toLowerCase().startsWith("http")) {
    website = `https://${website}`;
  }

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  let fullName = "Developer User";
  if (lines.length > 0) {
    const nameMatch = lines[0].match(/^[A-Z][a-zA-Z\-']+(\s+[A-Z][a-zA-Z\-']+){1,2}/);
    if (nameMatch) {
      fullName = nameMatch[0];
    } else {
      fullName = lines[0].slice(0, 30);
    }
  }

  const locationMatch = text.match(/[A-Z][a-zA-Z\s]+,\s+[A-Z][a-zA-Z\s]{1,15}/);
  const location = locationMatch ? locationMatch[0] : "";

  return {
    fullName,
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    location,
    linkedin,
    github,
    website,
    portfolio: website,
  };
}

function countWords(str: string): number {
  return str.split(/\s+/).filter(Boolean).length;
}

function parseMammothHtmlToBlocks(html: string): { text: string; isHeader: boolean }[] {
  const textBlocks: { text: string; isHeader: boolean }[] = [];

  // Clean up HTML comments
  let cleanHtml = html.replace(/<!--[\s\S]*?-->/g, "");

  // Replace tables with structured text / markdown rows
  cleanHtml = cleanHtml.replace(/<table>([\s\S]*?)<\/table>/gi, (match, tableBody) => {
    let rowsText = "";
    const rowMatches = tableBody.match(/<tr>([\s\S]*?)<\/tr>/gi) || [];
    for (const row of rowMatches) {
      const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
      const cellsText = cells
        .map((cell: string) => {
          return cell.replace(/<[^>]+>/g, "").trim();
        })
        .filter(Boolean)
        .join(" | ");
      if (cellsText) {
        rowsText += rowsText ? "\n" + cellsText : cellsText;
      }
    }
    return `\n${rowsText}\n`;
  });

  // Extract blocks (paragraphs, list items, headings)
  const blockRegex = /<(h[1-6]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = blockRegex.exec(cleanHtml)) !== null) {
    const tagName = match[1].toLowerCase();
    let innerHtml = match[2];

    // Preserve links: convert <a href="URL">Anchor</a> to "Anchor (URL)"
    innerHtml = innerHtml.replace(
      /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
      (m, href, linkText) => {
        const cleanLinkText = linkText.replace(/<[^>]+>/g, "").trim();
        if (cleanLinkText === href || (href.startsWith("mailto:") && cleanLinkText.includes("@"))) {
          return cleanLinkText;
        }
        return `${cleanLinkText} (${href})`;
      },
    );

    let text = innerHtml.replace(/<[^>]+>/g, "").trim();
    if (!text) continue;

    if (tagName === "li") {
      text = `• ${text}`;
    }

    const isHeader = tagName.startsWith("h");
    const isBold =
      tagName === "p" && (match[2].startsWith("<strong>") || match[2].startsWith("<b>"));

    textBlocks.push({
      text,
      isHeader: isHeader || (isBold && text.length < 45),
    });
  }

  return textBlocks;
}
