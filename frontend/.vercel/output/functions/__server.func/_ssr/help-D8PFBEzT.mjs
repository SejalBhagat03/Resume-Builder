import { t as AppShell } from "./app-shell-q8BzYArD.mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/help-D8PFBEzT.js
var import_jsx_runtime = require_jsx_runtime();
function HelpPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full px-4 py-6 md:px-8 md:py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-extrabold tracking-tight",
			children: "Help & Support"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 space-y-3",
			children: [
				{
					q: "How do I create my first resume?",
					a: "Click Create New Resume on the dashboard and follow the 3-step wizard."
				},
				{
					q: "What is the ATS score?",
					a: "An estimated score (0–100) for how well your resume passes automated screening."
				},
				{
					q: "Can I import an existing resume?",
					a: "Yes — go to Import Resume and upload a PDF, DOCX, or TXT file."
				}
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "cursor-pointer text-base font-semibold",
					children: i.q
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: i.a
				})]
			}, i.q))
		})]
	}) });
}
//#endregion
export { HelpPage as component };
