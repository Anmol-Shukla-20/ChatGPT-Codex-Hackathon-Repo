import "server-only";

import type { CitizenProfile, DocumentRecord, SchemeRecommendation } from "@/lib/mvp/types";

const XAI_MODEL = "grok-4.5";

export async function getRecommendationsExplanation(
  profile: CitizenProfile,
  documents: DocumentRecord[],
  recommendations: SchemeRecommendation[]
) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return Object.fromEntries(
      recommendations.map((recommendation) => [
        recommendation.id,
        `${recommendation.title} is recommended because your profile and uploaded documents align with the stated eligibility criteria.`,
      ])
    );
  }

  const prompt = [
    "You are helping explain, not filter, government scheme recommendations.",
    "Use only the supplied recommendations and profile details.",
    "Return JSON only in the shape { explanations: { [schemeId]: string } }.",
    "Keep each explanation to 2 concise sentences, include eligibility, benefits, and next steps.",
    `Profile: ${JSON.stringify(profile)}`,
    `Documents: ${JSON.stringify(documents.map((doc) => ({ file_name: doc.file_name, document_type: doc.document_type, mime_type: doc.mime_type })))}`,
    `Recommendations: ${JSON.stringify(recommendations)}`,
  ].join("\n");

  const response = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: XAI_MODEL,
      input: prompt,
    }),
  });

  if (!response.ok) {
    return Object.fromEntries(
      recommendations.map((recommendation) => [
        recommendation.id,
        `${recommendation.title} is recommended because your profile and uploaded documents align with the stated eligibility criteria.`,
      ])
    );
  }

  const data = (await response.json()) as { output_text?: string };
  try {
    const parsed = JSON.parse(data.output_text ?? "{}") as { explanations?: Record<string, string> };
    return parsed.explanations ?? {};
  } catch {
    return Object.fromEntries(
      recommendations.map((recommendation) => [
        recommendation.id,
        `${recommendation.title} is recommended because your profile and uploaded documents align with the stated eligibility criteria.`,
      ])
    );
  }
}
