import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Wrench,
  Award,
  Languages,
  Trophy,
  Plus,
  Trash2,
  Save,
  Sparkles,
  ArrowRight,
  Upload,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useProfile, profileCompleteness, type Profile } from "@/lib/profile-store";
import { RoleRecommendations } from "@/components/role-recommendations";
import { generateSummary } from "@/lib/ai-mock";
import { GithubImportDialog, type ImportedProject } from "@/components/github-import-dialog";
import { parseResumeFile } from "@/lib/parse.functions";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Resume Builder Pro" },
      {
        name: "description",
        content:
          "Your single career profile — personal info, experience, projects, skills, and more. Reuse it across every resume.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [profile, updateProfile] = useProfile();
  const completeness = profileCompleteness(profile);
  const [parsing, setParsing] = React.useState(false);
  const [ghOpen, setGhOpen] = React.useState(false);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    updateProfile((p) => ({ ...p, [key]: value }));

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result?.toString().split(",")[1];
      if (!base64) {
        toast.error("Failed to read file.");
        setParsing(false);
        return;
      }

      try {
        const result = await parseResumeFile({ data: { base64, filename: file.name } });

        updateProfile((p) => ({
          ...p,
          fullName: result.fullName || p.fullName,
          email: result.email || p.email,
          phone: result.phone || p.phone,
          summary: result.summary || p.summary,
        }));
        toast.success("Successfully parsed resume and populated your details!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse resume file.");
      } finally {
        setParsing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGithubImport = (importedProjects: ImportedProject[]) => {
    set("projects", [
      ...profile.projects,
      ...importedProjects.map((p) => ({
        name: p.name,
        tools: p.tools,
        bullets: p.bullets,
      })),
    ]);
  };

  const linkedinHelper =
    !profile.linkedin && profile.fullName ? (
      <a
        href={`https://www.google.com/search?q=site:linkedin.com/in/+%22${encodeURIComponent(profile.fullName.trim())}%22`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-brand hover:underline font-semibold inline-flex items-center gap-1 bg-brand-soft/40 px-2 py-0.5 rounded-md mt-1"
        title="Google search your name on LinkedIn to easily copy your profile link"
      >
        🔍 Find my LinkedIn URL
      </a>
    ) : null;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Your Profile</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Fill this once — every resume you build reuses this information. Update it any time.
            </p>
          </div>
          <Button
            onClick={() => toast.success("Profile saved")}
            className="h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Save className="mr-1.5 h-4 w-4" /> Save Profile
          </Button>
        </header>

        {/* Completeness */}
        <Card className="mt-6 rounded-2xl border-border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">Profile completeness</div>
              <div className="text-xs text-muted-foreground">
                Fuller profile = better AI suggestions and stronger resumes.
              </div>
            </div>
            <div className="text-2xl font-extrabold text-brand">{completeness}%</div>
          </div>
          <Progress value={completeness} className="mt-3 h-2" />
        </Card>

        {/* Bootstrap Profile / Resume Parser */}
        <Card className="mt-6 rounded-2xl border-dashed border-2 border-brand/40 bg-brand-soft/20 p-5 flex flex-col items-center justify-center text-center">
          <Upload className="h-8 w-8 text-brand animate-pulse" />
          <div className="mt-2 text-sm font-semibold">Want to bootstrap your profile?</div>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Upload your old resume (PDF, TXT, or DOCX) to automatically pre-fill details like your
            name, email, phone, and professional summary.
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <label className="h-10 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 px-4 inline-flex items-center justify-center text-sm font-semibold cursor-pointer transition-colors">
              Select Resume File
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                className="hidden"
                onChange={handleResumeUpload}
                disabled={parsing}
              />
            </label>
            {parsing && <Loader2 className="h-5 w-5 animate-spin text-brand" />}
          </div>
        </Card>

        {/* Role recommendations - signature feature */}
        {completeness >= 40 && (
          <div className="mt-6">
            <RoleRecommendations profile={profile} />
          </div>
        )}

        {/* Personal */}
        <SectionCard icon={User} title="Personal details">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldRow label="Full name">
              <Input
                value={profile.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                className="h-11 rounded-xl"
              />
            </FieldRow>
            <FieldRow label="Headline / Title">
              <Input
                value={profile.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="h-11 rounded-xl"
              />
            </FieldRow>
          </div>
          <div className="mt-4">
            <FieldRow label="Professional summary">
              <Textarea
                value={profile.summary}
                onChange={(e) => set("summary", e.target.value)}
                rows={4}
                className="rounded-xl"
                placeholder="A short, impact-focused summary."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  set("summary", generateSummary(profile));
                  toast.success("Generated a draft summary from your profile.");
                }}
                className="mt-2 h-9 rounded-xl"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-brand" /> Generate Summary
              </Button>
            </FieldRow>
          </div>
        </SectionCard>

        {/* Contact */}
        <SectionCard icon={Mail} title="Contact & links">
          <div className="grid gap-4 sm:grid-cols-2">
            <IconField
              icon={Mail}
              value={profile.email}
              onChange={(v) => set("email", v)}
              placeholder="Email"
            />
            <IconField
              icon={Phone}
              value={profile.phone}
              onChange={(v) => set("phone", v)}
              placeholder="Phone"
            />
            <IconField
              icon={MapPin}
              value={profile.location}
              onChange={(v) => set("location", v)}
              placeholder="Location"
            />
            <IconField
              icon={Github}
              value={profile.github}
              onChange={(v) => set("github", v)}
              placeholder="GitHub handle or full URL"
              onBlur={() => {
                const val = profile.github.trim();
                if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
                  if (val.includes("github.com")) {
                    set("github", `https://${val}`);
                  } else {
                    set("github", `https://github.com/${val}`);
                  }
                }
              }}
            />
            <IconField
              icon={Linkedin}
              value={profile.linkedin}
              onChange={(v) => set("linkedin", v)}
              placeholder="LinkedIn handle or full URL"
              helper={linkedinHelper}
              onBlur={() => {
                const val = profile.linkedin.trim();
                if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
                  if (val.includes("linkedin.com")) {
                    set("linkedin", `https://${val}`);
                  } else {
                    set("linkedin", `https://linkedin.com/in/${val}`);
                  }
                }
              }}
            />
            <IconField
              icon={Globe}
              value={profile.portfolio}
              onChange={(v) => set("portfolio", v)}
              placeholder="Portfolio/Website URL"
              onBlur={() => {
                const val = profile.portfolio.trim();
                if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
                  set("portfolio", `https://${val}`);
                }
              }}
            />
          </div>
        </SectionCard>

        {/* Education */}
        <RepeaterSection
          icon={GraduationCap}
          title="Education"
          items={profile.education}
          onAdd={() =>
            set("education", [...profile.education, { degree: "", school: "", year: "", cgpa: "" }])
          }
          onRemove={(i) =>
            set(
              "education",
              profile.education.filter((_, x) => x !== i),
            )
          }
          render={(ed, i) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <BasicField
                label="Degree"
                value={ed.degree}
                onChange={(v) => updEd(i, { degree: v })}
              />
              <BasicField
                label="Institution"
                value={ed.school}
                onChange={(v) => updEd(i, { school: v })}
              />
              <BasicField label="Period" value={ed.year} onChange={(v) => updEd(i, { year: v })} />
              <BasicField
                label="CGPA / Grade"
                value={ed.cgpa ?? ""}
                onChange={(v) => updEd(i, { cgpa: v })}
              />
            </div>
          )}
        />

        {/* Experience */}
        <RepeaterSection
          icon={Briefcase}
          title="Experience"
          items={profile.experience}
          onAdd={() =>
            set("experience", [
              ...profile.experience,
              { role: "", company: "", period: "", bullets: [""] },
            ])
          }
          onRemove={(i) =>
            set(
              "experience",
              profile.experience.filter((_, x) => x !== i),
            )
          }
          render={(ex, i) => (
            <div>
              <div className="grid gap-3 sm:grid-cols-3">
                <BasicField label="Role" value={ex.role} onChange={(v) => updExp(i, { role: v })} />
                <BasicField
                  label="Company"
                  value={ex.company}
                  onChange={(v) => updExp(i, { company: v })}
                />
                <BasicField
                  label="Period"
                  value={ex.period}
                  onChange={(v) => updExp(i, { period: v })}
                />
              </div>
              <div className="mt-3">
                <Label>Bullet points (one per line)</Label>
                <Textarea
                  value={ex.bullets.join("\n")}
                  onChange={(e) => updExp(i, { bullets: e.target.value.split("\n") })}
                  rows={3}
                  className="mt-1.5 rounded-xl"
                />
              </div>
            </div>
          )}
        />

        {/* Projects */}
        <RepeaterSection
          icon={FolderGit2}
          title="Projects"
          items={profile.projects}
          headerAction={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setGhOpen(true)}
              className="h-9 rounded-xl border-brand/30 bg-card hover:bg-brand-soft/50"
            >
              <Github className="mr-1.5 h-4 w-4" /> Sync GitHub Repos
            </Button>
          }
          onAdd={() =>
            set("projects", [...profile.projects, { name: "", tools: "", bullets: [""] }])
          }
          onRemove={(i) =>
            set(
              "projects",
              profile.projects.filter((_, x) => x !== i),
            )
          }
          render={(p, i) => (
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                <BasicField
                  label="Project name"
                  value={p.name}
                  onChange={(v) => updProj(i, { name: v })}
                />
                <BasicField
                  label="Tools / stack"
                  value={p.tools}
                  onChange={(v) => updProj(i, { tools: v })}
                />
              </div>
              <div className="mt-3">
                <Label>Bullet points (one per line)</Label>
                <Textarea
                  value={p.bullets.join("\n")}
                  onChange={(e) => updProj(i, { bullets: e.target.value.split("\n") })}
                  rows={3}
                  className="mt-1.5 rounded-xl"
                />
              </div>
            </div>
          )}
        />

        {/* Skills */}
        <RepeaterSection
          icon={Wrench}
          title="Skills"
          items={profile.skills}
          onAdd={() => set("skills", [...profile.skills, { category: "", items: "" }])}
          onRemove={(i) =>
            set(
              "skills",
              profile.skills.filter((_, x) => x !== i),
            )
          }
          render={(s, i) => (
            <div className="grid gap-3 sm:grid-cols-[200px_minmax(0,1fr)]">
              <BasicField
                label="Category"
                value={s.category}
                onChange={(v) => updSkill(i, { category: v })}
              />
              <BasicField
                label="Items (comma-separated)"
                value={s.items}
                onChange={(v) => updSkill(i, { items: v })}
              />
            </div>
          )}
        />

        {/* Certifications */}
        <RepeaterSection
          icon={Award}
          title="Certifications"
          items={profile.certifications}
          onAdd={() =>
            set("certifications", [...profile.certifications, { name: "", issuer: "", year: "" }])
          }
          onRemove={(i) =>
            set(
              "certifications",
              profile.certifications.filter((_, x) => x !== i),
            )
          }
          render={(c, i) => (
            <div className="grid gap-3 sm:grid-cols-3">
              <BasicField label="Name" value={c.name} onChange={(v) => updCert(i, { name: v })} />
              <BasicField
                label="Issuer"
                value={c.issuer}
                onChange={(v) => updCert(i, { issuer: v })}
              />
              <BasicField label="Year" value={c.year} onChange={(v) => updCert(i, { year: v })} />
            </div>
          )}
        />

        {/* Languages */}
        <RepeaterSection
          icon={Languages}
          title="Languages"
          items={profile.languages}
          onAdd={() => set("languages", [...profile.languages, { name: "", level: "" }])}
          onRemove={(i) =>
            set(
              "languages",
              profile.languages.filter((_, x) => x !== i),
            )
          }
          render={(l, i) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <BasicField
                label="Language"
                value={l.name}
                onChange={(v) => updLang(i, { name: v })}
              />
              <BasicField
                label="Level"
                value={l.level}
                onChange={(v) => updLang(i, { level: v })}
              />
            </div>
          )}
        />

        {/* Achievements */}
        <RepeaterSection
          icon={Trophy}
          title="Achievements"
          items={profile.achievements}
          onAdd={() => set("achievements", [...profile.achievements, { title: "", detail: "" }])}
          onRemove={(i) =>
            set(
              "achievements",
              profile.achievements.filter((_, x) => x !== i),
            )
          }
          render={(a, i) => (
            <div className="grid gap-3 sm:grid-cols-[260px_minmax(0,1fr)]">
              <BasicField label="Title" value={a.title} onChange={(v) => updAch(i, { title: v })} />
              <BasicField
                label="Detail"
                value={a.detail}
                onChange={(v) => updAch(i, { detail: v })}
              />
            </div>
          )}
        />

        {/* CTA: Create resume */}
        <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-brand/30 bg-brand-soft/40 p-5">
          <div>
            <div className="text-base font-bold text-foreground">Ready to build a resume?</div>
            <p className="text-sm text-muted-foreground">
              We'll auto-import everything from this profile — you choose what to include.
            </p>
          </div>
          <Button
            asChild
            className="h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Link to="/" search={{ create: true }}>
              Create resume from Profile <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </div>

      <GithubImportDialog
        open={ghOpen}
        onOpenChange={setGhOpen}
        onImport={handleGithubImport}
        initialUsername={profile.github.split("/").pop() || ""}
      />
    </AppShell>
  );

  function updEd(i: number, patch: Partial<Profile["education"][number]>) {
    set(
      "education",
      profile.education.map((x, j) => (j === i ? { ...x, ...patch } : x)),
    );
  }
  function updExp(i: number, patch: Partial<Profile["experience"][number]>) {
    set(
      "experience",
      profile.experience.map((x, j) => (j === i ? { ...x, ...patch } : x)),
    );
  }
  function updProj(i: number, patch: Partial<Profile["projects"][number]>) {
    set(
      "projects",
      profile.projects.map((x, j) => (j === i ? { ...x, ...patch } : x)),
    );
  }
  function updSkill(i: number, patch: Partial<Profile["skills"][number]>) {
    set(
      "skills",
      profile.skills.map((x, j) => (j === i ? { ...x, ...patch } : x)),
    );
  }
  function updCert(i: number, patch: Partial<Profile["certifications"][number]>) {
    set(
      "certifications",
      profile.certifications.map((x, j) => (j === i ? { ...x, ...patch } : x)),
    );
  }
  function updLang(i: number, patch: Partial<Profile["languages"][number]>) {
    set(
      "languages",
      profile.languages.map((x, j) => (j === i ? { ...x, ...patch } : x)),
    );
  }
  function updAch(i: number, patch: Partial<Profile["achievements"][number]>) {
    set(
      "achievements",
      profile.achievements.map((x, j) => (j === i ? { ...x, ...patch } : x)),
    );
  }
}

function SectionCard({
  icon: Icon,
  title,
  children,
  headerAction,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6">
      <header className="mb-4 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        {headerAction}
      </header>
      {children}
    </section>
  );
}

function RepeaterSection<T>({
  icon,
  title,
  items,
  render,
  onAdd,
  onRemove,
  headerAction,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: T[];
  render: (item: T, i: number) => React.ReactNode;
  onAdd: () => void;
  onRemove: (i: number) => void;
  headerAction?: React.ReactNode;
}) {
  return (
    <SectionCard icon={icon} title={title} headerAction={headerAction}>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-border p-4">
            {render(item, i)}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(i)}
              className="mt-2 text-destructive"
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={onAdd} className="rounded-xl">
          <Plus className="mr-1.5 h-4 w-4" /> Add {title.toLowerCase().replace(/s$/, "")}
        </Button>
      </div>
    </SectionCard>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function BasicField({
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

function IconField({
  icon: Icon,
  value,
  onChange,
  placeholder,
  onBlur,
  helper,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onBlur?: () => void;
  helper?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onBlur={onBlur}
          className="h-11 rounded-xl pl-9"
        />
      </div>
      {helper && <div>{helper}</div>}
    </div>
  );
}
