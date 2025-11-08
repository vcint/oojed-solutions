import Services from '@/components/Services';

export const metadata = {
  title: 'Services - OOJED Solutions',
  description: 'Services: installation, maintenance and support for solar systems, LED lighting and pumps.',
  alternates: { canonical: 'https://oojed.com/services' },
};

export default function ServicesPage() {
  return (
    <main className="pt-28 pb-16 md:pt-36">
      <Services />
    </main>
  );
}
