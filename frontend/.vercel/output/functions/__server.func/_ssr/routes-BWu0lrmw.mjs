import { o as __toESM } from "../_runtime.mjs";
import { n as TEMPLATES, t as AppShell, u as useResumes } from "./app-shell-q8BzYArD.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-CHSNwFnT.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Download, L as LayoutTemplate, Q as EllipsisVertical, c as Upload, f as TrendingUp, i as X, it as ChevronLeft, q as FileText, r as Zap, rt as ChevronRight, s as User, v as Sparkles, w as Plus } from "../_libs/lucide-react.mjs";
import { r as RoleRecommendations } from "./role-recommendations-nouxKSk3.mjs";
import { n as useProfile, t as profileCompleteness } from "./profile-store-PZTXlT2r.mjs";
import { n as ResumeThumb, t as CreateResumeWizard } from "./create-resume-wizard-BCwIZehE.mjs";
import { t as RelativeTime } from "./relative-time-Btn9Um9f.mjs";
import { t as Route } from "./routes-YDgTTHTW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BWu0lrmw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOUR_STEPS = [
	{
		title: "Welcome to Resume Builder Pro! 🚀",
		description: "Let's take a quick 1-minute interactive tour to show you around and help you build your perfect resume.",
		targetId: null
	},
	{
		title: "Start Your Resume",
		description: "Click 'Create New Resume' to open our guided wizard, or 'Import Resume' to upload and optimize an existing PDF or Word file.",
		targetId: "tour-hero-actions"
	},
	{
		title: "Live Resume Templates",
		description: "Browse dozens of professional, recruiter-approved, and ATS-friendly templates. Click here to check the layouts library.",
		targetId: "tour-sidebar-templates"
	},
	{
		title: "Real-time ATS Analytics",
		description: "See your resume count, total downloads, and your average Applicant Tracking System (ATS) score to keep track of your job search progress.",
		targetId: "tour-stats"
	},
	{
		title: "AI Career Copilot",
		description: "Match your resume against any Job Description! Our Copilot will instantly scan for keyword gaps and grade your compatibility.",
		targetId: "tour-copilot"
	},
	{
		title: "Complete Your Profile",
		description: "Fill out your profile once. The builder will automatically auto-populate details for new resumes and generate tailored suggestions.",
		targetId: "tour-profile",
		fallbackId: "tour-sidebar-profile"
	},
	{
		title: "You're All Set! 🎉",
		description: "Start building or importing your resume, and explore our AI-powered templates and features anytime. Good luck with your job hunt!",
		targetId: null
	}
];
function OnboardingTour({ forceStart, onTourStarted }) {
	const [active, setActive] = import_react.useState(false);
	const [stepIndex, setStepIndex] = import_react.useState(0);
	const [spotlightRect, setSpotlightRect] = import_react.useState(null);
	import_react.useEffect(() => {
		if (typeof window !== "undefined") {
			if (!localStorage.getItem("rbp_onboarding_completed")) {
				const timer = setTimeout(() => {
					setActive(true);
				}, 1e3);
				return () => clearTimeout(timer);
			}
		}
	}, []);
	import_react.useEffect(() => {
		if (forceStart) {
			setActive(true);
			setStepIndex(0);
			onTourStarted?.();
		}
	}, [forceStart, onTourStarted]);
	import_react.useEffect(() => {
		if (!active) {
			setSpotlightRect(null);
			return;
		}
		const currentStep = TOUR_STEPS[stepIndex];
		if (!currentStep.targetId) {
			setSpotlightRect(null);
			return;
		}
		let element = document.getElementById(currentStep.targetId);
		if (!element && currentStep.fallbackId) element = document.getElementById(currentStep.fallbackId);
		if (!element) {
			const isMovingForward = stepIndex > 0;
			if (isMovingForward && stepIndex < TOUR_STEPS.length - 1) setStepIndex(stepIndex + 1);
			else if (!isMovingForward && stepIndex > 0) setStepIndex(stepIndex - 1);
			else setActive(false);
			return;
		}
		element.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
		const updatePosition = () => {
			if (!element) return;
			const rect = element.getBoundingClientRect();
			setSpotlightRect({
				top: rect.top + window.scrollY,
				left: rect.left + window.scrollX,
				width: rect.width,
				height: rect.height
			});
		};
		const timer = setTimeout(updatePosition, 300);
		window.addEventListener("resize", updatePosition);
		window.addEventListener("scroll", updatePosition);
		return () => {
			clearTimeout(timer);
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", updatePosition);
		};
	}, [active, stepIndex]);
	if (!active) return null;
	const currentStep = TOUR_STEPS[stepIndex];
	const isFirst = stepIndex === 0;
	const isLast = stepIndex === TOUR_STEPS.length - 1;
	const handleNext = () => {
		if (isLast) handleComplete();
		else setStepIndex(stepIndex + 1);
	};
	const handleBack = () => {
		if (!isFirst) setStepIndex(stepIndex - 1);
	};
	const handleSkip = () => {
		localStorage.setItem("rbp_onboarding_completed", "true");
		setActive(false);
	};
	const handleComplete = () => {
		localStorage.setItem("rbp_onboarding_completed", "true");
		setActive(false);
	};
	let cardStyle = {
		position: "fixed",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		zIndex: 50
	};
	let arrowClass = "";
	if (spotlightRect) {
		const viewportWidth = window.innerWidth;
		const cardWidth = 320;
		const cardHeight = 220;
		const fitsBelow = spotlightRect.top + spotlightRect.height + cardHeight + 20 < window.innerHeight + window.scrollY;
		let leftPos = spotlightRect.left + (spotlightRect.width - cardWidth) / 2;
		leftPos = Math.max(16, Math.min(viewportWidth - cardWidth - 16, leftPos));
		if (spotlightRect.left < 100) {
			cardStyle = {
				position: "absolute",
				top: spotlightRect.top + (spotlightRect.height - 180) / 2,
				left: spotlightRect.left + spotlightRect.width + 16,
				width: cardWidth,
				zIndex: 50
			};
			arrowClass = "tour-arrow-left";
		} else if (fitsBelow) {
			cardStyle = {
				position: "absolute",
				top: spotlightRect.top + spotlightRect.height + 16,
				left: leftPos,
				width: cardWidth,
				zIndex: 50
			};
			arrowClass = "tour-arrow-top";
		} else {
			cardStyle = {
				position: "absolute",
				top: spotlightRect.top - cardHeight - 16,
				left: leftPos,
				width: cardWidth,
				zIndex: 50
			};
			arrowClass = "tour-arrow-bottom";
		}
	}
	const visualSteps = TOUR_STEPS.filter((s) => s.targetId !== null);
	const visualCurrentIndex = stepIndex - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 z-30 bg-transparent pointer-events-auto" }),
		spotlightRect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed rounded-xl pointer-events-none transition-all duration-300 z-40 border-2 border-brand/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]",
			style: {
				top: spotlightRect.top - window.scrollY - 4,
				left: spotlightRect.left - window.scrollX - 4,
				width: spotlightRect.width + 8,
				height: spotlightRect.height + 8
			}
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-xs z-40 pointer-events-none" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card text-card-foreground rounded-2xl border border-border p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200",
			style: cardStyle,
			children: [
				arrowClass && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: arrowClass }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [!spotlightRect && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-extrabold text-sm text-foreground tracking-tight",
							children: currentStep.title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSkip,
						className: "text-muted-foreground hover:text-foreground rounded-lg p-0.5 transition-colors",
						title: "Skip Tour",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2.5 text-xs leading-relaxed text-muted-foreground",
					children: currentStep.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex items-center justify-between border-t border-border/60 pt-3",
					children: [
						spotlightRect && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-medium text-muted-foreground",
								children: [
									"Step ",
									visualCurrentIndex + 1,
									" of ",
									visualSteps.length
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1",
								children: visualSteps.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full transition-colors ${idx === visualCurrentIndex ? "bg-brand w-3" : "bg-muted-foreground/35"}` }, idx))
							})]
						}),
						!spotlightRect && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 ml-auto",
							children: [
								spotlightRect && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: handleBack,
									disabled: isFirst,
									className: "h-8 rounded-lg text-xs font-semibold text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-0.5 h-3.5 w-3.5" }), " Back"]
								}),
								!isFirst && !isLast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: handleSkip,
									className: "h-8 rounded-lg text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive-soft",
									children: "Skip"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: handleNext,
									className: "h-8 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-bold px-3.5",
									children: isFirst ? "Start Tour" : isLast ? "Finish" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-0.5 h-3.5 w-3.5" })] })
								})
							]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .tour-arrow-top {
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background-color: hsl(var(--card));
          border-left: 1px solid hsl(var(--border));
          border-top: 1px solid hsl(var(--border));
          z-index: -1;
        }
        .tour-arrow-bottom {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background-color: hsl(var(--card));
          border-right: 1px solid hsl(var(--border));
          border-bottom: 1px solid hsl(var(--border));
          z-index: -1;
        }
        .tour-arrow-left {
          position: absolute;
          left: -6px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background-color: hsl(var(--card));
          border-left: 1px solid hsl(var(--border));
          border-bottom: 1px solid hsl(var(--border));
          z-index: -1;
        }
      ` })
	] });
}
function DashboardPage() {
	const { create, tour } = Route.useSearch();
	const [forceStartTour, setForceStartTour] = import_react.useState(false);
	const [wizardOpen, setWizardOpen] = import_react.useState(false);
	const [wizardConfig, setWizardConfig] = import_react.useState({});
	const resumes = useResumes();
	const navigate = useNavigate();
	const recent = resumes[0];
	const [profile] = useProfile();
	const completeness = profileCompleteness(profile);
	const openWizard = import_react.useCallback((config = {}) => {
		setWizardConfig(config);
		setWizardOpen(true);
	}, []);
	import_react.useEffect(() => {
		if (create) {
			openWizard({
				defaultStep: 3,
				defaultSource: "profile"
			});
			navigate({
				to: "/",
				search: {},
				replace: true
			});
		}
	}, [
		create,
		navigate,
		openWizard
	]);
	import_react.useEffect(() => {
		if (tour) {
			setForceStartTour(true);
			navigate({
				to: "/",
				search: {},
				replace: true
			});
		}
	}, [tour, navigate]);
	const stats = [
		{
			icon: FileText,
			label: "Total Resumes",
			value: resumes.length,
			sub: "Resumes created"
		},
		{
			icon: Download,
			label: "Total Downloads",
			value: resumes.reduce((s, r) => s + r.downloads, 0),
			sub: "PDF downloads"
		},
		{
			icon: TrendingUp,
			label: "Average ATS Score",
			value: `${Math.round(resumes.reduce((s, r) => s + r.atsScore, 0) / Math.max(1, resumes.length))}%`,
			sub: "Across all resumes"
		},
		{
			icon: LayoutTemplate,
			label: "Templates Used",
			value: new Set(resumes.map((r) => r.template)).size,
			sub: "Different templates"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full px-4 py-6 md:px-8 md:py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "hero-gradient relative overflow-hidden rounded-3xl border border-border p-6 md:p-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-semibold text-brand",
								children: [
									"Welcome back",
									profile.fullName ? `, ${profile.fullName.split(" ")[0]}` : "",
									"! 👋"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-2 text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl",
								children: [
									"Build Professional,",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "hidden sm:block" }),
									" ATS-Friendly Resumes"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-lg text-sm text-muted-foreground md:text-base",
								children: "Create, customize and export resumes that get you hired — guided, step by step."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								id: "tour-hero-actions",
								className: "mt-6 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => openWizard(),
									className: "h-12 rounded-xl bg-brand px-5 text-brand-foreground hover:bg-brand/90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Create New Resume"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									asChild: true,
									className: "h-12 rounded-xl border-brand/30 bg-card px-5 text-foreground hover:bg-brand-soft/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/import",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-1.5 h-4 w-4" }), " Import Resume"]
									})
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroResumeArt, {})]
				}),
				completeness < 80 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "tour-profile",
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/profile",
						className: "group flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-brand/40 md:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-base font-bold",
								children: [
									"Your profile is ",
									completeness,
									"% complete"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "A complete profile means stronger resumes and better AI suggestions."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-semibold text-brand",
							children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-0.5 inline h-4 w-4" })]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "tour-stats",
					className: "mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-4",
					children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-soft md:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-xs font-medium text-muted-foreground",
									children: s.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-extrabold leading-tight text-foreground",
									children: s.value
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-xs text-muted-foreground",
							children: s.sub
						})]
					}, s.label))
				}),
				recent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold",
							children: "Continue Editing"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/resumes",
							className: "text-sm font-semibold text-brand hover:underline",
							children: "View All"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border-l-4 border-brand bg-card p-4 shadow-soft md:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-16 shrink-0 md:w-20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeThumb, { resume: recent })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "truncate text-base font-bold",
										children: recent.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand",
										children: TEMPLATES.find((t) => t.id === recent.template)?.name ?? recent.template
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: ["Last edited ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelativeTime, { ts: recent.updatedAt })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => navigate({
										to: "/editor/$id",
										params: { id: recent.id }
									}),
									className: "h-10 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "mr-1.5 h-4 w-4" }),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline",
											children: "Continue Editing"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sm:hidden",
											children: "Continue"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									className: "h-10 w-10 rounded-xl",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "tour-copilot",
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-[oklch(0.96_0.04_150)] p-4 md:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-full bg-[oklch(0.85_0.08_150)] text-[oklch(0.35_0.1_150)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "truncate text-base font-bold",
										children: "AI Career Copilot"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-[oklch(0.85_0.15_300)] px-2 py-0.5 text-[10px] font-bold uppercase text-[oklch(0.3_0.15_300)]",
										children: "New"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs text-muted-foreground md:text-sm",
									children: "Get AI-powered suggestions to improve your resume and increase interview calls."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "h-10 shrink-0 rounded-xl border-[oklch(0.65_0.1_150)] text-[oklch(0.35_0.1_150)] hover:bg-[oklch(0.92_0.05_150)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/jd-match",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Match a JD"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-1 h-4 w-4" })]
								})
							})
						]
					})
				}),
				completeness >= 40 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleRecommendations, {
						profile,
						limit: 4
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold",
							children: "My Resumes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/resumes",
							className: "text-sm font-semibold text-brand hover:underline",
							children: "View All"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
						children: [resumes.slice(0, 4).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeCard, {
							resume: r,
							onOpen: () => navigate({
								to: "/editor/$id",
								params: { id: r.id }
							})
						}, r.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => openWizard(),
							className: "group flex aspect-[3/4.4] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand/40 bg-brand-soft/30 p-4 text-center transition-all hover:border-brand hover:bg-brand-soft/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-12 w-12 place-items-center rounded-full bg-brand text-brand-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold text-brand",
								children: "Create New Resume"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Start from scratch or choose a template"
							})] })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-8 rounded-2xl border border-border bg-card p-4 md:p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold",
								children: "AI suggestions live inside the editor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Open any resume and tap the ✨ AI Assistant button — optional, transparent, and yours to accept."
							})] })]
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => openWizard(),
			className: "fixed bottom-20 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-brand/30 transition-transform hover:scale-105 md:hidden",
			"aria-label": "Create resume",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-6 w-6" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateResumeWizard, {
			open: wizardOpen,
			onOpenChange: setWizardOpen,
			defaultSource: wizardConfig.defaultSource,
			defaultStep: wizardConfig.defaultStep
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingTour, {
			forceStart: forceStartTour,
			onTourStarted: () => setForceStartTour(false)
		})
	] });
}
function ResumeCard({ resume, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group flex flex-col rounded-2xl border border-border bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
		onClick: onOpen,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeThumb, { resume })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "truncate text-sm font-bold",
						children: resume.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 inline-block rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand",
						children: TEMPLATES.find((t) => t.id === resume.template)?.name ?? resume.template
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: ["Updated ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelativeTime, { ts: resume.updatedAt })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-1.5",
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
						className: "h-8 flex-1 rounded-lg bg-foreground text-background text-xs hover:bg-foreground/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-3 w-3" }), " PDF"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "outline",
						className: "h-8 w-8 rounded-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-3.5 w-3.5" })
					})
				]
			})
		]
	});
}
function HeroResumeArt() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute -right-6 -top-2 hidden h-[110%] w-[42%] md:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute right-12 top-6 h-[88%] w-56 rotate-3 rounded-2xl border border-border bg-card p-4 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-10 w-10 rounded-full bg-brand-soft" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-2 h-1.5 w-2/3 rounded bg-muted-foreground/25" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-1.5 h-1 w-1/3 rounded bg-muted-foreground/20" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-1.5",
							children: [
								90,
								70,
								80,
								65,
								85,
								55
							].map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1 rounded bg-muted-foreground/20",
								style: { width: `${w}%` }
							}, i))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute right-2 bottom-6 grid h-20 w-20 place-items-center rounded-full border-4 border-[oklch(0.62_0.13_150)] bg-card text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base font-extrabold text-[oklch(0.45_0.13_150)]",
						children: "95"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] font-semibold uppercase text-muted-foreground",
						children: "ATS"
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					className: "absolute right-4 top-2 h-6 w-6 text-brand",
					viewBox: "0 0 24 24",
					fill: "currentColor",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2l1.6 5 5 1.6-5 1.6L12 15l-1.6-4.8L5.4 8.6l5-1.6L12 2z" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					className: "absolute right-32 bottom-12 h-4 w-4 text-brand/60",
					viewBox: "0 0 24 24",
					fill: "currentColor",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2l1.6 5 5 1.6-5 1.6L12 15l-1.6-4.8L5.4 8.6l5-1.6L12 2z" })
				})
			]
		})
	});
}
//#endregion
export { DashboardPage as component };
