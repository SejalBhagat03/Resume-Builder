import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Search, Download, Trash2, Eye, Loader2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeThumb } from "@/components/resume-thumb";
import { CreateResumeWizard } from "@/components/create-resume-wizard";
import { useResumes, TEMPLATES, deleteResume, saveResume, type Resume } from "@/lib/resume-store";
import { RelativeTime } from "@/components/relative-time";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ResumePreview } from "@/components/editor/resume-preview";
import { toast } from "sonner";

export const Route = createFileRoute("/resumes")({
  head: () => ({
    meta: [
      { title: "My Resumes — Resume Builder Pro" },
      { name: "description", content: "Browse, edit, download and manage all of your resumes." },
    ],
  }),
  component: ResumesPage,
});

function ResumesPage() {
  const resumes = useResumes();
  const [q, setQ] = React.useState("");
  const [wizard, setWizard] = React.useState(false);
  const [previewResume, setPreviewResume] = React.useState<Resume | null>(null);
  const [pdfBusy, setPdfBusy] = React.useState(false);
  const navigate = useNavigate();
  const filtered = resumes.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));

  const [pdfBase64, setPdfBase64] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    async function loadPdf() {
      setPdfBase64(null);
      if (!previewResume || !previewResume.data.importedLayout) return;

      try {
        const { getPdfBinary } = await import("@/lib/pdf-store");
        const local = await getPdfBinary(previewResume.id);
        if (!active) return;
        if (local) {
          setPdfBase64(local);
          return;
        }

        if (previewResume.data.importedPdf?.storagePath) {
          const { supabase } = await import("@/integrations/supabase/client");
          const { data: fileData, error } = await supabase.storage
            .from("imported_resumes")
            .download(previewResume.data.importedPdf.storagePath);

          if (!active) return;
          if (!error && fileData) {
            const reader = new FileReader();
            reader.readAsDataURL(fileData);
            reader.onloadend = () => {
              if (!active) return;
              const base64data = (reader.result as string).split(",")[1];
              setPdfBase64(base64data);

              // Cache it locally in IndexedDB
              import("@/lib/pdf-store").then(({ storePdfBinary }) => {
                storePdfBinary(previewResume.id, base64data);
              });
            };
          }
        }
      } catch (err) {
        console.warn("Error loading preview PDF base64:", err);
      }
    }
    loadPdf();
    return () => {
      active = false;
    };
  }, [previewResume]);

  const handleDownloadPdf = async (resumeToDownload: Resume) => {
    setPdfBusy(true);
    try {
      const { downloadResumePdf } = await import("@/lib/pdf-export");
      const filename = await downloadResumePdf(resumeToDownload, "resume-preview-printable");
      toast.success(`Downloaded ${filename}`);

      const next = { ...resumeToDownload, downloads: resumeToDownload.downloads + 1 };
      saveResume(next);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "PDF export failed");
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="w-full px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Resumes</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {resumes.length} resume{resumes.length === 1 ? "" : "s"} total
            </p>
          </div>
          <Button
            onClick={() => setWizard(true)}
            className="h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Create New
          </Button>
        </div>

        <div className="relative mt-5 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by resume title..."
            className="h-11 rounded-xl bg-card pl-9"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((r) => (
            <ResumeCard
              key={r.id}
              resume={r}
              onOpen={() => navigate({ to: "/editor/$id", params: { id: r.id } })}
              onDelete={() => deleteResume(r.id)}
              onPreview={() => setPreviewResume(r)}
            />
          ))}
        </div>
      </div>
      <CreateResumeWizard open={wizard} onOpenChange={setWizard} />

      {/* Canva-Style Quick Preview Dialog */}
      <Dialog
        open={previewResume !== null}
        onOpenChange={(open) => !open && setPreviewResume(null)}
      >
        <DialogContent className="max-w-4xl w-[calc(100%-1.5rem)] sm:w-full h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl sm:rounded-3xl border-border">
          {previewResume && (
            <>
              <DialogHeader className="px-5 py-4 border-b border-border flex flex-row items-center justify-between shrink-0 space-y-0">
                <div className="min-w-0 pr-4">
                  <DialogTitle className="text-base sm:text-lg font-bold truncate">
                    {previewResume.title}
                  </DialogTitle>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Quick Preview</p>
                </div>
                <Button
                  onClick={() => handleDownloadPdf(previewResume)}
                  disabled={pdfBusy}
                  size="sm"
                  className="rounded-xl h-9 bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5 shrink-0"
                >
                  {pdfBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {pdfBusy ? "Generating..." : "Download PDF"}
                </Button>
              </DialogHeader>

              {/* Scrollable Preview Canvas */}
              <div className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-8 flex justify-center">
                <div className="w-full max-w-[800px] shadow-lg rounded-xl overflow-hidden bg-white">
                  <ResumePreview
                    data={previewResume.data}
                    template={previewResume.template}
                    pdfBase64={pdfBase64}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function ResumeCard({
  resume,
  onOpen,
  onDelete,
  onPreview,
}: {
  resume: Resume;
  onOpen: () => void;
  onDelete: () => void;
  onPreview: () => void;
}) {
  const templateName = TEMPLATES.find((t) => t.id === resume.template)?.name ?? resume.template;

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-border bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      onClick={onOpen}
    >
      {/* Floating Delete/Trash Button */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 z-10 h-8 w-8 rounded-lg bg-background/90 text-destructive border border-border/80 shadow-sm backdrop-blur-xs opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Are you sure you want to delete "${resume.title}"?`)) {
            onDelete();
          }
        }}
        aria-label="Delete resume"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      {/* Clickable thumbnail container */}
      <div
        className="relative overflow-hidden rounded-lg border border-border/40"
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
      >
        <ResumeThumb resume={resume} />
        {/* Hover overlay with eye icon */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="bg-background/95 shadow-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-bold text-foreground">
            <Eye className="h-3.5 w-3.5 text-brand" />
            Quick Preview
          </div>
        </div>
      </div>

      <h3 className="mt-3 truncate text-sm font-bold">{resume.title}</h3>
      <div className="mt-1 inline-block w-fit rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
        {templateName}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Updated <RelativeTime ts={resume.updatedAt} />
      </div>

      <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          onClick={onOpen}
          size="sm"
          variant="outline"
          className="h-8 flex-1 rounded-lg text-xs"
        >
          Edit
        </Button>
        <Button
          onClick={onPreview}
          size="sm"
          className="h-8 flex-1 rounded-lg bg-foreground text-background text-xs gap-1"
        >
          <Eye className="h-3 w-3" /> Preview
        </Button>
      </div>
    </div>
  );
}
