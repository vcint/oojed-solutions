import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type IndexEntry = { folder: string; files: string[] };

// Simple in-memory index with TTL to avoid heavy fs operations on each request.
let productsIndex: Map<string, IndexEntry> | null = null;
let indexBuiltAt = 0;
let buildPromise: Promise<Map<string, IndexEntry>> | null = null;
// increase TTL to 5 minutes to avoid frequent rebuilds during dev; safe for production too
const INDEX_TTL_MS = 5 * 60 * 1000;

// simple in-memory response cache for API responses
const responseCache: Map<string, { expires: number; payload: any }> = new Map();
const RESPONSE_TTL_MS = 5 * 60 * 1000; // cache responses for 5 minutes

// runtime flag for non-production (helps TypeScript avoid narrowing issues)
const IS_DEV = (process.env.NODE_ENV as string) !== "production";

const normalize = (s: string) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

async function buildIndex(publicDir: string) {
  // If a build is already in progress, reuse its promise so we don't duplicate work
  if (buildPromise) return buildPromise;

  buildPromise = (async () => {
    const map = new Map<string, IndexEntry>();
    try {
      const baseDirs = ["products", "services"];
      // read base directories in parallel
      await Promise.all(baseDirs.map(async (base) => {
        const basePath = path.join(publicDir, base);
        const exists = await fs.stat(basePath).then(() => true).catch(() => false);
        if (!exists) return;

        // faster directory listing using withFileTypes to avoid extra stat calls
        const dirents = await fs.readdir(basePath, { withFileTypes: true }).catch(() => [] as any[]);
        const folders = dirents.filter((d: any) => d && d.isDirectory()).map((d: any) => d.name);

        // read each folder's files in parallel
        await Promise.all(folders.map(async (entry) => {
          try {
            const full = path.join(basePath, entry);
            const files = await fs.readdir(full).catch(() => [] as string[]);
            const imgs = files.filter((f: string) => /\.(png|jpe?g|webp|svg)$/i.test(f)).sort();
            if (!imgs.length) return;
            const folder = `${base}/${entry}`;
            const key = normalize(entry);
            const entryObj = { folder, files: imgs };
            map.set(key, entryObj);
            // also map slugified/name variants to be forgiving in lookups
            map.set(normalize(entry.replace(/\s+/g, "-")), entryObj);
            map.set(normalize(entry.replace(/\s+/g, "_")), entryObj);
            map.set(normalize(`${base}/${entry}`), entryObj);
            const tokens = String(entry).split(/[^a-zA-Z0-9]+/).filter(Boolean);
            for (const t of tokens) {
              if (t.length < 2) continue;
              map.set(normalize(t), entryObj);
            }
            const m = String(entry).match(/\(([^)]+)\)/);
            if (m && m[1]) {
              const acr = m[1].trim();
              if (acr.length > 0) map.set(normalize(acr), entryObj);
            }
          } catch (e) {
            // ignore per-entry failures
          }
        }));
      }));
    } catch (e) {
      // ignore global failures
    } finally {
      // clear buildPromise after a short delay so other callers don't wait on stale promise
      setTimeout(() => { buildPromise = null; }, 50);
    }
    return map;
  })();

  return buildPromise;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dir = searchParams.get("dir") || "";
    const cacheKey = `images:${dir}`;
    const now = Date.now();
    const cachedResp = responseCache.get(cacheKey);
    if (IS_DEV) console.log(`[images] request for dir=${dir}`);
    if (cachedResp && cachedResp.expires > now) {
      if (IS_DEV) console.log(`[images] response-cache hit for dir=${dir}`);
      return NextResponse.json(cachedResp.payload);
    }
    const decoded = decodeURIComponent(dir || "").trim().replace(/^\/+|\/+$/g, "");
    const publicDir = path.join(process.cwd(), "public");

    // rebuild index if stale or not built
  if (IS_DEV) console.time?.(`images:index-build:${dir}`);
    if (!productsIndex || Date.now() - indexBuiltAt > INDEX_TTL_MS) {
      productsIndex = await buildIndex(publicDir);
      indexBuiltAt = Date.now();
    }
  if (IS_DEV) console.timeEnd?.(`images:index-build:${dir}`);

    // Prefer in-memory index lookup first (fast) before any filesystem stats
    if (decoded) {
      const basename = decoded.replace(/^(products|services)\//, "");
      const key = normalize(basename);
      if (productsIndex && productsIndex.has(key)) {
        const entry = productsIndex.get(key)!;
        const urls = entry.files.map((f) => {
          let p = `/${entry.folder}/${f}`;
          try {
            while (/%25/i.test(p)) p = decodeURIComponent(p);
          } catch (e) {
            // ignore
          }
          return encodeURI(p);
        });
        const payload = IS_DEV ? { images: urls, debug: { foundDir: entry.folder } } : { images: urls };
        try { responseCache.set(cacheKey, { expires: Date.now() + RESPONSE_TTL_MS, payload }); } catch (e) {}
        if (IS_DEV) console.log(`[images] index-lookup -> found ${entry.folder} for dir=${dir}`);
        return NextResponse.json(payload);
      }
    }

    // quick exact path handling as fallback: if dir corresponds to an actual directory under public, use it
    if (decoded) {
  if (IS_DEV) console.time?.(`images:fs-check:${dir}`);
      const candidatePath = path.join(publicDir, decoded);
      let stat = await fs.stat(candidatePath).catch(() => null);
      // tolerant fallback: if the exact decoded path doesn't exist, try to locate a matching
      // folder under `public/products` or `public/services` by normalized name. This handles
      // cases where the client sends a slug (hyphenated/lowercase) but the filesystem folder
      // contains spaces or different casing (e.g. "Solar Power Plant BOS Material").
      if (!stat) {
        try {
          const parts = decoded.split("/");
          const base = parts[0];
          const basename = parts.slice(1).join("/");
          if (base === "products" || base === "services") {
            const basePath = path.join(publicDir, base);
            const dirents = await fs.readdir(basePath, { withFileTypes: true }).catch(() => [] as any[]);
            const match = (dirents || []).find((d: any) => {
              if (!d || !d.isDirectory) return false;
              const name = d.name || "";
              return normalize(name) === normalize(basename) || normalize(name.replace(/\s+/g, "-")) === normalize(basename);
            });
            if (match && match.name) {
              const resolved = path.join(basePath, match.name);
              stat = await fs.stat(resolved).catch(() => null);
              if (stat && stat.isDirectory()) {
                // update candidatePath to the real folder found on disk
                (globalThis as any).__images_last_resolved = resolved;
                // proceed with resolved path below
              }
            }
          }
        } catch (e) {
          // ignore tolerant-fallback failures and continue
        }
      }
      if (stat && stat.isDirectory()) {
        // determine actual path to read: prefer the explicit candidatePath if it exists,
        // otherwise use the tolerant-resolved path stored above (if any)
        const actualPath = stat && stat.isDirectory() ? (stat ? (path.join(publicDir, decoded)) : null) : null;
        const folderToRead = (actualPath && (await fs.stat(actualPath).catch(() => null))) ? actualPath : ((globalThis as any).__images_last_resolved ? (globalThis as any).__images_last_resolved : null);
        const imgs = (await fs.readdir(folderToRead || candidatePath)).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f)).sort();
        if (imgs.length) {
          const folderName = path.relative(publicDir, folderToRead || candidatePath).replace(/\\/g, "/");
          const urls = imgs.map((f) => {
            // defensive: build URL from the real folder name found on disk and encode it
            let p = `/${folderName}/${f}`;
            try {
              while (/%25/i.test(p)) p = decodeURIComponent(p);
            } catch (e) {
              // ignore
            }
            return encodeURI(p);
          });
          const payload = IS_DEV ? { images: urls, debug: { foundDir: decoded } } : { images: urls };
          try { responseCache.set(cacheKey, { expires: Date.now() + RESPONSE_TTL_MS, payload }); } catch (e) {}
          if (IS_DEV) console.log(`[images] fs-direct -> found ${folderToRead || decoded} for dir=${dir}`);
          if (IS_DEV) console.timeEnd?.(`images:fs-check:${dir}`);
          return NextResponse.json(payload);
        }
      }
      if (IS_DEV) console.timeEnd?.(`images:fs-check:${dir}`);
    }

    // Fallback: scan index entries for folders that match the key when normalized.
    const basename = decoded.replace(/^(products|services)\//, "");
    const key = normalize(basename);
    if (productsIndex) {
      for (const [_k, entry] of productsIndex.entries()) {
        const folderNorm = normalize(entry.folder);
        if (folderNorm.includes(key) || normalize(entry.folder.replace(/\s+/g, "")).includes(key)) {
          const urls = entry.files.map((f) => {
            let p = `/${entry.folder}/${f}`;
            try {
              while (/%25/i.test(p)) p = decodeURIComponent(p);
            } catch (e) {
              // ignore
            }
            return encodeURI(p);
          });
          const payload = IS_DEV ? { images: urls, debug: { foundDir: entry.folder, fallback: true } } : { images: urls };
          try { responseCache.set(cacheKey, { expires: Date.now() + RESPONSE_TTL_MS, payload }); } catch (e) {}
          if (IS_DEV) console.log(`[images] fallback-scan -> matched ${entry.folder} for dir=${dir}`);
          return NextResponse.json(payload);
        }
      }
    }

    // not found — return helpful debug info in non-prod
    if (process.env.NODE_ENV !== "production") {
      const payload = { images: [], debug: { tried: decoded, indexed: Array.from(productsIndex ? productsIndex.keys() : []) } };
      try { responseCache.set(cacheKey, { expires: Date.now() + RESPONSE_TTL_MS, payload }); } catch (e) {}
      if (IS_DEV) console.log(`[images] not-found for dir=${dir}`);
      return NextResponse.json(payload);
    }
    const payload = { images: [] };
    try { responseCache.set(cacheKey, { expires: Date.now() + RESPONSE_TTL_MS, payload }); } catch (e) {}
    return NextResponse.json(payload);
  } catch (err) {
    const payload = { images: [] };
    // best-effort cache the empty response to avoid repeated failing work
    try { responseCache.set(`images:`, { expires: Date.now() + RESPONSE_TTL_MS, payload }); } catch (e) {}
    return NextResponse.json(payload);
  }
}
