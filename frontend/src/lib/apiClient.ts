/**
 * Reusable API client for the Resume Builder backend.
 *
 * Usage:
 *   import { apiClient } from '@/lib/apiClient';
 *   const data = await apiClient.post('/ai/generate-summary', { role: 'SWE' });
 */
import { supabase } from "@/integrations/supabase/client";

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:4000") + "/api";

class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await response.json().catch(() => ({
    success: false,
    message: "Invalid server response",
    code: "INVALID_RESPONSE",
  }));

  if (!json.success) {
    throw new ApiError(
      json.message ?? "Request failed",
      json.code ?? "UNKNOWN_ERROR",
      response.status,
    );
  }

  return json.data as T;
}

async function uploadFile(path: string, file: File, fieldName = "file"): Promise<unknown> {
  const token = await getAuthToken();
  const form = new FormData();
  form.append(fieldName, file);

  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  const json = await response.json().catch(() => ({
    success: false,
    message: "Upload failed",
    code: "UPLOAD_ERROR",
  }));

  if (!json.success) {
    throw new ApiError(
      json.message ?? "Upload failed",
      json.code ?? "UPLOAD_ERROR",
      response.status,
    );
  }

  return json.data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
  upload: (path: string, file: File, fieldName?: string) => uploadFile(path, file, fieldName),
};

export { ApiError };
