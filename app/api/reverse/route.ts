import { NextResponse } from 'next/server';

// Server-side reverse geocoding proxy using Nominatim (OpenStreetMap).
// This avoids exposing third-party endpoints directly from the client and
// lets us set a friendly User-Agent header.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    if (!lat || !lon) return NextResponse.json({ error: 'missing lat/lon' }, { status: 400 });

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&accept-language=en`;
    const res = await fetch(url, {
      headers: {
        // polite identification per Nominatim usage policy
        'User-Agent': 'OOJED/1.0 (contact@oojed.com)'
      }
    });
    if (!res.ok) return NextResponse.json({ error: 'geocode failed' }, { status: 502 });
    const data = await res.json();
    const addr = data && data.address ? data.address : {};
    const city = addr.city || addr.town || addr.village || addr.county || addr.state || null;
    return NextResponse.json({ city });
  } catch (e) {
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
