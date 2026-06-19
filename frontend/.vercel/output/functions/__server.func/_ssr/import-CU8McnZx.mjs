import { o as __toESM } from "../_runtime.mjs";
import { i as createResume, l as saveResume, t as AppShell } from "./app-shell-q8BzYArD.mjs";
import { t as apiClient } from "./apiClient-DEBqcuWX.mjs";
import { storePdfBinary } from "./pdf-store-BLV_1s3T.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as cn, t as Button } from "./button-CHSNwFnT.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { K as FileUp, P as LoaderCircle, U as Github, c as Upload } from "../_libs/lucide-react.mjs";
import { o as GithubImportDialog } from "./github-import-dialog-DznuUkqn.mjs";
import { parseResumeFile } from "./parse.functions-BLPK13no.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-CU8McnZx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function ImportPage() {
	const navigate = useNavigate();
	const [parsing, setParsing] = import_react.useState(false);
	const [progressStep, setProgressStep] = import_react.useState(-1);
	const [ghOpen, setGhOpen] = import_react.useState(false);
	const fileInputRef = import_react.useRef(null);
	async function fileToBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result.split(",")[1]);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}
	const parsePdfLayout = async (file, onStepChange) => {
		let pdfjsLib = window.pdfjsLib;
		if (!pdfjsLib) {
			onStepChange(0);
			await new Promise((resolve, reject) => {
				const script = document.createElement("script");
				script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
				script.onload = () => {
					pdfjsLib = window.pdfjsLib;
					pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
					resolve();
				};
				script.onerror = () => reject(/* @__PURE__ */ new Error("Failed to load PDF worker script."));
				document.head.appendChild(script);
			});
			pdfjsLib = window.pdfjsLib;
		}
		onStepChange(1);
		const arrayBuffer = await file.arrayBuffer();
		const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
		onStepChange(2);
		const pages = [];
		let combinedText = "";
		for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
			const page = await pdf.getPage(pageNum);
			const viewport = page.getViewport({ scale: 1 });
			const textContent = await page.getTextContent();
			const merged = mergeTextItems(textContent.items.map((item) => {
				const fontFamily = textContent.styles[item.fontName]?.fontFamily || "";
				const fontName = item.fontName || "";
				const isBold = fontName.toLowerCase().includes("bold") || fontFamily.toLowerCase().includes("bold");
				const isItalic = fontName.toLowerCase().includes("italic") || fontName.toLowerCase().includes("oblique") || fontFamily.toLowerCase().includes("italic") || fontFamily.toLowerCase().includes("oblique");
				const x = item.transform[4];
				const y = viewport.height - item.transform[5] - (item.height || 0);
				return {
					text: item.str,
					x,
					y,
					width: item.width,
					height: item.height || Math.abs(item.transform[0] || item.transform[3] || 12),
					fontSize: Math.abs(item.transform[0] || item.transform[3] || 12),
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
		onStepChange(3);
		await new Promise((resolve) => setTimeout(resolve, 800));
		return {
			importedLayout: { pages },
			rawText: combinedText
		};
	};
	const handleFile = async (file) => {
		if (!file) return;
		setParsing(true);
		setProgressStep(0);
		try {
			const r = createResume({
				title: `${file.name.replace(/\.[^/.]+$/, "") || "Imported Resume"} (Visual Import)`,
				profileType: "custom",
				template: "ats-professional"
			});
			if (file.name.toLowerCase().endsWith(".pdf")) try {
				const { importedLayout, rawText } = await parsePdfLayout(file, setProgressStep);
				r.data.importedLayout = importedLayout;
				r.data.rawText = rawText;
				r.data.isVisualMode = true;
				const base64 = await fileToBase64(file);
				await storePdfBinary(r.id, base64);
				r.data.importedPdf = {
					pageCount: importedLayout.pages.length,
					uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
				};
				try {
					const uploadResult = await apiClient.upload("/upload/pdf", file);
					if (uploadResult?.storagePath) r.data.importedPdf.storagePath = uploadResult.storagePath;
				} catch (uploadErr) {
					console.warn("Backend PDF upload failed (non-critical):", uploadErr);
				}
				setProgressStep(4);
				try {
					const textForAI = rawText || importedLayout.pages?.flatMap((p) => p.textItems.map((i) => i.text)).join(" ") || "";
					if (textForAI && textForAI.length >= 20) {
						const parsed = await apiClient.post("/ai/convert-imported-resume", { resumeText: textForAI });
						r.data.fullName = parsed.fullName || "";
						r.data.email = parsed.email || "";
						r.data.phone = parsed.phone || "";
						r.data.location = parsed.location || "";
						r.data.summary = parsed.summary || "";
						r.data.education = parsed.education?.length ? parsed.education : r.data.education;
						r.data.experience = parsed.experience?.length ? parsed.experience : r.data.experience;
						r.data.projects = parsed.projects?.length ? parsed.projects : r.data.projects;
						r.data.skills = parsed.skills?.length ? parsed.skills : r.data.skills;
					} else {
						const result = await parseResumeFile({ data: {
							base64,
							filename: file.name
						} });
						r.data.fullName = result.fullName || "";
						r.data.email = result.email || "";
						r.data.phone = result.phone || "";
						r.data.summary = result.summary || "";
					}
				} catch (aiErr) {
					console.warn("AI structuring failed, falling back to basic parse:", aiErr);
					const result = await parseResumeFile({ data: {
						base64,
						filename: file.name
					} });
					r.data.fullName = result.fullName || "";
					r.data.email = result.email || "";
					r.data.phone = result.phone || "";
					r.data.summary = result.summary || "";
				}
			} catch (layoutErr) {
				console.warn("Visual layout import failed, fallback to text parsing:", layoutErr);
				const base64 = await fileToBase64(file);
				setProgressStep(4);
				try {
					const result = await parseResumeFile({ data: {
						base64,
						filename: file.name
					} });
					const rawText = result.rawText || "";
					if (rawText.length >= 20) {
						const parsed = await apiClient.post("/ai/convert-imported-resume", { resumeText: rawText });
						r.data.fullName = parsed.fullName || "";
						r.data.email = parsed.email || "";
						r.data.phone = parsed.phone || "";
						r.data.location = parsed.location || "";
						r.data.summary = parsed.summary || "";
						r.data.education = parsed.education?.length ? parsed.education : r.data.education;
						r.data.experience = parsed.experience?.length ? parsed.experience : r.data.experience;
						r.data.projects = parsed.projects?.length ? parsed.projects : r.data.projects;
						r.data.skills = parsed.skills?.length ? parsed.skills : r.data.skills;
					} else {
						r.data.fullName = result.fullName || "";
						r.data.email = result.email || "";
						r.data.phone = result.phone || "";
						r.data.summary = result.summary || "";
					}
				} catch {
					const result = await parseResumeFile({ data: {
						base64,
						filename: file.name
					} });
					r.data.fullName = result.fullName || "";
					r.data.email = result.email || "";
					r.data.phone = result.phone || "";
					r.data.summary = result.summary || "";
				}
			}
			else if (file.name.toLowerCase().endsWith(".txt")) {
				setProgressStep(1);
				await new Promise((resolve) => setTimeout(resolve, 400));
				setProgressStep(2);
				const text = await file.text();
				r.data.rawText = text;
				setProgressStep(3);
				await new Promise((resolve) => setTimeout(resolve, 400));
				setProgressStep(4);
				try {
					if (text.length >= 20) {
						const parsed = await apiClient.post("/ai/convert-imported-resume", { resumeText: text });
						r.data.fullName = parsed.fullName || "";
						r.data.email = parsed.email || "";
						r.data.phone = parsed.phone || "";
						r.data.location = parsed.location || "";
						r.data.summary = parsed.summary || "";
						r.data.education = parsed.education?.length ? parsed.education : r.data.education;
						r.data.experience = parsed.experience?.length ? parsed.experience : r.data.experience;
						r.data.projects = parsed.projects?.length ? parsed.projects : r.data.projects;
						r.data.skills = parsed.skills?.length ? parsed.skills : r.data.skills;
					}
				} catch (aiErr) {
					console.warn("AI structuring failed for TXT:", aiErr);
					const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
					const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
					const nameLine = text.split(/\n/).map((l) => l.trim()).filter(Boolean).find((l) => l.length > 2 && l.length < 60 && !l.includes("@") && !l.includes("http"));
					r.data.fullName = nameLine ?? "";
					r.data.email = emailMatch?.[0] ?? "";
					r.data.phone = phoneMatch?.[0] ?? "";
					r.data.summary = text.slice(0, 500);
				}
			} else {
				setProgressStep(1);
				await new Promise((resolve) => setTimeout(resolve, 400));
				setProgressStep(2);
				const result = await parseResumeFile({ data: {
					base64: await fileToBase64(file),
					filename: file.name
				} });
				r.data.rawText = result.rawText || "";
				setProgressStep(3);
				await new Promise((resolve) => setTimeout(resolve, 300));
				setProgressStep(4);
				try {
					const rawText = result.rawText || "";
					if (rawText.length >= 20) {
						const parsed = await apiClient.post("/ai/convert-imported-resume", { resumeText: rawText });
						r.data.fullName = parsed.fullName || "";
						r.data.email = parsed.email || "";
						r.data.phone = parsed.phone || "";
						r.data.location = parsed.location || "";
						r.data.summary = parsed.summary || "";
						r.data.education = parsed.education?.length ? parsed.education : r.data.education;
						r.data.experience = parsed.experience?.length ? parsed.experience : r.data.experience;
						r.data.projects = parsed.projects?.length ? parsed.projects : r.data.projects;
						r.data.skills = parsed.skills?.length ? parsed.skills : r.data.skills;
					} else {
						r.data.fullName = result.fullName || "";
						r.data.email = result.email || "";
						r.data.phone = result.phone || "";
						r.data.location = result.location || "";
						r.data.summary = result.summary || "";
					}
				} catch (aiErr) {
					console.warn("AI structuring failed for non-PDF:", aiErr);
					r.data.fullName = result.fullName || "";
					r.data.email = result.email || "";
					r.data.phone = result.phone || "";
					r.data.location = result.location || "";
					r.data.summary = result.summary || "";
				}
			}
			await saveResume(r);
			toast.success("Successfully imported resume! Opening editor...");
			navigate({
				to: "/editor/$id",
				params: { id: r.id }
			});
		} catch (err) {
			console.error(err);
			toast.error("Could not parse file. Try copying the text or filling manually.");
		} finally {
			setParsing(false);
			setProgressStep(-1);
		}
	};
	const handleDragOver = (e) => {
		e.preventDefault();
	};
	const handleDrop = (e) => {
		e.preventDefault();
		const file = e.dataTransfer.files?.[0];
		if (file) handleFile(file);
	};
	const handleGithubImport = async (projects) => {
		if (projects.length === 0) return;
		try {
			const r = createResume({
				title: "GitHub Projects Resume",
				profileType: "custom",
				template: "ats-professional"
			});
			r.data.projects = projects.map((p) => ({
				name: p.name,
				tools: p.tools,
				bullets: p.bullets
			}));
			await saveResume(r);
			toast.success("Successfully imported GitHub projects! Opening editor...");
			navigate({
				to: "/editor/$id",
				params: { id: r.id }
			});
		} catch (err) {
			console.error(err);
			toast.error("Failed to create resume from GitHub projects.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full px-4 py-6 md:px-8 md:py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold tracking-tight",
				children: "Import Resume"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Bring an existing resume in to skip the typing."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onDragOver: handleDragOver,
				onDrop: handleDrop,
				onClick: () => !parsing && fileInputRef.current?.click(),
				className: "mt-6 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-brand/40 bg-brand-soft/30 p-12 text-center transition-colors hover:bg-brand-soft/50 cursor-pointer",
				children: parsing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-soft text-left space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-brand animate-duration-1000" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-foreground",
								children: "Importing Resume"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground leading-normal",
							children: "We are analyzing and preparing your document. This will only take a moment."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 pt-1",
							children: [
								"Reading document",
								"Detecting pages",
								"Extracting text layout",
								"Preparing visual editor",
								"Structuring sections with AI ✨"
							].map((stepText, idx) => {
								const isActive = progressStep === idx;
								const isDone = progressStep > idx;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("font-semibold transition-colors duration-200", isActive && "text-brand font-bold", isDone && "text-muted-foreground/50", !isActive && !isDone && "text-muted-foreground/40"),
										children: stepText
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all", isActive && "bg-brand/20 text-brand border border-brand/40 animate-pulse", isDone && "bg-brand text-brand-foreground", !isActive && !isDone && "bg-muted text-muted-foreground/15 border border-border"),
										children: isDone ? "✓" : isActive ? "●" : ""
									})]
								}, idx);
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base font-bold",
						children: "Drop your PDF, DOCX or TXT"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground",
						children: "or click to browse — we'll auto-fill your sections"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						ref: fileInputRef,
						className: "hidden",
						accept: ".pdf,.docx,.txt",
						onChange: (e) => handleFile(e.target.files?.[0] ?? null)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						className: "rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 pointer-events-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "mr-1.5 h-4 w-4" }), " Choose File"]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "h-14 justify-start rounded-2xl cursor-pointer",
					onClick: () => setGhOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "mr-2 h-5 w-5" }), " Import from GitHub"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "h-14 justify-start rounded-2xl cursor-pointer",
					onClick: () => fileInputRef.current?.click(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "mr-2 h-5 w-5" }), " Import LinkedIn PDF"]
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GithubImportDialog, {
		open: ghOpen,
		onOpenChange: setGhOpen,
		onImport: handleGithubImport
	})] });
}
//#endregion
export { ImportPage as component };
