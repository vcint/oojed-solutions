// Small caching utility: in-memory + sessionStorage with optional TTL (ms)
type CacheEntry = { value: any; expiresAt?: number };

const memCache: Record<string, CacheEntry> = {};

export function setCache(key: string, value: any, ttlMs?: number) {
  const entry: CacheEntry = { value };
  if (ttlMs) entry.expiresAt = Date.now() + ttlMs;
  memCache[key] = entry;
  try {
    const st = { value, expiresAt: entry.expiresAt };
    sessionStorage.setItem(`cache:${key}`, JSON.stringify(st));
  } catch (e) {
    // ignore sessionStorage errors (private mode)
  }
}

export function getCache(key: string) {
  const m = memCache[key];
  if (m) {
    if (m.expiresAt && Date.now() > m.expiresAt) {
      delete memCache[key];
    } else {
      return m.value;
    }
  }
  try {
    const raw = sessionStorage.getItem(`cache:${key}`);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(`cache:${key}`);
      return undefined;
    }
    // warm in-memory cache
    memCache[key] = { value: parsed.value, expiresAt: parsed.expiresAt } as CacheEntry;
    return parsed.value;
  } catch (e) {
    return undefined;
  }
}

export function clearCache(key: string) {
  delete memCache[key];
  try { sessionStorage.removeItem(`cache:${key}`); } catch (e) {}
}
