import fs from "fs";
import path from "path";
import type { SchemeCatalogItem } from "@/lib/mvp/types";

export type SchemeDataRecord = {
  id: string;
  name: string;
  state: string;
  category: string;
  gender: string;
  income: string;
  occupation: string;
  education: string;
  disability: string;
  required_documents: string[];
  benefits: string[];
  official_scheme_url: string;
  official_apply_url: string;
};

const dataFilePath = path.join(process.cwd(), "data", "government_schemes.json");

export function loadSchemeCatalog(): SchemeCatalogItem[] {
  try {
    const raw = fs.readFileSync(dataFilePath, "utf8");
    const records = JSON.parse(raw) as SchemeDataRecord[];
    return records.map((record) => ({
      id: record.id,
      title: (record as any).title ?? (record as any).name ?? record.id,
      category: record.category ?? "General",
      level: (record as any).state === "All" ? "Central" : "State",
      description: `Eligibility: ${((record as any).eligibilityDesc ?? record.category ?? "General").toString()}`,
      benefits: (record as any).benefits ?? [],
      required_documents: (record as any).required_documents ?? (record as any).requiredDocuments ?? [],
      eligibility: {
        minAge: (record as any).eligibility?.ageMin ?? (record as any).eligibility?.minAge,
        maxAge: (record as any).eligibility?.ageMax ?? (record as any).eligibility?.maxAge,
        maxAnnualIncome: (record as any).eligibility?.maxAnnualIncome ?? (record as any).eligibility?.incomeMax,
        categories: (record as any).eligibility?.categories ?? undefined,
        occupations: (record as any).eligibility?.occupation ?? (record as any).eligibility?.occupations ?? undefined,
        disabilityRequired: (record as any).eligibility?.disability === true || (record as any).eligibility?.disability === "Yes",
        educationMin: (record as any).eligibility?.educationMin ?? undefined,
        familySizeMin: (record as any).eligibility?.familySizeMin ?? undefined,
        states: (record as any).state === "All" ? ["All"] : [(record as any).state],
      },
      tags: [((record.category || "") as string).toLowerCase(), (((record as any).eligibility?.occupation ?? (record as any).occupation) || "").toString().toLowerCase()],
      state: (record as any).state ?? "All",
      scheme_type: (record as any).state === "All" ? "Central" : "State",
      official_apply_url: (record as any).officialLink ?? (record as any).official_apply_url ?? (record as any).official_scheme_url ?? null,
      official_scheme_url: (record as any).official_scheme_url ?? (record as any).officialLink ?? null,
      last_updated: (record as any).last_updated ?? new Date().toISOString().slice(0, 10),
      eligibility_rules: (record as any).eligibility ? JSON.stringify((record as any).eligibility) : "",
    }));
  } catch (err) {
    // If reading government_schemes.json fails, fallback to older schemes.json for compatibility
    try {
      const fallbackPath = path.join(process.cwd(), "data", "schemes.json");
      const raw2 = fs.readFileSync(fallbackPath, "utf8");
      const records2 = JSON.parse(raw2) as SchemeDataRecord[];
      return records2.map((record) => ({
        id: record.id,
        title: record.name,
        category: record.category,
        level: record.state === "All" ? "Central" : "State",
        description: `Eligibility focuses on ${record.category.toLowerCase()} support for ${record.occupation.toLowerCase()} applicants.`,
        benefits: record.benefits,
        required_documents: record.required_documents,
        eligibility: {
          states: record.state === "All" ? ["All"] : [record.state],
        },
        tags: [record.category.toLowerCase(), record.occupation.toLowerCase(), record.state.toLowerCase()],
        state: record.state,
        scheme_type: record.state === "All" ? "Central" : "State",
        official_apply_url: record.official_apply_url,
        official_scheme_url: record.official_scheme_url,
        last_updated: new Date().toISOString().slice(0, 10),
        eligibility_rules: `${record.gender} • ${record.income} • ${record.occupation} • ${record.education} • ${record.disability}`,
      }));
    } catch {
      return [];
    }
  }
}
