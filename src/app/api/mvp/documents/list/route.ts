import { NextResponse } from "next/server";

type DocumentRow = {
  id: string;
  file_url: string | null;
  storage_path: string | null;
  [key: string]: unknown;
};

export async function GET(request: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!SUPABASE_URL || !SERVICE_KEY) return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });

  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  if (!bearer) return NextResponse.json({ ok: false, error: "Missing authorization token" }, { status: 401 });

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: userData, error: uErr } = await supabase.auth.getUser(bearer as string);
    if (uErr || !userData?.user) return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
    const user = userData.user;

    const { data, error } = await supabase.from("documents").select("*").eq("user_id", user.id).order("uploaded_at", { ascending: false });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    // Ensure signed URLs for private storage
    try {
      const docs = (data || []) as DocumentRow[];
      const docsWithUrls = await Promise.all(docs.map(async (doc) => {
        if (!doc.file_url && doc.storage_path) {
          const { data: signed } = await supabase.storage.from("documents").createSignedUrl(doc.storage_path, 60 * 60);
          if (signed?.signedUrl) doc.file_url = signed.signedUrl;
        }
        return doc;
      }));
      return NextResponse.json({ ok: true, documents: docsWithUrls });
    } catch (e) {
      return NextResponse.json({ ok: true, documents: data });
    }
  } catch (error: unknown) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
