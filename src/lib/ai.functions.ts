import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3-flash-preview";

async function gateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured — missing LOVABLE_API_KEY");
  const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
  return createLovableAiGatewayProvider(key);
}

async function gen(prompt: string, system: string) {
  const { generateText } = await import("ai");
  const g = await gateway();
  const { text } = await generateText({
    model: g(MODEL),
    system,
    prompt,
  });
  return text.trim();
}

const BulletInput = z.object({ bullet: z.string().min(1).max(800), role: z.string().optional() });
export const rewriteBullet = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => BulletInput.parse(d))
  .handler(async ({ data }) => {
    const text = await gen(
      `Role context: ${data.role ?? "general"}\nOriginal bullet:\n${data.bullet}\n\nRewrite this resume bullet using a strong action verb, quantified impact when reasonable, and concise ATS-friendly language. Return ONLY the rewritten bullet, no preamble.`,
      "You are an expert resume coach. Improve bullets to be concise, quantified, ATS-friendly, single-sentence, starting with a strong action verb.",
    );
    return { bullet: text.replace(/^[-•*]\s*/, "") };
  });

const SummaryInput = z.object({
  role: z.string().min(1),
  seniority: z.string().optional(),
  skills: z.string().optional(),
});
export const generateSummary = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SummaryInput.parse(d))
  .handler(async ({ data }) => {
    const text = await gen(
      `Target role: ${data.role}\nSeniority: ${data.seniority ?? "mid"}\nKey skills: ${data.skills ?? "n/a"}\n\nWrite a 2–3 sentence professional summary tailored to this role. No first-person pronouns. ATS-friendly.`,
      "You write concise, high-impact resume summaries.",
    );
    return { summary: text };
  });

const JDInput = z.object({
  jobDescription: z.string().min(20).max(8000),
  resumeText: z.string().min(20).max(20000),
});
export const matchJobDescription = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => JDInput.parse(d))
  .handler(async ({ data }) => {
    const { generateText } = await import("ai");
    const g = await gateway();
    const { text } = await generateText({
      model: g(MODEL),
      system:
        "You are an ATS expert. Compare a resume against a job description and return STRICT JSON only (no markdown fences). Schema: {score:number (0-100), matchedKeywords:string[], missingKeywords:string[], missingSkills:string[], suggestions:string[]}.",
      prompt: `JOB DESCRIPTION:\n${data.jobDescription}\n\nRESUME:\n${data.resumeText}\n\nReturn JSON only.`,
    });
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    try {
      const parsed = JSON.parse(cleaned);
      return {
        score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
        matchedKeywords: Array.isArray(parsed.matchedKeywords)
          ? parsed.matchedKeywords.slice(0, 40)
          : [],
        missingKeywords: Array.isArray(parsed.missingKeywords)
          ? parsed.missingKeywords.slice(0, 40)
          : [],
        missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills.slice(0, 20) : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 8) : [],
      };
    } catch {
      return {
        score: 0,
        matchedKeywords: [],
        missingKeywords: [],
        missingSkills: [],
        suggestions: [text.slice(0, 400)],
      };
    }
  });

const SkillsInput = z.object({ role: z.string().min(1), currentSkills: z.string().optional() });
export const suggestSkills = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SkillsInput.parse(d))
  .handler(async ({ data }) => {
    const text = await gen(
      `Target role: ${data.role}\nCurrent skills: ${data.currentSkills ?? "(none listed)"}\n\nList 8 high-value missing skills as a comma-separated single line. Skills only, no commentary.`,
      "You recommend resume skills that hiring managers look for.",
    );
    return {
      skills: text
        .split(/,|\n/)
        .map((s: string) => s.trim())
        .filter(Boolean)
        .slice(0, 12),
    };
  });

const StructInput = z.object({ resumeText: z.string().min(20).max(40000) });
export const parseResumeStructure = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => StructInput.parse(d))
  .handler(async ({ data }) => {
    const { generateText } = await import("ai");
    const g = await gateway();
    const { text } = await generateText({
      model: g(MODEL),
      system:
        "You are an expert resume parsing AI. Extract contact details, education, work experience, projects, and skills from the resume text and return STRICT JSON only. Do not wrap in markdown fences or include code blocks. " +
        "Output standard JSON conforming exactly to this schema:\n" +
        "{\n" +
        "  \"fullName\": \"string\",\n" +
        "  \"email\": \"string\",\n" +
        "  \"phone\": \"string\",\n" +
        "  \"location\": \"string\",\n" +
        "  \"summary\": \"string (2-3 sentences summary of strengths)\",\n" +
        "  \"education\": [\n" +
        "    { \"degree\": \"string\", \"school\": \"string\", \"year\": \"string\", \"cgpa\": \"string\" }\n" +
        "  ],\n" +
        "  \"experience\": [\n" +
        "    { \"role\": \"string\", \"company\": \"string\", \"period\": \"string\", \"bullets\": [\"string\"] }\n" +
        "  ],\n" +
        "  \"projects\": [\n" +
        "    { \"name\": \"string\", \"tools\": \"string\", \"bullets\": [\"string\"] }\n" +
        "  ],\n" +
        "  \"skills\": [\n" +
        "    { \"category\": \"string (e.g. Languages, Tools)\", \"items\": \"string (comma-separated list, e.g. React, TypeScript, Go)\" }\n" +
        "  ]\n" +
        "}",
      prompt: `RESUME TEXT TO CONVERT:\n${data.resumeText}\n\nReturn structured JSON:`,
    });

    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("[parseResumeStructure] AI structuring failed:", err, text);
      throw new Error("Failed to structure your resume text via AI. Please check LOVABLE_API_KEY.");
    }
  });
