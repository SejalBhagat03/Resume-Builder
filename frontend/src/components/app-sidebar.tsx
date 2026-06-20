import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, User, FileText, LayoutTemplate, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const main = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Profile", url: "/profile", icon: User, id: "tour-sidebar-profile" },
  { title: "My Resumes", url: "/resumes", icon: FileText },
  { title: "Templates", url: "/templates", icon: LayoutTemplate, id: "tour-sidebar-templates" },
  { title: "ATS Check", url: "/ats", icon: BarChart3 },
];

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  id?: string;
};

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <aside
      className="hidden md:flex flex-col border-r border-border bg-card sticky top-0 h-screen shrink-0"
      style={{ width: 180, minWidth: 180 }}
    >
      {/* Brand logo item */}
      <Link
        to="/"
        className="flex items-center gap-2.5 px-4 py-5 w-full"
        title="Resume Builder Pro"
      >
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-brand-foreground shadow-soft shrink-0">
          <FileText className="h-4 w-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-extrabold text-foreground tracking-tight leading-none truncate">
            Resume Builder
          </span>
          <span className="text-[9px] font-bold text-brand tracking-widest uppercase mt-0.5">
            Pro
          </span>
        </div>
      </Link>

      {/* Divider */}
      <div className="mx-4 mb-4 h-px bg-border/60" />

      {/* Main navigation */}
      <nav className="flex-1 space-y-1 px-2.5 py-2">
        {main.map((item) => (
          <NavItemRow key={item.url} item={item} active={isActive(item.url)} />
        ))}
      </nav>
    </aside>
  );
}

function NavItemRow({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      to={item.url}
      title={item.title}
      id={item.id}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all w-full text-xs font-semibold relative group cursor-pointer",
        active
          ? "bg-brand/8 text-brand"
          : "text-muted-foreground hover:bg-muted/65 hover:text-foreground",
      )}
    >
      {/* Active Indicator Bar */}
      {active && <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r bg-brand" />}
      <item.icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-brand" : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      <span className="truncate">{item.title}</span>
    </Link>
  );
}
