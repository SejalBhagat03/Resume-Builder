/**
 * pdf-store.ts
 * IndexedDB storage helper for resume PDF binary data.
 * Bypasses localStorage size limitations.
 */

const DB_NAME = "rbp-pdf-db";
const STORE_NAME = "pdfs";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Store base64 PDF binary under the resumeId key */
export async function storePdfBinary(resumeId: string, base64: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(base64, resumeId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/** Retrieve base64 PDF binary by resumeId */
export async function getPdfBinary(resumeId: string): Promise<string | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(resumeId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB get error:", err);
    return null;
  }
}

/** Delete base64 PDF binary by resumeId */
export async function deletePdfBinary(resumeId: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(resumeId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB delete error:", err);
  }
}
