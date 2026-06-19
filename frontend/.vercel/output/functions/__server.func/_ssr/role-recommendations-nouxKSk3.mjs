import { o as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as cn } from "./button-CHSNwFnT.mjs";
import { _ as Star, v as Sparkles } from "../_libs/lucide-react.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/role-recommendations-nouxKSk3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
function tokenize(text) {
	return text.toLowerCase().replace(/[^a-z0-9+#./\s-]/g, " ").split(/\s+/).filter(Boolean);
}
function uniq(arr) {
	return Array.from(new Set(arr));
}
function generateSummary(profile) {
	const role = profile.title || "Software Engineer";
	const topSkills = profile.skills.flatMap((s) => s.items.split(",").map((x) => x.trim())).filter(Boolean).slice(0, 4).join(", ");
	const exp = profile.experience[0];
	const proj = profile.projects[0];
	return `${exp ? `${role} with experience as ${exp.role} at ${exp.company}.` : proj ? `${role} who has built ${proj.name} using ${proj.tools}.` : `${role} eager to build production-grade software.`} ${topSkills ? `Comfortable across ${topSkills}.` : `Strong fundamentals and a bias toward shipping.`} Focused on writing maintainable code and delivering measurable impact.`;
}
var ROLE_KEYWORDS = {
	"Full Stack Developer": [
		"react",
		"node",
		"typescript",
		"api",
		"postgres",
		"express"
	],
	"Frontend Developer": [
		"react",
		"css",
		"tailwind",
		"typescript",
		"next.js",
		"ui",
		"vite"
	],
	"Backend Developer": [
		"node",
		"python",
		"api",
		"postgres",
		"redis",
		"express",
		"fastapi"
	],
	"Software Engineer": [
		"javascript",
		"typescript",
		"git",
		"api",
		"tests"
	],
	"Data Engineer": [
		"python",
		"sql",
		"etl",
		"airflow",
		"spark",
		"postgres"
	],
	"DevOps Engineer": [
		"docker",
		"kubernetes",
		"aws",
		"ci/cd",
		"terraform"
	],
	"Mobile Developer": [
		"react native",
		"swift",
		"kotlin",
		"ios",
		"android"
	]
};
function recommendRoles(profile, jd) {
	const corpus = [
		profile.title,
		profile.summary,
		...profile.skills.map((s) => s.items),
		...profile.experience.flatMap((e) => [e.role, ...e.bullets]),
		...profile.projects.flatMap((p) => [p.tools, ...p.bullets])
	].join(" ").toLowerCase();
	const jdTokens = jd ? new Set(tokenize(jd)) : null;
	return Object.entries(ROLE_KEYWORDS).map(([role, keywords]) => {
		let hits = 0;
		let jdHits = 0;
		for (const k of keywords) {
			if (corpus.includes(k)) hits += 1;
			if (jdTokens && jdTokens.has(k)) jdHits += 1;
		}
		const base = hits / keywords.length * 80;
		const jdBoost = jdTokens ? jdHits / keywords.length * 20 : 0;
		const noise = role.length % 5;
		const score = Math.min(99, Math.round(base + jdBoost + noise + (corpus.length > 200 ? 8 : 0)));
		const matched = keywords.filter((k) => corpus.includes(k)).slice(0, 3);
		return {
			role,
			score,
			reason: matched.length ? `Matched on ${matched.join(", ")}.` : "Limited signal in your profile for this role."
		};
	}).sort((a, b) => b.score - a.score);
}
var STOPWORDS = new Set([
	"the",
	"and",
	"for",
	"with",
	"you",
	"your",
	"our",
	"are",
	"will",
	"have",
	"this",
	"that",
	"from",
	"they",
	"their",
	"into",
	"but",
	"not",
	"all",
	"any",
	"can",
	"who",
	"what",
	"when",
	"where",
	"why",
	"how",
	"were",
	"been",
	"being",
	"more",
	"most",
	"other",
	"some",
	"such",
	"than",
	"then",
	"there",
	"these",
	"those",
	"just",
	"like",
	"also",
	"over",
	"under",
	"each",
	"very",
	"much",
	"many",
	"work",
	"working",
	"role",
	"team",
	"teams",
	"strong",
	"skills",
	"experience",
	"year",
	"years"
]);
function reviewResume(resume, jd) {
	const items = [];
	const data = resume.data;
	let ats = 60;
	if (data.email) ats += 5;
	if (data.phone) ats += 5;
	if (data.summary.length > 80) ats += 5;
	if (data.experience.length > 0) ats += 8;
	if (data.education.length > 0) ats += 7;
	if (data.skills.length > 0) ats += 5;
	if (data.projects.length > 0) ats += 5;
	ats = Math.min(99, ats);
	const bullets = [...data.experience.flatMap((e) => e.bullets), ...data.projects.flatMap((p) => p.bullets)];
	const avgLen = bullets.length ? bullets.reduce((s, b) => s + b.length, 0) / bullets.length : 0;
	const readability = Math.max(40, Math.min(98, 100 - Math.round((avgLen - 90) / 4)));
	const totalChars = JSON.stringify(data).length;
	const estPages = Math.max(1, Math.round(totalChars / 1800));
	let coverage = 70;
	if (jd) {
		const jdTokens = uniq(tokenize(jd)).filter((t) => t.length > 3 && !STOPWORDS.has(t));
		const corpus = JSON.stringify(data).toLowerCase();
		const matched = jdTokens.filter((t) => corpus.includes(t)).length;
		coverage = jdTokens.length ? Math.round(matched / jdTokens.length * 100) : 70;
	}
	if (ats >= 90) items.push({
		kind: "good",
		message: "Strong ATS structure — all key sections present."
	});
	if (coverage >= 70) items.push({
		kind: "good",
		message: "Great keyword coverage for this role."
	});
	if (data.summary.length > 320) items.push({
		kind: "warn",
		message: "Your summary could be shorter — aim for 2–3 lines."
	});
	if (data.summary.length < 60) items.push({
		kind: "warn",
		message: "Your summary is very short — add 1–2 lines about your strengths."
	});
	if (avgLen > 160) items.push({
		kind: "warn",
		message: "Some bullets are long. Aim for a single line per bullet."
	});
	if (!bullets.some((b) => /\d/.test(b))) items.push({
		kind: "tip",
		message: "Consider adding measurable outcomes (%, $, time) where possible."
	});
	if (data.projects.length > 0 && data.projects[0].bullets.length < 2) items.push({
		kind: "tip",
		message: "Add a second bullet to your top project to show depth."
	});
	if (estPages > 2) items.push({
		kind: "warn",
		message: "Resume looks long (~2+ pages). Trim older or less relevant items."
	});
	if (jd && coverage < 60) items.push({
		kind: "tip",
		message: "Mirror more keywords from the job description in your experience and skills."
	});
	const sectionScores = {
		Experience: data.experience.reduce((s, e) => s + e.bullets.length * 10 + e.role.length, 0),
		Projects: data.projects.reduce((s, p) => s + p.bullets.length * 10 + p.tools.length, 0),
		Skills: data.skills.reduce((s, x) => s + x.items.split(",").length * 3, 0),
		Education: data.education.length * 20
	};
	const strongest = Object.entries(sectionScores).sort((a, b) => b[1] - a[1])[0][0];
	if (items.length < 3) items.push({
		kind: "good",
		message: `Your ${strongest} section is your strongest — keep it prominent.`
	});
	return {
		atsScore: ats,
		readability,
		estPages,
		keywordCoverage: coverage,
		items,
		strongest
	};
}
function interviewQuestions(resume, jd) {
	const q = [];
	const top = resume.data.projects[0];
	const topExp = resume.data.experience[0];
	if (top) {
		q.push({
			question: `Walk me through how you built ${top.name}.`,
			tip: `Cover the problem, your specific contribution, the stack (${top.tools}), and the impact.`
		});
		q.push({
			question: `What was the hardest technical decision in ${top.name}?`,
			tip: "Pick one trade-off, explain alternatives you considered, and why your choice won."
		});
	}
	if (topExp) q.push({
		question: `Tell me about your work at ${topExp.company}.`,
		tip: `Use STAR — Situation, Task, Action, Result. Lead with a measurable result.`
	});
	if (jd) q.push({
		question: "Why are you a good fit for this role specifically?",
		tip: "Map two of your strengths to two responsibilities from the job description."
	});
	else q.push({
		question: "Where do you see yourself in 2 years?",
		tip: "Tie your answer to the role you're applying for — growth in adjacent skills, ownership of larger systems."
	});
	q.push({
		question: "Tell me about a time you received critical feedback.",
		tip: "Show self-awareness, the concrete change you made, and the outcome that followed."
	});
	return q;
}
function RoleRecommendations({ profile, jd, limit = 4 }) {
	const matches = import_react.useMemo(() => recommendRoles(profile, jd).slice(0, limit), [
		profile,
		jd,
		limit
	]);
	if (matches.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "rounded-2xl border-border p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-between gap-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4.5 w-4.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold",
					children: "Best-matched roles"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Estimated from your profile",
						jd ? " and the job description" : "",
						"."
					]
				})] })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-3",
			children: matches.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl border border-border bg-card p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-2",
							children: [i === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-brand text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm font-semibold",
								children: m.role
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-bold text-brand",
							children: [m.score, "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: m.score,
						className: "mt-2 h-1.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-xs text-muted-foreground",
						children: m.reason
					})
				]
			}, m.role))
		})]
	});
}
//#endregion
export { interviewQuestions as a, generateSummary as i, Progress as n, reviewResume as o, RoleRecommendations as r, Card as t };
