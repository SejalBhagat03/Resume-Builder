import * as React from "react";
import { supabase } from "@/integrations/supabase/client";

export type ProfileType = "fresh" | "experienced" | "internship" | "academic" | "custom";
export type TemplateId = "ats-professional" | "modern" | "minimal" | "creative" | "two-column";

export type Resume = {
  id: string;
  title: string;
  profileType: ProfileType;
  template: TemplateId;
  updatedAt: number;
  downloads: number;
  atsScore: number;
  data: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    education: { degree: string; school: string; year: string; cgpa?: string }[];
    experience: { role: string; company: string; period: string; bullets: string[] }[];
    projects: { name: string; tools: string; bullets: string[] }[];
    skills: { category: string; items: string }[];
    customization?: {
      accentColor?: string;
      fontSize?: "sm" | "md" | "lg";
      spacing?: "sm" | "md" | "lg";
    };
    importedLayout?: {
      viewport?: { width: number; height: number };
      textItems?: {
        text: string;
        x: number;
        y: number;
        width: number;
        height: number;
        fontSize: number;
        fontFamily?: string;
        originalText?: string;
        fontScale?: number;
        widthScale?: number;
        xOffset?: number;
        yOffset?: number;
        bgColor?: string;
        textColor?: string;
        fontWeight?: string;
        textAlign?: string;
      }[];
      pages?: {
        viewport: { width: number; height: number };
        textItems: {
          text: string;
          x: number;
          y: number;
          width: number;
          height: number;
          fontSize: number;
          fontFamily?: string;
          originalText?: string;
          fontScale?: number;
          widthScale?: number;
          xOffset?: number;
          yOffset?: number;
          bgColor?: string;
          textColor?: string;
          fontWeight?: string;
          textAlign?: string;
        }[];
      }[];
    };
    rawText?: string;
    isVisualMode?: boolean;
    importedPdf?: {
      storagePath?: string;
      pageCount: number;
      uploadedAt: string;
    };
  };
};

const STORAGE_KEY = "rbp.resumes.v1";

const seed: Resume[] = [
  {
    id: "r1",
    title: "Full Stack Developer Resume",
    profileType: "experienced",
    template: "ats-professional",
    updatedAt: Date.now() - 1000 * 60 * 2,
    downloads: 4,
    atsScore: 95,
    data: emptyData("Sejal Bhagat"),
  },
  {
    id: "r2",
    title: "Fresh Graduate Resume",
    profileType: "fresh",
    template: "ats-professional",
    updatedAt: Date.now() - 1000 * 60 * 60 * 5,
    downloads: 3,
    atsScore: 88,
    data: emptyData("Sejal Bhagat"),
  },
  {
    id: "r3",
    title: "Test Version",
    profileType: "custom",
    template: "modern",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    downloads: 2,
    atsScore: 76,
    data: emptyData("Sejal Bhagat"),
  },
  {
    id: "r4",
    title: "Default Resume",
    profileType: "custom",
    template: "minimal",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    downloads: 7,
    atsScore: 82,
    data: emptyData("Sejal Bhagat"),
  },
];

export function emptyData(name = "Your Name"): Resume["data"] {
  return {
    fullName: name,
    email: "you@example.com",
    phone: "+1 555 000 0000",
    location: "City, Country",
    summary: "A short professional summary that highlights your strengths.",
    education: [
      {
        degree: "B.Tech, Computer Science",
        school: "Your University",
        year: "2022 – 2026",
        cgpa: "8.5",
      },
    ],
    experience: [
      {
        role: "Software Engineer Intern",
        company: "Tech Co.",
        period: "Jun 2025 – Aug 2025",
        bullets: ["Shipped a feature used by 10k+ users.", "Improved API latency by 30%."],
      },
    ],
    projects: [
      {
        name: "Portfolio Website",
        tools: "React, Tailwind",
        bullets: ["Built and deployed a personal portfolio.", "Implemented dark mode."],
      },
    ],
    skills: [
      { category: "Languages", items: "TypeScript, Python, Go" },
      { category: "Frameworks", items: "React, Node.js, FastAPI" },
    ],
    customization: {
      accentColor: "",
      fontSize: "md",
      spacing: "md",
    },
  };
}

export function isUUID(str: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(str);
}

export function generateUUID(): string {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function read(): Resume[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as Resume[];
  } catch {
    return seed;
  }
}

function write(list: Resume[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("rbp:resumes-changed"));
}

