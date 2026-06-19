import { supabaseAdmin } from "../database/supabaseAdmin";
import { AppError } from "../utils/AppError";

const BUCKET_IMPORTED = "imported_resumes";
const BUCKET_GENERATED = "generated_pdfs";

/**
 * Upload a resume file buffer to Supabase Storage.
 * Stores at: {bucket}/{userId}/{resumeId}.{ext}
 * Returns the storage path.
 */
export async function uploadPdf(
  buffer: Buffer,
  userId: string,
  resumeId: string,
  originalName: string,
  mimeType = "application/pdf",
): Promise<{ storagePath: string; publicUrl?: string }> {
  let ext = "pdf";
  const nameLower = originalName.toLowerCase();

  if (mimeType.includes("word") || nameLower.endsWith(".docx")) {
    ext = "docx";
  } else if (mimeType.includes("msword") || nameLower.endsWith(".doc")) {
    ext = "doc";
  } else if (mimeType.includes("png") || nameLower.endsWith(".png")) {
    ext = "png";
  } else if (
    mimeType.includes("jpeg") ||
    nameLower.endsWith(".jpg") ||
    nameLower.endsWith(".jpeg")
  ) {
    ext = "jpg";
  } else if (mimeType.includes("webp") || nameLower.endsWith(".webp")) {
    ext = "webp";
  }

  const storagePath = `${userId}/${resumeId}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_IMPORTED)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: true,
      metadata: {
        originalName,
        uploadedBy: userId,
      },
    });

  if (error || !data) {
    throw new AppError(`Storage upload failed: ${error?.message}`, 500, "STORAGE_ERROR");
  }

  return { storagePath: data.path };
}

/**
 * Delete a file from storage. Non-throwing — logs warning on failure.
 */
export async function deleteStorageFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
  if (error) {
    console.warn(`[Storage] Failed to delete ${bucket}/${path}: ${error.message}`);
  }
}

/**
 * Generate a signed download URL for a storage file (valid 1 hour).
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new AppError("Failed to generate download URL", 500, "STORAGE_ERROR");
  }

  return data.signedUrl;
}

export { BUCKET_IMPORTED, BUCKET_GENERATED };
