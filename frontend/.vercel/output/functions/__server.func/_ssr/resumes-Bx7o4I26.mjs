import { o as __toESM } from "../_runtime.mjs";
import { n as TEMPLATES, o as deleteResume, t as AppShell, u as useResumes } from "./app-shell-q8BzYArD.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Input, t as Button } from "./button-CHSNwFnT.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Download, p as Trash2, w as Plus, y as Search } from "../_libs/lucide-react.mjs";
import { n as ResumeThumb, t as CreateResumeWizard } from "./create-resume-wizard-BCwIZehE.mjs";
import { t as RelativeTime } from "./relative-time-Btn9Um9f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resumes-Bx7o4I26.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResumesPage() {
	const resumes = useResumes();
	const [q, setQ] = import_react.useState("");
	const [wizard, setWizard] = import_react.useState(false);
	const navigate = useNavigate();
	const filtered = resumes.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full px-4 py-6 md:px-8 md:py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-extrabold tracking-tight",
					children: "My Resumes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						resumes.length,
						" resume",
						resumes.length === 1 ? "" : "s",
						" total"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setWizard(true),
					className: "h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Create New"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-5 max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search by resume title...",
					className: "h-11 rounded-xl bg-card pl-9"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
				children: filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeCard, {
					resume: r,
					onOpen: () => navigate({
						to: "/editor/$id",
						params: { id: r.id }
					}),
					onDelete: () => deleteResume(r.id)
				}, r.id))
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateResumeWizard, {
		open: wizard,
		onOpenChange: setWizard
	})] });
}
function ResumeCard({ resume, onOpen, onDelete }) {
	const templateName = TEMPLATES.find((t) => t.id === resume.template)?.name ?? resume.template;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group flex flex-col rounded-2xl border border-border bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
		onClick: onOpen,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeThumb, { resume })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 truncate text-sm font-bold",
				children: resume.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 inline-block w-fit rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand",
				children: templateName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: ["Updated ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelativeTime, { ts: resume.updatedAt })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-1.5",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: onOpen,
						size: "sm",
						variant: "outline",
						className: "h-8 flex-1 rounded-lg text-xs",
						children: "Edit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "h-8 flex-1 rounded-lg bg-foreground text-background text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-3 w-3" }), " PDF"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "outline",
						className: "h-8 w-8 rounded-lg",
						onClick: () => onDelete(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
					})
				]
			})
		]
	});
}
//#endregion
export { ResumesPage as component };
