import { o as __toESM, r as __exportAll$1 } from "../_runtime.mjs";
import { t as supabase } from "./client-DWNMNgqv.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Input, r as cn, t as Button } from "./button-CHSNwFnT.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as House, L as LayoutTemplate, M as LogOut, N as LogIn, R as LayoutDashboard, c as Upload, et as CircleQuestionMark, i as X, k as Menu, ot as ChartColumn, q as FileText, s as User, ut as Bell, y as Search } from "../_libs/lucide-react.mjs";
import { createRequire } from "node:module";
//#region node_modules/.nitro/vite/services/ssr/assets/docx-export-GIydTfWc.js
var docx_export_GIydTfWc_exports = /* @__PURE__ */ __exportAll$1({
	downloadResumeDocx: () => downloadResumeDocx,
	t: () => __exportAll
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __require = /* @__PURE__ */ createRequire(import.meta.url);
var BRAND = "2E5A8E";
function heading(text) {
	const { Paragraph, TextRun, BorderStyle } = __require("docx");
	return new Paragraph({
		children: [new TextRun({
			text: text.toUpperCase(),
			bold: true,
			size: 18,
			color: BRAND
		})],
		border: { bottom: {
			style: BorderStyle.SINGLE,
			size: 6,
			color: BRAND
		} },
		spacing: {
			before: 200,
			after: 80
		}
	});
}
function bullet(text) {
	const { Paragraph, TextRun } = __require("docx");
	return new Paragraph({
		children: [new TextRun({
			text,
			size: 20
		})],
		bullet: { level: 0 },
		spacing: { after: 40 }
	});
}
function row(left, right) {
	const { Paragraph, TextRun, TabStopPosition, TabStopType, AlignmentType } = __require("docx");
	return new Paragraph({
		children: [new TextRun({
			text: left,
			bold: true,
			size: 22
		}), new TextRun({
			text: "	" + right,
			size: 20,
			color: "666666"
		})],
		tabStops: [{
			type: TabStopType.RIGHT,
			position: TabStopPosition.MAX
		}],
		spacing: { after: 40 }
	});
}
async function downloadResumeDocx(resume) {
	const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import("../_libs/docx.mjs").then((n) => n.t);
	const { saveAs } = await import("../_libs/file-saver.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const d = resume.data;
	const children = [];
	children.push(new Paragraph({
		children: [new TextRun({
			text: d.fullName,
			bold: true,
			size: 36,
			color: "1a1a1a"
		})],
		alignment: AlignmentType.CENTER,
		spacing: { after: 60 }
	}), new Paragraph({
		children: [new TextRun({
			text: [
				d.email,
				d.phone,
				d.location
			].filter(Boolean).join("  •  "),
			size: 18,
			color: "555555"
		})],
		alignment: AlignmentType.CENTER,
		spacing: { after: 120 }
	}));
	if (d.summary) children.push(heading("Summary"), new Paragraph({
		children: [new TextRun({
			text: d.summary,
			size: 20
		})],
		spacing: { after: 80 }
	}));
	if (d.experience.length > 0) {
		children.push(heading("Experience"));
		for (const ex of d.experience) {
			children.push(row(`${ex.role} — ${ex.company}`, ex.period));
			for (const b of ex.bullets.filter(Boolean)) children.push(bullet(b));
			children.push(new Paragraph({ spacing: { after: 80 } }));
		}
	}
	if (d.education.length > 0) {
		children.push(heading("Education"));
		for (const ed of d.education) children.push(row(`${ed.degree} — ${ed.school}`, ed.year + (ed.cgpa ? `  •  CGPA ${ed.cgpa}` : "")));
		children.push(new Paragraph({ spacing: { after: 80 } }));
	}
	if (d.projects.length > 0) {
		children.push(heading("Projects"));
		for (const p of d.projects) {
			children.push(new Paragraph({
				children: [new TextRun({
					text: p.name,
					bold: true,
					size: 22
				}), new TextRun({
					text: p.tools ? `  —  ${p.tools}` : "",
					size: 20,
					color: "666666"
				})],
				spacing: { after: 40 }
			}));
			for (const b of p.bullets.filter(Boolean)) children.push(bullet(b));
			children.push(new Paragraph({ spacing: { after: 60 } }));
		}
	}
	if (d.skills.length > 0) {
		children.push(heading("Skills"));
		for (const s of d.skills) children.push(new Paragraph({
			children: [new TextRun({
				text: `${s.category}: `,
				bold: true,
				size: 20
			}), new TextRun({
				text: s.items,
				size: 20
			})],
			spacing: { after: 60 }
		}));
	}
	const doc = new Document({
		sections: [{
			properties: { page: { margin: {
				top: 720,
				right: 720,
				bottom: 720,
				left: 720
			} } },
			children
		}],
		styles: { default: { document: { run: {
			font: "Calibri",
			size: 20
		} } } }
	});
	const blob = await Packer.toBlob(doc);
	const filename = `${resume.title.replace(/[^a-z0-9]/gi, "_")}.docx`;
	saveAs(blob, filename);
	return filename;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-q8BzYArD.js
var app_shell_q8BzYArD_exports = /* @__PURE__ */ __exportAll$1({
	a: () => deleteResume,
	c: () => resume_store_exports,
	i: () => dataFromProfile,
	l: () => saveResume,
	n: () => TEMPLATES,
	o: () => formatRelative,
	r: () => createResume,
	s: () => getResume,
	t: () => AppShell,
	u: () => useResumes
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var resume_store_exports = /* @__PURE__ */ __exportAll({
	TEMPLATES: () => TEMPLATES,
	createResume: () => createResume,
	dataFromProfile: () => dataFromProfile,
	deleteResume: () => deleteResume,
	emptyData: () => emptyData,
	formatRelative: () => formatRelative,
	generateUUID: () => generateUUID,
	getResume: () => getResume,
	isUUID: () => isUUID,
	saveResume: () => saveResume,
	syncLocalResumesToSupabase: () => syncLocalResumesToSupabase,
	useResumes: () => useResumes
});
var STORAGE_KEY = "rbp.resumes.v1";
var seed = [
	{
		id: "r1",
		title: "Full Stack Developer Resume",
		profileType: "experienced",
		template: "ats-professional",
		updatedAt: Date.now() - 1e3 * 60 * 2,
		downloads: 4,
		atsScore: 95,
		data: emptyData("Sejal Bhagat")
	},
	{
		id: "r2",
		title: "Fresh Graduate Resume",
		profileType: "fresh",
		template: "ats-professional",
		updatedAt: Date.now() - 1e3 * 60 * 60 * 5,
		downloads: 3,
		atsScore: 88,
		data: emptyData("Sejal Bhagat")
	},
	{
		id: "r3",
		title: "Test Version",
		profileType: "custom",
		template: "modern",
		updatedAt: Date.now() - 1e3 * 60 * 60 * 24,
		downloads: 2,
		atsScore: 76,
		data: emptyData("Sejal Bhagat")
	},
	{
		id: "r4",
		title: "Default Resume",
		profileType: "custom",
		template: "minimal",
		updatedAt: Date.now() - 1e3 * 60 * 60 * 24 * 3,
		downloads: 7,
		atsScore: 82,
		data: emptyData("Sejal Bhagat")
	}
];
function emptyData(name = "Your Name") {
	return {
		fullName: name,
		email: "you@example.com",
		phone: "+1 555 000 0000",
		location: "City, Country",
		summary: "A short professional summary that highlights your strengths.",
		website: "",
		linkedin: "",
		github: "",
		education: [{
			degree: "B.Tech, Computer Science",
			school: "Your University",
			year: "2022 – 2026",
			cgpa: "8.5"
		}],
		experience: [{
			role: "Software Engineer Intern",
			company: "Tech Co.",
			period: "Jun 2025 – Aug 2025",
			bullets: ["Shipped a feature used by 10k+ users.", "Improved API latency by 30%."]
		}],
		projects: [{
			name: "Portfolio Website",
			tools: "React, Tailwind",
			bullets: ["Built and deployed a personal portfolio.", "Implemented dark mode."]
		}],
		skills: [{
			category: "Languages",
			items: "TypeScript, Python, Go"
		}, {
			category: "Frameworks",
			items: "React, Node.js, FastAPI"
		}],
		certifications: [],
		achievements: [],
		languages: [],
		publications: [],
		volunteer: [],
		customization: {
			accentColor: "",
			fontSize: "md",
			spacing: "md"
		}
	};
}
function isUUID(str) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}
function generateUUID() {
	if (typeof window !== "undefined" && window.crypto?.randomUUID) return window.crypto.randomUUID();
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0;
		return (c === "x" ? r : r & 3 | 8).toString(16);
	});
}
function read() {
	if (typeof window === "undefined") return seed;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
			return seed;
		}
		return JSON.parse(raw);
	} catch {
		return seed;
	}
}
function write(list) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
	window.dispatchEvent(new Event("rbp:resumes-changed"));
}
function useResumes() {
	const [list, setList] = import_react.useState(seed);
	import_react.useEffect(() => {
		let active = true;
		async function sync() {
			try {
				const { data: { session } } = await supabase.auth.getSession();
				if (session?.user && active) {
					const { data, error } = await supabase.from("resumes").select("*").order("updated_at", { ascending: false });
					if (!error && data && active) {
						setList(data.map((r) => ({
							id: r.id,
							title: r.title,
							profileType: r.profile_type,
							template: r.template,
							updatedAt: new Date(r.updated_at).getTime(),
							downloads: r.downloads,
							atsScore: r.ats_score,
							data: r.data
						})));
						return;
					}
				}
			} catch (err) {
				console.warn("Error loading from Supabase, fallback to local:", err);
			}
			if (active) setList(read());
		}
		sync();
		const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
			sync();
		});
		window.addEventListener("rbp:resumes-changed", sync);
		window.addEventListener("storage", sync);
		return () => {
			active = false;
			subscription.unsubscribe();
			window.removeEventListener("rbp:resumes-changed", sync);
			window.removeEventListener("storage", sync);
		};
	}, []);
	return list;
}
function getResume(id) {
	return read().find((r) => r.id === id);
}
async function saveResume(r) {
	let activeId = r.id;
	if (!isUUID(activeId)) {
		activeId = generateUUID();
		r = {
			...r,
			id: activeId
		};
	}
	const list = read();
	const i = list.findIndex((x) => x.id === r.id);
	const next = {
		...r,
		updatedAt: Date.now()
	};
	if (i >= 0) list[i] = next;
	else list.unshift(next);
	write(list);
	try {
		const { data: { session } } = await supabase.auth.getSession();
		if (session?.user) {
			const dbResume = {
				id: activeId,
				user_id: session.user.id,
				title: r.title,
				profile_type: r.profileType,
				template: r.template,
				data: r.data,
				ats_score: r.atsScore,
				downloads: r.downloads
			};
			await supabase.from("resumes").upsert(dbResume);
		}
	} catch (err) {
		console.warn("Supabase save error:", err);
	}
}
async function deleteResume(id) {
	write(read().filter((r) => r.id !== id));
	try {
		const { data: { session } } = await supabase.auth.getSession();
		if (session?.user && isUUID(id)) await supabase.from("resumes").delete().eq("id", id);
	} catch (err) {
		console.warn("Supabase delete error:", err);
	}
}
function createResume(input) {
	const uuid = generateUUID();
	const r = {
		id: uuid,
		title: input.title || "Untitled Resume",
		profileType: input.profileType,
		template: input.template,
		updatedAt: Date.now(),
		downloads: 0,
		atsScore: 60,
		data: emptyData()
	};
	const list = read();
	list.unshift(r);
	write(list);
	supabase.auth.getSession().then(({ data: { session } }) => {
		if (session?.user) {
			const dbResume = {
				id: uuid,
				user_id: session.user.id,
				title: r.title,
				profile_type: r.profileType,
				template: r.template,
				data: r.data,
				ats_score: r.atsScore,
				downloads: r.downloads
			};
			supabase.from("resumes").insert(dbResume).then(({ error }) => {
				if (error) console.warn("Supabase create error:", error.message);
			});
		}
	});
	return r;
}
async function syncLocalResumesToSupabase() {
	try {
		const { data: { session } } = await supabase.auth.getSession();
		if (!session?.user) return;
		const nonSynced = read().filter((r) => !isUUID(r.id));
		if (nonSynced.length === 0) return;
		for (let r of nonSynced) {
			const oldId = r.id;
			const newId = generateUUID();
			r = {
				...r,
				id: newId
			};
			const dbResume = {
				id: newId,
				user_id: session.user.id,
				title: r.title,
				profile_type: r.profileType,
				template: r.template,
				data: r.data,
				ats_score: r.atsScore,
				downloads: r.downloads
			};
			const { error } = await supabase.from("resumes").insert(dbResume);
			if (!error) {
				const currentList = read();
				const idx = currentList.findIndex((x) => x.id === oldId);
				if (idx >= 0) {
					currentList[idx] = r;
					write(currentList);
				}
			}
		}
	} catch (err) {
		console.warn("Sync migration error:", err);
	}
}
function formatRelative(ts) {
	const diff = Date.now() - ts;
	const m = Math.floor(diff / 6e4);
	if (m < 1) return "just now";
	if (m < 60) return `${m} min${m === 1 ? "" : "s"} ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
	const d = Math.floor(h / 24);
	if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
	return new Date(ts).toLocaleDateString();
}
var TEMPLATES = [
	{
		id: "ats-professional",
		name: "ATS Professional",
		tagline: "Recruiter-friendly, single column",
		tags: ["ATS Friendly", "Best for Freshers"]
	},
	{
		id: "modern",
		name: "Modern",
		tagline: "Bold headings with accent",
		tags: ["Popular", "Experienced"]
	},
	{
		id: "minimal",
		name: "Minimal",
		tagline: "Clean, lots of whitespace",
		tags: ["ATS Friendly", "Clean"]
	},
	{
		id: "creative",
		name: "Creative",
		tagline: "Designer-leaning layout",
		tags: ["Creative", "Design Roles"]
	},
	{
		id: "two-column",
		name: "Two Column",
		tagline: "Sidebar with skills",
		tags: ["Skills Focus", "Tech Roles"]
	}
];
function dataFromProfile(profile, opts) {
	const pickExp = opts.pickedExperienceIdx ?? profile.experience.map((_, i) => i);
	const pickProj = opts.pickedProjectIdx ?? profile.projects.map((_, i) => i);
	return {
		fullName: profile.fullName || "Your Name",
		email: profile.email,
		phone: profile.phone,
		location: profile.location,
		website: profile.portfolio || "",
		linkedin: profile.linkedin || "",
		github: profile.github || "",
		summary: opts.include.summary ? profile.summary : "",
		education: opts.include.education ? profile.education : [],
		experience: opts.include.experience ? pickExp.map((i) => profile.experience[i]).filter(Boolean) : [],
		projects: opts.include.projects ? pickProj.map((i) => profile.projects[i]).filter(Boolean) : [],
		skills: opts.include.skills ? profile.skills : [],
		certifications: profile.certifications ? profile.certifications.map((c) => {
			const parts = [];
			if (c.name) parts.push(c.name);
			if (c.issuer) parts.push(c.issuer);
			if (c.year) parts.push(c.year);
			return parts.join(", ");
		}).filter(Boolean) : [],
		languages: profile.languages ? profile.languages.map((l) => l.level ? `${l.name} (${l.level})` : l.name).filter(Boolean) : [],
		achievements: profile.achievements ? profile.achievements.map((a) => {
			const parts = [];
			if (a.title) parts.push(a.title);
			if (a.detail) parts.push(a.detail);
			return parts.join(": ");
		}).filter(Boolean) : []
	};
}
var main = [
	{
		title: "Dashboard",
		url: "/",
		icon: LayoutDashboard
	},
	{
		title: "Profile",
		url: "/profile",
		icon: User,
		id: "tour-sidebar-profile"
	},
	{
		title: "My Resumes",
		url: "/resumes",
		icon: FileText
	},
	{
		title: "Templates",
		url: "/templates",
		icon: LayoutTemplate,
		id: "tour-sidebar-templates"
	},
	{
		title: "ATS",
		url: "/ats",
		icon: ChartColumn
	},
	{
		title: "Import",
		url: "/import",
		icon: Upload
	}
];
function AppSidebar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isActive = (url) => url === "/" ? pathname === "/" : pathname.startsWith(url);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden md:flex flex-col items-center border-r border-sidebar-border bg-sidebar sticky top-0 h-screen",
		style: {
			width: 72,
			minWidth: 72,
			flexShrink: 0
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex flex-col items-center justify-center gap-0.5 py-5 w-full",
				title: "Resume Builder Pro",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 text-[9px] font-extrabold leading-none text-brand tracking-widest uppercase",
					children: "RBP"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-2 h-px w-10 rounded bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-1 flex-col items-center gap-0.5 px-1.5 py-1",
				children: main.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavRailItem, {
					item,
					active: isActive(item.url)
				}, item.url))
			})
		]
	});
}
function NavRailItem({ item, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: item.url,
		title: item.title,
		id: item.id,
		className: cn("flex flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 transition-all w-14", active ? "bg-brand-soft text-brand" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-[18px] w-[18px] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("text-[9px] font-semibold leading-none text-center break-all", active ? "text-brand" : "text-muted-foreground"),
			children: item.title
		})]
	});
}
var items = [
	{
		title: "Home",
		url: "/",
		icon: House
	},
	{
		title: "Templates",
		url: "/templates",
		icon: LayoutTemplate
	},
	{
		title: "My Resumes",
		url: "/resumes",
		icon: FileText
	},
	{
		title: "Profile",
		url: "/profile",
		icon: User
	}
];
function MobileBottomNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden",
		style: { paddingBottom: "env(safe-area-inset-bottom)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid grid-cols-4",
			children: items.map((item) => {
				const active = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.url,
					className: cn("flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors", active ? "text-brand" : "text-muted-foreground"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-5 w-5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-0.5 w-6 rounded-full", active ? "bg-brand" : "bg-transparent") })
					]
				}) }, item.url);
			})
		})
	});
}
var mobileNavItems = [
	{
		title: "Dashboard",
		url: "/",
		icon: LayoutDashboard
	},
	{
		title: "My Resumes",
		url: "/resumes",
		icon: FileText
	},
	{
		title: "Templates",
		url: "/templates",
		icon: LayoutTemplate
	},
	{
		title: "ATS Analysis",
		url: "/ats",
		icon: ChartColumn
	},
	{
		title: "Import Resume",
		url: "/import",
		icon: Upload
	}
];
function MobileDrawerNav({ open, onClose }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isActive = (url) => url === "/" ? pathname === "/" : pathname.startsWith(url);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden",
		onClick: onClose
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card shadow-2xl md:hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-extrabold tracking-tight text-foreground",
						children: "Resume Builder Pro"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-3 h-px bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 space-y-0.5 overflow-y-auto p-3",
				children: mobileNavItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.url,
					onClick: onClose,
					className: cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", isActive(item.url) ? "bg-brand-soft text-brand" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-[18px] w-[18px] shrink-0" }), item.title]
				}, item.url))
			})
		]
	})] });
}
function AppShell({ children }) {
	const [mobileOpen, setMobileOpen] = import_react.useState(false);
	const navigate = useNavigate();
	const [session, setSession] = import_react.useState(null);
	const [bypass, setBypass] = import_react.useState(false);
	import_react.useEffect(() => {
		if (typeof window !== "undefined") setBypass(localStorage.getItem("rbp.auth.bypass") === "true");
		supabase.auth.getSession().then(({ data }) => {
			if (data?.session) {
				setSession(data.session);
				syncLocalResumesToSupabase();
			}
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
			setSession(newSession);
			if (typeof window !== "undefined") setBypass(localStorage.getItem("rbp.auth.bypass") === "true");
			if (newSession) syncLocalResumesToSupabase();
		});
		return () => subscription?.unsubscribe();
	}, []);
	const isLoggedIn = !!session || bypass;
	async function handleLogout() {
		try {
			localStorage.removeItem("rbp.auth.bypass");
			await supabase.auth.signOut();
			toast.success("Signed out successfully.");
		} catch (err) {
			console.warn("Sign out error:", err);
		}
		navigate({ to: "/auth" });
	}
	function handleLogin() {
		navigate({ to: "/auth" });
	}
	const getInitials = () => {
		if (bypass) return "SB";
		if (session?.user?.email) return session.user.email.substring(0, 2).toUpperCase();
		return "U";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileDrawerNav, {
				open: mobileOpen,
				onClose: () => setMobileOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-10 w-10 rounded-full md:hidden",
								onClick: () => setMobileOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative ml-auto hidden w-full max-w-sm md:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search resumes...",
									className: "h-10 rounded-xl border-border bg-card pl-9"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								onClick: () => navigate({
									to: "/",
									search: { tour: true }
								}),
								className: "h-10 gap-1.5 rounded-xl border border-border/50 bg-card/50 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted ml-auto md:ml-0",
								title: "Start Interactive Tour",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-4 w-4 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Quick Tour"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "icon",
								className: "relative h-10 w-10 rounded-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2 top-2 h-2 w-2 rounded-full bg-brand" })]
							}),
							isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: handleLogout,
								className: "h-10 gap-2 rounded-xl border-border bg-card px-4 text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-all duration-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Log Out"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "flex items-center gap-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand",
									children: getInitials()
								})
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "default",
								size: "sm",
								onClick: handleLogin,
								className: "h-10 gap-2 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 px-4 text-sm font-medium transition-all duration-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Log In"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 pb-24 md:pb-8",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileBottomNav, {})
				]
			})
		]
	});
}
//#endregion
export { dataFromProfile as a, getResume as c, __exportAll as d, docx_export_GIydTfWc_exports as f, createResume as i, saveResume as l, TEMPLATES as n, deleteResume as o, app_shell_q8BzYArD_exports as r, formatRelative as s, AppShell as t, useResumes as u };
