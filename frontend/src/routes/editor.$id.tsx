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
import { AiAssistantPanel } from "@/components/ai-assistant-panel";
import { ReviewBeforeExportDialog } from "@/components/review-before-export";
import { supabase } from "@/integrations/supabase/client";
import { getPdfBinary, storePdfBinary } from "@/lib/pdf-store";
import { apiClient } from "@/lib/apiClient";
import { ProfileStep } from "@/components/editor/profile-step";
import { EducationStep } from "@/components/editor/education-step";
import { ExperienceStep } from "@/components/editor/experience-step";
import { ProjectsStep } from "@/components/editor/projects-step";
import { SkillsStep } from "@/components/editor/skills-step";
import { AdditionalStep } from "@/components/editor/additional-step";
import { ReviewStep } from "@/components/editor/review-step";
import { ResumePreview } from "@/components/editor/resume-preview";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          const { data, error } = await supabase.from("resumes").select("*").eq("id", id).single();

          if (!error && data) {
            const mapped: Resume = {
              id: data.id,
              title: data.title,
              profileType: data.profile_type as Resume["profileType"],
              template: data.template as Resume["template"],
              updatedAt: new Date(data.updated_at).getTime(),
              downloads: data.downloads,
              atsScore: data.ats_score,
              data: data.data as unknown as Resume["data"],
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
    setResume((r) => (r ? { ...r, data: { ...r.data, ...patch } } : null));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (
      !confirm(
        "✨ Convert to Native Resume Builder?\n\nThis will use AI to scan your original resume text and fully populate all forms on the left so you can use our dynamic templates. Your original visual edit layout will remain fully available if you wish to switch back.",
      )
    ) {
      return;
    }
    toast.loading("AI is parsing and structuring your resume...", { id: "conv" });
    try {
      const { parseResumeStructure } = await import("@/lib/ai.functions");
      const textToParse =
        resume.data.rawText ||
        resume.data.importedLayout?.pages
          ?.flatMap((p) => p.textItems.map((i) => i.text))
          .join(" ") ||
        "";

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
                onChange={(e) => setResume((r) => (r ? { ...r, title: e.target.value } : null))}
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
                        {resume.data.isVisualMode !== false
                          ? "Visual Edit Mode Active"
                          : "Template Mode Active"}
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
                            ✅ Your Profile, Education, Experience, Projects, and Skills are
                            auto-filled on the left — use the form tabs to edit any section
                            directly, or click on the preview to make visual edits.
                          </span>
                          <strong className="block mt-1 text-amber-700 dark:text-amber-500">
                            ⚠️ Visual Edit Mode is optimized for minor text updates. Use "Convert to
                            Native" for extensive restructuring.
                          </strong>
                        </>
                      ) : (
                        <>
                          You are currently using one of our built-in templates. Your original
                          imported visual layout is preserved.
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
                    Layout options, colors, and font sizes are locked to match your uploaded PDF
                    exactly.
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
                      {(
                        ["ats-professional", "modern", "minimal", "creative", "two-column"] as const
                      ).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setResume((r) => (r ? { ...r, template: t } : null));
                            saveResume({ ...resume, template: t });
                          }}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-center text-xs font-semibold capitalize transition-all",
                            resume.template === t
                              ? "border-brand bg-brand-soft text-brand shadow-sm"
                              : "border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-foreground",
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
                              : "border-border bg-background text-muted-foreground hover:bg-muted",
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
                                : "border-border bg-background text-muted-foreground hover:bg-muted",
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
                                : "border-border bg-background text-muted-foreground hover:bg-muted",
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
                            : "text-muted-foreground hover:text-foreground",
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
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        title="Template Preview — shows all form edits live"
                      >
                        ✨ Template
                      </button>
                    </div>
                  ) : (
                    resume.data.isVisualMode !== false &&
                    resume.data.importedLayout && (
                      <span className="text-[10px] text-brand bg-brand-soft px-2 py-0.5 rounded-full font-bold">
                        ✏️ Click to Edit Text
                      </span>
                    )
                  )}
                </div>
                {previewTab === "template" && resume.data.importedLayout && (
                  <div className="mb-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    ✅ Showing live form data — all your edits (projects, experience, etc.) appear
                    here
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
