import * as React from "react";
import { CheckCircle2, AlertTriangle, Lightbulb, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { reviewResume, interviewQuestions, type ReviewItem } from "@/lib/ai-mock";
import type { Resume } from "@/lib/resume-store";
import { toast } from "sonner";

export function ReviewPanel({ resume, jd }: { resume: Resume; jd?: string }) {
  const report = React.useMemo(() => reviewResume(resume, jd), [resume, jd]);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="ATS" value={`${report.atsScore}%`} pct={report.atsScore} />
        <Metric label="Readability" value={`${report.readability}%`} pct={report.readability} />
        <Metric
          label="Keyword coverage"
          value={`${report.keywordCoverage}%`}
          pct={report.keywordCoverage}
        />
        <Metric label="Estimated pages" value={`${report.estPages}`} />
      </div>
      <Card className="rounded-2xl border-border p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Insights
        </div>
        <ul className="mt-3 space-y-2.5">
          {report.items.map((item, i) => (
            <li key={i}>
              <ReviewLine item={item} />
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-xl bg-brand-soft/40 px-3 py-2 text-xs">
          <span className="font-semibold text-brand">Strongest section: </span>
          {report.strongest}
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value, pct }: { label: string; value: string; pct?: number }) {
  return (
    <Card className="rounded-2xl border-border p-3">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-extrabold leading-none">{value}</div>
      {typeof pct === "number" && <Progress value={pct} className="mt-2 h-1.5" />}
    </Card>
  );
}

function ReviewLine({ item }: { item: ReviewItem }) {
  const cfg =
    item.kind === "good"
      ? { Icon: CheckCircle2, color: "text-emerald-600" }
      : item.kind === "warn"
        ? { Icon: AlertTriangle, color: "text-amber-600" }
        : { Icon: Lightbulb, color: "text-brand" };
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <cfg.Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cfg.color}`} />
      <span>{item.message}</span>
    </div>
  );
}

export function ReviewBeforeExportDialog({
  open,
  onOpenChange,
  resume,
  onDownload,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  resume: Resume;
  onDownload: () => void;
}) {
  const questions = React.useMemo(() => interviewQuestions(resume).slice(0, 3), [resume]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Quick review before download</DialogTitle>
          <DialogDescription className="text-xs">
            Optional — you can download anyway, nothing is blocked.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          <ReviewPanel resume={resume} />

          <Card className="mt-4 rounded-2xl border-border p-4 bg-card">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Optional interview prep
            </div>
            <ul className="mt-2 space-y-2">
              {questions.map((q, i) => (
                <li key={i} className="rounded-xl bg-muted/45 p-3">
                  <div className="text-sm font-semibold leading-snug">{q.question}</div>
                  <p className="mt-1 text-xs text-muted-foreground leading-normal">{q.tip}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4 bg-card">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-11 rounded-xl">
            Keep editing
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onDownload();
            }}
            className="h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Download className="mr-1.5 h-4 w-4" /> Download anyway
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
