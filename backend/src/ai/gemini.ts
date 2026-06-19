import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// Using gemini-2.0-flash for speed + low cost. Compatible with all text tasks.
const MODEL_NAME = "gemini-2.0-flash";

interface GenerateOptions {
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

/**
 * Core Gemini text generation wrapper.
 * Returns the plain text response, trimmed.
 */
export async function generateText(prompt: string, options: GenerateOptions = {}): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: options.systemInstruction,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxOutputTokens ?? 2048,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new AppError("Gemini returned an empty response", 500, "AI_EMPTY_RESPONSE");
    }

    return text.trim();
  } catch (err) {
    if (err instanceof AppError) throw err;

    const message = err instanceof Error ? err.message : "Unknown AI error";
    // Gemini API errors
    if (message.includes("API_KEY_INVALID") || message.includes("403")) {
      throw new AppError("Invalid Gemini API key", 500, "AI_KEY_INVALID");
    }
    if (message.includes("QUOTA_EXCEEDED") || message.includes("429")) {
      throw new AppError("Gemini API quota exceeded", 429, "AI_QUOTA_EXCEEDED");
    }
    throw new AppError(`AI generation failed: ${message}`, 500, "AI_ERROR");
  }
}

/**
 * Generate and parse a JSON response from Gemini.
 * Strips any markdown code fences Gemini might add.
 */
export async function generateJSON<T>(prompt: string, options: GenerateOptions = {}): Promise<T> {
  const raw = await generateText(prompt, {
    ...options,
    temperature: options.temperature ?? 0.3, // Lower temp = more consistent JSON
  });

  // Strip markdown fences if present
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new AppError("AI returned invalid JSON. Please try again.", 500, "AI_INVALID_JSON");
  }
}

/**
 * Core Gemini multimodal generation wrapper.
 * Sends prompt and inline base64 file data.
 */
export async function generateMultimodalText(
  prompt: string,
  buffer: Buffer,
  mimeType: string,
  options: GenerateOptions = {},
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: options.systemInstruction,
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        maxOutputTokens: options.maxOutputTokens ?? 4096,
      },
    });

    const filePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, filePart]);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new AppError("Gemini returned an empty multimodal response", 500, "AI_EMPTY_RESPONSE");
    }

    return text.trim();
  } catch (err) {
    if (err instanceof AppError) throw err;
    const message = err instanceof Error ? err.message : "Unknown AI multimodal error";
    throw new AppError(`AI multimodal generation failed: ${message}`, 500, "AI_ERROR");
  }
}
