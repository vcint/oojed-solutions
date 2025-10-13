"use client";
import data from "@/data/site.json";
import { useState } from "react";
import Toast from "@/components/Toast";
import { FiPhone as Phone, FiMail as Email, FiMapPin as Location } from "react-icons/fi";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "" });

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

  return (
    <section id="contact" className="section bg-white">
      <div className="container grid lg:grid-cols-2 gap-8 items-start">
        <div className="card p-8">
          <h3 className="text-2xl font-semibold">Get in touch</h3>
          <p className="text-slate-600 mt-2">Tell us about your requirement and we'll respond with a tailored solution and quote.</p>
          <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-slate-700 mb-1">Full name</span>
              <input name="name" value={form.name} onChange={onChange} className="w-full rounded-md border border-slate-200 p-3" placeholder="Your name" required />
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-slate-700 mb-1">Email</span>
                <input name="email" value={form.email} onChange={onChange} type="email" className="w-full rounded-md border border-slate-200 p-3" placeholder="email@company.com" required />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-slate-700 mb-1">Phone</span>
                <input name="phone" value={form.phone} onChange={onChange} className="w-full rounded-md border border-slate-200 p-3" placeholder="Phone number" />
              </label>
            </div>
            <label className="flex flex-col">
              <span className="text-sm text-slate-700 mb-1">Message</span>
              <textarea name="message" value={form.message} onChange={onChange} className="w-full rounded-md border border-slate-200 p-3 h-40" placeholder="Tell us about your project" />
            </label>
            <div className="flex items-center gap-4">
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send enquiry'}</button>
              <button type="button" className="btn-outline" onClick={() => { setForm({ name: '', email: '', phone: '', message: '' }); setToast({ open: true, message: 'Form cleared' }); }}>Reset</button>
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
