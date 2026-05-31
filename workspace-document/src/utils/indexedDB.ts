// src/utils/indexedDB.ts

const DB_NAME = "EnterpriseWorkspaceDB";
const DB_VERSION = 1;
const STORE_NAME = "documents";
const DOC_KEY = "current_document_draft";

// Opens and initializes a secure local transaction portal in the user's browser
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

// Commits the active rich-text state html into the local IndexedDB table canvas
export async function saveDraftToLocal(htmlContent: string): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(htmlContent, DOC_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to write backup snapshot to IndexedDB:", error);
  }
}

// Retrieves the latest saved draft from the local database on initial page boot-up
export async function loadDraftFromLocal(): Promise<string | null> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(DOC_KEY);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to load backup snapshot from IndexedDB:", error);
    return null;
  }
}
