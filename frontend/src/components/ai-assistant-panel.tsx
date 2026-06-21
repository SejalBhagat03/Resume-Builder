import * as React from "react";
import {
  Sparkles,
  Check,
  X,
  Briefcase,
  FileSearch,
  MessageCircleQuestion,
  Wand2,
  Loader2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { RoleRecommendations } from "@/components/role-recommendations";
import { ReviewPanel } from "@/components/review-before-export";
import { useProfile } from "@/lib/profile-store";
import type { Resume } from "@/lib/resume-store";
import { apiClient } from "@/lib/apiClient";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  resume: Resume;
  onApply: (next: Resume) => void;
  inline?: boolean;
};

/** Build a plain text representation of the resume for AI calls */
function resumeToText(resume: Resume): string {
  const d = resume.data;
  return [
    `${d.fullName} — ${d.email} ${d.phone} ${d.location}`,
    `Summary: ${d.summary}`,
    "Experience:",
    ...d.experience.flatMap((x) => [
      `- ${x.role} @ ${x.company} (${x.period})`,
      ...x.bullets.map((b) => `  • ${b}`),
    ]),
    "Projects:",
    ...d.projects.flatMap((p) => [`- ${p.name} (${p.tools})`, ...p.bullets.map((b) => `  • ${b}`)]),
    "Education: " + d.education.map((e) => `${e.degree}, ${e.school} (${e.year})`).join("; "),
    "Skills: " + d.skills.map((s) => `${s.category}: ${s.items}`).join(" | "),
  ].join("\n");
}

