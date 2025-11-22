import { NextResponse } from 'next/server';
import data from '@/data/site.json';

const knownCities: string[] = Array.isArray((data as any).cities) ? (data as any).cities : [];

// Normalize city name for better matching
const normalize = (s: string) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

// Find closest matching city from our known cities list
const findMatchingCity = (detectedCity: string): string | null => {
  if (!detectedCity) return null;

  const normalizedDetected = normalize(detectedCity);

  // Try exact normalized match first
  const exactMatch = knownCities.find(city => normalize(city) === normalizedDetected);
  if (exactMatch) return exactMatch;

  // Try partial match (detected city contains or is contained in known city)
  const partialMatch = knownCities.find(city => {
    const normalizedKnown = normalize(city);
    return normalizedKnown.includes(normalizedDetected) || normalizedDetected.includes(normalizedKnown);
  });
  if (partialMatch) return partialMatch;

  return null;
};

/**
 * Query multiple geolocation services in parallel
 */
async function queryAllServices() {
  const results: { service: string; city: string | null; matched: string | null }[] = [];

  // Service 1: ipapi.co
  try {
    const res = await fetch('https://ipapi.co/json/', {
      headers: { 'User-Agent': 'OOJED/1.0' },
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      const detectedCity = data.city || data.region || null;
      const matched = detectedCity ? findMatchingCity(detectedCity) : null;
      results.push({ service: 'ipapi.co', city: detectedCity, matched });
      console.log(`📍 ipapi.co: detected="${detectedCity}" matched="${matched}"`);
    }
  } catch (e) {
    console.log('❌ ipapi.co failed:', e instanceof Error ? e.message : 'unknown');
  }

  // Service 2: ip-api.com
  try {
    const res = await fetch('http://ip-api.com/json/', {
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      const detectedCity = data.city || data.regionName || null;
      const matched = detectedCity ? findMatchingCity(detectedCity) : null;
      results.push({ service: 'ip-api.com', city: detectedCity, matched });
      console.log(`📍 ip-api.com: detected="${detectedCity}" matched="${matched}"`);
    }
  } catch (e) {
    console.log('❌ ip-api.com failed:', e instanceof Error ? e.message : 'unknown');
  }

  // Service 3: ipwhois.app
  try {
    const res = await fetch('https://ipwho.is/', {
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      const detectedCity = data.city || data.region || null;
      const matched = detectedCity ? findMatchingCity(detectedCity) : null;
      results.push({ service: 'ipwho.is', city: detectedCity, matched });
      console.log(`📍 ipwho.is: detected="${detectedCity}" matched="${matched}"`);
    }
  } catch (e) {
    console.log('❌ ipwho.is failed:', e instanceof Error ? e.message : 'unknown');
  }

  // Service 4: ipgeolocation.io (free tier, no key required for basic usage)
  try {
    const res = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=', {
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      const detectedCity = data.city || data.state_prov || null;
      const matched = detectedCity ? findMatchingCity(detectedCity) : null;
      results.push({ service: 'ipgeolocation.io', city: detectedCity, matched });
      console.log(`📍 ipgeolocation.io: detected="${detectedCity}" matched="${matched}"`);
    }
  } catch (e) {
    console.log('❌ ipgeolocation.io failed:', e instanceof Error ? e.message : 'unknown');
  }

  return results;
}

/**
 * Use majority voting to determine the most accurate city
 */
function getMajorityConsensus(results: { service: string; city: string | null; matched: string | null }[]) {
  // Count votes for each matched city
  const votes: Record<string, number> = {};
  const detectedCities: string[] = [];

  for (const result of results) {
    if (result.city) detectedCities.push(result.city);
    if (result.matched) {
      votes[result.matched] = (votes[result.matched] || 0) + 1;
    }
  }

  console.log('🗳️ Voting results:', votes);
  console.log('📊 Raw detections:', detectedCities);

  // Find the city with the most votes
  let maxVotes = 0;
  let consensusCity: string | null = null;

  for (const [city, count] of Object.entries(votes)) {
    if (count > maxVotes) {
      maxVotes = count;
      consensusCity = city;
    }
  }

  // Require at least 2 votes for consensus (majority of services must agree)
  if (maxVotes >= 2 && consensusCity) {
    console.log(`✅ CONSENSUS: "${consensusCity}" with ${maxVotes}/${results.length} votes`);
    return consensusCity;
  }

  // If no consensus, return the first matched city (if any)
  const firstMatch = results.find(r => r.matched);
  if (firstMatch) {
    console.log(`⚠️ NO CONSENSUS: Using first match "${firstMatch.matched}" from ${firstMatch.service}`);
    return firstMatch.matched;
  }

  console.log('❌ NO MATCH: No services matched a known city');
  return null;
}

/**
 * IP-based geolocation endpoint with consensus voting
 */
export async function GET() {
  try {
    console.log('🔍 Starting multi-service IP geolocation with consensus voting...');

    // Query all services in parallel
    const results = await queryAllServices();

    if (results.length === 0) {
      console.log('⛔ All services failed');
      return NextResponse.json({
        city: null,
        error: 'All geolocation services failed',
        results: []
      });
    }

    // Use majority voting to determine the city
    const consensusCity = getMajorityConsensus(results);

    return NextResponse.json({
      city: consensusCity,
      consensus: consensusCity !== null,
      services: results.length,
      votes: results.filter(r => r.matched === consensusCity).length,
      details: results
    });

  } catch (error) {
    console.error('💥 IP geolocation error:', error);
    return NextResponse.json({
      city: null,
      error: 'Failed to detect location'
    }, { status: 500 });
  }
}
