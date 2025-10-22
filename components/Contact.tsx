"use client";
import React, { useState } from "react";
import data from "@/data/site.json";
import Toast from "@/components/Toast";
import { FiPhone as Phone, FiMail as Email, FiMapPin as Location } from "react-icons/fi";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "" });
  const nameRef = React.useRef<HTMLInputElement | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setToast({ open: true, message: "Please provide name and email." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.status === 200) {
        setToast({ open: true, message: 'Enquiry sent — we will contact you shortly.' });
        setForm({ name: '', email: '', phone: '', message: '' });
      } else if (res.status === 501) {
        // server not configured for SMTP — fallback to mailto
        const subject = encodeURIComponent(`Website enquiry from ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`);
        const mailto = `mailto:${data.contacts.email}?subject=${subject}&body=${body}`;
        window.location.href = mailto;
        setToast({ open: true, message: 'Mail client opened as fallback. Thanks!' });
      } else {
        const json = await res.json().catch(() => ({}));
        setToast({ open: true, message: json.error || 'Failed to send. Please try mailto fallback.' });
      }
    } catch (err) {
      // network or unexpected error — fallback to mailto
      const subject = encodeURIComponent(`Website enquiry from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`);
      const mailto = `mailto:${data.contacts.email}?subject=${subject}&body=${body}`;
      window.location.href = mailto;
      setToast({ open: true, message: 'Network error — opened mail client as fallback.' });
    } finally {
      setLoading(false);
    }
  };

  // Listen for an event so other components (modals/buttons) can open the contact form
  React.useEffect(() => {
    const handler = () => {
      try {
        const el = document.getElementById('contact');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // focus the name input after a short delay so scroll has settled
          setTimeout(() => nameRef.current?.focus(), 300);
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('openContactForm', handler as EventListener);
    // on mount: if URL hash is #contact or sessionStorage flag present, open and focus
    try {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const flag = typeof window !== 'undefined' ? sessionStorage.getItem('openContactForm') : null;
      if (hash === '#contact' || flag === '1') {
        // remove the flag so it doesn't persist
        try { sessionStorage.removeItem('openContactForm'); } catch (e) { /* ignore */ }
        handler();
      }
    } catch (e) {
      // ignore
    }

    return () => window.removeEventListener('openContactForm', handler as EventListener);
  }, []);

  return (
    <section id="contact" className="section bg-white">
      <div className="container grid lg:grid-cols-2 gap-8 items-start">
  <div className="card p-8 bg-white dark:bg-slate-900 contact-card">
          <h3 className="text-2xl font-semibold">Get in touch</h3>
          <p className="text-slate-600 mt-2">Tell us about your requirement and we'll respond with a tailored solution and quote.</p>
          <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-slate-700 dark:text-slate-300 mb-1">Full name</span>
              <input
                ref={nameRef}
                name="name"
                value={form.name}
                onChange={onChange}
                className="w-full rounded-md border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 p-3 dark:bg-slate-800 dark:border-white/10 dark:text-white dark:placeholder:text-slate-400"
                placeholder="Your name"
                required
              />
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-slate-700 dark:text-slate-300 mb-1">Email</span>
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  type="email"
                  className="w-full rounded-md border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 p-3 dark:bg-slate-800 dark:border-white/10 dark:text-white dark:placeholder:text-slate-400"
                  placeholder="email@company.com"
                  required
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-slate-700 dark:text-slate-300 mb-1">Phone</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="w-full rounded-md border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 p-3 dark:bg-slate-800 dark:border-white/10 dark:text-white dark:placeholder:text-slate-400"
                  placeholder="Phone number"
                />
              </label>
            </div>
            <label className="flex flex-col">
              <span className="text-sm text-slate-700 dark:text-slate-300 mb-1">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                className="w-full rounded-md border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 p-3 h-40 dark:bg-slate-800 dark:border-white/10 dark:text-white dark:placeholder:text-slate-400"
                placeholder="Tell us about your project"
              />
            </label>
            <div className="flex items-center gap-4">
              <button type="submit" className="btn-submit inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#102a6d] to-[#0b4bd6] text-white font-semibold shadow-md px-5 py-2.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 md:px-6 md:py-3" disabled={loading}>{loading ? 'Sending...' : 'Send enquiry'}</button>
              <button type="button" className="btn-reset inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#102a6d] border-2 border-[#102a6d] font-semibold shadow-sm px-4 py-2 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 dark:bg-transparent dark:text-white dark:border-white/20" onClick={() => { setForm({ name: '', email: '', phone: '', message: '' }); setToast({ open: true, message: 'Form cleared' }); }}>Reset</button>
            </div>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="card p-6 flex items-start gap-4">
            <div className="text-blue-700"><Email className="w-6 h-6" /></div>
            <div>
              <div className="font-semibold">Email</div>
              <a href={`mailto:${data.contacts.email}`} className="text-slate-700">{data.contacts.email}</a>
            </div>
          </div>
          <div className="card p-6 flex items-start gap-4">
            <div className="text-blue-700"><Phone className="w-6 h-6" /></div>
            <div>
              <div className="font-semibold">Phone</div>
              <div className="text-slate-700">
                {data.contacts.phones.map((p: string, i: number) => (
                  <span key={p}>
                    <a href={`tel:${p.replace(/[^+0-9]/g, '')}`} className="text-slate-700" aria-label={`Call ${p}`}>{p}</a>
                    {i < data.contacts.phones.length - 1 ? ' | ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="card p-6 flex items-start gap-4">
            <div className="text-blue-700"><Location className="w-6 h-6" /></div>
            <div>
              <div className="font-semibold">Pune Office</div>
              <div className="text-slate-700">{data.contacts.puneOffice}</div>
            </div>
          </div>
          {/* <div className="card p-6 flex items-start gap-4">
            <div className="text-blue-700"><Location className="w-6 h-6" /></div>
            <div>
              <div className="font-semibold">Factory</div>
              <div className="text-slate-700">{data.contacts.factory}</div>
            </div>
          </div> */}
        </aside>
      </div>
      <Toast message={toast.message} open={toast.open} onClose={() => setToast({ open: false, message: '' })} />
    </section>
  );
}
