import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Search, Download, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeThumb } from "@/components/resume-thumb";
import { CreateResumeWizard } from "@/components/create-resume-wizard";
import { useResumes, TEMPLATES, deleteResume, type Resume } from "@/lib/resume-store";
import { RelativeTime } from "@/components/relative-time";

export const Route = createFileRoute("/resumes")({
  head: () => ({
    meta: [
      { title: "My Resumes — Resume Builder Pro" },
      { name: "description", content: "Browse, edit, download and manage all of your resumes." },
    ],
  }),
  component: ResumesPage,
});

function ResumesPage() {
  const resumes = useResumes();
  const [q, setQ] = React.useState("");
  const [wizard, setWizard] = React.useState(false);
  const navigate = useNavigate();
  const filtered = resumes.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell>
      <div className="w-full px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Resumes</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {resumes.length} resume{resumes.length === 1 ? "" : "s"} total
            </p>
          </div>
          <Button
            onClick={() => setWizard(true)}
            className="h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Create New
          </Button>
        </div>

        <div className="relative mt-5 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by resume title..."
            className="h-11 rounded-xl bg-card pl-9"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((r) => (
            <ResumeCard
              key={r.id}
              resume={r}
              onOpen={() => navigate({ to: "/editor/$id", params: { id: r.id } })}
              onDelete={() => deleteResume(r.id)}
            />
          ))}
        </div>
      </div>
      <CreateResumeWizard open={wizard} onOpenChange={setWizard} />
    </AppShell>
  );
}

function ResumeCard({
  resume,
  onOpen,
  onDelete,
}: {
  resume: Resume;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const templateName = TEMPLATES.find((t) => t.id === resume.template)?.name ?? resume.template;

  return (
    <div
      className="group flex flex-col rounded-2xl border border-border bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      onClick={onOpen}
    >
      {/* Clickable thumbnail */}
      <div className="pointer-events-none">
        <ResumeThumb resume={resume} />
      </div>

      <h3 className="mt-3 truncate text-sm font-bold">{resume.title}</h3>
      <div className="mt-1 inline-block w-fit rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
        {templateName}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Updated <RelativeTime ts={resume.updatedAt} />
      </div>

      <div className="mt-3 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
        <Button
          onClick={onOpen}
          size="sm"
          variant="outline"
          className="h-8 flex-1 rounded-lg text-xs"
        >
          Edit
        </Button>
        <Button size="sm" className="h-8 flex-1 rounded-lg bg-foreground text-background text-xs">
          <Download className="mr-1 h-3 w-3" /> PDF
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-lg"
          onClick={() => onDelete()}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
