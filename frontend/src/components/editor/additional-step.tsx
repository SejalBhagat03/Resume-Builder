import * as React from "react";
import { Plus, Trash2, Award, Trophy, Languages, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "./section";
import type { Resume } from "@/lib/resume-store";

interface AdditionalStepProps {
  data: Resume["data"];
  update: (p: Partial<Resume["data"]>) => void;
}

export function AdditionalStep({ data, update }: AdditionalStepProps) {
  const handleUpdateArray = (
    key: "certifications" | "achievements" | "languages" | "publications" | "volunteer",
    index: number,
    value: string,
  ) => {
    const arr = [...(data[key] || [])];
    arr[index] = value;
    update({ [key]: arr });
  };

  const handleAddArrayItem = (
    key: "certifications" | "achievements" | "languages" | "publications" | "volunteer",
  ) => {
    const arr = [...(data[key] || [])];
    arr.push("");
    update({ [key]: arr });
  };

  const handleRemoveArrayItem = (
    key: "certifications" | "achievements" | "languages" | "publications" | "volunteer",
    index: number,
  ) => {
    const arr = [...(data[key] || [])];
    arr.splice(index, 1);
    update({ [key]: arr });
  };

  return (
    <Section
      title="Additional Information"
      sub="Add languages, certifications, publications, volunteer work, or awards."
    >
      {/* Certifications */}
      <div className="space-y-3 rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Award className="h-4 w-4 text-brand" /> Certifications & Licenses
          </h4>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddArrayItem("certifications")}
            className="h-8 rounded-lg text-xs font-bold"
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
        </div>
        {(data.certifications || []).length === 0 ? (
          <p className="text-xs text-muted-foreground py-2 italic">No certifications added yet.</p>
        ) : (
          <div className="space-y-2 pt-1">
            {(data.certifications || []).map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={c}
                  onChange={(e) => handleUpdateArray("certifications", i, e.target.value)}
                  className="rounded-xl border flex-1"
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveArrayItem("certifications", i)}
                  className="text-muted-foreground hover:text-destructive h-9 w-9 rounded-xl shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="space-y-3 rounded-2xl border border-border p-5 mt-4">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-brand" /> Awards & Achievements
          </h4>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddArrayItem("achievements")}
            className="h-8 rounded-lg text-xs font-bold"
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
        </div>
        {(data.achievements || []).length === 0 ? (
          <p className="text-xs text-muted-foreground py-2 italic">
            No awards or achievements added yet.
          </p>
        ) : (
          <div className="space-y-2 pt-1">
            {(data.achievements || []).map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={a}
                  onChange={(e) => handleUpdateArray("achievements", i, e.target.value)}
                  className="rounded-xl border flex-1"
                  placeholder="e.g. Dean's List 2025"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveArrayItem("achievements", i)}
                  className="text-muted-foreground hover:text-destructive h-9 w-9 rounded-xl shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="space-y-3 rounded-2xl border border-border p-5 mt-4">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Languages className="h-4 w-4 text-brand" /> Languages
          </h4>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddArrayItem("languages")}
            className="h-8 rounded-lg text-xs font-bold"
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
        </div>
        {(data.languages || []).length === 0 ? (
          <p className="text-xs text-muted-foreground py-2 italic">No languages added yet.</p>
        ) : (
          <div className="space-y-2 pt-1">
            {(data.languages || []).map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={l}
                  onChange={(e) => handleUpdateArray("languages", i, e.target.value)}
                  className="rounded-xl border flex-1"
                  placeholder="e.g. English (Native)"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveArrayItem("languages", i)}
                  className="text-muted-foreground hover:text-destructive h-9 w-9 rounded-xl shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publications */}
      <div className="space-y-3 rounded-2xl border border-border p-5 mt-4">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-brand" /> Publications & Patents
          </h4>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddArrayItem("publications")}
            className="h-8 rounded-lg text-xs font-bold"
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
        </div>
        {(data.publications || []).length === 0 ? (
          <p className="text-xs text-muted-foreground py-2 italic">No publications added yet.</p>
        ) : (
          <div className="space-y-2 pt-1">
            {(data.publications || []).map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={p}
                  onChange={(e) => handleUpdateArray("publications", i, e.target.value)}
                  className="rounded-xl border flex-1"
                  placeholder="e.g. A Survey on Large Language Models, IEEE 2025"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveArrayItem("publications", i)}
                  className="text-muted-foreground hover:text-destructive h-9 w-9 rounded-xl shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Volunteer */}
      <div className="space-y-3 rounded-2xl border border-border p-5 mt-4">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-brand" /> Volunteer & Leadership
          </h4>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddArrayItem("volunteer")}
            className="h-8 rounded-lg text-xs font-bold"
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
        </div>
        {(data.volunteer || []).length === 0 ? (
          <p className="text-xs text-muted-foreground py-2 italic">
            No volunteer or leadership entries added yet.
          </p>
        ) : (
          <div className="space-y-2 pt-1">
            {(data.volunteer || []).map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={v}
                  onChange={(e) => handleUpdateArray("volunteer", i, e.target.value)}
                  className="rounded-xl border flex-1"
                  placeholder="e.g. Volunteer Web Developer at Red Cross"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveArrayItem("volunteer", i)}
                  className="text-muted-foreground hover:text-destructive h-9 w-9 rounded-xl shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
