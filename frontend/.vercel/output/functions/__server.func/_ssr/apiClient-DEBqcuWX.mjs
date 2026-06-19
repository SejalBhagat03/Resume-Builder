import { t as supabase } from "./client-DWNMNgqv.mjs";
import { d as __exportAll } from "./app-shell-q8BzYArD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/apiClient-DEBqcuWX.js
/**
* Reusable API client for the Resume Builder backend.
*
* Usage:
*   import { apiClient } from '@/lib/apiClient';
*   const data = await apiClient.post('/ai/generate-summary', { role: 'SWE' });
*/
var apiClient_exports = /* @__PURE__ */ __exportAll({
	ApiError: () => ApiError,
	apiClient: () => apiClient
});
var API_BASE = "http://localhost:4000/api";
var ApiError = class extends Error {
	code;
	status;
	constructor(message, code, status) {
		super(message);
		this.name = "ApiError";
		this.code = code;
		this.status = status;
	}
};
async function getAuthToken() {
	const { data } = await supabase.auth.getSession();
	return data.session?.access_token ?? null;
}
async function request(method, path, body) {
	const token = await getAuthToken();
	const headers = { "Content-Type": "application/json" };
	if (token) headers["Authorization"] = `Bearer ${token}`;
	const response = await fetch(`${API_BASE}${path}`, {
		method,
		headers,
		body: body !== void 0 ? JSON.stringify(body) : void 0
	});
	const json = await response.json().catch(() => ({
		success: false,
		message: "Invalid server response",
		code: "INVALID_RESPONSE"
	}));
	if (!json.success) throw new ApiError(json.message ?? "Request failed", json.code ?? "UNKNOWN_ERROR", response.status);
	return json.data;
}
async function uploadFile(path, file, fieldName = "file") {
	const token = await getAuthToken();
	const form = new FormData();
	form.append(fieldName, file);
	const response = await fetch(`${API_BASE}${path}`, {
		method: "POST",
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		body: form
	});
	const json = await response.json().catch(() => ({
		success: false,
		message: "Upload failed",
		code: "UPLOAD_ERROR"
	}));
	if (!json.success) throw new ApiError(json.message ?? "Upload failed", json.code ?? "UPLOAD_ERROR", response.status);
	return json.data;
}
var apiClient = {
	get: (path) => request("GET", path),
	post: (path, body) => request("POST", path, body),
	put: (path, body) => request("PUT", path, body),
	delete: (path) => request("DELETE", path),
	upload: (path, file, fieldName) => uploadFile(path, file, fieldName)
};
//#endregion
export { apiClient_exports as n, apiClient as t };
