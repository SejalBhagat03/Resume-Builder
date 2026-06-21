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
import { Progress } from "@/components/ui/progress";
import { reviewResume, interviewQuestions, type ReviewItem } from "@/lib/ai-mock";
import type { Resume } from "@/lib/resume-store";

export function ReviewPanel({ resume, jd }: { resume: Resume; jd?: string }) {
  const report = React.useMemo(() => reviewResume(resume, jd), [resume, jd]);
  return (
    <div className="space-y-3">
      {/* Metrics — 2-col grid, compact */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard label="ATS Score" value={`${report.atsScore}%`} pct={report.atsScore} />
        <MetricCard label="Readability" value={`${report.readability}%`} pct={report.readability} />
        <MetricCard
          label="Keywords"
          value={`${report.keywordCoverage}%`}
          pct={report.keywordCoverage}
        />
        <MetricCard label="Est. Pages" value={`${report.estPages}`} />
      </div>

      {/* Insights */}
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Insights
        </div>
        <ul className="space-y-2">
          {report.items.map((item, i) => (
            <li key={i}>
              <ReviewLine item={item} />
            </li>
          ))}
        </ul>
        <div className="mt-2.5 rounded-lg bg-brand-soft/40 px-2.5 py-1.5 text-xs">
          <span className="font-semibold text-brand">Strongest: </span>
          {report.strongest}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, pct }: { label: string; value: string; pct?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground leading-none">
        {label}
      </div>
      <div className="mt-1 text-xl font-extrabold leading-none">{value}</div>
      {typeof pct === "number" && <Progress value={pct} className="mt-1.5 h-1" />}
    </div>
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
    <div className="flex items-start gap-2 text-xs">
      <cfg.Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${cfg.color}`} />
      <span className="leading-snug">{item.message}</span>
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
  const questions = React.useMemo(() => interviewQuestions(resume).slice(0, 2), [resume]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[calc(100%-2rem)] rounded-2xl border-border p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border">
          <DialogTitle className="text-base font-bold leading-tight">
            Quick review before download
          </DialogTitle>
          <DialogDescription className="text-[11px] mt-0.5">
            Optional — download anyway if you're ready.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="overflow-y-auto max-h-[55vh] p-4 space-y-3">
          <ReviewPanel resume={resume} />

          {/* Interview prep — compact */}
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Interview prep
            </div>
            <ul className="space-y-2">
              {questions.map((q, i) => (
                <li key={i} className="rounded-lg bg-muted/45 px-2.5 py-2">
                  <div className="text-xs font-semibold leading-snug">{q.question}</div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">{q.tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-card">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-xl text-sm px-4"
          >
            Keep editing
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onDownload();
            }}
            className="h-9 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-sm px-4"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
