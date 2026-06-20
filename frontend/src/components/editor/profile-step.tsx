import * as React from "react";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "./section";
import { Field } from "./field";
import { generateSummary } from "@/lib/ai.functions";
import type { Resume } from "@/lib/resume-store";
import { toast } from "sonner";

interface ProfileStepProps {
  data: Resume["data"];
  update: (p: Partial<Resume["data"]>) => void;
}

export function ProfileStep({ data, update }: ProfileStepProps) {
  const [aiSummaryBusy, setAiSummaryBusy] = React.useState(false);

  const handleAiSummary = async () => {
    if (!data.experience[0]?.role && !data.fullName) {
      toast.error("Fill in your name and at least one experience role first.");
      return;
    }
    setAiSummaryBusy(true);
    try {
      const result = await generateSummary({
        data: {
          role: data.experience[0]?.role ?? "Professional",
          seniority: "mid",
          skills: data.skills.map((s) => s.items).join(", "),
        },
      });
      update({ summary: result.summary });
      toast.success("AI summary generated!");
    } catch {
      toast.error("AI unavailable — check your API key.");
    } finally {
      setAiSummaryBusy(false);
    }
  };

  const linkedinHelper =
    !data.linkedin && data.fullName ? (
      <a
        href={`https://www.google.com/search?q=site:linkedin.com/in/+%22${encodeURIComponent(data.fullName.trim())}%22`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-brand hover:underline font-semibold inline-flex items-center gap-1 bg-brand-soft/40 px-2 py-0.5 rounded-md mt-1"
        title="Google search your name on LinkedIn to easily copy your profile link"
      >
        🔍 Find my LinkedIn URL
      </a>
    ) : null;

  return (
    <Section title="Profile" sub="Basic contact information that appears at the top.">
      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <Field label="Full name" value={data.fullName} onChange={(v) => update({ fullName: v })} />
        <Field label="Email" value={data.email} onChange={(v) => update({ email: v })} />
        <Field label="Phone" value={data.phone} onChange={(v) => update({ phone: v })} />
        <Field label="Location" value={data.location} onChange={(v) => update({ location: v })} />
        <Field
          label="Website / Portfolio"
          value={data.website ?? ""}
          onChange={(v) => update({ website: v })}
          placeholder="e.g. sejalbhagat.me"
          onBlur={() => {
            const val = (data.website ?? "").trim();
            if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
              update({ website: `https://${val}` });
            }
          }}
        />
        <Field
          label="LinkedIn URL"
          value={data.linkedin ?? ""}
          onChange={(v) => update({ linkedin: v })}
          placeholder="Username or full URL"
          helper={linkedinHelper}
          onBlur={() => {
            const val = (data.linkedin ?? "").trim();
            if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
              if (val.includes("linkedin.com")) {
                update({ linkedin: `https://${val}` });
              } else {
                update({ linkedin: `https://linkedin.com/in/${val}` });
              }
            }
          }}
        />
        <Field
          label="GitHub URL"
          value={data.github ?? ""}
          onChange={(v) => update({ github: v })}
          placeholder="Username or full URL"
          onBlur={() => {
            const val = (data.github ?? "").trim();
            if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
              if (val.includes("github.com")) {
                update({ github: `https://${val}` });
              } else {
                update({ github: `https://github.com/${val}` });
              }
            }
          }}
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label>Professional summary</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAiSummary}
            disabled={aiSummaryBusy}
            className="h-7 gap-1.5 rounded-lg text-xs text-brand hover:bg-brand-soft"
          >
            {aiSummaryBusy ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Wand2 className="h-3 w-3" />
            )}
            AI Generate
          </Button>
        </div>
        <Textarea
          value={data.summary}
          onChange={(e) => update({ summary: e.target.value })}
          rows={4}
          className="mt-1.5 rounded-xl"
          placeholder="A short professional summary highlighting your strengths…"
        />
      </div>
    </Section>
  );
}
