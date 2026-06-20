import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Plus,
  Upload,
  FileText,
  Download,
  TrendingUp,
  LayoutTemplate,
  Zap,
  MoreVertical,
  Sparkles,
  ChevronRight,
  User,
  Rocket,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { CreateResumeWizard } from "@/components/create-resume-wizard";
import { ResumeThumb } from "@/components/resume-thumb";
import { useResumes, TEMPLATES } from "@/lib/resume-store";
import { RelativeTime } from "@/components/relative-time";
import { useProfile, profileCompleteness } from "@/lib/profile-store";
import { RoleRecommendations } from "@/components/role-recommendations";
import { OnboardingTour } from "@/components/onboarding-tour";

type DashboardSearch = {
  create?: boolean;
  tour?: boolean;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => {
    return {
      create: search.create === true || search.create === "true" || undefined,
      tour: search.tour === true || search.tour === "true" || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Dashboard — Resume Builder Pro" },
      {
        name: "description",
        content:
          "Your resume dashboard: continue editing, track ATS score, and create new resumes.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { create, tour } = Route.useSearch();
  const [forceStartTour, setForceStartTour] = React.useState(false);
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [wizardConfig, setWizardConfig] = React.useState<{
    defaultStep?: number;
    defaultSource?: string;
  }>({});
  const resumes = useResumes();
  const navigate = useNavigate();
  const recent = resumes[0];
  const [profile] = useProfile();
  const completeness = profileCompleteness(profile);

  const openWizard = React.useCallback((config: typeof wizardConfig = {}) => {
    setWizardConfig(config);
    setWizardOpen(true);
  }, []);

  React.useEffect(() => {
    if (create) {
      openWizard({ defaultStep: 3, defaultSource: "profile" });
      navigate({
        to: "/",
        search: {},
        replace: true,
      });
    }
  }, [create, navigate, openWizard]);

  React.useEffect(() => {
    if (tour) {
      setForceStartTour(true);
      navigate({
        to: "/",
        search: {},
        replace: true,
      });
    }
  }, [tour, navigate]);

  const stats = [
    { icon: FileText, label: "Total Resumes", value: resumes.length, sub: "Resumes created" },
    {
      icon: Download,
      label: "Total Downloads",
      value: resumes.reduce((s, r) => s + r.downloads, 0),
      sub: "PDF downloads",
    },
    {
      icon: TrendingUp,
      label: "Average ATS Score",
      value: `${Math.round(resumes.reduce((s, r) => s + r.atsScore, 0) / Math.max(1, resumes.length))}%`,
      sub: "Across all resumes",
    },
    {
      icon: LayoutTemplate,
      label: "Templates Used",
      value: new Set(resumes.map((r) => r.template)).size,
      sub: "Different templates",
    },
  ];

  return (
    <AppShell>
      <div className="w-full px-4 py-6 md:px-8 md:py-8">
        {/* HERO */}
        <section className="hero-gradient relative overflow-hidden rounded-3xl border border-border p-6 md:p-10">
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-semibold text-brand">
              Welcome back{profile.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}! 👋
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl">
              Build Professional,
              <br className="hidden sm:block" /> ATS-Friendly Resumes
            </h1>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground md:text-base">
              Create, customize and export resumes that get you hired — guided, step by step.
            </p>
            <div id="tour-hero-actions" className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => openWizard()}
                className="h-12 rounded-xl bg-brand px-5 text-brand-foreground hover:bg-brand/90"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Create New Resume
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-12 rounded-xl border-brand/30 bg-card px-5 text-foreground hover:bg-brand-soft/50"
              >
                <Link to="/import">
                  <Upload className="mr-1.5 h-4 w-4" /> Import Resume
                </Link>
              </Button>
            </div>
          </div>
          <HeroResumeArt />
        </section>

        {/* Profile completeness nudge */}
        {completeness < 80 && (
          <section id="tour-profile" className="mt-6">
            <Link
              to="/profile"
              className="group flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-brand/40 md:p-5"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-bold">
                    Your profile is {completeness}% complete
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A complete profile means stronger resumes and better AI suggestions.
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-brand">
                Continue <ChevronRight className="ml-0.5 inline h-4 w-4" />
              </span>
            </Link>
          </section>
        )}

        {/* KPIs */}
        <section
          id="tour-stats"
          className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-4 shadow-soft md:p-5 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="grid h-8 w-8 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl sm:rounded-2xl bg-brand-soft text-brand">
                  <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight sm:leading-normal">
                    {s.label}
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold leading-tight text-foreground">
                    {s.value}
                  </div>
                </div>
              </div>
              <div className="mt-2 hidden sm:block text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </section>

        {/* Continue editing */}
        {recent && (
          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Continue Editing</h2>
              <Link to="/resumes" className="text-sm font-semibold text-brand hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border-l-4 border-brand bg-card p-4 shadow-soft md:p-5">
              <div className="w-16 shrink-0 md:w-20">
                <ResumeThumb resume={recent} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base font-bold">{recent.title}</h3>
                  <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">
                    {TEMPLATES.find((t) => t.id === recent.template)?.name ?? recent.template}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Last edited <RelativeTime ts={recent.updatedAt} />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  onClick={() => navigate({ to: "/editor/$id", params: { id: recent.id } })}
                  className="h-10 w-10 sm:h-10 sm:w-auto rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 p-0 sm:px-4"
                  title="Continue Editing"
                >
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1.5">Continue Editing</span>
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* AI Copilot */}
        <section id="tour-copilot" className="mt-6">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-[oklch(0.96_0.04_150)] p-4 md:p-5">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[oklch(0.85_0.08_150)] text-[oklch(0.35_0.1_150)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-bold">AI Career Copilot</h3>
                <span className="rounded-full bg-[oklch(0.85_0.15_300)] px-2 py-0.5 text-[10px] font-bold uppercase text-[oklch(0.3_0.15_300)]">
                  New
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">
                Get AI-powered suggestions to improve your resume and increase interview calls.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-10 w-10 sm:h-10 sm:w-auto shrink-0 rounded-xl border-[oklch(0.65_0.1_150)] text-[oklch(0.35_0.1_150)] hover:bg-[oklch(0.92_0.05_150)] p-0 sm:px-4"
              title="Match Job Description"
            >
              <Link to="/jd-match" className="flex items-center justify-center">
                <span className="hidden sm:inline mr-1">Match a JD</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Role recommendations (signature feature) */}
        {completeness >= 40 && (
          <section className="mt-8">
            <RoleRecommendations profile={profile} limit={4} />
          </section>
        )}

        {/* My Resumes */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">My Resumes</h2>
            {resumes.length > 0 && (
              <Link to="/resumes" className="text-sm font-semibold text-brand hover:underline">
                View All
              </Link>
            )}
          </div>

          {resumes.length === 0 ? (
            <EmptyResumesState onCreateClick={() => openWizard()} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {resumes.slice(0, 4).map((r) => (
                <ResumeCard
                  key={r.id}
                  resume={r}
                  onOpen={() => navigate({ to: "/editor/$id", params: { id: r.id } })}
                />
              ))}
              <button
                onClick={() => openWizard()}
                className="group flex aspect-[3/4.4] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand/40 bg-brand-soft/30 p-4 text-center transition-all hover:border-brand hover:bg-brand-soft/60"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-brand-foreground">
                  <Plus className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-brand">Create New Resume</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Start from scratch or choose a template
                  </div>
                </div>
              </button>
            </div>
          )}
        </section>

        {/* Subtle AI Assistant hint */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold">AI suggestions live inside the editor</div>
                <p className="text-xs text-muted-foreground">
                  Open any resume and tap the ✨ AI Assistant button — optional, transparent, and
                  yours to accept.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => openWizard()}
        className="fixed bottom-20 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-brand/30 transition-transform hover:scale-105 md:hidden"
        aria-label="Create resume"
      >
        <Plus className="h-6 w-6" />
      </button>

      <CreateResumeWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        defaultSource={wizardConfig.defaultSource}
        defaultStep={wizardConfig.defaultStep}
      />
      <OnboardingTour
        forceStart={forceStartTour}
        onTourStarted={() => setForceStartTour(false)}
        isWizardOpen={wizardOpen}
      />
    </AppShell>
  );
}

function ResumeCard({
  resume,
  onOpen,
}: {
  resume: ReturnType<typeof useResumes>[number];
  onOpen: () => void;
}) {
  return (
    <div
      className="group flex flex-col rounded-2xl border border-border bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      onClick={onOpen}
    >
      <div className="pointer-events-none">
        <ResumeThumb resume={resume} />
      </div>
      <div className="mt-3 min-w-0">
        <h3 className="truncate text-sm font-bold">{resume.title}</h3>
        <div className="mt-1 inline-block rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
          {TEMPLATES.find((t) => t.id === resume.template)?.name ?? resume.template}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Updated <RelativeTime ts={resume.updatedAt} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <Button
          onClick={onOpen}
          size="sm"
          variant="outline"
          className="h-8 flex-1 rounded-lg text-xs"
        >
          Edit
        </Button>
        <Button
          size="sm"
          className="h-8 flex-1 rounded-lg bg-foreground text-background text-xs hover:bg-foreground/90"
        >
          <Download className="mr-1 h-3 w-3" /> PDF
        </Button>
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg">
          <MoreVertical className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function EmptyResumesState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand/20 bg-linear-to-b from-brand-soft/10 to-transparent px-6 py-14 text-center">
      <div className="relative">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-soft text-brand shadow-soft">
          <FileText className="h-10 w-10" />
        </div>
        <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-brand text-brand-foreground shadow">
          <Rocket className="h-3.5 w-3.5" />
        </span>
      </div>
      <h3 className="mt-5 text-xl font-extrabold tracking-tight">No resumes yet</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Create your first resume in minutes — start from scratch, choose a template, or import an
        existing file.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          onClick={onCreateClick}
          className="h-11 rounded-xl bg-brand px-6 text-brand-foreground hover:bg-brand/90"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Create New Resume
        </Button>
        <Button variant="outline" asChild className="h-11 rounded-xl px-6">
          <Link to="/templates">
            <LayoutTemplate className="mr-1.5 h-4 w-4" /> Browse Templates
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-11 rounded-xl px-6">
          <Link to="/import">
            <Upload className="mr-1.5 h-4 w-4" /> Import Resume
          </Link>
        </Button>
      </div>
    </div>
  );
}

function HeroResumeArt() {
  return (
    <div className="pointer-events-none absolute -right-6 -top-2 hidden h-[110%] w-[42%] md:block">
      <div className="relative h-full">
        <div className="absolute right-12 top-6 h-[88%] w-56 rotate-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="mx-auto h-10 w-10 rounded-full bg-brand-soft" />
          <div className="mx-auto mt-2 h-1.5 w-2/3 rounded bg-muted-foreground/25" />
          <div className="mx-auto mt-1.5 h-1 w-1/3 rounded bg-muted-foreground/20" />
          <div className="mt-4 space-y-1.5">
            {[90, 70, 80, 65, 85, 55].map((w, i) => (
              <div
                key={i}
                className="h-1 rounded bg-muted-foreground/20"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-2 bottom-6 grid h-20 w-20 place-items-center rounded-full border-4 border-[oklch(0.62_0.13_150)] bg-card text-center">
          <div>
            <div className="text-base font-extrabold text-[oklch(0.45_0.13_150)]">95</div>
            <div className="text-[9px] font-semibold uppercase text-muted-foreground">ATS</div>
          </div>
        </div>
        <svg
          className="absolute right-4 top-2 h-6 w-6 text-brand"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l1.6 5 5 1.6-5 1.6L12 15l-1.6-4.8L5.4 8.6l5-1.6L12 2z" />
        </svg>
        <svg
          className="absolute right-32 bottom-12 h-4 w-4 text-brand/60"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l1.6 5 5 1.6-5 1.6L12 15l-1.6-4.8L5.4 8.6l5-1.6L12 2z" />
        </svg>
      </div>
    </div>
  );
}
