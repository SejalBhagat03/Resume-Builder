import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — Resume Builder Pro" },
      { name: "description", content: "Guides, FAQs, and contact for Resume Builder Pro." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const items = [
    {
      q: "How do I create my first resume?",
      a: "Click Create New Resume on the dashboard and follow the 3-step wizard.",
    },
    {
      q: "What is the ATS score?",
      a: "An estimated score (0–100) for how well your resume passes automated screening.",
    },
    {
      q: "Can I import an existing resume?",
      a: "Yes — go to Import Resume and upload a PDF, DOCX, or TXT file.",
    },
  ];
  return (
    <AppShell>
      <div className="w-full px-4 py-6 md:px-8 md:py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Help & Support</h1>
        <div className="mt-6 space-y-3">
          {items.map((i) => (
            <details key={i.q} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <summary className="cursor-pointer text-base font-semibold">{i.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{i.a}</p>
            </details>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
