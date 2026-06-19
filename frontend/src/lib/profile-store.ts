import * as React from "react";
import { getStorageKey, storageGet, storageSet, storageRemove } from "@/lib/storage";

export type Education = { degree: string; school: string; year: string; cgpa?: string };
export type Experience = { role: string; company: string; period: string; bullets: string[] };
export type Project = { name: string; tools: string; bullets: string[] };
export type SkillGroup = { category: string; items: string };
export type Certification = { name: string; issuer: string; year: string };
export type LanguageItem = { name: string; level: string };
export type Achievement = { title: string; detail: string };

export type Profile = {
  // Personal
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  // Links
  github: string;
  linkedin: string;
  portfolio: string;
  // Sections
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  certifications: Certification[];
  languages: LanguageItem[];
  achievements: Achievement[];
};

// ─── Module-level auth state ─────────────────────────────────────────────────
let _activeUserId: string | null = null;

function getKey(): string {
  return getStorageKey("profile", _activeUserId);
}

/** Call this whenever auth state changes (login / logout). */
export function setActiveProfileUser(userId: string | null): void {
  _activeUserId = userId;
}

// ─── Empty / blank profile ───────────────────────────────────────────────────

export function emptyProfile(): Profile {
  return {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    github: "",
    linkedin: "",
    portfolio: "",
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    languages: [],
    achievements: [],
  };
}

// ─── Low-level read / write ──────────────────────────────────────────────────

function read(): Profile {
  return { ...emptyProfile(), ...(storageGet<Profile>(getKey()) ?? {}) };
}

function write(p: Profile): void {
  storageSet(getKey(), p);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("rbp:profile-changed"));
  }
}

// ─── Migration ───────────────────────────────────────────────────────────────

/**
 * On login, migrate profile data from the anonymous scope (or old global key)
 * into the authenticated user's namespace — but only if the user doesn't already
 * have a profile (to avoid overwriting existing data).
 */
export function migrateLocalProfileToUser(userId: string): void {
  const userKey = getStorageKey("profile", userId);
  const existingUser = storageGet<Profile>(userKey);

  // Don't overwrite an existing saved profile
  if (existingUser && existingUser.fullName) return;

  const legacyKeys = [
    getStorageKey("profile", null), // anonymous scope
    "rbp.profile.v1", // old global key (pre user-scoping)
  ].filter((k) => k !== userKey);

  for (const srcKey of legacyKeys) {
    const srcData = storageGet<Profile>(srcKey);
    if (srcData && srcData.fullName) {
      storageSet(userKey, srcData);
      storageRemove(srcKey);
      return; // Use the first non-empty source found
    }
  }

  // Clean up any leftover empty anonymous keys
  for (const srcKey of legacyKeys) {
    storageRemove(srcKey);
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function getProfile(): Profile {
  return read();
}

export function saveProfile(p: Profile): void {
  write(p);
}

// ─── useProfile hook ─────────────────────────────────────────────────────────

export function useProfile(): [Profile, (updater: (p: Profile) => Profile) => void] {
  const [profile, setProfile] = React.useState<Profile>(emptyProfile);

  React.useEffect(() => {
    let active = true;

    function syncForUser(userId: string | null) {
      setActiveProfileUser(userId);
      if (userId) {
        migrateLocalProfileToUser(userId);
      }
      if (active) setProfile(read());
    }

    // Initialize with current session
    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        syncForUser(session?.user?.id ?? null);
      });

      // React to login / logout
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        syncForUser(session?.user?.id ?? null);
      });

      const handleLocalChange = () => {
        if (active) setProfile(read());
      };
      window.addEventListener("rbp:profile-changed", handleLocalChange);
      window.addEventListener("storage", handleLocalChange);

      // Cleanup stored in a ref so it survives the async boundary
      (window as unknown as Record<string, unknown>).__rbpProfileCleanup = () => {
        active = false;
        subscription.unsubscribe();
        window.removeEventListener("rbp:profile-changed", handleLocalChange);
        window.removeEventListener("storage", handleLocalChange);
      };
    });

    return () => {
      active = false;
      const cleanup = (window as unknown as Record<string, unknown>)
        .__rbpProfileCleanup as (() => void) | undefined;
      cleanup?.();
    };
  }, []);

  const update = React.useCallback((updater: (p: Profile) => Profile) => {
    setProfile((prev) => {
      const next = updater(prev);
      write(next);
      return next;
    });
  }, []);

  return [profile, update];
}

// ─── Profile completeness score ──────────────────────────────────────────────

export function profileCompleteness(p: Profile): number {
  let score = 0;
  const checks: boolean[] = [
    !!p.fullName,
    !!p.email,
    !!p.phone,
    !!p.location,
    !!p.summary && p.summary.length > 40,
    p.education.length > 0,
    p.experience.length > 0 || p.projects.length > 0,
    p.skills.length > 0,
    !!(p.github || p.linkedin || p.portfolio),
    p.certifications.length + p.languages.length + p.achievements.length > 0,
  ];
  checks.forEach((c) => c && (score += 10));
  return score;
}
