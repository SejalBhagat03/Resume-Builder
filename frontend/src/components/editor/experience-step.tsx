import * as React from "react";
import { Plus, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "./section";
import { Field } from "./field";
import { rewriteBullet } from "@/lib/ai.functions";
import type { Resume } from "@/lib/resume-store";
import { toast } from "sonner";

interface ExperienceStepProps {
  data: Resume["data"];
  update: (p: Partial<Resume["data"]>) => void;
}

export function ExperienceStep({ data, update }: ExperienceStepProps) {
  const set = (i: number, patch: Partial<Resume["data"]["experience"][number]>) => {
    const next = [...data.experience];
    next[i] = { ...next[i], ...patch };
    update({ experience: next });
  };

  const [rewritingIdx, setRewritingIdx] = React.useState<number | null>(null);

  const handleRewriteBullets = async (i: number) => {
    const ex = data.experience[i];
    if (!ex.bullets.some(Boolean)) {
      toast.error("Add at least one bullet point first.");
      return;
    }
    setRewritingIdx(i);
    try {
      const rewritten = await Promise.all(
        ex.bullets
          .filter(Boolean)
          .map((b) => rewriteBullet({ data: { bullet: b, role: ex.role } }).then((r) => r.bullet)),
      );
      set(i, { bullets: rewritten });
      toast.success("Bullets rewritten with AI ✨");
    } catch {
      toast.error("AI unavailable — check your API key.");
    } finally {
      setRewritingIdx(null);
    }
  };

  return (
    <Section title="Experience" sub="Internships and jobs. Quantify outcomes when possible.">
      {data.experience.map((ex, i) => (
        <div key={i} className="rounded-2xl border border-border p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Role" value={ex.role} onChange={(v) => set(i, { role: v })} />
            <Field label="Company" value={ex.company} onChange={(v) => set(i, { company: v })} />
            <Field label="Period" value={ex.period} onChange={(v) => set(i, { period: v })} />
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <Label>Bullet points (one per line)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRewriteBullets(i)}
                disabled={rewritingIdx === i}
                className="h-7 gap-1.5 rounded-lg text-xs text-brand hover:bg-brand-soft"
              >
                {rewritingIdx === i ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                AI Rewrite
              </Button>
            </div>
            <Textarea
              value={ex.bullets.join("\n")}
              onChange={(e) => set(i, { bullets: e.target.value.split("\n") })}
              rows={4}
              className="mt-1.5 rounded-xl"
              placeholder="• Shipped a feature used by 10k+ users."
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => update({ experience: data.experience.filter((_, x) => x !== i) })}
            className="mt-2 text-destructive"
          >
            <Trash2 className="mr-1.5 h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          update({
            experience: [...data.experience, { role: "", company: "", period: "", bullets: [""] }],
          })
        }
        className="rounded-xl"
      >
        <Plus className="mr-1.5 h-4 w-4" /> Add experience
      </Button>
    </Section>
  );
}
