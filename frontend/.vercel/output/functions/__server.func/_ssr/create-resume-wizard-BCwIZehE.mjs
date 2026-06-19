import { o as __toESM } from "../_runtime.mjs";
import { a as dataFromProfile, i as createResume, l as saveResume, n as TEMPLATES } from "./app-shell-q8BzYArD.mjs";
import { h as require_react, m as require_jsx_runtime, n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Input, r as cn, t as Button } from "./button-CHSNwFnT.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as Pencil, K as FileUp, U as Github, V as GraduationCap, at as Check, ct as BookOpen, ft as ArrowUp, ht as ArrowDown, mt as ArrowLeft, pt as ArrowRight, q as FileText, s as User, st as Briefcase, v as Sparkles, x as Rocket } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-DHSY72pW.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as GithubImportDialog, r as DialogDescription, t as Dialog } from "./github-import-dialog-DznuUkqn.mjs";
import { n as useProfile } from "./profile-store-PZTXlT2r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-resume-wizard-BCwIZehE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
function templateAccent(id) {
	switch (id) {
		case "ats-professional": return "oklch(0.45 0.12 250)";
		case "modern": return "oklch(0.55 0.18 30)";
		case "minimal": return "oklch(0.35 0.02 60)";
		case "creative": return "oklch(0.55 0.2 320)";
		case "two-column": return "oklch(0.45 0.15 160)";
		default: return "var(--brand)";
	}
}
/** Clamp text to a max length for thumbnail readability */
function clip(s, max = 38) {
	if (!s) return "";
	return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
function ResumeThumb({ accent, resume, templateId, demoData }) {
	const tid = templateId ?? resume?.template ?? "ats-professional";
	const resolvedAccent = accent ?? templateAccent(tid);
	const d = resume?.data ?? demoData ?? null;
	const name = d?.fullName ?? "";
	const email = d?.email ?? "";
	const role = d?.experience?.[0]?.role ?? "";
	const company = d?.experience?.[0]?.company ?? "";
	const bullet0 = d?.experience?.[0]?.bullets?.[0] ?? "";
	const role2 = d?.experience?.[1]?.role ?? "";
	const school = d?.education?.[0]?.school ?? "";
	const degree = d?.education?.[0]?.degree ?? "";
	const skill1 = d?.skills?.[0]?.items ?? "";
	const summary = d?.summary ?? "";
	if (tid === "two-column") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card shadow-soft flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-[33%] p-2 flex flex-col gap-2 shrink-0 border-r border-border",
			style: { backgroundColor: `${resolvedAccent}10` },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-7 w-7 rounded-full mx-auto flex items-center justify-center text-[6px] font-bold shrink-0",
					style: {
						backgroundColor: `${resolvedAccent}25`,
						border: `1.5px solid ${resolvedAccent}50`,
						color: resolvedAccent
					},
					children: name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "AJ"
				}),
				name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[5px] font-extrabold text-center leading-tight truncate px-0.5",
					style: { color: resolvedAccent },
					children: [
						name.split(" ")[0],
						"\n",
						name.split(" ").slice(1).join(" ")
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-1.5 w-3/4 rounded bg-muted-foreground/30" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[0.5px] w-full",
					style: { backgroundColor: `${resolvedAccent}25` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 w-2/3 rounded",
					style: {
						background: resolvedAccent,
						opacity: .8
					}
				}),
				skill1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[4px] text-muted-foreground leading-tight",
					children: clip(skill1, 22)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-full rounded bg-muted-foreground/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-4/5 rounded bg-muted-foreground/20" })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[0.5px] w-full",
					style: { backgroundColor: `${resolvedAccent}20` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 w-1/2 rounded",
					style: {
						background: resolvedAccent,
						opacity: .8
					}
				}),
				school ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[4px] text-muted-foreground leading-tight",
					children: clip(school, 18)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-3/4 rounded bg-muted-foreground/20" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 p-2 flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 w-1/3 rounded",
					style: {
						background: resolvedAccent,
						opacity: .85
					}
				}),
				role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[4.5px] font-bold leading-none",
					style: { color: resolvedAccent },
					children: clip(role, 26)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[4px] text-muted-foreground leading-none",
					children: clip(company, 22)
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-4/5 rounded bg-muted-foreground/25" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-2/3 rounded bg-muted-foreground/20" })] }),
				bullet0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-0.5 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-0.5 h-0.5 rounded-full bg-muted-foreground/40 mt-[2px] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[3.5px] text-muted-foreground leading-tight",
						children: clip(bullet0, 42)
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-full rounded bg-muted-foreground/15" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[0.5px] w-full bg-border/60 mt-0.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 w-2/5 rounded",
					style: {
						background: resolvedAccent,
						opacity: .85
					}
				}),
				role2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[4px] font-semibold leading-none",
					children: clip(role2, 24)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-3/4 rounded bg-muted-foreground/20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-[85%] rounded bg-muted-foreground/15" })
			]
		})]
	});
	if (tid === "modern") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card shadow-soft flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-3 pt-2.5 pb-2 text-white flex flex-col justify-center gap-0.5 shrink-0",
			style: { background: resolvedAccent },
			children: [
				name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[7px] font-extrabold truncate uppercase leading-tight",
					children: name
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2/5 rounded bg-white/40" }),
				role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[4.5px] text-white/80 truncate",
					children: [
						clip(role, 30),
						" · ",
						clip(company, 18)
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-1/3 rounded bg-white/30" }),
				email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[3.5px] text-white/60 truncate",
					children: email
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-2.5 flex flex-col gap-2 flex-1",
			children: [
				summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[3.5px] text-muted-foreground leading-tight line-clamp-2",
					children: clip(summary, 80)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-full rounded bg-muted-foreground/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-4/5 rounded bg-muted-foreground/15" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1",
					style: { borderLeft: `2px solid ${resolvedAccent}` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1 w-1/4 rounded ml-1",
						style: {
							background: resolvedAccent,
							opacity: .85
						}
					})
				}),
				role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[4.5px] font-bold leading-none pl-1.5",
					children: clip(role, 28)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[4px] text-muted-foreground pl-1.5 leading-none",
					children: clip(company, 22)
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-3/4 rounded bg-muted-foreground/20 pl-1.5" }),
				bullet0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-0.5 items-start pl-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-0.5 h-0.5 rounded-full shrink-0 mt-[2px]",
						style: { background: resolvedAccent }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[3.5px] text-muted-foreground leading-tight",
						children: clip(bullet0, 45)
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-[90%] rounded bg-muted-foreground/15 ml-1.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 mt-0.5",
					style: { borderLeft: `2px solid ${resolvedAccent}` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1 w-1/3 rounded ml-1",
						style: {
							background: resolvedAccent,
							opacity: .85
						}
					})
				}),
				school ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[4px] text-muted-foreground pl-1.5 leading-none",
					children: [
						clip(school, 24),
						" · ",
						degree ? clip(degree, 20) : ""
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-2/3 rounded bg-muted-foreground/20 ml-1.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 mt-0.5",
					style: { borderLeft: `2px solid ${resolvedAccent}` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1 w-1/5 rounded ml-1",
						style: {
							background: resolvedAccent,
							opacity: .85
						}
					})
				}),
				skill1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[3.5px] text-muted-foreground leading-tight pl-1.5",
					children: clip(skill1, 40)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-4/5 rounded bg-muted-foreground/15 ml-1.5" })
			]
		})]
	});
	if (tid === "minimal") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card p-2.5 shadow-soft flex flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[7.5px] font-bold tracking-tight text-foreground truncate",
					children: name
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-1/3 rounded bg-muted-foreground/45" }),
				role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[4px] text-muted-foreground mt-0.5 truncate",
					children: [
						clip(role, 30),
						" · ",
						clip(company, 18)
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-1/5 rounded bg-muted-foreground/20 mt-0.5" }),
				email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[3.5px] text-muted-foreground/70 mt-0.5 truncate",
					children: email
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[0.5px] bg-border my-1.5" })
			] }),
			summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[3.5px] text-muted-foreground leading-tight",
				children: clip(summary, 90)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-[95%] rounded bg-muted-foreground/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-[85%] rounded bg-muted-foreground/15" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 w-1/5 rounded mb-1",
					style: {
						background: resolvedAccent,
						opacity: .85
					}
				}),
				role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[4.5px] font-semibold leading-none",
					children: clip(role, 28)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[3.5px] text-muted-foreground mt-0.5 leading-none",
					children: clip(company, 22)
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-[80%] rounded bg-muted-foreground/20" }),
				bullet0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-0.5 items-start mt-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-0.5 h-0.5 rounded-full bg-muted-foreground/40 mt-[2px] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[3.5px] text-muted-foreground leading-tight",
						children: clip(bullet0, 45)
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-3/4 rounded bg-muted-foreground/15 mt-0.5" })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 w-1/4 rounded mb-1",
					style: {
						background: resolvedAccent,
						opacity: .85
					}
				}),
				school ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[4px] text-muted-foreground leading-none",
					children: clip(school, 22)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-2/3 rounded bg-muted-foreground/20" }),
				degree ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[3.5px] text-muted-foreground/70 mt-0.5 leading-none",
					children: clip(degree, 24)
				}) : null
			] }),
			skill1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[3.5px] text-muted-foreground leading-tight",
				children: clip(skill1, 42)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-[80%] rounded bg-muted-foreground/15" })
		]
	});
	if (tid === "creative") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card p-2.5 shadow-soft flex flex-col gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-[6px] font-bold",
					style: {
						backgroundColor: `${resolvedAccent}20`,
						color: resolvedAccent,
						border: `1.5px solid ${resolvedAccent}40`
					},
					children: name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "AJ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[6.5px] font-extrabold truncate",
						style: { color: resolvedAccent },
						children: name
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-16 rounded bg-muted-foreground/35" }), role ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[4px] text-muted-foreground truncate leading-none mt-0.5",
						children: clip(role, 28)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-10 rounded bg-muted-foreground/20 mt-0.5" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[0.5px] w-full",
				style: { backgroundColor: `${resolvedAccent}35` }
			}),
			summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[3.5px] text-muted-foreground leading-tight",
				children: clip(summary, 80)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-[90%] rounded bg-muted-foreground/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-[80%] rounded bg-muted-foreground/15" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded px-1 py-0.5",
				style: {
					backgroundColor: `${resolvedAccent}08`,
					borderLeft: `1.5px solid ${resolvedAccent}`
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[4px] font-bold",
						style: { color: resolvedAccent },
						children: "Experience"
					}),
					role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[4.5px] font-semibold mt-0.5 leading-none",
						children: clip(role, 26)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[3.5px] text-muted-foreground leading-none",
						children: clip(company, 20)
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-3/4 rounded bg-muted-foreground/20 mt-0.5" }),
					bullet0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-0.5 mt-0.5 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[4px]",
							style: { color: resolvedAccent },
							children: "•"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[3.5px] text-muted-foreground leading-tight",
							children: clip(bullet0, 40)
						})]
					}) : null
				]
			}),
			(skill1 || !d) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-0.5 mt-0.5",
				children: (skill1 || "TypeScript, React, Node.js").split(",").slice(0, 3).map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full px-1 py-[1px] text-[3.5px] font-semibold",
					style: {
						backgroundColor: `${resolvedAccent}15`,
						color: resolvedAccent
					},
					children: s.trim()
				}, i))
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-white dark:bg-card p-2.5 shadow-soft flex flex-col gap-2 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[7px] font-extrabold tracking-tight uppercase truncate",
					style: { color: resolvedAccent },
					children: name
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-2.5 w-1/3 rounded bg-muted-foreground/35" }),
				role ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[4px] text-muted-foreground truncate mt-0.5",
					children: clip(role, 30)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-1 w-1/2 rounded bg-muted-foreground/20 mt-0.5" }),
				email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[3.5px] text-muted-foreground/70 truncate mt-0.5",
					children: email
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-1 h-[0.5px] w-[90%] rounded bg-muted-foreground/20" })
			] }),
			summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[3.5px] text-muted-foreground leading-tight text-left",
				children: clip(summary, 90)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-1 w-[85%] rounded bg-muted-foreground/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-1 w-[80%] rounded bg-muted-foreground/15" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-0.5 h-1 w-1/4 rounded",
						style: {
							background: resolvedAccent,
							opacity: .85
						}
					}),
					role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[4.5px] font-bold leading-none",
						children: clip(role, 26)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[3.5px] text-muted-foreground leading-none mt-0.5",
						children: clip(company, 22)
					})] }) : null,
					bullet0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-0.5 items-start mt-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-0.5 h-0.5 rounded-full bg-muted-foreground/30 shrink-0 mt-[2px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[3.5px] text-muted-foreground leading-tight",
							children: clip(bullet0, 42)
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-0.5 items-center mt-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-0.5 rounded-full bg-muted-foreground/30 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-[85%] rounded bg-muted-foreground/20" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-0.5 items-center mt-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 w-0.5 rounded-full bg-muted-foreground/30 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-[70%] rounded bg-muted-foreground/15" })]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-0.5 h-1 w-1/4 rounded",
					style: {
						background: resolvedAccent,
						opacity: .85
					}
				}), school ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[4px] font-semibold leading-none",
					children: clip(school, 22)
				}), degree ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[3.5px] text-muted-foreground leading-none mt-0.5",
					children: clip(degree, 24)
				}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-2/3 rounded bg-muted-foreground/20" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-0.5 h-1 w-1/5 rounded",
					style: {
						background: resolvedAccent,
						opacity: .85
					}
				}), skill1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[3.5px] text-muted-foreground leading-tight",
					children: clip(skill1, 42)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-4/5 rounded bg-muted-foreground/15" })]
			})
		]
	});
}
var profileOptions = [
	{
		id: "fresh",
		title: "Fresh Graduate",
		sub: "Entry-level positions and new graduates",
		icon: GraduationCap
	},
	{
		id: "experienced",
		title: "Experienced Professional",
		sub: "For professionals with work experience",
		icon: Briefcase
	},
	{
		id: "internship",
		title: "Internship Resume",
		sub: "Internships and student positions",
		icon: Rocket
	},
	{
		id: "academic",
		title: "Academic Resume",
		sub: "For academic, research and faculty roles",
		icon: BookOpen
	},
	{
		id: "custom",
		title: "Custom",
		sub: "Build a resume from scratch",
		icon: Pencil
	}
];
function mergeTextItems(items) {
	if (items.length === 0) return [];
	const sorted = [...items].sort((a, b) => {
		if (Math.abs(a.y - b.y) > 4) return a.y - b.y;
		return a.x - b.x;
	});
	const merged = [];
	let current = { ...sorted[0] };
	for (let i = 1; i < sorted.length; i++) {
		const next = sorted[i];
		const sameLine = Math.abs(current.y - next.y) < 4;
		const gap = next.x - (current.x + current.width);
		const maxGap = Math.max(current.fontSize, next.fontSize) * 2.5;
		if (sameLine && gap >= -5 && gap < maxGap) {
			const needsSpace = gap > 1 && !current.text.endsWith(" ") && !next.text.startsWith(" ");
			current.text = current.text + (needsSpace ? " " : "") + next.text;
			current.width = next.x + next.width - current.x;
			current.height = Math.max(current.height, next.height);
			current.fontSize = Math.max(current.fontSize, next.fontSize);
			current.isBold = current.isBold || next.isBold;
			current.isItalic = current.isItalic || next.isItalic;
		} else {
			merged.push(current);
			current = { ...next };
		}
	}
	merged.push(current);
	return merged;
}
async function parsePdfLayout(file) {
	let pdfjsLib = window.pdfjsLib;
	if (!pdfjsLib) {
		await new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
			script.onload = () => {
				pdfjsLib = window.pdfjsLib;
				if (pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
				resolve();
			};
			script.onerror = () => reject(/* @__PURE__ */ new Error("Failed to load PDF worker script."));
			document.head.appendChild(script);
		});
		pdfjsLib = window.pdfjsLib;
	}
	const arrayBuffer = await file.arrayBuffer();
	if (!pdfjsLib) throw new Error("PDFJS library failed to load");
	const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
	const pages = [];
	let combinedText = "";
	for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
		const page = await pdf.getPage(pageNum);
		const viewport = page.getViewport({ scale: 1 });
		const textContent = await page.getTextContent();
		const merged = mergeTextItems(textContent.items.map((item) => {
			const typedItem = item;
			const fontFamily = (typedItem.fontName ? textContent.styles[typedItem.fontName] : void 0)?.fontFamily || "";
			const fontName = typedItem.fontName || "";
			const isBold = fontName.toLowerCase().includes("bold") || fontFamily.toLowerCase().includes("bold");
			const isItalic = fontName.toLowerCase().includes("italic") || fontName.toLowerCase().includes("oblique") || fontFamily.toLowerCase().includes("italic") || fontFamily.toLowerCase().includes("oblique");
			const x = typedItem.transform?.[4] ?? 0;
			const y = viewport.height - (typedItem.transform?.[5] ?? 0) - (typedItem.height || 0);
			return {
				text: typedItem.str || "",
				x,
				y,
				width: typedItem.width ?? 0,
				height: typedItem.height || Math.abs(typedItem.transform?.[0] || typedItem.transform?.[3] || 12),
				fontSize: Math.abs(typedItem.transform?.[0] || typedItem.transform?.[3] || 12),
				fontFamily,
				fontName,
				isBold,
				isItalic
			};
		}));
		combinedText += merged.map((i) => i.text).join(" ") + "\n";
		pages.push({
			viewport: {
				width: viewport.width,
				height: viewport.height
			},
			textItems: merged
		});
	}
	return {
		importedLayout: { pages },
		rawText: combinedText
	};
}
var sourceOptions = [
	{
		id: "profile",
		title: "Pull from Profile",
		sub: "Auto-fill using your master career profile.",
		icon: User
	},
	{
		id: "blank",
		title: "Start Empty",
		sub: "Begin with a clean slate and add as you go.",
		icon: FileText
	},
	{
		id: "import",
		title: "Import Existing Resume",
		sub: "Upload a PDF, DOCX or TXT to auto-fill fields.",
		icon: FileUp
	},
	{
		id: "github",
		title: "Import from GitHub",
		sub: "Pull projects from your public repositories.",
		icon: Github
	}
];
var DEMO_RESUME = {
	id: "demo",
	title: "Demo",
	profileType: "experienced",
	template: "ats-professional",
	updatedAt: Date.now(),
	downloads: 0,
	atsScore: 95,
	data: {
		fullName: "Alex Rivera",
		email: "alex@rivera.dev",
		phone: "+1 (555) 019-2834",
		location: "San Francisco, CA",
		summary: "Senior Software Engineer with 5+ years of experience leading cross-functional teams to design and build scalable, secure cloud-native web applications using TypeScript and AWS.",
		website: "rivera.dev",
		linkedin: "linkedin.com/in/alexrivera",
		github: "github.com/alexrivera",
		education: [{
			degree: "B.S. in Computer Science",
			school: "Stanford University",
			year: "2016 – 2020",
			cgpa: "3.8"
		}],
		experience: [{
			role: "Senior Software Engineer",
			company: "TechCorp Inc.",
			period: "2022 – Present",
			bullets: ["Designed microservices architecture processing 50k requests per second.", "Led development of a React portal that improved user engagement by 40%."]
		}],
		projects: [{
			name: "CloudScale Engine",
			tools: "Go, Kubernetes, AWS",
			bullets: ["Built a container scaling tool saving $12k monthly in infrastructure cost."]
		}],
		skills: [{
			category: "Languages",
			items: "TypeScript, JavaScript, Go, Python"
		}, {
			category: "Frameworks",
			items: "React, Node.js, Next.js, Express"
		}],
		certifications: ["AWS Solutions Architect Associate"],
		languages: ["English (Native)", "Spanish (Conversational)"],
		achievements: ["Hackathon Winner 2024"]
	}
};
function CreateResumeWizard({ open, onOpenChange, defaultSource, defaultStep }) {
	const [profileData] = useProfile();
	const [step, setStep] = import_react.useState(1);
	const [profile, setProfile] = import_react.useState("fresh");
	const [source, setSource] = import_react.useState("blank");
	const [fullscreenPreview, setFullscreenPreview] = import_react.useState(false);
	const [include, setInclude] = import_react.useState({
		summary: true,
		experience: true,
		projects: true,
		education: true,
		skills: true
	});
	const [projectOrder, setProjectOrder] = import_react.useState([]);
	const [expOrder, setExpOrder] = import_react.useState([]);
	const [parsedData, setParsedData] = import_react.useState(null);
	const previewData = import_react.useMemo(() => {
		const base = { ...DEMO_RESUME.data };
		if (source === "profile" && profileData.fullName) return dataFromProfile(profileData, {
			include,
			pickedExperienceIdx: expOrder,
			pickedProjectIdx: projectOrder
		});
		else if (source === "import" && parsedData) return {
			...base,
			fullName: parsedData.fullName || base.fullName,
			email: parsedData.email || base.email,
			phone: parsedData.phone || base.phone,
			summary: parsedData.summary || base.summary
		};
		else if (profileData.fullName) return dataFromProfile(profileData, { include: {
			summary: true,
			experience: true,
			projects: true,
			education: true,
			skills: true
		} });
		return base;
	}, [
		source,
		profileData,
		include,
		expOrder,
		projectOrder,
		parsedData
	]);
	const [template, setTemplate] = import_react.useState("ats-professional");
	const [title, setTitle] = import_react.useState("");
	const [importedFileName, setImportedFileName] = import_react.useState("");
	const [importedText, setImportedText] = import_react.useState("");
	const [parseBusy, setParseBusy] = import_react.useState(false);
	const [ghUsername, setGhUsername] = import_react.useState("");
	const [ghProjects, setGhProjects] = import_react.useState([]);
	const [ghOpen, setGhOpen] = import_react.useState(false);
	const [selectedFile, setSelectedFile] = import_react.useState(null);
	const [importedLayout, setImportedLayout] = import_react.useState(null);
	const [pdfBase64Data, setPdfBase64Data] = import_react.useState(null);
	const navigate = useNavigate();
	import_react.useEffect(() => {
		if (open) {
			setStep(defaultStep ?? 1);
			setProfile("fresh");
			setSource(defaultSource ?? (profileData.fullName ? "profile" : "blank"));
			setTemplate("ats-professional");
			setTitle("");
			setImportedFileName("");
			setImportedText("");
			setParsedData(null);
			setGhUsername("");
			setGhProjects([]);
			setSelectedFile(null);
			setImportedLayout(null);
			setPdfBase64Data(null);
			setInclude({
				summary: true,
				experience: true,
				projects: true,
				education: true,
				skills: true
			});
			setProjectOrder(profileData.projects.map((_, i) => i));
			setExpOrder(profileData.experience.map((_, i) => i));
		}
	}, [
		open,
		profileData.fullName,
		profileData.projects,
		profileData.experience,
		defaultStep,
		defaultSource
	]);
	const next = () => setStep((s) => Math.min(3, s + 1));
	const back = () => setStep((s) => Math.max(1, s - 1));
	const moveExp = (idx, dir) => {
		const target = idx + dir;
		if (target < 0 || target >= expOrder.length) return;
		const nextList = [...expOrder];
		[nextList[idx], nextList[target]] = [nextList[target], nextList[idx]];
		setExpOrder(nextList);
	};
	const moveProj = (idx, dir) => {
		const target = idx + dir;
		if (target < 0 || target >= projectOrder.length) return;
		const nextList = [...projectOrder];
		[nextList[idx], nextList[target]] = [nextList[target], nextList[idx]];
		setProjectOrder(nextList);
	};
	const handleCreate = async () => {
		const r = createResume({
			title: title.trim() || (source === "profile" && profileData.title ? `${profileData.title} Resume` : "") || `${profileOptions.find((p) => p.id === profile)?.title} Resume`,
			profileType: profile,
			template
		});
		if (source === "profile") {
			r.data = dataFromProfile(profileData, {
				include,
				pickedExperienceIdx: expOrder,
				pickedProjectIdx: projectOrder
			});
			saveResume(r);
		} else if (source === "import") {
			if (parsedData) {
				if (parsedData.fullName) r.data.fullName = parsedData.fullName;
				if (parsedData.email) r.data.email = parsedData.email;
				if (parsedData.phone) r.data.phone = parsedData.phone;
				if (parsedData.summary) r.data.summary = parsedData.summary;
			}
			if (selectedFile) {
				r.data.isVisualMode = true;
				r.data.triggerAiImport = true;
				r.data.importedPdf = {
					pageCount: importedLayout?.pages?.length || 1,
					uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
					originalFilename: selectedFile.name
				};
				if (importedLayout) {
					r.data.importedLayout = importedLayout;
					r.data.rawText = importedText;
				}
				if (pdfBase64Data) {
					const { storePdfBinary } = await import("./pdf-store-BLV_1s3T.mjs");
					await storePdfBinary(r.id, pdfBase64Data);
				}
				try {
					const { apiClient } = await import("./apiClient-DEBqcuWX.mjs").then((n) => n.n);
					apiClient.upload(`/upload/pdf?resumeId=${r.id}`, selectedFile).then((res) => {
						const uploadResult = res;
						if (uploadResult?.storagePath && r.data.importedPdf) {
							r.data.importedPdf.storagePath = uploadResult.storagePath;
							saveResume(r);
						}
					}).catch((uploadErr) => {
						console.warn("Backend upload failed (non-critical):", uploadErr);
					});
				} catch (apiClientErr) {
					console.warn("Could not import apiClient dynamically:", apiClientErr);
				}
			} else if (importedText) r.data.summary = importedText.slice(0, 500);
			saveResume(r);
		} else if (source === "github" && ghProjects.length > 0) {
			r.data.projects = ghProjects;
			saveResume(r);
		}
		onOpenChange(false);
		navigate({
			to: "/editor/$id",
			params: { id: r.id }
		});
	};
	const handleFile = async (file) => {
		if (!file) return;
		setSelectedFile(file);
		setImportedFileName(file.name);
		setParsedData(null);
		setImportedLayout(null);
		setPdfBase64Data(null);
		setParseBusy(true);
		try {
			if (file.name.toLowerCase().endsWith(".txt")) {
				const text = await file.text();
				setImportedText(text);
				const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
				setParsedData({
					fullName: text.split(/\n/).map((l) => l.trim()).filter(Boolean).find((l) => l.length > 2 && l.length < 60 && !l.includes("@") && !l.includes("http")) ?? "",
					email: emailMatch?.[0] ?? "",
					phone: "",
					summary: text.slice(0, 300)
				});
				toast.success(`Parsed ${file.name} — fields pre-filled!`);
			} else if (file.name.toLowerCase().endsWith(".pdf")) {
				const { parseResumeFile } = await import("./parse.functions-BLPK13no.mjs");
				const base64 = await fileToBase64(file);
				setPdfBase64Data(base64);
				const { importedLayout: layout, rawText } = await parsePdfLayout(file);
				setImportedLayout(layout);
				setImportedText(rawText);
				const result = await parseResumeFile({ data: {
					base64,
					filename: file.name
				} });
				setParsedData({
					fullName: result.fullName || "",
					email: result.email || "",
					phone: result.phone || "",
					summary: result.summary || ""
				});
				toast.success(`PDF parsed — ${result.fullName || "fields"} pre-filled!`);
			} else toast.info(`${file.name} attached. Fields will be editable in the editor.`);
		} catch (err) {
			console.error(err);
			toast.error("Could not parse file — you can fill fields manually in the editor.");
		} finally {
			setParseBusy(false);
		}
	};
	async function fileToBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result.split(",")[1]);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-4xl gap-0 overflow-hidden rounded-3xl border-border p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "space-y-1 px-7 pt-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-xl font-bold",
								children: "Create New Resume"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs text-muted-foreground",
								children: "Build a professional resume in 3 simple steps"
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, { step }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[60vh] overflow-y-auto px-7 pb-6 bg-background/50",
					children: [
						step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "animate-fade-in space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepHeader, {
								index: 1,
								title: "What are you creating?",
								sub: "Select the profile type that best describes you."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
								children: profileOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectCard, {
									active: profile === opt.id,
									onClick: () => setProfile(opt.id),
									icon: opt.icon,
									title: opt.title,
									sub: opt.sub
								}, opt.id))
							})]
						}),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "animate-fade-in space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepHeader, {
									index: 2,
									title: "Where should we start from?",
									sub: "Pick a starting source for your resume content."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setSource("import"),
										className: cn("group relative flex w-full items-center gap-4 rounded-2xl border-2 bg-linear-to-r from-brand/10 to-brand-soft/20 p-5 text-left transition-all cursor-pointer shadow-xs hover:border-brand/65 hover:from-brand/15 hover:to-brand-soft/30", source === "import" ? "border-brand ring-1 ring-brand bg-brand-soft/30" : "border-border"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground shadow-sm",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "h-6 w-6" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-extrabold text-foreground",
														children: "Import Existing Resume"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-brand/15 text-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
														children: "Recommended"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-muted-foreground leading-normal",
													children: "Best accuracy. We'll extract every section and let you review before applying."
												})]
											}),
											source === "import" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid h-6 w-6 place-items-center rounded-full bg-brand text-brand-foreground shrink-0 shadow-sm",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-3 sm:grid-cols-3",
										children: sourceOptions.filter((opt) => opt.id !== "import").map((opt) => {
											const isProfileDisabled = opt.id === "profile" && !profileData.fullName;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectCard, {
												active: source === opt.id,
												onClick: () => {
													if (isProfileDisabled) {
														toast.info("Please fill in your Profile first to pull from it.");
														return;
													}
													setSource(opt.id);
												},
												icon: opt.icon,
												title: opt.title,
												sub: opt.sub,
												disabled: isProfileDisabled
											}, opt.id);
										})
									})]
								}),
								source === "import" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-sm font-semibold",
											children: "Upload your resume"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: "Accepts PDF, DOCX, TXT, or images (PNG, JPEG, WebP) (≤ 15MB). Fields are extracted automatically."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "file",
											accept: ".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp",
											onChange: (e) => handleFile(e.target.files?.[0] ?? null),
											className: "mt-3 h-11 cursor-pointer rounded-xl bg-card"
										}),
										parseBusy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex items-center gap-2 text-xs text-brand font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 animate-pulse" }), "Scanning and parsing your resume…"]
										}),
										!parseBusy && parsedData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 rounded-xl border border-brand/30 bg-brand-soft/30 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs font-bold text-brand",
												children: ["✓ Fields extracted from ", importedFileName]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 space-y-0.5 text-xs text-muted-foreground",
												children: [
													parsedData.fullName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Name: ", parsedData.fullName] }),
													parsedData.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Email: ", parsedData.email] }),
													parsedData.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Phone: ", parsedData.phone] })
												]
											})]
										}),
										!parseBusy && !parsedData && importedFileName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 text-xs text-brand font-semibold",
											children: [
												"✓ ",
												importedFileName,
												" attached"
											]
										})
									]
								}),
								source === "github" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-sm font-semibold",
											children: "Connect your GitHub"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: "Enter your GitHub username — we'll list your public repos so you can pick which ones become resume projects."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: ghUsername,
												onChange: (e) => setGhUsername(e.target.value),
												placeholder: "GitHub username",
												className: "h-11 rounded-xl"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												onClick: () => setGhOpen(true),
												disabled: !ghUsername.trim(),
												className: "h-11 shrink-0 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "mr-1.5 h-4 w-4" }), " Browse repos"]
											})]
										}),
										ghProjects.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 text-xs text-brand font-semibold font-mono",
											children: [
												"✓ ",
												ghProjects.length,
												" repo",
												ghProjects.length === 1 ? "" : "s",
												" selected"
											]
										})
									]
								}),
								source === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 rounded-2xl border border-brand bg-brand-soft/20 p-4 flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-brand font-semibold",
										children: "Your master profile details will be auto-synced! You can configure checkboxes and item orders in the next step."
									})]
								})
							]
						}),
						step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "animate-fade-in",
							children: source === "profile" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 md:grid-cols-12",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-7 space-y-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepHeader, {
											index: 3,
											title: "Configure profile options",
											sub: "Choose which sections and the layout ordering to pull."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "title",
												children: "Resume title"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "title",
												value: title,
												onChange: (e) => setTitle(e.target.value),
												placeholder: "e.g. Master Profile Resume",
												className: "h-11 rounded-xl bg-card"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2.5 p-4 border border-border rounded-2xl bg-card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
												children: "Sections to include"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "grid gap-2 grid-cols-2",
												children: [
													{
														key: "summary",
														label: "Summary",
														desc: "Professional summary"
													},
													{
														key: "experience",
														label: "Experience",
														desc: "Jobs & Internships"
													},
													{
														key: "projects",
														label: "Projects",
														desc: "Side projects"
													},
													{
														key: "education",
														label: "Education",
														desc: "College & Degrees"
													},
													{
														key: "skills",
														label: "Skills",
														desc: "Skill categorizations"
													}
												].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: cn("flex items-start gap-2.5 rounded-xl border p-2.5 cursor-pointer transition-all", include[s.key] ? "border-brand bg-brand-soft/20" : "border-border bg-background/50"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
														checked: include[s.key],
														onCheckedChange: (v) => setInclude((prev) => ({
															...prev,
															[s.key]: Boolean(v)
														})),
														className: "mt-0.5"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11.5px] font-bold leading-none",
														children: s.label
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[9.5px] text-muted-foreground mt-1 leading-tight",
														children: s.desc
													})] })]
												}) }, s.key))
											})]
										}),
										include.experience && profileData.experience.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
												children: "Experience Order"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "space-y-1.5 max-h-[140px] overflow-y-auto",
												children: expOrder.map((origIdx, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center justify-between gap-2 border border-border bg-card rounded-xl px-3 py-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2.5 min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "grid h-5 w-5 place-items-center rounded-full bg-brand-soft text-[10px] font-bold text-brand shrink-0",
															children: i + 1
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[11.5px] font-medium truncate",
															children: [
																profileData.experience[origIdx].role,
																" at",
																" ",
																profileData.experience[origIdx].company
															]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-1 shrink-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "icon",
															variant: "outline",
															className: "h-6.5 w-6.5 rounded-md",
															disabled: i === 0,
															onClick: () => moveExp(i, -1),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-3 w-3" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "icon",
															variant: "outline",
															className: "h-6.5 w-6.5 rounded-md",
															disabled: i === expOrder.length - 1,
															onClick: () => moveExp(i, 1),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3 w-3" })
														})]
													})]
												}, origIdx))
											})]
										}),
										include.projects && profileData.projects.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
												children: "Project Order"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "space-y-1.5 max-h-[140px] overflow-y-auto",
												children: projectOrder.map((origIdx, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center justify-between gap-2 border border-border bg-card rounded-xl px-3 py-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2.5 min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "grid h-5 w-5 place-items-center rounded-full bg-brand-soft text-[10px] font-bold text-brand shrink-0",
															children: i + 1
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[11.5px] font-medium truncate",
															children: profileData.projects[origIdx].name
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-1 shrink-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "icon",
															variant: "outline",
															className: "h-6.5 w-6.5 rounded-md",
															disabled: i === 0,
															onClick: () => moveProj(i, -1),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-3 w-3" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "icon",
															variant: "outline",
															className: "h-6.5 w-6.5 rounded-md",
															disabled: i === projectOrder.length - 1,
															onClick: () => moveProj(i, 1),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3 w-3" })
														})]
													})]
												}, origIdx))
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-5 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
											children: "Choose Layout Template"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground",
											children: [TEMPLATES.length, " templates"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-3 grid-cols-2 max-h-[400px] overflow-y-auto pr-1 pb-1",
										children: TEMPLATES.map((t) => {
											const isSelected = template === t.id;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setTemplate(t.id),
												className: cn("flex flex-col rounded-2xl border-2 p-2.5 text-left transition-all bg-card cursor-pointer group relative overflow-hidden", isSelected ? "border-brand shadow-[0_0_0_3px] shadow-brand/20 bg-brand-soft/20" : "border-border hover:border-brand/50 hover:shadow-md"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-full overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-[1.03]",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeThumb, {
															accent: templateAccent(t.id),
															templateId: t.id,
															demoData: previewData
														})
													}),
													isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "absolute top-3 right-3 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-foreground shadow",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-2 px-0.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: cn("text-[12px] font-extrabold tracking-tight transition-colors", isSelected ? "text-brand" : "group-hover:text-brand"),
															children: t.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] text-muted-foreground mt-0.5 leading-tight truncate",
															children: t.tagline
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1.5 flex flex-wrap gap-1 px-0.5",
														children: t.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: cn("inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none", tag === "ATS Friendly" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : tag === "Best for Freshers" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : tag === "Popular" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-muted text-muted-foreground"),
															children: tag
														}, tag))
													})
												]
											}, t.id);
										})
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepHeader, {
										index: 3,
										title: source === "import" || source === "github" ? "Name & finish" : "Theme & finish",
										sub: source === "import" || source === "github" ? "Give your resume a title." : "Name your resume and choose a starting template."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "title",
											children: "Resume title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "title",
											value: title,
											onChange: (e) => setTitle(e.target.value),
											placeholder: "e.g. Fresh Graduate Resume",
											className: "h-11 rounded-xl bg-card"
										})]
									}),
									source !== "import" && source !== "github" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 mt-4",
										children: TEMPLATES.map((t) => {
											const isSelected = template === t.id;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setTemplate(t.id),
												className: cn("relative flex flex-col rounded-2xl border-2 bg-card p-3 text-left transition-all cursor-pointer group overflow-hidden", isSelected ? "border-brand shadow-[0_0_0_3px] shadow-brand/20 bg-brand-soft/20" : "border-border hover:border-brand/50 hover:shadow-md"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-full overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-[1.03]",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeThumb, {
															accent: templateAccent(t.id),
															templateId: t.id,
															demoData: previewData
														})
													}),
													isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "absolute top-3 right-3 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-foreground shadow",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-2.5 px-0.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: cn("text-[13px] font-extrabold tracking-tight transition-colors", isSelected ? "text-brand" : "group-hover:text-brand"),
															children: t.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[11px] text-muted-foreground mt-0.5 leading-tight",
															children: t.tagline
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-2 flex flex-wrap gap-1 px-0.5",
														children: t.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none", tag === "ATS Friendly" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : tag === "Best for Freshers" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : tag === "Popular" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-muted text-muted-foreground"),
															children: tag
														}, tag))
													})
												]
											}, t.id);
										})
									}),
									(source === "import" || source === "github") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand-soft/30 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold text-foreground",
												children: source === "github" ? "GitHub projects imported" : "Resume file attached"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs text-muted-foreground",
												children: source === "import" ? importedFileName ? `"${importedFileName}" will be used to pre-fill your resume. You can choose a layout theme later inside the editor.` : "You can choose a theme inside the editor after creation." : `${ghProjects.length} repo${ghProjects.length === 1 ? "" : "s"} imported.`
											})]
										})]
									})
								]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "flex items-center justify-between border-t border-border bg-card px-6 py-4 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs text-muted-foreground font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI suggestions live in the editor!" })]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => onOpenChange(false),
							className: "h-11 rounded-xl px-5 font-bold cursor-pointer bg-card",
							children: "Cancel"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: back,
							className: "h-11 rounded-xl px-5 font-bold cursor-pointer bg-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 h-4 w-4" }), " Back"]
						}), step < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: next,
							className: "h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 px-5 font-bold cursor-pointer",
							children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleCreate,
							className: "h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 px-6 font-bold cursor-pointer",
							children: "Create Resume"
						})]
					})]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GithubImportDialog, {
		open: ghOpen,
		onOpenChange: setGhOpen,
		initialUsername: ghUsername,
		onImport: (projects) => setGhProjects(projects)
	})] });
}
function Stepper({ step }) {
	const labels = [
		"Profile Type",
		"Source / Import",
		"Theme & Finish"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-7 py-6 shrink-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center",
			children: labels.map((label, i) => {
				const idx = i + 1;
				const done = idx < step;
				const active = idx === step;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition-colors", done && "bg-brand text-brand-foreground", active && "bg-brand text-brand-foreground ring-4 ring-brand-soft", !done && !active && "bg-muted text-muted-foreground"),
						children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : idx
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-xs font-medium", active ? "text-foreground" : "text-muted-foreground"),
						children: label
					})]
				}), idx < labels.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("mx-2 h-0.5 flex-1 rounded-full", idx < step ? "bg-brand" : "bg-border") })] }, label);
			})
		})
	});
}
function StepHeader({ index, title, sub }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground text-xs font-bold",
			children: index
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "text-base font-bold leading-tight",
			children: [
				"Step ",
				index,
				": ",
				title
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground mt-0.5",
			children: sub
		})] })]
	});
}
function SelectCard({ active, onClick, icon: Icon, title, sub, disabled = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		disabled,
		className: cn("group relative flex flex-col items-center gap-3 rounded-2xl border-2 bg-card p-4 text-center transition-all cursor-pointer min-h-[155px] justify-center", active ? "border-brand bg-brand-soft/40 shadow-soft" : "border-border hover:border-brand/40 hover:bg-muted/40", disabled && "opacity-45 cursor-not-allowed hover:border-border hover:bg-card"),
		children: [
			active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand transition-colors", disabled && "bg-muted text-muted-foreground"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5.5 w-5.5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-bold leading-tight truncate max-w-[130px]",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 text-[10px] text-muted-foreground leading-normal max-h-[42px] overflow-hidden",
				children: sub
			})] })
		]
	});
}
//#endregion
export { ResumeThumb as n, CreateResumeWizard as t };
