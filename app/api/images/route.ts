import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type IndexEntry = { folder: string; files: string[] };

// Simple in-memory index with TTL to avoid heavy fs operations on each request.
let productsIndex: Map<string, IndexEntry> | null = null;
let indexBuiltAt = 0;
const INDEX_TTL_MS = 30 * 1000; // 30s in development; keeps index fresh but fast

const normalize = (s: string) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

async function buildIndex(publicDir: string) {
  const map = new Map<string, IndexEntry>();
  try {
    const productsDir = path.join(publicDir, "products");
    const exists = await fs.stat(productsDir).then(() => true).catch(() => false);
    if (!exists) return map;
    const entries = await fs.readdir(productsDir);
    for (const entry of entries) {
      const full = path.join(productsDir, entry);
      try {
        const st = await fs.stat(full);
        if (!st.isDirectory()) continue;
        const imgs = (await fs.readdir(full)).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f)).sort();
        if (!imgs.length) continue;
        const key = normalize(entry);
        map.set(key, { folder: `products/${entry}`, files: imgs });
        // also map the raw folder name and a slugified variant
        map.set(normalize(entry.replace(/\s+/g, "-")), { folder: `products/${entry}`, files: imgs });
        map.set(normalize(entry.replace(/\s+/g, "_")), { folder: `products/${entry}`, files: imgs });
      } catch (e) {
        // ignore per-entry failures
      }
    }
  } catch (e) {
    // ignore
  }
  return map;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dir = searchParams.get("dir") || "";
    const decoded = decodeURIComponent(dir || "").trim().replace(/^\/+|\/+$/g, "");
    const publicDir = path.join(process.cwd(), "public");

    // rebuild index if stale or not built
    if (!productsIndex || Date.now() - indexBuiltAt > INDEX_TTL_MS) {
      productsIndex = await buildIndex(publicDir);
      indexBuiltAt = Date.now();
    }

    // quick exact path handling: if dir corresponds to an actual directory under public, use it
    if (decoded) {
      const candidatePath = path.join(publicDir, decoded);
      const stat = await fs.stat(candidatePath).catch(() => null);
      if (stat && stat.isDirectory()) {
        const imgs = (await fs.readdir(candidatePath)).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f)).sort();
        if (imgs.length) {
          const urls = imgs.map((f) => {
            // defensive: decode repeated %25 entries then encode once
            let p = `/${decoded}/${f}`;
            try {
              while (/%25/i.test(p)) p = decodeURIComponent(p);
            } catch (e) {
              // ignore
            }
            return encodeURI(p);
          });
          if (process.env.NODE_ENV !== "production") return NextResponse.json({ images: urls, debug: { foundDir: decoded } });
          return NextResponse.json({ images: urls });
        }
      }
    }

    // lookup in index by normalized name
    const basename = decoded.replace(/^products\//, "");
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
      if (process.env.NODE_ENV !== "production") return NextResponse.json({ images: urls, debug: { foundDir: entry.folder } });
      return NextResponse.json({ images: urls });
    }

    // not found — return helpful debug info in non-prod
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ images: [], debug: { tried: decoded, indexed: Array.from(productsIndex ? productsIndex.keys() : []) } });
    }
    return NextResponse.json({ images: [] });
  } catch (err) {
    return NextResponse.json({ images: [] });
  }
}
