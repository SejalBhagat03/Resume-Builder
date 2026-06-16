import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
          {/* Profile Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-base font-bold text-foreground">Profile Information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Full name</Label>
                <Input defaultValue="Sejal Bhagat" className="mt-1.5 h-11 rounded-xl" />
              </div>
              <div>
                <Label>Email</Label>
                <Input defaultValue="sejal@example.com" className="mt-1.5 h-11 rounded-xl" />
              </div>
            </div>
            <Button className="mt-5 h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90">
              Save changes
            </Button>
          </div>

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
