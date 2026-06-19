import { o as __toESM } from "../_runtime.mjs";
import { n as TEMPLATES, t as AppShell, u as useResumes } from "./app-shell-q8BzYArD.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as cn } from "./button-CHSNwFnT.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { w as Plus } from "../_libs/lucide-react.mjs";
import { n as ResumeThumb, t as CreateResumeWizard } from "./create-resume-wizard-BCwIZehE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/templates-Ctkq_4Ff.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TemplatesPage() {
	const resumes = useResumes();
	const navigate = useNavigate();
	const [wizard, setWizard] = import_react.useState(false);
	const [preselectedTemplate, setPreselectedTemplate] = import_react.useState();
	function resumeForTemplate(templateId) {
		return resumes.filter((r) => r.template === templateId).sort((a, b) => b.updatedAt - a.updatedAt)[0];
	}
	function handleTemplateClick(templateId) {
		const existing = resumeForTemplate(templateId);
		if (existing) navigate({
			to: "/editor/$id",
			params: { id: existing.id }
		});
		else {
			setPreselectedTemplate(templateId);
			setWizard(true);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full px-4 py-6 md:px-8 md:py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold tracking-tight",
				children: "Templates"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Choose a template to start your next resume. Cards with your data are shown if you've used that template."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
				children: [TEMPLATES.map((t) => {
					const userResume = resumeForTemplate(t.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => handleTemplateClick(t.id),
						className: cn("group relative flex flex-col rounded-2xl border bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md text-left", userResume ? "border-brand/40 ring-1 ring-brand/20" : "border-border"),
						children: [
							userResume && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-3 top-3 z-10 rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-foreground shadow",
								children: "Your Resume"
							}),
							!userResume && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-3 top-3 z-10 rounded-full border border-border bg-card px-2 py-0.5 text-[9px] font-semibold text-muted-foreground",
								children: "+ New"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeThumb, {
								resume: userResume,
								templateId: t.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 text-sm font-bold",
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: t.tagline
							}),
							userResume && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 truncate text-[10px] text-brand font-medium",
								children: userResume.title
							})
						]
					}, t.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setWizard(true),
					className: "group flex aspect-[3/4.4] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand/40 bg-brand-soft/30 p-4 text-center transition-all hover:border-brand hover:bg-brand-soft/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-12 w-12 place-items-center rounded-full bg-brand text-brand-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-bold text-brand",
						children: "Create New"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Start from any template"
					})] })]
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateResumeWizard, {
		open: wizard,
		onOpenChange: setWizard
	})] });
}
//#endregion
export { TemplatesPage as component };
