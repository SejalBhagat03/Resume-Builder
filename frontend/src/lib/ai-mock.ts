// Mocked AI helpers — deterministic, instant. No API calls.
// Each function returns plausible suggestions with explanations.

import type { Profile } from "./profile-store";
import type { Resume } from "./resume-store";

export type Suggestion = {
  id: string;
  title: string;
  reason: string;
  apply: (resume: Resume) => Resume;
};

export type RoleMatch = {
  role: string;
  score: number; // 0-100
  reason: string;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

// ---- Summary generation ----

export function generateSummary(profile: Profile): string {
  const role = profile.title || "Software Engineer";
  const topSkills = profile.skills
    .flatMap((s) => s.items.split(",").map((x) => x.trim()))
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");
  const exp = profile.experience[0];
  const proj = profile.projects[0];
  const lead = exp
    ? `${role} with experience as ${exp.role} at ${exp.company}.`
    : proj
      ? `${role} who has built ${proj.name} using ${proj.tools}.`
      : `${role} eager to build production-grade software.`;
  const tail = topSkills
    ? `Comfortable across ${topSkills}.`
    : `Strong fundamentals and a bias toward shipping.`;
  return `${lead} ${tail} Focused on writing maintainable code and delivering measurable impact.`;
}

// ---- Bullet improvement ----

const ACTION_VERBS = [
  "Built",
  "Shipped",
  "Designed",
  "Led",
  "Owned",
  "Improved",
  "Reduced",
  "Scaled",
];

export function improveBullet(bullet: string): string {
  const trimmed = bullet.trim().replace(/^[-*•\s]+/, "");
  if (!trimmed) return bullet;
  const lower = trimmed.toLowerCase();

  // Already starts with an action verb? Just polish.
  const startsStrong = ACTION_VERBS.some((v) => lower.startsWith(v.toLowerCase()));
  let next = trimmed;
  if (!startsStrong) {
    const verb = lower.startsWith("worked")
      ? "Shipped"
      : lower.startsWith("helped") || lower.startsWith("assisted")
        ? "Collaborated on"
        : lower.startsWith("made") || lower.startsWith("created")
          ? "Built"
          : "Delivered";
    next = `${verb} ${trimmed.replace(/^[A-Z]/, (c) => c.toLowerCase())}`;
  }
  // Add a measurable outcome hook if none present.
  if (!/\d/.test(next)) {
    next = `${next.replace(/[.\s]+$/, "")} — improving outcomes for the team.`;
  } else if (!next.endsWith(".")) {
    next = `${next}.`;
  }
  return next;
}

// ---- Skill suggestions ----

const SKILL_GRAPH: Record<string, string[]> = {
  react: ["TypeScript", "Redux", "Next.js", "React Query", "Vite"],
  node: ["Express", "Fastify", "PostgreSQL", "Redis", "Prisma"],
  python: ["FastAPI", "Pandas", "NumPy", "PyTorch"],
  aws: ["S3", "Lambda", "CloudFormation", "CloudWatch"],
  docker: ["Kubernetes", "CI/CD", "GitHub Actions"],
  sql: ["PostgreSQL", "Indexing", "Query Optimization"],
};

export function suggestSkills(profile: Profile): string[] {
  const current = new Set(
    profile.skills.flatMap((s) => s.items.split(",").map((x) => x.trim().toLowerCase())),
  );
  const fromExp = tokenize(
    [
      ...profile.experience.flatMap((e) => [e.role, ...e.bullets]),
      ...profile.projects.flatMap((p) => [p.tools, ...p.bullets]),
    ].join(" "),
  );
  const suggestions: string[] = [];
  for (const tok of uniq(fromExp)) {
    const matches = SKILL_GRAPH[tok];
    if (matches) {
      for (const m of matches) {
        if (!current.has(m.toLowerCase()) && !suggestions.includes(m)) suggestions.push(m);
      }
    }
  }
  if (suggestions.length === 0) {
    return ["Git", "REST APIs", "Unit Testing"].filter((s) => !current.has(s.toLowerCase()));
  }
  return suggestions.slice(0, 6);
}

// ---- Role recommendation ----

const ROLE_KEYWORDS: Record<string, string[]> = {
  "Full Stack Developer": ["react", "node", "typescript", "api", "postgres", "express"],
  "Frontend Developer": ["react", "css", "tailwind", "typescript", "next.js", "ui", "vite"],
  "Backend Developer": ["node", "python", "api", "postgres", "redis", "express", "fastapi"],
  "Software Engineer": ["javascript", "typescript", "git", "api", "tests"],
  "Data Engineer": ["python", "sql", "etl", "airflow", "spark", "postgres"],
  "DevOps Engineer": ["docker", "kubernetes", "aws", "ci/cd", "terraform"],
  "Mobile Developer": ["react native", "swift", "kotlin", "ios", "android"],
};

export function recommendRoles(profile: Profile, jd?: string): RoleMatch[] {
  const corpus = [
    profile.title,
    profile.summary,
    ...profile.skills.map((s) => s.items),
    ...profile.experience.flatMap((e) => [e.role, ...e.bullets]),
    ...profile.projects.flatMap((p) => [p.tools, ...p.bullets]),
  ]
    .join(" ")
    .toLowerCase();
  const jdTokens = jd ? new Set(tokenize(jd)) : null;

  const matches: RoleMatch[] = Object.entries(ROLE_KEYWORDS).map(([role, keywords]) => {
    let hits = 0;
    let jdHits = 0;
    for (const k of keywords) {
      if (corpus.includes(k)) hits += 1;
      if (jdTokens && jdTokens.has(k)) jdHits += 1;
    }
    const base = (hits / keywords.length) * 80;
    const jdBoost = jdTokens ? (jdHits / keywords.length) * 20 : 0;
    const noise = role.length % 5;
    const score = Math.min(99, Math.round(base + jdBoost + noise + (corpus.length > 200 ? 8 : 0)));
    const matched = keywords.filter((k) => corpus.includes(k)).slice(0, 3);
    const reason = matched.length
      ? `Matched on ${matched.join(", ")}.`
      : "Limited signal in your profile for this role.";
    return { role, score, reason };
  });

  return matches.sort((a, b) => b.score - a.score);
}

// ---- JD tailoring suggestions ----

export function tailorForJob(resume: Resume, jd: string): Suggestion[] {
  const jdTokens = new Set(tokenize(jd));
  const suggestions: Suggestion[] = [];

  // 1. Reorder projects so those matching the JD come first.
  const ranked = resume.data.projects
    .map((p, i) => {
      const text = `${p.name} ${p.tools} ${p.bullets.join(" ")}`.toLowerCase();
      const hits = [...jdTokens].filter((t) => t.length > 2 && text.includes(t)).length;
      return { i, hits, p };
    })
    .sort((a, b) => b.hits - a.hits);
  if (ranked.length > 1 && ranked[0].i !== 0 && ranked[0].hits > 0) {
    const topProject = ranked[0].p;
    const topKeywords = [...jdTokens]
      .filter(
        (t) => t.length > 2 && `${topProject.name} ${topProject.tools}`.toLowerCase().includes(t),
      )
      .slice(0, 2)
      .join(" and ");
    suggestions.push({
      id: "reorder-projects",
      title: `Move "${topProject.name}" to position #1`,
      reason: `The job description emphasizes ${topKeywords || "this stack"} — your strongest matching project should appear first.`,
      apply: (r) => ({
        ...r,
        data: { ...r.data, projects: ranked.map((x) => x.p) },
      }),
    });
  }

  // 2. Reorder skill groups so JD-matching categories rise to the top.
  const rankedSkills = resume.data.skills
    .map((s, i) => {
      const text = `${s.category} ${s.items}`.toLowerCase();
      const hits = [...jdTokens].filter((t) => t.length > 2 && text.includes(t)).length;
      return { i, hits, s };
    })
    .sort((a, b) => b.hits - a.hits);
  if (rankedSkills.length > 1 && rankedSkills[0].i !== 0 && rankedSkills[0].hits > 0) {
    suggestions.push({
      id: "reorder-skills",
      title: `Prioritize "${rankedSkills[0].s.category}" skills`,
      reason: `This category matches the most keywords from the job description.`,
      apply: (r) => ({
        ...r,
        data: { ...r.data, skills: rankedSkills.map((x) => x.s) },
      }),
    });
  }

  // 3. Suggest summary refresh.
  if (resume.data.summary.length < 220 || !jdHitsAny(resume.data.summary, jdTokens)) {
    const role = guessRoleFromJD(jd) || resume.data.fullName;
    const newSummary = `${role ? `${role} ` : ""}with hands-on experience across the stack mentioned in this role. ${resume.data.summary || "Focused on shipping reliable, well-tested software."}`;
    suggestions.push({
      id: "summary",
      title: "Tighten your summary for this role",
      reason: "Your summary doesn't yet mirror the language used in the job description.",
      apply: (r) => ({ ...r, data: { ...r.data, summary: newSummary.slice(0, 320) } }),
    });
  }

  // 4. Missing keyword callouts (no auto-apply — informational suggestion).
  const allText = JSON.stringify(resume.data).toLowerCase();
  const missing = [...jdTokens].filter(
    (t) => t.length > 3 && !STOPWORDS.has(t) && !allText.includes(t),
  );
  const interesting = missing.filter((t) => /^[a-z][a-z+./-]*$/.test(t)).slice(0, 6);
  if (interesting.length > 0) {
    suggestions.push({
      id: "missing-keywords",
      title: `Consider mentioning: ${interesting.join(", ")}`,
      reason:
        "These keywords appear in the job description but not in your resume. Add them only where they truthfully apply to your experience.",
      apply: (r) => r, // informational
    });
  }

  return suggestions;
}

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "you",
  "your",
  "our",
  "are",
  "will",
  "have",
  "this",
  "that",
  "from",
  "they",
  "their",
  "into",
  "but",
  "not",
  "all",
  "any",
  "can",
  "who",
  "what",
  "when",
  "where",
  "why",
  "how",
  "were",
  "been",
  "being",
  "more",
  "most",
  "other",
  "some",
  "such",
  "than",
  "then",
  "there",
  "these",
  "those",
  "just",
  "like",
  "also",
  "over",
  "under",
  "each",
  "very",
  "much",
  "many",
  "work",
  "working",
  "role",
  "team",
  "teams",
  "strong",
  "skills",
  "experience",
  "year",
  "years",
]);

