/**
 * parse.functions.ts
 * Server-side resume text extraction using TanStack Start createServerFn.
 * Extracts text from uploaded PDF, then uses AI to parse fields.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ParseInput = z.object({
  /** Base64-encoded file content */
  base64: z.string().min(1),
  /** Original filename (used to detect PDF vs TXT) */
  filename: z.string().min(1),
});

export type ParsedResumeData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  rawText: string;
};

export const parseResumeFile = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ParseInput.parse(d))
  .handler(async ({ data }): Promise<ParsedResumeData> => {
    const { base64, filename } = data;
    const buffer = Buffer.from(base64, "base64");
    let rawText = "";

    const lower = filename.toLowerCase();

    if (lower.endsWith(".pdf")) {
      try {
        // Use require for pdf-parse since its ESM build doesn't expose .default correctly
        const { createRequire } = await import("node:module");
        const req = createRequire(import.meta.url);
        const pdfParse = req("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
        const result = await pdfParse(buffer);
        rawText = result.text;
      } catch (err) {
        console.error("[parseResumeFile] pdf-parse error:", err);
        rawText = "";
      }
    } else if (lower.endsWith(".txt")) {
      rawText = buffer.toString("utf-8");
    } else {
      // DOCX — basic text extraction by stripping XML tags
      rawText = buffer
        .toString("utf-8")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    // Simple regex-based field extraction from raw text
    const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = rawText.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);

    // Name heuristic: first non-empty line that doesn't look like an email/URL
    const lines = rawText
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const nameLine = lines.find(
      (l) =>
        l.length > 2 &&
        l.length < 60 &&
        !l.includes("@") &&
        !l.includes("http") &&
        !/^[A-Z\s]+$/.test(l), // skip ALL-CAPS headings
    );

    // Summary: extract first paragraph-ish block (>40 chars)
    const summaryLine = lines.find(
      (l) => l.length > 40 && !l.includes("@") && !phoneMatch?.[0]?.includes(l) && l !== nameLine,
    );

    return {
      fullName: nameLine ?? "",
      email: emailMatch?.[0] ?? "",
      phone: phoneMatch?.[0] ?? "",
      location: "",
      summary: summaryLine ?? rawText.slice(0, 300),
      rawText: rawText.slice(0, 10000), // cap for safety
    };
  });
