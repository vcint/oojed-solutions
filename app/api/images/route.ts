import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function isSafeSlug(s: string) {
  return /^[a-z0-9-_/]+$/.test(s);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dir = searchParams.get("dir") || "";
    // decode and prepare candidates (accept spaces/dashes/underscores)
    const decoded = decodeURIComponent(dir || "");
    const cleaned = decoded.trim().replace(/^\/+|\/+$/g, "");
    const publicDir = path.join(process.cwd(), "public");

    // helper to normalize names for fuzzy matching
    const normalize = (s: string) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

    const baseCandidates = new Set<string>();
    if (cleaned) baseCandidates.add(cleaned);
    // replace spaces with dashes/underscores and vice-versa
    baseCandidates.add(cleaned.replace(/\s+/g, "-"));
    baseCandidates.add(cleaned.replace(/\s+/g, "_"));
    baseCandidates.add(cleaned.replace(/-/g, " "));
    baseCandidates.add(cleaned.replace(/_/g, " "));
    // ensure prefix forms
    const addWithProducts = (s: string) => baseCandidates.add(s.startsWith("products/") ? s : `products/${s}`);
    Array.from(baseCandidates).forEach(addWithProducts);

    const candidates = Array.from(baseCandidates);
    let foundDir: string | null = null;
    let files: string[] = [];

    for (const candidate of candidates) {
      const target = path.join(publicDir, candidate);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
        const imgs = fs.readdirSync(target).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f)).sort();
        if (imgs.length) {
          foundDir = candidate;
          files = imgs;
          break;
        }
      }

      // fuzzy-match inside public/products if candidate is a basename
      try {
        const productsDir = path.join(publicDir, "products");
        if (fs.existsSync(productsDir) && fs.statSync(productsDir).isDirectory()) {
          const entries = fs.readdirSync(productsDir).filter((n) => fs.statSync(path.join(productsDir, n)).isDirectory());
          const targetNorm = normalize(candidate.replace(/^products\//, ""));
          const found = entries.find((e) => normalize(e) === targetNorm);
          if (found) {
            const imgs = fs.readdirSync(path.join(productsDir, found)).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f)).sort();
            if (imgs.length) {
              foundDir = `products/${found}`;
              files = imgs;
              break;
            }
          }
        }
      } catch (e) {
        /* ignore */
      }
    }

    if (!foundDir) {
      // helpful debug in development
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({ images: [], debug: { tried: candidates } });
      }
      return NextResponse.json({ images: [] });
    }

    const urls = files.map((f) => `/${foundDir}/${f}`);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ images: urls, debug: { foundDir, tried: candidates } });
    }
    return NextResponse.json({ images: urls });
  } catch (err) {
    return NextResponse.json({ images: [] });
  }
}
