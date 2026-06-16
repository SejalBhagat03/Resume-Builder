import * as React from "react";
import {
  Sparkles,
  Check,
  X,
  Briefcase,
  FileSearch,
  MessageCircleQuestion,
  Wand2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  generateSummary,
  improveBullet,
  suggestSkills,
  tailorForJob,
  interviewQuestions,
  type Suggestion,
} from "@/lib/ai-mock";
import { RoleRecommendations } from "@/components/role-recommendations";
import { ReviewPanel } from "@/components/review-before-export";
import { useProfile } from "@/lib/profile-store";
import type { Resume } from "@/lib/resume-store";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  resume: Resume;
  onApply: (next: Resume) => void;
};

export function AiAssistantPanel({ open, onOpenChange, resume, onApply }: Props) {
  const [profile] = useProfile();
  const [jd, setJd] = React.useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl border-l border-border">
        <SheetHeader>
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold">AI Resume Assistant</SheetTitle>
              <SheetDescription className="text-xs">
                Optional, transparent suggestions. You decide what to keep.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="optimize" className="mt-5">
          <TabsList className="grid w-full grid-cols-4 rounded-xl">
            <TabsTrigger value="optimize" className="rounded-lg text-[10px] md:text-xs">
              <Wand2 className="mr-1 h-3.5 w-3.5" /> Optimize
            </TabsTrigger>
            <TabsTrigger value="match" className="rounded-lg text-[10px] md:text-xs">
              <Briefcase className="mr-1 h-3.5 w-3.5" /> Match JD
            </TabsTrigger>
            <TabsTrigger value="review" className="rounded-lg text-[10px] md:text-xs">
              <FileSearch className="mr-1 h-3.5 w-3.5" /> Review
            </TabsTrigger>
            <TabsTrigger value="interview" className="rounded-lg text-[10px] md:text-xs">
              <MessageCircleQuestion className="mr-1 h-3.5 w-3.5" /> Interview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="optimize" className="mt-4 space-y-3">
            <QuickAction
              label="Generate a fresh summary from your profile"
              cta="Generate"
              onRun={() => {
                onApply({ ...resume, data: { ...resume.data, summary: generateSummary(profile) } });
                toast.success("Summary updated.");
              }}
            />
            <QuickAction
              label="Polish every experience and project bullet"
              cta="Improve bullets"
              onRun={() => {
                onApply({
                  ...resume,
                  data: {
                    ...resume.data,
                    experience: resume.data.experience.map((e) => ({
                      ...e,
                      bullets: e.bullets.map(improveBullet),
                    })),
                    projects: resume.data.projects.map((p) => ({
                      ...p,
                      bullets: p.bullets.map(improveBullet),
                    })),
                  },
                });
                toast.success("Bullets rewritten with stronger action verbs.");
              }}
            />
            <QuickAction
              label="Suggest skills based on your experience"
              cta="Suggest"
              onRun={() => {
                const s = suggestSkills(profile);
                if (s.length === 0) return toast.info("No new skill suggestions right now.");
                toast.success(`Suggested: ${s.join(", ")}`, { duration: 6000 });
              }}
            />
            <div className="pt-2">
              <RoleRecommendations profile={profile} limit={3} />
            </div>
          </TabsContent>

          <TabsContent value="match" className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Paste a job description
              </label>
              <Textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={6}
                placeholder="Paste the JD here. We'll suggest changes — you accept or reject each one."
                className="mt-1.5 rounded-xl bg-card border-border text-sm"
              />
            </div>
            <JdMatchSuggestions
              resume={resume}
              jd={jd}
              onApply={(next) => {
                onApply(next);
                toast.success("Suggestion applied.");
              }}
            />
            {jd.trim().length > 30 && (
              <div className="pt-2">
                <RoleRecommendations profile={profile} jd={jd} limit={3} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="review" className="mt-4">
            <ReviewPanel resume={resume} jd={jd || undefined} />
          </TabsContent>

          <TabsContent value="interview" className="mt-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Practice questions tailored to your resume{jd ? " and the job description" : ""}.
            </p>
            {interviewQuestions(resume, jd || undefined).map((q, i) => (
              <Card key={i} className="rounded-2xl border-border p-4 bg-card">
                <div className="text-sm font-semibold">{q.question}</div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-normal">
                  <span className="font-semibold text-brand">Tip — </span>
                  {q.tip}
                </p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function QuickAction({ label, cta, onRun }: { label: string; cta: string; onRun: () => void }) {
  return (
    <Card className="flex items-center justify-between gap-3 rounded-2xl border-border p-3 bg-card">
      <span className="text-sm">{label}</span>
      <Button
        size="sm"
        onClick={onRun}
        className="h-9 shrink-0 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 font-bold"
      >
        {cta}
      </Button>
    </Card>
  );
}

function JdMatchSuggestions({
  resume,
  jd,
  onApply,
}: {
  resume: Resume;
  jd: string;
  onApply: (next: Resume) => void;
}) {
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());
  const suggestions = React.useMemo<Suggestion[]>(() => {
    if (jd.trim().length < 30) return [];
    return tailorForJob(resume, jd);
  }, [resume, jd]);
  const visible = suggestions.filter((s) => !dismissed.has(s.id));

  if (jd.trim().length < 30) {
    return (
      <Card className="rounded-2xl border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
        Paste at least a short paragraph of the JD to see tailored suggestions.
      </Card>
    );
  }
  if (visible.length === 0) {
    return (
      <Card className="rounded-2xl border-border p-4 text-center text-xs text-muted-foreground">
        No further changes recommended — your resume already looks aligned. ✓
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Suggestions ({visible.length})
        </div>
        <Badge variant="outline" className="rounded-full text-[10px]">
          Optional
        </Badge>
      </div>
      {visible.map((s) => (
        <Card key={s.id} className="rounded-2xl border-border p-4 bg-card">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <div className="min-w-0">
              <div className="text-sm font-semibold">{s.title}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Why — </span>
                {s.reason}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                onApply(s.apply(resume));
                setDismissed((d) => new Set(d).add(s.id));
              }}
              className="h-9 flex-1 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 font-bold"
            >
              <Check className="mr-1 h-3.5 w-3.5" /> Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDismissed((d) => new Set(d).add(s.id))}
              className="h-9 flex-1 rounded-lg"
            >
              <X className="mr-1 h-3.5 w-3.5" /> Reject
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
