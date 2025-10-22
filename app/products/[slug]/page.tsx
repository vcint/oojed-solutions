import data from '@/data/site.json';
import ProductModal from '@/components/ProductModal';
import React from 'react';

export async function generateStaticParams() {
  return data.categories.map((c: any) => ({ slug: String(c.slug || c.name).replace(/\s+/g, '-').toLowerCase() }));
}
export default function CategoryPage({ params }: any) {
  const slug = params?.slug;
  const cat = data.categories.find((c: any) => (c.slug || c.name).toLowerCase().replace(/\s+/g, '-') === slug);
  if (!cat) {
    return (
      <main className="section">
        <div className="container py-12">
          <h1 className="text-3xl font-bold">Category not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container py-12">
        <h1 className="text-3xl md:text-4xl font-bold">{cat.name}</h1>
        {cat.desc && <p className="muted mt-2">{cat.desc}</p>}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="card p-4">
            <h3 className="font-semibold">Highlights</h3>
            <ul className="mt-2 list-inside list-disc muted">
              {(cat.highlights || []).map((h: string) => <li key={h}>{h}</li>)}
            </ul>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold">Items</h3>
            <ul className="mt-2 list-inside list-disc muted">
              {(cat.items || []).map((it: string) => <li key={it}>{it}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
