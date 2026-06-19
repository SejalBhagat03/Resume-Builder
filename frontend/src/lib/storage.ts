/**
 * storage.ts — Centralized, user-scoped localStorage helpers.
 *
 * All app data is namespaced by userId so no user ever sees another user's data.
 * Anonymous visitors use the "anonymous" scope; on login data is migrated automatically.
 *
 * Key format:  rbp.<namespace>.v1.<userId|"anonymous">
 * Examples:
 *   rbp.resumes.v1.anonymous
 *   rbp.resumes.v1.abc-123-def-456
 *   rbp.profile.v1.abc-123-def-456
 */

export const ANON_ID = "anonymous";

export type StorageNamespace = "resumes" | "profile" | "settings" | "drafts";

/** Returns the namespaced localStorage key for a given user. */
export function getStorageKey(
  namespace: StorageNamespace,
  userId: string | null | undefined,
): string {
  const scope = userId ?? ANON_ID;
  return `rbp.${namespace}.v1.${scope}`;
}

/** Reads and JSON-parses a value from localStorage. Returns null on missing or parse error. */
export function storageGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** JSON-stringifies and writes a value to localStorage. */
export function storageSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn("[storage] Write failed for key:", key);
  }
}

/** Removes a key from localStorage. */
export function storageRemove(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

/**
 * Clears the anonymous scope (called after migrating to a logged-in user's scope).
 */
export function clearAnonymousStorage(): void {
  if (typeof window === "undefined") return;
  const namespaces: StorageNamespace[] = ["resumes", "profile", "settings", "drafts"];
  for (const ns of namespaces) {
    storageRemove(getStorageKey(ns, null));
  }
}

/**
 * Resets the onboarding tour completion flag so the tour runs fresh for a new user.
 * The key is scoped by userId.
 */
export function getTourKey(userId: string | null | undefined): string {
  const scope = userId ?? ANON_ID;
  return `rbp.onboarding.v1.${scope}`;
}
