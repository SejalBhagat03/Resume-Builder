import { o as __toESM } from "../_runtime.mjs";
import { t as AppShell } from "./app-shell-q8BzYArD.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Input, t as Button } from "./button-CHSNwFnT.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as MapPin, F as Linkedin, G as FolderGit2, H as Globe, P as LoaderCircle, T as Phone, U as Github, V as GraduationCap, a as Wrench, b as Save, c as Upload, dt as Award, j as Mail, p as Trash2, pt as ArrowRight, s as User, st as Briefcase, u as Trophy, v as Sparkles, w as Plus, z as Languages } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-DHSY72pW.mjs";
import { t as Textarea } from "./textarea-DTF9kA1O.mjs";
import { i as generateSummary, n as Progress, r as RoleRecommendations, t as Card } from "./role-recommendations-nouxKSk3.mjs";
import { o as GithubImportDialog } from "./github-import-dialog-DznuUkqn.mjs";
import { n as useProfile, t as profileCompleteness } from "./profile-store-PZTXlT2r.mjs";
import { parseResumeFile } from "./parse.functions-BLPK13no.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-r-2kt4wq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const [profile, updateProfile] = useProfile();
	const completeness = profileCompleteness(profile);
	const [parsing, setParsing] = import_react.useState(false);
	const [ghOpen, setGhOpen] = import_react.useState(false);
	const set = (key, value) => updateProfile((p) => ({
		...p,
		[key]: value
	}));
	const handleResumeUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setParsing(true);
		const reader = new FileReader();
		reader.onload = async (event) => {
			const base64 = event.target?.result?.toString().split(",")[1];
			if (!base64) {
				toast.error("Failed to read file.");
				setParsing(false);
				return;
			}
			try {
				const result = await parseResumeFile({ data: {
					base64,
					filename: file.name
				} });
				updateProfile((p) => ({
					...p,
					fullName: result.fullName || p.fullName,
					email: result.email || p.email,
					phone: result.phone || p.phone,
					summary: result.summary || p.summary
				}));
				toast.success("Successfully parsed resume and populated your details!");
			} catch (err) {
				console.error(err);
				toast.error("Failed to parse resume file.");
			} finally {
				setParsing(false);
			}
		};
		reader.readAsDataURL(file);
	};
	const handleGithubImport = (importedProjects) => {
		set("projects", [...profile.projects, ...importedProjects.map((p) => ({
			name: p.name,
			tools: p.tools,
			bullets: p.bullets
		}))]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-extrabold tracking-tight",
					children: "Your Profile"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm text-muted-foreground",
					children: "Fill this once — every resume you build reuses this information. Update it any time."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => toast.success("Profile saved"),
					className: "h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1.5 h-4 w-4" }), " Save Profile"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-6 rounded-2xl border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Profile completeness"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Fuller profile = better AI suggestions and stronger resumes."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xl font-extrabold text-brand",
						children: [completeness, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: completeness,
					className: "mt-3 h-2"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-6 rounded-2xl border-dashed border-2 border-brand/40 bg-brand-soft/20 p-5 flex flex-col items-center justify-center text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-8 w-8 text-brand animate-pulse" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-sm font-semibold",
						children: "Want to bootstrap your profile?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-sm text-xs text-muted-foreground",
						children: "Upload your old resume (PDF, TXT, or DOCX) to automatically pre-fill details like your name, email, phone, and professional summary."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "h-10 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 px-4 inline-flex items-center justify-center text-sm font-semibold cursor-pointer transition-colors",
							children: ["Select Resume File", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: ".pdf,.txt,.docx",
								className: "hidden",
								onChange: handleResumeUpload,
								disabled: parsing
							})]
						}), parsing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-brand" })]
					})
				]
			}),
			completeness >= 40 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleRecommendations, { profile })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
				icon: User,
				title: "Personal details",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
						label: "Full name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.fullName,
							onChange: (e) => set("fullName", e.target.value),
							className: "h-11 rounded-xl"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
						label: "Headline / Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.title,
							onChange: (e) => set("title", e.target.value),
							placeholder: "e.g. Full Stack Developer",
							className: "h-11 rounded-xl"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldRow, {
						label: "Professional summary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: profile.summary,
							onChange: (e) => set("summary", e.target.value),
							rows: 4,
							className: "rounded-xl",
							placeholder: "A short, impact-focused summary."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => {
								set("summary", generateSummary(profile));
								toast.success("Generated a draft summary from your profile.");
							},
							className: "mt-2 h-9 rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 h-3.5 w-3.5 text-brand" }), " Generate Summary"]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				icon: Mail,
				title: "Contact & links",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
							icon: Mail,
							value: profile.email,
							onChange: (v) => set("email", v),
							placeholder: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
							icon: Phone,
							value: profile.phone,
							onChange: (v) => set("phone", v),
							placeholder: "Phone"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
							icon: MapPin,
							value: profile.location,
							onChange: (v) => set("location", v),
							placeholder: "Location"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
							icon: Github,
							value: profile.github,
							onChange: (v) => set("github", v),
							placeholder: "GitHub URL or handle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
							icon: Linkedin,
							value: profile.linkedin,
							onChange: (v) => set("linkedin", v),
							placeholder: "LinkedIn URL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
							icon: Globe,
							value: profile.portfolio,
							onChange: (v) => set("portfolio", v),
							placeholder: "Portfolio URL"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeaterSection, {
				icon: GraduationCap,
				title: "Education",
				items: profile.education,
				onAdd: () => set("education", [...profile.education, {
					degree: "",
					school: "",
					year: "",
					cgpa: ""
				}]),
				onRemove: (i) => set("education", profile.education.filter((_, x) => x !== i)),
				render: (ed, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
							label: "Degree",
							value: ed.degree,
							onChange: (v) => updEd(i, { degree: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
							label: "Institution",
							value: ed.school,
							onChange: (v) => updEd(i, { school: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
							label: "Period",
							value: ed.year,
							onChange: (v) => updEd(i, { year: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
							label: "CGPA / Grade",
							value: ed.cgpa ?? "",
							onChange: (v) => updEd(i, { cgpa: v })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeaterSection, {
				icon: Briefcase,
				title: "Experience",
				items: profile.experience,
				onAdd: () => set("experience", [...profile.experience, {
					role: "",
					company: "",
					period: "",
					bullets: [""]
				}]),
				onRemove: (i) => set("experience", profile.experience.filter((_, x) => x !== i)),
				render: (ex, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
							label: "Role",
							value: ex.role,
							onChange: (v) => updExp(i, { role: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
							label: "Company",
							value: ex.company,
							onChange: (v) => updExp(i, { company: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
							label: "Period",
							value: ex.period,
							onChange: (v) => updExp(i, { period: v })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bullet points (one per line)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: ex.bullets.join("\n"),
						onChange: (e) => updExp(i, { bullets: e.target.value.split("\n") }),
						rows: 3,
						className: "mt-1.5 rounded-xl"
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeaterSection, {
				icon: FolderGit2,
				title: "Projects",
				items: profile.projects,
				headerAction: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => setGhOpen(true),
					className: "h-9 rounded-xl border-brand/30 bg-card hover:bg-brand-soft/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "mr-1.5 h-4 w-4" }), " Sync GitHub Repos"]
				}),
				onAdd: () => set("projects", [...profile.projects, {
					name: "",
					tools: "",
					bullets: [""]
				}]),
				onRemove: (i) => set("projects", profile.projects.filter((_, x) => x !== i)),
				render: (p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
						label: "Project name",
						value: p.name,
						onChange: (v) => updProj(i, { name: v })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
						label: "Tools / stack",
						value: p.tools,
						onChange: (v) => updProj(i, { tools: v })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bullet points (one per line)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: p.bullets.join("\n"),
						onChange: (e) => updProj(i, { bullets: e.target.value.split("\n") }),
						rows: 3,
						className: "mt-1.5 rounded-xl"
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeaterSection, {
				icon: Wrench,
				title: "Skills",
				items: profile.skills,
				onAdd: () => set("skills", [...profile.skills, {
					category: "",
					items: ""
				}]),
				onRemove: (i) => set("skills", profile.skills.filter((_, x) => x !== i)),
				render: (s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-[200px_minmax(0,1fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
						label: "Category",
						value: s.category,
						onChange: (v) => updSkill(i, { category: v })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
						label: "Items (comma-separated)",
						value: s.items,
						onChange: (v) => updSkill(i, { items: v })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeaterSection, {
				icon: Award,
				title: "Certifications",
				items: profile.certifications,
				onAdd: () => set("certifications", [...profile.certifications, {
					name: "",
					issuer: "",
					year: ""
				}]),
				onRemove: (i) => set("certifications", profile.certifications.filter((_, x) => x !== i)),
				render: (c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
							label: "Name",
							value: c.name,
							onChange: (v) => updCert(i, { name: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
							label: "Issuer",
							value: c.issuer,
							onChange: (v) => updCert(i, { issuer: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
							label: "Year",
							value: c.year,
							onChange: (v) => updCert(i, { year: v })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeaterSection, {
				icon: Languages,
				title: "Languages",
				items: profile.languages,
				onAdd: () => set("languages", [...profile.languages, {
					name: "",
					level: ""
				}]),
				onRemove: (i) => set("languages", profile.languages.filter((_, x) => x !== i)),
				render: (l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
						label: "Language",
						value: l.name,
						onChange: (v) => updLang(i, { name: v })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
						label: "Level",
						value: l.level,
						onChange: (v) => updLang(i, { level: v })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeaterSection, {
				icon: Trophy,
				title: "Achievements",
				items: profile.achievements,
				onAdd: () => set("achievements", [...profile.achievements, {
					title: "",
					detail: ""
				}]),
				onRemove: (i) => set("achievements", profile.achievements.filter((_, x) => x !== i)),
				render: (a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-[260px_minmax(0,1fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
						label: "Title",
						value: a.title,
						onChange: (v) => updAch(i, { title: v })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasicField, {
						label: "Detail",
						value: a.detail,
						onChange: (v) => updAch(i, { detail: v })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-brand/30 bg-brand-soft/40 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-base font-bold text-foreground",
					children: "Ready to build a resume?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "We'll auto-import everything from this profile — you choose what to include."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						search: { create: true },
						children: ["Create resume from Profile ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
					})
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GithubImportDialog, {
		open: ghOpen,
		onOpenChange: setGhOpen,
		onImport: handleGithubImport,
		initialUsername: profile.github.split("/").pop() || ""
	})] });
	function updEd(i, patch) {
		set("education", profile.education.map((x, j) => j === i ? {
			...x,
			...patch
		} : x));
	}
	function updExp(i, patch) {
		set("experience", profile.experience.map((x, j) => j === i ? {
			...x,
			...patch
		} : x));
	}
	function updProj(i, patch) {
		set("projects", profile.projects.map((x, j) => j === i ? {
			...x,
			...patch
		} : x));
	}
	function updSkill(i, patch) {
		set("skills", profile.skills.map((x, j) => j === i ? {
			...x,
			...patch
		} : x));
	}
	function updCert(i, patch) {
		set("certifications", profile.certifications.map((x, j) => j === i ? {
			...x,
			...patch
		} : x));
	}
	function updLang(i, patch) {
		set("languages", profile.languages.map((x, j) => j === i ? {
			...x,
			...patch
		} : x));
	}
	function updAch(i, patch) {
		set("achievements", profile.achievements.map((x, j) => j === i ? {
			...x,
			...patch
		} : x));
	}
}
function SectionCard({ icon: Icon, title, children, headerAction }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-4 flex items-center justify-between gap-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold",
					children: title
				})]
			}), headerAction]
		}), children]
	});
}
function RepeaterSection({ icon, title, items, render, onAdd, onRemove, headerAction }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
		icon,
		title,
		headerAction,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border p-4",
				children: [render(item, i), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: () => onRemove(i),
					className: "mt-2 text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-4 w-4" }), " Remove"]
				})]
			}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				onClick: onAdd,
				className: "rounded-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }),
					" Add ",
					title.toLowerCase().replace(/s$/, "")
				]
			})]
		})
	});
}
function FieldRow({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1.5",
		children
	})] });
}
function BasicField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		value,
		onChange: (e) => onChange(e.target.value),
		className: "mt-1.5 h-11 rounded-xl"
	})] });
}
function IconField({ icon: Icon, value, onChange, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			className: "h-11 rounded-xl pl-9"
		})]
	});
}
//#endregion
export { ProfilePage as component };
