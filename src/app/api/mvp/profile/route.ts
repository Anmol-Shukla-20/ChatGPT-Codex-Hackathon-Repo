import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!SUPABASE_URL || !SERVICE_KEY) return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const userId = request.nextUrl.searchParams.get("userId");

    const query = supabase.from("profiles").select("*");
    const { data, error } = userId ? await query.eq("user_id", userId).maybeSingle() : await query.is("user_id", null).maybeSingle();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, profile: data });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
