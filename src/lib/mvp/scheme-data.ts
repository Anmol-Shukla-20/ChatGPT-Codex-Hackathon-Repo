/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "fs";
import path from "path";
import type { SchemeCatalogItem } from "@/lib/mvp/types";

type RawSchemeRecord = {
  id: string;
  title?: string;
  name?: string;
  category?: string;
  state?: string;
  eligibilityDesc?: string;
  benefits?: string[];
  required_documents?: string[];
  requiredDocuments?: string[];
  officialLink?: string;
  official_apply_url?: string;
  official_scheme_url?: string;
  last_updated?: string;
  occupation?: string;
  eligibility?: {
    ageMin?: number;
    minAge?: number;
    ageMax?: number;
    maxAge?: number;
    maxAnnualIncome?: number;
    incomeMax?: number;
    categories?: string[];
    occupation?: string[] | string;
    occupations?: string[];
    disability?: boolean | string;
    educationMin?: string;
    familySizeMin?: number;
  };
};

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
    const records = JSON.parse(raw) as RawSchemeRecord[];
    return records.map((record) => ({
      id: record.id,
      title: record.title ?? record.name ?? record.id,
      category: record.category ?? "General",
      level: record.state === "All" ? "Central" : "State",
      description: `Eligibility: ${(record.eligibilityDesc ?? record.category ?? "General").toString()}`,
      benefits: record.benefits ?? [],
      required_documents: record.required_documents ?? record.requiredDocuments ?? [],
      eligibility: {
        minAge: record.eligibility?.ageMin ?? record.eligibility?.minAge,
        maxAge: record.eligibility?.ageMax ?? record.eligibility?.maxAge,
        maxAnnualIncome: record.eligibility?.maxAnnualIncome ?? record.eligibility?.incomeMax,
        categories: record.eligibility?.categories ?? undefined,
        occupations: Array.isArray(record.eligibility?.occupation)
          ? record.eligibility.occupation
          : record.eligibility?.occupations ?? undefined,
        disabilityRequired: record.eligibility?.disability === true || record.eligibility?.disability === "Yes",
        educationMin: record.eligibility?.educationMin ?? undefined,
        familySizeMin: record.eligibility?.familySizeMin ?? undefined,
        states: record.state === "All" ? ["All"] : [record.state ?? "All"],
      },
      tags: [(record.category ?? "").toLowerCase(), ((Array.isArray(record.eligibility?.occupation) ? record.eligibility.occupation.join(" ") : record.occupation ?? "")).toString().toLowerCase()],
      state: record.state ?? "All",
      scheme_type: record.state === "All" ? "Central" : "State",
      official_apply_url: record.officialLink ?? record.official_apply_url ?? record.official_scheme_url ?? null,
      official_scheme_url: record.official_scheme_url ?? record.officialLink ?? null,
      last_updated: record.last_updated ?? new Date().toISOString().slice(0, 10),
      eligibility_rules: record.eligibility ? JSON.stringify(record.eligibility) : "",
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
