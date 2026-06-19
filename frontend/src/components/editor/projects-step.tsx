import * as React from "react";
import { Plus, Trash2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "./section";
import { Field } from "./field";
import { GithubImportDialog } from "@/components/github-import-dialog";
import type { Resume } from "@/lib/resume-store";

interface ProjectsStepProps {
  data: Resume["data"];
  update: (p: Partial<Resume["data"]>) => void;
}

export function ProjectsStep({ data, update }: ProjectsStepProps) {
  const set = (i: number, patch: Partial<Resume["data"]["projects"][number]>) => {
    const next = [...data.projects];
    next[i] = { ...next[i], ...patch };
    update({ projects: next });
  };

  const [ghOpen, setGhOpen] = React.useState(false);

  return (
    <Section title="Projects" sub="Highlight 2–4 standout projects.">
      <div className="-mt-2 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setGhOpen(true)}
          className="h-10 rounded-xl"
        >
          <Github className="mr-1.5 h-4 w-4" /> Import from GitHub
        </Button>
        <span className="self-center text-xs text-muted-foreground">
          Pull projects automatically from any public GitHub account.
        </span>
      </div>
      {data.projects.map((p, i) => (
        <div key={i} className="rounded-2xl border border-border p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Project name" value={p.name} onChange={(v) => set(i, { name: v })} />
            <Field label="Tools / stack" value={p.tools} onChange={(v) => set(i, { tools: v })} />
          </div>
          <div className="mt-3">
            <Label>Bullet points (one per line)</Label>
            <Textarea
              value={p.bullets.join("\n")}
              onChange={(e) => set(i, { bullets: e.target.value.split("\n") })}
              rows={3}
              className="mt-1.5 rounded-xl"
              placeholder="• Built and deployed…"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => update({ projects: data.projects.filter((_, x) => x !== i) })}
            className="mt-2 text-destructive"
          >
            <Trash2 className="mr-1.5 h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          update({ projects: [...data.projects, { name: "", tools: "", bullets: [""] }] })
        }
        className="rounded-xl"
      >
        <Plus className="mr-1.5 h-4 w-4" /> Add project
      </Button>
      <GithubImportDialog
        open={ghOpen}
        onOpenChange={setGhOpen}
        onImport={(projects) => {
          const cleaned = data.projects.filter(
            (p) => p.name.trim() || p.tools.trim() || p.bullets.some(Boolean),
          );
          update({ projects: [...cleaned, ...projects] });
        }}
      />
    </Section>
  );
}