function jdHitsAny(text: string, tokens: Set<string>): boolean {
  const lower = text.toLowerCase();
  for (const t of tokens) if (t.length > 3 && lower.includes(t)) return true;
  return false;
}

function guessRoleFromJD(jd: string): string | null {
  const lower = jd.toLowerCase();
  for (const role of Object.keys(ROLE_KEYWORDS)) {
    if (lower.includes(role.toLowerCase())) return role;
  }
  return null;
}

// ---- Unified review ----

export type ReviewItem =
  | { kind: "good"; message: string }
  | { kind: "warn"; message: string }
  | { kind: "tip"; message: string };

export type ReviewReport = {
  atsScore: number;
  readability: number; // 0-100
  estPages: number;
  keywordCoverage: number; // 0-100 vs JD (or generic role)
  items: ReviewItem[];
  strongest: string;
};

export function reviewResume(resume: Resume, jd?: string): ReviewReport {
  const items: ReviewItem[] = [];
  const data = resume.data;

  // ATS-like score: presence of standard sections + contact info.
  let ats = 60;
  if (data.email) ats += 5;
  if (data.phone) ats += 5;
  if (data.summary.length > 80) ats += 5;
  if (data.experience.length > 0) ats += 8;
  if (data.education.length > 0) ats += 7;
  if (data.skills.length > 0) ats += 5;
  if (data.projects.length > 0) ats += 5;
  ats = Math.min(99, ats);

  // Readability: penalize very long bullets.
  const bullets = [
    ...data.experience.flatMap((e) => e.bullets),
    ...data.projects.flatMap((p) => p.bullets),
  ];
  const avgLen = bullets.length ? bullets.reduce((s, b) => s + b.length, 0) / bullets.length : 0;
  const readability = Math.max(40, Math.min(98, 100 - Math.round((avgLen - 90) / 4)));

  // Page estimate.
  const totalChars = JSON.stringify(data).length;
  const estPages = Math.max(1, Math.round(totalChars / 1800));

  // Keyword coverage.
  let coverage = 70;
  if (jd) {
    const jdTokens = uniq(tokenize(jd)).filter((t) => t.length > 3 && !STOPWORDS.has(t));
    const corpus = JSON.stringify(data).toLowerCase();
    const matched = jdTokens.filter((t) => corpus.includes(t)).length;
    coverage = jdTokens.length ? Math.round((matched / jdTokens.length) * 100) : 70;
  }

  // Items.
  if (ats >= 90)
    items.push({ kind: "good", message: "Strong ATS structure — all key sections present." });
  if (coverage >= 70)
    items.push({ kind: "good", message: "Great keyword coverage for this role." });
  if (data.summary.length > 320)
    items.push({ kind: "warn", message: "Your summary could be shorter — aim for 2–3 lines." });
  if (data.summary.length < 60)
    items.push({
      kind: "warn",
      message: "Your summary is very short — add 1–2 lines about your strengths.",
    });
  if (avgLen > 160)
    items.push({
      kind: "warn",
      message: "Some bullets are long. Aim for a single line per bullet.",
    });
  if (!bullets.some((b) => /\d/.test(b)))
    items.push({
      kind: "tip",
      message: "Consider adding measurable outcomes (%, $, time) where possible.",
    });
  if (data.projects.length > 0 && data.projects[0].bullets.length < 2)
    items.push({ kind: "tip", message: "Add a second bullet to your top project to show depth." });
  if (estPages > 2)
    items.push({
      kind: "warn",
      message: "Resume looks long (~2+ pages). Trim older or less relevant items.",
    });
  if (jd && coverage < 60)
    items.push({
      kind: "tip",
      message: "Mirror more keywords from the job description in your experience and skills.",
    });

  // Strongest section heuristic.
  const sectionScores: Record<string, number> = {
    Experience: data.experience.reduce((s, e) => s + e.bullets.length * 10 + e.role.length, 0),
    Projects: data.projects.reduce((s, p) => s + p.bullets.length * 10 + p.tools.length, 0),
    Skills: data.skills.reduce((s, x) => s + x.items.split(",").length * 3, 0),
    Education: data.education.length * 20,
  };
  const strongest = Object.entries(sectionScores).sort((a, b) => b[1] - a[1])[0][0];

  if (items.length < 3)
    items.push({
      kind: "good",
      message: `Your ${strongest} section is your strongest — keep it prominent.`,
    });

  return { atsScore: ats, readability, estPages, keywordCoverage: coverage, items, strongest };
}

