import { NextResponse } from "next/server";

export async function POST() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  const BUCKET = "documents";

  if (!SUPABASE_URL) {
    return NextResponse.json({ ok: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 });
  }

  if (!SERVICE_KEY) {
    return NextResponse.json({ ok: false, error: "Service role key not configured. Please set SUPABASE_SERVICE_ROLE_KEY to allow automatic bucket creation." }, { status: 412 });
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Try to create bucket; if it exists, Supabase returns an error we can ignore
    const { error } = await supabase.storage.createBucket(BUCKET, { public: false });
    if (error && error?.message && !/already exists/i.test(error.message)) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
