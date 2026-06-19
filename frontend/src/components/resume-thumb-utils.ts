import type { Resume } from "@/lib/resume-store";

/** Realistic demo data shown when no resume is provided (template picker mode) */
export const DEMO_RESUME: Resume["data"] = {
  fullName: "Alex Johnson",
  email: "alex@example.com",
  phone: "+1 555 234 5678",
  location: "San Francisco, CA",
  summary:
    "Results-driven software engineer with 3+ years of experience building scalable web applications. Passionate about clean code and great user experiences.",
  website: "alexjohnson.dev",
  linkedin: "linkedin.com/in/alexjohnson",
  github: "github.com/alexjohnson",
  education: [
    {
      degree: "B.S. Computer Science",
      school: "UC Berkeley",
      year: "2019 – 2023",
      cgpa: "3.8",
    },
  ],
  experience: [
    {
      role: "Software Engineer",
      company: "Stripe",
      period: "Jan 2023 – Present",
      bullets: [
        "Built payment dashboard used by 50k+ merchants worldwide.",
        "Reduced API response time by 40% through caching strategies.",
        "Led migration from REST to GraphQL across 3 microservices.",
      ],
    },
    {
      role: "Frontend Intern",
      company: "Figma",
      period: "Jun 2022 – Dec 2022",
      bullets: [
        "Implemented accessible UI components with React + TypeScript.",
        "Shipped 12 features as part of Figma's design system.",
      ],
    },
  ],
  projects: [
    {
      name: "OpenTracker",
      tools: "React, Node.js, PostgreSQL",
      bullets: [
        "Open-source job application tracker with 2k GitHub stars.",
        "Implemented real-time notifications with WebSockets.",
      ],
    },
  ],
  skills: [
    { category: "Languages", items: "TypeScript, Python, Go, SQL" },
    { category: "Frameworks", items: "React, Next.js, Node.js, FastAPI" },
    { category: "Tools", items: "Docker, AWS, Git, Figma" },
  ],
  certifications: ["AWS Certified Developer – Associate (2023)"],
  achievements: ["Dean's List — 4 consecutive semesters"],
  languages: ["English (Native)", "Spanish (Conversational)"],
  publications: [],
  volunteer: [],
  customization: { accentColor: "", fontSize: "md", spacing: "md" },
};

export function templateAccent(id?: string): string {
  switch (id) {
    case "ats-professional":
      return "oklch(0.45 0.12 250)";
    case "modern":
      return "oklch(0.55 0.18 30)";
    case "minimal":
      return "oklch(0.35 0.02 60)";
    case "creative":
      return "oklch(0.55 0.2 320)";
    case "two-column":
      return "oklch(0.45 0.15 160)";
    default:
      return "var(--brand)";
  }
}
