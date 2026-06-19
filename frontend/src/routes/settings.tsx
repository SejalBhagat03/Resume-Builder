import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { setActiveResumeUser } from "@/lib/resume-store";
import { setActiveProfileUser } from "@/lib/profile-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Resume Builder Pro" },
      { name: "description", content: "Manage your account, preferences, and plan." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      // Reset in-memory user scopes before signing out
      setActiveResumeUser(null);
      setActiveProfileUser(null);
      localStorage.removeItem("rbp.auth.bypass");
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out error:", err);
    }
    toast.success("Signed out successfully.");
    navigate({ to: "/auth" });
  }

  return (
    <AppShell>
      <div className="w-full px-4 py-6 md:px-8 md:py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>

        <div className="mt-6 space-y-6">
          {/* Account Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-base font-bold text-destructive">Account Management</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sign out of your active session.</p>
            <div className="mt-5">
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="h-11 rounded-xl bg-destructive hover:bg-destructive/90"
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
