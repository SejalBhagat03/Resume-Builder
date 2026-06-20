import * as React from "react";
import { Search, Menu, X, LogIn, LogOut, HelpCircle } from "lucide-react";
import { LayoutDashboard, User, FileText, LayoutTemplate, BarChart3, Upload } from "lucide-react";
import { Link, useRouterState, useNavigate, useMatchRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { syncLocalResumesToSupabase, setActiveResumeUser } from "@/lib/resume-store";
import { setActiveProfileUser } from "@/lib/profile-store";
import { Session } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const mobileNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "My Resumes", url: "/resumes", icon: FileText },
  { title: "Templates", url: "/templates", icon: LayoutTemplate },
  { title: "ATS Analysis", url: "/ats", icon: BarChart3 },
];

function MobileDrawerNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />
      {/* Drawer */}
      <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card shadow-2xl md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <span className="font-extrabold tracking-tight text-foreground">
              Resume Builder Pro
            </span>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-3 h-px bg-border" />

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {mobileNavItems.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.url)
                  ? "bg-brand-soft text-brand"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const isEditorPage = !!matchRoute({ to: "/editor/$id" });
  const [session, setSession] = React.useState<Session | null>(null);
  const [bypass, setBypass] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setBypass(localStorage.getItem("rbp.auth.bypass") === "true");
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setSession(data.session);
        syncLocalResumesToSupabase();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (typeof window !== "undefined") {
        setBypass(localStorage.getItem("rbp.auth.bypass") === "true");
      }
      if (newSession) {
        syncLocalResumesToSupabase();
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const isLoggedIn = !!session || bypass;

  async function handleLogout() {
    try {
      // Reset in-memory user scope BEFORE signing out so no residual data is readable
      setActiveResumeUser(null);
      setActiveProfileUser(null);
      localStorage.removeItem("rbp.auth.bypass");
      await supabase.auth.signOut();
      toast.success("Signed out successfully.");
    } catch (err) {
      console.warn("Sign out error:", err);
    }
    navigate({ to: "/auth" });
  }

  function handleLogin() {
    navigate({ to: "/auth" });
  }

  const getInitials = () => {
    if (session?.user?.email) {
      return session.user.email.substring(0, 2).toUpperCase();
    }
    if (bypass) return "ME";
    return "U";
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop: fixed narrow Canva-style rail */}
      <AppSidebar />

      {/* Mobile slide-in drawer */}
      <MobileDrawerNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6">
          <div className="relative ml-auto hidden w-full max-w-sm md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search resumes..."
              className="h-10 rounded-xl border-border bg-card pl-9"
            />
          </div>

          {/* Quick Tour Button */}
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/", search: { tour: true } })}
            className="h-10 gap-1.5 rounded-xl border border-border/50 bg-card/50 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted ml-auto md:ml-0"
            title="Start Interactive Tour"
          >
            <HelpCircle className="h-4 w-4 text-brand" />
            <span className="hidden sm:inline">Quick Tour</span>
          </Button>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 focus:outline-none select-none">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand hover:ring-2 hover:ring-brand/40 transition-all cursor-pointer">
                    {getInitials()}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-1 rounded-xl p-1.5 border border-border bg-popover shadow-md"
              >
                <DropdownMenuLabel className="px-2.5 py-2">
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-xs font-extrabold text-foreground">Account</span>
                    <span className="text-[10px] text-muted-foreground truncate font-medium">
                      {session?.user?.email || "Dev Bypass Mode"}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="-mx-1 my-1.5 bg-border/60" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg text-destructive hover:bg-destructive-soft hover:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleLogin}
              className="h-10 gap-2 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 px-4 text-sm font-medium transition-all duration-200"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Log In</span>
            </Button>
          )}
        </header>

        <main className="flex-1 pb-24 md:pb-8">{children}</main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
