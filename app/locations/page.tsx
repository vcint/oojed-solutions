import site from '@/data/site.json';
import Link from 'next/link';

export const metadata = {
  title: 'Service Areas - OOJED',
  description: 'Service areas focused on Pune, Pimpri Chinchwad, Lonavala and nearby localities for solar water heaters, pumps, LED lighting, and installation/AMC services.',
  alternates: { canonical: 'https://oojed.com/locations' },
};

export default function LocationsIndex() {
  const cities: string[] = Array.isArray((site as any).cities) ? (site as any).cities : [];
  const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');
  
  // Define primary cities that get featured
  const primaryCities = ['Pune', 'Pimpri Chinchwad', 'Lonavala'];
  const nearbyAreas = cities.filter(c => !primaryCities.includes(c));
  
  // Description for primary cities
  const primaryDescriptions: Record<string, string> = {
    'Pune': 'Solar water heaters (ETC/FPC), rooftop solar plants, solar pumps & LED lighting. Fast survey, transparent pricing.',
    'Pimpri Chinchwad': 'Industrial solar EPC, solar pumps for agriculture, street LED projects & AMC across PCMC.',
    'Lonavala': 'Resort & holiday home solar solutions, monsoon-resistant installations, hill-station expertise.',
  };

  return (
    <main className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Solar Solutions in Pune, Pimpri-Chinchwad & Lonavala</h1>
      <p className="mt-4 max-w-3xl text-slate-700 dark:text-slate-300 leading-relaxed">
        OOJED specializes in solar water heaters, rooftop solar power plants, solar water pumps and LED street lighting across Pune metropolitan area and Lonavala. 
        With 11+ years of local expertise, we deliver professional site surveys, design, installation, commissioning and annual maintenance contracts (AMC) for residential, 
        commercial and industrial projects.
      </p>

      {/* Featured Cities Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Primary Service Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {primaryCities.map((city) => (
            <Link 
              key={city}
              href={`/locations/${toSlug(city)}`} 
              className="group block rounded-lg border-2 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-white dark:from-[#102a6d]/30 dark:to-[#0b1729] p-6 hover:shadow-lg hover:border-blue-500 transition-all"
            >
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition">
                {city}
              </h3>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {primaryDescriptions[city]}
              </p>
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:translate-x-1 transition">
                View details →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby Areas Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Nearby Areas & Neighborhoods</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-6">
          We also serve these neighborhoods and surrounding towns with the same professional service:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {nearbyAreas.map((c) => (
            <li key={c}>
              <Link 
                href={`/locations/${toSlug(c)}`} 
                className="block rounded-md border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/20 transition"
              >
                <span className="font-semibold text-slate-900 dark:text-white">{c}</span>
                <span className="block text-xs text-slate-600 dark:text-slate-400 mt-1">Solar water heaters • Pumps • LED lighting • AMC</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Trust & Coverage Info */}
      <section className="mt-12 rounded-lg border border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-[#102a6d]/20 dark:to-[#0b1729]/20 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Why Expand to These Cities?</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>✓ <strong>Local teams</strong> handle surveys, installation and emergency support across all neighborhoods</li>
          <li>✓ <strong>Same-day surveys</strong> available in core Pune areas; 24-48 hour response for outlying towns</li>
          <li>✓ <strong>Climate expertise:</strong> We size systems for Pune's hard water, Pimpri's industrial density, and Lonavala's monsoon patterns</li>
          <li>✓ <strong>Active AMC:</strong> Quarterly maintenance, emergency repair callouts, and spare parts stocked locally</li>
          <li>✓ <strong>Subsidy support:</strong> We assist with Maharashtra state solar incentives and net-metering approvals</li>
        </ul>
      </section>
    </main>
  );
}

