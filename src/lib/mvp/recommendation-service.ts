import type { CitizenProfile, DocumentRecord, SchemeRecommendation, SchemeCatalogItem } from "@/lib/mvp/types";

async function loadSchemes(): Promise<SchemeCatalogItem[]> {
  if (typeof window === "undefined") {
    try {
      const mod = await import("@/lib/mvp/scheme-data");
      return mod.loadSchemeCatalog();
    } catch {
      return [];
    }
  }

  try {
    const resp = await fetch("/api/mvp/schemes");
    if (!resp.ok) return [];
    const data = await resp.json();
    return data as SchemeCatalogItem[];
  } catch {
    return [];
  }
}

function asNumber(value: number | string | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function hasDocument(documents: DocumentRecord[], keywords: string[]) {
  return documents.some((doc) =>
    keywords.some((keyword) =>
      `${doc.document_type} ${doc.file_name} ${doc.mime_type}`.toLowerCase().includes(keyword.toLowerCase())
    )
  );
}

function computeScore(profile: CitizenProfile | null, docs: DocumentRecord[], scheme: SchemeCatalogItem) {
  if (!profile) return 0;

  const age = asNumber(profile.age);
  const income = asNumber(profile.annual_income);
  const familySize = asNumber(profile.family_size);
  const category = normalize(profile.category);
  const occupation = normalize(profile.occupation);
  const state = normalize(profile.state);
  const education = normalize(profile.education);
  const disability = normalize(profile.disability);

  let score = 20;
  const eligible = scheme.eligibility;

  if (eligible.minAge !== undefined && age >= eligible.minAge) score += 8;
  if (eligible.maxAge !== undefined && age <= eligible.maxAge) score += 8;
  if (eligible.maxAnnualIncome !== undefined && income <= eligible.maxAnnualIncome) score += 14;
  if (!eligible.maxAnnualIncome && income > 0) score += 4;
  if (eligible.categories?.some((candidate) => normalize(candidate) === category)) score += 10;
  if (eligible.occupations?.some((candidate) => occupation.includes(normalize(candidate)))) score += 10;
  if (eligible.states?.includes("All") || eligible.states?.some((candidate) => normalize(candidate) === state)) score += 8;
  if (eligible.disabilityRequired && disability && disability !== "no" && disability !== "none") score += 10;
  if (eligible.educationMin && education) score += 6;
  if (eligible.familySizeMin !== undefined && familySize >= eligible.familySizeMin) score += 4;

  const matchedDocs = scheme.required_documents.filter((required) => hasDocument(docs, [required])).length;
  score += matchedDocs * 6;

  const interestBoost = scheme.tags.some((tag) => occupation.includes(tag) || state.includes(tag) || category.includes(tag)) ? 6 : 0;
  score += interestBoost;

  return Math.min(score, 99);
}

function buildMatchingCriteria(profile: CitizenProfile | null, scheme: SchemeCatalogItem) {
  if (!profile) return [];
  const criteria: string[] = [];
  const income = asNumber(profile.annual_income);

  if (scheme.eligibility.maxAnnualIncome && income > 0 && income <= scheme.eligibility.maxAnnualIncome) {
    criteria.push(`Income is within the eligible threshold of ₹${scheme.eligibility.maxAnnualIncome.toLocaleString("en-IN")}.`);
  }
  if (scheme.eligibility.occupations?.length) {
    criteria.push(`Occupation aligns with ${scheme.eligibility.occupations.join(", ")}.`);
  }
  if (scheme.eligibility.states?.includes("All") || (profile.state && scheme.eligibility.states?.some((item) => normalize(item) === normalize(profile.state)))) {
    criteria.push(`State matches the scheme coverage.`);
  }
  if (scheme.eligibility.disabilityRequired && normalize(profile.disability) !== "no") {
    criteria.push("Disability status supports the eligibility pathway.");
  }
  return criteria;
}

function buildMissingDocuments(documents: DocumentRecord[], scheme: SchemeCatalogItem) {
  return scheme.required_documents.filter((document) => !hasDocument(documents, [document]));
}

export async function getRecommendations(profile: CitizenProfile | null, documents: DocumentRecord[] = []) {
  const schemeCatalog = (await loadSchemes()) ?? [];
  if (!Array.isArray(schemeCatalog) || schemeCatalog.length === 0) return [];

  const baseRecommendations: SchemeRecommendation[] = schemeCatalog
    .map((scheme) => {
      const eligibility_score = computeScore(profile, documents, scheme);
      return {
        id: scheme.id,
        title: scheme.title,
        eligibility_score,
        reason: scheme.description,
        required_documents: scheme.required_documents,
        next_steps: [
          "Review the documents listed below",
          "Complete any missing profile fields",
          "Apply through the official portal",
        ],
        benefits: scheme.benefits,
        category: scheme.category,
        level: scheme.level,
        matching_criteria: buildMatchingCriteria(profile, scheme),
        missing_documents: buildMissingDocuments(documents, scheme),
        official_apply_url: scheme.official_apply_url,
        official_scheme_url: scheme.official_scheme_url,
        last_updated: scheme.last_updated,
        state: scheme.state,
        scheme_type: scheme.scheme_type,
        eligibility_rules: scheme.eligibility_rules,
        tags: scheme.tags,
        eligibility: scheme.eligibility,
      };
    })
    .sort((a, b) => b.eligibility_score - a.eligibility_score);

  if (!profile) {
    // No profile: return all schemes for browsing (unranked)
    return baseRecommendations.map((scheme) => ({ ...scheme, eligibility_score: 0, reason: "Browse all available schemes. Complete your profile to see personalized matching." }));
  }

  try {
    const response = await fetch("/api/mvp/recommendations/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile,
        documents,
        recommendations: baseRecommendations.slice(0, 5),
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as { explanations?: Record<string, string> };
      return baseRecommendations.map((scheme) => ({
        ...scheme,
        reason: data.explanations?.[scheme.id] ?? scheme.reason,
      }));
    }
  } catch {
    // Fall back to local explanations below.
  }

  return baseRecommendations;
}

export function getProfileCompletion(profile: CitizenProfile | null) {
  if (!profile) return 0;
  const fields = [
    profile.name,
    profile.age,
    profile.gender,
    profile.state,
    profile.district,
    profile.occupation,
    profile.annual_income,
    profile.category,
    profile.disability,
    profile.education,
    profile.family_size,
  ];

  const completed = fields.filter((value) => String(value ?? "").trim() !== "" && String(value) !== "0").length;
  return Math.round((completed / fields.length) * 100);
}
