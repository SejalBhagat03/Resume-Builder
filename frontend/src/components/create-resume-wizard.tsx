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
  Trash2,
  Plus,
  Mail,
  Phone,
  MapPin,
  Globe,
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useProfile, profileCompleteness, type Profile } from "@/lib/profile-store";
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
import { templateAccent } from "@/components/resume-thumb-utils";
import {
  GithubImportDialog,
  repoToProject,
  type ImportedProject,
} from "@/components/github-import-dialog";
import { toast } from "sonner";
import { LocationInput } from "@/components/ui/location-input";

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

interface ParsedTextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontName: string;
  isBold: boolean;
  isItalic: boolean;
}

interface WindowWithPdfjs {
  pdfjsLib?: {
    GlobalWorkerOptions: { workerSrc: string };
    getDocument: (args: { data: Uint8Array }) => {
      promise: Promise<{
        numPages: number;
        getPage: (pageNum: number) => Promise<{
          getViewport: (args: { scale: number }) => { width: number; height: number };
          getTextContent: () => Promise<{
            items: unknown[];
            styles: Record<string, { fontFamily?: string } | undefined>;
          }>;
        }>;
      }>;
    };
  };
}

interface ImportedLayout {
  pages: {
    viewport: { width: number; height: number };
    textItems: ParsedTextItem[];
  }[];
}

