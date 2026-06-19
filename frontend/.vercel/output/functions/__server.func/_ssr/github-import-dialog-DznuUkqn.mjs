import { o as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Input, r as cn, t as Button } from "./button-CHSNwFnT.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { P as LoaderCircle, U as Github, W as GitFork, _ as Star, at as Check, i as X, y as Search } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-DHSY72pW.mjs";
import { a as Portal, i as Overlay, n as Content, o as Root, r as Description, s as Title, t as Close } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/github-import-dialog-DznuUkqn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Root;
var DialogPortal = Portal;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = Overlay.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = Title.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = Description.displayName;
function repoToProject(r) {
	const tools = [r.language, ...r.topics ?? []].filter(Boolean).slice(0, 6).join(", ");
	const bullets = [];
	if (r.description) bullets.push(r.description);
	if (r.stargazers_count > 0) bullets.push(`Earned ${r.stargazers_count}★ and ${r.forks_count} forks on GitHub.`);
	bullets.push(`Source: ${r.html_url}`);
	return {
		name: r.name,
		tools: tools || "GitHub project",
		bullets
	};
}
function GithubImportDialog({ open, onOpenChange, onImport, initialUsername }) {
	const [username, setUsername] = import_react.useState("");
	const [loading, setLoading] = import_react.useState(false);
	const [repos, setRepos] = import_react.useState([]);
	const [selected, setSelected] = import_react.useState(/* @__PURE__ */ new Set());
	const [filter, setFilter] = import_react.useState("");
	import_react.useEffect(() => {
		if (open && initialUsername) setUsername(initialUsername);
	}, [open, initialUsername]);
	import_react.useEffect(() => {
		if (!open) setTimeout(() => {
			setRepos([]);
			setSelected(/* @__PURE__ */ new Set());
			setFilter("");
		}, 200);
	}, [open]);
	const fetchRepos = async () => {
		const u = username.trim();
		if (!u) return;
		setLoading(true);
		try {
			const res = await fetch(`https://api.github.com/users/${encodeURIComponent(u)}/repos?per_page=100&sort=updated`);
			if (!res.ok) {
				if (res.status === 404) throw new Error(`No GitHub user "${u}" found.`);
				if (res.status === 403) throw new Error("GitHub rate limit reached — try again in a minute.");
				throw new Error(`GitHub error (${res.status})`);
			}
			const cleaned = (await res.json()).filter((r) => !r.full_name.endsWith("/.github")).sort((a, b) => b.stargazers_count - a.stargazers_count);
			setRepos(cleaned);
			if (cleaned.length === 0) toast.info("No public repositories found for this user.");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	};
	const toggle = (id) => setSelected((s) => {
		const n = new Set(s);
		if (n.has(id)) n.delete(id);
		else n.add(id);
		return n;
	});
	const visible = filter ? repos.filter((r) => (r.name + " " + (r.description ?? "")).toLowerCase().includes(filter.toLowerCase())) : repos;
	const handleImport = () => {
		const picks = repos.filter((r) => selected.has(r.id)).map(repoToProject);
		if (picks.length === 0) {
			toast.error("Select at least one repository.");
			return;
		}
		onImport(picks);
		onOpenChange(false);
		toast.success(`Imported ${picks.length} project${picks.length === 1 ? "" : "s"} from GitHub.`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl gap-0 overflow-hidden rounded-3xl border-border p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "space-y-1 px-7 pt-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-11 w-11 place-items-center rounded-2xl bg-foreground text-background",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-xl font-bold",
							children: "Import from GitHub"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-sm",
							children: "Enter a GitHub username — we'll list their public repositories so you can add them as projects."
						})] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-7 py-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "gh-user",
							children: "GitHub username"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "gh-user",
								value: username,
								onChange: (e) => setUsername(e.target.value),
								placeholder: "e.g. torvalds",
								className: "h-11 rounded-xl",
								onKeyDown: (e) => {
									if (e.key === "Enter") fetchRepos();
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								onClick: fetchRepos,
								disabled: loading || !username.trim(),
								className: "h-11 shrink-0 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
								children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-1.5 h-4 w-4" }), "Fetch repos"]
							})]
						}),
						repos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: filter,
								onChange: (e) => setFilter(e.target.value),
								placeholder: "Filter repositories...",
								className: "h-10 rounded-xl"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0 text-xs text-muted-foreground",
								children: [
									selected.size,
									" selected · ",
									repos.length,
									" repos"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 max-h-80 space-y-2 overflow-y-auto rounded-2xl border border-border bg-muted/30 p-2",
							children: [visible.map((r) => {
								const isSel = selected.has(r.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => toggle(r.id),
									className: cn("flex w-full items-start gap-3 rounded-xl border-2 bg-card p-3 text-left transition-all", isSel ? "border-brand bg-brand-soft/40" : "border-transparent hover:border-brand/30"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2", isSel ? "border-brand bg-brand text-brand-foreground" : "border-border"),
										children: isSel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-sm font-semibold",
												children: r.name
											}),
											r.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-0.5 line-clamp-2 block text-xs text-muted-foreground",
												children: r.description
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
												children: [
													r.language && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-brand-soft px-2 py-0.5 text-brand",
														children: r.language
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3" }),
															" ",
															r.stargazers_count
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitFork, { className: "h-3 w-3" }),
															" ",
															r.forks_count
														]
													})
												]
											})
										]
									})]
								}, r.id);
							}), visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-6 text-center text-sm text-muted-foreground",
								children: "No repositories match."
							})]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "flex items-center justify-between gap-3 border-t border-border bg-background/60 px-7 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						className: "h-11 rounded-xl px-6",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleImport,
						disabled: selected.size === 0,
						className: "h-11 rounded-xl bg-brand px-6 text-brand-foreground hover:bg-brand/90",
						children: ["Import ", selected.size > 0 ? `(${selected.size})` : ""]
					})]
				})
			]
		})
	});
}
//#endregion
export { DialogTitle as a, DialogHeader as i, DialogContent as n, GithubImportDialog as o, DialogDescription as r, Dialog as t };
