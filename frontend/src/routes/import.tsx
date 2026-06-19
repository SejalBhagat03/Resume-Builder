import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Upload, FileUp, Github, Loader2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { toast } from "sonner";
import { createResume, saveResume } from "@/lib/resume-store";
import { parseResumeFile } from "@/lib/parse.functions";
import { GithubImportDialog } from "@/components/github-import-dialog";
import { cn } from "@/lib/utils";
import { storePdfBinary } from "@/lib/pdf-store";
import { apiClient } from "@/lib/apiClient";

export const Route = createFileRoute("/import")({
  head: () => ({
    meta: [
      { title: "Import Resume — Resume Builder Pro" },
      {
        name: "description",
        content: "Import an existing resume from PDF, DOCX, or your GitHub profile.",
      },
    ],
  }),
  component: ImportPage,
});

function mergeTextItems(items: any[]) {
  if (items.length === 0) return [];

  // Sort items primarily by y (top to bottom) and secondarily by x (left to right)
  const sorted = [...items].sort((a, b) => {
    if (Math.abs(a.y - b.y) > 4) {
      return a.y - b.y;
    }
    return a.x - b.x;
  });

  const merged: any[] = [];
  let current = { ...sorted[0] };

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];

    const sameLine = Math.abs(current.y - next.y) < 4;
    const gap = next.x - (current.x + current.width);
    const maxGap = Math.max(current.fontSize, next.fontSize) * 2.5;

    if (sameLine && gap >= -5 && gap < maxGap) {
      const needsSpace = gap > 1 && !current.text.endsWith(" ") && !next.text.startsWith(" ");
      current.text = current.text + (needsSpace ? " " : "") + next.text;
      current.width = next.x + next.width - current.x;
      current.height = Math.max(current.height, next.height);
      current.fontSize = Math.max(current.fontSize, next.fontSize);
      current.isBold = current.isBold || next.isBold;
      current.isItalic = current.isItalic || next.isItalic;
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  merged.push(current);
  return merged;
}

