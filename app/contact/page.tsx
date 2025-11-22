import data from '@/data/site.json';
import Contact from '@/components/Contact';

export const metadata = {
  title: 'Contact - OOJED',
  description: data.contacts ? `Contact OOJED - ${data.contacts.email}` : 'Contact OOJED',
  alternates: { canonical: 'https://oojed.com/contact' },
};

export default function ContactPage() {
  return (
    <main className="container py-12 pt-28 md:pt-32">
      <h1 className="text-3xl font-bold text-foreground">Contact</h1>
      <div className="mt-6 max-w-4xl text-foreground">
        <p>For sales and service enquiries, tell us about your requirement and we'll respond with a tailored solution.</p>
      </div>

      {/* Render the interactive contact form (client component) */}
      <div className="mt-8">
        <Contact />
      </div>
    </main>
  );
}
