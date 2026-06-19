import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./section";
import { Field } from "./field";
import type { Resume } from "@/lib/resume-store";

interface EducationStepProps {
  data: Resume["data"];
  update: (p: Partial<Resume["data"]>) => void;
}

export function EducationStep({ data, update }: EducationStepProps) {
  const set = (i: number, patch: Partial<Resume["data"]["education"][number]>) => {
    const next = [...data.education];
    next[i] = { ...next[i], ...patch };
    update({ education: next });
  };

  return (
    <Section title="Education" sub="List degrees from most recent.">
      {data.education.map((ed, i) => (
        <div key={i} className="rounded-2xl border border-border p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Degree" value={ed.degree} onChange={(v) => set(i, { degree: v })} />
            <Field label="Institution" value={ed.school} onChange={(v) => set(i, { school: v })} />
            <Field label="Period" value={ed.year} onChange={(v) => set(i, { year: v })} />
            <Field
              label="CGPA / Grade"
              value={ed.cgpa ?? ""}
              onChange={(v) => set(i, { cgpa: v })}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => update({ education: data.education.filter((_, x) => x !== i) })}
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
            education: [...data.education, { degree: "", school: "", year: "", cgpa: "" }],
          })
        }
        className="rounded-xl"
      >
        <Plus className="mr-1.5 h-4 w-4" /> Add education
      </Button>
    </Section>
  );
}
