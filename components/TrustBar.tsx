export default function TrustBar() {
  const items = [
    { label: 'Since 2014', desc: 'Proven field experience' },
    { label: 'BIS/ISO Components', desc: 'Quality-checked materials' },
    { label: 'Warranty Support', desc: 'Clear SLAs and coverage' },
    { label: 'Local Service Teams', desc: 'Fast on-site response' },
  ];
  return (
    <section aria-label="Why trust OOJED" className="mt-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="glass-panel p-5 shadow-none dark:bg-white/5 dark:border-white/15">
            <div className="font-semibold text-slate-900 dark:text-white">{it.label}</div>
            <div className="text-sm text-slate-600 dark:text-slate-200">{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
