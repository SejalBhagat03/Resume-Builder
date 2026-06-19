import * as React from "react";
import { Sparkles, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { recommendRoles } from "@/lib/ai-mock";
import type { Profile } from "@/lib/profile-store";

export function RoleRecommendations({
  profile,
  jd,
  limit = 4,
}: {
  profile: Profile;
  jd?: string;
  limit?: number;
}) {
  const matches = React.useMemo(
    () => recommendRoles(profile, jd).slice(0, limit),
    [profile, jd, limit],
  );
  if (matches.length === 0) return null;
  return (
    <Card className="rounded-2xl border-border p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-base font-bold">Best-matched roles</h2>
            <p className="text-xs text-muted-foreground">
              Estimated from your profile{jd ? " and the job description" : ""}.
            </p>
          </div>
        </div>
      </div>
      <ul className="mt-4 space-y-3">
        {matches.map((m, i) => (
          <li key={m.role} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {i === 0 && <Star className="h-4 w-4 fill-brand text-brand" />}
                <span className="truncate text-sm font-semibold">{m.role}</span>
              </div>
              <span className="text-sm font-bold text-brand">{m.score}%</span>
            </div>
            <Progress value={m.score} className="mt-2 h-1.5" />
            <p className="mt-1.5 text-xs text-muted-foreground">{m.reason}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
