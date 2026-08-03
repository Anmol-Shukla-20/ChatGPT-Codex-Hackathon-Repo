import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dataPath = path.join(process.cwd(), 'data', 'government_schemes.json');
    try {
      const raw = fs.readFileSync(dataPath, 'utf8');
      const parsed = JSON.parse(raw);
      return NextResponse.json(parsed);
    } catch {
      // fallback to previous schemes.json if present
      const fallback = path.join(process.cwd(), 'data', 'schemes.json');
      const raw2 = fs.readFileSync(fallback, 'utf8');
      const parsed2 = JSON.parse(raw2);
      return NextResponse.json(parsed2);
    }
  } catch (err) {
    return NextResponse.json({ error: 'Unable to load schemes' }, { status: 500 });
  }
}
