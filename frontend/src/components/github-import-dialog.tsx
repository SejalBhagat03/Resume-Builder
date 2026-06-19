import * as React from "react";
import { Github, Loader2, Search, Star, GitFork, Check } from "lucide-react";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type GithubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  homepage?: string | null;
};

export type ImportedProject = {
  name: string;
  tools: string;
  bullets: string[];
};

export function repoToProject(r: GithubRepo): ImportedProject {
  const tools = [r.language, ...(r.topics ?? [])].filter(Boolean).slice(0, 6).join(", ");
  const bullets: string[] = [];
  if (r.description) bullets.push(r.description);
  if (r.stargazers_count > 0)
    bullets.push(`Earned ${r.stargazers_count}★ and ${r.forks_count} forks on GitHub.`);
  bullets.push(`Source: ${r.html_url}`);
  return { name: r.name, tools: tools || "GitHub project", bullets };
}

export function GithubImportDialog({
  open,
  onOpenChange,
  onImport,
  initialUsername,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onImport: (projects: ImportedProject[]) => void;
  initialUsername?: string;
}) {
  const [username, setUsername] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [repos, setRepos] = React.useState<GithubRepo[]>([]);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    if (open && initialUsername) setUsername(initialUsername);
  }, [open, initialUsername]);

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setRepos([]);
        setSelected(new Set());
        setFilter("");
      }, 200);
    }
  }, [open]);

  const fetchRepos = async () => {
    const u = username.trim();
    if (!u) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(u)}/repos?per_page=100&sort=updated`,
      );
      if (!res.ok) {
        if (res.status === 404) throw new Error(`No GitHub user "${u}" found.`);
        if (res.status === 403)
          throw new Error("GitHub rate limit reached — try again in a minute.");
        throw new Error(`GitHub error (${res.status})`);
      }
      const data: GithubRepo[] = await res.json();
      const cleaned = data
        .filter((r) => !r.full_name.endsWith("/.github"))
        .sort((a, b) => b.stargazers_count - a.stargazers_count);
      setRepos(cleaned);
      if (cleaned.length === 0) toast.info("No public repositories found for this user.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id: number) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const visible = filter
    ? repos.filter((r) =>
        (r.name + " " + (r.description ?? "")).toLowerCase().includes(filter.toLowerCase()),
      )
    : repos;

  const handleImport = () => {
    const picks = repos.filter((r) => selected.has(r.id)).map(repoToProject);
    if (picks.length === 0) {
      toast.error("Select at least one repository.");
      return;
    }
    onImport(picks);
    onOpenChange(false);
    toast.success(`Imported ${picks.length} project${picks.length === 1 ? "" : "s"} from GitHub.`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-3xl border-border p-0">
        <DialogHeader className="space-y-1 px-7 pt-7">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-foreground text-background">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Import from GitHub</DialogTitle>
              <DialogDescription className="text-sm">
                Enter a GitHub username — we'll list their public repositories so you can add them
                as projects.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-7 py-5">
          <Label htmlFor="gh-user">GitHub username</Label>
          <div className="mt-1.5 flex gap-2">
            <Input
              id="gh-user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. torvalds"
              className="h-11 rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchRepos();
              }}
            />
            <Button
              type="button"
              onClick={fetchRepos}
              disabled={loading || !username.trim()}
              className="h-11 shrink-0 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {loading ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-1.5 h-4 w-4" />
              )}
              Fetch repos
            </Button>
          </div>

          {repos.length > 0 && (
            <>
              <div className="mt-4 flex items-center justify-between gap-3">
                <Input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter repositories..."
                  className="h-10 rounded-xl"
                />
                <div className="shrink-0 text-xs text-muted-foreground">
                  {selected.size} selected · {repos.length} repos
                </div>
              </div>

              <div className="mt-3 max-h-80 space-y-2 overflow-y-auto rounded-2xl border border-border bg-muted/30 p-2">
                {visible.map((r) => {
                  const isSel = selected.has(r.id);
                  return (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => toggle(r.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-xl border-2 bg-card p-3 text-left transition-all",
                        isSel
                          ? "border-brand bg-brand-soft/40"
                          : "border-transparent hover:border-brand/30",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2",
                          isSel ? "border-brand bg-brand text-brand-foreground" : "border-border",
                        )}
                      >
                        {isSel && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{r.name}</span>
                        {r.description && (
                          <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                            {r.description}
                          </span>
                        )}
                        <span className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {r.language && (
                            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-brand">
                              {r.language}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3" /> {r.stargazers_count}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <GitFork className="h-3 w-3" /> {r.forks_count}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
                {visible.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No repositories match.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border bg-background/60 px-7 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={selected.size === 0}
            className="h-11 rounded-xl bg-brand px-6 text-brand-foreground hover:bg-brand/90"
          >
            Import {selected.size > 0 ? `(${selected.size})` : ""}
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
