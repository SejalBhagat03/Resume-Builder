import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DWNMNgqv.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Input, t as Button } from "./button-CHSNwFnT.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { X as Eye, Z as EyeOff, pt as ArrowRight, q as FileText, v as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-DHSY72pW.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DMkgdeHs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	if (!(typeof window !== "undefined" && window.self !== window.top)) try {
		const supabaseProvider = provider === "microsoft" ? "azure" : provider;
		if (supabaseProvider !== "lovable") {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: supabaseProvider,
				options: {
					redirectTo: opts?.redirect_uri || window.location.origin,
					queryParams: opts?.extraParams
				}
			});
			if (error) return { error };
			return {
				error: null,
				redirected: true
			};
		}
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = import_react.useState("signin");
	const [email, setEmail] = import_react.useState("");
	const [password, setPassword] = import_react.useState("");
	const [name, setName] = import_react.useState("");
	const [busy, setBusy] = import_react.useState(false);
	const [showPass, setShowPass] = import_react.useState(false);
	import_react.useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: "/" });
		});
	}, [navigate]);
	async function onGoogle() {
		setBusy(true);
		const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
		if (res.error) {
			toast.error("Google sign-in failed");
			setBusy(false);
			return;
		}
		if (res.redirected) return;
		navigate({ to: "/" });
	}
	async function onEmail(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { full_name: name }
					}
				});
				if (error) throw error;
				toast.success("Account created! Check your email to confirm.");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
			navigate({ to: "/" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Authentication failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-brand/8 blur-[100px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex min-h-screen items-center justify-center px-4 py-6 sm:py-10 md:py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 sm:mb-6 md:mb-8 flex flex-col items-center gap-2 sm:gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 place-items-center rounded-xl sm:rounded-2xl bg-brand text-brand-foreground shadow-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-xl sm:text-2xl font-extrabold tracking-tight text-foreground",
									children: "Resume Builder Pro"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs sm:text-sm text-muted-foreground",
									children: "Build resumes that get you hired"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-7 md:p-8 shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4 sm:mb-5 md:mb-6 flex rounded-xl bg-muted p-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setMode("signin"),
										className: `flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${mode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
										children: "Sign In"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setMode("signup"),
										className: `flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
										children: "Sign Up"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4 sm:mb-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg sm:text-xl font-extrabold text-foreground",
										children: mode === "signin" ? "Welcome back 👋" : "Create your account"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs sm:text-sm text-muted-foreground",
										children: mode === "signin" ? "Sign in to continue building your resume." : "Free forever — no credit card required."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: onGoogle,
									disabled: busy,
									variant: "outline",
									className: "h-10 sm:h-11 w-full rounded-xl border-border hover:bg-muted text-xs sm:text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										className: "mr-2 h-4 w-4",
										viewBox: "0 0 24 24",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												fill: "#4285f4",
												d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												fill: "#34a853",
												d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												fill: "#fbbc05",
												d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												fill: "#ea4335",
												d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
											})
										]
									}), "Continue with Google"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "my-3.5 sm:my-4 md:my-5 flex items-center gap-3 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
										" or ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: onEmail,
									className: "space-y-2.5 sm:space-y-3",
									children: [
										mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1 sm:space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs sm:text-sm font-semibold",
												children: "Full name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: name,
												onChange: (e) => setName(e.target.value),
												placeholder: "Jane Doe",
												required: true,
												className: "h-10 sm:h-11 rounded-xl text-xs sm:text-sm"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1 sm:space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs sm:text-sm font-semibold",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "email",
												value: email,
												onChange: (e) => setEmail(e.target.value),
												placeholder: "you@example.com",
												required: true,
												className: "h-10 sm:h-11 rounded-xl text-xs sm:text-sm"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1 sm:space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs sm:text-sm font-semibold",
												children: "Password"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: showPass ? "text" : "password",
													minLength: 6,
													value: password,
													onChange: (e) => setPassword(e.target.value),
													placeholder: "Min. 6 characters",
													required: true,
													className: "h-10 sm:h-11 rounded-xl pr-11 text-xs sm:text-sm"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													tabIndex: -1,
													onClick: () => setShowPass(!showPass),
													className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
													children: showPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											disabled: busy,
											className: "mt-1 h-10 sm:h-11 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-xs sm:text-sm font-bold",
											children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center justify-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-brand-foreground border-t-transparent" }), "Please wait…"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center justify-center gap-2",
												children: [mode === "signin" ? "Sign in" : "Create account", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
											})
										})
									]
								}),
								typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "my-3 flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-wider",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Local Development" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										onClick: () => {
											localStorage.setItem("rbp.auth.bypass", "true");
											toast.success("Developer mode sign-in active.");
											navigate({ to: "/" });
										},
										className: "h-10 sm:h-11 w-full rounded-xl border-dashed border-brand/40 text-brand hover:bg-brand-soft/20 hover:text-brand hover:border-brand/70 text-xs sm:text-sm",
										children: "Bypass Authentication (Dev Mode)"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 sm:mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground",
							children: [
								"ATS-Optimised",
								"PDF Export",
								"AI Suggestions"
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-brand" }),
									" ",
									f
								]
							}, f))
						})
					]
				})
			})
		]
	});
}
//#endregion
export { AuthPage as component };