export function useResumes() {
  const [list, setList] = React.useState<Resume[]>(seed);

  React.useEffect(() => {
    let active = true;

    async function sync() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && active) {
          const { data, error } = await supabase
            .from("resumes")
            .select("*")
            .order("updated_at", { ascending: false });

          if (!error && data && active) {
            const mapped: Resume[] = data.map((r) => ({
              id: r.id,
              title: r.title,
              profileType: r.profile_type as any,
              template: r.template as any,
              updatedAt: new Date(r.updated_at).getTime(),
              downloads: r.downloads,
              atsScore: r.ats_score,
              data: r.data as any,
            }));
            setList(mapped);
            return;
          }
        }
      } catch (err) {
        console.warn("Error loading from Supabase, fallback to local:", err);
      }

      if (active) {
        setList(read());
      }
    }

    sync();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      sync();
    });

    window.addEventListener("rbp:resumes-changed", sync);
    window.addEventListener("storage", sync);

    return () => {
      active = false;
      subscription.unsubscribe();
      window.removeEventListener("rbp:resumes-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return list;
}

export function getResume(id: string): Resume | undefined {
  return read().find((r) => r.id === id);
}

export async function saveResume(r: Resume) {
  let activeId = r.id;
  if (!isUUID(activeId)) {
    activeId = generateUUID();
    r = { ...r, id: activeId };
  }

  const list = read();
  const i = list.findIndex((x) => x.id === r.id);
  const next = { ...r, updatedAt: Date.now() };
  if (i >= 0) list[i] = next;
  else list.unshift(next);
  write(list);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const dbResume = {
        id: activeId,
        user_id: session.user.id,
        title: r.title,
        profile_type: r.profileType,
        template: r.template,
        data: r.data,
        ats_score: r.atsScore,
        downloads: r.downloads,
      };
      await supabase.from("resumes").upsert(dbResume);
    }
  } catch (err) {
    console.warn("Supabase save error:", err);
  }
}

export async function deleteResume(id: string) {
  write(read().filter((r) => r.id !== id));

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && isUUID(id)) {
      await supabase.from("resumes").delete().eq("id", id);
    }
  } catch (err) {
    console.warn("Supabase delete error:", err);
  }
}

export function createResume(input: {
  title: string;
  profileType: ProfileType;
  template: TemplateId;
}): Resume {
  const uuid = generateUUID();
  const r: Resume = {
    id: uuid,
    title: input.title || "Untitled Resume",
    profileType: input.profileType,
    template: input.template,
    updatedAt: Date.now(),
    downloads: 0,
    atsScore: 60,
    data: emptyData(),
  };
  const list = read();
  list.unshift(r);
  write(list);

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      const dbResume = {
        id: uuid,
        user_id: session.user.id,
        title: r.title,
        profile_type: r.profileType,
        template: r.template,
        data: r.data,
        ats_score: r.atsScore,
        downloads: r.downloads,
      };
      supabase.from("resumes").insert(dbResume).then(({ error }) => {
        if (error) console.warn("Supabase create error:", error.message);
      });
    }
  });

  return r;
}

export async function syncLocalResumesToSupabase() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const localList = read();
    const nonSynced = localList.filter((r) => !isUUID(r.id));
    if (nonSynced.length === 0) return;

    for (let r of nonSynced) {
      const oldId = r.id;
      const newId = generateUUID();
      r = { ...r, id: newId };

      const dbResume = {
        id: newId,
        user_id: session.user.id,
        title: r.title,
        profile_type: r.profileType,
        template: r.template,
        data: r.data,
        ats_score: r.atsScore,
        downloads: r.downloads,
      };

      const { error } = await supabase.from("resumes").insert(dbResume);
      if (!error) {
        const currentList = read();
        const idx = currentList.findIndex((x) => x.id === oldId);
        if (idx >= 0) {
          currentList[idx] = r;
          write(currentList);
        }
      }
    }
  } catch (err) {
    console.warn("Sync migration error:", err);
  }
}

export function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(ts).toLocaleDateString();
}

export const TEMPLATES: { id: TemplateId; name: string; tagline: string }[] = [
  {
    id: "ats-professional",
    name: "ATS Professional",
    tagline: "Recruiter-friendly, single column",
  },
  { id: "modern", name: "Modern", tagline: "Bold headings with accent" },
  { id: "minimal", name: "Minimal", tagline: "Clean, lots of whitespace" },
  { id: "creative", name: "Creative", tagline: "Designer-leaning layout" },
  { id: "two-column", name: "Two Column", tagline: "Sidebar with skills" },
];

import type { Profile } from "./profile-store";
export type SectionKey = "summary" | "experience" | "projects" | "education" | "skills";

export function dataFromProfile(
  profile: Profile,
  opts: {
    include: Record<SectionKey, boolean>;
    pickedProjectIdx?: number[];
    pickedExperienceIdx?: number[];
  },
): Resume["data"] {
  const pickExp = opts.pickedExperienceIdx ?? profile.experience.map((_, i) => i);
  const pickProj = opts.pickedProjectIdx ?? profile.projects.map((_, i) => i);
  return {
    fullName: profile.fullName || "Your Name",
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    summary: opts.include.summary ? profile.summary : "",
    education: opts.include.education ? profile.education : [],
    experience: opts.include.experience
      ? pickExp.map((i) => profile.experience[i]).filter(Boolean)
      : [],
    projects: opts.include.projects ? pickProj.map((i) => profile.projects[i]).filter(Boolean) : [],
    skills: opts.include.skills ? profile.skills : [],
  };
}
