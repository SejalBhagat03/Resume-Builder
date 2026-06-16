import * as React from "react";

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
  title: string; // e.g. "Full Stack Developer"
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

const KEY = "rbp.profile.v1";

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

function seedProfile(): Profile {
  return {
    fullName: "Sejal Bhagat",
    title: "Full Stack Developer",
    email: "sejal@example.com",
    phone: "+91 90000 00000",
    location: "Bengaluru, India",
    summary:
      "Full Stack Developer with hands-on experience building production React + Node.js applications. Strong focus on shipping measurable outcomes and writing maintainable TypeScript.",
    github: "github.com/sejal",
    linkedin: "linkedin.com/in/sejal",
    portfolio: "sejal.dev",
    education: [
      {
        degree: "B.Tech, Computer Science",
        school: "VIT University",
        year: "2022 – 2026",
        cgpa: "8.7",
      },
    ],
    experience: [
      {
        role: "Software Engineer Intern",
        company: "Acme Cloud",
        period: "Jun 2025 – Aug 2025",
        bullets: [
          "Shipped a billing dashboard feature used by 10k+ paying customers.",
          "Reduced API latency by 32% by introducing Redis caching for hot endpoints.",
        ],
      },
    ],
    projects: [
      {
        name: "Resume Builder Pro",
        tools: "React, TypeScript, Tailwind",
        bullets: [
          "Built a step-by-step resume editor with live preview and ATS scoring.",
          "Integrated AI-assisted bullet improvement and JD matching.",
        ],
      },
      {
        name: "Realtime Chat App",
        tools: "Node.js, Socket.IO, Postgres",
        bullets: [
          "Designed message persistence layer handling 500 msgs/sec.",
          "Implemented presence and typing indicators.",
        ],
      },
    ],
    skills: [
      { category: "Languages", items: "TypeScript, JavaScript, Python, SQL" },
      { category: "Frameworks", items: "React, Next.js, Node.js, Express" },
      { category: "Tools", items: "Git, Docker, Postgres, Redis" },
    ],
    certifications: [
      { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", year: "2025" },
    ],
    languages: [
      { name: "English", level: "Fluent" },
      { name: "Hindi", level: "Native" },
    ],
    achievements: [
      { title: "Smart India Hackathon Finalist", detail: "Top 12 nationally out of 4,000+ teams." },
    ],
  };
}

function read(): Profile {
  if (typeof window === "undefined") return seedProfile();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seedProfile();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return { ...emptyProfile(), ...(JSON.parse(raw) as Profile) };
  } catch {
    return seedProfile();
  }
}

function write(p: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("rbp:profile-changed"));
}

export function getProfile(): Profile {
  return read();
}

export function saveProfile(p: Profile) {
  write(p);
}

export function useProfile(): [Profile, (updater: (p: Profile) => Profile) => void] {
  const [profile, setProfile] = React.useState<Profile>(seedProfile);
  React.useEffect(() => {
    const sync = () => setProfile(read());
    sync();
    window.addEventListener("rbp:profile-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("rbp:profile-changed", sync);
      window.removeEventListener("storage", sync);
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
