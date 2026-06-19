//#region node_modules/.nitro/vite/services/ssr/assets/pdf-store-BLV_1s3T.js
/**
* pdf-store.ts
* IndexedDB storage helper for resume PDF binary data.
* Bypasses localStorage size limitations.
*/
var DB_NAME = "rbp-pdf-db";
var STORE_NAME = "pdfs";
function getDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
/** Store base64 PDF binary under the resumeId key */
async function storePdfBinary(resumeId, base64) {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(base64, resumeId);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}
/** Retrieve base64 PDF binary by resumeId */
async function getPdfBinary(resumeId) {
	try {
		const db = await getDB();
		return new Promise((resolve, reject) => {
			const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(resumeId);
			request.onsuccess = () => resolve(request.result || null);
			request.onerror = () => reject(request.error);
		});
	} catch (err) {
		console.error("IndexedDB get error:", err);
		return null;
	}
}
//#endregion
export { getPdfBinary, storePdfBinary };
