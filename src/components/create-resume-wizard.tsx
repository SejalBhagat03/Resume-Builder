import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  GraduationCap,
  Briefcase,
  Rocket,
  BookOpen,
  Pencil,
  Check,
  ArrowRight,
  ArrowLeft,
  FileUp,
  Github,
  FileText,
  ArrowUp,
  ArrowDown,
  User,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/profile-store";
import {
  createResume,
  saveResume,
  TEMPLATES,
  dataFromProfile,
  type ProfileType,
  type TemplateId,
  type SectionKey,
} from "@/lib/resume-store";
import { ResumeThumb } from "@/components/resume-thumb";
import {
  GithubImportDialog,
  repoToProject,
  type ImportedProject,
} from "@/components/github-import-dialog";
import { toast } from "sonner";

const profileOptions: {
  id: ProfileType;
  title: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "fresh",
    title: "Fresh Graduate",
    sub: "Entry-level positions and new graduates",
    icon: GraduationCap,
  },
  {
    id: "experienced",
    title: "Experienced Professional",
    sub: "For professionals with work experience",
    icon: Briefcase,
  },
  {
    id: "internship",
    title: "Internship Resume",
    sub: "Internships and student positions",
    icon: Rocket,
  },
  {
    id: "academic",
    title: "Academic Resume",
    sub: "For academic, research and faculty roles",
    icon: BookOpen,
  },
  { id: "custom", title: "Custom", sub: "Build a resume from scratch", icon: Pencil },
];

const sourceOptions = [
  {
    id: "profile",
    title: "Pull from Profile",
    sub: "Auto-fill using your master career profile.",
    icon: User,
  },
  {
    id: "blank",
    title: "Start Empty",
    sub: "Begin with a clean slate and add as you go.",
    icon: FileText,
  },
  {
    id: "import",
    title: "Import Existing Resume",
    sub: "Upload a PDF, DOCX or TXT to auto-fill fields.",
    icon: FileUp,
  },
  {
    id: "github",
    title: "Import from GitHub",
    sub: "Pull projects from your public repositories.",
    icon: Github,
  },
];

