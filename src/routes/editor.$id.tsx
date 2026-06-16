import * as React from "react";
import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Download,
  Save,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Wrench,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Github,
  FileDown,
  Wand2,
  RefreshCw,
  Loader2,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Move,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getResume, saveResume, type Resume } from "@/lib/resume-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GithubImportDialog } from "@/components/github-import-dialog";
import { rewriteBullet, generateSummary, suggestSkills } from "@/lib/ai.functions";
import { AiAssistantPanel } from "@/components/ai-assistant-panel";
import { ReviewBeforeExportDialog } from "@/components/review-before-export";
import { supabase } from "@/integrations/supabase/client";
import { getPdfBinary, storePdfBinary } from "@/lib/pdf-store";

export const Route = createFileRoute("/editor/$id")({
  head: () => ({
    meta: [
      { title: "Edit Resume — Resume Builder Pro" },
      {
        name: "description",
        content:
          "Build your resume step by step — Profile, Education, Experience, Projects and Skills.",
      },
    ],
  }),
  component: EditorPage,
});

const STEPS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "projects", label: "Projects", icon: FolderGit2 },
  { key: "skills", label: "Skills", icon: Wrench },
  { key: "review", label: "Review", icon: Sparkles },
] as const;

function EditorPage() {
  const { id } = useParams({ from: "/editor/$id" });
  const [resume, setResume] = React.useState<Resume | null>(null);
  const [loadingResume, setLoadingResume] = React.useState(true);
  const [step, setStep] = React.useState(0);
  const [pdfBusy, setPdfBusy] = React.useState(false);
  const [docxBusy, setDocxBusy] = React.useState(false);
  const [aiOpen, setAiOpen] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);

  const [history, setHistory] = React.useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  const [pdfBase64, setPdfBase64] = React.useState<string | null>(null);
  // "visual" = original PDF canvas, "template" = live form data preview
  const [previewTab, setPreviewTab] = React.useState<"visual" | "template">("visual");

  React.useEffect(() => {
    async function loadPdf() {
      if (!resume || !resume.data.importedLayout) return;
      
      const local = await getPdfBinary(resume.id);
      if (local) {
        setPdfBase64(local);
        return;
      }
      
      if (resume.data.importedPdf?.storagePath) {
        try {
          const { data: fileData, error } = await supabase.storage
            .from("imported_resumes")
            .download(resume.data.importedPdf.storagePath);
          
          if (!error && fileData) {
            const reader = new FileReader();
            reader.readAsDataURL(fileData);
            reader.onloadend = () => {
              const base64data = (reader.result as string).split(",")[1];
              setPdfBase64(base64data);
              storePdfBinary(resume.id, base64data);
            };
          }
        } catch (storageErr) {
          console.warn("Could not download PDF from storage:", storageErr);
        }
      }
    }
    loadPdf();
  }, [resume?.id]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      const layout = history[nextIdx];
      update({ importedLayout: layout });
      if (resume) {
        saveResume({
          ...resume,
          data: { ...resume.data, importedLayout: layout },
        });
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const layout = history[nextIdx];
      update({ importedLayout: layout });
      if (resume) {
        saveResume({
          ...resume,
          data: { ...resume.data, importedLayout: layout },
        });
      }
    }
  };

  React.useEffect(() => {
    if (resume?.data.importedLayout && history.length === 0) {
      setHistory([resume.data.importedLayout]);
      setHistoryIndex(0);
    }
  }, [resume, history]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (resume?.data.isVisualMode !== false && resume?.data.importedLayout) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
          e.preventDefault();
          handleUndo();
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history, resume]);

  React.useEffect(() => {
    async function load() {
      const local = getResume(id);
      if (local) {
        setResume(local);
        setLoadingResume(false);
        return;
      }

      const { isUUID } = await import("@/lib/resume-store");
      if (isUUID(id)) {
        try {
          const { data, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", id)
            .single();

          if (!error && data) {
            const mapped: Resume = {
              id: data.id,
              title: data.title,
              profileType: data.profile_type as any,
              template: data.template as any,
              updatedAt: new Date(data.updated_at).getTime(),
              downloads: data.downloads,
              atsScore: data.ats_score,
              data: data.data as any,
            };
            setResume(mapped);
          }
        } catch (err) {
          console.warn("Supabase fetch failed:", err);
        }
      }
      setLoadingResume(false);
    }
    load();
  }, [id]);

  if (loadingResume) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <span className="text-sm text-muted-foreground">Loading resume…</span>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!resume) {
    throw notFound();
  }

  const update = (patch: Partial<Resume["data"]>) =>
    setResume((r) => r ? ({ ...r, data: { ...r.data, ...patch } }) : null);

  const handleLayoutChange = (nextLayout: any) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextLayout);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    update({ importedLayout: nextLayout });
    if (resume) {
      saveResume({
        ...resume,
        data: { ...resume.data, importedLayout: nextLayout },
      });
    }
  };

  const updateCustomization = (patch: Partial<NonNullable<Resume["data"]["customization"]>>) => {
    setResume((r) => {
      if (!r) return null;
      const current = r.data.customization || { accentColor: "", fontSize: "md", spacing: "md" };
      return {
        ...r,
        data: {
          ...r.data,
          customization: {
            ...current,
            ...patch,
          },
        },
      };
    });
  };

  const handleSave = () => {
    if (resume) {
      saveResume(resume);
      toast.success("Resume saved");
    }
  };

  const handleConvertToNative = async () => {
    if (!confirm("✨ Convert to Native Resume Builder?\n\nThis will use AI to scan your original resume text and fully populate all forms on the left so you can use our dynamic templates. Your original visual edit layout will remain fully available if you wish to switch back.")) {
      return;
    }
    toast.loading("AI is parsing and structuring your resume...", { id: "conv" });
    try {
      const { parseResumeStructure } = await import("@/lib/ai.functions");
      const textToParse = resume.data.rawText || 
        resume.data.importedLayout?.pages?.flatMap(p => p.textItems.map(i => i.text)).join(" ") || "";
      
      if (!textToParse || textToParse.length < 20) {
        throw new Error("No sufficient resume text extracted to convert.");
      }

      const parsed = await parseResumeStructure({ data: { resumeText: textToParse } });
      
      update({
        fullName: parsed.fullName || resume.data.fullName,
        email: parsed.email || resume.data.email,
        phone: parsed.phone || resume.data.phone,
        location: parsed.location || resume.data.location,
        summary: parsed.summary || resume.data.summary,
        education: parsed.education || resume.data.education,
        experience: parsed.experience || resume.data.experience,
        projects: parsed.projects || resume.data.projects,
        skills: parsed.skills || resume.data.skills,
        isVisualMode: false,
      });
      
      toast.success("Successfully converted resume! You can now use templates.", { id: "conv" });
    } catch (err) {
      console.error("AI Conversion error:", err);
      toast.error(err instanceof Error ? err.message : "AI conversion failed.", { id: "conv" });
    }
  };

  const handlePdf = async () => {
    setPdfBusy(true);
    try {
      const { downloadResumePdf } = await import("@/lib/pdf-export");
      const filename = await downloadResumePdf(resume, "resume-preview-printable");
      toast.success(`Downloaded ${filename}`);
      const next = { ...resume, downloads: resume.downloads + 1 };
      setResume(next);
      saveResume(next);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "PDF export failed");
    } finally {
      setPdfBusy(false);
    }
  };

  const handleDownloadClick = () => {
    saveResume(resume);
    setReviewOpen(true);
  };

  const handleDocx = async () => {
    setDocxBusy(true);
    try {
      const { downloadResumeDocx } = await import("@/lib/docx-export");
      const filename = await downloadResumeDocx(resume);
      toast.success(`Downloaded ${filename}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "DOCX export failed");
    } finally {
      setDocxBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="w-full px-4 py-6 md:px-8 md:py-8">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
              <Link to="/resumes">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <Input
                value={resume.title}
                onChange={(e) => setResume((r) => r ? ({ ...r, title: e.target.value }) : null)}
                className="h-10 max-w-xs rounded-xl border-transparent bg-transparent px-2 text-xl font-bold hover:bg-card focus-visible:bg-card"
              />
              <div className="px-2 text-xs text-muted-foreground">
                Step {step + 1} of {STEPS.length} — {STEPS[step].label}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              onClick={() => setAiOpen(true)}
              variant="outline"
              className="h-10 rounded-xl border-brand/40 bg-brand-soft/40 text-brand hover:bg-brand-soft/70 cursor-pointer animate-pulse-subtle"
            >
              <Sparkles className="mr-1.5 h-4 w-4" /> AI Assistant
            </Button>
            {resume.data.isVisualMode !== false && resume.data.importedLayout && (
              <div className="flex gap-1 border-r pr-2 border-border mr-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl cursor-pointer"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  title="Undo last edit (Ctrl+Z)"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl cursor-pointer"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  title="Redo last edit (Ctrl+Y)"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button onClick={handleSave} variant="outline" className="h-10 rounded-xl">
              <Save className="mr-1.5 h-4 w-4" /> Save
            </Button>
            <Button
              onClick={handleDocx}
              disabled={docxBusy}
              variant="outline"
              className="h-10 rounded-xl border-brand/40 text-brand hover:bg-brand-soft"
            >
              {docxBusy ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="mr-1.5 h-4 w-4" />
              )}
              DOCX
            </Button>
            <Button
              onClick={handleDownloadClick}
              disabled={pdfBusy}
              className="h-10 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold"
            >
              {pdfBusy ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-1.5 h-4 w-4" />
              )}
              Download PDF
            </Button>
          </div>
        </div>

        {/* Steps strip */}
        <ol className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={s.key}>
                <button
                  onClick={() => setStep(i)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    active && "border-brand bg-brand-soft text-brand",
                    done && !active && "border-brand/40 bg-card text-brand",
                    !active &&
                      !done &&
                      "border-border bg-card text-muted-foreground hover:border-brand/30",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                      active
                        ? "bg-brand text-brand-foreground"
                        : done
                          ? "bg-brand/20 text-brand"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className="truncate text-sm font-semibold">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Two-panel: form + preview */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft md:p-7">
            {resume.data.importedLayout && (
              <div className="mb-6 rounded-2xl border border-brand/25 bg-brand-soft/35 p-5 text-sm shadow-sm transition-all animate-fade-in">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="font-bold text-foreground text-sm">
                        {resume.data.isVisualMode !== false ? "Visual Edit Mode Active" : "Template Mode Active"}
                      </h4>
                      <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider">
                        {resume.data.isVisualMode !== false ? "Original Layout" : "Dynamic Layout"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {resume.data.isVisualMode !== false ? (
                        <>
                          We've preserved the exact visual styling and layout of your uploaded PDF.
                          <span className="block mt-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                            ✅ Your Profile, Education, Experience, Projects, and Skills are auto-filled on the left — use the form tabs to edit any section directly, or click on the preview to make visual edits.
                          </span>
                          <strong className="block mt-1 text-amber-700 dark:text-amber-500">
                            ⚠️ Visual Edit Mode is optimized for minor text updates. Use "Convert to Native" for extensive restructuring.
                          </strong>
                        </>
                      ) : (
                        <>
                          You are currently using one of our built-in templates. Your original imported visual layout is preserved.
                        </>
                      )}
                    </p>
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      {resume.data.isVisualMode !== false ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-lg text-xs bg-background hover:bg-muted border-brand/35 text-brand hover:text-brand font-semibold cursor-pointer shadow-sm"
                            onClick={handleConvertToNative}
                          >
                            ✨ Convert to Native
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 rounded-lg text-xs hover:bg-muted font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={() => {
                              update({ isVisualMode: false });
                              toast.info("Switched to Template Mode. You can toggle back anytime.");
                            }}
                          >
                            Use Template Mode
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-lg text-xs bg-background hover:bg-brand-soft border-brand/35 text-brand hover:text-brand font-semibold cursor-pointer shadow-sm"
                          onClick={() => {
                            update({ isVisualMode: true });
                            toast.success("Restored Visual Edit Mode!");
                          }}
                        >
                          ↩ Switch to Visual Edit Mode
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {step === 0 && <ProfileStep data={resume.data} update={update} />}
            {step === 1 && <EducationStep data={resume.data} update={update} />}
            {step === 2 && <ExperienceStep data={resume.data} update={update} />}
            {step === 3 && <ProjectsStep data={resume.data} update={update} />}
            {step === 4 && <SkillsStep data={resume.data} update={update} />}
            {step === 5 && (
              <ReviewStep
                data={resume.data}
                onPdf={handleDownloadClick}
                onDocx={handleDocx}
                pdfBusy={pdfBusy}
                docxBusy={docxBusy}
                pdfBase64={pdfBase64}
              />
            )}

            <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="h-11 rounded-xl"
              >
                Previous
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => {
                    saveResume(resume);
                    setStep((s) => s + 1);
                  }}
                  className="h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  Save & Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  className="h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  Finish
                </Button>
              )}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Customization controls */}
              {resume.data.isVisualMode !== false && resume.data.importedLayout ? (
                <div className="rounded-2xl border border-brand/20 bg-brand-soft/20 p-5 shadow-soft text-center space-y-3">
                  <div className="font-bold text-brand-dark text-sm flex items-center justify-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Visual Edit Mode
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Layout options, colors, and font sizes are locked to match your uploaded PDF exactly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 rounded-xl text-xs font-bold bg-background hover:bg-brand-soft border-brand/35 text-brand cursor-pointer"
                    onClick={() => update({ isVisualMode: false })}
                  >
                    Switch to Dynamic Template Mode
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Layout Template</h3>
                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                      {(["ats-professional", "modern", "minimal", "creative", "two-column"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setResume((r) => r ? ({ ...r, template: t }) : null);
                            saveResume({ ...resume, template: t });
                          }}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-center text-xs font-semibold capitalize transition-all",
                            resume.template === t
                              ? "border-brand bg-brand-soft text-brand shadow-sm"
                              : "border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-foreground"
                          )}
                        >
                          {t.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div>
                    <h3 className="text-sm font-bold text-foreground">Accent Color</h3>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {[
                        { name: "Brand", value: "" },
                        { name: "Ocean", value: "#0284c7" },
                        { name: "Emerald", value: "#059669" },
                        { name: "Indigo", value: "#4f46e5" },
                        { name: "Amber", value: "#d97706" },
                        { name: "Crimson", value: "#dc2626" },
                        { name: "Slate", value: "#475569" },
                      ].map((col) => (
                        <button
                          key={col.name}
                          onClick={() => updateCustomization({ accentColor: col.value })}
                          className={cn(
                            "flex h-7 items-center justify-center rounded-lg border px-2.5 text-[11px] font-semibold transition-all",
                            (resume.data.customization?.accentColor ?? "") === col.value
                              ? "border-brand bg-brand-soft text-brand font-bold"
                              : "border-border bg-background text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {col.value ? (
                            <span
                              className="mr-1 h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: col.value }}
                            />
                          ) : (
                            <span className="mr-1 h-2.5 w-2.5 rounded-full bg-brand" />
                          )}
                          {col.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Font Size</h3>
                      <div className="mt-2.5 flex gap-1.5">
                        {(["sm", "md", "lg"] as const).map((sz) => (
                          <button
                            key={sz}
                            onClick={() => updateCustomization({ fontSize: sz })}
                            className={cn(
                              "flex-1 rounded-lg border py-1.5 text-center text-xs font-semibold capitalize transition-all",
                              (resume.data.customization?.fontSize ?? "md") === sz
                                ? "border-brand bg-brand-soft text-brand"
                                : "border-border bg-background text-muted-foreground hover:bg-muted"
                            )}
                          >
                            {sz === "sm" ? "Small" : sz === "md" ? "Medium" : "Large"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-foreground">Spacing</h3>
                      <div className="mt-2.5 flex gap-1.5">
                        {(["sm", "md", "lg"] as const).map((sp) => (
                          <button
                            key={sp}
                            onClick={() => updateCustomization({ spacing: sp })}
                            className={cn(
                              "flex-1 rounded-lg border py-1.5 text-center text-xs font-semibold capitalize transition-all",
                              (resume.data.customization?.spacing ?? "md") === sp
                                ? "border-brand bg-brand-soft text-brand"
                                : "border-border bg-background text-muted-foreground hover:bg-muted"
                            )}
                          >
                            {sp === "sm" ? "Compact" : sp === "md" ? "Normal" : "Relaxed"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview canvas */}
              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                {/* Header + tab toggle */}
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Live Preview
                  </div>
                  {resume.data.importedLayout ? (
                    <div className="flex items-center rounded-xl border border-border bg-muted/50 p-0.5 gap-0.5">
                      <button
                        onClick={() => setPreviewTab("visual")}
                        className={cn(
                          "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer",
                          previewTab === "visual"
                            ? "bg-background text-brand shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Original PDF Canvas — visual edits only"
                      >
                        📄 Visual PDF
                      </button>
                      <button
                        onClick={() => setPreviewTab("template")}
                        className={cn(
                          "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer",
                          previewTab === "template"
                            ? "bg-background text-brand shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Template Preview — shows all form edits live"
                      >
                        ✨ Template
                      </button>
                    </div>
                  ) : (
                    resume.data.isVisualMode !== false && resume.data.importedLayout && (
                      <span className="text-[10px] text-brand bg-brand-soft px-2 py-0.5 rounded-full font-bold">
                        ✏️ Click to Edit Text
                      </span>
                    )
                  )}
                </div>
                {previewTab === "template" && resume.data.importedLayout && (
                  <div className="mb-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    ✅ Showing live form data — all your edits (projects, experience, etc.) appear here
                  </div>
                )}
                <ResumePreview
                  data={resume.data}
                  template={resume.template}
                  onLayoutChange={previewTab === "visual" ? handleLayoutChange : undefined}
                  pdfBase64={previewTab === "visual" ? pdfBase64 : null}
                  onConvertToNative={handleConvertToNative}
                  forceTemplatePreview={previewTab === "template"}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <AiAssistantPanel
        open={aiOpen}
        onOpenChange={setAiOpen}
        resume={resume}
        onApply={setResume}
      />
      <ReviewBeforeExportDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        resume={resume}
        onDownload={handlePdf}
      />
    </AppShell>
  );
}

/* ------------- Steps ------------- */

function Section({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold">{title}</h2>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function ProfileStep({
  data,
  update,
}: {
  data: Resume["data"];
  update: (p: Partial<Resume["data"]>) => void;
}) {
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

  return (
    <Section title="Profile" sub="Basic contact information that appears at the top.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" value={data.fullName} onChange={(v) => update({ fullName: v })} />
        <Field label="Email" value={data.email} onChange={(v) => update({ email: v })} />
        <Field label="Phone" value={data.phone} onChange={(v) => update({ phone: v })} />
        <Field label="Location" value={data.location} onChange={(v) => update({ location: v })} />
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

function EducationStep({
  data,
  update,
}: {
  data: Resume["data"];
  update: (p: Partial<Resume["data"]>) => void;
}) {
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

function ExperienceStep({
  data,
  update,
}: {
  data: Resume["data"];
  update: (p: Partial<Resume["data"]>) => void;
}) {
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

function ProjectsStep({
  data,
  update,
}: {
  data: Resume["data"];
  update: (p: Partial<Resume["data"]>) => void;
}) {
  const set = (i: number, patch: Partial<Resume["data"]["projects"][number]>) => {
    const next = [...data.projects];
    next[i] = { ...next[i], ...patch };
    update({ projects: next });
  };
  const [ghOpen, setGhOpen] = React.useState(false);
  return (
    <Section title="Projects" sub="Highlight 2–4 standout projects.">
      <div className="-mt-2 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setGhOpen(true)}
          className="h-10 rounded-xl"
        >
          <Github className="mr-1.5 h-4 w-4" /> Import from GitHub
        </Button>
        <span className="self-center text-xs text-muted-foreground">
          Pull projects automatically from any public GitHub account.
        </span>
      </div>
      {data.projects.map((p, i) => (
        <div key={i} className="rounded-2xl border border-border p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Project name" value={p.name} onChange={(v) => set(i, { name: v })} />
            <Field label="Tools / stack" value={p.tools} onChange={(v) => set(i, { tools: v })} />
          </div>
          <div className="mt-3">
            <Label>Bullet points (one per line)</Label>
            <Textarea
              value={p.bullets.join("\n")}
              onChange={(e) => set(i, { bullets: e.target.value.split("\n") })}
              rows={3}
              className="mt-1.5 rounded-xl"
              placeholder="• Built and deployed…"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => update({ projects: data.projects.filter((_, x) => x !== i) })}
            className="mt-2 text-destructive"
          >
            <Trash2 className="mr-1.5 h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          update({ projects: [...data.projects, { name: "", tools: "", bullets: [""] }] })
        }
        className="rounded-xl"
      >
        <Plus className="mr-1.5 h-4 w-4" /> Add project
      </Button>
      <GithubImportDialog
        open={ghOpen}
        onOpenChange={setGhOpen}
        onImport={(projects) => {
          const cleaned = data.projects.filter(
            (p) => p.name.trim() || p.tools.trim() || p.bullets.some(Boolean),
          );
          update({ projects: [...cleaned, ...projects] });
        }}
      />
    </Section>
  );
}

function SkillsStep({
  data,
  update,
}: {
  data: Resume["data"];
  update: (p: Partial<Resume["data"]>) => void;
}) {
  const set = (i: number, patch: Partial<Resume["data"]["skills"][number]>) => {
    const next = [...data.skills];
    next[i] = { ...next[i], ...patch };
    update({ skills: next });
  };
  const [aiSkillsBusy, setAiSkillsBusy] = React.useState(false);

  const handleAiSkills = async () => {
    const role = data.experience[0]?.role;
    if (!role) {
      toast.error("Add at least one experience role first.");
      return;
    }
    setAiSkillsBusy(true);
    try {
      const current = data.skills.map((s) => s.items).join(", ");
      const result = await suggestSkills({ data: { role, currentSkills: current } });
      // Append as a new "Suggested" category if not already there
      update({
        skills: [...data.skills, { category: "Suggested Skills", items: result.skills.join(", ") }],
      });
      toast.success("AI skill suggestions added!");
    } catch {
      toast.error("AI unavailable — check your API key.");
    } finally {
      setAiSkillsBusy(false);
    }
  };

  return (
    <Section title="Skills" sub="Group skills by category. Comma-separated.">
      {data.skills.map((s, i) => (
        <div key={i} className="rounded-2xl border border-border p-4">
          <div className="grid gap-3 sm:grid-cols-[200px_minmax(0,1fr)]">
            <Field label="Category" value={s.category} onChange={(v) => set(i, { category: v })} />
            <Field label="Items" value={s.items} onChange={(v) => set(i, { items: v })} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => update({ skills: data.skills.filter((_, x) => x !== i) })}
            className="mt-2 text-destructive"
          >
            <Trash2 className="mr-1.5 h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => update({ skills: [...data.skills, { category: "", items: "" }] })}
          className="rounded-xl"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add category
        </Button>
        <Button
          variant="outline"
          onClick={handleAiSkills}
          disabled={aiSkillsBusy}
          className="rounded-xl border-brand/40 text-brand hover:bg-brand-soft"
        >
          {aiSkillsBusy ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-1.5 h-4 w-4" />
          )}
          AI Suggest Skills
        </Button>
      </div>
    </Section>
  );
}

function ReviewStep({
  data,
  onPdf,
  onDocx,
  pdfBusy,
  docxBusy,
  pdfBase64,
}: {
  data: Resume["data"];
  onPdf: () => void;
  onDocx: () => void;
  pdfBusy: boolean;
  docxBusy: boolean;
  pdfBase64?: string | null;
}) {
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

/* ------------- Building blocks ------------- */

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 rounded-xl"
      />
    </div>
  );
}

function getCleanFontFamily(fontName: string) {
  if (!fontName) return "inherit";
  const name = fontName.toLowerCase();
  if (name.includes("times") || name.includes("liberationserif") || name.includes("georgia")) {
    return "Georgia, Times New Roman, serif";
  }
  if (name.includes("courier") || name.includes("mono")) {
    return "monospace";
  }
  return "Inter, Arial, sans-serif";
}

function getFontStyles(fontFamily: string) {
  const lower = fontFamily.toLowerCase();
  const styles: any = {};
  if (lower.includes("bold") || lower.includes("bd") || lower.includes("black")) {
    styles.fontWeight = "bold";
  }
  if (lower.includes("italic") || lower.includes("oblique") || lower.includes("it")) {
    styles.fontStyle = "italic";
  }
  return styles;
}

function getTextWidth(text: string, fontStr: string): number {
  if (typeof document === "undefined") return 0;
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    ctx.font = fontStr;
    return ctx.measureText(text).width;
  } catch {
    return 0;
  }
}

function PageRenderer({
  page,
  pageIdx,
  onLayoutChange,
  importedLayout,
  pdfDoc,
  zoom = 1.0,
  onConvertToNative,
}: {
  page: any;
  pageIdx: number;
  onLayoutChange?: (layout: any) => void;
  importedLayout: any;
  pdfDoc?: any;
  zoom?: number;
  onConvertToNative?: () => void;
}) {
  const [containerWidth, setContainerWidth] = React.useState(794);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [editingBlock, setEditingBlock] = React.useState<any>(null);
  const [editingText, setEditingText] = React.useState("");
  const [fontScale, setFontScale] = React.useState(1.0);
  const [widthScale, setWidthScale] = React.useState(1.0);
  const [xOffset, setXOffset] = React.useState(0);
  const [yOffset, setYOffset] = React.useState(0);
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [textColor, setTextColor] = React.useState("#000000");
  const [fontWeight, setFontWeight] = React.useState("normal");
  const [textAlign, setTextAlign] = React.useState("left");
  const [editingSnapshot, setEditingSnapshot] = React.useState<any>(null);

  const [draggingItem, setDraggingItem] = React.useState<{
    itemIdx: number;
    startX: number;
    startY: number;
    origXOffset: number;
    origYOffset: number;
  } | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let active = true;
    const render = async () => {
      try {
        const pdfPage = await pdfDoc.getPage(pageIdx + 1);
        const viewport = pdfPage.getViewport({ scale: 2.0 });
        if (!active || !canvasRef.current) return;

        const canvas = canvasRef.current;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await pdfPage.render({ canvasContext: ctx, viewport }).promise;
        }
      } catch (err) {
        console.error("PDF page render error:", err);
      }
    };
    render();
    return () => {
      active = false;
    };
  }, [pdfDoc, pageIdx]);

  const viewport = page.viewport;
  const scale = containerWidth / viewport.width;

  const updateEditingBlockProp = (propName: string, value: any) => {
    if (!editingBlock) return;

    if (propName === "text") setEditingText(value);
    else if (propName === "fontScale") setFontScale(value);
    else if (propName === "widthScale") setWidthScale(value);
    else if (propName === "xOffset") setXOffset(value);
    else if (propName === "yOffset") setYOffset(value);
    else if (propName === "bgColor") setBgColor(value);
    else if (propName === "textColor") setTextColor(value);
    else if (propName === "fontWeight") setFontWeight(value);
    else if (propName === "textAlign") setTextAlign(value);

    const nextLayout = { ...importedLayout };
    nextLayout.pages = [...nextLayout.pages];
    nextLayout.pages[pageIdx] = {
      ...nextLayout.pages[pageIdx],
      textItems: [...nextLayout.pages[pageIdx].textItems],
    };

    const currentItem = nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx];
    if (currentItem.originalText === undefined) {
      currentItem.originalText = currentItem.text;
    }
    currentItem[propName] = value;
    onLayoutChange?.(nextLayout);
  };

  const resetPosition = () => {
    setXOffset(0);
    setYOffset(0);
    const nextLayout = { ...importedLayout };
    nextLayout.pages = [...nextLayout.pages];
    nextLayout.pages[pageIdx] = {
      ...nextLayout.pages[pageIdx],
      textItems: [...nextLayout.pages[pageIdx].textItems],
    };
    const currentItem = nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx];
    currentItem.xOffset = 0;
    currentItem.yOffset = 0;
    onLayoutChange?.(nextLayout);
  };

  const resetBlock = () => {
    const origText = editingBlock.item.originalText || editingBlock.item.text;
    setEditingText(origText);
    setFontScale(1.0);
    setWidthScale(1.0);
    setXOffset(0);
    setYOffset(0);
    setBgColor("#ffffff");
    setTextColor("#000000");
    setFontWeight("normal");
    setTextAlign("left");

    const nextLayout = { ...importedLayout };
    nextLayout.pages = [...nextLayout.pages];
    nextLayout.pages[pageIdx] = {
      ...nextLayout.pages[pageIdx],
      textItems: [...nextLayout.pages[pageIdx].textItems],
    };
    nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx] = {
      ...editingBlock.item,
      text: origText,
      originalText: origText,
      fontScale: undefined,
      widthScale: undefined,
      xOffset: undefined,
      yOffset: undefined,
      bgColor: undefined,
      textColor: undefined,
      fontWeight: undefined,
      textAlign: undefined,
    };
    onLayoutChange?.(nextLayout);
  };

  // Build the warning parameters
  let isOverflowing = false;
  let computedNewWidth = 0;
  let computedBoxWidth = 0;
  let isBigEdit = false;

  if (editingBlock) {
    const cleanFont = getCleanFontFamily(editingBlock.item.fontFamily || "");
    const fontStyles = getFontStyles(editingBlock.item.fontFamily || "");
    const currentWeight = fontWeight || fontStyles.fontWeight || "normal";
    const currentStyle = fontStyles.fontStyle || "normal";
    const fontStyleStr = `${currentWeight} ${currentStyle} ${editingBlock.item.fontSize}px ${cleanFont}`;
    computedNewWidth = getTextWidth(editingText, fontStyleStr) * fontScale;
    computedBoxWidth = editingBlock.item.width * widthScale;
    isOverflowing = computedNewWidth > computedBoxWidth + 10;
    
    const origLen = (editingBlock.item.originalText || editingBlock.item.text).length;
    isBigEdit = editingText.length > origLen + 50;
  }

  return (
    <div
      ref={containerRef}
      className="pdf-page-render relative bg-white border border-border shadow-soft overflow-hidden select-text transition-all"
      style={{
        width: `${100 * zoom}%`,
        maxWidth: `${viewport.width * zoom}px`,
        aspectRatio: `${viewport.width} / ${viewport.height}`,
        position: "relative",
      }}
    >
      {pdfDoc ? (
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          style={{ display: "block" }}
        />
      ) : (
        <div className="absolute inset-0 bg-white z-0" />
      )}

      <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
        {page.textItems.map((item: any, itemIdx: number) => {
          const cleanFont = getCleanFontFamily(item.fontFamily || "");
          const fontStyles = getFontStyles(item.fontFamily || "");
          
          const isEdited = (item.originalText !== undefined && item.text !== item.originalText) ||
                           (item.xOffset !== undefined && item.xOffset !== 0) ||
                           (item.yOffset !== undefined && item.yOffset !== 0) ||
                           (item.fontScale !== undefined && item.fontScale !== 1.0) ||
                           (item.widthScale !== undefined && item.widthScale !== 1.0) ||
                           item.bgColor !== undefined ||
                           item.textColor !== undefined ||
                           item.textAlign !== undefined ||
                           item.fontWeight !== undefined;

          const currentFontScale = item.fontScale ?? 1.0;
          const currentWidthScale = item.widthScale ?? 1.0;
          const currentXOffset = item.xOffset ?? 0;
          const currentYOffset = item.yOffset ?? 0;
          const currentBgColor = item.bgColor ?? "#ffffff";
          const currentTextColor = item.textColor ?? "#000000";
          const currentWeight = item.fontWeight ?? (fontStyles.fontWeight || "normal");
          const currentAlign = item.textAlign ?? "left";

          const style: React.CSSProperties = {
            position: "absolute",
            left: `${((item.x + currentXOffset) / viewport.width) * 100}%`,
            top: `${((item.y + currentYOffset) / viewport.height) * 100}%`,
            width: `${((item.width * currentWidthScale) / viewport.width) * 100}%`,
            height: `${(item.height / viewport.height) * 100}%`,
            fontSize: `${item.fontSize * scale * currentFontScale}px`,
            fontFamily: cleanFont,
            fontWeight: currentWeight,
            fontStyle: fontStyles.fontStyle || "normal",
            textAlign: currentAlign as any,
            lineHeight: 1.15,
            whiteSpace: "pre-wrap",
            pointerEvents: "auto",
            boxSizing: "border-box",
            backgroundColor: "transparent",
            color: isEdited ? currentTextColor : "transparent",
            zIndex: 10,
          };

          return (
            <React.Fragment key={itemIdx}>
              {/* Background Patch Mask (at original coordinates) */}
              {isEdited && (
                <div
                  style={{
                    position: "absolute",
                    left: `${(item.x / viewport.width) * 100}%`,
                    top: `${(item.y / viewport.height) * 100}%`,
                    width: `${(item.width / viewport.width) * 100}%`,
                    height: `${(item.height / viewport.height) * 100}%`,
                    backgroundColor: currentBgColor,
                    pointerEvents: "none",
                    zIndex: 5,
                  }}
                />
              )}

              {/* Text Overlay element */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (onLayoutChange) {
                    if (item.originalText === undefined) {
                      item.originalText = item.text;
                    }
                    setEditingBlock({ itemIdx, item });
                    setEditingText(item.text);
                    setFontScale(item.fontScale ?? 1.0);
                    setWidthScale(item.widthScale ?? 1.0);
                    setXOffset(item.xOffset ?? 0);
                    setYOffset(item.yOffset ?? 0);
                    setBgColor(item.bgColor ?? "#ffffff");
                    setTextColor(item.textColor ?? "#000000");
                    setFontWeight(item.fontWeight ?? (fontStyles.fontWeight || "normal"));
                    setTextAlign(item.textAlign ?? "left");
                    setEditingSnapshot({ ...item });
                  }
                }}
                onPointerDown={(e) => {
                  if (!onLayoutChange) return;
                  if (e.button !== 0) return;
                  e.stopPropagation();
                  (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
                  
                  setDraggingItem({
                    itemIdx,
                    startX: e.clientX,
                    startY: e.clientY,
                    origXOffset: item.xOffset || 0,
                    origYOffset: item.yOffset || 0,
                  });
                }}
                onPointerMove={(e) => {
                  if (!draggingItem || draggingItem.itemIdx !== itemIdx) return;
                  e.stopPropagation();
                  
                  const dx = e.clientX - draggingItem.startX;
                  const dy = e.clientY - draggingItem.startY;
                  
                  const displayWidth = viewport.width * scale;
                  const displayHeight = viewport.height * scale;
                  
                  const pdfDx = (dx / displayWidth) * viewport.width;
                  const pdfDy = (dy / displayHeight) * viewport.height;
                  
                  const nextLayout = { ...importedLayout };
                  nextLayout.pages = [...nextLayout.pages];
                  nextLayout.pages[pageIdx] = {
                    ...nextLayout.pages[pageIdx],
                    textItems: [...nextLayout.pages[pageIdx].textItems],
                  };
                  
                  const currentItem = nextLayout.pages[pageIdx].textItems[itemIdx];
                  if (currentItem.originalText === undefined) {
                    currentItem.originalText = currentItem.text;
                  }
                  currentItem.xOffset = draggingItem.origXOffset + pdfDx;
                  currentItem.yOffset = draggingItem.origYOffset + pdfDy;
                  onLayoutChange?.(nextLayout);
                }}
                onPointerUp={(e) => {
                  if (draggingItem && draggingItem.itemIdx === itemIdx) {
                    e.stopPropagation();
                    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
                    setDraggingItem(null);
                  }
                }}
                style={style}
                className={cn(
                  "outline-none select-text transition-all duration-100",
                  onLayoutChange !== undefined
                    ? "hover:bg-brand/10 hover:ring-1 hover:ring-brand/40 hover:cursor-move rounded"
                    : ""
                )}
                title={onLayoutChange !== undefined ? "Drag to Move | Click to Edit" : undefined}
              >
                {isEdited ? item.text : ""}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {editingBlock && (
        <div
          className="absolute z-50 bg-card border border-border shadow-xl rounded-2xl p-4 space-y-3 flex flex-col pointer-events-auto animate-fade-in text-left text-foreground text-xs"
          style={{
            left: `${Math.min(
              containerWidth - 340,
              Math.max(10, (editingBlock.item.x + (editingBlock.item.xOffset || 0)) * scale)
            )}px`,
            top: `${Math.min(
              (viewport.height * scale) - 370,
              Math.max(10, ((editingBlock.item.y + (editingBlock.item.yOffset || 0)) + editingBlock.item.height + 4) * scale)
            )}px`,
            width: "320px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-1.5 mb-0.5">
            <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <Move className="h-3 w-3" /> Visual Editor Controls
            </span>
            <button
              className="text-brand hover:underline font-bold text-[10px]"
              onClick={resetBlock}
            >
              Reset All
            </button>
          </div>

          {/* Text Area */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
              <span>Edit Text</span>
              {editingBlock.item.originalText && editingText !== editingBlock.item.originalText && (
                <button
                  className="text-brand hover:underline"
                  onClick={() => updateEditingBlockProp("text", editingBlock.item.originalText)}
                >
                  Reset text
                </button>
              )}
            </div>
            <textarea
              className="w-full text-xs p-2.5 rounded-xl border border-border bg-background resize-none outline-none focus:ring-1 focus:ring-brand"
              rows={3}
              value={editingText}
              onChange={(e) => updateEditingBlockProp("text", e.target.value)}
              autoFocus
              placeholder="Enter replacement text..."
            />
          </div>

          {/* Sizing Controls */}
          <div className="space-y-2.5 bg-muted/30 p-2.5 rounded-xl border border-border/60">
            {/* Font Size Scale */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                <span className="font-semibold">Font Size Scale</span>
                <span className="font-mono font-bold text-brand">{Math.round(fontScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={fontScale}
                onChange={(e) => updateEditingBlockProp("fontScale", parseFloat(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-brand"
              />
            </div>

            {/* Box Width Scale */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                <span className="font-semibold">Box Width Scale</span>
                <span className="font-mono font-bold text-brand">{Math.round(widthScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={widthScale}
                onChange={(e) => updateEditingBlockProp("widthScale", parseFloat(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-brand"
              />
            </div>
          </div>

          {/* Alignment & Styles */}
          <div className="grid grid-cols-2 gap-3.5 pt-0.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground block">Alignment</span>
              <div className="flex rounded-lg border border-border p-0.5 bg-muted/50 gap-0.5">
                {(["left", "center", "right"] as const).map((align) => {
                  const Icon = align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
                  return (
                    <button
                      key={align}
                      onClick={() => updateEditingBlockProp("textAlign", align)}
                      className={cn(
                        "flex-1 py-1 rounded flex justify-center items-center hover:bg-background cursor-pointer text-muted-foreground",
                        textAlign === align && "bg-background shadow-xs text-brand"
                      )}
                      title={`Align ${align}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground block">Style Toggle</span>
              <div className="flex rounded-lg border border-border p-0.5 bg-muted/50">
                <button
                  onClick={() => updateEditingBlockProp("fontWeight", fontWeight === "bold" ? "normal" : "bold")}
                  className={cn(
                    "w-full py-1 rounded flex justify-center items-center gap-1 hover:bg-background cursor-pointer text-[10px] font-semibold text-muted-foreground",
                    fontWeight === "bold" && "bg-background shadow-xs text-brand font-bold"
                  )}
                >
                  <Bold className="h-3.5 w-3.5" /> Bold
                </button>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3.5 pt-0.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground block">Text Color</span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: "Black", val: "#000000" },
                  { name: "White", val: "#ffffff" },
                  { name: "Navy", val: "#1e3a8a" },
                ].map((c) => (
                  <button
                    key={c.val}
                    onClick={() => updateEditingBlockProp("textColor", c.val)}
                    className={cn(
                      "h-4 w-4 rounded-full border border-border/80 cursor-pointer transition-all",
                      textColor === c.val && "ring-2 ring-brand ring-offset-1"
                    )}
                    style={{ backgroundColor: c.val }}
                    title={c.name}
                  />
                ))}
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => updateEditingBlockProp("textColor", e.target.value)}
                  className="h-4 w-4 p-0 border-0 bg-transparent cursor-pointer rounded"
                  title="Custom Color"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground block">Mask Bg Color</span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: "White", val: "#ffffff" },
                  { name: "Off-white", val: "#fcfcfc" },
                  { name: "Slate", val: "#f1f5f9" },
                ].map((c) => (
                  <button
                    key={c.val}
                    onClick={() => updateEditingBlockProp("bgColor", c.val)}
                    className={cn(
                      "h-4 w-4 rounded-full border border-border/80 cursor-pointer transition-all",
                      bgColor === c.val && "ring-2 ring-brand ring-offset-1"
                    )}
                    style={{ backgroundColor: c.val }}
                    title={c.name}
                  />
                ))}
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => updateEditingBlockProp("bgColor", e.target.value)}
                  className="h-4 w-4 p-0 border-0 bg-transparent cursor-pointer rounded"
                  title="Custom Bg"
                />
              </div>
            </div>
          </div>

          {/* Nudging Controls */}
          <div className="space-y-1 pt-1 border-t border-border/60">
            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
              <span className="font-semibold">Nudge Offset</span>
              {(xOffset !== 0 || yOffset !== 0) && (
                <button className="text-[9px] hover:underline" onClick={resetPosition}>
                  Reset Position
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 bg-muted/40 p-1.5 rounded-lg border border-border/80">
              <div className="flex gap-1.5 text-[9px] font-mono font-bold text-muted-foreground">
                <span>X: {Math.round(xOffset)}px</span>
                <span>Y: {Math.round(yOffset)}px</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => {
                    const nextVal = xOffset - 2;
                    updateEditingBlockProp("xOffset", nextVal);
                  }}
                  className="h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer"
                  title="Nudge Left"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    const nextVal = yOffset - 2;
                    updateEditingBlockProp("yOffset", nextVal);
                  }}
                  className="h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer"
                  title="Nudge Up"
                >
                  ↑
                </button>
                <button
                  onClick={() => {
                    const nextVal = yOffset + 2;
                    updateEditingBlockProp("yOffset", nextVal);
                  }}
                  className="h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer"
                  title="Nudge Down"
                >
                  ↓
                </button>
                <button
                  onClick={() => {
                    const nextVal = xOffset + 2;
                    updateEditingBlockProp("xOffset", nextVal);
                  }}
                  className="h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer"
                  title="Nudge Right"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {(isOverflowing || isBigEdit) && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-2.5 rounded-xl space-y-1 bg-amber-50/20">
              <div className="font-semibold text-[10px] leading-tight text-amber-800 dark:text-amber-300">
                ⚠️ Layout Overflow Warning
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed">
                {isOverflowing && `Text width (~${Math.round(computedNewWidth)}px) exceeds box width (${Math.round(computedBoxWidth)}px). `}
                {isBigEdit && "This edit is large and may overlap nearby items."}
              </p>
              {onConvertToNative && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onConvertToNative();
                  }}
                  className="text-[9px] text-brand hover:underline font-bold text-left block cursor-pointer mt-1"
                >
                  ✨ Convert to Native for template auto-layout
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-1.5 pt-1.5 border-t border-border/60">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs rounded-lg text-muted-foreground cursor-pointer"
              onClick={() => {
                if (editingSnapshot) {
                  const nextLayout = { ...importedLayout };
                  nextLayout.pages = [...nextLayout.pages];
                  nextLayout.pages[pageIdx] = {
                    ...nextLayout.pages[pageIdx],
                    textItems: [...nextLayout.pages[pageIdx].textItems],
                  };
                  nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx] = editingSnapshot;
                  onLayoutChange?.(nextLayout);
                }
                setEditingBlock(null);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs rounded-lg bg-brand text-brand-foreground font-semibold cursor-pointer"
              onClick={() => setEditingBlock(null)}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResumePreview({
  data,
  template = "ats-professional",
  onLayoutChange,
  pdfBase64,
  onConvertToNative,
  forceTemplatePreview = false,
}: {
  data: Resume["data"];
  template?: string;
  onLayoutChange?: (layout: any) => void;
  pdfBase64?: string | null;
  onConvertToNative?: () => void;
  forceTemplatePreview?: boolean;
}) {
  const [pdfDoc, setPdfDoc] = React.useState<any>(null);
  const [pdfLoading, setPdfLoading] = React.useState(false);
  const [zoom, setZoom] = React.useState(1.0);

  React.useEffect(() => {
    if (pdfBase64) {
      setPdfLoading(true);
      const loadPdfjs = async () => {
        let pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => {
              pdfjsLib = (window as any).pdfjsLib;
              pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
              resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
          pdfjsLib = (window as any).pdfjsLib;
        }

        try {
          const bin = atob(pdfBase64);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) {
            bytes[i] = bin.charCodeAt(i);
          }
          const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
          setPdfDoc(doc);
        } catch (err) {
          console.error("Error parsing base64 PDF in preview:", err);
        } finally {
          setPdfLoading(false);
        }
      };
      loadPdfjs();
    }
  }, [pdfBase64]);

  if (!forceTemplatePreview && data.isVisualMode !== false && data.importedLayout) {
    const pages = data.importedLayout.pages || [
      {
        viewport: data.importedLayout.viewport!,
        textItems: data.importedLayout.textItems!,
      },
    ];

    if (pdfLoading) {
      return (
        <div className="w-full flex flex-col items-center justify-center p-12 bg-muted/20 border border-dashed rounded-3xl gap-2.5">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
          <span className="text-xs text-muted-foreground">Loading PDF canvas layer...</span>
        </div>
      );
    }

    return (
      <div className="w-full space-y-4">
        {/* Zoom Controls toolbar */}
        <div className="flex items-center justify-between bg-card border border-border p-3 rounded-2xl shadow-sm text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
              Visual Edit Zoom
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer"
              onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
              disabled={zoom <= 0.5}
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-mono font-bold min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer"
              onClick={() => setZoom(z => Math.min(2.0, z + 0.25))}
              disabled={zoom >= 2.0}
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          id="resume-preview-printable"
          className="w-full flex flex-col gap-6 bg-muted/30 p-4 rounded-3xl items-center select-text overflow-auto max-h-[85vh]"
        >
          {pages.map((page, pageIdx) => (
            <PageRenderer
              key={pageIdx}
              page={page}
              pageIdx={pageIdx}
              onLayoutChange={onLayoutChange}
              importedLayout={data.importedLayout!}
              pdfDoc={pdfDoc}
              zoom={zoom}
              onConvertToNative={onConvertToNative}
            />
          ))}
        </div>
      </div>
    );
  }

  const custom = data.customization || { accentColor: "", fontSize: "md", spacing: "md" };
  const accent = custom.accentColor || (template === "ats-professional"
    ? "#3b82f6"
    : template === "modern"
      ? "#f97316"
      : template === "minimal"
        ? "#1e293b"
        : template === "creative"
          ? "#d946ef"
          : "#10b981");

  const fontSize = custom.fontSize || "md";
  const spacing = custom.spacing || "md";

  const sizeClass = fontSize === "sm"
    ? { name: "text-base font-bold", body: "text-[11px] leading-snug", section: "text-[10px] font-bold tracking-wider uppercase", itemTitle: "text-[12px] font-semibold" }
    : fontSize === "lg"
      ? { name: "text-2xl font-extrabold", body: "text-[14px] leading-relaxed", section: "text-[13px] font-bold tracking-wider uppercase", itemTitle: "text-[15px] font-semibold" }
      : { name: "text-xl font-bold", body: "text-[12px] leading-normal", section: "text-[11px] font-bold tracking-wider uppercase", itemTitle: "text-[13px] font-semibold" };

  const spacingClass = spacing === "sm"
    ? { container: "p-4 space-y-3", sectionMargin: "space-y-2", itemSpacing: "space-y-1" }
    : spacing === "lg"
      ? { container: "p-8 space-y-6", sectionMargin: "space-y-5", itemSpacing: "space-y-2.5" }
      : { container: "p-6 space-y-4.5", sectionMargin: "space-y-4", itemSpacing: "space-y-2" };

  const renderSummary = () => data.summary && (
    <div className={spacingClass.itemSpacing}>
      <h2 className={sizeClass.section} style={{ color: accent }}>Summary</h2>
      <p className={sizeClass.body}>{data.summary}</p>
    </div>
  );

  const renderExperience = () => data.experience.length > 0 && (
    <div className={spacingClass.itemSpacing}>
      <h2 className={sizeClass.section} style={{ color: accent }}>Experience</h2>
      <ul className={spacingClass.itemSpacing}>
        {data.experience.map((e, idx) => (
          <li key={idx} className="space-y-0.5">
            <div className="flex flex-wrap justify-between gap-1 text-[12px]">
              <span className="font-semibold text-foreground">
                {e.role} — {e.company}
              </span>
              <span className="text-[10px] text-muted-foreground">{e.period}</span>
            </div>
            <ul className="list-disc pl-4 text-muted-foreground">
              {e.bullets.filter(Boolean).map((bullet, bIdx) => (
                <li key={bIdx} className={sizeClass.body}>{bullet}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderEducation = () => data.education.length > 0 && (
    <div className={spacingClass.itemSpacing}>
      <h2 className={sizeClass.section} style={{ color: accent }}>Education</h2>
      <ul className={spacingClass.itemSpacing}>
        {data.education.map((ed, idx) => (
          <li key={idx} className="flex flex-wrap justify-between gap-1 text-[12px]">
            <span>
              <span className="font-semibold text-foreground">{ed.degree}</span> — {ed.school}
            </span>
            <span className="text-[10px] text-muted-foreground">{ed.year}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderProjects = () => data.projects.length > 0 && (
    <div className={spacingClass.itemSpacing}>
      <h2 className={sizeClass.section} style={{ color: accent }}>Projects</h2>
      <ul className={spacingClass.itemSpacing}>
        {data.projects.map((p, idx) => (
          <li key={idx} className="space-y-0.5">
            <div className="text-[12px] font-semibold text-foreground">
              {p.name}{" "}
              <span className="font-normal text-muted-foreground">— {p.tools}</span>
            </div>
            <ul className="list-disc pl-4 text-muted-foreground">
              {p.bullets.filter(Boolean).map((bullet, bIdx) => (
                <li key={bIdx} className={sizeClass.body}>{bullet}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderSkills = () => data.skills.length > 0 && (
    <div className={spacingClass.itemSpacing}>
      <h2 className={sizeClass.section} style={{ color: accent }}>Skills</h2>
      <ul className="space-y-0.5 text-[12px]">
        {data.skills.map((s, idx) => (
          <li key={idx}>
            <span className="font-semibold text-foreground">{s.category}:</span>{" "}
            <span className="text-muted-foreground">{s.items}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  // Template 1: Two Column Layout
  if (template === "two-column") {
    return (
      <article
        id="resume-preview-printable"
        className={cn("overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft flex text-left")}
        style={{ minHeight: "297mm" }}
      >
        {/* Left Column sidebar */}
        <div
          className="w-[32%] p-5 space-y-5 flex flex-col shrink-0 border-r border-border"
          style={{ backgroundColor: `${accent}0d` }}
        >
          <div
            className="h-12 w-12 rounded-full mx-auto flex items-center justify-center text-sm font-bold animate-pulse-subtle"
            style={{
              backgroundColor: `${accent}20`,
              border: `1px solid ${accent}40`,
              color: accent,
            }}
          >
            {data.fullName
              ? data.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : "U"}
          </div>

          <div className="text-center">
            <h1 className="text-base font-extrabold leading-tight text-foreground truncate">{data.fullName}</h1>
            <p className="text-[10px] text-muted-foreground truncate">{data.experience[0]?.role || "Professional"}</p>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-2">
            <h3 className={sizeClass.section} style={{ color: accent }}>Contact</h3>
            <div className="space-y-1.5 text-[10px] text-muted-foreground break-all">
              {data.email && <div className="truncate">{data.email}</div>}
              {data.phone && <div>{data.phone}</div>}
              {data.location && <div>{data.location}</div>}
            </div>
          </div>

          {data.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className={sizeClass.section} style={{ color: accent }}>Skills</h3>
              <div className="space-y-2">
                {data.skills.map((s, i) => (
                  <div key={i} className="text-[11px]">
                    <div className="font-semibold text-foreground">{s.category}</div>
                    <div className="text-muted-foreground text-[10px] leading-tight">{s.items}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right main column */}
        <div className="flex-1 p-6 space-y-5">
          {renderSummary()}
          {renderExperience()}
          {renderProjects()}
          {renderEducation()}
        </div>
      </article>
    );
  }

  // Template 2: Modern Layout
  if (template === "modern") {
    return (
      <article
        id="resume-preview-printable"
        className={cn("overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft flex flex-col text-left")}
        style={{ minHeight: "297mm" }}
      >
        <div className="p-6 text-white space-y-1 shrink-0" style={{ background: accent }}>
          <h1 className="text-2xl font-black uppercase tracking-tight leading-tight">{data.fullName}</h1>
          <div className="text-[10px] text-white/80 flex flex-wrap gap-x-3 gap-y-1">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>• {data.phone}</span>}
            {data.location && <span>• {data.location}</span>}
          </div>
        </div>

        <div className="p-6 space-y-5 flex-1">
          {data.summary && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2 className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")} style={{ color: accent }}>Summary</h2>
              <p className={sizeClass.body}>{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2 className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")} style={{ color: accent }}>Experience</h2>
              <ul className="space-y-4">
                {data.experience.map((e, idx) => (
                  <li key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline gap-1 text-[12px]">
                      <span className="font-semibold text-foreground">{e.role} — {e.company}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{e.period}</span>
                    </div>
                    <ul className="list-disc pl-4 text-muted-foreground">
                      {e.bullets.filter(Boolean).map((b, bIdx) => (
                        <li key={bIdx} className={sizeClass.body}>{b}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.projects.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2 className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")} style={{ color: accent }}>Projects</h2>
              <ul className="space-y-3">
                {data.projects.map((p, idx) => (
                  <li key={idx} className="space-y-1">
                    <div className="text-[12px] font-semibold text-foreground">
                      {p.name} <span className="font-normal text-muted-foreground">— {p.tools}</span>
                    </div>
                    <ul className="list-disc pl-4 text-muted-foreground">
                      {p.bullets.filter(Boolean).map((b, bIdx) => (
                        <li key={bIdx} className={sizeClass.body}>{b}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.education.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2 className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")} style={{ color: accent }}>Education</h2>
              <ul className="space-y-2">
                {data.education.map((ed, idx) => (
                  <li key={idx} className="flex justify-between items-baseline gap-1 text-[12px]">
                    <span className="font-semibold text-foreground">{ed.degree} <span className="font-normal text-muted-foreground">at {ed.school}</span></span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{ed.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.skills.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2 className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")} style={{ color: accent }}>Skills</h2>
              <ul className="space-y-1 text-[12px]">
                {data.skills.map((s, idx) => (
                  <li key={idx}>
                    <span className="font-semibold text-foreground">{s.category}:</span>{" "}
                    <span className="text-muted-foreground">{s.items}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    );
  }

  // Template 3: Minimal Layout
  if (template === "minimal") {
    return (
      <article
        id="resume-preview-printable"
        className={cn("overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft text-left", spacingClass.container)}
        style={{ minHeight: "297mm" }}
      >
        <header className="border-b border-border pb-3 mb-2">
          <h1 className={cn("text-2xl font-light tracking-tight text-foreground")}>{data.fullName}</h1>
          <div className="mt-1 text-[10px] text-muted-foreground flex flex-wrap gap-3">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>• {data.phone}</span>}
            {data.location && <span>• {data.location}</span>}
          </div>
        </header>

        {data.summary && (
          <section className="space-y-1">
            <h2 className={cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider")} style={{ color: accent }}>Summary</h2>
            <p className={sizeClass.body}>{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="space-y-2">
            <h2 className={cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider")} style={{ color: accent }}>Experience</h2>
            <ul className="space-y-3">
              {data.experience.map((e, idx) => (
                <li key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline gap-1 text-[12px]">
                    <span className="font-medium text-foreground">{e.role} — {e.company}</span>
                    <span className="text-[10px] text-muted-foreground">{e.period}</span>
                  </div>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    {e.bullets.filter(Boolean).map((b, bIdx) => (
                      <li key={bIdx} className={sizeClass.body}>{b}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="space-y-2">
            <h2 className={cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider")} style={{ color: accent }}>Projects</h2>
            <ul className="space-y-2">
              {data.projects.map((p, idx) => (
                <li key={idx} className="space-y-1">
                  <div className="text-[12px] font-medium text-foreground">
                    {p.name} <span className="font-normal text-muted-foreground">— {p.tools}</span>
                  </div>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    {p.bullets.filter(Boolean).map((b, bIdx) => (
                      <li key={bIdx} className={sizeClass.body}>{b}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="space-y-2">
            <h2 className={cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider")} style={{ color: accent }}>Education</h2>
            <ul className="space-y-1">
              {data.education.map((ed, idx) => (
                <li key={idx} className="flex justify-between items-baseline gap-1 text-[12px]">
                  <span>{ed.degree} — <span className="text-muted-foreground">{ed.school}</span></span>
                  <span className="text-[10px] text-muted-foreground">{ed.year}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.skills.length > 0 && (
          <section className="space-y-2">
            <h2 className={cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider")} style={{ color: accent }}>Skills</h2>
            <ul className="space-y-0.5 text-[12px]">
              {data.skills.map((s, idx) => (
                <li key={idx}>
                  <span className="font-medium text-foreground">{s.category}:</span>{" "}
                  <span className="text-muted-foreground">{s.items}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    );
  }

  // Template 4: Creative Layout
  if (template === "creative") {
    return (
      <article
        id="resume-preview-printable"
        className={cn("overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft text-left", spacingClass.container)}
        style={{ minHeight: "297mm" }}
      >
        <header className="flex items-center gap-4 border-b border-border pb-4 mb-3">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-extrabold shrink-0"
            style={{
              backgroundColor: `${accent}20`,
              color: accent,
              border: `2px solid ${accent}`,
            }}
          >
            {data.fullName
              ? data.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : "U"}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: accent }}>{data.fullName}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{data.experience[0]?.role || "Professional"}</p>
            <div className="mt-1.5 text-[10px] text-muted-foreground flex flex-wrap gap-x-2 gap-y-0.5">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>• {data.phone}</span>}
              {data.location && <span>• {data.location}</span>}
            </div>
          </div>
        </header>

        {renderSummary()}
        {renderExperience()}
        {renderProjects()}
        {renderEducation()}
        {renderSkills()}
      </article>
    );
  }

  // Template 5: ATS Professional Layout
  return (
    <article
      id="resume-preview-printable"
      className={cn("overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft text-center", spacingClass.container)}
      style={{ minHeight: "297mm" }}
    >
      <header className="space-y-1 pb-2 border-b border-border mb-3">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{data.fullName}</h1>
        <div className="text-[10px] text-muted-foreground flex flex-wrap justify-center gap-x-3">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.location && <span>• {data.location}</span>}
        </div>
      </header>

      <div className="space-y-4 text-left">
        {renderSummary()}
        {renderExperience()}
        {renderProjects()}
        {renderEducation()}
        {renderSkills()}
      </div>
    </article>
  );
}
