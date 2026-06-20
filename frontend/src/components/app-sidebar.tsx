import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, User, FileText, LayoutTemplate, BarChart3, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const main = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Profile", url: "/profile", icon: User, id: "tour-sidebar-profile" },
  { title: "My Resumes", url: "/resumes", icon: FileText },
  { title: "Templates", url: "/templates", icon: LayoutTemplate, id: "tour-sidebar-templates" },
  { title: "ATS", url: "/ats", icon: BarChart3 },
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
      className="hidden md:flex flex-col items-center border-r border-sidebar-border bg-sidebar sticky top-0 h-screen"
      style={{ width: 72, minWidth: 72, flexShrink: 0 }}
    >
      {/* Logo rail item */}
      <Link
        to="/"
        className="flex flex-col items-center justify-center gap-0.5 py-5 w-full"
        title="Resume Builder Pro"
      >
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground shadow-soft">
          <FileText className="h-4 w-4" />
        </div>
        <span className="mt-1 text-[9px] font-extrabold leading-none text-brand tracking-widest uppercase">
          RBP
        </span>
      </Link>

      {/* Divider */}
      <div className="mx-auto mb-2 h-px w-10 rounded bg-border" />

      {/* Main navigation */}
      <nav className="flex flex-1 flex-col items-center gap-0.5 px-1.5 py-1">
        {main.map((item) => (
          <NavRailItem key={item.url} item={item} active={isActive(item.url)} />
        ))}
      </nav>
    </aside>
  );
}

function NavRailItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      to={item.url}
      title={item.title}
      id={item.id}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 transition-all w-14",
        active
          ? "bg-brand-soft text-brand"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <item.icon className="h-[18px] w-[18px] shrink-0" />
      <span
        className={cn(
          "text-[9px] font-semibold leading-none text-center break-all",
          active ? "text-brand" : "text-muted-foreground",
        )}
      >
        {item.title}
      </span>
    </Link>
  );
}