export function CreateResumeWizard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [profileData] = useProfile();
  const [step, setStep] = React.useState(1);
  const [profile, setProfile] = React.useState<ProfileType>("fresh");
  const [source, setSource] = React.useState("blank");
  const [template, setTemplate] = React.useState<TemplateId>("ats-professional");
  const [title, setTitle] = React.useState("");
  const [importedFileName, setImportedFileName] = React.useState<string>("");
  const [importedText, setImportedText] = React.useState<string>("");
  const [parsedData, setParsedData] = React.useState<{
    fullName: string;
    email: string;
    phone: string;
    summary: string;
  } | null>(null);
  const [parseBusy, setParseBusy] = React.useState(false);
  const [ghUsername, setGhUsername] = React.useState("");
  const [ghProjects, setGhProjects] = React.useState<ImportedProject[]>([]);
  const [ghOpen, setGhOpen] = React.useState(false);

  // Profile-specific wizard states
  const [include, setInclude] = React.useState<Record<SectionKey, boolean>>({
    summary: true,
    experience: true,
    projects: true,
    education: true,
    skills: true,
  });
  const [projectOrder, setProjectOrder] = React.useState<number[]>([]);
  const [expOrder, setExpOrder] = React.useState<number[]>([]);

  const navigate = useNavigate();

  // Initialize reordering lists and source defaults when open changes
  React.useEffect(() => {
    if (open) {
      setStep(1);
      setProfile("fresh");
      // If profile has a name, default to pulling from profile. Else, default to blank.
      setSource(profileData.fullName ? "profile" : "blank");
      setTemplate("ats-professional");
      setTitle("");
      setImportedFileName("");
      setImportedText("");
      setParsedData(null);
      setGhUsername("");
      setGhProjects([]);
      setInclude({
        summary: true,
        experience: true,
        projects: true,
        education: true,
        skills: true,
      });
      setProjectOrder(profileData.projects.map((_, i) => i));
      setExpOrder(profileData.experience.map((_, i) => i));
    }
  }, [open, profileData.fullName, profileData.projects, profileData.experience]);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  // Reordering helpers
  const moveExp = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= expOrder.length) return;
    const nextList = [...expOrder];
    [nextList[idx], nextList[target]] = [nextList[target], nextList[idx]];
    setExpOrder(nextList);
  };

  const moveProj = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= projectOrder.length) return;
    const nextList = [...projectOrder];
    [nextList[idx], nextList[target]] = [nextList[target], nextList[idx]];
    setProjectOrder(nextList);
  };

  const handleCreate = () => {
    const finalTitle =
      title.trim() || `${profileOptions.find((p) => p.id === profile)?.title} Resume`;
    const r = createResume({ title: finalTitle, profileType: profile, template });

    // Apply imports or profile synchronization
    if (source === "profile") {
      r.data = dataFromProfile(profileData, {
        include,
        pickedExperienceIdx: expOrder,
        pickedProjectIdx: projectOrder,
      });
      saveResume(r);
    } else if (source === "import" && parsedData) {
      if (parsedData.fullName) r.data.fullName = parsedData.fullName;
      if (parsedData.email) r.data.email = parsedData.email;
      if (parsedData.phone) r.data.phone = parsedData.phone;
      if (parsedData.summary) r.data.summary = parsedData.summary;
      saveResume(r);
    } else if (source === "import" && importedText) {
      r.data.summary = importedText.slice(0, 500);
      saveResume(r);
    } else if (source === "github" && ghProjects.length > 0) {
      r.data.projects = ghProjects;
      saveResume(r);
    }

    onOpenChange(false);
    navigate({ to: "/editor/$id", params: { id: r.id } });
  };

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setImportedFileName(file.name);
    setParsedData(null);
    setParseBusy(true);
    try {
      if (file.name.toLowerCase().endsWith(".txt")) {
        const text = await file.text();
        setImportedText(text);
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const lines = text
          .split(/\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        const nameLine = lines.find(
          (l) => l.length > 2 && l.length < 60 && !l.includes("@") && !l.includes("http"),
        );
        setParsedData({
          fullName: nameLine ?? "",
          email: emailMatch?.[0] ?? "",
          phone: "",
          summary: text.slice(0, 300),
        });
        toast.success(`Parsed ${file.name} — fields pre-filled!`);
      } else if (file.name.toLowerCase().endsWith(".pdf")) {
        const { parseResumeFile } = await import("@/lib/parse.functions");
        const base64 = await fileToBase64(file);
        const result = await parseResumeFile({ data: { base64, filename: file.name } });
        setParsedData(result);
        setImportedText(result.rawText);
        toast.success(`PDF parsed — ${result.fullName || "fields"} pre-filled!`);
      } else {
        toast.info(`${file.name} attached. Fields will be editable in the editor.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not parse file — you can fill fields manually in the editor.");
    } finally {
      setParseBusy(false);
    }
  };

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl gap-0 overflow-hidden rounded-3xl border-border p-0">
          <DialogHeader className="space-y-1 px-7 pt-7">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-xl font-bold">Create New Resume</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Build a professional resume in 3 simple steps
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Stepper step={step} />

          <div className="max-h-[60vh] overflow-y-auto px-7 pb-6 bg-background/50">
            {step === 1 && (
              <section className="animate-fade-in space-y-4">
                <StepHeader
                  index={1}
                  title="What are you creating?"
                  sub="Select the profile type that best describes you."
                />
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {profileOptions.map((opt) => (
                    <SelectCard
                      key={opt.id}
                      active={profile === opt.id}
                      onClick={() => setProfile(opt.id)}
                      icon={opt.icon}
                      title={opt.title}
                      sub={opt.sub}
                    />
                  ))}
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="animate-fade-in space-y-4">
                <StepHeader
                  index={2}
                  title="Where should we start from?"
                  sub="Pick a starting source for your resume content."
                />
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {sourceOptions.map((opt) => {
                    // Disable Profile pull if profile name doesn't exist
                    const isProfileDisabled = opt.id === "profile" && !profileData.fullName;
                    return (
                      <SelectCard
                        key={opt.id}
                        active={source === opt.id}
                        onClick={() => {
                          if (isProfileDisabled) {
                            toast.info("Please fill in your Profile first to pull from it.");
                            return;
                          }
                          setSource(opt.id);
                        }}
                        icon={opt.icon}
                        title={opt.title}
                        sub={opt.sub}
                        disabled={isProfileDisabled}
                      />
                    );
                  })}
                </div>

                {source === "import" && (
                  <div className="mt-5 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-5">
                    <Label className="text-sm font-semibold">Upload your resume</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Accepts PDF, DOCX, or TXT (≤ 5MB). PDF & TXT fields are extracted
                      automatically.
                    </p>
                    <Input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                      className="mt-3 h-11 cursor-pointer rounded-xl bg-card"
                    />
                    {parseBusy && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-brand font-semibold">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        Scanning and parsing your resume…
                      </div>
                    )}
                    {!parseBusy && parsedData && (
                      <div className="mt-3 rounded-xl border border-brand/30 bg-brand-soft/30 p-3">
                        <div className="text-xs font-bold text-brand">
                          ✓ Fields extracted from {importedFileName}
                        </div>
                        <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                          {parsedData.fullName && <div>Name: {parsedData.fullName}</div>}
                          {parsedData.email && <div>Email: {parsedData.email}</div>}
                          {parsedData.phone && <div>Phone: {parsedData.phone}</div>}
                        </div>
                      </div>
                    )}
                    {!parseBusy && !parsedData && importedFileName && (
                      <div className="mt-2 text-xs text-brand font-semibold">
                        ✓ {importedFileName} attached
                      </div>
                    )}
                  </div>
                )}

                {source === "github" && (
                  <div className="mt-5 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-5">
                    <Label className="text-sm font-semibold">Connect your GitHub</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Enter your GitHub username — we'll list your public repos so you can pick
                      which ones become resume projects.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Input
                        value={ghUsername}
                        onChange={(e) => setGhUsername(e.target.value)}
                        placeholder="GitHub username"
                        className="h-11 rounded-xl"
                      />
                      <Button
                        type="button"
                        onClick={() => setGhOpen(true)}
                        disabled={!ghUsername.trim()}
                        className="h-11 shrink-0 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold"
                      >
                        <Github className="mr-1.5 h-4 w-4" /> Browse repos
                      </Button>
                    </div>
                    {ghProjects.length > 0 && (
                      <div className="mt-2 text-xs text-brand font-semibold font-mono">
                        ✓ {ghProjects.length} repo{ghProjects.length === 1 ? "" : "s"} selected
                      </div>
                    )}
                  </div>
                )}

                {source === "profile" && (
                  <div className="mt-5 rounded-2xl border border-brand bg-brand-soft/20 p-4 flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-brand" />
                    <div className="text-xs text-brand font-semibold">
                      Your master profile details will be auto-synced! You can configure checkboxes
                      and item orders in the next step.
                    </div>
                  </div>
                )}
              </section>
            )}

            {step === 3 && (
              <section className="animate-fade-in">
                {source === "profile" ? (
                  /* Double Column Layout when pulling from profile */
                  <div className="grid gap-6 md:grid-cols-12">
                    {/* Left Panel: Sections to include, and order selectors */}
                    <div className="md:col-span-7 space-y-5">
                      <StepHeader
                        index={3}
                        title="Configure profile options"
                        sub="Choose which sections and the layout ordering to pull."
                      />

                      <div className="space-y-2">
                        <Label htmlFor="title">Resume title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Master Profile Resume"
                          className="h-11 rounded-xl bg-card"
                        />
                      </div>

                      {/* Sections checklist */}
                      <div className="space-y-2.5 p-4 border border-border rounded-2xl bg-card">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Sections to include
                        </div>
                        <ul className="grid gap-2 grid-cols-2">
                          {[
                            {
                              key: "summary" as SectionKey,
                              label: "Summary",
                              desc: "Professional summary",
                            },
                            {
                              key: "experience" as SectionKey,
                              label: "Experience",
                              desc: "Jobs & Internships",
                            },
                            {
                              key: "projects" as SectionKey,
                              label: "Projects",
                              desc: "Side projects",
                            },
                            {
                              key: "education" as SectionKey,
                              label: "Education",
                              desc: "College & Degrees",
                            },
                            {
                              key: "skills" as SectionKey,
                              label: "Skills",
                              desc: "Skill categorizations",
                            },
                          ].map((s) => (
                            <li key={s.key}>
                              <label
                                className={cn(
                                  "flex items-start gap-2.5 rounded-xl border p-2.5 cursor-pointer transition-all",
                                  include[s.key]
                                    ? "border-brand bg-brand-soft/20"
                                    : "border-border bg-background/50",
                                )}
                              >
                                <Checkbox
                                  checked={include[s.key]}
                                  onCheckedChange={(v) =>
                                    setInclude((prev) => ({ ...prev, [s.key]: Boolean(v) }))
                                  }
                                  className="mt-0.5"
                                />
                                <div>
                                  <div className="text-[11.5px] font-bold leading-none">
                                    {s.label}
                                  </div>
                                  <div className="text-[9.5px] text-muted-foreground mt-1 leading-tight">
                                    {s.desc}
                                  </div>
                                </div>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Experience Reordering */}
                      {include.experience && profileData.experience.length > 1 && (
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Experience Order
                          </Label>
                          <ul className="space-y-1.5 max-h-[140px] overflow-y-auto">
                            {expOrder.map((origIdx, i) => (
                              <li
                                key={origIdx}
                                className="flex items-center justify-between gap-2 border border-border bg-card rounded-xl px-3 py-1.5"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-soft text-[10px] font-bold text-brand shrink-0">
                                    {i + 1}
                                  </span>
                                  <span className="text-[11.5px] font-medium truncate">
                                    {profileData.experience[origIdx].role} at{" "}
                                    {profileData.experience[origIdx].company}
                                  </span>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6.5 w-6.5 rounded-md"
                                    disabled={i === 0}
                                    onClick={() => moveExp(i, -1)}
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6.5 w-6.5 rounded-md"
                                    disabled={i === expOrder.length - 1}
                                    onClick={() => moveExp(i, 1)}
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Project Reordering */}
                      {include.projects && profileData.projects.length > 1 && (
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Project Order
                          </Label>
                          <ul className="space-y-1.5 max-h-[140px] overflow-y-auto">
                            {projectOrder.map((origIdx, i) => (
                              <li
                                key={origIdx}
                                className="flex items-center justify-between gap-2 border border-border bg-card rounded-xl px-3 py-1.5"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-soft text-[10px] font-bold text-brand shrink-0">
                                    {i + 1}
                                  </span>
                                  <span className="text-[11.5px] font-medium truncate">
                                    {profileData.projects[origIdx].name}
                                  </span>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6.5 w-6.5 rounded-md"
                                    disabled={i === 0}
                                    onClick={() => moveProj(i, -1)}
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6.5 w-6.5 rounded-md"
                                    disabled={i === projectOrder.length - 1}
                                    onClick={() => moveProj(i, 1)}
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right Panel: Template selector */}
                    <div className="md:col-span-5 space-y-4">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Choose Layout Template
                      </Label>
                      <div className="grid gap-3.5 grid-cols-2 max-h-[360px] overflow-y-auto pr-1">
                        {TEMPLATES.map((t) => {
                          const isSelected = template === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setTemplate(t.id)}
                              className={cn(
                                "flex flex-col gap-2 rounded-2xl border-2 p-3 text-left transition-all bg-card cursor-pointer group",
                                isSelected
                                  ? "border-brand bg-brand-soft/30 ring-1 ring-brand"
                                  : "border-border hover:border-brand/40",
                              )}
                            >
                              <div className="w-full aspect-4/5 bg-muted/65 rounded-lg border border-border p-2 space-y-1.5 flex flex-col justify-start relative overflow-hidden group-hover:bg-muted/40 transition-colors">
                                {t.id === "ats-professional" && (
                                  <div className="space-y-1 w-full flex-1">
                                    <div className="h-2 w-1/3 bg-foreground/45 rounded-sm mx-auto" />
                                    <div className="h-1 w-1/2 bg-muted-foreground/30 rounded-sm mx-auto" />
                                    <div className="h-1.5 w-full bg-muted-foreground/25 rounded-sm mt-2" />
                                    <div className="space-y-1 mt-3">
                                      <div className="h-1 w-1/4 bg-foreground/40 rounded-sm" />
                                      <div className="h-1.5 w-full bg-muted-foreground/20 rounded-sm" />
                                    </div>
                                  </div>
                                )}
                                {t.id === "modern" && (
                                  <div className="space-y-1 w-full flex-1 flex flex-col">
                                    <div className="h-4.5 bg-brand rounded-sm flex items-center px-1.5 -mx-2 -mt-2 mb-1 shrink-0">
                                      <div className="h-1 w-1/4 bg-white/70 rounded-sm" />
                                    </div>
                                    <div className="h-1.5 w-3/4 bg-muted-foreground/30 rounded-sm mt-1" />
                                    <div className="space-y-1 mt-3">
                                      <div className="h-1 w-1/4 bg-foreground/40 rounded-sm border-l-2 border-brand pl-0.5" />
                                      <div className="h-1.5 w-[90%] bg-muted-foreground/20 rounded-sm" />
                                    </div>
                                  </div>
                                )}
                                {t.id === "minimal" && (
                                  <div className="space-y-1 w-full flex-1 mt-1">
                                    <div className="h-2.5 w-1/4 bg-foreground/50 rounded-sm" />
                                    <div className="h-0.5 bg-border my-2" />
                                    <div className="h-1 w-[90%] bg-muted-foreground/20 rounded-sm mt-2" />
                                  </div>
                                )}
                                {t.id === "creative" && (
                                  <div className="space-y-1 w-full flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <div className="h-6 w-6 rounded-full bg-brand-soft border border-brand/20 shrink-0" />
                                      <div className="space-y-0.5 flex-1">
                                        <div className="h-1.5 w-1/2 bg-foreground/45 rounded-sm" />
                                      </div>
                                    </div>
                                    <div className="h-0.5 bg-brand/35 my-2" />
                                    <div className="h-1 w-full bg-muted-foreground/20 rounded-sm" />
                                  </div>
                                )}
                                {t.id === "two-column" && (
                                  <div className="w-full flex-1 flex gap-2 -mx-2 -my-2">
                                    <div className="w-[30%] bg-brand-soft/45 border-r border-border p-1 space-y-1.5">
                                      <div className="h-4.5 w-4.5 rounded-full bg-brand/30 mx-auto" />
                                      <div className="h-1 w-2/3 bg-foreground/35 rounded-sm mx-auto" />
                                    </div>
                                    <div className="flex-1 p-1 space-y-1.5">
                                      <div className="h-2 w-1/3 bg-foreground/45 rounded-sm" />
                                      <div className="h-1 w-5/6 bg-muted-foreground/20 rounded-sm" />
                                    </div>
                                  </div>
                                )}
                                {isSelected && (
                                  <div className="absolute top-2.5 right-2.5 grid h-4.5 w-4.5 place-items-center rounded-full bg-brand text-brand-foreground shadow-sm">
                                    <Check className="h-3 w-3" />
                                  </div>
                                )}
                              </div>
                              <div className="mt-1">
                                <div className="text-[12px] font-extrabold tracking-tight group-hover:text-brand transition-colors">
                                  {t.name}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Finish Layout (Non-profile) */
                  <div className="space-y-4">
                    <StepHeader
                      index={3}
                      title={
                        source === "import" || source === "github"
                          ? "Name & finish"
                          : "Theme & finish"
                      }
                      sub={
                        source === "import" || source === "github"
                          ? "Give your resume a title."
                          : "Name your resume and choose a starting template."
                      }
                    />

                    <div className="space-y-2">
                      <Label htmlFor="title">Resume title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Fresh Graduate Resume"
                        className="h-11 rounded-xl bg-card"
                      />
                    </div>

                    {source !== "import" && source !== "github" && (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                        {TEMPLATES.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setTemplate(t.id)}
                            className={cn(
                              "rounded-2xl border-2 bg-card p-4 text-left transition-all",
                              template === t.id
                                ? "border-brand bg-brand-soft/40 shadow-soft"
                                : "border-border hover:border-brand/40",
                            )}
                          >
                            <ResumeThumb accent={templateAccent(t.id)} templateId={t.id} />
                            <div className="mt-3 text-sm font-semibold">{t.name}</div>
                            <div className="text-xs text-muted-foreground">{t.tagline}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {(source === "import" || source === "github") && (
                      <div className="flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand-soft/30 p-4">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
                          <FileUp className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-foreground">
                            {source === "github"
                              ? "GitHub projects imported"
                              : "Resume file attached"}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {source === "import"
                              ? importedFileName
                                ? `"${importedFileName}" will be used to pre-fill your resume. You can choose a layout theme later inside the editor.`
                                : "You can choose a theme inside the editor after creation."
                              : `${ghProjects.length} repo${ghProjects.length === 1 ? "" : "s"} imported.`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}
          </div>

          <footer className="flex items-center justify-between border-t border-border bg-card px-6 py-4 shrink-0">
            <div>
              {step === 3 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                  <Sparkles className="h-4 w-4 text-brand" />
                  <span>AI suggestions live in the editor!</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {step === 1 ? (
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="h-11 rounded-xl px-5 font-bold cursor-pointer bg-card"
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={back}
                  className="h-11 rounded-xl px-5 font-bold cursor-pointer bg-card"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  onClick={next}
                  className="h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 px-5 font-bold cursor-pointer"
                >
                  Next <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleCreate}
                  className="h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 px-6 font-bold cursor-pointer"
                >
                  Create Resume
                </Button>
              )}
            </div>
          </footer>
        </DialogContent>
      </Dialog>
      <GithubImportDialog
        open={ghOpen}
        onOpenChange={setGhOpen}
        initialUsername={ghUsername}
        onImport={(projects) => setGhProjects(projects)}
      />
    </>
  );
}

function templateAccent(id: TemplateId): string {
  switch (id) {
    case "ats-professional":
      return "oklch(0.45 0.12 250)";
    case "modern":
      return "oklch(0.55 0.18 30)";
    case "minimal":
      return "oklch(0.35 0.02 60)";
    case "creative":
      return "oklch(0.55 0.2 320)";
    case "two-column":
      return "oklch(0.45 0.15 160)";
  }
}

function Stepper({ step }: { step: number }) {
  const labels = ["Profile Type", "Source / Import", "Theme & Finish"];
  return (
    <div className="px-7 py-6 shrink-0">
      <div className="flex items-center">
        {labels.map((label, i) => {
          const idx = i + 1;
          const done = idx < step;
          const active = idx === step;
          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition-colors",
                    done && "bg-brand text-brand-foreground",
                    active && "bg-brand text-brand-foreground ring-4 ring-brand-soft",
                    !done && !active && "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : idx}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
              {idx < labels.length && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 rounded-full",
                    idx < step ? "bg-brand" : "bg-border",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function StepHeader({ index, title, sub }: { index: number; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground text-xs font-bold">
        {index}
      </div>
      <div>
        <h3 className="text-base font-bold leading-tight">
          Step {index}: {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function SelectCard({
  active,
  onClick,
  icon: Icon,
  title,
  sub,
  disabled = false,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-2xl border-2 bg-card p-4 text-center transition-all cursor-pointer min-h-[155px] justify-center",
        active
          ? "border-brand bg-brand-soft/40 shadow-soft"
          : "border-border hover:border-brand/40 hover:bg-muted/40",
        disabled && "opacity-45 cursor-not-allowed hover:border-border hover:bg-card",
      )}
    >
      {active && (
        <span className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-foreground">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
      <span
        className={cn(
          "grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand transition-colors",
          disabled && "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-5.5 w-5.5" />
      </span>
      <div>
        <div className="text-xs font-bold leading-tight truncate max-w-[130px]">{title}</div>
        <div className="mt-1.5 text-[10px] text-muted-foreground leading-normal max-h-[42px] overflow-hidden">
          {sub}
        </div>
      </div>
    </button>
  );
}
