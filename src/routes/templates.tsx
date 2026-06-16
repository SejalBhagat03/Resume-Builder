import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ResumeThumb } from "@/components/resume-thumb";
import { TEMPLATES, useResumes } from "@/lib/resume-store";
import { CreateResumeWizard } from "@/components/create-resume-wizard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Resume Builder Pro" },
      {
        name: "description",
        content: "Pick from professionally designed, ATS-friendly resume templates.",
      },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const resumes = useResumes();
  const navigate = useNavigate();
  const [wizard, setWizard] = React.useState(false);
  const [preselectedTemplate, setPreselectedTemplate] = React.useState<string | undefined>();

  // Find the most recently edited resume for each template
  function resumeForTemplate(templateId: string) {
    return resumes
      .filter((r) => r.template === templateId)
      .sort((a, b) => b.updatedAt - a.updatedAt)[0];
  }

  function handleTemplateClick(templateId: string) {
    const existing = resumeForTemplate(templateId);
    if (existing) {
      navigate({ to: "/editor/$id", params: { id: existing.id } });
    } else {
      setPreselectedTemplate(templateId);
      setWizard(true);
    }
  }

  return (
    <AppShell>
      <div className="w-full px-4 py-6 md:px-8 md:py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a template to start your next resume. Cards with your data are shown if you've used
          that template.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {TEMPLATES.map((t) => {
            const userResume = resumeForTemplate(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTemplateClick(t.id)}
                className={cn(
                  "group relative flex flex-col rounded-2xl border bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md text-left",
                  userResume ? "border-brand/40 ring-1 ring-brand/20" : "border-border",
                )}
              >
                {/* "Your Resume" badge */}
                {userResume && (
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-foreground shadow">
                    Your Resume
                  </span>
                )}

                {/* No resume for this template — show "New" badge */}
                {!userResume && (
                  <span className="absolute right-3 top-3 z-10 rounded-full border border-border bg-card px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                    + New
                  </span>
                )}

                <ResumeThumb resume={userResume} templateId={t.id} />

                <div className="mt-3 text-sm font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.tagline}</div>

                {userResume && (
                  <div className="mt-1 truncate text-[10px] text-brand font-medium">
                    {userResume.title}
                  </div>
                )}
              </button>
            );
          })}

          {/* Create with new template card */}
          <button
            type="button"
            onClick={() => setWizard(true)}
            className="group flex aspect-[3/4.4] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand/40 bg-brand-soft/30 p-4 text-center transition-all hover:border-brand hover:bg-brand-soft/60"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-brand-foreground">
              <Plus className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-brand">Create New</div>
              <div className="mt-1 text-xs text-muted-foreground">Start from any template</div>
            </div>
          </button>
        </div>
      </div>

      <CreateResumeWizard open={wizard} onOpenChange={setWizard} />
    </AppShell>
  );
}
