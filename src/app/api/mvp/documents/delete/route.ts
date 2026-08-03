import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!SUPABASE_URL || !SERVICE_KEY) return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });

  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  if (!bearer) return NextResponse.json({ ok: false, error: "Missing authorization token" }, { status: 401 });

  try {
    const body = await request.json();
    const { documentId, storagePath } = body;
    if (!documentId || !storagePath) return NextResponse.json({ ok: false, error: "Missing documentId or storagePath" }, { status: 400 });

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: userData, error: uErr } = await supabase.auth.getUser(bearer as string);
    if (uErr || !userData?.user) return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
    const user = userData.user;

    // Delete storage
    const { error: delErr } = await supabase.storage.from("documents").remove([storagePath]);
    if (delErr) return NextResponse.json({ ok: false, error: delErr.message }, { status: 500 });

    const { error } = await supabase.from("documents").delete().eq("id", documentId).eq("user_id", user.id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
