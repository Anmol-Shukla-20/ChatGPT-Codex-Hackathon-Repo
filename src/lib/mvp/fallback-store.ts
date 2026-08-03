const PROFILE_KEY = "bharatsetu-profile";
const DOCUMENTS_KEY = "bharatsetu-documents";
const ACTIVITIES_KEY = "bharatsetu-activities";

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalProfile<T>(fallback: T) {
  return safeRead<T>(PROFILE_KEY, fallback);
}

export function saveLocalProfile<T>(value: T) {
  safeWrite(PROFILE_KEY, value);
}

export function getLocalDocuments<T>(fallback: T) {
  return safeRead<T>(DOCUMENTS_KEY, fallback);
}

export function saveLocalDocuments<T>(value: T) {
  safeWrite(DOCUMENTS_KEY, value);
}

export function getLocalActivities<T>(fallback: T) {
  return safeRead<T>(ACTIVITIES_KEY, fallback);
}

export function saveLocalActivities<T>(value: T) {
  safeWrite(ACTIVITIES_KEY, value);
}
