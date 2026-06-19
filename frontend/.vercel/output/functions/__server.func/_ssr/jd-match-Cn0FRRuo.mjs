import { o as __toESM } from "../_runtime.mjs";
import { t as AppShell, u as useResumes } from "./app-shell-q8BzYArD.mjs";
import { t as apiClient } from "./apiClient-DEBqcuWX.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-CHSNwFnT.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { P as LoaderCircle, v as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Textarea } from "./textarea-DTF9kA1O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jd-match-Cn0FRRuo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JDMatchPage() {
	const r = useResumes()[0];
	const [jd, setJd] = import_react.useState("");
	const [busy, setBusy] = import_react.useState(false);
	const [result, setResult] = import_react.useState(null);
	const resumeText = import_react.useMemo(() => {
		if (!r) return "";
		const d = r.data;
		return [
			`${d.fullName} — ${d.email} ${d.phone} ${d.location}`,
			`Summary: ${d.summary}`,
			"Experience:",
			...d.experience.flatMap((x) => [`- ${x.role} @ ${x.company} (${x.period})`, ...x.bullets.map((b) => `  • ${b}`)]),
			"Projects:",
			...d.projects.flatMap((p) => [`- ${p.name} (${p.tools})`, ...p.bullets.map((b) => `  • ${b}`)]),
			"Education: " + d.education.map((e) => `${e.degree}, ${e.school} (${e.year})`).join("; "),
			"Skills: " + d.skills.map((s) => `${s.category}: ${s.items}`).join(" | ")
		].join("\n");
	}, [r]);
	async function go() {
		if (jd.trim().length < 20) {
			toast.error("Paste a longer job description");
			return;
		}
		if (!resumeText) {
			toast.error("Create a resume first");
			return;
		}
		setBusy(true);
		setResult(null);
		try {
			setResult(await apiClient.post("/ai/job-match", {
				jobDescription: jd,
				resumeText
			}));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "AI failed — check backend connection");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full px-4 py-6 md:px-8 md:py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold tracking-tight",
				children: "Job Description Match"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Paste a job description and we'll score your resume, surface missing keywords, and suggest rewrites."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-semibold",
							children: "Job description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: jd,
							onChange: (e) => setJd(e.target.value),
							rows: 14,
							placeholder: "Paste the JD here…",
							className: "mt-2 rounded-xl"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: go,
							disabled: busy,
							className: "mt-3 h-11 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
							children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Analyzing…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-2 h-4 w-4" }), " Analyze match"] })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4 min-h-[420px]",
					children: [!result && !busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center text-sm text-muted-foreground",
						children: "Results appear here."
					}), result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-20 w-20 place-items-center rounded-full border-4 border-brand bg-brand-soft",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-2xl font-extrabold text-brand",
										children: [result.score, "%"]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold",
									children: "Match score"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Higher = better keyword + skill overlap"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
								title: "Matched keywords",
								items: result.matchedKeywords,
								tone: "success"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
								title: "Missing keywords",
								items: result.missingKeywords,
								tone: "warn"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
								title: "Missing skills",
								items: result.missingSkills,
								tone: "warn"
							}),
							result.suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold mb-1.5",
								children: "Suggestions"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5",
								children: result.suggestions.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "text-sm text-foreground/90",
									children: ["• ", s]
								}, i))
							})] })
						]
					})]
				})]
			})
		]
	}) });
}
function Block({ title, items, tone }) {
	if (!items.length) return null;
	const cls = tone === "success" ? "bg-[oklch(0.94_0.06_150)] text-[oklch(0.35_0.1_150)]" : "bg-[oklch(0.95_0.08_70)] text-[oklch(0.4_0.12_60)]";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm font-bold mb-1.5",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5",
		children: items.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`,
			children: k
		}, k))
	})] });
}
//#endregion
export { JDMatchPage as component };
