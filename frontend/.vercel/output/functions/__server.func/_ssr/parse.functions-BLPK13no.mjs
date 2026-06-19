import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-Bmp4DOOU.mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parse.functions-BLPK13no.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var parseResumeFile = createServerFn({ method: "POST" }).inputValidator((d) => ParseInput.parse(d)).handler(createSsrRpc("7da42374f18b7c640b2aa2691e15034a8565ac169d62e124d624e89d7600b62e"));
//#endregion
export { parseResumeFile };
