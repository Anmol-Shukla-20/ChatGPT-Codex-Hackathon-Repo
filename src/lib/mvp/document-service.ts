import type { DocumentRecord } from "@/lib/mvp/types";

const BUCKET = "documents";

const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
const maxFileSizeBytes = 5 * 1024 * 1024;

export function validateDocumentFile(file: File) {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Only PDF, JPG, and PNG files are supported.");
  }
  if (file.size > maxFileSizeBytes) {
    throw new Error("File size must be 5 MB or less.");
  }
}

export async function uploadDocument(file: File, userId: string, documentType: string) {
  validateDocumentFile(file);

  const form = new FormData();
  form.append("file", file);
  form.append("documentType", documentType);
  form.append("userId", userId || "");

  const resp = await fetch("/api/mvp/documents/upload", { method: "POST", body: form });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body?.error || "Upload failed");
  }

  const result = await resp.json();
  const data = result.document as DocumentRecord;
  let extracted_text = "";
  try {
    if (file.type.startsWith("image/")) {
      extracted_text = await extractTextFromFile(file);
    }
  } catch (e) {
    // Non-fatal: OCR can fail on large or unsupported images; still return the uploaded record.
    extracted_text = "";
  }
  return { ...(data as DocumentRecord), extracted_text } as DocumentRecord;
}

export async function extractTextFromFile(file: File) {
  if (!file) return "";
  if (!file.type.startsWith("image/")) return "";
  try {
    const { createWorker } = await import("tesseract.js");
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const { data } = await worker.recognize(file);
    await worker.terminate();
    return data?.text ?? "";
  } catch (err) {
    return "";
  }
}

export async function listDocuments(userId: string) {
  const resp = await fetch(`/api/mvp/documents/list${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`, { method: "GET" });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body?.error || "Unable to list documents");
  }
  const body = await resp.json();
  return (body?.documents ?? []) as DocumentRecord[];
}

export async function getDownloadUrl(storagePath: string) {
  const resp = await fetch(`/api/mvp/documents/signed-url?path=${encodeURIComponent(storagePath)}`);
  if (!resp.ok) return null;
  const body = await resp.json().catch(() => ({}));
  return body?.signedUrl ?? null;
}

export async function deleteDocument(documentId: string, storagePath: string) {
  const resp = await fetch("/api/mvp/documents/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentId, storagePath }),
  });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body?.error || "Unable to delete document");
  }
}
