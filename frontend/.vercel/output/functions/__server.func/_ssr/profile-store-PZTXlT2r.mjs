import { o as __toESM } from "../_runtime.mjs";
import { h as require_react } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-store-PZTXlT2r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var KEY = "rbp.profile.v1";
function emptyProfile() {
	return {
		fullName: "",
		title: "",
		email: "",
		phone: "",
		location: "",
		summary: "",
		github: "",
		linkedin: "",
		portfolio: "",
		education: [],
		experience: [],
		projects: [],
		skills: [],
		certifications: [],
		languages: [],
		achievements: []
	};
}
function seedProfile() {
	return {
		fullName: "Sejal Bhagat",
		title: "Full Stack Developer",
		email: "sejal@example.com",
		phone: "+91 90000 00000",
		location: "Bengaluru, India",
		summary: "Full Stack Developer with hands-on experience building production React + Node.js applications. Strong focus on shipping measurable outcomes and writing maintainable TypeScript.",
		github: "github.com/sejal",
		linkedin: "linkedin.com/in/sejal",
		portfolio: "sejal.dev",
		education: [{
			degree: "B.Tech, Computer Science",
			school: "VIT University",
			year: "2022 – 2026",
			cgpa: "8.7"
		}],
		experience: [{
			role: "Software Engineer Intern",
			company: "Acme Cloud",
			period: "Jun 2025 – Aug 2025",
			bullets: ["Shipped a billing dashboard feature used by 10k+ paying customers.", "Reduced API latency by 32% by introducing Redis caching for hot endpoints."]
		}],
		projects: [{
			name: "Resume Builder Pro",
			tools: "React, TypeScript, Tailwind",
			bullets: ["Built a step-by-step resume editor with live preview and ATS scoring.", "Integrated AI-assisted bullet improvement and JD matching."]
		}, {
			name: "Realtime Chat App",
			tools: "Node.js, Socket.IO, Postgres",
			bullets: ["Designed message persistence layer handling 500 msgs/sec.", "Implemented presence and typing indicators."]
		}],
		skills: [
			{
				category: "Languages",
				items: "TypeScript, JavaScript, Python, SQL"
			},
			{
				category: "Frameworks",
				items: "React, Next.js, Node.js, Express"
			},
			{
				category: "Tools",
				items: "Git, Docker, Postgres, Redis"
			}
		],
		certifications: [{
			name: "AWS Cloud Practitioner",
			issuer: "Amazon Web Services",
			year: "2025"
		}],
		languages: [{
			name: "English",
			level: "Fluent"
		}, {
			name: "Hindi",
			level: "Native"
		}],
		achievements: [{
			title: "Smart India Hackathon Finalist",
			detail: "Top 12 nationally out of 4,000+ teams."
		}]
	};
}
function read() {
	if (typeof window === "undefined") return seedProfile();
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) {
			const s = seedProfile();
			localStorage.setItem(KEY, JSON.stringify(s));
			return s;
		}
		return {
			...emptyProfile(),
			...JSON.parse(raw)
		};
	} catch {
		return seedProfile();
	}
}
function write(p) {
	if (typeof window === "undefined") return;
	localStorage.setItem(KEY, JSON.stringify(p));
	window.dispatchEvent(new Event("rbp:profile-changed"));
}
function useProfile() {
	const [profile, setProfile] = import_react.useState(seedProfile);
	import_react.useEffect(() => {
		const sync = () => setProfile(read());
		sync();
		window.addEventListener("rbp:profile-changed", sync);
		window.addEventListener("storage", sync);
		return () => {
			window.removeEventListener("rbp:profile-changed", sync);
			window.removeEventListener("storage", sync);
		};
	}, []);
	return [profile, import_react.useCallback((updater) => {
		setProfile((prev) => {
			const next = updater(prev);
			write(next);
			return next;
		});
	}, [])];
}
function profileCompleteness(p) {
	let score = 0;
	[
		!!p.fullName,
		!!p.email,
		!!p.phone,
		!!p.location,
		!!p.summary && p.summary.length > 40,
		p.education.length > 0,
		p.experience.length > 0 || p.projects.length > 0,
		p.skills.length > 0,
		!!(p.github || p.linkedin || p.portfolio),
		p.certifications.length + p.languages.length + p.achievements.length > 0
	].forEach((c) => c && (score += 10));
	return score;
}
//#endregion
export { useProfile as n, profileCompleteness as t };
