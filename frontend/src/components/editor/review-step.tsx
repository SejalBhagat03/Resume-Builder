import * as React from "react";
import { Loader2, Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./section";
import { ResumePreview } from "./resume-preview";
import type { Resume } from "@/lib/resume-store";

interface ReviewStepProps {
  data: Resume["data"];
  onPdf: () => void;
  onDocx: () => void;
  pdfBusy: boolean;
  docxBusy: boolean;
  pdfBase64?: string | null;
}

export function ReviewStep({ data, onPdf, onDocx, pdfBusy, docxBusy, pdfBase64 }: ReviewStepProps) {
  return (
    <Section title="Review" sub="Looks great? Download your resume.">
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onPdf}
          disabled={pdfBusy}
          className="h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
        >
          {pdfBusy ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-1.5 h-4 w-4" />
          )}
          Download PDF
        </Button>
        <Button
          onClick={onDocx}
          disabled={docxBusy}
          variant="outline"
          className="h-11 rounded-xl border-brand/40 text-brand hover:bg-brand-soft"
        >
          {docxBusy ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="mr-1.5 h-4 w-4" />
          )}
          Export DOCX
        </Button>
      </div>
      <ResumePreview data={data} pdfBase64={pdfBase64} />
    </Section>
  );
}
