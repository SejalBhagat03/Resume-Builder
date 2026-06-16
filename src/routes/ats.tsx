import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useResumes, TEMPLATES } from "@/lib/resume-store";

export const Route = createFileRoute("/ats")({
  head: () => ({
    meta: [
      { title: "ATS Analysis — Resume Builder Pro" },
      {
        name: "description",
        content: "See how your resumes score against Applicant Tracking Systems.",
      },
    ],
  }),
  component: AtsPage,
});

function AtsPage() {
  const resumes = useResumes();
  const avg = Math.round(resumes.reduce((s, r) => s + r.atsScore, 0) / Math.max(1, resumes.length));

  return (
    <AppShell>
      <div className="w-full px-4 py-6 md:px-8 md:py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">ATS Analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track how well your resumes pass automated screening.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat icon={TrendingUp} label="Average Score" value={`${avg}%`} tone="brand" />
          <Stat
            icon={CheckCircle2}
            label="Passing (80+)"
            value={resumes.filter((r) => r.atsScore >= 80).length}
            tone="success"
          />
          <Stat
            icon={AlertCircle}
            label="Need Work (<70)"
            value={resumes.filter((r) => r.atsScore < 70).length}
            tone="warning"
          />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card shadow-soft">
          <div className="border-b border-border p-5">
            <h2 className="text-lg font-bold">Per-resume scores</h2>
          </div>
          <ul className="divide-y divide-border">
            {resumes.map((r) => (
              <li key={r.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{r.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {TEMPLATES.find((t) => t.id === r.template)?.name}
                  </div>
                </div>
                <div className="w-48">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${r.atsScore}%`,
                        background:
                          r.atsScore >= 80
                            ? "var(--success)"
                            : r.atsScore >= 70
                              ? "var(--warning)"
                              : "var(--destructive)",
                      }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-bold">{r.atsScore}%</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  tone: "brand" | "success" | "warning";
}) {
  const bg =
    tone === "success"
      ? "bg-[oklch(0.95_0.04_150)] text-[oklch(0.4_0.13_150)]"
      : tone === "warning"
        ? "bg-[oklch(0.95_0.04_70)] text-[oklch(0.45_0.13_70)]"
        : "bg-brand-soft text-brand";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className={`grid h-11 w-11 place-items-center rounded-2xl ${bg}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-3xl font-extrabold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
