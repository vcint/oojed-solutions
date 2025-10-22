"use client";
import data from "@/data/site.json";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ProductModal from "./ProductModal";
import { FiTool as Tool, FiMapPin as Feas, FiRefreshCw as Repair, FiClock as AMC } from "react-icons/fi";

export default function Services() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const normalizeSrc = (raw?: string) => {
    if (!raw) return '';
    try {
      // decode any percent-encoded input (handles %20 and %2520 cases), then encode once
      const decoded = decodeURIComponent(String(raw));
      const enc = encodeURI(decoded);
      return enc.startsWith('/') ? enc : `/${enc}`;
    } catch (e) {
      try {
        const s = String(raw);
        const enc = encodeURI(s);
        return enc.startsWith('/') ? enc : `/${enc}`;
      } catch (err) {
        return String(raw || '');
      }
    }
  };

  const services = Array.isArray((data as any).services) && (data as any).services.length > 0
    ? (data as any).services
    : [
      { name: 'Installation', slug: 'installation', short: 'On-site professional installation and commissioning' },
      { name: 'Feasibility', slug: 'feasibility', short: 'Site surveys, yield estimates and feasibility reports' },
      { name: 'Repair & Service', slug: 'repair', short: 'Corrective repairs and spare parts supply' },
      { name: 'Annual Maintenance (AMC)', slug: 'amc', short: 'Preventive maintenance and service contracts' },
    ];

  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    services.forEach(async (s) => {
      const slug = `services/${s.slug}`;
      try {
        const res = await fetch(`/api/images?dir=${encodeURIComponent(slug)}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json && json.debug) console.debug(`/api/images for ${slug}:`, json.debug);
        if (Array.isArray(json.images) && json.images.length > 0) {
          setPreviews((p) => ({ ...p, [s.name]: normalizeSrc(json.images[0]) }));
        }
      } catch (e) {
        // ignore
      }
    });
  }, []);

  const openService = async (svc: any, i: number) => {
    const slug = `services/${svc.slug}`;
    const fallback = [ '/oojed-logo.png' ];
    try {
      const res = await fetch(`/api/images?dir=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const json = await res.json();
        const rawImages = Array.isArray(json.images) && json.images.length > 0 ? json.images : fallback;
        const images = rawImages.map((r: string) => normalizeSrc(r));
        setSelected({ ...svc, images, image: images[0] });
      } else {
        setSelected({ ...svc, images: fallback, image: fallback[0] });
      }
    } catch (e) {
      setSelected({ ...svc, images: fallback, image: fallback[0] });
    }
    setOpen(true);
  };

  return (
    <section id="services" className="section">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold">Services</h2>
        <p className="muted mt-2">Installation, feasibility, repair, AMC and support — tailored to your site.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {services.map((svc, i) => (
            <motion.div key={svc.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: i * .05 }} className="card p-0 overflow-hidden hover-raise">
              <div className="w-full h-40 relative cursor-pointer" onClick={() => openService(svc, i)}>
                {/* use API-provided preview when available; otherwise try numbered fallback (1.jpg) then logo */}
                <img src={normalizeSrc(previews[svc.name] || `/services/${svc.slug}/1.jpg`)} alt={svc.name} onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/oojed-logo.png'; }} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent product-overlay" />
                <div className="absolute left-4 bottom-4 text-white flex items-center gap-3">
                  <div className="icon-bg p-2 rounded-md">
                    {svc.slug === 'installation' ? <Tool className="w-5 h-5 text-white" /> : svc.slug === 'feasibility' ? <Feas className="w-5 h-5 text-white" /> : svc.slug === 'repair' ? <Repair className="w-5 h-5 text-white" /> : <AMC className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{svc.name}</div>
                    <div className="text-sm">{(svc.short || svc.desc)}</div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                {/* show richer description when available (truncate for card) */}
                <p className="muted line-clamp-3 text-sm font-medium">{(() => {
                    const text = svc.long || svc.short || svc.desc || '';
                    const max = 160;
                    return text.length > max ? text.slice(0, max).trim() + '…' : text;
                  })()}</p>
                <div className="mt-4 relative z-20">
                  <button onClick={() => openService(svc, i)} className="learn-more-btn w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#102a6d] border-2 border-[#102a6d] font-semibold shadow-sm px-4 py-2 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 dark:bg-transparent dark:text-white dark:border-white/20">Learn more</button>
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
