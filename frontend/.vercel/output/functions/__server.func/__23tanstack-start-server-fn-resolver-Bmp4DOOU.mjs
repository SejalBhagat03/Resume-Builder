//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-Bmp4DOOU.js
var manifest = { "7da42374f18b7c640b2aa2691e15034a8565ac169d62e124d624e89d7600b62e": {
	functionName: "parseResumeFile_createServerFn_handler",
	importer: () => import("./_ssr/parse.functions-Dw7RRbpj.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
