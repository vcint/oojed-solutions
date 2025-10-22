// Nav is provided by the RootLayout
import HeroCarousel from "@/components/HeroCarousel";
import Products from "@/components/Products";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
// Footer is provided by the RootLayout
import data from "@/data/site.json";

export default function HomePage() {
  return (
    <>
      {/* SEO: Organization JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Oojed Solutions",
          "url": "https://example.com",
          "logo": "https://example.com/logo.png",
          "contactPoint": [{
            "@type": "ContactPoint",
            "telephone": data.contacts.phones[0],
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["English"]
          }],
          "sameAs": []
        })}
      </script>
      
      <main>
        <section id="home" className="relative min-h-screen flex items-center">
          <HeroCarousel />
          <div className="container relative z-10 text-center py-24">
            {/* <span className="badge text-white bg-white/10">Since 2014</span> */}
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-white">{data.hero.headline}</h1>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M12 2v2" /><path d="M12 20v2" /></svg>
              <span>{data.hero.sub}</span>
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <a href={data.hero.ctaPrimary.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#102a6d] to-[#0b4bd6] text-white font-semibold shadow-md px-5 py-2.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 md:px-6 md:py-3">{data.hero.ctaPrimary.label}</a>
              <a href={data.hero.ctaSecondary.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#102a6d] border-2 border-[#102a6d] font-semibold shadow-sm px-5 py-2.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 md:px-6 md:py-3 dark:bg-transparent dark:text-white dark:border-white/20">{data.hero.ctaSecondary.label}</a>
            </div>
          </div>
        </section>
         <section id="about" className="section">
          <div className="container">
            <div className="prose max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold">About OOJED</h2>
              <p className="text-slate-700 mt-2">{data.about}</p>
              <p className="text-slate-600 mt-4">Our core strengths include:</p>
              <ul className="list-disc ml-6 text-slate-700 mt-2">
                {data.values.map((v) => (
                  <li key={v} className="font-semibold">{v}</li>
                ))}
              </ul>
              <p className="text-slate-600 mt-4">We design and manufacture to meet BIS standards where applicable, and provide end-to-end project support from site survey through commissioning and after-sales service.</p>
            </div>
            
          </div>
        </section>
        <Products />
        <Benefits />
        <Contact />
      </main>
  {/* contact-badge is loaded globally by RootLayout */}
      {/* @ts-expect-error - custom element
      <contact-badge email={data.contacts.email} phone={data.contacts.phones[0]} /> */}
    </>
  );
}
