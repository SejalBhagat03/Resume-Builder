import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parse.functions-Dw7RRbpj.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* parse.functions.ts
* Server-side resume text extraction using TanStack Start createServerFn.
* Extracts text from uploaded PDF, then uses AI to parse fields.
*/
var ParseInput = objectType({
	/** Base64-encoded file content */
	base64: stringType().min(1),
	/** Original filename (used to detect PDF vs TXT) */
	filename: stringType().min(1)
});
var parseResumeFile_createServerFn_handler = createServerRpc({
	id: "7da42374f18b7c640b2aa2691e15034a8565ac169d62e124d624e89d7600b62e",
	name: "parseResumeFile",
	filename: "src/lib/parse.functions.ts"
}, (opts) => parseResumeFile.__executeServer(opts));
var parseResumeFile = createServerFn({ method: "POST" }).inputValidator((d) => ParseInput.parse(d)).handler(parseResumeFile_createServerFn_handler, async ({ data }) => {
	const { base64, filename } = data;
	const buffer = Buffer.from(base64, "base64");
	let rawText = "";
	const lower = filename.toLowerCase();
	if (lower.endsWith(".pdf")) try {
		const { createRequire } = await import("node:module");
		rawText = (await createRequire(import.meta.url)("pdf-parse")(buffer)).text;
	} catch (err) {
		console.error("[parseResumeFile] pdf-parse error:", err);
		rawText = "";
	}
	else if (lower.endsWith(".txt")) rawText = buffer.toString("utf-8");
	else rawText = buffer.toString("utf-8").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
	const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
	const phoneMatch = rawText.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
	const lines = rawText.split(/\n/).map((l) => l.trim()).filter(Boolean);
	const nameLine = lines.find((l) => l.length > 2 && l.length < 60 && !l.includes("@") && !l.includes("http") && !/^[A-Z\s]+$/.test(l));
	const summaryLine = lines.find((l) => l.length > 40 && !l.includes("@") && !phoneMatch?.[0]?.includes(l) && l !== nameLine);
	return {
		fullName: nameLine ?? "",
		email: emailMatch?.[0] ?? "",
		phone: phoneMatch?.[0] ?? "",
		location: "",
		summary: summaryLine ?? rawText.slice(0, 300),
		rawText: rawText.slice(0, 1e4)
	};
});
//#endregion
export { parseResumeFile_createServerFn_handler };
