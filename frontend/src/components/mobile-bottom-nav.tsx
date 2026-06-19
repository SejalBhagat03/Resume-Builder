import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, User, FileText, LayoutTemplate, BarChart3, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Home", url: "/", icon: LayoutDashboard },
  { title: "Profile", url: "/profile", icon: User, id: "tour-mobile-profile" },
  { title: "Resumes", url: "/resumes", icon: FileText },
  { title: "Templates", url: "/templates", icon: LayoutTemplate, id: "tour-mobile-templates" },
  { title: "ATS", url: "/ats", icon: BarChart3 },
  { title: "Import", url: "/import", icon: Upload },
];

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-6">
        {items.map((item) => {
          const active = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
          return (
            <li key={item.url}>
              <Link
                to={item.url}
                id={item.id}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-brand" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span className="leading-none">{item.title}</span>
                <span
                  className={cn(
                    "h-0.5 w-4 rounded-full mt-0.5",
                    active ? "bg-brand" : "bg-transparent",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
