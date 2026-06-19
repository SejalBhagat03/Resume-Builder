import * as React from "react";
import { Plus, Trash2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./section";
import { Field } from "./field";
import { suggestSkills } from "@/lib/ai.functions";
import type { Resume } from "@/lib/resume-store";
import { toast } from "sonner";

interface SkillsStepProps {
  data: Resume["data"];
  update: (p: Partial<Resume["data"]>) => void;
}

export function SkillsStep({ data, update }: SkillsStepProps) {
  const set = (i: number, patch: Partial<Resume["data"]["skills"][number]>) => {
    const next = [...data.skills];
    next[i] = { ...next[i], ...patch };
    update({ skills: next });
  };

  const [aiSkillsBusy, setAiSkillsBusy] = React.useState(false);

  const handleAiSkills = async () => {
    const role = data.experience[0]?.role;
    if (!role) {
      toast.error("Add at least one experience role first.");
      return;
    }
    setAiSkillsBusy(true);
    try {
      const current = data.skills.map((s) => s.items).join(", ");
      const result = await suggestSkills({ data: { role, currentSkills: current } });
      update({
        skills: [...data.skills, { category: "Suggested Skills", items: result.skills.join(", ") }],
      });
      toast.success("AI skill suggestions added!");
    } catch {
      toast.error("AI unavailable — check your API key.");
    } finally {
      setAiSkillsBusy(false);
    }
  };

  return (
    <Section title="Skills" sub="Group skills by category. Comma-separated.">
      {data.skills.map((s, i) => (
        <div key={i} className="rounded-2xl border border-border p-4">
          <div className="grid gap-3 sm:grid-cols-[200px_minmax(0,1fr)]">
            <Field label="Category" value={s.category} onChange={(v) => set(i, { category: v })} />
            <Field label="Items" value={s.items} onChange={(v) => set(i, { items: v })} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => update({ skills: data.skills.filter((_, x) => x !== i) })}
            className="mt-2 text-destructive"
          >
            <Trash2 className="mr-1.5 h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => update({ skills: [...data.skills, { category: "", items: "" }] })}
          className="rounded-xl"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add category
        </Button>
        <Button
          variant="outline"
          onClick={handleAiSkills}
          disabled={aiSkillsBusy}
          className="rounded-xl border-brand/40 text-brand hover:bg-brand-soft"
        >
          {aiSkillsBusy ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-1.5 h-4 w-4" />
          )}
          AI Suggest Skills
        </Button>
      </div>
    </Section>
  );
}
