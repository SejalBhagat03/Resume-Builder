import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Resume Builder Pro" },
      {
        name: "description",
        content: "Build professional, ATS-friendly resumes in minutes — step by step.",
      },
      { name: "author", content: "Resume Builder Pro" },
      { property: "og:title", content: "Resume Builder Pro" },
      {
        property: "og:description",
        content: "Build professional, ATS-friendly resumes in minutes — step by step.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23804e39'/%3E%3Crect x='25' y='20' width='50' height='60' rx='5' fill='white'/%3E%3Cline x1='35' y1='35' x2='65' y2='35' stroke='%23804e39' stroke-width='6' stroke-linecap='round'/%3E%3Cline x1='35' y1='50' x2='65' y2='50' stroke='%23804e39' stroke-width='6' stroke-linecap='round'/%3E%3Cline x1='35' y1='65' x2='55' y2='65' stroke='%23804e39' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Auth gate: redirect to /auth if not signed in (except on /auth itself) */
function AuthGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check initial session — gracefully handle Supabase config errors in local dev
    if (typeof window !== "undefined" && localStorage.getItem("rbp.auth.bypass") === "true") {
      setChecked(true);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          // Supabase not properly configured (e.g. missing anon key) — allow access
          console.warn("[AuthGate] Supabase getSession error:", error.message);
          setChecked(true);
          return;
        }
        if (!data.session && pathname !== "/auth") {
          navigate({ to: "/auth" });
        }
        setChecked(true);
      })
      .catch((err) => {
        // Network / config error — don't block the UI
        console.warn("[AuthGate] Supabase unreachable:", err);
        setChecked(true);
      });

    // Listen for auth state changes
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session && pathname !== "/auth") {
          navigate({ to: "/auth" });
        }
      });
      subscription = listener.subscription;
    } catch (err) {
      console.warn("[AuthGate] onAuthStateChange unavailable:", err);
    }

    return () => subscription?.unsubscribe();
  }, [navigate, pathname]);

  // While checking, show nothing (avoids flash of protected content)
  if (!checked && pathname !== "/auth") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </AuthGate>
      <Toaster />
    </QueryClientProvider>
  );
}
