import { NextResponse } from 'next/server';

// Server-side IP lookup proxy. Uses ipapi.co for a simple JSON response.
// This keeps the client from calling a third-party endpoint directly.
export async function GET() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return NextResponse.json({ error: 'ip lookup failed' }, { status: 502 });
    const data = await res.json();
    // prefer city, but sometimes region/state may be available
    const city = data.city || data.region || data.region_code || null;
    return NextResponse.json({ city });
  } catch (e) {
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
