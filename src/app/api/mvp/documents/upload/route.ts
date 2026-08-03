import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  const BUCKET = "documents";

  if (!SUPABASE_URL) {
    return NextResponse.json({ ok: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 });
  }

  if (!SERVICE_KEY) {
    return NextResponse.json({ ok: false, error: "Missing service role key. Set SUPABASE_SERVICE_ROLE_KEY in server env." }, { status: 412 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const documentType = String(form.get("documentType") ?? "");
    const userId = String(form.get("userId") ?? "") || null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Ensure bucket exists (create if allowed)
    try {
      await supabase.storage.createBucket(BUCKET, { public: false });
    } catch {
      // ignore errors (bucket may already exist)
    }

    const fileExt = (file.name || "").split(".").pop() ?? "bin";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const storageUserId = userId || "guest";
    const storagePath = `${storageUserId}/${fileName}`;

    const up = await supabase.storage.from(BUCKET).upload(storagePath, file, { cacheControl: "3600", upsert: false });
    if (up.error) {
      return NextResponse.json({ ok: false, error: up.error.message }, { status: 500 });
    }

    // Use createSignedUrl to give the client a temporary access URL
    const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 60 * 60);

    const payload = {
      user_id: userId,
      file_name: file.name,
      file_url: signed?.signedUrl ?? null,
      storage_path: storagePath,
      mime_type: file.type || "application/octet-stream",
      size_bytes: Number(file.size || 0),
      document_type: documentType || "General",
      uploaded_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("documents").insert(payload).select().single();
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, document: data, signedUrl: signed?.signedUrl ?? null });
  } catch (error: unknown) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
