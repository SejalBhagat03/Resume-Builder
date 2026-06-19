import type { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { sendSuccess } from "../utils/responseHelper";
import { uploadPdf } from "../services/storageService";
import { supabaseAdmin } from "../database/supabaseAdmin";
import crypto from "crypto";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

/**
 * POST /api/upload/pdf
 * Validates the uploaded resume file (PDF, DOCX, or Image), stores it in Supabase Storage,
 * records metadata in the uploads table, and returns the storage path.
 */
export async function handlePdfUpload(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    throw AppError.badRequest("No file uploaded", "NO_FILE");
  }

  const { mimetype, size, buffer, originalname } = req.file;

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    throw AppError.badRequest(
      "Only PDF, DOCX, and image files (PNG, JPEG, WebP) are accepted",
      "INVALID_FILE_TYPE",
    );
  }

  // Validate size
  if (size > MAX_FILE_SIZE) {
    throw AppError.badRequest(
      `File too large. Maximum allowed size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      "FILE_TOO_LARGE",
    );
  }

  // Basic PDF magic bytes check (starts with %PDF-)
  if (mimetype === "application/pdf") {
    if (buffer.length < 5 || buffer.slice(0, 5).toString("ascii") !== "%PDF-") {
      throw AppError.badRequest("File does not appear to be a valid PDF", "INVALID_PDF");
    }
  }

  // Get active resume ID from query parameters or generate a random one
  const resumeId = (req.query.resumeId as string) || crypto.randomUUID();
  const userId = req.user.id;

  // Upload to Supabase Storage
  const { storagePath } = await uploadPdf(buffer, userId, resumeId, originalname, mimetype);

  // Record metadata in uploads table
  await supabaseAdmin.from("uploads").insert({
    user_id: userId,
    resume_id: resumeId,
    storage_path: storagePath,
    original_filename: originalname,
    file_size_bytes: size,
    mime_type: mimetype,
  });

  sendSuccess(res, {
    storagePath,
    resumeId,
    originalFilename: originalname,
    fileSizeBytes: size,
    uploadedAt: new Date().toISOString(),
  });
}