function mergeTextItems(items: ParsedTextItem[]) {
  if (items.length === 0) return [];

  // Sort items primarily by y (top to bottom) and secondarily by x (left to right)
  const sorted = [...items].sort((a, b) => {
    if (Math.abs(a.y - b.y) > 4) {
      return a.y - b.y;
    }
    return a.x - b.x;
  });

  const merged: ParsedTextItem[] = [];
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

async function parsePdfLayout(file: File) {
  let pdfjsLib = (window as unknown as WindowWithPdfjs).pdfjsLib;
  if (!pdfjsLib) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        pdfjsLib = (window as unknown as WindowWithPdfjs).pdfjsLib;
        if (pdfjsLib) {
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        resolve();
      };
      script.onerror = () => reject(new Error("Failed to load PDF worker script."));
      document.head.appendChild(script);
    });
    pdfjsLib = (window as unknown as WindowWithPdfjs).pdfjsLib;
  }

  const arrayBuffer = await file.arrayBuffer();
  if (!pdfjsLib) {
    throw new Error("PDFJS library failed to load");
  }
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;

  const pages = [];
  let combinedText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent();

    const textItems = textContent.items.map((item: unknown) => {
      const typedItem = item as {
        str?: string;
        fontName?: string;
        width?: number;
        height?: number;
        transform?: number[];
      };
      const style = typedItem.fontName ? textContent.styles[typedItem.fontName] : undefined;
      const fontFamily = style?.fontFamily || "";
      const fontName = typedItem.fontName || "";

      const isBold =
        fontName.toLowerCase().includes("bold") || fontFamily.toLowerCase().includes("bold");
      const isItalic =
        fontName.toLowerCase().includes("italic") ||
        fontName.toLowerCase().includes("oblique") ||
        fontFamily.toLowerCase().includes("italic") ||
        fontFamily.toLowerCase().includes("oblique");

      const x = typedItem.transform?.[4] ?? 0;
      const y = viewport.height - (typedItem.transform?.[5] ?? 0) - (typedItem.height || 0);

      return {
        text: typedItem.str || "",
        x,
        y,
        width: typedItem.width ?? 0,
        height:
          typedItem.height || Math.abs(typedItem.transform?.[0] || typedItem.transform?.[3] || 12),
        fontSize: Math.abs(typedItem.transform?.[0] || typedItem.transform?.[3] || 12),
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

  return {
    importedLayout: { pages },
    rawText: combinedText,
  };
}

const sourceOptions = [
  {
    id: "import",
    title: "Import Resume",
    sub: "Upload a PDF, DOCX or TXT to auto-fill fields.",
    icon: FileUp,
  },
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
    id: "github",
    title: "Import from GitHub",
    sub: "Pull projects from your public repositories.",
    icon: Github,
  },
];

const DEMO_RESUME = {
  id: "demo",
  title: "Demo",
  profileType: "experienced" as ProfileType,
  template: "ats-professional" as TemplateId,
  updatedAt: Date.now(),
  downloads: 0,
  atsScore: 95,
  data: {
    fullName: "Alex Rivera",
    email: "alex@rivera.dev",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    summary:
      "Senior Software Engineer with 5+ years of experience leading cross-functional teams to design and build scalable, secure cloud-native web applications using TypeScript and AWS.",
    website: "rivera.dev",
    linkedin: "linkedin.com/in/alexrivera",
    github: "github.com/alexrivera",
    education: [
      {
        degree: "B.S. in Computer Science",
        school: "Stanford University",
        year: "2016 – 2020",
        cgpa: "3.8",
      },
    ],
    experience: [
      {
        role: "Senior Software Engineer",
        company: "TechCorp Inc.",
        period: "2022 – Present",
        bullets: [
          "Designed microservices architecture processing 50k requests per second.",
          "Led development of a React portal that improved user engagement by 40%.",
        ],
      },
    ],
    projects: [
      {
        name: "CloudScale Engine",
        tools: "Go, Kubernetes, AWS",
        bullets: ["Built a container scaling tool saving $12k monthly in infrastructure cost."],
      },
    ],
    skills: [
      { category: "Languages", items: "TypeScript, JavaScript, Go, Python" },
      { category: "Frameworks", items: "React, Node.js, Next.js, Express" },
    ],
    certifications: ["AWS Solutions Architect Associate"],
    languages: ["English (Native)", "Spanish (Conversational)"],
    achievements: ["Hackathon Winner 2024"],
  },
};

export function CreateResumeWizard({
  open,
  onOpenChange,
  defaultSource,
  defaultStep,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  defaultSource?: string;
  defaultStep?: number;
}) {
  const [profileData, updateProfile] = useProfile();
  const [step, setStep] = React.useState(1);
  const [profile, setProfile] = React.useState<ProfileType>("fresh");
  const [source, setSource] = React.useState("blank");
  const [fullscreenPreview, setFullscreenPreview] = React.useState(false);

  // Quick profile edit states
  const [isEditingProfileInline, setIsEditingProfileInline] = React.useState(false);
  const [profileTab, setProfileTab] = React.useState<
    "personal" | "experience" | "projects" | "education-skills"
  >("personal");
  const profileBannerRef = React.useRef<HTMLDivElement>(null);

  const setProfileField = React.useCallback(
    <K extends keyof Profile>(key: K, value: Profile[K]) => {
      updateProfile((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [updateProfile],
  );

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
  const [parsedData, setParsedData] = React.useState<{
    fullName: string;
    email: string;
    phone: string;
    summary: string;
  } | null>(null);

  const previewData = React.useMemo(() => {
    const base = { ...DEMO_RESUME.data };
    if (source === "profile" && profileData.fullName) {
      return dataFromProfile(profileData, {
        include,
        pickedExperienceIdx: expOrder,
        pickedProjectIdx: projectOrder,
      });
    } else if (source === "import" && parsedData) {
      return {
        ...base,
        fullName: parsedData.fullName || base.fullName,
        email: parsedData.email || base.email,
        phone: parsedData.phone || base.phone,
        summary: parsedData.summary || base.summary,
      };
    } else if (profileData.fullName) {
      return dataFromProfile(profileData, {
        include: {
          summary: true,
          experience: true,
          projects: true,
          education: true,
          skills: true,
        },
      });
    }
    return base;
  }, [source, profileData, include, expOrder, projectOrder, parsedData]);
  const [template, setTemplate] = React.useState<TemplateId>("ats-professional");
  const [title, setTitle] = React.useState("");
  const [importedFileName, setImportedFileName] = React.useState<string>("");
  const [importedText, setImportedText] = React.useState<string>("");
  const [parseBusy, setParseBusy] = React.useState(false);
  const [ghUsername, setGhUsername] = React.useState("");
  const [ghProjects, setGhProjects] = React.useState<ImportedProject[]>([]);
  const [ghOpen, setGhOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [importedLayout, setImportedLayout] = React.useState<ImportedLayout | null>(null);
  const [pdfBase64Data, setPdfBase64Data] = React.useState<string | null>(null);

  const navigate = useNavigate();

  // Initialize reordering lists and source defaults when open changes
  React.useEffect(() => {
    if (open) {
      setIsEditingProfileInline(false);
      setProfileTab("personal");
      setStep(defaultStep ?? 1);
      setProfile("fresh");
      // If profile has a name, default to pulling from profile. Else, default to blank.
      setSource(defaultSource ?? (profileData.fullName ? "profile" : "blank"));
      setTemplate("ats-professional");
      setTitle("");
      setImportedFileName("");
      setImportedText("");
      setParsedData(null);
      setGhUsername("");
      setGhProjects([]);
      setSelectedFile(null);
      setImportedLayout(null);
      setPdfBase64Data(null);
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
  }, [
    open,
    profileData.fullName,
    profileData.projects,
    profileData.experience,
    defaultStep,
    defaultSource,
  ]);

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

  const handleCreate = async () => {
    const finalTitle =
      title.trim() ||
      (source === "profile" && profileData.title ? `${profileData.title} Resume` : "") ||
      `${profileOptions.find((p) => p.id === profile)?.title} Resume`;
    const r = createResume({ title: finalTitle, profileType: profile, template });

    // Apply imports or profile synchronization
    if (source === "profile") {
      r.data = dataFromProfile(profileData, {
        include,
        pickedExperienceIdx: expOrder,
        pickedProjectIdx: projectOrder,
      });
      saveResume(r);
    } else if (source === "import") {
      if (parsedData) {
        if (parsedData.fullName) r.data.fullName = parsedData.fullName;
        if (parsedData.email) r.data.email = parsedData.email;
        if (parsedData.phone) r.data.phone = parsedData.phone;
        if (parsedData.summary) r.data.summary = parsedData.summary;
      }

      if (selectedFile) {
        r.data.isVisualMode = true;
        r.data.triggerAiImport = true;
        r.data.importedPdf = {
          pageCount: importedLayout?.pages?.length || 1,
          uploadedAt: new Date().toISOString(),
          originalFilename: selectedFile.name,
        };

        if (importedLayout) {
          r.data.importedLayout = importedLayout;
          r.data.rawText = importedText;
        }

        // Save locally in IndexedDB if PDF base64 is set
        if (pdfBase64Data) {
          const { storePdfBinary } = await import("@/lib/pdf-store");
          await storePdfBinary(r.id, pdfBase64Data);
        }

        // Backup upload to backend (non-blocking)
        try {
          const { apiClient } = await import("@/lib/apiClient");
          apiClient
            .upload(`/upload/pdf?resumeId=${r.id}`, selectedFile)
            .then((res: unknown) => {
              const uploadResult = res as { storagePath?: string } | null | undefined;
              if (uploadResult?.storagePath && r.data.importedPdf) {
                r.data.importedPdf.storagePath = uploadResult.storagePath;
                saveResume(r);
              }
            })
            .catch((uploadErr) => {
              console.warn("Backend upload failed (non-critical):", uploadErr);
            });
        } catch (apiClientErr) {
          console.warn("Could not import apiClient dynamically:", apiClientErr);
        }
      } else if (importedText) {
        r.data.summary = importedText.slice(0, 500);
      }
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
    setSelectedFile(file);
    setImportedFileName(file.name);
    setParsedData(null);
    setImportedLayout(null);
    setPdfBase64Data(null);
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
        setPdfBase64Data(base64);

        const { importedLayout: layout, rawText } = await parsePdfLayout(file);
        setImportedLayout(layout);
        setImportedText(rawText);

        const result = await parseResumeFile({ data: { base64, filename: file.name } });
        setParsedData({
          fullName: result.fullName || "",
          email: result.email || "",
          phone: result.phone || "",
          summary: result.summary || "",
        });
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
        <DialogContent className="w-[calc(100%-1.5rem)] sm:w-full max-w-lg sm:max-w-4xl gap-0 overflow-hidden rounded-2xl sm:rounded-3xl border-border p-0">
          <DialogHeader className="space-y-0.5 px-3 sm:px-7 pt-3 sm:pt-7">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="grid h-8 w-8 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl sm:rounded-2xl bg-brand-soft text-brand">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base sm:text-xl font-bold">
                  Create New Resume
                </DialogTitle>
                <DialogDescription className="text-[10px] sm:text-xs text-muted-foreground">
                  Build a professional resume in 3 simple steps
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Stepper step={step} />

          <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto px-3 sm:px-7 pb-3 sm:pb-6 bg-background/50">
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

            {step === 2 &&
              (isEditingProfileInline ? (
                <section className="animate-fade-in space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditingProfileInline(false)}
                        className="h-8 w-8 rounded-lg"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">Quick Edit Profile</h3>
                        <p className="text-[10px] text-muted-foreground">
                          Updates save directly to your Career Profile
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-xs font-bold text-brand bg-brand-soft px-2 py-0.5 rounded-full">
                        {profileCompleteness(profileData)}% Complete
                      </span>
                    </div>
                  </div>

                  {/* Tabs Selector */}
                  <div className="flex border-b border-border/60 overflow-x-auto scrollbar-none gap-2 pb-2">
                    {(
                      [
                        { id: "personal", label: "Personal" },
                        { id: "experience", label: "Experience" },
                        { id: "projects", label: "Projects" },
                        { id: "education-skills", label: "Edu & Skills" },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setProfileTab(t.id)}
                        className={cn(
                          "whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border",
                          profileTab === t.id
                            ? "bg-brand text-brand-foreground border-brand"
                            : "bg-muted/40 hover:bg-muted text-muted-foreground border-transparent",
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Form Content */}
                  <div className="space-y-4">
                    {profileTab === "personal" && (
                      <div className="space-y-3">
                        <div className="grid gap-3 grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="quick-fullname" className="text-xs font-semibold">
                              Full Name
                            </Label>
                            <Input
                              id="quick-fullname"
                              value={profileData.fullName}
                              onChange={(e) => setProfileField("fullName", e.target.value)}
                              placeholder="e.g. Jane Doe"
                              className="h-9 text-xs rounded-lg"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="quick-title" className="text-xs font-semibold">
                              Headline / Title
                            </Label>
                            <Input
                              id="quick-title"
                              value={profileData.title}
                              onChange={(e) => setProfileField("title", e.target.value)}
                              placeholder="e.g. Software Engineer"
                              className="h-9 text-xs rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="quick-email" className="text-xs font-semibold">
                              Email
                            </Label>
                            <Input
                              id="quick-email"
                              value={profileData.email}
                              onChange={(e) => setProfileField("email", e.target.value)}
                              placeholder="e.g. jane@example.com"
                              className="h-9 text-xs rounded-lg"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="quick-phone" className="text-xs font-semibold">
                              Phone
                            </Label>
                            <Input
                              id="quick-phone"
                              value={profileData.phone}
                              onChange={(e) => setProfileField("phone", e.target.value)}
                              placeholder="e.g. +1 234 567 890"
                              className="h-9 text-xs rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="quick-location" className="text-xs font-semibold">
                            Location
                          </Label>
                          <LocationInput
                            id="quick-location"
                            value={profileData.location}
                            onChange={(v) => setProfileField("location", v)}
                            placeholder="e.g. New York, NY"
                            className="h-9 text-xs rounded-lg"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="quick-summary" className="text-xs font-semibold">
                            Professional Summary
                          </Label>
                          <Textarea
                            id="quick-summary"
                            value={profileData.summary}
                            onChange={(e) => setProfileField("summary", e.target.value)}
                            placeholder="Brief description of your skills and career highlights..."
                            rows={3}
                            className="text-xs rounded-lg resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {profileTab === "experience" && (
                      <div className="space-y-3">
                        {profileData.experience.map((exp, idx) => (
                          <div
                            key={idx}
                            className="relative p-3 border border-border/80 rounded-xl bg-muted/10 space-y-2.5"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newExp = profileData.experience.filter((_, i) => i !== idx);
                                setProfileField("experience", newExp);
                                setExpOrder(newExp.map((_, i) => i));
                              }}
                              className="absolute right-2 top-2 h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>

                            <div className="grid gap-3 grid-cols-2 pr-6">
                              <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground">
                                  Role / Title
                                </Label>
                                <Input
                                  value={exp.role}
                                  onChange={(e) => {
                                    const updated = profileData.experience.map((x, i) =>
                                      i === idx ? { ...x, role: e.target.value } : x,
                                    );
                                    setProfileField("experience", updated);
                                  }}
                                  placeholder="e.g. React Developer"
                                  className="h-8 text-xs rounded-lg"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground">
                                  Company
                                </Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => {
                                    const updated = profileData.experience.map((x, i) =>
                                      i === idx ? { ...x, company: e.target.value } : x,
                                    );
                                    setProfileField("experience", updated);
                                  }}
                                  placeholder="e.g. Google"
                                  className="h-8 text-xs rounded-lg"
                                />
                              </div>
                            </div>

                            <div className="grid gap-3 grid-cols-2">
                              <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground">
                                  Period
                                </Label>
                                <Input
                                  value={exp.period}
                                  onChange={(e) => {
                                    const updated = profileData.experience.map((x, i) =>
                                      i === idx ? { ...x, period: e.target.value } : x,
                                    );
                                    setProfileField("experience", updated);
                                  }}
                                  placeholder="e.g. 2023 - Present"
                                  className="h-8 text-xs rounded-lg"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-[10px] font-semibold text-muted-foreground">
                                Bullet points (one per line)
                              </Label>
                              <Textarea
                                value={exp.bullets.join("\n")}
                                onChange={(e) => {
                                  const updated = profileData.experience.map((x, i) =>
                                    i === idx ? { ...x, bullets: e.target.value.split("\n") } : x,
                                  );
                                  setProfileField("experience", updated);
                                }}
                                placeholder="Describe achievements..."
                                rows={2}
                                className="text-xs rounded-lg resize-none"
                              />
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const newExp = [
                              ...profileData.experience,
                              { role: "", company: "", period: "", bullets: [""] },
                            ];
                            setProfileField("experience", newExp);
                            setExpOrder(newExp.map((_, i) => i));
                          }}
                          className="w-full h-9 rounded-xl text-xs font-semibold border-dashed"
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" /> Add Experience
                        </Button>
                      </div>
                    )}

                    {profileTab === "projects" && (
                      <div className="space-y-3">
                        {profileData.projects.map((proj, idx) => (
                          <div
                            key={idx}
                            className="relative p-3 border border-border/80 rounded-xl bg-muted/10 space-y-2.5"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newProj = profileData.projects.filter((_, i) => i !== idx);
                                setProfileField("projects", newProj);
                                setProjectOrder(newProj.map((_, i) => i));
                              }}
                              className="absolute right-2 top-2 h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>

                            <div className="grid gap-3 grid-cols-2 pr-6">
                              <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground">
                                  Project Name
                                </Label>
                                <Input
                                  value={proj.name}
                                  onChange={(e) => {
                                    const updated = profileData.projects.map((x, i) =>
                                      i === idx ? { ...x, name: e.target.value } : x,
                                    );
                                    setProfileField("projects", updated);
                                  }}
                                  placeholder="e.g. Portfolio"
                                  className="h-8 text-xs rounded-lg"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground">
                                  Tools / Stack
                                </Label>
                                <Input
                                  value={proj.tools}
                                  onChange={(e) => {
                                    const updated = profileData.projects.map((x, i) =>
                                      i === idx ? { ...x, tools: e.target.value } : x,
                                    );
                                    setProfileField("projects", updated);
                                  }}
                                  placeholder="e.g. React, Tailwind"
                                  className="h-8 text-xs rounded-lg"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-[10px] font-semibold text-muted-foreground">
                                Bullet points (one per line)
                              </Label>
                              <Textarea
                                value={proj.bullets.join("\n")}
                                onChange={(e) => {
                                  const updated = profileData.projects.map((x, i) =>
                                    i === idx ? { ...x, bullets: e.target.value.split("\n") } : x,
                                  );
                                  setProfileField("projects", updated);
                                }}
                                placeholder="Describe project details..."
                                rows={2}
                                className="text-xs rounded-lg resize-none"
                              />
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const newProj = [
                              ...profileData.projects,
                              { name: "", tools: "", bullets: [""] },
                            ];
                            setProfileField("projects", newProj);
                            setProjectOrder(newProj.map((_, i) => i));
                          }}
                          className="w-full h-9 rounded-xl text-xs font-semibold border-dashed"
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" /> Add Project
                        </Button>
                      </div>
                    )}

                    {profileTab === "education-skills" && (
                      <div className="space-y-4">
                        {/* Education */}
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-foreground">Education</Label>
                          <div className="space-y-3">
                            {profileData.education.map((ed, idx) => (
                              <div
                                key={idx}
                                className="relative p-3 border border-border/80 rounded-xl bg-muted/10 space-y-2.5"
                              >
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setProfileField(
                                      "education",
                                      profileData.education.filter((_, i) => i !== idx),
                                    );
                                  }}
                                  className="absolute right-2 top-2 h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>

                                <div className="grid gap-3 grid-cols-2 pr-6">
                                  <div className="space-y-1">
                                    <Label className="text-[10px] font-semibold text-muted-foreground">
                                      Degree
                                    </Label>
                                    <Input
                                      value={ed.degree}
                                      onChange={(e) => {
                                        const updated = profileData.education.map((x, i) =>
                                          i === idx ? { ...x, degree: e.target.value } : x,
                                        );
                                        setProfileField("education", updated);
                                      }}
                                      placeholder="e.g. BS Computer Science"
                                      className="h-8 text-xs rounded-lg"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[10px] font-semibold text-muted-foreground">
                                      Institution
                                    </Label>
                                    <Input
                                      value={ed.school}
                                      onChange={(e) => {
                                        const updated = profileData.education.map((x, i) =>
                                          i === idx ? { ...x, school: e.target.value } : x,
                                        );
                                        setProfileField("education", updated);
                                      }}
                                      placeholder="e.g. MIT"
                                      className="h-8 text-xs rounded-lg"
                                    />
                                  </div>
                                </div>

                                <div className="grid gap-3 grid-cols-2">
                                  <div className="space-y-1">
                                    <Label className="text-[10px] font-semibold text-muted-foreground">
                                      Period
                                    </Label>
                                    <Input
                                      value={ed.year}
                                      onChange={(e) => {
                                        const updated = profileData.education.map((x, i) =>
                                          i === idx ? { ...x, year: e.target.value } : x,
                                        );
                                        setProfileField("education", updated);
                                      }}
                                      placeholder="e.g. 2019 - 2023"
                                      className="h-8 text-xs rounded-lg"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[10px] font-semibold text-muted-foreground">
                                      CGPA / Grade
                                    </Label>
                                    <Input
                                      value={ed.cgpa ?? ""}
                                      onChange={(e) => {
                                        const updated = profileData.education.map((x, i) =>
                                          i === idx ? { ...x, cgpa: e.target.value } : x,
                                        );
                                        setProfileField("education", updated);
                                      }}
                                      placeholder="e.g. 3.8/4.0"
                                      className="h-8 text-xs rounded-lg"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setProfileField("education", [
                                  ...profileData.education,
                                  { degree: "", school: "", year: "", cgpa: "" },
                                ]);
                              }}
                              className="w-full h-8 rounded-xl text-[11px] font-semibold border-dashed"
                            >
                              <Plus className="mr-1 h-3 w-3" /> Add Education
                            </Button>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="space-y-2 pt-3 border-t border-border/40">
                          <Label className="text-xs font-bold text-foreground">Skills</Label>
                          <div className="space-y-3">
                            {profileData.skills.map((s, idx) => (
                              <div
                                key={idx}
                                className="relative p-3 border border-border/80 rounded-xl bg-muted/10 space-y-2.5"
                              >
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setProfileField(
                                      "skills",
                                      profileData.skills.filter((_, i) => i !== idx),
                                    );
                                  }}
                                  className="absolute right-2 top-2 h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>

                                <div className="grid gap-3 grid-cols-[120px_1fr] pr-6">
                                  <div className="space-y-1">
                                    <Label className="text-[10px] font-semibold text-muted-foreground">
                                      Category
                                    </Label>
                                    <Input
                                      value={s.category}
                                      onChange={(e) => {
                                        const updated = profileData.skills.map((x, i) =>
                                          i === idx ? { ...x, category: e.target.value } : x,
                                        );
                                        setProfileField("skills", updated);
                                      }}
                                      placeholder="e.g. Frontend"
                                      className="h-8 text-xs rounded-lg"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[10px] font-semibold text-muted-foreground">
                                      Items (comma separated)
                                    </Label>
                                    <Input
                                      value={s.items}
                                      onChange={(e) => {
                                        const updated = profileData.skills.map((x, i) =>
                                          i === idx ? { ...x, items: e.target.value } : x,
                                        );
                                        setProfileField("skills", updated);
                                      }}
                                      placeholder="e.g. React, Vue, HTML"
                                      className="h-8 text-xs rounded-lg"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setProfileField("skills", [
                                  ...profileData.skills,
                                  { category: "", items: "" },
                                ]);
                              }}
                              className="w-full h-8 rounded-xl text-[11px] font-semibold border-dashed"
                            >
                              <Plus className="mr-1 h-3 w-3" /> Add Skill Category
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 flex justify-end gap-2 border-t border-border/60">
                    <Button
                      type="button"
                      onClick={() => setIsEditingProfileInline(false)}
                      className="h-9 px-4 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-bold"
                    >
                      Save & Return
                    </Button>
                  </div>
                </section>
              ) : (
                <section className="animate-fade-in space-y-4">
                  <StepHeader
                    index={2}
                    title="Where should we start from?"
                    sub="Pick a starting source for your resume content."
                  />

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {sourceOptions.map((opt) => {
                      const profileEmpty = opt.id === "profile" && !profileData.fullName;
                      return (
                        <SelectCard
                          key={opt.id}
                          active={source === opt.id}
                          onClick={() => {
                            if (profileEmpty) {
                              toast.info("Tip: fill in your Profile for better auto-fill results.");
                            }
                            setSource(opt.id);
                            if (opt.id === "profile") {
                              setTimeout(() => {
                                profileBannerRef.current?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "nearest",
                                });
                              }, 80);
                            }
                          }}
                          icon={opt.icon}
                          title={opt.title}
                          sub={opt.sub}
                        />
                      );
                    })}
                  </div>

                  {source === "import" && (
                    <div className="mt-5 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-5">
                      <Label className="text-sm font-semibold">Upload your resume</Label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Accepts PDF, DOCX, TXT, or images (PNG, JPEG, WebP) (≤ 15MB). Fields are
                        extracted automatically.
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp"
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
                    <div
                      ref={profileBannerRef}
                      className="mt-4 rounded-2xl border border-brand bg-brand-soft/10 p-4 animate-fade-in"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <Sparkles className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-brand">
                              Career Profile Connected
                            </div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                              {profileData.fullName
                                ? `Pulling details for ${profileData.fullName} (${profileCompleteness(profileData)}% complete)`
                                : "Your Career Profile is empty. Fill it to auto-generate your resume!"}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingProfileInline(true)}
                          className="h-8 rounded-lg border-brand/35 bg-card hover:bg-brand-soft/30 text-brand text-xs font-bold shrink-0 self-start sm:self-center"
                        >
                          <Pencil className="mr-1 h-3 w-3" />
                          {profileData.fullName ? "Quick Edit Details" : "Quick Set Up"}
                        </Button>
                      </div>
                    </div>
                  )}
                </section>
              ))}

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

                    {/* Right Panel: Template selector — premium design */}
                    <div className="md:col-span-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Choose Layout Template
                        </Label>
                        <span className="text-[10px] text-muted-foreground">
                          {TEMPLATES.length} templates
                        </span>
                      </div>
                      <div className="grid gap-3 grid-cols-2 max-h-[220px] sm:max-h-[400px] overflow-y-auto pr-1 pb-6">
                        {TEMPLATES.map((t) => {
                          const isSelected = template === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setTemplate(t.id)}
                              className={cn(
                                "flex flex-col rounded-2xl border-2 p-2.5 text-left transition-all bg-card cursor-pointer group relative overflow-hidden",
                                isSelected
                                  ? "border-brand shadow-[0_0_0_3px] shadow-brand/20 bg-brand-soft/20"
                                  : "border-border hover:border-brand/50 hover:shadow-md",
                              )}
                            >
                              {/* Thumbnail with live preview data */}
                              <div className="w-full overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-[1.03]">
                                <ResumeThumb
                                  accent={templateAccent(t.id)}
                                  templateId={t.id}
                                  demoData={previewData}
                                />
                              </div>

                              {/* Selected badge */}
                              {isSelected && (
                                <div className="absolute top-3 right-3 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-foreground shadow">
                                  <Check className="h-3 w-3" />
                                </div>
                              )}

                              {/* Name & tagline */}
                              <div className="mt-2 px-0.5">
                                <div
                                  className={cn(
                                    "text-[12px] font-extrabold tracking-tight transition-colors",
                                    isSelected ? "text-brand" : "group-hover:text-brand",
                                  )}
                                >
                                  {t.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight truncate">
                                  {t.tagline}
                                </div>
                              </div>

                              {/* Tag badges */}
                              <div className="mt-1.5 flex flex-wrap gap-1 px-0.5">
                                {t.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className={cn(
                                      "inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none",
                                      tag === "ATS Friendly"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : tag === "Best for Freshers"
                                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                          : tag === "Popular"
                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                            : "bg-muted text-muted-foreground",
                                    )}
                                  >
                                    {tag}
                                  </span>
                                ))}
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
                      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                        {TEMPLATES.map((t) => {
                          const isSelected = template === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setTemplate(t.id)}
                              className={cn(
                                "relative flex flex-col rounded-2xl border-2 bg-card p-3 text-left transition-all cursor-pointer group overflow-hidden",
                                isSelected
                                  ? "border-brand shadow-[0_0_0_3px] shadow-brand/20 bg-brand-soft/20"
                                  : "border-border hover:border-brand/50 hover:shadow-md",
                              )}
                            >
                              {/* Thumbnail with live preview data */}
                              <div className="w-full overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-[1.03]">
                                <ResumeThumb
                                  accent={templateAccent(t.id)}
                                  templateId={t.id}
                                  demoData={previewData}
                                />
                              </div>

                              {/* Selected badge */}
                              {isSelected && (
                                <div className="absolute top-3 right-3 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-foreground shadow">
                                  <Check className="h-3 w-3" />
                                </div>
                              )}

                              {/* Name & tagline */}
                              <div className="mt-2.5 px-0.5">
                                <div
                                  className={cn(
                                    "text-[13px] font-extrabold tracking-tight transition-colors",
                                    isSelected ? "text-brand" : "group-hover:text-brand",
                                  )}
                                >
                                  {t.name}
                                </div>
                                <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                                  {t.tagline}
                                </div>
                              </div>

                              {/* Tag badges */}
                              <div className="mt-2 flex flex-wrap gap-1 px-0.5">
                                {t.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className={cn(
                                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none",
                                      tag === "ATS Friendly"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : tag === "Best for Freshers"
                                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                          : tag === "Popular"
                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                            : "bg-muted text-muted-foreground",
                                    )}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </button>
                          );
                        })}
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

          {!isEditingProfileInline && (
            <footer className="flex items-center justify-between border-t border-border bg-card px-3 sm:px-6 py-2 sm:py-4 shrink-0">
              <div className="hidden sm:block">
                {step === 3 && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                    <Sparkles className="h-4 w-4 text-brand" />
                    <span>AI suggestions live in the editor!</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                {step === 1 ? (
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="h-9 sm:h-11 rounded-xl px-3 sm:px-5 text-sm font-bold cursor-pointer bg-card"
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={back}
                    className="h-9 sm:h-11 rounded-xl px-3 sm:px-5 text-sm font-bold cursor-pointer bg-card"
                  >
                    <ArrowLeft className="mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" /> Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    onClick={next}
                    className="h-9 sm:h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 px-4 sm:px-5 text-sm font-bold cursor-pointer"
                  >
                    Next <ArrowRight className="ml-1 h-3.5 w-3.5 sm:ml-1.5 sm:h-4 sm:w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleCreate}
                    className="h-9 sm:h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 px-4 sm:px-6 text-sm font-bold cursor-pointer"
                  >
                    Create Resume
                  </Button>
                )}
              </div>
            </footer>
          )}
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

function Stepper({ step }: { step: number }) {
  const labels = ["Profile Type", "Source / Import", "Theme & Finish"];
  const mobileLabels = ["Profile", "Source", "Finish"];
  return (
    <div className="px-3 sm:px-7 py-2 sm:py-6 shrink-0">
      <div className="flex items-center">
        {labels.map((label, i) => {
          const idx = i + 1;
          const done = idx < step;
          const active = idx === step;
          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1.5 min-w-[70px] sm:min-w-0">
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
                    "text-[10px] sm:text-xs font-medium text-center whitespace-normal leading-tight max-w-[80px] sm:max-w-none mt-0.5",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{mobileLabels[i]}</span>
                </span>
              </div>
              {idx < labels.length && (
                <div
                  className={cn(
                    "mx-1 sm:mx-2 h-0.5 flex-1 rounded-full",
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
    <div className="flex items-start gap-2 sm:gap-3">
      <div className="grid h-7 w-7 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground text-[10px] sm:text-xs font-bold">
        {index}
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-bold leading-tight">
          Step {index}: {title}
        </h3>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{sub}</p>
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
        "group relative flex flex-row sm:flex-col items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border-2 bg-card p-2.5 sm:p-4 text-left sm:text-center transition-all cursor-pointer min-h-0 sm:min-h-[155px] justify-start sm:justify-center w-full",
        active
          ? "border-brand bg-brand-soft/40 shadow-soft"
          : "border-border hover:border-brand/40 hover:bg-muted/40",
        disabled && "opacity-45 cursor-not-allowed hover:border-border hover:bg-card",
      )}
    >
      {active && (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 sm:top-2.5 sm:translate-y-0 sm:right-2.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-foreground shrink-0 shadow-sm">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
      <span
        className={cn(
          "grid h-8 w-8 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition-colors",
          disabled && "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-4 w-4 sm:h-5.5 sm:w-5.5" />
      </span>
      <div className="flex-1 min-w-0 pr-6 sm:pr-0">
        <div className="text-xs font-bold leading-tight">{title}</div>
        <div className="mt-0.5 sm:mt-1.5 text-[10px] text-muted-foreground leading-normal">
          {sub}
        </div>
      </div>
    </button>
  );
}
