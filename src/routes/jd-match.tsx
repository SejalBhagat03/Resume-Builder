import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { matchJobDescription } from "@/lib/ai.functions";
import { useResumes } from "@/lib/resume-store";
import { toast } from "sonner";

export const Route = createFileRoute("/jd-match")({
  head: () => ({
    meta: [
      { title: "JD Match — Resume Builder Pro" },
      { name: "description", content: "Match your resume against a job description with AI." },
    ],
  }),
  component: JDMatchPage,
});

function JDMatchPage() {
  const resumes = useResumes();
  const r = resumes[0];
  const [jd, setJd] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<Awaited<
    ReturnType<typeof matchJobDescription>
  > | null>(null);
  const run = useServerFn(matchJobDescription);

  const resumeText = React.useMemo(() => {
    if (!r) return "";
    const d = r.data;
    return [
      `${d.fullName} — ${d.email} ${d.phone} ${d.location}`,
      `Summary: ${d.summary}`,
      "Experience:",
      ...d.experience.flatMap((x) => [
        `- ${x.role} @ ${x.company} (${x.period})`,
        ...x.bullets.map((b) => `  • ${b}`),
      ]),
      "Projects:",
      ...d.projects.flatMap((p) => [
        `- ${p.name} (${p.tools})`,
        ...p.bullets.map((b) => `  • ${b}`),
      ]),
      "Education: " + d.education.map((e) => `${e.degree}, ${e.school} (${e.year})`).join("; "),
      "Skills: " + d.skills.map((s) => `${s.category}: ${s.items}`).join(" | "),
    ].join("\n");
  }, [r]);

  async function go() {
    if (jd.trim().length < 20) {
      toast.error("Paste a longer job description");
      return;
    }
    if (!resumeText) {
      toast.error("Create a resume first");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const res = await run({ data: { jobDescription: jd, resumeText } });
      setResult(res);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="w-full px-4 py-6 md:px-8 md:py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Job Description Match</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste a job description and we'll score your resume, surface missing keywords, and suggest
          rewrites.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <label className="text-sm font-semibold">Job description</label>
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={14}
              placeholder="Paste the JD here…"
              className="mt-2 rounded-xl"
            />
            <Button
              onClick={go}
              disabled={busy}
              className="mt-3 h-11 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Analyze match
                </>
              )}
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 min-h-[420px]">
            {!result && !busy && (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                Results appear here.
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-brand bg-brand-soft">
                    <div className="text-2xl font-extrabold text-brand">{result.score}%</div>
                  </div>
                  <div>
                    <div className="font-bold">Match score</div>
                    <div className="text-xs text-muted-foreground">
                      Higher = better keyword + skill overlap
                    </div>
                  </div>
                </div>
                <Block title="Matched keywords" items={result.matchedKeywords} tone="success" />
                <Block title="Missing keywords" items={result.missingKeywords} tone="warn" />
                <Block title="Missing skills" items={result.missingSkills} tone="warn" />
                {result.suggestions.length > 0 && (
                  <div>
                    <div className="text-sm font-bold mb-1.5">Suggestions</div>
                    <ul className="space-y-1.5">
                      {result.suggestions.map((s: string, i: number) => (
                        <li key={i} className="text-sm text-foreground/90">
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Block({
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
      <div className="text-sm font-bold mb-1.5">{title}</div>
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
