import { NextResponse } from "next/server";

type SchemeSummary = {
  id: string;
  title: string;
  state: string;
  category: string;
  officialLink: string | null;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context } = body as { message: string; context?: Record<string, unknown> };

    const GROK_KEY = process.env.GROK_API_KEY;
    if (!GROK_KEY) {
      return NextResponse.json({ text: "Grok is not configured. The assistant is currently unavailable for live AI responses. Please try again later." });
    }

    // Example Grok call - adapt endpoint to the provider's API
    try {
      // Load scheme catalog to provide focused context
      const schemesSummary: SchemeSummary[] = [];
      try {
        const fs = await import("fs");
        const path = await import("path");
        const dataPath = path.join(process.cwd(), "data", "government_schemes.json");
        const raw = fs.readFileSync(dataPath, "utf8");
        const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
        const nextSchemes = parsed.slice(0, 200).map((scheme) => ({
          id: String(scheme.id ?? ""),
          title: String(scheme.title ?? scheme.name ?? scheme.id ?? ""),
          state: String(scheme.state ?? "All"),
          category: String(scheme.category ?? "General"),
          officialLink: String(scheme.officialLink ?? scheme.official_apply_url ?? scheme.official_scheme_url ?? "") || null,
        }));
        schemesSummary.push(...nextSchemes);
      } catch {
        schemesSummary = [];
      }

        const GROK_ENDPOINT = process.env.GROK_API_ENDPOINT || "https://api.grok.ai/v1/respond";
        const resp = await fetch(GROK_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROK_KEY}` },
          body: JSON.stringify({ input: message, context: { ...(context || {}), schemes: schemesSummary } }),
        });
      if (!resp.ok) {
        const text = await resp.text();
        return NextResponse.json({ text: `Grok responded with error: ${resp.status} ${text}` }, { status: 502 });
      }
      const data = await resp.json().catch(() => null);
      // robust normalization for possible provider response shapes
      let text = "";
      if (!data) text = "";
      else if (typeof data === "string") text = data;
      else if (data.output && typeof data.output === "string") text = data.output;
      else if (data.text && typeof data.text === "string") text = data.text;
      else if (Array.isArray(data) && data[0] && (data[0].text || data[0].content)) text = data[0].text ?? data[0].content ?? "";
      else if (data.message && data.message.content) text = data.message.content;
      else text = JSON.stringify(data);

      return NextResponse.json({ text });
    } catch {
      return NextResponse.json({ text: "Error contacting Grok: fallback message — please try again later." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ text: "Invalid request" }, { status: 400 });
  }
}
