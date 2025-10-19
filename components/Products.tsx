"use client";
import data from "@/data/site.json";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ProductModal from "./ProductModal";
import { FiBox as Product, FiSun as Solar, FiZap as Lightbulb } from "react-icons/fi";

export default function Products() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const imgs = ['/solar-water-heater.webp','/2.webp','/solar-water-pump.webp', '/solar-street-light.webp','/poles.webp','/spare-parts.jpeg','/spare-2.jpeg','/spare-3.jpeg'];
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    // fetch preview image for each category (non-blocking)
    data.categories.forEach(async (cat: any) => {
      const slug = (cat && cat.slug) ? `products/${String(cat.slug).replace(/^\/+|\/+$/g, "")}` : `products/${String(cat.name).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase()}`;
      try {
        const res = await fetch(`/api/images?dir=${encodeURIComponent(slug)}`);
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json.images) && json.images.length > 0) {
          setPreviews((p) => ({ ...p, [cat.name]: json.images[0] }));
        }
      } catch (e) {
        // ignore
      }
    });
  }, []);
  const openProduct = async (cat: any, i: number) => {
    const start = i % imgs.length;
    const fallback = (Array.isArray((cat as any).images) && (cat as any).images.length > 0)
      ? (cat as any).images
      : [imgs[start], imgs[(start + 1) % imgs.length], imgs[(start + 2) % imgs.length]];

  const slugFromName = `products/${cat.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase()}`;
  const slug = (cat && cat.slug) ? `products/${String(cat.slug).replace(/^\/+|\/+$/g, "")}` : slugFromName;
    try {
      const res = await fetch(`/api/images?dir=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const json = await res.json();
        const images = Array.isArray(json.images) && json.images.length > 0 ? json.images : fallback;
        if (json.debug) console.debug("/api/images debug:", json.debug);
        if ((!json.images || json.images.length === 0) && (json.debug || []).length) {
          console.debug("/api/images returned no images; debug info:", json.debug || json);
        }
        setSelected({ ...cat, images, image: images[0] });
      } else {
        setSelected({ ...cat, images: fallback, image: fallback[0] });
      }
    } catch (e) {
      setSelected({ ...cat, images: fallback, image: fallback[0] });
    }
    setOpen(true);
  };
  return (
    <section id="products" className="section">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold">Products</h2>
  {/* <p className="text-slate-600 mt-2">Solar, LED lighting, pumps and poles & masts.</p> */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {data.categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: .5, delay: i * .05 }}
              viewport={{ once: true }}
              className="card p-0 overflow-hidden hover-raise"
            >
              <div className="w-full h-40 relative cursor-pointer" onClick={() => openProduct(cat, i)}>
                {/** Use category-specific preview image when available */}
                <img
                  src={(Array.isArray((cat as any).images) && (cat as any).images.length > 0)
                    ? (cat as any).images[0]
                    : (previews[cat.name] ? previews[cat.name] : imgs[i % imgs.length])}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute left-4 bottom-4 text-white flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-md">
                    {i % 3 === 0 ? <Solar className="w-5 h-5 text-white" /> : i % 3 === 1 ? <Lightbulb className="w-5 h-5 text-white" /> : <Product className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{cat.name}</div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                {/* quick look: one-line summary */}
                {cat.desc && <p className="text-slate-600 line-clamp-2 font-semibold">{cat.desc}</p>}
                {/* small tags: show up to 2 representative items */}
                {cat.items && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cat.items.slice(0,2).map((it: string) => (
                      <span key={it} className="badge text-xs">{it}</span>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <button onClick={() => openProduct(cat, i)} className="btn-outline">Learn more</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <ProductModal open={open} onClose={() => setOpen(false)} product={selected} />
    </section>
  );
}
