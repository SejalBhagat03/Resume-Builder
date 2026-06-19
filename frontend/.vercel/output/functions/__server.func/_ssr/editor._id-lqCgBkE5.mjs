import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DWNMNgqv.mjs";
import { c as getResume, l as saveResume, t as AppShell } from "./app-shell-q8BzYArD.mjs";
import { t as apiClient } from "./apiClient-DEBqcuWX.mjs";
import { getPdfBinary, storePdfBinary } from "./pdf-store-BLV_1s3T.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as Input, r as cn, t as Button } from "./button-CHSNwFnT.mjs";
import { P as notFound, g as Link, v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Download, C as Redo, D as Move, G as FolderGit2, I as Lightbulb, J as FileSearch, O as MessageCircleQuestionMark, P as LoaderCircle, S as RefreshCw, U as Github, V as GraduationCap, Y as FileDown, a as Wrench, at as Check, b as Save, d as TriangleAlert, g as TextAlignCenter, h as TextAlignEnd, i as X, l as Undo, lt as Bold, m as TextAlignStart, mt as ArrowLeft, n as ZoomIn, o as WandSparkles, p as Trash2, s as User, st as Briefcase, t as ZoomOut, tt as CircleCheck, v as Sparkles, w as Plus } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-DHSY72pW.mjs";
import { t as Textarea } from "./textarea-DTF9kA1O.mjs";
import { a as interviewQuestions, n as Progress, o as reviewResume, r as RoleRecommendations, t as Card } from "./role-recommendations-nouxKSk3.mjs";
import { a as Portal, i as Overlay, n as Content, o as Root, r as Description, s as Title, t as Close } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as GithubImportDialog, r as DialogDescription, t as Dialog } from "./github-import-dialog-DznuUkqn.mjs";
import { n as useProfile } from "./profile-store-PZTXlT2r.mjs";
import { i as Trigger, n as List, r as Root2, t as Content$1 } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editor._id-lqCgBkE5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* AI functions — all calls go to the backend /api/ai/* endpoints.
* The function signatures are kept identical to the previous version so
* no other frontend code needs to change.
*
* The Gemini API key is never used here — it lives securely in the backend.
*/
function serverFnCompat(backendPath) {
	return async ({ data }) => {
		return apiClient.post(backendPath, data);
	};
}
/**
* Rewrite a single resume bullet with stronger action verb and quantified impact.
* Backend: POST /api/ai/improve-bullet
*/
var rewriteBullet = serverFnCompat("/ai/improve-bullet");
/**
* Generate a professional resume summary.
* Backend: POST /api/ai/generate-summary
*/
var generateSummary = serverFnCompat("/ai/generate-summary");
/**
* Suggest missing skills for a given role.
* Backend: POST /api/ai/suggest-skills
*/
var suggestSkills = serverFnCompat("/ai/suggest-skills");
/**
* Parse raw resume text into structured data for the native editor.
* Backend: POST /api/ai/convert-imported-resume
*/
var parseResumeStructure = serverFnCompat("/ai/convert-imported-resume");
var Sheet = Root;
var SheetPortal = Portal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = Overlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = Title.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = Description.displayName;
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content$1, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content$1.displayName;
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function ReviewPanel({ resume, jd }) {
	const report = import_react.useMemo(() => reviewResume(resume, jd), [resume, jd]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "ATS",
					value: `${report.atsScore}%`,
					pct: report.atsScore
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Readability",
					value: `${report.readability}%`,
					pct: report.readability
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Keyword coverage",
					value: `${report.keywordCoverage}%`,
					pct: report.keywordCoverage
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Estimated pages",
					value: `${report.estPages}`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "rounded-2xl border-border p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: "Insights"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2.5",
					children: report.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewLine, { item }) }, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 rounded-xl bg-brand-soft/40 px-3 py-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-brand",
						children: "Strongest section: "
					}), report.strongest]
				})
			]
		})]
	});
}
function Metric({ label, value, pct }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "rounded-2xl border-border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-2xl font-extrabold leading-none",
				children: value
			}),
			typeof pct === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				value: pct,
				className: "mt-2 h-1.5"
			})
		]
	});
}
function ReviewLine({ item }) {
	const cfg = item.kind === "good" ? {
		Icon: CircleCheck,
		color: "text-emerald-600"
	} : item.kind === "warn" ? {
		Icon: TriangleAlert,
		color: "text-amber-600"
	} : {
		Icon: Lightbulb,
		color: "text-brand"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-2.5 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(cfg.Icon, { className: `mt-0.5 h-4 w-4 shrink-0 ${cfg.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.message })]
	});
}
function ReviewBeforeExportDialog({ open, onOpenChange, resume, onDownload }) {
	const questions = import_react.useMemo(() => interviewQuestions(resume).slice(0, 3), [resume]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl rounded-3xl border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-xl font-bold",
					children: "Quick review before download"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs",
					children: "Optional — you can download anyway, nothing is blocked."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[60vh] overflow-y-auto pr-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewPanel, { resume }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "mt-4 rounded-2xl border-border p-4 bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Optional interview prep"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: questions.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-xl bg-muted/45 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold leading-snug",
									children: q.question
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground leading-normal",
									children: q.tip
								})]
							}, i))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4 bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						className: "h-11 rounded-xl",
						children: "Keep editing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							onOpenChange(false);
							onDownload();
						},
						className: "h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-4 w-4" }), " Download anyway"]
					})]
				})
			]
		})
	});
}
/** Build a plain text representation of the resume for AI calls */
function resumeToText(resume) {
	const d = resume.data;
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
}
function AiAssistantPanel({ open, onOpenChange, resume, onApply }) {
	const [profile] = useProfile();
	const [jd, setJd] = import_react.useState("");
	const [summaryBusy, setSummaryBusy] = import_react.useState(false);
	const [bulletsBusy, setBulletsBusy] = import_react.useState(false);
	const [skillsBusy, setSkillsBusy] = import_react.useState(false);
	const handleGenerateSummary = async () => {
		setSummaryBusy(true);
		try {
			const role = profile.title || resume.data.experience[0]?.role || "Software Engineer";
			const skills = resume.data.skills.map((s) => s.items).join(", ");
			const result = await apiClient.post("/ai/generate-summary", {
				role,
				skills,
				existingSummary: resume.data.summary
			});
			onApply({
				...resume,
				data: {
					...resume.data,
					summary: result.summary
				}
			});
			toast.success("Summary updated with AI ✨");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "AI unavailable. Please try again.");
		} finally {
			setSummaryBusy(false);
		}
	};
	const handleImproveBullets = async () => {
		setBulletsBusy(true);
		toast.loading("Rewriting bullets with AI…", { id: "bullets" });
		try {
			const improveAll = async (bullets, role) => {
				return Promise.all(bullets.map(async (bullet) => {
					return (await apiClient.post("/ai/improve-bullet", {
						bullet,
						role
					})).bullet;
				}));
			};
			const newExperience = await Promise.all(resume.data.experience.map(async (e) => ({
				...e,
				bullets: await improveAll(e.bullets, e.role)
			})));
			const newProjects = await Promise.all(resume.data.projects.map(async (p) => ({
				...p,
				bullets: await improveAll(p.bullets)
			})));
			onApply({
				...resume,
				data: {
					...resume.data,
					experience: newExperience,
					projects: newProjects
				}
			});
			toast.success("Bullets rewritten with stronger action verbs ✨", { id: "bullets" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "AI unavailable.", { id: "bullets" });
		} finally {
			setBulletsBusy(false);
		}
	};
	const handleSuggestSkills = async () => {
		setSkillsBusy(true);
		try {
			const role = profile.title || resume.data.experience[0]?.role || "Software Engineer";
			const currentSkills = resume.data.skills.map((s) => s.items).join(", ");
			const result = await apiClient.post("/ai/suggest-skills", {
				role,
				currentSkills
			});
			if (result.skills.length === 0) {
				toast.info("No new skill suggestions — your resume looks comprehensive!");
				return;
			}
			onApply({
				...resume,
				data: {
					...resume.data,
					skills: [...resume.data.skills, {
						category: "Suggested Skills",
						items: result.skills.join(", ")
					}]
				}
			});
			toast.success(`Added ${result.skills.length} skill suggestions ✨`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "AI unavailable.");
		} finally {
			setSkillsBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "w-full overflow-y-auto sm:max-w-xl border-l border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4.5 w-4.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
					className: "text-base font-bold",
					children: "AI Resume Assistant"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, {
					className: "text-xs",
					children: "Powered by Google Gemini. Suggestions you decide what to keep."
				})] })]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "optimize",
				className: "mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "grid w-full grid-cols-4 rounded-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "optimize",
								className: "rounded-lg text-[10px] md:text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "mr-1 h-3.5 w-3.5" }), " Optimize"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "match",
								className: "rounded-lg text-[10px] md:text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "mr-1 h-3.5 w-3.5" }), " Match JD"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "review",
								className: "rounded-lg text-[10px] md:text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSearch, { className: "mr-1 h-3.5 w-3.5" }), " Review"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "interview",
								className: "rounded-lg text-[10px] md:text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleQuestionMark, { className: "mr-1 h-3.5 w-3.5" }), " Interview"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "optimize",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
								label: "Generate a fresh summary from your profile",
								cta: "Generate",
								busy: summaryBusy,
								onRun: handleGenerateSummary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
								label: "Polish every experience and project bullet",
								cta: "Improve bullets",
								busy: bulletsBusy,
								onRun: handleImproveBullets
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
								label: "Suggest skills based on your experience",
								cta: "Suggest",
								busy: skillsBusy,
								onRun: handleSuggestSkills
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleRecommendations, {
									profile,
									limit: 3
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "match",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Paste a job description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: jd,
								onChange: (e) => setJd(e.target.value),
								rows: 6,
								placeholder: "Paste the JD here. We'll suggest changes — you accept or reject each one.",
								className: "mt-1.5 rounded-xl bg-card border-border text-sm"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JdMatchSuggestions, {
								resume,
								jd,
								onApply: (next) => {
									onApply(next);
									toast.success("Suggestion applied.");
								}
							}),
							jd.trim().length > 30 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleRecommendations, {
									profile,
									jd,
									limit: 3
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "review",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewPanel, {
							resume,
							jd: jd || void 0
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "interview",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InterviewQuestionsPanel, {
							resume,
							jd
						})
					})
				]
			})]
		})
	});
}
function QuickAction({ label, cta, busy, onRun }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex items-center justify-between gap-3 rounded-2xl border-border p-3 bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			onClick: onRun,
			disabled: busy,
			className: "h-9 shrink-0 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 font-bold",
			children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : cta
		})]
	});
}
function JdMatchSuggestions({ resume, jd, onApply }) {
	const [busy, setBusy] = import_react.useState(false);
	const [result, setResult] = import_react.useState(null);
	import_react.useEffect(() => {
		setResult(null);
	}, [jd]);
	const analyze = async () => {
		if (jd.trim().length < 30) return;
		setBusy(true);
		try {
			const resumeText = resumeToText(resume);
			setResult(await apiClient.post("/ai/job-match", {
				jobDescription: jd,
				resumeText
			}));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "AI unavailable.");
		} finally {
			setBusy(false);
		}
	};
	if (jd.trim().length < 30) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "rounded-2xl border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground",
		children: "Paste at least a short paragraph of the JD to see tailored suggestions."
	});
	if (!result && !busy) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		onClick: analyze,
		className: "w-full h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-2 h-4 w-4" }), " Analyze with AI"]
	});
	if (busy) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "rounded-2xl border-border p-4 text-center text-xs text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto mb-2 h-5 w-5 animate-spin text-brand" }), "Analyzing with Gemini AI…"]
	});
	if (!result) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 rounded-2xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-brand bg-brand-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xl font-extrabold text-brand",
							children: [result.score, "%"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-bold text-sm",
						children: "Match Score"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Higher = better keyword overlap"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						className: "ml-auto h-8 rounded-lg text-xs",
						onClick: analyze,
						children: "Re-analyze"
					})
				]
			}),
			result.matchedKeywords.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeywordBlock, {
				title: "Matched keywords",
				items: result.matchedKeywords,
				tone: "success"
			}),
			result.missingKeywords.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeywordBlock, {
				title: "Missing keywords",
				items: result.missingKeywords,
				tone: "warn"
			}),
			result.missingSkills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeywordBlock, {
				title: "Missing skills",
				items: result.missingSkills,
				tone: "warn"
			}),
			result.suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: [
						"Suggestions (",
						result.suggestions.length,
						")"
					]
				}), result.suggestions.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "rounded-2xl border-border p-3 bg-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mt-0.5 h-4 w-4 shrink-0 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-foreground/90",
							children: s
						})]
					})
				}, i))]
			})
		]
	});
}
function KeywordBlock({ title, items, tone }) {
	if (!items.length) return null;
	const cls = tone === "success" ? "bg-[oklch(0.94_0.06_150)] text-[oklch(0.35_0.1_150)]" : "bg-[oklch(0.95_0.08_70)] text-[oklch(0.4_0.12_60)]";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs font-bold mb-1.5",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5",
		children: items.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`,
			children: k
		}, k))
	})] });
}
function InterviewQuestionsPanel({ resume, jd }) {
	const [busy, setBusy] = import_react.useState(false);
	const [questions, setQuestions] = import_react.useState([]);
	const generate = async () => {
		setBusy(true);
		try {
			const resumeText = resumeToText(resume);
			setQuestions((await apiClient.post("/ai/interview", {
				resumeText,
				jobDescription: jd || void 0,
				count: 5
			})).questions);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "AI unavailable.");
		} finally {
			setBusy(false);
		}
	};
	if (questions.length === 0 && !busy) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-muted-foreground",
			children: [
				"Practice questions tailored to your resume",
				jd ? " and the job description" : "",
				"."
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: generate,
			className: "w-full h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-2 h-4 w-4" }), " Generate Questions"]
		})]
	});
	if (busy) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-3 py-8 text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs",
			children: "Generating tailored interview questions…"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [questions.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "rounded-2xl border-border p-4 bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 grid h-6 w-6 place-items-center rounded-full bg-brand/10 text-brand text-[10px] font-bold",
					children: i + 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: q.question
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1.5 text-xs text-muted-foreground leading-normal",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-brand",
								children: "Tip — "
							}), q.tip]
						}),
						q.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "mt-2 rounded-full text-[10px]",
							children: q.category
						})
					]
				})]
			})
		}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			onClick: generate,
			className: "w-full h-9 rounded-xl text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: `mr-1.5 h-3.5 w-3.5 ${busy ? "animate-spin" : "hidden"}` }), "Regenerate"]
		})]
	});
}
function Section({ title, sub, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold",
			children: title
		}),
		sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: sub
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 space-y-4",
			children
		})
	] });
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		value,
		onChange: (e) => onChange(e.target.value),
		className: "mt-1.5 h-11 rounded-xl"
	})] });
}
function ProfileStep({ data, update }) {
	const [aiSummaryBusy, setAiSummaryBusy] = import_react.useState(false);
	const handleAiSummary = async () => {
		if (!data.experience[0]?.role && !data.fullName) {
			toast.error("Fill in your name and at least one experience role first.");
			return;
		}
		setAiSummaryBusy(true);
		try {
			update({ summary: (await generateSummary({ data: {
				role: data.experience[0]?.role ?? "Professional",
				seniority: "mid",
				skills: data.skills.map((s) => s.items).join(", ")
			} })).summary });
			toast.success("AI summary generated!");
		} catch {
			toast.error("AI unavailable — check your API key.");
		} finally {
			setAiSummaryBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Profile",
		sub: "Basic contact information that appears at the top.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Full name",
					value: data.fullName,
					onChange: (v) => update({ fullName: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					value: data.email,
					onChange: (v) => update({ email: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					value: data.phone,
					onChange: (v) => update({ phone: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Location",
					value: data.location,
					onChange: (v) => update({ location: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Website / Portfolio",
					value: data.website ?? "",
					onChange: (v) => update({ website: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "LinkedIn URL",
					value: data.linkedin ?? "",
					onChange: (v) => update({ linkedin: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "GitHub URL",
					value: data.github ?? "",
					onChange: (v) => update({ github: v })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Professional summary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				onClick: handleAiSummary,
				disabled: aiSummaryBusy,
				className: "h-7 gap-1.5 rounded-lg text-xs text-brand hover:bg-brand-soft",
				children: [aiSummaryBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-3 w-3" }), "AI Generate"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
			value: data.summary,
			onChange: (e) => update({ summary: e.target.value }),
			rows: 4,
			className: "mt-1.5 rounded-xl",
			placeholder: "A short professional summary highlighting your strengths…"
		})] })]
	});
}
function EducationStep({ data, update }) {
	const set = (i, patch) => {
		const next = [...data.education];
		next[i] = {
			...next[i],
			...patch
		};
		update({ education: next });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Education",
		sub: "List degrees from most recent.",
		children: [data.education.map((ed, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Degree",
						value: ed.degree,
						onChange: (v) => set(i, { degree: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Institution",
						value: ed.school,
						onChange: (v) => set(i, { school: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Period",
						value: ed.year,
						onChange: (v) => set(i, { year: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "CGPA / Grade",
						value: ed.cgpa ?? "",
						onChange: (v) => set(i, { cgpa: v })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => update({ education: data.education.filter((_, x) => x !== i) }),
				className: "mt-2 text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-4 w-4" }), " Remove"]
			})]
		}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			onClick: () => update({ education: [...data.education, {
				degree: "",
				school: "",
				year: "",
				cgpa: ""
			}] }),
			className: "rounded-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Add education"]
		})]
	});
}
function ExperienceStep({ data, update }) {
	const set = (i, patch) => {
		const next = [...data.experience];
		next[i] = {
			...next[i],
			...patch
		};
		update({ experience: next });
	};
	const [rewritingIdx, setRewritingIdx] = import_react.useState(null);
	const handleRewriteBullets = async (i) => {
		const ex = data.experience[i];
		if (!ex.bullets.some(Boolean)) {
			toast.error("Add at least one bullet point first.");
			return;
		}
		setRewritingIdx(i);
		try {
			set(i, { bullets: await Promise.all(ex.bullets.filter(Boolean).map((b) => rewriteBullet({ data: {
				bullet: b,
				role: ex.role
			} }).then((r) => r.bullet))) });
			toast.success("Bullets rewritten with AI ✨");
		} catch {
			toast.error("AI unavailable — check your API key.");
		} finally {
			setRewritingIdx(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Experience",
		sub: "Internships and jobs. Quantify outcomes when possible.",
		children: [data.experience.map((ex, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Role",
							value: ex.role,
							onChange: (v) => set(i, { role: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Company",
							value: ex.company,
							onChange: (v) => set(i, { company: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Period",
							value: ex.period,
							onChange: (v) => set(i, { period: v })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bullet points (one per line)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: () => handleRewriteBullets(i),
							disabled: rewritingIdx === i,
							className: "h-7 gap-1.5 rounded-lg text-xs text-brand hover:bg-brand-soft",
							children: [rewritingIdx === i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), "AI Rewrite"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: ex.bullets.join("\n"),
						onChange: (e) => set(i, { bullets: e.target.value.split("\n") }),
						rows: 4,
						className: "mt-1.5 rounded-xl",
						placeholder: "• Shipped a feature used by 10k+ users."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => update({ experience: data.experience.filter((_, x) => x !== i) }),
					className: "mt-2 text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-4 w-4" }), " Remove"]
				})
			]
		}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			onClick: () => update({ experience: [...data.experience, {
				role: "",
				company: "",
				period: "",
				bullets: [""]
			}] }),
			className: "rounded-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Add experience"]
		})]
	});
}
function ProjectsStep({ data, update }) {
	const set = (i, patch) => {
		const next = [...data.projects];
		next[i] = {
			...next[i],
			...patch
		};
		update({ projects: next });
	};
	const [ghOpen, setGhOpen] = import_react.useState(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Projects",
		sub: "Highlight 2–4 standout projects.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "-mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => setGhOpen(true),
					className: "h-10 rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "mr-1.5 h-4 w-4" }), " Import from GitHub"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "self-center text-xs text-muted-foreground",
					children: "Pull projects automatically from any public GitHub account."
				})]
			}),
			data.projects.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Project name",
							value: p.name,
							onChange: (v) => set(i, { name: v })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tools / stack",
							value: p.tools,
							onChange: (v) => set(i, { tools: v })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bullet points (one per line)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: p.bullets.join("\n"),
							onChange: (e) => set(i, { bullets: e.target.value.split("\n") }),
							rows: 3,
							className: "mt-1.5 rounded-xl",
							placeholder: "• Built and deployed…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => update({ projects: data.projects.filter((_, x) => x !== i) }),
						className: "mt-2 text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-4 w-4" }), " Remove"]
					})
				]
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => update({ projects: [...data.projects, {
					name: "",
					tools: "",
					bullets: [""]
				}] }),
				className: "rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Add project"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GithubImportDialog, {
				open: ghOpen,
				onOpenChange: setGhOpen,
				onImport: (projects) => {
					update({ projects: [...data.projects.filter((p) => p.name.trim() || p.tools.trim() || p.bullets.some(Boolean)), ...projects] });
				}
			})
		]
	});
}
function SkillsStep({ data, update }) {
	const set = (i, patch) => {
		const next = [...data.skills];
		next[i] = {
			...next[i],
			...patch
		};
		update({ skills: next });
	};
	const [aiSkillsBusy, setAiSkillsBusy] = import_react.useState(false);
	const handleAiSkills = async () => {
		const role = data.experience[0]?.role;
		if (!role) {
			toast.error("Add at least one experience role first.");
			return;
		}
		setAiSkillsBusy(true);
		try {
			const result = await suggestSkills({ data: {
				role,
				currentSkills: data.skills.map((s) => s.items).join(", ")
			} });
			update({ skills: [...data.skills, {
				category: "Suggested Skills",
				items: result.skills.join(", ")
			}] });
			toast.success("AI skill suggestions added!");
		} catch {
			toast.error("AI unavailable — check your API key.");
		} finally {
			setAiSkillsBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Skills",
		sub: "Group skills by category. Comma-separated.",
		children: [data.skills.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-[200px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Category",
					value: s.category,
					onChange: (v) => set(i, { category: v })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Items",
					value: s.items,
					onChange: (v) => set(i, { items: v })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => update({ skills: data.skills.filter((_, x) => x !== i) }),
				className: "mt-2 text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-4 w-4" }), " Remove"]
			})]
		}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => update({ skills: [...data.skills, {
					category: "",
					items: ""
				}] }),
				className: "rounded-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Add category"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: handleAiSkills,
				disabled: aiSkillsBusy,
				className: "rounded-xl border-brand/40 text-brand hover:bg-brand-soft",
				children: [aiSkillsBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 h-4 w-4" }), "AI Suggest Skills"]
			})]
		})]
	});
}
function getCleanFontFamily(fontName) {
	if (!fontName) return "inherit";
	const name = fontName.toLowerCase();
	if (name.includes("times") || name.includes("liberationserif") || name.includes("georgia")) return "Georgia, Times New Roman, serif";
	if (name.includes("courier") || name.includes("mono")) return "monospace";
	return "Inter, Arial, sans-serif";
}
function getFontStyles(fontFamily) {
	const lower = fontFamily.toLowerCase();
	const styles = {};
	if (lower.includes("bold") || lower.includes("bd") || lower.includes("black")) styles.fontWeight = "bold";
	if (lower.includes("italic") || lower.includes("oblique") || lower.includes("it")) styles.fontStyle = "italic";
	return styles;
}
function getTextWidth(text, fontStr) {
	if (typeof document === "undefined") return 0;
	try {
		const ctx = document.createElement("canvas").getContext("2d");
		if (!ctx) return 0;
		ctx.font = fontStr;
		return ctx.measureText(text).width;
	} catch {
		return 0;
	}
}
function PageRenderer({ page, pageIdx, onLayoutChange, importedLayout, pdfDoc, zoom = 1, onConvertToNative }) {
	const [containerWidth, setContainerWidth] = import_react.useState(794);
	const containerRef = import_react.useRef(null);
	const canvasRef = import_react.useRef(null);
	const [editingBlock, setEditingBlock] = import_react.useState(null);
	const [editingText, setEditingText] = import_react.useState("");
	const [fontScale, setFontScale] = import_react.useState(1);
	const [widthScale, setWidthScale] = import_react.useState(1);
	const [xOffset, setXOffset] = import_react.useState(0);
	const [yOffset, setYOffset] = import_react.useState(0);
	const [bgColor, setBgColor] = import_react.useState("#ffffff");
	const [textColor, setTextColor] = import_react.useState("#000000");
	const [fontWeight, setFontWeight] = import_react.useState("normal");
	const [textAlign, setTextAlign] = import_react.useState("left");
	const [editingSnapshot, setEditingSnapshot] = import_react.useState(null);
	const [draggingItem, setDraggingItem] = import_react.useState(null);
	import_react.useEffect(() => {
		if (!containerRef.current) return;
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) if (entry.contentRect.width > 0) setContainerWidth(entry.contentRect.width);
		});
		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);
	import_react.useEffect(() => {
		if (!pdfDoc || !canvasRef.current) return;
		let active = true;
		const render = async () => {
			try {
				const pdfPage = await pdfDoc.getPage(pageIdx + 1);
				const viewport = pdfPage.getViewport({ scale: 2 });
				if (!active || !canvasRef.current) return;
				const canvas = canvasRef.current;
				canvas.width = viewport.width;
				canvas.height = viewport.height;
				const ctx = canvas.getContext("2d");
				if (ctx) await pdfPage.render({
					canvasContext: ctx,
					viewport
				}).promise;
			} catch (err) {
				console.error("PDF page render error:", err);
			}
		};
		render();
		return () => {
			active = false;
		};
	}, [pdfDoc, pageIdx]);
	const viewport = page.viewport;
	const scale = containerWidth / viewport.width;
	const updateEditingBlockProp = (propName, value) => {
		if (!editingBlock) return;
		if (propName === "text") setEditingText(value);
		else if (propName === "fontScale") setFontScale(value);
		else if (propName === "widthScale") setWidthScale(value);
		else if (propName === "xOffset") setXOffset(value);
		else if (propName === "yOffset") setYOffset(value);
		else if (propName === "bgColor") setBgColor(value);
		else if (propName === "textColor") setTextColor(value);
		else if (propName === "fontWeight") setFontWeight(value);
		else if (propName === "textAlign") setTextAlign(value);
		const nextLayout = { ...importedLayout };
		nextLayout.pages = [...nextLayout.pages];
		nextLayout.pages[pageIdx] = {
			...nextLayout.pages[pageIdx],
			textItems: [...nextLayout.pages[pageIdx].textItems]
		};
		const currentItem = nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx];
		if (currentItem.originalText === void 0) currentItem.originalText = currentItem.text;
		currentItem[propName] = value;
		onLayoutChange?.(nextLayout);
	};
	const resetPosition = () => {
		setXOffset(0);
		setYOffset(0);
		const nextLayout = { ...importedLayout };
		nextLayout.pages = [...nextLayout.pages];
		nextLayout.pages[pageIdx] = {
			...nextLayout.pages[pageIdx],
			textItems: [...nextLayout.pages[pageIdx].textItems]
		};
		const currentItem = nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx];
		currentItem.xOffset = 0;
		currentItem.yOffset = 0;
		onLayoutChange?.(nextLayout);
	};
	const resetBlock = () => {
		const origText = editingBlock.item.originalText || editingBlock.item.text;
		setEditingText(origText);
		setFontScale(1);
		setWidthScale(1);
		setXOffset(0);
		setYOffset(0);
		setBgColor("#ffffff");
		setTextColor("#000000");
		setFontWeight("normal");
		setTextAlign("left");
		const nextLayout = { ...importedLayout };
		nextLayout.pages = [...nextLayout.pages];
		nextLayout.pages[pageIdx] = {
			...nextLayout.pages[pageIdx],
			textItems: [...nextLayout.pages[pageIdx].textItems]
		};
		nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx] = {
			...editingBlock.item,
			text: origText,
			originalText: origText,
			fontScale: void 0,
			widthScale: void 0,
			xOffset: void 0,
			yOffset: void 0,
			bgColor: void 0,
			textColor: void 0,
			fontWeight: void 0,
			textAlign: void 0
		};
		onLayoutChange?.(nextLayout);
	};
	let isOverflowing = false;
	let computedNewWidth = 0;
	let computedBoxWidth = 0;
	let isBigEdit = false;
	if (editingBlock) {
		const cleanFont = getCleanFontFamily(editingBlock.item.fontFamily || "");
		const fontStyles = getFontStyles(editingBlock.item.fontFamily || "");
		computedNewWidth = getTextWidth(editingText, `${fontWeight || fontStyles.fontWeight || "normal"} ${fontStyles.fontStyle || "normal"} ${editingBlock.item.fontSize}px ${cleanFont}`) * fontScale;
		computedBoxWidth = editingBlock.item.width * widthScale;
		isOverflowing = computedNewWidth > computedBoxWidth + 10;
		const origLen = (editingBlock.item.originalText || editingBlock.item.text).length;
		isBigEdit = editingText.length > origLen + 50;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "pdf-page-render relative bg-white border border-border shadow-soft overflow-hidden select-text transition-all",
		style: {
			width: `${100 * zoom}%`,
			maxWidth: `${viewport.width * zoom}px`,
			aspectRatio: `${viewport.width} / ${viewport.height}`,
			position: "relative"
		},
		children: [
			pdfDoc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute top-0 left-0 w-full h-full pointer-events-none z-0",
				style: { display: "block" }
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-white z-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-10 w-full h-full pointer-events-none",
				children: page.textItems.map((item, itemIdx) => {
					const cleanFont = getCleanFontFamily(item.fontFamily || "");
					const fontStyles = getFontStyles(item.fontFamily || "");
					const isEdited = item.originalText !== void 0 && item.text !== item.originalText || item.xOffset !== void 0 && item.xOffset !== 0 || item.yOffset !== void 0 && item.yOffset !== 0 || item.fontScale !== void 0 && item.fontScale !== 1 || item.widthScale !== void 0 && item.widthScale !== 1 || item.bgColor !== void 0 || item.textColor !== void 0 || item.textAlign !== void 0 || item.fontWeight !== void 0;
					const currentFontScale = item.fontScale ?? 1;
					const currentWidthScale = item.widthScale ?? 1;
					const currentXOffset = item.xOffset ?? 0;
					const currentYOffset = item.yOffset ?? 0;
					const currentBgColor = item.bgColor ?? "#ffffff";
					const currentTextColor = item.textColor ?? "#000000";
					const currentWeight = item.fontWeight ?? (fontStyles.fontWeight || "normal");
					const currentAlign = item.textAlign ?? "left";
					const style = {
						position: "absolute",
						left: `${(item.x + currentXOffset) / viewport.width * 100}%`,
						top: `${(item.y + currentYOffset) / viewport.height * 100}%`,
						width: `${item.width * currentWidthScale / viewport.width * 100}%`,
						height: `${item.height / viewport.height * 100}%`,
						fontSize: `${item.fontSize * scale * currentFontScale}px`,
						fontFamily: cleanFont,
						fontWeight: currentWeight,
						fontStyle: fontStyles.fontStyle || "normal",
						textAlign: currentAlign,
						lineHeight: 1.15,
						whiteSpace: "pre-wrap",
						pointerEvents: "auto",
						boxSizing: "border-box",
						backgroundColor: "transparent",
						color: isEdited ? currentTextColor : "transparent",
						zIndex: 10
					};
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [isEdited && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						position: "absolute",
						left: `${item.x / viewport.width * 100}%`,
						top: `${item.y / viewport.height * 100}%`,
						width: `${item.width / viewport.width * 100}%`,
						height: `${item.height / viewport.height * 100}%`,
						backgroundColor: currentBgColor,
						pointerEvents: "none",
						zIndex: 5
					} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						onClick: (e) => {
							e.stopPropagation();
							if (onLayoutChange) {
								if (item.originalText === void 0) item.originalText = item.text;
								setEditingBlock({
									itemIdx,
									item
								});
								setEditingText(item.text);
								setFontScale(item.fontScale ?? 1);
								setWidthScale(item.widthScale ?? 1);
								setXOffset(item.xOffset ?? 0);
								setYOffset(item.yOffset ?? 0);
								setBgColor(item.bgColor ?? "#ffffff");
								setTextColor(item.textColor ?? "#000000");
								setFontWeight(item.fontWeight ?? (fontStyles.fontWeight || "normal"));
								setTextAlign(item.textAlign ?? "left");
								setEditingSnapshot({ ...item });
							}
						},
						onPointerDown: (e) => {
							if (!onLayoutChange) return;
							if (e.button !== 0) return;
							e.stopPropagation();
							e.currentTarget.setPointerCapture(e.pointerId);
							setDraggingItem({
								itemIdx,
								startX: e.clientX,
								startY: e.clientY,
								origXOffset: item.xOffset || 0,
								origYOffset: item.yOffset || 0
							});
						},
						onPointerMove: (e) => {
							if (!draggingItem || draggingItem.itemIdx !== itemIdx) return;
							e.stopPropagation();
							const dx = e.clientX - draggingItem.startX;
							const dy = e.clientY - draggingItem.startY;
							const displayWidth = viewport.width * scale;
							const displayHeight = viewport.height * scale;
							const pdfDx = dx / displayWidth * viewport.width;
							const pdfDy = dy / displayHeight * viewport.height;
							const nextLayout = { ...importedLayout };
							nextLayout.pages = [...nextLayout.pages];
							nextLayout.pages[pageIdx] = {
								...nextLayout.pages[pageIdx],
								textItems: [...nextLayout.pages[pageIdx].textItems]
							};
							const currentItem = nextLayout.pages[pageIdx].textItems[itemIdx];
							if (currentItem.originalText === void 0) currentItem.originalText = currentItem.text;
							currentItem.xOffset = draggingItem.origXOffset + pdfDx;
							currentItem.yOffset = draggingItem.origYOffset + pdfDy;
							onLayoutChange?.(nextLayout);
						},
						onPointerUp: (e) => {
							if (draggingItem && draggingItem.itemIdx === itemIdx) {
								e.stopPropagation();
								e.currentTarget.releasePointerCapture(e.pointerId);
								setDraggingItem(null);
							}
						},
						style,
						className: cn("outline-none select-text transition-all duration-100", onLayoutChange !== void 0 ? "hover:bg-brand/10 hover:ring-1 hover:ring-brand/40 hover:cursor-move rounded" : ""),
						title: onLayoutChange !== void 0 ? "Drag to Move | Click to Edit" : void 0,
						children: isEdited ? item.text : ""
					})] }, itemIdx);
				})
			}),
			editingBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute z-50 bg-card border border-border shadow-xl rounded-2xl p-4 space-y-3 flex flex-col pointer-events-auto animate-fade-in text-left text-foreground text-xs",
				style: {
					left: `${Math.min(containerWidth - 340, Math.max(10, (editingBlock.item.x + (editingBlock.item.xOffset || 0)) * scale))}px`,
					top: `${Math.min(viewport.height * scale - 370, Math.max(10, (editingBlock.item.y + (editingBlock.item.yOffset || 0) + editingBlock.item.height + 4) * scale))}px`,
					width: "320px"
				},
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b pb-1.5 mb-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-muted-foreground uppercase text-[10px] tracking-wider flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Move, { className: "h-3 w-3" }), " Visual Editor Controls"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-brand hover:underline font-bold text-[10px]",
							onClick: resetBlock,
							children: "Reset All"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center text-[10px] font-semibold text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edit Text" }), editingBlock.item.originalText && editingText !== editingBlock.item.originalText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-brand hover:underline",
								onClick: () => updateEditingBlockProp("text", editingBlock.item.originalText),
								children: "Reset text"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "w-full text-xs p-2.5 rounded-xl border border-border bg-background resize-none outline-none focus:ring-1 focus:ring-brand",
							rows: 3,
							value: editingText,
							onChange: (e) => updateEditingBlockProp("text", e.target.value),
							autoFocus: true,
							placeholder: "Enter replacement text..."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5 bg-muted/30 p-2.5 rounded-xl border border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-[10px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Font Size Scale"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-bold text-brand",
									children: [Math.round(fontScale * 100), "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "0.5",
								max: "1.5",
								step: "0.05",
								value: fontScale,
								onChange: (e) => updateEditingBlockProp("fontScale", parseFloat(e.target.value)),
								className: "w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-brand"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-[10px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Box Width Scale"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-bold text-brand",
									children: [Math.round(widthScale * 100), "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "0.5",
								max: "2.5",
								step: "0.05",
								value: widthScale,
								onChange: (e) => updateEditingBlockProp("widthScale", parseFloat(e.target.value)),
								className: "w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-brand"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3.5 pt-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-muted-foreground block",
								children: "Alignment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex rounded-lg border border-border p-0.5 bg-muted/50 gap-0.5",
								children: [
									"left",
									"center",
									"right"
								].map((align) => {
									const Icon = align === "left" ? TextAlignStart : align === "center" ? TextAlignCenter : TextAlignEnd;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => updateEditingBlockProp("textAlign", align),
										className: cn("flex-1 py-1 rounded flex justify-center items-center hover:bg-background cursor-pointer text-muted-foreground", textAlign === align && "bg-background shadow-xs text-brand"),
										title: `Align ${align}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
									}, align);
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-muted-foreground block",
								children: "Style Toggle"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex rounded-lg border border-border p-0.5 bg-muted/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => updateEditingBlockProp("fontWeight", fontWeight === "bold" ? "normal" : "bold"),
									className: cn("w-full py-1 rounded flex justify-center items-center gap-1 hover:bg-background cursor-pointer text-[10px] font-semibold text-muted-foreground", fontWeight === "bold" && "bg-background shadow-xs text-brand font-bold"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bold, { className: "h-3.5 w-3.5" }), " Bold"]
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3.5 pt-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-muted-foreground block",
								children: "Text Color"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [[
									{
										name: "Black",
										val: "#000000"
									},
									{
										name: "White",
										val: "#ffffff"
									},
									{
										name: "Navy",
										val: "#1e3a8a"
									}
								].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => updateEditingBlockProp("textColor", c.val),
									className: cn("h-4 w-4 rounded-full border border-border/80 cursor-pointer transition-all", textColor === c.val && "ring-2 ring-brand ring-offset-1"),
									style: { backgroundColor: c.val },
									title: c.name
								}, c.val)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "color",
									value: textColor,
									onChange: (e) => updateEditingBlockProp("textColor", e.target.value),
									className: "h-4 w-4 p-0 border-0 bg-transparent cursor-pointer rounded",
									title: "Custom Color"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-muted-foreground block",
								children: "Mask Bg Color"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [[
									{
										name: "White",
										val: "#ffffff"
									},
									{
										name: "Off-white",
										val: "#fcfcfc"
									},
									{
										name: "Slate",
										val: "#f1f5f9"
									}
								].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => updateEditingBlockProp("bgColor", c.val),
									className: cn("h-4 w-4 rounded-full border border-border/80 cursor-pointer transition-all", bgColor === c.val && "ring-2 ring-brand ring-offset-1"),
									style: { backgroundColor: c.val },
									title: c.name
								}, c.val)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "color",
									value: bgColor,
									onChange: (e) => updateEditingBlockProp("bgColor", e.target.value),
									className: "h-4 w-4 p-0 border-0 bg-transparent cursor-pointer rounded",
									title: "Custom Bg"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 pt-1 border-t border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center text-[10px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: "Nudge Offset"
							}), (xOffset !== 0 || yOffset !== 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-[9px] hover:underline",
								onClick: resetPosition,
								children: "Reset Position"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 bg-muted/40 p-1.5 rounded-lg border border-border/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1.5 text-[9px] font-mono font-bold text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"X: ",
									Math.round(xOffset),
									"px"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Y: ",
									Math.round(yOffset),
									"px"
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											updateEditingBlockProp("xOffset", xOffset - 2);
										},
										className: "h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer",
										title: "Nudge Left",
										children: "←"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											updateEditingBlockProp("yOffset", yOffset - 2);
										},
										className: "h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer",
										title: "Nudge Up",
										children: "↑"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											updateEditingBlockProp("yOffset", yOffset + 2);
										},
										className: "h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer",
										title: "Nudge Down",
										children: "↓"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											updateEditingBlockProp("xOffset", xOffset + 2);
										},
										className: "h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer",
										title: "Nudge Right",
										children: "→"
									})
								]
							})]
						})]
					}),
					(isOverflowing || isBigEdit) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-2.5 rounded-xl space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-[10px] leading-tight text-amber-800 dark:text-amber-300",
								children: "⚠️ Layout Overflow Warning"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[9px] text-muted-foreground leading-relaxed",
								children: [isOverflowing && `Text width (~${Math.round(computedNewWidth)}px) exceeds box width (${Math.round(computedBoxWidth)}px). `, isBigEdit && "This edit is large and may overlap nearby items."]
							}),
							onConvertToNative && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: (e) => {
									e.preventDefault();
									onConvertToNative();
								},
								className: "text-[9px] text-brand hover:underline font-bold text-left block cursor-pointer mt-1",
								children: "✨ Convert to Native for template auto-layout"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-1.5 pt-1.5 border-t border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-7 text-xs rounded-lg text-muted-foreground cursor-pointer",
							onClick: () => {
								if (editingSnapshot) {
									const nextLayout = { ...importedLayout };
									nextLayout.pages = [...nextLayout.pages];
									nextLayout.pages[pageIdx] = {
										...nextLayout.pages[pageIdx],
										textItems: [...nextLayout.pages[pageIdx].textItems]
									};
									nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx] = editingSnapshot;
									onLayoutChange?.(nextLayout);
								}
								setEditingBlock(null);
							},
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "h-7 text-xs rounded-lg bg-brand text-brand-foreground font-semibold cursor-pointer",
							onClick: () => setEditingBlock(null),
							children: "Apply"
						})]
					})
				]
			})
		]
	});
}
function ResumePreview({ data, template = "ats-professional", onLayoutChange, pdfBase64, onConvertToNative, forceTemplatePreview = false }) {
	const [pdfDoc, setPdfDoc] = import_react.useState(null);
	const [pdfLoading, setPdfLoading] = import_react.useState(false);
	const [zoom, setZoom] = import_react.useState(1);
	const filename = data.importedPdf?.originalFilename || "";
	const isImage = filename.match(/\.(png|jpe?g|webp)$/i);
	const isDocx = filename.match(/\.(docx?)$/i);
	import_react.useEffect(() => {
		if (pdfBase64 && !isImage && !isDocx) {
			setPdfLoading(true);
			const loadPdfjs = async () => {
				let pdfjsLib = window.pdfjsLib;
				if (!pdfjsLib) {
					await new Promise((resolve, reject) => {
						const script = document.createElement("script");
						script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
						script.onload = () => {
							pdfjsLib = window.pdfjsLib;
							pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
							resolve();
						};
						script.onerror = reject;
						document.head.appendChild(script);
					});
					pdfjsLib = window.pdfjsLib;
				}
				try {
					const bin = atob(pdfBase64);
					const bytes = new Uint8Array(bin.length);
					for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
					setPdfDoc(await pdfjsLib.getDocument({ data: bytes }).promise);
				} catch (err) {
					console.error("Error parsing base64 PDF in preview:", err);
				} finally {
					setPdfLoading(false);
				}
			};
			loadPdfjs();
		}
	}, [
		pdfBase64,
		isImage,
		isDocx
	]);
	if (!forceTemplatePreview) {
		if (isImage && pdfBase64) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full flex justify-center p-4 bg-muted/20 border border-border rounded-3xl select-text overflow-auto max-h-[80vh]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: `data:image/${filename.split(".").pop() || "png"};base64,${pdfBase64}`,
				alt: "Original Resume Visual Reference",
				className: "max-w-full rounded-2xl shadow-md border object-contain max-h-[75vh]"
			})
		});
		if (isDocx) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full bg-white text-slate-800 p-8 rounded-3xl shadow-sm border border-border font-serif text-sm leading-relaxed whitespace-pre-wrap select-text max-h-[80vh] overflow-y-auto text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-center font-bold text-lg mb-6 border-b pb-4 text-slate-900 uppercase tracking-wide",
				children: filename || "Word Document Reference"
			}), data.rawText || "No text could be extracted from this document."]
		});
		if (data.importedLayout) {
			const pages = data.importedLayout.pages || [{
				viewport: data.importedLayout.viewport,
				textItems: data.importedLayout.textItems
			}];
			if (pdfLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full flex flex-col items-center justify-center p-12 bg-muted/20 border border-dashed rounded-3xl gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Loading PDF canvas layer..."
				})]
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between bg-card border border-border p-3 rounded-2xl shadow-sm text-xs select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-muted-foreground uppercase text-[10px] tracking-wider",
							children: "Original Preview Zoom"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								className: "h-8 w-8 rounded-lg cursor-pointer",
								onClick: () => setZoom((z) => Math.max(.5, z - .25)),
								disabled: zoom <= .5,
								title: "Zoom Out",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-mono font-bold min-w-[36px] text-center",
								children: [Math.round(zoom * 100), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								className: "h-8 w-8 rounded-lg cursor-pointer",
								onClick: () => setZoom((z) => Math.min(2, z + .25)),
								disabled: zoom >= 2,
								title: "Zoom In",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "h-4 w-4" })
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					id: "resume-preview-printable",
					className: "w-full flex flex-col gap-6 bg-muted/30 p-4 rounded-3xl items-center select-text overflow-auto max-h-[85vh]",
					children: pages.map((page, pageIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageRenderer, {
						page,
						pageIdx,
						onLayoutChange,
						importedLayout: data.importedLayout,
						pdfDoc,
						zoom,
						onConvertToNative
					}, pageIdx))
				})]
			});
		}
	}
	const custom = data.customization || {
		accentColor: "",
		fontSize: "md",
		spacing: "md"
	};
	const accent = custom.accentColor || (template === "ats-professional" ? "#3b82f6" : template === "modern" ? "#f97316" : template === "minimal" ? "#1e293b" : template === "creative" ? "#d946ef" : "#10b981");
	const fontSize = custom.fontSize || "md";
	const spacing = custom.spacing || "md";
	const sizeClass = fontSize === "sm" ? {
		name: "text-base font-bold",
		body: "text-[11px] leading-snug",
		section: "text-[10px] font-bold tracking-wider uppercase",
		itemTitle: "text-[12px] font-semibold"
	} : fontSize === "lg" ? {
		name: "text-2xl font-extrabold",
		body: "text-[14px] leading-relaxed",
		section: "text-[13px] font-bold tracking-wider uppercase",
		itemTitle: "text-[15px] font-semibold"
	} : {
		name: "text-xl font-bold",
		body: "text-[12px] leading-normal",
		section: "text-[11px] font-bold tracking-wider uppercase",
		itemTitle: "text-[13px] font-semibold"
	};
	const spacingClass = spacing === "sm" ? {
		container: "p-4 space-y-3",
		sectionMargin: "space-y-2",
		itemSpacing: "space-y-1"
	} : spacing === "lg" ? {
		container: "p-8 space-y-6",
		sectionMargin: "space-y-5",
		itemSpacing: "space-y-2.5"
	} : {
		container: "p-6 space-y-4.5",
		sectionMargin: "space-y-4",
		itemSpacing: "space-y-2"
	};
	const renderSummary = () => data.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: spacingClass.itemSpacing,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: sizeClass.section,
			style: { color: accent },
			children: "Summary"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: sizeClass.body,
			children: data.summary
		})]
	});
	const renderExperience = () => data.experience.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: spacingClass.itemSpacing,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: sizeClass.section,
			style: { color: accent },
			children: "Experience"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: spacingClass.itemSpacing,
			children: data.experience.map((e, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "space-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-between gap-1 text-[12px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-foreground",
						children: [
							e.role,
							" — ",
							e.company
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground",
						children: e.period
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "list-disc pl-4 text-muted-foreground",
					children: e.bullets.filter(Boolean).map((bullet, bIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: sizeClass.body,
						children: bullet
					}, bIdx))
				})]
			}, idx))
		})]
	});
	const renderEducation = () => data.education.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: spacingClass.itemSpacing,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: sizeClass.section,
			style: { color: accent },
			children: "Education"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: spacingClass.itemSpacing,
			children: data.education.map((ed, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-wrap justify-between gap-1 text-[12px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: ed.degree
					}),
					" — ",
					ed.school
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] text-muted-foreground",
					children: ed.year
				})]
			}, idx))
		})]
	});
	const renderProjects = () => data.projects.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: spacingClass.itemSpacing,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: sizeClass.section,
			style: { color: accent },
			children: "Projects"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: spacingClass.itemSpacing,
			children: data.projects.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "space-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[12px] font-semibold text-foreground",
					children: [
						p.name,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-normal text-muted-foreground",
							children: ["— ", p.tools]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "list-disc pl-4 text-muted-foreground",
					children: p.bullets.filter(Boolean).map((bullet, bIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: sizeClass.body,
						children: bullet
					}, bIdx))
				})]
			}, idx))
		})]
	});
	const renderSkills = () => data.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: spacingClass.itemSpacing,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: sizeClass.section,
			style: { color: accent },
			children: "Skills"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-0.5 text-[12px]",
			children: data.skills.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold text-foreground",
					children: [s.category, ":"]
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: s.items
				})
			] }, idx))
		})]
	});
	const renderCertifications = () => data.certifications && data.certifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: spacingClass.itemSpacing,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: sizeClass.section,
			style: { color: accent },
			children: "Certifications"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "list-disc pl-4 text-muted-foreground",
			children: data.certifications.filter(Boolean).map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: sizeClass.body,
				children: c
			}, idx))
		})]
	});
	const renderAchievements = () => data.achievements && data.achievements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: spacingClass.itemSpacing,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: sizeClass.section,
			style: { color: accent },
			children: "Achievements"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "list-disc pl-4 text-muted-foreground",
			children: data.achievements.filter(Boolean).map((a, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: sizeClass.body,
				children: a
			}, idx))
		})]
	});
	const renderLanguages = () => data.languages && data.languages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: spacingClass.itemSpacing,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: sizeClass.section,
			style: { color: accent },
			children: "Languages"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: sizeClass.body,
			children: data.languages.filter(Boolean).join(", ")
		})]
	});
	const renderPublications = () => data.publications && data.publications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: spacingClass.itemSpacing,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: sizeClass.section,
			style: { color: accent },
			children: "Publications"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "list-disc pl-4 text-muted-foreground",
			children: data.publications.filter(Boolean).map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: sizeClass.body,
				children: p
			}, idx))
		})]
	});
	const renderVolunteer = () => data.volunteer && data.volunteer.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: spacingClass.itemSpacing,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: sizeClass.section,
			style: { color: accent },
			children: "Volunteer & Leadership"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "list-disc pl-4 text-muted-foreground",
			children: data.volunteer.filter(Boolean).map((v, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: sizeClass.body,
				children: v
			}, idx))
		})]
	});
	if (template === "two-column") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: "resume-preview-printable",
		className: cn("overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft flex text-left"),
		style: { minHeight: "297mm" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-[32%] p-5 space-y-5 flex flex-col shrink-0 border-r border-border",
			style: { backgroundColor: `${accent}0d` },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-12 w-12 rounded-full mx-auto flex items-center justify-center text-sm font-bold animate-pulse-subtle",
					style: {
						backgroundColor: `${accent}20`,
						border: `1px solid ${accent}40`,
						color: accent
					},
					children: data.fullName ? data.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "U"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-base font-extrabold leading-tight text-foreground truncate",
						children: data.fullName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground truncate",
						children: data.experience[0]?.role || "Professional"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: sizeClass.section,
						style: { color: accent },
						children: "Contact"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5 text-[10px] text-muted-foreground break-all",
						children: [
							data.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `mailto:${data.email}`,
									className: "hover:underline text-muted-foreground",
									children: ["📧 ", data.email]
								})
							}),
							data.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${data.phone}`,
								className: "hover:underline text-muted-foreground",
								children: ["📞 ", data.phone]
							}) }),
							data.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["📍 ", data.location] }),
							data.website && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: data.website.startsWith("http") ? data.website : `https://${data.website}`,
									target: "_blank",
									rel: "noreferrer",
									className: "hover:underline font-medium",
									style: { color: accent },
									children: "🔗 Portfolio"
								})
							}),
							data.linkedin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`,
									target: "_blank",
									rel: "noreferrer",
									className: "hover:underline font-medium",
									style: { color: accent },
									children: "💼 LinkedIn"
								})
							}),
							data.github && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: data.github.startsWith("http") ? data.github : `https://${data.github}`,
									target: "_blank",
									rel: "noreferrer",
									className: "hover:underline font-medium",
									style: { color: accent },
									children: "💻 GitHub"
								})
							})
						]
					})]
				}),
				data.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: sizeClass.section,
						style: { color: accent },
						children: "Skills"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: data.skills.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-foreground",
								children: s.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground text-[10px] leading-tight",
								children: s.items
							})]
						}, i))
					})]
				}),
				data.languages && data.languages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: sizeClass.section,
						style: { color: accent },
						children: "Languages"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-muted-foreground break-all font-medium leading-normal",
						children: data.languages.filter(Boolean).join(", ")
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 p-6 space-y-5",
			children: [
				renderSummary(),
				renderExperience(),
				renderProjects(),
				renderEducation(),
				renderCertifications(),
				renderAchievements(),
				renderPublications(),
				renderVolunteer()
			]
		})]
	});
	if (template === "modern") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: "resume-preview-printable",
		className: cn("overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft flex flex-col text-left"),
		style: { minHeight: "297mm" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 text-white space-y-1 shrink-0",
			style: { background: accent },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black uppercase tracking-tight leading-tight",
				children: data.fullName
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[10px] text-white/90 flex flex-wrap gap-x-3 gap-y-1",
				children: [
					data.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `mailto:${data.email}`,
						className: "hover:underline text-white font-medium",
						children: data.email
					}),
					data.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"•",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `tel:${data.phone}`,
							className: "hover:underline text-white",
							children: data.phone
						})
					] }),
					data.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["• ", data.location] }),
					data.website && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"•",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: data.website.startsWith("http") ? data.website : `https://${data.website}`,
							target: "_blank",
							rel: "noreferrer",
							className: "hover:underline text-white font-bold",
							children: "Portfolio"
						})
					] }),
					data.linkedin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"•",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`,
							target: "_blank",
							rel: "noreferrer",
							className: "hover:underline text-white font-bold",
							children: "LinkedIn"
						})
					] }),
					data.github && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"•",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: data.github.startsWith("http") ? data.github : `https://${data.github}`,
							target: "_blank",
							rel: "noreferrer",
							className: "hover:underline text-white font-bold",
							children: "GitHub"
						})
					] })
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 space-y-5 flex-1",
			children: [
				data.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[110px_1fr] gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase"),
						style: { color: accent },
						children: "Summary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: sizeClass.body,
						children: data.summary
					})]
				}),
				data.experience.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[110px_1fr] gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase"),
						style: { color: accent },
						children: "Experience"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-4",
						children: data.experience.map((e, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-baseline gap-1 text-[12px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-foreground",
									children: [
										e.role,
										" — ",
										e.company
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground shrink-0",
									children: e.period
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "list-disc pl-4 text-muted-foreground",
								children: e.bullets.filter(Boolean).map((b, bIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: sizeClass.body,
									children: b
								}, bIdx))
							})]
						}, idx))
					})]
				}),
				data.projects.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[110px_1fr] gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase"),
						style: { color: accent },
						children: "Projects"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: data.projects.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[12px] font-semibold text-foreground",
								children: [
									p.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-normal text-muted-foreground",
										children: ["— ", p.tools]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "list-disc pl-4 text-muted-foreground",
								children: p.bullets.filter(Boolean).map((b, bIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: sizeClass.body,
									children: b
								}, bIdx))
							})]
						}, idx))
					})]
				}),
				data.education.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[110px_1fr] gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase"),
						style: { color: accent },
						children: "Education"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: data.education.map((ed, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between items-baseline gap-1 text-[12px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: [
									ed.degree,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-normal text-muted-foreground",
										children: ["at ", ed.school]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground shrink-0",
								children: ed.year
							})]
						}, idx))
					})]
				}),
				data.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[110px_1fr] gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase"),
						style: { color: accent },
						children: "Skills"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1 text-[12px]",
						children: data.skills.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: [s.category, ":"]
							}),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: s.items
							})
						] }, idx))
					})]
				}),
				data.certifications && data.certifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[110px_1fr] gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase"),
						style: { color: accent },
						children: "Certifications"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "list-disc pl-4 text-muted-foreground",
						children: data.certifications.filter(Boolean).map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: sizeClass.body,
							children: c
						}, idx))
					})]
				}),
				data.achievements && data.achievements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[110px_1fr] gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase"),
						style: { color: accent },
						children: "Achievements"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "list-disc pl-4 text-muted-foreground",
						children: data.achievements.filter(Boolean).map((a, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: sizeClass.body,
							children: a
						}, idx))
					})]
				}),
				data.languages && data.languages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[110px_1fr] gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase"),
						style: { color: accent },
						children: "Languages"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: sizeClass.body,
						children: data.languages.filter(Boolean).join(", ")
					})]
				}),
				data.publications && data.publications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[110px_1fr] gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase"),
						style: { color: accent },
						children: "Publications"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "list-disc pl-4 text-muted-foreground",
						children: data.publications.filter(Boolean).map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: sizeClass.body,
							children: p
						}, idx))
					})]
				}),
				data.volunteer && data.volunteer.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[110px_1fr] gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase"),
						style: { color: accent },
						children: "Volunteer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "list-disc pl-4 text-muted-foreground",
						children: data.volunteer.filter(Boolean).map((v, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: sizeClass.body,
							children: v
						}, idx))
					})]
				})
			]
		})]
	});
	if (template === "minimal") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: "resume-preview-printable",
		className: cn("overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft text-left", spacingClass.container),
		style: { minHeight: "297mm" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-border pb-3 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: cn("text-2xl font-light tracking-tight text-foreground"),
					children: data.fullName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 text-[10px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-1",
					children: [
						data.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `mailto:${data.email}`,
							className: "hover:underline text-muted-foreground",
							children: data.email
						}),
						data.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"•",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `tel:${data.phone}`,
								className: "hover:underline text-muted-foreground",
								children: data.phone
							})
						] }),
						data.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["• ", data.location] }),
						data.website && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"•",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: data.website.startsWith("http") ? data.website : `https://${data.website}`,
								target: "_blank",
								rel: "noreferrer",
								className: "hover:underline text-foreground font-semibold",
								children: "Portfolio"
							})
						] }),
						data.linkedin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"•",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`,
								target: "_blank",
								rel: "noreferrer",
								className: "hover:underline text-foreground font-semibold",
								children: "LinkedIn"
							})
						] }),
						data.github && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"•",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: data.github.startsWith("http") ? data.github : `https://${data.github}`,
								target: "_blank",
								rel: "noreferrer",
								className: "hover:underline text-foreground font-semibold",
								children: "GitHub"
							})
						] })
					]
				})]
			}),
			data.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider"),
					style: { color: accent },
					children: "Summary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: sizeClass.body,
					children: data.summary
				})]
			}),
			data.experience.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider"),
					style: { color: accent },
					children: "Experience"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: data.experience.map((e, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-baseline gap-1 text-[12px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium text-foreground",
								children: [
									e.role,
									" — ",
									e.company
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: e.period
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "list-disc pl-4 text-muted-foreground",
							children: e.bullets.filter(Boolean).map((b, bIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: sizeClass.body,
								children: b
							}, bIdx))
						})]
					}, idx))
				})]
			}),
			data.projects.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider"),
					style: { color: accent },
					children: "Projects"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: data.projects.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[12px] font-medium text-foreground",
							children: [
								p.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-normal text-muted-foreground",
									children: ["— ", p.tools]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "list-disc pl-4 text-muted-foreground",
							children: p.bullets.filter(Boolean).map((b, bIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: sizeClass.body,
								children: b
							}, bIdx))
						})]
					}, idx))
				})]
			}),
			data.education.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider"),
					style: { color: accent },
					children: "Education"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: data.education.map((ed, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between items-baseline gap-1 text-[12px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							ed.degree,
							" — ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: ed.school
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground",
							children: ed.year
						})]
					}, idx))
				})]
			}),
			data.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider"),
					style: { color: accent },
					children: "Skills"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-0.5 text-[12px]",
					children: data.skills.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium text-foreground",
							children: [s.category, ":"]
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: s.items
						})
					] }, idx))
				})]
			}),
			renderCertifications(),
			renderAchievements(),
			renderLanguages(),
			renderPublications(),
			renderVolunteer()
		]
	});
	if (template === "creative") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: "resume-preview-printable",
		className: cn("overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft text-left", spacingClass.container),
		style: { minHeight: "297mm" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-4 border-b border-border pb-4 mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-14 w-14 rounded-full flex items-center justify-center text-lg font-extrabold shrink-0",
					style: {
						backgroundColor: `${accent}20`,
						color: accent,
						border: `2px solid ${accent}`
					},
					children: data.fullName ? data.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "U"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-black tracking-tight",
						style: { color: accent },
						children: data.fullName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: data.experience[0]?.role || "Professional"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 text-[10px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-1",
						children: [
							data.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `mailto:${data.email}`,
								className: "hover:underline text-muted-foreground",
								children: data.email
							}),
							data.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"•",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `tel:${data.phone}`,
									className: "hover:underline text-muted-foreground",
									children: data.phone
								})
							] }),
							data.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["• ", data.location] }),
							data.website && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"•",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: data.website.startsWith("http") ? data.website : `https://${data.website}`,
									target: "_blank",
									rel: "noreferrer",
									className: "hover:underline font-semibold",
									style: { color: accent },
									children: "Portfolio"
								})
							] }),
							data.linkedin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"•",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`,
									target: "_blank",
									rel: "noreferrer",
									className: "hover:underline font-semibold",
									style: { color: accent },
									children: "LinkedIn"
								})
							] }),
							data.github && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"•",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: data.github.startsWith("http") ? data.github : `https://${data.github}`,
									target: "_blank",
									rel: "noreferrer",
									className: "hover:underline font-semibold",
									style: { color: accent },
									children: "GitHub"
								})
							] })
						]
					})
				] })]
			}),
			renderSummary(),
			renderExperience(),
			renderProjects(),
			renderEducation(),
			renderSkills(),
			renderCertifications(),
			renderAchievements(),
			renderLanguages(),
			renderPublications(),
			renderVolunteer()
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: "resume-preview-printable",
		className: cn("overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft text-center", spacingClass.container),
		style: { minHeight: "297mm" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "space-y-1 pb-2 border-b border-border mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-black uppercase tracking-tight text-slate-900",
				children: data.fullName
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[10px] text-muted-foreground flex flex-wrap justify-center gap-x-3 gap-y-1",
				children: [
					data.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `mailto:${data.email}`,
						className: "hover:underline text-muted-foreground",
						children: data.email
					}),
					data.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"•",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `tel:${data.phone}`,
							className: "hover:underline text-muted-foreground",
							children: data.phone
						})
					] }),
					data.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["• ", data.location] }),
					data.website && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"•",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: data.website.startsWith("http") ? data.website : `https://${data.website}`,
							target: "_blank",
							rel: "noreferrer",
							className: "hover:underline text-slate-800 font-semibold",
							children: "Portfolio"
						})
					] }),
					data.linkedin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"•",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`,
							target: "_blank",
							rel: "noreferrer",
							className: "hover:underline text-slate-800 font-semibold",
							children: "LinkedIn"
						})
					] }),
					data.github && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"•",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: data.github.startsWith("http") ? data.github : `https://${data.github}`,
							target: "_blank",
							rel: "noreferrer",
							className: "hover:underline text-slate-800 font-semibold",
							children: "GitHub"
						})
					] })
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 text-left",
			children: [
				renderSummary(),
				renderExperience(),
				renderProjects(),
				renderEducation(),
				renderSkills(),
				renderCertifications(),
				renderAchievements(),
				renderLanguages(),
				renderPublications(),
				renderVolunteer()
			]
		})]
	});
}
function ReviewStep({ data, onPdf, onDocx, pdfBusy, docxBusy, pdfBase64 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Review",
		sub: "Looks great? Download your resume.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onPdf,
				disabled: pdfBusy,
				className: "h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90",
				children: [pdfBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-4 w-4" }), "Download PDF"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onDocx,
				disabled: docxBusy,
				variant: "outline",
				className: "h-11 rounded-xl border-brand/40 text-brand hover:bg-brand-soft",
				children: [docxBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "mr-1.5 h-4 w-4" }), "Export DOCX"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumePreview, {
			data,
			pdfBase64
		})]
	});
}
var STEPS = [
	{
		key: "profile",
		label: "Profile",
		icon: User
	},
	{
		key: "education",
		label: "Education",
		icon: GraduationCap
	},
	{
		key: "experience",
		label: "Experience",
		icon: Briefcase
	},
	{
		key: "projects",
		label: "Projects",
		icon: FolderGit2
	},
	{
		key: "skills",
		label: "Skills",
		icon: Wrench
	},
	{
		key: "review",
		label: "Review",
		icon: Sparkles
	}
];
function EditorPage() {
	const { id } = useParams({ from: "/editor/$id" });
	const [resume, setResume] = import_react.useState(null);
	const [loadingResume, setLoadingResume] = import_react.useState(true);
	const [step, setStep] = import_react.useState(0);
	const [pdfBusy, setPdfBusy] = import_react.useState(false);
	const [docxBusy, setDocxBusy] = import_react.useState(false);
	const [aiOpen, setAiOpen] = import_react.useState(false);
	const [reviewOpen, setReviewOpen] = import_react.useState(false);
	const [history, setHistory] = import_react.useState([]);
	const [historyIndex, setHistoryIndex] = import_react.useState(-1);
	const [pdfBase64, setPdfBase64] = import_react.useState(null);
	const [previewTab, setPreviewTab] = import_react.useState("visual");
	import_react.useEffect(() => {
		async function loadPdf() {
			if (!resume || !resume.data.importedLayout) return;
			const local = await getPdfBinary(resume.id);
			if (local) {
				setPdfBase64(local);
				return;
			}
			if (resume.data.importedPdf?.storagePath) try {
				const { data: fileData, error } = await supabase.storage.from("imported_resumes").download(resume.data.importedPdf.storagePath);
				if (!error && fileData) {
					const reader = new FileReader();
					reader.readAsDataURL(fileData);
					reader.onloadend = () => {
						const base64data = reader.result.split(",")[1];
						setPdfBase64(base64data);
						storePdfBinary(resume.id, base64data);
					};
				}
			} catch (storageErr) {
				console.warn("Could not download PDF from storage:", storageErr);
			}
		}
		loadPdf();
	}, [resume?.id]);
	const handleUndo = () => {
		if (historyIndex > 0) {
			const nextIdx = historyIndex - 1;
			setHistoryIndex(nextIdx);
			const layout = history[nextIdx];
			update({ importedLayout: layout });
			if (resume) saveResume({
				...resume,
				data: {
					...resume.data,
					importedLayout: layout
				}
			});
		}
	};
	const handleRedo = () => {
		if (historyIndex < history.length - 1) {
			const nextIdx = historyIndex + 1;
			setHistoryIndex(nextIdx);
			const layout = history[nextIdx];
			update({ importedLayout: layout });
			if (resume) saveResume({
				...resume,
				data: {
					...resume.data,
					importedLayout: layout
				}
			});
		}
	};
	import_react.useEffect(() => {
		if (resume?.data.importedLayout && history.length === 0) {
			setHistory([resume.data.importedLayout]);
			setHistoryIndex(0);
		}
	}, [resume, history]);
	import_react.useEffect(() => {
		const handleKeyDown = (e) => {
			if (resume?.data.isVisualMode !== false && resume?.data.importedLayout) {
				if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
					e.preventDefault();
					handleUndo();
				}
				if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
					e.preventDefault();
					handleRedo();
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		historyIndex,
		history,
		resume
	]);
	import_react.useEffect(() => {
		async function load() {
			const local = getResume(id);
			if (local) {
				setResume(local);
				setLoadingResume(false);
				return;
			}
			const { isUUID } = await import("./app-shell-q8BzYArD.mjs").then((n) => n.r).then((n) => n.c);
			if (isUUID(id)) try {
				const { data, error } = await supabase.from("resumes").select("*").eq("id", id).single();
				if (!error && data) setResume({
					id: data.id,
					title: data.title,
					profileType: data.profile_type,
					template: data.template,
					updatedAt: new Date(data.updated_at).getTime(),
					downloads: data.downloads,
					atsScore: data.ats_score,
					data: data.data
				});
			} catch (err) {
				console.warn("Supabase fetch failed:", err);
			}
			setLoadingResume(false);
		}
		load();
	}, [id]);
	if (loadingResume) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[50vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-muted-foreground",
				children: "Loading resume…"
			})]
		})
	}) });
	if (!resume) throw notFound();
	const update = (patch) => setResume((r) => r ? {
		...r,
		data: {
			...r.data,
			...patch
		}
	} : null);
	const handleLayoutChange = (nextLayout) => {
		const newHistory = history.slice(0, historyIndex + 1);
		newHistory.push(nextLayout);
		setHistory(newHistory);
		setHistoryIndex(newHistory.length - 1);
		update({ importedLayout: nextLayout });
		if (resume) saveResume({
			...resume,
			data: {
				...resume.data,
				importedLayout: nextLayout
			}
		});
	};
	const updateCustomization = (patch) => {
		setResume((r) => {
			if (!r) return null;
			const current = r.data.customization || {
				accentColor: "",
				fontSize: "md",
				spacing: "md"
			};
			return {
				...r,
				data: {
					...r.data,
					customization: {
						...current,
						...patch
					}
				}
			};
		});
	};
	const handleSave = () => {
		if (resume) {
			saveResume(resume);
			toast.success("Resume saved");
		}
	};
	const handleConvertToNative = async () => {
		if (!confirm("✨ Convert to Native Resume Builder?\n\nThis will use AI to scan your original resume text and fully populate all forms on the left so you can use our dynamic templates. Your original visual edit layout will remain fully available if you wish to switch back.")) return;
		toast.loading("AI is parsing and structuring your resume...", { id: "conv" });
		try {
			const { parseResumeStructure } = await import("./ai.functions-B6hcOi12.mjs");
			const textToParse = resume.data.rawText || resume.data.importedLayout?.pages?.flatMap((p) => p.textItems.map((i) => i.text)).join(" ") || "";
			if (!textToParse || textToParse.length < 20) throw new Error("No sufficient resume text extracted to convert.");
			const parsed = await parseResumeStructure({ data: { resumeText: textToParse } });
			update({
				fullName: parsed.fullName || resume.data.fullName,
				email: parsed.email || resume.data.email,
				phone: parsed.phone || resume.data.phone,
				location: parsed.location || resume.data.location,
				summary: parsed.summary || resume.data.summary,
				education: parsed.education || resume.data.education,
				experience: parsed.experience || resume.data.experience,
				projects: parsed.projects || resume.data.projects,
				skills: parsed.skills || resume.data.skills,
				isVisualMode: false
			});
			toast.success("Successfully converted resume! You can now use templates.", { id: "conv" });
		} catch (err) {
			console.error("AI Conversion error:", err);
			toast.error(err instanceof Error ? err.message : "AI conversion failed.", { id: "conv" });
		}
	};
	const handlePdf = async () => {
		setPdfBusy(true);
		try {
			const { downloadResumePdf } = await import("./pdf-export-B0ZOsbX8.mjs");
			const filename = await downloadResumePdf(resume, "resume-preview-printable");
			toast.success(`Downloaded ${filename}`);
			const next = {
				...resume,
				downloads: resume.downloads + 1
			};
			setResume(next);
			saveResume(next);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "PDF export failed");
		} finally {
			setPdfBusy(false);
		}
	};
	const handleDownloadClick = () => {
		saveResume(resume);
		setReviewOpen(true);
	};
	const handleDocx = async () => {
		setDocxBusy(true);
		try {
			const { downloadResumeDocx } = await import("./app-shell-q8BzYArD.mjs").then((n) => n.f);
			const filename = await downloadResumeDocx(resume);
			toast.success(`Downloaded ${filename}`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "DOCX export failed");
		} finally {
			setDocxBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full px-4 py-6 md:px-8 md:py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "icon",
							className: "h-10 w-10 rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/resumes",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: resume.title,
								onChange: (e) => setResume((r) => r ? {
									...r,
									title: e.target.value
								} : null),
								className: "h-10 max-w-xs rounded-xl border-transparent bg-transparent px-2 text-xl font-bold hover:bg-card focus-visible:bg-card"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-2 text-xs text-muted-foreground",
								children: [
									"Step ",
									step + 1,
									" of ",
									STEPS.length,
									" — ",
									STEPS[step].label
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setAiOpen(true),
								variant: "outline",
								className: "h-10 rounded-xl border-brand/40 bg-brand-soft/40 text-brand hover:bg-brand-soft/70 cursor-pointer animate-pulse-subtle",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 h-4 w-4" }), " AI Assistant"]
							}),
							resume.data.isVisualMode !== false && resume.data.importedLayout && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1 border-r pr-2 border-border mr-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									className: "h-10 w-10 rounded-xl cursor-pointer",
									onClick: handleUndo,
									disabled: historyIndex <= 0,
									title: "Undo last edit (Ctrl+Z)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									className: "h-10 w-10 rounded-xl cursor-pointer",
									onClick: handleRedo,
									disabled: historyIndex >= history.length - 1,
									title: "Redo last edit (Ctrl+Y)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Redo, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleSave,
								variant: "outline",
								className: "h-10 rounded-xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1.5 h-4 w-4" }), " Save"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleDocx,
								disabled: docxBusy,
								variant: "outline",
								className: "h-10 rounded-xl border-brand/40 text-brand hover:bg-brand-soft",
								children: [docxBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "mr-1.5 h-4 w-4" }), "DOCX"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleDownloadClick,
								disabled: pdfBusy,
								className: "h-10 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold",
								children: [pdfBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-4 w-4" }), "Download PDF"]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6",
					children: STEPS.map((s, i) => {
						const done = i < step;
						const active = i === step;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setStep(i),
							className: cn("flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors", active && "border-brand bg-brand-soft text-brand", done && !active && "border-brand/40 bg-card text-brand", !active && !done && "border-border bg-card text-muted-foreground hover:border-brand/30"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold", active ? "bg-brand text-brand-foreground" : done ? "bg-brand/20 text-brand" : "bg-muted text-muted-foreground"),
								children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : i + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm font-semibold",
								children: s.label
							})]
						}) }, s.key);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-soft md:p-7",
						children: [
							resume.data.importedLayout && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-6 rounded-2xl border border-brand/25 bg-brand-soft/35 p-5 text-sm shadow-sm transition-all animate-fade-in",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between flex-wrap gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "font-bold text-foreground text-sm",
													children: resume.data.isVisualMode !== false ? "Visual Edit Mode Active" : "Template Mode Active"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full bg-brand-soft px-2.5 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider",
													children: resume.data.isVisualMode !== false ? "Original Layout" : "Dynamic Layout"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
												children: resume.data.isVisualMode !== false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													"We've preserved the exact visual styling and layout of your uploaded PDF.",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "block mt-1.5 text-emerald-700 dark:text-emerald-400 font-semibold",
														children: "✅ Your Profile, Education, Experience, Projects, and Skills are auto-filled on the left — use the form tabs to edit any section directly, or click on the preview to make visual edits."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "block mt-1 text-amber-700 dark:text-amber-500",
														children: "⚠️ Visual Edit Mode is optimized for minor text updates. Use \"Convert to Native\" for extensive restructuring."
													})
												] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "You are currently using one of our built-in templates. Your original imported visual layout is preserved." })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3.5 flex flex-wrap gap-2",
												children: resume.data.isVisualMode !== false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-8 rounded-lg text-xs bg-background hover:bg-muted border-brand/35 text-brand hover:text-brand font-semibold cursor-pointer shadow-sm",
													onClick: handleConvertToNative,
													children: "✨ Convert to Native"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "ghost",
													className: "h-8 rounded-lg text-xs hover:bg-muted font-medium text-muted-foreground hover:text-foreground cursor-pointer",
													onClick: () => {
														update({ isVisualMode: false });
														toast.info("Switched to Template Mode. You can toggle back anytime.");
													},
													children: "Use Template Mode"
												})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-8 rounded-lg text-xs bg-background hover:bg-brand-soft border-brand/35 text-brand hover:text-brand font-semibold cursor-pointer shadow-sm",
													onClick: () => {
														update({ isVisualMode: true });
														toast.success("Restored Visual Edit Mode!");
													},
													children: "↩ Switch to Visual Edit Mode"
												})
											})
										]
									})]
								})
							}),
							step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileStep, {
								data: resume.data,
								update
							}),
							step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EducationStep, {
								data: resume.data,
								update
							}),
							step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperienceStep, {
								data: resume.data,
								update
							}),
							step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectsStep, {
								data: resume.data,
								update
							}),
							step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillsStep, {
								data: resume.data,
								update
							}),
							step === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewStep, {
								data: resume.data,
								onPdf: handleDownloadClick,
								onDocx: handleDocx,
								pdfBusy,
								docxBusy,
								pdfBase64
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-7 flex items-center justify-between border-t border-border pt-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									disabled: step === 0,
									onClick: () => setStep((s) => Math.max(0, s - 1)),
									className: "h-11 rounded-xl",
									children: "Previous"
								}), step < STEPS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => {
										saveResume(resume);
										setStep((s) => s + 1);
									},
									className: "h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
									children: "Save & Continue"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: handleSave,
									className: "h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
									children: "Finish"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden lg:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sticky top-24 space-y-4",
							children: [resume.data.isVisualMode !== false && resume.data.importedLayout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-brand/20 bg-brand-soft/20 p-5 shadow-soft text-center space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-bold text-brand-dark text-sm flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Visual Edit Mode"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-relaxed",
										children: "Layout options, colors, and font sizes are locked to match your uploaded PDF exactly."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										className: "w-full h-9 rounded-xl text-xs font-bold bg-background hover:bg-brand-soft border-brand/35 text-brand cursor-pointer",
										onClick: () => update({ isVisualMode: false }),
										children: "Switch to Dynamic Template Mode"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-5 shadow-soft space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-bold text-foreground",
										children: "Layout Template"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2.5 grid grid-cols-2 gap-2",
										children: [
											"ats-professional",
											"modern",
											"minimal",
											"creative",
											"two-column"
										].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setResume((r) => r ? {
													...r,
													template: t
												} : null);
												saveResume({
													...resume,
													template: t
												});
											},
											className: cn("rounded-xl border px-3 py-2 text-center text-xs font-semibold capitalize transition-all", resume.template === t ? "border-brand bg-brand-soft text-brand shadow-sm" : "border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-foreground"),
											children: t.replace("-", " ")
										}, t))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-bold text-foreground",
										children: "Accent Color"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2.5 flex flex-wrap gap-2",
										children: [
											{
												name: "Brand",
												value: ""
											},
											{
												name: "Ocean",
												value: "#0284c7"
											},
											{
												name: "Emerald",
												value: "#059669"
											},
											{
												name: "Indigo",
												value: "#4f46e5"
											},
											{
												name: "Amber",
												value: "#d97706"
											},
											{
												name: "Crimson",
												value: "#dc2626"
											},
											{
												name: "Slate",
												value: "#475569"
											}
										].map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => updateCustomization({ accentColor: col.value }),
											className: cn("flex h-7 items-center justify-center rounded-lg border px-2.5 text-[11px] font-semibold transition-all", (resume.data.customization?.accentColor ?? "") === col.value ? "border-brand bg-brand-soft text-brand font-bold" : "border-border bg-background text-muted-foreground hover:bg-muted"),
											children: [col.value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mr-1 h-2.5 w-2.5 rounded-full",
												style: { backgroundColor: col.value }
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-1 h-2.5 w-2.5 rounded-full bg-brand" }), col.name]
										}, col.name))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-bold text-foreground",
											children: "Font Size"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2.5 flex gap-1.5",
											children: [
												"sm",
												"md",
												"lg"
											].map((sz) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => updateCustomization({ fontSize: sz }),
												className: cn("flex-1 rounded-lg border py-1.5 text-center text-xs font-semibold capitalize transition-all", (resume.data.customization?.fontSize ?? "md") === sz ? "border-brand bg-brand-soft text-brand" : "border-border bg-background text-muted-foreground hover:bg-muted"),
												children: sz === "sm" ? "Small" : sz === "md" ? "Medium" : "Large"
											}, sz))
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-bold text-foreground",
											children: "Spacing"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2.5 flex gap-1.5",
											children: [
												"sm",
												"md",
												"lg"
											].map((sp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => updateCustomization({ spacing: sp }),
												className: cn("flex-1 rounded-lg border py-1.5 text-center text-xs font-semibold capitalize transition-all", (resume.data.customization?.spacing ?? "md") === sp ? "border-brand bg-brand-soft text-brand" : "border-border bg-background text-muted-foreground hover:bg-muted"),
												children: sp === "sm" ? "Compact" : sp === "md" ? "Normal" : "Relaxed"
											}, sp))
										})] })]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-4 shadow-soft",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
											children: "Live Preview"
										}), resume.data.importedLayout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center rounded-xl border border-border bg-muted/50 p-0.5 gap-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setPreviewTab("visual"),
												className: cn("flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer", previewTab === "visual" ? "bg-background text-brand shadow-xs" : "text-muted-foreground hover:text-foreground"),
												title: "Original PDF Canvas — visual edits only",
												children: "📄 Visual PDF"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setPreviewTab("template"),
												className: cn("flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer", previewTab === "template" ? "bg-background text-brand shadow-xs" : "text-muted-foreground hover:text-foreground"),
												title: "Template Preview — shows all form edits live",
												children: "✨ Template"
											})]
										}) : resume.data.isVisualMode !== false && resume.data.importedLayout && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-brand bg-brand-soft px-2 py-0.5 rounded-full font-bold",
											children: "✏️ Click to Edit Text"
										})]
									}),
									previewTab === "template" && resume.data.importedLayout && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold",
										children: "✅ Showing live form data — all your edits (projects, experience, etc.) appear here"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumePreview, {
										data: resume.data,
										template: resume.template,
										onLayoutChange: previewTab === "visual" ? handleLayoutChange : void 0,
										pdfBase64: previewTab === "visual" ? pdfBase64 : null,
										onConvertToNative: handleConvertToNative,
										forceTemplatePreview: previewTab === "template"
									})
								]
							})]
						})
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiAssistantPanel, {
			open: aiOpen,
			onOpenChange: setAiOpen,
			resume,
			onApply: setResume
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewBeforeExportDialog, {
			open: reviewOpen,
			onOpenChange: setReviewOpen,
			resume,
			onDownload: handlePdf
		})
	] });
}
//#endregion
export { EditorPage as component, suggestSkills as i, parseResumeStructure as n, rewriteBullet as r, generateSummary as t };
