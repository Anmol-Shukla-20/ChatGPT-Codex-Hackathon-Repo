"use client";

import * as React from "react";
import { FileText, Trash2, UploadCloud, Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useAuth } from "@/features/auth/auth-provider";
import { getLocalDocuments, saveLocalDocuments, saveLocalActivities } from "@/lib/mvp/fallback-store";
import { deleteDocument, getDownloadUrl, listDocuments, uploadDocument, validateDocumentFile } from "@/lib/mvp/document-service";
import { parseProfileFromText } from "@/lib/mvp/ocr";
import { getProfile, saveProfile } from "@/lib/mvp/profile-service";
import type { DocumentRecord, RecentActivity } from "@/lib/mvp/types";

const activityLabel = (message: string): RecentActivity => ({
  id: `${Date.now()}`,
  title: message,
  description: "Document workflow updated.",
  time: "Now",
});

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = React.useState<DocumentRecord[]>([]);
  const [file, setFile] = React.useState<File | null>(null);
  const [documentType, setDocumentType] = React.useState("Identity proof");
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [busyDocumentId, setBusyDocumentId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadDocuments() {
      setLoading(true);
      const storedDocuments = getLocalDocuments<DocumentRecord[]>([]);
      setDocuments(storedDocuments);

      if (user?.id) {
        try {
          const nextDocuments = await listDocuments(user.id);
          if (nextDocuments.length) {
            setDocuments(nextDocuments);
            saveLocalDocuments(nextDocuments);
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Unable to load documents.");
        }
      }

      setLoading(false);
    }

    void loadDocuments();
  }, [user?.id]);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      toast.error("Choose a file to upload.");
      return;
    }

    if (!user?.id) {
      toast.error("Sign in to upload and sync documents.");
      return;
    }

    try {
      validateDocumentFile(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid file.");
      return;
    }

    setUploading(true);
    try {
      const record = await uploadDocument(file, user.id, documentType);
      const nextDocuments = [record, ...documents];
      setDocuments(nextDocuments);
      saveLocalDocuments(nextDocuments);
      saveLocalActivities([activityLabel(`Uploaded ${file.name}`)]);
      setFile(null);
      setDocumentType("Identity proof");
      toast.success("Document uploaded successfully.");

      // If OCR text is available, try to parse and autofill the profile.
      try {
        const text = (record as DocumentRecord & { extracted_text?: string }).extracted_text;
        if (text && text.trim()) {
          const parsed = parseProfileFromText(text);
          if (Object.keys(parsed).length) {
            const existing = (await getProfile(user.id)) ?? {
              name: "",
              age: 0,
              gender: "",
              state: "",
              district: "",
              occupation: "",
              annual_income: 0,
              category: "",
              disability: "",
              education: "",
              family_size: 0,
            };
            const merged = { ...existing, ...parsed };
            await saveProfile(user.id, merged as any);
            toast.success("Profile autofilled from uploaded document.");
          }
        }
      } catch (err) {
        // Non-fatal: ignore autofill errors.
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (document: DocumentRecord) => {
    if (!document.id) return;
    setBusyDocumentId(document.id);
    try {
      const nextDocuments = documents.filter((item) => item.id !== document.id);
      setDocuments(nextDocuments);
      saveLocalDocuments(nextDocuments);
      if (user?.id) {
        await deleteDocument(document.id, document.storage_path);
      }
      saveLocalActivities([activityLabel(`Deleted ${document.file_name}`)]);
      toast.success("Document deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete document.");
    } finally {
      setBusyDocumentId(null);
    }
  };

  const handleDownload = async (document: DocumentRecord) => {
    try {
      const url = document.file_url || (await getDownloadUrl(document.storage_path));
      if (!url) {
        toast.error("Unable to create a download link.");
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to download document.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Upload once and reuse the same documents across scheme applications and future checks."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Documents" }]}
      />

      <Section title="Upload a document" description="Use the same workflow for identity, income, education, or health proof.">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              <span>Choose a file</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                className="block w-full text-sm text-muted-foreground"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Document type</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value)}
              >
                <option>Identity proof</option>
                <option>Income proof</option>
                <option>Education proof</option>
                <option>Health proof</option>
              </select>
            </label>
          </div>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload document"}
          </Button>
        </form>
      </Section>

      <Section title="Stored documents" description="Your uploaded files are organized here for quick access.">
        {loading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <LoadingSkeleton />
            <LoadingSkeleton />
          </div>
        ) : documents.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {documents.map((document) => (
              <div key={document.id} className="rounded-2xl border bg-background p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{document.file_name}</p>
                      <p className="text-sm text-muted-foreground">{document.document_type}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(document)}
                    disabled={busyDocumentId === document.id}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span>{Math.max(1, Math.round((document.size_bytes ?? 0) / 1024))} KB</span>
                  <span>•</span>
                  <span>{new Date(document.uploaded_at ?? Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(document)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  {document.file_url ? (
                    <a href={document.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                      <UploadCloud className="h-4 w-4" />
                      Open file
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No documents yet" description="Upload the files you need to start building a reusable citizen profile." />
        )}
      </Section>
    </div>
  );
}
