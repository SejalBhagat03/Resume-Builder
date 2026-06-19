import type { Resume } from "@/lib/resume-store";
import { templateAccent } from "@/components/resume-thumb-utils";

/** Clamp text to a max length for thumbnail readability */
function clip(s: string, max = 38): string {
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export function ResumeThumb({
  accent,
  resume,
  templateId,
  /** Pass a demo data object to show realistic content in template picker mode */
  demoData,
}: {
  accent?: string;
  resume?: Resume;
  templateId?: string;
  demoData?: Resume["data"];
}) {
  const tid = templateId ?? resume?.template ?? "ats-professional";
  const resolvedAccent = accent ?? templateAccent(tid);

  // Prefer real resume data, then demo data, then empty
  const d = resume?.data ?? demoData ?? null;

  const name = d?.fullName ?? "";
  const email = d?.email ?? "";
  const role = d?.experience?.[0]?.role ?? "";
  const company = d?.experience?.[0]?.company ?? "";
  const bullet0 = d?.experience?.[0]?.bullets?.[0] ?? "";
  const role2 = d?.experience?.[1]?.role ?? "";
  const school = d?.education?.[0]?.school ?? "";
  const degree = d?.education?.[0]?.degree ?? "";
  const skill1 = d?.skills?.[0]?.items ?? "";
  const summary = d?.summary ?? "";

  // ─── Two Column ────────────────────────────────────────────────────────────
  if (tid === "two-column") {
    return (
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card shadow-soft flex">
        {/* Left sidebar */}
        <div
          className="w-[33%] p-2 flex flex-col gap-2 shrink-0 border-r border-border"
          style={{ backgroundColor: `${resolvedAccent}10` }}
        >
          {/* Avatar */}
          <div
            className="h-7 w-7 rounded-full mx-auto flex items-center justify-center text-[6px] font-bold shrink-0"
            style={{
              backgroundColor: `${resolvedAccent}25`,
              border: `1.5px solid ${resolvedAccent}50`,
              color: resolvedAccent,
            }}
          >
            {name
              ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : "AJ"}
          </div>

          {/* Name */}
          {name ? (
            <div
              className="text-[5px] font-extrabold text-center leading-tight truncate px-0.5"
              style={{ color: resolvedAccent }}
            >
              {name.split(" ")[0]}
              {"\n"}
              {name.split(" ").slice(1).join(" ")}
            </div>
          ) : (
            <div className="mx-auto h-1.5 w-3/4 rounded bg-muted-foreground/30" />
          )}

          {/* Divider */}
          <div className="h-[0.5px] w-full" style={{ backgroundColor: `${resolvedAccent}25` }} />

          {/* Skills section label */}
          <div className="h-1 w-2/3 rounded" style={{ background: resolvedAccent, opacity: 0.8 }} />
          {/* Skill lines */}
          {skill1 ? (
            <div className="text-[4px] text-muted-foreground leading-tight">{clip(skill1, 22)}</div>
          ) : (
            <>
              <div className="h-1 w-full rounded bg-muted-foreground/20" />
              <div className="h-1 w-4/5 rounded bg-muted-foreground/20" />
            </>
          )}
          <div className="h-[0.5px] w-full" style={{ backgroundColor: `${resolvedAccent}20` }} />
          {/* Education label */}
          <div className="h-1 w-1/2 rounded" style={{ background: resolvedAccent, opacity: 0.8 }} />
          {school ? (
            <div className="text-[4px] text-muted-foreground leading-tight">{clip(school, 18)}</div>
          ) : (
            <div className="h-1 w-3/4 rounded bg-muted-foreground/20" />
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 p-2 flex flex-col gap-2">
          {/* Section: Experience */}
          <div
            className="h-1 w-1/3 rounded"
            style={{ background: resolvedAccent, opacity: 0.85 }}
          />
          {role ? (
            <>
              <div
                className="text-[4.5px] font-bold leading-none"
                style={{ color: resolvedAccent }}
              >
                {clip(role, 26)}
              </div>
              <div className="text-[4px] text-muted-foreground leading-none">
                {clip(company, 22)}
              </div>
            </>
          ) : (
            <>
              <div className="h-1 w-4/5 rounded bg-muted-foreground/25" />
              <div className="h-1 w-2/3 rounded bg-muted-foreground/20" />
            </>
          )}
          {bullet0 ? (
            <div className="flex gap-0.5 items-start">
              <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40 mt-[2px] shrink-0" />
              <div className="text-[3.5px] text-muted-foreground leading-tight">
                {clip(bullet0, 42)}
              </div>
            </div>
          ) : (
            <div className="h-1 w-full rounded bg-muted-foreground/15" />
          )}

          {/* Section: Projects / 2nd experience */}
          <div className="h-[0.5px] w-full bg-border/60 mt-0.5" />
          <div
            className="h-1 w-2/5 rounded"
            style={{ background: resolvedAccent, opacity: 0.85 }}
          />
          {role2 ? (
            <div className="text-[4px] font-semibold leading-none">{clip(role2, 24)}</div>
          ) : (
            <div className="h-1 w-3/4 rounded bg-muted-foreground/20" />
          )}
          <div className="h-1 w-[85%] rounded bg-muted-foreground/15" />
        </div>
      </div>
    );
  }

  // ─── Modern ────────────────────────────────────────────────────────────────
  if (tid === "modern") {
    return (
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card shadow-soft flex flex-col">
        {/* Bold colored header */}
        <div
          className="px-3 pt-2.5 pb-2 text-white flex flex-col justify-center gap-0.5 shrink-0"
          style={{ background: resolvedAccent }}
        >
          {name ? (
            <div className="text-[7px] font-extrabold truncate uppercase leading-tight">{name}</div>
          ) : (
            <div className="h-2 w-2/5 rounded bg-white/40" />
          )}
          {role ? (
            <div className="text-[4.5px] text-white/80 truncate">
              {clip(role, 30)} · {clip(company, 18)}
            </div>
          ) : (
            <div className="h-1 w-1/3 rounded bg-white/30" />
          )}
          {email ? <div className="text-[3.5px] text-white/60 truncate">{email}</div> : null}
        </div>

        {/* Body */}
        <div className="p-2.5 flex flex-col gap-2 flex-1">
          {/* Summary */}
          {summary ? (
            <div className="text-[3.5px] text-muted-foreground leading-tight line-clamp-2">
              {clip(summary, 80)}
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="h-1 w-full rounded bg-muted-foreground/20" />
              <div className="h-1 w-4/5 rounded bg-muted-foreground/15" />
            </div>
          )}

          {/* Experience section */}
          <div
            className="flex items-center gap-1"
            style={{ borderLeft: `2px solid ${resolvedAccent}` }}
          >
            <div
              className="h-1 w-1/4 rounded ml-1"
              style={{ background: resolvedAccent, opacity: 0.85 }}
            />
          </div>
          {role ? (
            <>
              <div className="text-[4.5px] font-bold leading-none pl-1.5">{clip(role, 28)}</div>
              <div className="text-[4px] text-muted-foreground pl-1.5 leading-none">
                {clip(company, 22)}
              </div>
            </>
          ) : (
            <div className="h-1 w-3/4 rounded bg-muted-foreground/20 pl-1.5" />
          )}
          {bullet0 ? (
            <div className="flex gap-0.5 items-start pl-1.5">
              <div
                className="w-0.5 h-0.5 rounded-full shrink-0 mt-[2px]"
                style={{ background: resolvedAccent }}
              />
              <div className="text-[3.5px] text-muted-foreground leading-tight">
                {clip(bullet0, 45)}
              </div>
            </div>
          ) : (
            <div className="h-1 w-[90%] rounded bg-muted-foreground/15 ml-1.5" />
          )}

          {/* Education section */}
          <div
            className="flex items-center gap-1 mt-0.5"
            style={{ borderLeft: `2px solid ${resolvedAccent}` }}
          >
            <div
              className="h-1 w-1/3 rounded ml-1"
              style={{ background: resolvedAccent, opacity: 0.85 }}
            />
          </div>
          {school ? (
            <div className="text-[4px] text-muted-foreground pl-1.5 leading-none">
              {clip(school, 24)} · {degree ? clip(degree, 20) : ""}
            </div>
          ) : (
            <div className="h-1 w-2/3 rounded bg-muted-foreground/20 ml-1.5" />
          )}

          {/* Skills */}
          <div
            className="flex items-center gap-1 mt-0.5"
            style={{ borderLeft: `2px solid ${resolvedAccent}` }}
          >
            <div
              className="h-1 w-1/5 rounded ml-1"
              style={{ background: resolvedAccent, opacity: 0.85 }}
            />
          </div>
          {skill1 ? (
            <div className="text-[3.5px] text-muted-foreground leading-tight pl-1.5">
              {clip(skill1, 40)}
            </div>
          ) : (
            <div className="h-1 w-4/5 rounded bg-muted-foreground/15 ml-1.5" />
          )}
        </div>
      </div>
    );
  }

  // ─── Minimal ───────────────────────────────────────────────────────────────
  if (tid === "minimal") {
    return (
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card p-2.5 shadow-soft flex flex-col gap-2">
        {/* Header */}
        <div>
          {name ? (
            <div className="text-[7.5px] font-bold tracking-tight text-foreground truncate">
              {name}
            </div>
          ) : (
            <div className="h-2 w-1/3 rounded bg-muted-foreground/45" />
          )}
          {role ? (
            <div className="text-[4px] text-muted-foreground mt-0.5 truncate">
              {clip(role, 30)} · {clip(company, 18)}
            </div>
          ) : (
            <div className="h-1 w-1/5 rounded bg-muted-foreground/20 mt-0.5" />
          )}
          {email ? (
            <div className="text-[3.5px] text-muted-foreground/70 mt-0.5 truncate">{email}</div>
          ) : null}
          <div className="h-[0.5px] bg-border my-1.5" />
        </div>

        {/* Summary */}
        {summary ? (
          <div className="text-[3.5px] text-muted-foreground leading-tight">
            {clip(summary, 90)}
          </div>
        ) : (
          <div className="space-y-0.5">
            <div className="h-1 w-[95%] rounded bg-muted-foreground/20" />
            <div className="h-1 w-[85%] rounded bg-muted-foreground/15" />
          </div>
        )}

        {/* Experience */}
        <div>
          <div
            className="h-1 w-1/5 rounded mb-1"
            style={{ background: resolvedAccent, opacity: 0.85 }}
          />
          {role ? (
            <>
              <div className="text-[4.5px] font-semibold leading-none">{clip(role, 28)}</div>
              <div className="text-[3.5px] text-muted-foreground mt-0.5 leading-none">
                {clip(company, 22)}
              </div>
            </>
          ) : (
            <div className="h-1 w-[80%] rounded bg-muted-foreground/20" />
          )}
          {bullet0 ? (
            <div className="flex gap-0.5 items-start mt-0.5">
              <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40 mt-[2px] shrink-0" />
              <div className="text-[3.5px] text-muted-foreground leading-tight">
                {clip(bullet0, 45)}
              </div>
            </div>
          ) : (
            <div className="h-1 w-3/4 rounded bg-muted-foreground/15 mt-0.5" />
          )}
        </div>

        {/* Education */}
        <div>
          <div
            className="h-1 w-1/4 rounded mb-1"
            style={{ background: resolvedAccent, opacity: 0.85 }}
          />
          {school ? (
            <div className="text-[4px] text-muted-foreground leading-none">{clip(school, 22)}</div>
          ) : (
            <div className="h-1 w-2/3 rounded bg-muted-foreground/20" />
          )}
          {degree ? (
            <div className="text-[3.5px] text-muted-foreground/70 mt-0.5 leading-none">
              {clip(degree, 24)}
            </div>
          ) : null}
        </div>

        {/* Skills */}
        {skill1 ? (
          <div className="text-[3.5px] text-muted-foreground leading-tight">{clip(skill1, 42)}</div>
        ) : (
          <div className="h-1 w-[80%] rounded bg-muted-foreground/15" />
        )}
      </div>
    );
  }

  // ─── Creative ──────────────────────────────────────────────────────────────
  if (tid === "creative") {
    return (
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card p-2.5 shadow-soft flex flex-col gap-1.5">
        {/* Header row with avatar */}
        <div className="flex items-center gap-1.5">
          <div
            className="h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-[6px] font-bold"
            style={{
              backgroundColor: `${resolvedAccent}20`,
              color: resolvedAccent,
              border: `1.5px solid ${resolvedAccent}40`,
            }}
          >
            {name
              ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : "AJ"}
          </div>
          <div className="min-w-0 flex-1">
            {name ? (
              <div
                className="text-[6.5px] font-extrabold truncate"
                style={{ color: resolvedAccent }}
              >
                {name}
              </div>
            ) : (
              <div className="h-2 w-16 rounded bg-muted-foreground/35" />
            )}
            {role ? (
              <div className="text-[4px] text-muted-foreground truncate leading-none mt-0.5">
                {clip(role, 28)}
              </div>
            ) : (
              <div className="h-1 w-10 rounded bg-muted-foreground/20 mt-0.5" />
            )}
          </div>
        </div>

        <div className="h-[0.5px] w-full" style={{ backgroundColor: `${resolvedAccent}35` }} />

        {/* Summary */}
        {summary ? (
          <div className="text-[3.5px] text-muted-foreground leading-tight">
            {clip(summary, 80)}
          </div>
        ) : (
          <div className="space-y-0.5">
            <div className="h-1 w-[90%] rounded bg-muted-foreground/20" />
            <div className="h-1 w-[80%] rounded bg-muted-foreground/15" />
          </div>
        )}

        {/* Experience */}
        <div
          className="rounded px-1 py-0.5"
          style={{
            backgroundColor: `${resolvedAccent}08`,
            borderLeft: `1.5px solid ${resolvedAccent}`,
          }}
        >
          <div className="text-[4px] font-bold" style={{ color: resolvedAccent }}>
            Experience
          </div>
          {role ? (
            <>
              <div className="text-[4.5px] font-semibold mt-0.5 leading-none">{clip(role, 26)}</div>
              <div className="text-[3.5px] text-muted-foreground leading-none">
                {clip(company, 20)}
              </div>
            </>
          ) : (
            <div className="h-1 w-3/4 rounded bg-muted-foreground/20 mt-0.5" />
          )}
          {bullet0 ? (
            <div className="flex gap-0.5 mt-0.5 items-start">
              <span className="text-[4px]" style={{ color: resolvedAccent }}>
                •
              </span>
              <div className="text-[3.5px] text-muted-foreground leading-tight">
                {clip(bullet0, 40)}
              </div>
            </div>
          ) : null}
        </div>

        {/* Skills pills */}
        {(skill1 || !d) && (
          <div className="flex flex-wrap gap-0.5 mt-0.5">
            {(skill1 || "TypeScript, React, Node.js")
              .split(",")
              .slice(0, 3)
              .map((s, i) => (
                <span
                  key={i}
                  className="rounded-full px-1 py-[1px] text-[3.5px] font-semibold"
                  style={{ backgroundColor: `${resolvedAccent}15`, color: resolvedAccent }}
                >
                  {s.trim()}
                </span>
              ))}
          </div>
        )}
      </div>
    );
  }

  // ─── ATS Professional (default) ────────────────────────────────────────────
  return (
    <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card p-2.5 shadow-soft flex flex-col gap-2 text-center">
      {/* Centered header */}
      <div>
        {name ? (
          <div
            className="text-[7px] font-extrabold tracking-tight uppercase truncate"
            style={{ color: resolvedAccent }}
          >
            {name}
          </div>
        ) : (
          <div className="mx-auto h-2.5 w-1/3 rounded bg-muted-foreground/35" />
        )}
        {role ? (
          <div className="text-[4px] text-muted-foreground truncate mt-0.5">{clip(role, 30)}</div>
        ) : (
          <div className="mx-auto h-1 w-1/2 rounded bg-muted-foreground/20 mt-0.5" />
        )}
        {email ? (
          <div className="text-[3.5px] text-muted-foreground/70 truncate mt-0.5">{email}</div>
        ) : null}
        <div className="mx-auto mt-1 h-[0.5px] w-[90%] rounded bg-muted-foreground/20" />
      </div>

      {/* Summary */}
      {summary ? (
        <div className="text-[3.5px] text-muted-foreground leading-tight text-left">
          {clip(summary, 90)}
        </div>
      ) : (
        <div className="space-y-0.5">
          <div className="mx-auto h-1 w-[85%] rounded bg-muted-foreground/20" />
          <div className="mx-auto h-1 w-[80%] rounded bg-muted-foreground/15" />
        </div>
      )}

      {/* Experience */}
      <div className="text-left">
        <div
          className="mx-auto mb-0.5 h-1 w-1/4 rounded"
          style={{ background: resolvedAccent, opacity: 0.85 }}
        />
        {role ? (
          <>
            <div className="text-[4.5px] font-bold leading-none">{clip(role, 26)}</div>
            <div className="text-[3.5px] text-muted-foreground leading-none mt-0.5">
              {clip(company, 22)}
            </div>
          </>
        ) : null}
        {bullet0 ? (
          <div className="flex gap-0.5 items-start mt-0.5">
            <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground/30 shrink-0 mt-[2px]" />
            <div className="text-[3.5px] text-muted-foreground leading-tight">
              {clip(bullet0, 42)}
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-0.5 items-center mt-0.5">
              <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30 shrink-0" />
              <div className="h-1 w-[85%] rounded bg-muted-foreground/20" />
            </div>
            <div className="flex gap-0.5 items-center mt-0.5">
              <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30 shrink-0" />
              <div className="h-1 w-[70%] rounded bg-muted-foreground/15" />
            </div>
          </>
        )}
      </div>

      {/* Education */}
      <div className="text-left">
        <div
          className="mb-0.5 h-1 w-1/4 rounded"
          style={{ background: resolvedAccent, opacity: 0.85 }}
        />
        {school ? (
          <>
            <div className="text-[4px] font-semibold leading-none">{clip(school, 22)}</div>
            {degree ? (
              <div className="text-[3.5px] text-muted-foreground leading-none mt-0.5">
                {clip(degree, 24)}
              </div>
            ) : null}
          </>
        ) : (
          <div className="h-1 w-2/3 rounded bg-muted-foreground/20" />
        )}
      </div>

      {/* Skills */}
      <div className="text-left">
        <div
          className="mb-0.5 h-1 w-1/5 rounded"
          style={{ background: resolvedAccent, opacity: 0.85 }}
        />
        {skill1 ? (
          <div className="text-[3.5px] text-muted-foreground leading-tight">{clip(skill1, 42)}</div>
        ) : (
          <div className="h-1 w-4/5 rounded bg-muted-foreground/15" />
        )}
      </div>
    </div>
  );
}
