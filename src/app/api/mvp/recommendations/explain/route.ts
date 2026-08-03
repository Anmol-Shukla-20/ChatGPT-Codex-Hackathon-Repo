import { NextResponse } from "next/server";
import type { CitizenProfile, DocumentRecord, SchemeRecommendation } from "@/lib/mvp/types";
import { getRecommendationsExplanation } from "@/lib/mvp/xai-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      profile?: CitizenProfile;
      documents?: DocumentRecord[];
      recommendations?: SchemeRecommendation[];
    };

    if (!body.profile || !body.recommendations?.length) {
      return NextResponse.json({ explanations: {} });
    }

    const explanations = await getRecommendationsExplanation(body.profile, body.documents ?? [], body.recommendations);
    return NextResponse.json({ explanations });
  } catch {
    return NextResponse.json({ explanations: {} }, { status: 200 });
  }
}
