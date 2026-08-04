import type { CitizenProfile } from "@/lib/mvp/types";

export function parseProfileFromText(text: string): Partial<CitizenProfile> {
  if (!text) return {};
  const cleaned = text.replace(/\s+/g, " ").trim();
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  let name = "";
  const nameLine = lines.find((l) => /\bname\b[:\-]/i.test(l));
  if (nameLine) {
    name = nameLine.split(/[:\-]/).slice(1).join(":").trim();
  } else {
    const candidate = lines.find((l) => /^[A-Za-z .,'-]+$/.test(l) && l.split(" ").length >= 2);
    if (candidate) name = candidate;
  }

  let age: number | undefined;
  const ageMatch = cleaned.match(/\bage[:\s]*([0-9]{1,3})\b/i);
  if (ageMatch) {
    age = Number(ageMatch[1]);
  } else {
    const dobMatch = cleaned.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/);
    if (dobMatch) {
      const parts = dobMatch[1].split(/\D/);
      const year = Number(parts[2]);
      if (Number.isFinite(year)) age = new Date().getFullYear() - year;
    }
  }

  let gender: string | undefined;
  const g = cleaned.match(/\b(male|female|transgender|other)\b/i);
  if (g) gender = g[1].toLowerCase();

  const result: Partial<CitizenProfile> = {};
  if (name) result.name = name;
  if (age !== undefined) result.age = age;
  if (gender) result.gender = gender;
  return result;
}