export function AiAssistantPanel({ open, onOpenChange, resume, onApply, inline = false }: Props) {
  const [profile] = useProfile();
  const [jd, setJd] = React.useState("");

  const [summaryBusy, setSummaryBusy] = React.useState(false);
  const [bulletsBusy, setBulletsBusy] = React.useState(false);
  const [skillsBusy, setSkillsBusy] = React.useState(false);

  // ── Generate Summary ──────────────────────────────────────────────────────

  const handleGenerateSummary = async () => {
    setSummaryBusy(true);
    try {
      const role = profile.title || resume.data.experience[0]?.role || "Software Engineer";
      const skills = resume.data.skills.map((s) => s.items).join(", ");
      const result = await apiClient.post<{ summary: string }>("/ai/generate-summary", {
        role,
        skills,
        existingSummary: resume.data.summary,
      });
      onApply({ ...resume, data: { ...resume.data, summary: result.summary } });
      toast.success("Summary updated with AI ✨");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI unavailable. Please try again.");
    } finally {
      setSummaryBusy(false);
    }
  };

  // ── Improve Bullets ───────────────────────────────────────────────────────

  const handleImproveBullets = async () => {
    setBulletsBusy(true);
    toast.loading("Rewriting bullets with AI…", { id: "bullets" });
    try {
      const improveAll = async (bullets: string[], role?: string): Promise<string[]> => {
        return Promise.all(
          bullets.map(async (bullet) => {
            const result = await apiClient.post<{ bullet: string }>("/ai/improve-bullet", {
              bullet,
              role,
            });
            return result.bullet;
          }),
        );
      };

      const newExperience = await Promise.all(
        resume.data.experience.map(async (e) => ({
          ...e,
          bullets: await improveAll(e.bullets, e.role),
        })),
      );
      const newProjects = await Promise.all(
        resume.data.projects.map(async (p) => ({
          ...p,
          bullets: await improveAll(p.bullets),
        })),
      );

      onApply({
        ...resume,
        data: { ...resume.data, experience: newExperience, projects: newProjects },
      });
      toast.success("Bullets rewritten with stronger action verbs ✨", { id: "bullets" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI unavailable.", { id: "bullets" });
    } finally {
      setBulletsBusy(false);
    }
  };

  // ── Suggest Skills ────────────────────────────────────────────────────────

  const handleSuggestSkills = async () => {
    setSkillsBusy(true);
    try {
      const role = profile.title || resume.data.experience[0]?.role || "Software Engineer";
      const currentSkills = resume.data.skills.map((s) => s.items).join(", ");
      const result = await apiClient.post<{ skills: string[] }>("/ai/suggest-skills", {
        role,
        currentSkills,
      });
      if (result.skills.length === 0) {
        toast.info("No new skill suggestions — your resume looks comprehensive!");
        return;
      }
      onApply({
        ...resume,
        data: {
          ...resume.data,
          skills: [
            ...resume.data.skills,
            { category: "Suggested Skills", items: result.skills.join(", ") },
          ],
        },
      });
      toast.success(`Added ${result.skills.length} skill suggestions ✨`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI unavailable.");
    } finally {
      setSkillsBusy(false);
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-card">
      {!inline && (
        <SheetHeader className="mb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="text-left">
              <SheetTitle className="text-base font-bold">AI Resume Assistant</SheetTitle>
              <SheetDescription className="text-xs">
                Powered by Google Gemini. Suggestions you decide what to keep.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
      )}

      {inline && (
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/20 shrink-0 select-none">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand shrink-0">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-foreground">AI Resume Assistant</h3>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
              Powered by Google Gemini. Suggestions you decide what to keep.
            </p>
          </div>
        </div>
      )}

      <div className={`flex-1 ${inline ? "overflow-y-auto p-4 scrollbar-thin" : ""}`}>
        <Tabs defaultValue="optimize" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-xl">
            <TabsTrigger value="optimize" className="rounded-lg text-[9px] md:text-xs">
              Optimize
            </TabsTrigger>
            <TabsTrigger value="match" className="rounded-lg text-[9px] md:text-xs">
              Match JD
            </TabsTrigger>
            <TabsTrigger value="review" className="rounded-lg text-[9px] md:text-xs">
              Review
            </TabsTrigger>
            <TabsTrigger value="interview" className="rounded-lg text-[9px] md:text-xs">
              Interview
            </TabsTrigger>
          </TabsList>

          {/* ── Optimize ── */}
          <TabsContent value="optimize" className="mt-4 space-y-3">
            <QuickAction
              label="Generate a fresh summary from your profile"
              cta="Generate"
              busy={summaryBusy}
              onRun={handleGenerateSummary}
            />
            <QuickAction
              label="Polish every experience and project bullet"
              cta="Improve bullets"
              busy={bulletsBusy}
              onRun={handleImproveBullets}
            />
            <QuickAction
              label="Suggest skills based on your experience"
              cta="Suggest"
              busy={skillsBusy}
              onRun={handleSuggestSkills}
            />
            <div className="pt-2">
              <RoleRecommendations profile={profile} limit={3} />
            </div>
          </TabsContent>

          {/* ── Match JD ── */}
          <TabsContent value="match" className="mt-4 space-y-3">
            <div className="text-left">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Paste a job description
              </label>
              <Textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={6}
                placeholder="Paste the JD here. We'll suggest changes — you accept or reject each one."
                className="mt-1.5 rounded-xl bg-card border-border text-sm"
              />
            </div>
            <JdMatchSuggestions
              resume={resume}
              jd={jd}
              onApply={(next) => {
                onApply(next);
                toast.success("Suggestion applied.");
              }}
            />
            {jd.trim().length > 30 && (
              <div className="pt-2">
                <RoleRecommendations profile={profile} jd={jd} limit={3} />
              </div>
            )}
          </TabsContent>

          {/* ── Review ── */}
          <TabsContent value="review" className="mt-4">
            <ReviewPanel resume={resume} jd={jd || undefined} />
          </TabsContent>

          {/* ── Interview ── */}
          <TabsContent value="interview" className="mt-4">
            <InterviewQuestionsPanel resume={resume} jd={jd} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  if (inline) return content;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl border-l border-border p-5">
        {content}
      </SheetContent>
    </Sheet>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function QuickAction({
  label,
  cta,
  busy,
  onRun,
}: {
  label: string;
  cta: string;
  busy?: boolean;
  onRun: () => void;
}) {
  return (
    <Card className="flex items-center justify-between gap-3 rounded-2xl border-border p-3 bg-card">
      <span className="text-sm">{label}</span>
      <Button
        size="sm"
        onClick={onRun}
        disabled={busy}
        className="h-9 shrink-0 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 font-bold"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : cta}
      </Button>
    </Card>
  );
}

function JdMatchSuggestions({
  resume,
  jd,
  onApply,
}: {
  resume: Resume;
  jd: string;
  onApply: (next: Resume) => void;
}) {
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<{
    matchedKeywords: string[];
    missingKeywords: string[];
    missingSkills: string[];
    suggestions: string[];
    score: number;
  } | null>(null);

  React.useEffect(() => {
    setResult(null);
  }, [jd]);

  const analyze = async () => {
    if (jd.trim().length < 30) return;
    setBusy(true);
    try {
      const resumeText = resumeToText(resume);
      const res = await apiClient.post<typeof result>("/ai/job-match", {
        jobDescription: jd,
        resumeText,
      });
      setResult(res);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI unavailable.");
    } finally {
      setBusy(false);
    }
  };

  if (jd.trim().length < 30) {
    return (
      <Card className="rounded-2xl border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
        Paste at least a short paragraph of the JD to see tailored suggestions.
      </Card>
    );
  }

  if (!result && !busy) {
    return (
      <Button
        onClick={analyze}
        className="w-full h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
      >
        <Sparkles className="mr-2 h-4 w-4" /> Analyze with AI
      </Button>
    );
  }

  if (busy) {
    return (
      <Card className="rounded-2xl border-border p-4 text-center text-xs text-muted-foreground">
        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-brand" />
        Analyzing with Gemini AI…
      </Card>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-3">
      {/* Score */}
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-brand bg-brand-soft">
          <div className="text-xl font-extrabold text-brand">{result.score}%</div>
        </div>
        <div>
          <div className="font-bold text-sm">Match Score</div>
          <div className="text-xs text-muted-foreground">Higher = better keyword overlap</div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="ml-auto h-8 rounded-lg text-xs"
          onClick={analyze}
        >
          Re-analyze
        </Button>
      </div>

      {/* Keywords */}
      {result.matchedKeywords.length > 0 && (
        <KeywordBlock title="Matched keywords" items={result.matchedKeywords} tone="success" />
      )}
      {result.missingKeywords.length > 0 && (
        <KeywordBlock title="Missing keywords" items={result.missingKeywords} tone="warn" />
      )}
      {result.missingSkills.length > 0 && (
        <KeywordBlock title="Missing skills" items={result.missingSkills} tone="warn" />
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Suggestions ({result.suggestions.length})
          </div>
          {result.suggestions.map((s, i) => (
            <Card key={i} className="rounded-2xl border-border p-3 bg-card">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-xs text-foreground/90">{s}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function KeywordBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "warn";
}) {
  if (!items.length) return null;
  const cls =
    tone === "success"
      ? "bg-[oklch(0.94_0.06_150)] text-[oklch(0.35_0.1_150)]"
      : "bg-[oklch(0.95_0.08_70)] text-[oklch(0.4_0.12_60)]";
  return (
    <div>
      <div className="text-xs font-bold mb-1.5">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((k) => (
          <span key={k} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

function InterviewQuestionsPanel({ resume, jd }: { resume: Resume; jd: string }) {
  const [busy, setBusy] = React.useState(false);
  const [questions, setQuestions] = React.useState<
    Array<{ question: string; tip: string; category: string }>
  >([]);

  const generate = async () => {
    setBusy(true);
    try {
      const resumeText = resumeToText(resume);
      const result = await apiClient.post<{
        questions: Array<{ question: string; tip: string; category: string }>;
      }>("/ai/interview", {
        resumeText,
        jobDescription: jd || undefined,
        count: 5,
      });
      setQuestions(result.questions);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI unavailable.");
    } finally {
      setBusy(false);
    }
  };

  if (questions.length === 0 && !busy) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Practice questions tailored to your resume{jd ? " and the job description" : ""}.
        </p>
        <Button
          onClick={generate}
          className="w-full h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Generate Questions
        </Button>
      </div>
    );
  }

  if (busy) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span className="text-xs">Generating tailored interview questions…</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <Card key={i} className="rounded-2xl border-border p-4 bg-card">
          <div className="flex items-start gap-2">
            <span className="shrink-0 grid h-6 w-6 place-items-center rounded-full bg-brand/10 text-brand text-[10px] font-bold">
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{q.question}</div>
              <p className="mt-1.5 text-xs text-muted-foreground leading-normal">
                <span className="font-semibold text-brand">Tip — </span>
                {q.tip}
              </p>
              {q.category && (
                <Badge variant="outline" className="mt-2 rounded-full text-[10px]">
                  {q.category}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={generate}
        className="w-full h-9 rounded-xl text-xs"
      >
        <Loader2 className={`mr-1.5 h-3.5 w-3.5 ${busy ? "animate-spin" : "hidden"}`} />
        Regenerate
      </Button>
    </div>
  );
}
