import { Link, useRouterState } from "@tanstack/react-router";
import {
  X,
  LayoutDashboard,
  User,
  FileText,
  LayoutTemplate,
  BarChart3,
  Upload,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Profile", url: "/profile", icon: User },
  { title: "My Resumes", url: "/resumes", icon: FileText },
  { title: "Templates", url: "/templates", icon: LayoutTemplate },
  { title: "ATS Analysis", url: "/ats", icon: BarChart3 },
  { title: "Import Resume", url: "/import", icon: Upload },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

export function MobileDrawerNav({ open, onClose }: { open: boolean; onClose: () => void }) {
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

        <div className="h-px bg-border mx-3" />

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item) => (
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
