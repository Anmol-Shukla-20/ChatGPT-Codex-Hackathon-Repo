import { supabase } from "@/lib/mvp/supabase-client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { CitizenProfile } from "@/lib/mvp/types";

export function validateProfile(profile: CitizenProfile) {
  return {
    name: profile.name.trim(),
    age: Number(profile.age || 0),
    gender: profile.gender.trim(),
    state: profile.state.trim(),
    district: profile.district.trim(),
    occupation: profile.occupation.trim(),
    annual_income: Number(profile.annual_income || 0),
    category: profile.category.trim(),
    disability: profile.disability.trim(),
    education: profile.education.trim(),
    family_size: Number(profile.family_size || 0),
  };
}

async function getAuthHeader() {
  try {
    const client = createSupabaseBrowserClient();
    const { data } = await client.auth.getSession();
    const token = data?.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function getProfile(userId: string) {
  const headers = await getAuthHeader();
  const resp = await fetch("/api/mvp/profile", { method: "GET", headers });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body?.error || "Unable to fetch profile");
  }
  const body = await resp.json();
  return (body?.profile ?? null) as CitizenProfile | null;
}

export async function saveProfile(userId: string, profile: CitizenProfile) {
  const headers = await getAuthHeader();
  headers["Content-Type"] = "application/json";
  const resp = await fetch("/api/mvp/profile/save", { method: "POST", headers, body: JSON.stringify({ profile }) });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body?.error || "Unable to save profile");
  }
  const body = await resp.json();
  return (body?.profile ?? null) as CitizenProfile | null;
}

export function getProfileCompletion(profile: CitizenProfile | null) {
  if (!profile) return 0;
  const fields = [profile.name, profile.age, profile.gender, profile.state, profile.district, profile.occupation, profile.annual_income, profile.category, profile.disability, profile.education, profile.family_size];
  const completed = fields.filter((value) => String(value ?? "").trim() !== "" && String(value) !== "0").length;
  return Math.round((completed / fields.length) * 100);
}
