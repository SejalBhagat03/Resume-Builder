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
  Palette,
  CheckCircle2,
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

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
  const [activeTab, setActiveTab] = React.useState<string>("profile");
  const [panelOpen, setPanelOpen] = React.useState<boolean>(true);
  const [zoom, setZoom] = React.useState<number>(1.0);

  const [pdfBusy, setPdfBusy] = React.useState(false);
  const [docxBusy, setDocxBusy] = React.useState(false);
  const [aiOpen, setAiOpen] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);
  // Mobile Picture-in-Picture preview minimization state
  const [pipMinimized, setPipMinimized] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mobileView, setMobileView] = React.useState<"edit" | "preview">("edit");

  React.useEffect(() => {
    if (activeTab === "review") {
      setMobileView("preview");
    } else {
      setMobileView("edit");
    }
  }, [activeTab]);

  const [customizationOpen, setCustomizationOpen] = React.useState(false);
  const [stylesFeedbackActive, setStylesFeedbackActive] = React.useState(false);
  const previewScrollContainerRef = React.useRef<HTMLDivElement>(null);

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

  // Smooth scroll and flash feedback when customization options change
  const lastCustomizationRef = React.useRef<string>("");
  const lastTemplateRef = React.useRef<string>("");

  const template = resume?.template;
  const customization = resume?.data.customization;
  const hasResume = !!resume;

  React.useEffect(() => {
    if (!hasResume) return;
    const currentCustomization = JSON.stringify(customization || {});
    const currentTemplate = template || "";

    // Skip trigger on initial load
    if (lastCustomizationRef.current === "" && lastTemplateRef.current === "") {
      lastCustomizationRef.current = currentCustomization;
      lastTemplateRef.current = currentTemplate;
      return;
    }

    if (
      lastCustomizationRef.current !== currentCustomization ||
      lastTemplateRef.current !== currentTemplate
    ) {
      lastCustomizationRef.current = currentCustomization;
      lastTemplateRef.current = currentTemplate;

      // Scroll preview panel to align with the preview canvas top offset
      const canvasContainer = document.getElementById("preview-canvas-container");
      if (canvasContainer && previewScrollContainerRef.current) {
        const topOffset = canvasContainer.offsetTop;
        previewScrollContainerRef.current.scrollTo({
          top: Math.max(0, topOffset - 12),
          behavior: "smooth",
        });
      }

      // Trigger temporary glowing border & applied indicator feedback
      setStylesFeedbackActive(true);
      const timer = setTimeout(() => setStylesFeedbackActive(false), 900);
      return () => clearTimeout(timer);
    }
  }, [template, customization, hasResume]);

  // Automatically scroll preview panel to align with active step tab
  React.useEffect(() => {
    if (loadingResume) return;

    let targetId = "";
    if (step === 0) {
      targetId = "preview-canvas-container";
    } else if (step === 1) {
      targetId = "preview-section-education";
    } else if (step === 2) {
      targetId = "preview-section-experience";
    } else if (step === 3) {
      targetId = "preview-section-projects";
    } else if (step === 4) {
      targetId = "preview-section-skills";
    } else if (step === 5) {
      targetId = "preview-canvas-container";
    }

    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement && previewScrollContainerRef.current) {
        const parentOffset = previewScrollContainerRef.current.getBoundingClientRect().top;
        const elemOffset = targetElement.getBoundingClientRect().top;
        const currentScroll = previewScrollContainerRef.current.scrollTop;
        const targetScroll = currentScroll + (elemOffset - parentOffset) - 16;

        previewScrollContainerRef.current.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: "smooth",
        });
      }
    }
  }, [step, loadingResume]);

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

  const RAIL_TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "design", label: "Design", icon: Palette },
    { id: "ai", label: "Gemini AI", icon: Sparkles },
    { id: "review", label: "Review", icon: CheckCircle2 },
  ] as const;

  const handleTabClick = (tabId: string) => {
    setMobileView("edit");
    if (activeTab === tabId) {
      setPanelOpen(!panelOpen);
    } else {
      setActiveTab(tabId);
      setPanelOpen(true);
      const stepIdx = STEPS.findIndex((s) => s.key === tabId);
      if (stepIdx >= 0) {
        setStep(stepIdx);
      } else if (tabId === "review") {
        setStep(5);
      }
    }
  };

  const changeStep = (newStep: number) => {
    setMobileView("edit");
    setStep(newStep);
    if (newStep >= 0 && newStep < 5) {
      setActiveTab(STEPS[newStep].key);
    } else if (newStep === 5) {
      setActiveTab("review");
    }
    setPanelOpen(true);
  };

  const renderDesignPanel = () => {
    return (
      <div className="space-y-5">
        <div className="text-left select-none mb-2">
          <h3 className="text-sm font-bold text-foreground">Customization Styles</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Tweak the visual layout, typography, colors, and margins.
          </p>
        </div>

        {resume.data.importedLayout && resume.data.isVisualMode !== false ? (
          <div className="rounded-xl border border-brand/20 bg-brand-soft/20 p-4 space-y-3">
            <div className="font-bold text-brand-dark text-xs flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Visual Edit Mode Active
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed text-left">
              Layout options, colors, and font sizes are locked to match your uploaded PDF exactly.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 rounded-lg text-xs font-bold bg-background hover:bg-brand-soft border-brand/35 text-brand cursor-pointer shadow-sm"
              onClick={() => {
                update({ isVisualMode: false });
                toast.info("Switched to Dynamic Template Mode.");
              }}
            >
              Switch to Dynamic Template Mode
            </Button>
          </div>
        ) : (
          <>
            <div className="text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Layout Template
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {(["ats-professional", "modern", "minimal", "creative", "two-column"] as const).map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setResume((r) => (r ? { ...r, template: t } : null));
                        saveResume({ ...resume, template: t });
                      }}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-center text-xs font-semibold capitalize transition-all cursor-pointer",
                        resume.template === t
                          ? "border-brand bg-brand-soft text-brand shadow-sm font-bold"
                          : "border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-foreground",
                      )}
                    >
                      {t.replace("-", " ")}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="h-px bg-border my-4" />

            <div className="text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Accent Color
              </h4>
              <div className="flex flex-wrap gap-2">
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
                      "flex h-7 items-center justify-center rounded-lg border px-2.5 text-[11px] font-semibold transition-all cursor-pointer",
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

            <div className="h-px bg-border my-4" />

            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Font Size
                </h4>
                <div className="flex gap-1.5">
                  {(["sm", "md", "lg"] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => updateCustomization({ fontSize: sz })}
                      className={cn(
                        "flex-1 rounded-lg border py-1.5 text-center text-xs font-semibold capitalize transition-all cursor-pointer",
                        (resume.data.customization?.fontSize ?? "md") === sz
                          ? "border-brand bg-brand-soft text-brand font-bold"
                          : "border-border bg-background text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {sz === "sm" ? "Small" : sz === "md" ? "Medium" : "Large"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Spacing
                </h4>
                <div className="flex gap-1.5">
                  {(["sm", "md", "lg"] as const).map((sp) => (
                    <button
                      key={sp}
                      onClick={() => updateCustomization({ spacing: sp })}
                      className={cn(
                        "flex-1 rounded-lg border py-1.5 text-center text-xs font-semibold capitalize transition-all cursor-pointer",
                        (resume.data.customization?.spacing ?? "md") === sp
                          ? "border-brand bg-brand-soft text-brand font-bold"
                          : "border-border bg-background text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {sp === "sm" ? "Compact" : sp === "md" ? "Normal" : "Relaxed"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderPanelContent = () => {
    if (activeTab === "profile") {
      return <ProfileStep data={resume.data} update={update} />;
    }
    if (activeTab === "education") {
      return <EducationStep data={resume.data} update={update} />;
    }
    if (activeTab === "experience") {
      return <ExperienceStep data={resume.data} update={update} />;
    }
    if (activeTab === "projects") {
      return <ProjectsStep data={resume.data} update={update} />;
    }
    if (activeTab === "skills") {
      return <SkillsStep data={resume.data} update={update} />;
    }
    if (activeTab === "design") {
      return renderDesignPanel();
    }
    if (activeTab === "ai") {
      return (
        <AiAssistantPanel
          open={false}
          onOpenChange={() => {}}
          resume={resume}
          onApply={setResume}
          inline={true}
        />
      );
    }
    if (activeTab === "review") {
      return (
        <div className="space-y-6">
          <ReviewStep
            onPdf={handleDownloadClick}
            onDocx={handleDocx}
            pdfBusy={pdfBusy}
            docxBusy={docxBusy}
          />
        </div>
      );
    }
    return null;
  };

  const showStepFooter = [
    "profile",
    "education",
    "experience",
    "projects",
    "skills",
    "review",
  ].includes(activeTab);

  return (
    <AppShell>
      <div className="flex flex-col h-screen w-screen bg-background overflow-hidden font-sans select-none">
        {/* Top Control Bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          {/* Left section: back button, document title, save status */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg shrink-0"
              title="Back to Resumes"
            >
              <Link to="/resumes">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>

            <div className="h-4 w-px bg-border shrink-0" />

            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <Input
                value={resume.title}
                onChange={(e) => setResume((r) => (r ? { ...r, title: e.target.value } : null))}
                onBlur={handleSave}
                className="h-8 w-full max-w-[140px] sm:max-w-[200px] border-transparent bg-transparent hover:bg-muted/50 focus:bg-background px-2 text-xs sm:text-sm font-bold truncate rounded-lg transition-colors"
              />
              <span className="text-[10px] text-muted-foreground hidden sm:inline-flex items-center gap-1 font-medium bg-muted px-2 py-0.5 rounded-full shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Saved
              </span>
            </div>
          </div>

          {/* Center section: Undo/Redo & Zoom controls (desktop only) */}
          <div className="hidden lg:flex items-center gap-4 bg-muted/40 border border-border px-3 py-1 rounded-xl">
            {/* Undo/Redo */}
            {resume.data.isVisualMode !== false && resume.data.importedLayout && (
              <>
                <div className="flex gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="h-3 w-px bg-border" />
              </>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                disabled={zoom <= 0.5}
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[11px] font-mono font-bold w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                onClick={() => setZoom((z) => Math.min(2.0, z + 0.1))}
                disabled={zoom >= 2.0}
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-1.5 rounded text-[10px] text-muted-foreground hover:text-foreground font-semibold"
                onClick={() => setZoom(1.0)}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Right section: AI Suggestions, Save, Export */}
          <div className="flex items-center gap-1.5">
            {/* Quick AI Toggle */}
            <Button
              onClick={() => handleTabClick("ai")}
              variant="outline"
              className={cn(
                "h-8 rounded-lg border-brand/40 px-2.5 text-xs font-bold transition-all cursor-pointer shrink-0",
                activeTab === "ai"
                  ? "bg-brand text-brand-foreground hover:bg-brand/90"
                  : "bg-brand-soft/40 text-brand hover:bg-brand-soft/70",
              )}
            >
              <Sparkles className="h-3.5 w-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Gemini AI</span>
              <span className="sm:hidden">AI</span>
            </Button>

            {/* Undo/Redo for Mobile */}
            {resume.data.isVisualMode !== false && resume.data.importedLayout && (
              <div className="flex lg:hidden gap-0.5 border-r pr-1.5 mr-0.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                >
                  <Undo className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {/* Download PDF */}
            <Button
              onClick={handleDownloadClick}
              disabled={pdfBusy}
              className="h-8 rounded-lg bg-foreground text-background hover:bg-foreground/90 font-extrabold px-3 text-xs flex items-center gap-1.5 shrink-0"
            >
              {pdfBusy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">Download</span>
            </Button>
          </div>
        </header>

        {/* Main Work Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canva Slim Rail (Desktop only) */}
          <nav className="hidden lg:flex w-16 bg-card border-r border-border flex-col items-center py-4 justify-between shrink-0 z-10">
            <div className="w-full flex flex-col items-center gap-2">
              {RAIL_TABS.map((tab) => {
                const active = activeTab === tab.id && panelOpen;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={cn(
                      "w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative group",
                      active
                        ? "bg-brand text-brand-foreground shadow-sm scale-105"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                    )}
                    title={tab.label}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="text-[9px] font-bold mt-1 tracking-tight truncate w-full px-1 scale-90 origin-center">
                      {tab.label}
                    </span>
                    {active && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-brand-foreground" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-[8px] font-extrabold tracking-widest text-muted-foreground uppercase opacity-45">
              v1.2
            </div>
          </nav>

          {/* Edit Panel (Desktop side panel, mobile full height) */}
          <div
            className={cn(
              "h-full border-border bg-card flex flex-col transition-all duration-300 relative z-0 shrink-0 shadow-sm w-full lg:border-r",
              panelOpen ? "lg:w-[380px]" : "lg:w-0 lg:overflow-hidden lg:border-r-0",
            )}
          >
            {/* Mobile View Toggle: Edit vs Preview */}
            <div className="lg:hidden flex border-b border-border p-2 bg-card justify-center shrink-0">
              <div className="grid w-full max-w-[280px] grid-cols-2 gap-1 rounded-xl bg-muted p-1">
                <button
                  onClick={() => setMobileView("edit")}
                  className={cn(
                    "rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer",
                    mobileView === "edit"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Edit Resume
                </button>
                <button
                  onClick={() => setMobileView("preview")}
                  className={cn(
                    "rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer",
                    mobileView === "preview"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Preview PDF
                </button>
              </div>
            </div>

            {/* Mobile Header Steps Strip (only if on mobile/tablet AND edit view is active) */}
            {mobileView === "edit" && (
              <div className="lg:hidden border-b border-border bg-card py-2 px-3 shrink-0">
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
                  {STEPS.map((s, i) => {
                    const done = i < step;
                    const active = i === step;
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.key}
                        onClick={() => {
                          setStep(i);
                          setActiveTab(s.key);
                          setPanelOpen(true);
                        }}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer border",
                          active
                            ? "bg-brand text-brand-foreground border-brand shadow-xs"
                            : done
                              ? "bg-brand-soft/40 text-brand border-brand-soft/50 hover:bg-brand-soft/60"
                              : "bg-muted/40 text-muted-foreground border-border hover:bg-muted",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 animate-fade-in" />
                        <span>{s.label}</span>
                        {done && !active && <Check className="h-3 w-3 stroke-3 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Panel Title (Desktop only) */}
            <div className="hidden lg:flex h-12 border-b border-border items-center justify-between px-4 shrink-0 bg-muted/15">
              <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                {RAIL_TABS.find((t) => t.id === activeTab)?.label} Settings
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                onClick={() => setPanelOpen(false)}
                title="Collapse Panel"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Panel Content (Scrollable) */}
            <div
              className={cn(
                "flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin select-text",
                mobileView === "preview" ? "hidden lg:block" : "block",
              )}
            >
              {renderPanelContent()}
            </div>

            {/* Mobile Preview Pane */}
            {mobileView === "preview" && (
              <div className="flex-1 bg-muted/20 overflow-y-auto flex flex-col items-center p-4 lg:hidden">
                {/* Mobile Preview Zoom Control Bar */}
                <div className="flex items-center gap-3 bg-card border border-border px-3 py-1 rounded-xl mb-3 shadow-xs shrink-0 select-none">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                    disabled={zoom <= 0.5}
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-xs font-mono font-bold w-10 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                    onClick={() => setZoom((z) => Math.min(2.0, z + 0.1))}
                    disabled={zoom >= 2.0}
                    title="Zoom In"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Button>
                  <div className="h-4 w-px bg-border mx-0.5" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 rounded text-[10px] text-muted-foreground hover:text-foreground font-semibold"
                    onClick={() => setZoom(1.0)}
                  >
                    Reset
                  </Button>
                </div>

                {/* Scaled Preview Sheet */}
                <div
                  className="relative overflow-hidden shadow-xl rounded-xl border border-border bg-card shrink-0"
                  style={{
                    width: `${794 * 0.44 * zoom}px`,
                    height: `${1123 * 0.44 * zoom}px`,
                  }}
                >
                  <div
                    className="absolute left-0 top-0 select-text origin-top-left"
                    style={{
                      transform: `scale(${0.44 * zoom})`,
                      width: "794px",
                      height: "1123px",
                    }}
                  >
                    <ResumePreview
                      data={resume.data}
                      template={resume.template}
                      pdfBase64={pdfBase64}
                      forceTemplatePreview={resume.data.isVisualMode === false}
                    />
                  </div>
                </div>

                {/* Download Actions (Always handy under preview) */}
                <div className="w-full max-w-xs flex flex-col gap-2 shrink-0 pb-6 mt-6">
                  <Button
                    onClick={handleDownloadClick}
                    disabled={pdfBusy}
                    className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm animate-fade-in"
                  >
                    {pdfBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download PDF
                  </Button>
                  <Button
                    onClick={handleDocx}
                    disabled={docxBusy}
                    variant="outline"
                    className="w-full h-11 rounded-xl border-border bg-card text-foreground hover:bg-muted font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm animate-fade-in"
                  >
                    {docxBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="h-4 w-4" />
                    )}
                    Export DOCX
                  </Button>
                </div>
              </div>
            )}

            {/* Step Navigation Footer (Visible if edit view is active OR if we are on desktop) */}
            {(mobileView === "edit" || activeTab === "review") && showStepFooter && (
              <div
                className={cn(
                  "border-t border-border p-4 bg-muted/10 shrink-0 flex items-center justify-between",
                  mobileView === "preview" ? "hidden lg:flex" : "flex",
                )}
              >
                <Button
                  variant="outline"
                  disabled={step === 0}
                  onClick={() => changeStep(Math.max(0, step - 1))}
                  className="h-9 rounded-lg text-xs"
                >
                  Previous
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button
                    onClick={() => {
                      saveResume(resume);
                      changeStep(step + 1);
                    }}
                    className="h-9 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-bold"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    className="h-9 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-bold"
                  >
                    Finish
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Central Workspace (Canvas) - Desktop only (or hidden on mobile, since PiP and drawer handle preview) */}
          <div className="hidden lg:flex flex-1 bg-muted/20 overflow-auto flex-col p-8 items-center relative">
            {/* Visual edit status message */}
            <div className="mb-4 bg-card/65 backdrop-blur-sm border border-border px-4 py-1.5 rounded-full shadow-xs flex items-center gap-2 text-[11px] shrink-0">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
              <span className="font-semibold text-muted-foreground">
                {resume.data.isVisualMode !== false && resume.data.importedLayout
                  ? "Visual Edit Mode: Click text items in preview to edit directly"
                  : "Template Auto-layout Mode: Active"}
              </span>
            </div>

            {/* Document Canvas Sheet container */}
            <div
              className="flex-1 flex justify-center items-start origin-top relative"
              style={{
                width: `${794 * zoom}px`,
                height: `${1123 * zoom}px`,
              }}
            >
              <div
                className="bg-card shadow-2xl border border-border select-text"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                  width: "794px",
                  minHeight: "1123px",
                }}
              >
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
          </div>
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

      {/* Slide-up Live Preview Sheet */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="h-[92vh] max-h-[92vh] flex flex-col bg-background">
          <DrawerHeader className="border-b pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <DrawerTitle className="text-base font-bold text-foreground">
                  Resume Live Preview
                </DrawerTitle>
                <DrawerDescription className="text-xs text-muted-foreground">
                  Inspect details, layout spacing, and template designs
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs font-bold">
                  Done
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Scrollable preview body */}
          <div className="flex-1 overflow-y-auto p-4 bg-muted/30 flex justify-center">
            <div className="w-full max-w-2xl bg-card rounded-xl p-2 shadow-sm">
              <ResumePreview
                data={resume.data}
                template={resume.template}
                pdfBase64={pdfBase64}
                forceTemplatePreview={resume.data.isVisualMode === false}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </AppShell>
  );
}
