// Nav is provided by the RootLayout
import HeroCarousel from "@/components/HeroCarousel";
import HomeLocalizer from '@/components/HomeLocalizer';
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
          "name": "OOJED",
          "url": "https://oojed.com",
          "logo": "https://oojed.com/oojed-logo.png",
          "contactPoint": [{
            "@type": "ContactPoint",
            "telephone": data.contacts.phones?.[0],
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
          <HomeLocalizer hero={data.hero} />
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
