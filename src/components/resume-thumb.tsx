import type { Resume } from "@/lib/resume-store";

function templateAccent(id?: string): string {
  switch (id) {
    case "ats-professional":
      return "oklch(0.45 0.12 250)";
    case "modern":
      return "oklch(0.55 0.18 30)";
    case "minimal":
      return "oklch(0.35 0.02 60)";
    case "creative":
      return "oklch(0.55 0.2 320)";
    case "two-column":
      return "oklch(0.45 0.15 160)";
    default:
      return "var(--brand)";
  }
}

export function ResumeThumb({
  accent,
  resume,
  templateId,
}: {
  accent?: string;
  resume?: Resume;
  templateId?: string;
}) {
  const tid = templateId ?? resume?.template ?? "ats-professional";
  const resolvedAccent = accent ?? templateAccent(tid);
  const name = resume?.data.fullName ?? "";
  const role = resume?.data.experience?.[0]?.role ?? "";
  const summary = resume?.data.summary ?? "";
  const hasData = Boolean(resume);

  // Layout 1: Two Column Layout
  if (tid === "two-column") {
    return (
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card shadow-soft flex">
        {/* Left Column (Rail) */}
        <div
          className="w-[32%] p-2.5 space-y-3 flex flex-col justify-start shrink-0 border-r border-border"
          style={{ backgroundColor: `${resolvedAccent}12` }}
        >
          {/* Avatar / Initials */}
          <div
            className="h-5.5 w-5.5 rounded-full mx-auto flex items-center justify-center text-[5px] font-bold"
            style={{
              backgroundColor: `${resolvedAccent}25`,
              border: `1px solid ${resolvedAccent}35`,
              color: resolvedAccent,
            }}
          >
            {name
              ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : ""}
          </div>

          {/* Name & Title */}
          <div className="space-y-0.5 text-center">
            {hasData && name ? (
              <div
                className="text-[5px] font-extrabold truncate leading-tight"
                style={{ color: resolvedAccent }}
              >
                {name.split(" ")[0]}
              </div>
            ) : (
              <div className="mx-auto h-1 w-3/4 rounded bg-muted-foreground/30" />
            )}
            <div className="mx-auto h-[3px] w-2/3 rounded bg-muted-foreground/20" />
          </div>

          {/* Skills Section */}
          <div className="space-y-1">
            <div
              className="h-1.5 w-2/3 rounded mx-auto"
              style={{ background: resolvedAccent, opacity: 0.85 }}
            />
            <div className="space-y-0.5">
              <div className="mx-auto h-1 w-3/4 rounded bg-muted-foreground/20" />
              <div className="mx-auto h-1 w-4/5 rounded bg-muted-foreground/20" />
            </div>
          </div>
        </div>

        {/* Right Column (Main Content) */}
        <div className="flex-1 p-3 space-y-3 flex flex-col justify-start">
          {/* Summary */}
          <div className="space-y-1">
            <div
              className="h-1.5 w-1/3 rounded"
              style={{ background: resolvedAccent, opacity: 0.85 }}
            />
            <div className="space-y-0.5">
              <div className="h-1 w-full rounded bg-muted-foreground/20" />
              <div className="h-1 w-[85%] rounded bg-muted-foreground/20" />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-1">
            <div
              className="h-1.5 w-2/5 rounded"
              style={{ background: resolvedAccent, opacity: 0.85 }}
            />
            <div className="space-y-1">
              <div className="h-1 w-[90%] rounded bg-muted-foreground/20" />
              <div className="h-1 w-[75%] rounded bg-muted-foreground/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout 2: Modern Layout (Top header bar + left bordered sections)
  if (tid === "modern") {
    return (
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card shadow-soft flex flex-col">
        {/* Bold Top Header block */}
        <div
          className="p-3 text-white flex flex-col justify-center space-y-1 shrink-0"
          style={{ background: resolvedAccent }}
        >
          {hasData && name ? (
            <div className="text-[7.5px] font-extrabold truncate uppercase leading-tight">
              {name}
            </div>
          ) : (
            <div className="h-2 w-2/5 rounded bg-white/40" />
          )}
          {hasData && role ? (
            <div className="text-[4.5px] text-white/80 truncate leading-none">{role}</div>
          ) : (
            <div className="h-1 w-1/4 rounded bg-white/25" />
          )}
        </div>

        {/* Body */}
        <div className="p-3 space-y-3.5 flex-1 flex flex-col justify-start">
          {/* Section 1 */}
          <div className="space-y-1">
            <div
              className="h-1.5 w-1/4 border-l-2 pl-1 rounded-sm flex items-center"
              style={{ borderColor: resolvedAccent }}
            >
              <div
                className="h-1 w-full rounded"
                style={{ background: resolvedAccent, opacity: 0.85 }}
              />
            </div>
            <div className="space-y-0.5 pl-1">
              <div className="h-1 w-[90%] rounded bg-muted-foreground/20" />
              <div className="h-1 w-[80%] rounded bg-muted-foreground/20" />
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-1">
            <div
              className="h-1.5 w-1/3 border-l-2 pl-1 rounded-sm flex items-center"
              style={{ borderColor: resolvedAccent }}
            >
              <div
                className="h-1 w-full rounded"
                style={{ background: resolvedAccent, opacity: 0.85 }}
              />
            </div>
            <div className="space-y-0.5 pl-1">
              <div className="h-1 w-[85%] rounded bg-muted-foreground/20" />
              <div className="h-1 w-[70%] rounded bg-muted-foreground/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout 3: Minimal Layout (Clean, thin dividers, lots of whitespace)
  if (tid === "minimal") {
    return (
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card p-3 shadow-soft flex flex-col space-y-3">
        {/* Simple clean header */}
        <div className="space-y-1">
          {hasData && name ? (
            <div className="text-[7.5px] font-bold tracking-tight text-foreground truncate">
              {name}
            </div>
          ) : (
            <div className="h-2 w-1/3 rounded bg-muted-foreground/45" />
          )}
          {hasData && role ? (
            <div className="text-[4px] text-muted-foreground truncate">{role}</div>
          ) : (
            <div className="h-1 w-1/5 rounded bg-muted-foreground/20" />
          )}
          <div className="h-[0.5px] bg-border my-1.5" />
        </div>

        {/* Summary */}
        <div className="space-y-0.5">
          <div className="h-1 w-[95%] rounded bg-muted-foreground/20" />
          <div className="h-1 w-[85%] rounded bg-muted-foreground/20" />
        </div>

        {/* Experience */}
        <div className="space-y-1.5">
          <div
            className="h-1.5 w-1/5 rounded"
            style={{ background: resolvedAccent, opacity: 0.85 }}
          />
          <div className="space-y-0.5">
            <div className="h-1 w-[80%] rounded bg-muted-foreground/20" />
            <div className="h-1 w-[75%] rounded bg-muted-foreground/20" />
          </div>
        </div>
      </div>
    );
  }

  // Layout 4: Creative Layout (Circular avatar placeholder, thin accents)
  if (tid === "creative") {
    return (
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card p-3 shadow-soft flex flex-col space-y-3">
        {/* Circular Avatar Row */}
        <div className="flex items-center gap-1.5">
          <div
            className="h-6.5 w-6.5 rounded-full shrink-0 flex items-center justify-center text-[7px] font-bold"
            style={{
              backgroundColor: `${resolvedAccent}25`,
              color: resolvedAccent,
              border: `1px solid ${resolvedAccent}40`,
            }}
          >
            {name
              ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : "JS"}
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            {hasData && name ? (
              <div
                className="text-[7.5px] font-extrabold truncate"
                style={{ color: resolvedAccent }}
              >
                {name}
              </div>
            ) : (
              <div className="h-2 w-16 rounded bg-muted-foreground/35" />
            )}
            {hasData && role ? (
              <div className="text-[4px] text-muted-foreground truncate leading-none">{role}</div>
            ) : (
              <div className="h-1 w-10 rounded bg-muted-foreground/20" />
            )}
          </div>
        </div>

        <div className="h-[0.5px] w-full" style={{ backgroundColor: `${resolvedAccent}30` }} />

        {/* Content Section */}
        <div className="space-y-1.5">
          <div
            className="h-1.5 w-1/4 rounded bg-brand-soft"
            style={{ backgroundColor: `${resolvedAccent}15` }}
          >
            <div className="h-1 w-2/3 rounded mx-1" style={{ background: resolvedAccent }} />
          </div>
          <div className="space-y-0.5">
            <div className="h-1 w-[90%] rounded bg-muted-foreground/20" />
            <div className="h-1 w-[80%] rounded bg-muted-foreground/20" />
          </div>
        </div>
      </div>
    );
  }

  // Layout 5: ATS Professional Layout (Centered name and content columns)
  return (
    <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card p-3 shadow-soft flex flex-col justify-start space-y-2.5 text-center">
      {/* Centered details */}
      <div className="space-y-0.5">
        {hasData && name ? (
          <div
            className="text-[7px] font-extrabold tracking-tight uppercase truncate"
            style={{ color: resolvedAccent }}
          >
            {name}
          </div>
        ) : (
          <div className="mx-auto h-2.5 w-1/3 rounded bg-muted-foreground/35" />
        )}
        {hasData && role ? (
          <div className="text-[4.5px] text-muted-foreground truncate">{role}</div>
        ) : (
          <div className="mx-auto h-1 w-1/2 rounded bg-muted-foreground/20" />
        )}
        <div className="mx-auto mt-1 h-[0.5px] w-[90%] rounded bg-muted-foreground/15" />
      </div>

      {/* Summary */}
      <div className="space-y-0.5">
        <div
          className="mx-auto h-1.5 w-1/4 rounded"
          style={{ background: resolvedAccent, opacity: 0.85 }}
        />
        <div className="space-y-0.5 pt-0.5">
          <div className="mx-auto h-1 w-[85%] rounded bg-muted-foreground/20" />
          <div className="mx-auto h-1 w-[80%] rounded bg-muted-foreground/20" />
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-0.5 pt-0.5">
        <div
          className="mx-auto h-1.5 w-1/3 rounded"
          style={{ background: resolvedAccent, opacity: 0.85 }}
        />
        <div className="space-y-1 mt-1 text-left px-2">
          <div className="flex gap-1 items-center">
            <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30 shrink-0" />
            <div className="h-1 w-[85%] rounded bg-muted-foreground/20" />
          </div>
          <div className="flex gap-1 items-center">
            <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30 shrink-0" />
            <div className="h-1 w-[75%] rounded bg-muted-foreground/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
