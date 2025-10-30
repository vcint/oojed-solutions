export default function TrustBar() {
  const items = [
    { label: 'Since 2014', desc: 'Proven field experience' },
    { label: 'BIS/ISO Components', desc: 'Quality-checked materials' },
    { label: 'Warranty Support', desc: 'Clear SLAs and coverage' },
    { label: 'Local Service Teams', desc: 'Fast on-site response' },
  ];
  return (
    <section aria-label="Why trust OOJED" className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-md border p-4 bg-white/50">
            <div className="font-semibold text-slate-900">{it.label}</div>
            <div className="text-sm text-slate-600">{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