function ImportPage() {
  const navigate = useNavigate();
  const [parsing, setParsing] = React.useState(false);
  const [progressStep, setProgressStep] = React.useState<number>(-1);
  const [ghOpen, setGhOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const parsePdfLayout = async (file: File, onStepChange: (step: number) => void) => {
    let pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
      onStepChange(0); // Reading document
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = () => {
          pdfjsLib = (window as any).pdfjsLib;
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          resolve();
        };
        script.onerror = () => reject(new Error("Failed to load PDF worker script."));
        document.head.appendChild(script);
      });
      pdfjsLib = (window as any).pdfjsLib;
    }

    onStepChange(1); // Detecting pages
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;

    onStepChange(2); // Extracting text layout
    const pages = [];
    let combinedText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      const textContent = await page.getTextContent();

      const textItems = textContent.items.map((item: any) => {
        const style = textContent.styles[item.fontName];
        const fontFamily = style?.fontFamily || "";
        const fontName = item.fontName || "";

        const isBold =
          fontName.toLowerCase().includes("bold") || fontFamily.toLowerCase().includes("bold");
        const isItalic =
          fontName.toLowerCase().includes("italic") ||
          fontName.toLowerCase().includes("oblique") ||
          fontFamily.toLowerCase().includes("italic") ||
          fontFamily.toLowerCase().includes("oblique");

        const x = item.transform[4];
        const y = viewport.height - item.transform[5] - (item.height || 0);

        return {
          text: item.str,
          x,
          y,
          width: item.width,
          height: item.height || Math.abs(item.transform[0] || item.transform[3] || 12),
          fontSize: Math.abs(item.transform[0] || item.transform[3] || 12),
          fontFamily,
          fontName,
          isBold,
          isItalic,
        };
      });

      const merged = mergeTextItems(textItems);
      combinedText += merged.map((i) => i.text).join(" ") + "\n";

      pages.push({
        viewport: { width: viewport.width, height: viewport.height },
        textItems: merged,
      });
    }

    onStepChange(3); // Preparing visual editor
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      importedLayout: { pages },
      rawText: combinedText,
    };
  };

  const handleFile = async (file: File | null) => {
    if (!file) return;

    setParsing(true);
    setProgressStep(0);
    try {
      const title = file.name.replace(/\.[^/.]+$/, "") || "Imported Resume";
      const r = createResume({
        title: `${title} (Visual Import)`,
        profileType: "custom",
        template: "ats-professional",
      });

      if (file.name.toLowerCase().endsWith(".pdf")) {
        try {
          const { importedLayout, rawText } = await parsePdfLayout(file, setProgressStep);
          r.data.importedLayout = importedLayout;
          r.data.rawText = rawText;
          r.data.isVisualMode = true;

          const base64 = await fileToBase64(file);

          // Save locally in IndexedDB (bypasses localStorage size limit)
          await storePdfBinary(r.id, base64);

          r.data.importedPdf = {
            pageCount: importedLayout.pages.length,
            uploadedAt: new Date().toISOString(),
          };

          // Backup upload to backend (which stores in Supabase Storage securely)
          try {
            const uploadResult = (await apiClient.upload("/upload/pdf", file)) as any;
            if (uploadResult?.storagePath) {
              r.data.importedPdf.storagePath = uploadResult.storagePath;
            }
          } catch (uploadErr) {
            console.warn("Backend PDF upload failed (non-critical):", uploadErr);
          }

          // Step 4: AI-structured parsing of all sections
          setProgressStep(4);
          try {
            const textForAI =
              rawText ||
              importedLayout.pages
                ?.flatMap((p: any) => p.textItems.map((i: any) => i.text))
                .join(" ") ||
              "";
            if (textForAI && textForAI.length >= 20) {
              const parsed = await apiClient.post<any>("/ai/convert-imported-resume", {
                resumeText: textForAI,
              });
              r.data.fullName = parsed.fullName || "";
              r.data.email = parsed.email || "";
              r.data.phone = parsed.phone || "";
              r.data.location = parsed.location || "";
              r.data.summary = parsed.summary || "";
              r.data.education = parsed.education?.length ? parsed.education : r.data.education;
              r.data.experience = parsed.experience?.length ? parsed.experience : r.data.experience;
              r.data.projects = parsed.projects?.length ? parsed.projects : r.data.projects;
              r.data.skills = parsed.skills?.length ? parsed.skills : r.data.skills;
            } else {
              // Fallback: basic regex extraction
              const result = await parseResumeFile({ data: { base64, filename: file.name } });
              r.data.fullName = result.fullName || "";
              r.data.email = result.email || "";
              r.data.phone = result.phone || "";
              r.data.summary = result.summary || "";
            }
          } catch (aiErr) {
            console.warn("AI structuring failed, falling back to basic parse:", aiErr);
            const result = await parseResumeFile({ data: { base64, filename: file.name } });
            r.data.fullName = result.fullName || "";
            r.data.email = result.email || "";
            r.data.phone = result.phone || "";
            r.data.summary = result.summary || "";
          }
        } catch (layoutErr) {
          console.warn("Visual layout import failed, fallback to text parsing:", layoutErr);
          const base64 = await fileToBase64(file);
          setProgressStep(4);
          try {
            const result = await parseResumeFile({ data: { base64, filename: file.name } });
            const rawText = result.rawText || "";
            if (rawText.length >= 20) {
              const parsed = await apiClient.post<any>("/ai/convert-imported-resume", {
                resumeText: rawText,
              });
              r.data.fullName = parsed.fullName || "";
              r.data.email = parsed.email || "";
              r.data.phone = parsed.phone || "";
              r.data.location = parsed.location || "";
              r.data.summary = parsed.summary || "";
              r.data.education = parsed.education?.length ? parsed.education : r.data.education;
              r.data.experience = parsed.experience?.length ? parsed.experience : r.data.experience;
              r.data.projects = parsed.projects?.length ? parsed.projects : r.data.projects;
              r.data.skills = parsed.skills?.length ? parsed.skills : r.data.skills;
            } else {
              r.data.fullName = result.fullName || "";
              r.data.email = result.email || "";
              r.data.phone = result.phone || "";
              r.data.summary = result.summary || "";
            }
          } catch {
            const result = await parseResumeFile({ data: { base64, filename: file.name } });
            r.data.fullName = result.fullName || "";
            r.data.email = result.email || "";
            r.data.phone = result.phone || "";
            r.data.summary = result.summary || "";
          }
        }
      } else if (file.name.toLowerCase().endsWith(".txt")) {
        setProgressStep(1);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setProgressStep(2);
        const text = await file.text();
        r.data.rawText = text;
        setProgressStep(3);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setProgressStep(4);
        try {
          if (text.length >= 20) {
            const parsed = await apiClient.post<any>("/ai/convert-imported-resume", {
              resumeText: text,
            });
            r.data.fullName = parsed.fullName || "";
            r.data.email = parsed.email || "";
            r.data.phone = parsed.phone || "";
            r.data.location = parsed.location || "";
            r.data.summary = parsed.summary || "";
            r.data.education = parsed.education?.length ? parsed.education : r.data.education;
            r.data.experience = parsed.experience?.length ? parsed.experience : r.data.experience;
            r.data.projects = parsed.projects?.length ? parsed.projects : r.data.projects;
            r.data.skills = parsed.skills?.length ? parsed.skills : r.data.skills;
          }
        } catch (aiErr) {
          console.warn("AI structuring failed for TXT:", aiErr);
          const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
          const lines = text
            .split(/\n/)
            .map((l) => l.trim())
            .filter(Boolean);
          const nameLine = lines.find(
            (l) => l.length > 2 && l.length < 60 && !l.includes("@") && !l.includes("http"),
          );
          r.data.fullName = nameLine ?? "";
          r.data.email = emailMatch?.[0] ?? "";
          r.data.phone = phoneMatch?.[0] ?? "";
          r.data.summary = text.slice(0, 500);
        }
      } else {
        setProgressStep(1);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setProgressStep(2);
        const base64 = await fileToBase64(file);
        const result = await parseResumeFile({ data: { base64, filename: file.name } });
        r.data.rawText = result.rawText || "";
        setProgressStep(3);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProgressStep(4);
        try {
          const rawText = result.rawText || "";
          if (rawText.length >= 20) {
            const parsed = await apiClient.post<any>("/ai/convert-imported-resume", {
              resumeText: rawText,
            });
            r.data.fullName = parsed.fullName || "";
            r.data.email = parsed.email || "";
            r.data.phone = parsed.phone || "";
            r.data.location = parsed.location || "";
            r.data.summary = parsed.summary || "";
            r.data.education = parsed.education?.length ? parsed.education : r.data.education;
            r.data.experience = parsed.experience?.length ? parsed.experience : r.data.experience;
            r.data.projects = parsed.projects?.length ? parsed.projects : r.data.projects;
            r.data.skills = parsed.skills?.length ? parsed.skills : r.data.skills;
          } else {
            r.data.fullName = result.fullName || "";
            r.data.email = result.email || "";
            r.data.phone = result.phone || "";
            r.data.location = result.location || "";
            r.data.summary = result.summary || "";
          }
        } catch (aiErr) {
          console.warn("AI structuring failed for non-PDF:", aiErr);
          r.data.fullName = result.fullName || "";
          r.data.email = result.email || "";
          r.data.phone = result.phone || "";
          r.data.location = result.location || "";
          r.data.summary = result.summary || "";
        }
      }

      await saveResume(r);
      toast.success("Successfully imported resume! Opening editor...");
      navigate({ to: "/editor/$id", params: { id: r.id } });
    } catch (err) {
      console.error(err);
      toast.error("Could not parse file. Try copying the text or filling manually.");
    } finally {
      setParsing(false);
      setProgressStep(-1);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleGithubImport = async (projects: any[]) => {
    if (projects.length === 0) return;

    try {
      const r = createResume({
        title: "GitHub Projects Resume",
        profileType: "custom",
        template: "ats-professional",
      });

      r.data.projects = projects.map((p) => ({
        name: p.name,
        tools: p.tools,
        bullets: p.bullets,
      }));

      await saveResume(r);
      toast.success("Successfully imported GitHub projects! Opening editor...");
      navigate({ to: "/editor/$id", params: { id: r.id } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create resume from GitHub projects.");
    }
  };

  return (
    <AppShell>
      <div className="w-full px-4 py-6 md:px-8 md:py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Import Resume</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bring an existing resume in to skip the typing.
        </p>

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !parsing && fileInputRef.current?.click()}
          className="mt-6 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-brand/40 bg-brand-soft/30 p-12 text-center transition-colors hover:bg-brand-soft/50 cursor-pointer"
        >
          {parsing ? (
            <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-soft text-left space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-brand animate-duration-1000" />
                <h3 className="text-base font-bold text-foreground">Importing Resume</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                We are analyzing and preparing your document. This will only take a moment.
              </p>
              <div className="space-y-3 pt-1">
                {[
                  "Reading document",
                  "Detecting pages",
                  "Extracting text layout",
                  "Preparing visual editor",
                  "Structuring sections with AI ✨",
                ].map((stepText, idx) => {
                  const isActive = progressStep === idx;
                  const isDone = progressStep > idx;
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span
                        className={cn(
                          "font-semibold transition-colors duration-200",
                          isActive && "text-brand font-bold",
                          isDone && "text-muted-foreground/50",
                          !isActive && !isDone && "text-muted-foreground/40",
                        )}
                      >
                        {stepText}
                      </span>
                      <span
                        className={cn(
                          "h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                          isActive && "bg-brand/20 text-brand border border-brand/40 animate-pulse",
                          isDone && "bg-brand text-brand-foreground",
                          !isActive &&
                            !isDone &&
                            "bg-muted text-muted-foreground/15 border border-border",
                        )}
                      >
                        {isDone ? "✓" : isActive ? "●" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div className="grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <div className="text-base font-bold">Drop your PDF, DOCX or TXT</div>
                <div className="text-sm text-muted-foreground">
                  or click to browse — we'll auto-fill your sections
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              <Button
                type="button"
                className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 pointer-events-none"
              >
                <FileUp className="mr-1.5 h-4 w-4" /> Choose File
              </Button>
            </>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            className="h-14 justify-start rounded-2xl cursor-pointer"
            onClick={() => setGhOpen(true)}
          >
            <Github className="mr-2 h-5 w-5" /> Import from GitHub
          </Button>
          <Button
            variant="outline"
            className="h-14 justify-start rounded-2xl cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="mr-2 h-5 w-5" /> Import LinkedIn PDF
          </Button>
        </div>
      </div>

      <GithubImportDialog open={ghOpen} onOpenChange={setGhOpen} onImport={handleGithubImport} />
    </AppShell>
  );
}
