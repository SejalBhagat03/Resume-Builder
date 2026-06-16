import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Resume Builder Pro" },
      {
        name: "description",
        content: "Sign in or create an account to build and save your resumes.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function onGoogle() {
    setBusy(true);
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (res.error) {
      toast.error("Google sign-in failed");
      setBusy(false);
      return;
    }
    if (res.redirected) return;
    navigate({ to: "/" });
  }

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-brand/8 blur-[100px]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-brand-foreground shadow-soft">
              <FileText className="h-7 w-7" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                Resume Builder Pro
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Build resumes that get you hired
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            {/* Tab switcher */}
            <div className="mb-6 flex rounded-xl bg-muted p-1">
              <button
                onClick={() => setMode("signin")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  mode === "signin"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  mode === "signup"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Heading */}
            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-foreground">
                {mode === "signin" ? "Welcome back 👋" : "Create your account"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "signin"
                  ? "Sign in to continue building your resume."
                  : "Free forever — no credit card required."}
              </p>
            </div>

            {/* Google button */}
            <Button
              onClick={onGoogle}
              disabled={busy}
              variant="outline"
              className="h-11 w-full rounded-xl border-border hover:bg-muted"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285f4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34a853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#ea4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>

            {/* Email form */}
            <form onSubmit={onEmail} className="space-y-3">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Full name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Password</Label>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    className="h-11 rounded-xl pr-11"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={busy}
                className="mt-1 h-11 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
              >
                {busy ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-foreground border-t-transparent" />
                    Please wait…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === "signin" ? "Sign in" : "Create account"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {typeof window !== "undefined" &&
              (window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1") && (
                <div className="mt-4">
                  <div className="my-4 flex items-center gap-3 text-[11px] text-muted-foreground uppercase tracking-wider">
                    <div className="h-px flex-1 bg-border" />
                    <span>Local Development</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      localStorage.setItem("rbp.auth.bypass", "true");
                      toast.success("Developer mode sign-in active.");
                      navigate({ to: "/" });
                    }}
                    className="h-11 w-full rounded-xl border-dashed border-brand/40 text-brand hover:bg-brand-soft/20 hover:text-brand hover:border-brand/70"
                  >
                    Bypass Authentication (Dev Mode)
                  </Button>
                </div>
              )}
          </div>

          {/* Feature highlights */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            {["ATS-Optimised", "PDF Export", "AI Suggestions"].map((f) => (
              <span key={f} className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-brand" /> {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
