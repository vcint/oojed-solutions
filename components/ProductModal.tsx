"use client";
import { Fragment } from "react";

export default function ProductModal({ open, onClose, product }: { open: boolean; onClose: () => void; product: any | null }) {
  if (!open || !product) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full z-10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">{product.name}</h3>
            {product.desc && <p className="mt-2 text-sm text-slate-600">{product.desc}</p>}
          </div>
          <button className="text-slate-500" onClick={onClose}>Close</button>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <img src={product.image || '/product-1.svg'} alt={product.name} className="w-full h-56 object-cover rounded-md" />
          </div>
          <div>
            {product.items && (
              <div>
                <div className="font-medium">Items</div>
                <ul className="list-disc list-inside mt-2 text-sm text-slate-700">
                  {product.items.map((it: string) => <li key={it}>{it}</li>)}
                </ul>
              </div>
            )}
            {product.highlights && (
              <div className="mt-4">
                <div className="font-medium">Highlights</div>
                <ul className="list-disc list-inside mt-2 text-sm text-slate-700">
                  {product.highlights.map((h: string) => <li key={h}>{h}</li>)}
                </ul>
              </div>
            )}
            {/* technical specs */}
            {product.specs && (
              <div className="mt-4">
                <div className="font-medium">Technical Specs</div>
                <ul className="list-disc list-inside mt-2 text-sm text-slate-700">
                  {product.specs.map((s: string) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            )}
            <div className="mt-6">
              <a href="#contact" className="btn-primary">Request a Quote / Enquiry</a>
            </div>
            {/* JSON-LD for Product */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name,
              description: product.desc || '',
              image: product.image ? (typeof window !== 'undefined' ? window.location.origin + product.image : product.image) : undefined,
              additionalProperty: (product.highlights || []).map((h: string) => ({ '@type': 'PropertyValue', name: 'highlight', value: h })),
            }) }} />
          </div>
        </div>
      </div>
    </div>
  );
}