// ---- Interview prep ----

export function interviewQuestions(
  resume: Resume,
  jd?: string,
): { question: string; tip: string }[] {
  const q: { question: string; tip: string }[] = [];
  const top = resume.data.projects[0];
  const topExp = resume.data.experience[0];
  if (top) {
    q.push({
      question: `Walk me through how you built ${top.name}.`,
      tip: `Cover the problem, your specific contribution, the stack (${top.tools}), and the impact.`,
    });
    q.push({
      question: `What was the hardest technical decision in ${top.name}?`,
      tip: "Pick one trade-off, explain alternatives you considered, and why your choice won.",
    });
  }
  if (topExp) {
    q.push({
      question: `Tell me about your work at ${topExp.company}.`,
      tip: `Use STAR — Situation, Task, Action, Result. Lead with a measurable result.`,
    });
  }
  if (jd) {
    q.push({
      question: "Why are you a good fit for this role specifically?",
      tip: "Map two of your strengths to two responsibilities from the job description.",
    });
  } else {
    q.push({
      question: "Where do you see yourself in 2 years?",
      tip: "Tie your answer to the role you're applying for — growth in adjacent skills, ownership of larger systems.",
    });
  }
  q.push({
    question: "Tell me about a time you received critical feedback.",
    tip: "Show self-awareness, the concrete change you made, and the outcome that followed.",
  });
  return q;
}
