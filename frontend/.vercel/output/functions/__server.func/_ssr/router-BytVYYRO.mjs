import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DWNMNgqv.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$11 } from "./routes-YDgTTHTW.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BytVYYRO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DoH4nJz1.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$10 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Resume Builder Pro" },
			{
				name: "description",
				content: "Build professional, ATS-friendly resumes in minutes — step by step."
			},
			{
				name: "author",
				content: "Resume Builder Pro"
			},
			{
				property: "og:title",
				content: "Resume Builder Pro"
			},
			{
				property: "og:description",
				content: "Build professional, ATS-friendly resumes in minutes — step by step."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23804e39'/%3E%3Crect x='25' y='20' width='50' height='60' rx='5' fill='white'/%3E%3Cline x1='35' y1='35' x2='65' y2='35' stroke='%23804e39' stroke-width='6' stroke-linecap='round'/%3E%3Cline x1='35' y1='50' x2='65' y2='50' stroke='%23804e39' stroke-width='6' stroke-linecap='round'/%3E%3Cline x1='35' y1='65' x2='55' y2='65' stroke='%23804e39' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
/** Auth gate: redirect to /auth if not signed in (except on /auth itself) */
function AuthGate({ children }) {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [checked, setChecked] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && localStorage.getItem("rbp.auth.bypass") === "true") {
			setChecked(true);
			return;
		}
		supabase.auth.getSession().then(({ data, error }) => {
			if (error) {
				console.warn("[AuthGate] Supabase getSession error:", error.message);
				setChecked(true);
				return;
			}
			if (!data.session && pathname !== "/auth") navigate({ to: "/auth" });
			setChecked(true);
		}).catch((err) => {
			console.warn("[AuthGate] Supabase unreachable:", err);
			setChecked(true);
		});
		let subscription;
		try {
			const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
				if (!session && pathname !== "/auth") navigate({ to: "/auth" });
			});
			subscription = listener.subscription;
		} catch (err) {
			console.warn("[AuthGate] onAuthStateChange unavailable:", err);
		}
		return () => subscription?.unsubscribe();
	}, [navigate, pathname]);
	if (!checked && pathname !== "/auth") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-muted-foreground",
				children: "Loading…"
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function RootComponent() {
	const { queryClient } = Route$10.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
var $$splitComponentImporter$9 = () => import("./templates-Ctkq_4Ff.mjs");
var Route$9 = createFileRoute("/templates")({
	head: () => ({ meta: [{ title: "Templates — Resume Builder Pro" }, {
		name: "description",
		content: "Pick from professionally designed, ATS-friendly resume templates."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./settings-DMjgdVbH.mjs");
var Route$8 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — Resume Builder Pro" }, {
		name: "description",
		content: "Manage your account, preferences, and plan."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./resumes-Bx7o4I26.mjs");
var Route$7 = createFileRoute("/resumes")({
	head: () => ({ meta: [{ title: "My Resumes — Resume Builder Pro" }, {
		name: "description",
		content: "Browse, edit, download and manage all of your resumes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./profile-r-2kt4wq.mjs");
var Route$6 = createFileRoute("/profile")({
	head: () => ({ meta: [{ title: "Your Profile — Resume Builder Pro" }, {
		name: "description",
		content: "Your single career profile — personal info, experience, projects, skills, and more. Reuse it across every resume."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./jd-match-Cn0FRRuo.mjs");
var Route$5 = createFileRoute("/jd-match")({
	head: () => ({ meta: [{ title: "JD Match — Resume Builder Pro" }, {
		name: "description",
		content: "Match your resume against a job description with AI."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./import-CU8McnZx.mjs");
var Route$4 = createFileRoute("/import")({
	head: () => ({ meta: [{ title: "Import Resume — Resume Builder Pro" }, {
		name: "description",
		content: "Import an existing resume from PDF, DOCX, or your GitHub profile."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./help-D8PFBEzT.mjs");
var Route$3 = createFileRoute("/help")({
	head: () => ({ meta: [{ title: "Help & Support — Resume Builder Pro" }, {
		name: "description",
		content: "Guides, FAQs, and contact for Resume Builder Pro."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./auth-DMkgdeHs.mjs");
var Route$2 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — Resume Builder Pro" }, {
		name: "description",
		content: "Sign in or create an account to build and save your resumes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./ats-X-L7DIkZ.mjs");
var Route$1 = createFileRoute("/ats")({
	head: () => ({ meta: [{ title: "ATS Analysis — Resume Builder Pro" }, {
		name: "description",
		content: "See how your resumes score against Applicant Tracking Systems."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./editor._id-lqCgBkE5.mjs");
var Route = createFileRoute("/editor/$id")({
	head: () => ({ meta: [{ title: "Edit Resume — Resume Builder Pro" }, {
		name: "description",
		content: "Build your resume step by step — Profile, Education, Experience, Projects and Skills."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var TemplatesRoute = Route$9.update({
	id: "/templates",
	path: "/templates",
	getParentRoute: () => Route$10
});
var SettingsRoute = Route$8.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$10
});
var ResumesRoute = Route$7.update({
	id: "/resumes",
	path: "/resumes",
	getParentRoute: () => Route$10
});
var ProfileRoute = Route$6.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$10
});
var JdMatchRoute = Route$5.update({
	id: "/jd-match",
	path: "/jd-match",
	getParentRoute: () => Route$10
});
var ImportRoute = Route$4.update({
	id: "/import",
	path: "/import",
	getParentRoute: () => Route$10
});
var HelpRoute = Route$3.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => Route$10
});
var AuthRoute = Route$2.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$10
});
var AtsRoute = Route$1.update({
	id: "/ats",
	path: "/ats",
	getParentRoute: () => Route$10
});
var rootRouteChildren = {
	IndexRoute: Route$11.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$10
	}),
	AtsRoute,
	AuthRoute,
	HelpRoute,
	ImportRoute,
	JdMatchRoute,
	ProfileRoute,
	ResumesRoute,
	SettingsRoute,
	TemplatesRoute,
	EditorIdRoute: Route.update({
		id: "/editor/$id",
		path: "/editor/$id",
		getParentRoute: () => Route$10
	})
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
