"use client";
import React, { useState } from "react";
import data from "@/data/site.json";
import Toast from "@/components/Toast";
import { FiPhone as Phone, FiMail as Email, FiMapPin as Location, FiClock, FiMessageCircle } from "react-icons/fi";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "" });
  const nameRef = React.useRef<HTMLInputElement | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setToast({ open: true, message: "Please provide name and email." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 200) {
        setToast({ open: true, message: "Enquiry sent — we will contact you shortly." });
        setForm({ name: "", email: "", phone: "", message: "" });
      } else if (res.status === 501) {
        const subject = encodeURIComponent(`Website enquiry from ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`);
        window.location.href = `mailto:${data.contacts.email}?subject=${subject}&body=${body}`;
        setToast({ open: true, message: "Mail client opened as fallback. Thanks!" });
      } else {
        const json = await res.json().catch(() => ({}));
        setToast({ open: true, message: json.error || "Failed to send. Please try mailto fallback." });
      }
    } catch (err) {
      const subject = encodeURIComponent(`Website enquiry from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`);
      window.location.href = `mailto:${data.contacts.email}?subject=${subject}&body=${body}`;
      setToast({ open: true, message: "Network error — opened mail client as fallback." });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const handler = () => {
      try {
        const el = document.getElementById("contact");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => nameRef.current?.focus(), 300);
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener("openContactForm", handler as EventListener);
    try {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const flag = typeof window !== "undefined" ? sessionStorage.getItem("openContactForm") : null;
      if (hash === "#contact" || flag === "1") {
        try {
          sessionStorage.removeItem("openContactForm");
        } catch (e) {
          /* ignore */
        }
        handler();
      }
    } catch (e) {
      // ignore
    }
    return () => window.removeEventListener("openContactForm", handler as EventListener);
  }, []);

  return (
    <section id="contact" className="section bg-slate-50 dark:bg-slate-900">
      <div className="container">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#102a6d]/10 text-[#102a6d] dark:bg-[#102a6d]/20 dark:text-[#9cc0ff] px-4 py-1 text-xs font-semibold uppercase tracking-widest">
              <FiMessageCircle className="w-3.5 h-3.5" />
              Talk to OOJED
            </span>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Let’s plan your solar or lighting project</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                Share your requirement and our pre-sales engineers will respond within one business day with next steps, documentation checklist and an optional discovery call.
              </p>
            </div>
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <Email className="w-5 h-5 text-[#102a6d] dark:text-[#9cc0ff] mt-1" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Email</div>
                  <a href={`mailto:${data.contacts.email}`} className="text-slate-600 dark:text-slate-300 hover:text-[#102a6d] dark:hover:text-[#9cc0ff]">
                    {data.contacts.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#102a6d] dark:text-[#9cc0ff] mt-1" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Phone</div>
                  <div className="text-slate-600 dark:text-slate-300">{data.contacts.phones.join(" / ")}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Location className="w-5 h-5 text-[#102a6d] dark:text-[#9cc0ff] mt-1" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Pune office</div>
                  <div className="text-slate-600 dark:text-slate-300">{data.contacts.puneOffice}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiClock className="w-5 h-5 text-[#102a6d] dark:text-[#9cc0ff] mt-1" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Response window</div>
                  <div className="text-slate-600 dark:text-slate-300">Weekdays 9 AM – 7 PM IST (24/7 emergency line for AMC customers)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-8 sm:p-10">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Send us a message</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Include location, timelines and any drawings/photos if available. We’ll respond with a tailored plan and suggested next steps.
              </p>
              <form onSubmit={submit} className="mt-8 grid grid-cols-1 gap-4">
                <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Full name *</span>
                  <input
                    ref={nameRef}
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#102a6d]/50 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Email *</span>
                    <input
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      type="email"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#102a6d]/50 focus:border-transparent"
                      placeholder="email@company.com"
                      required
                    />
                  </label>
                  <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Phone</span>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#102a6d]/50 focus:border-transparent"
                      placeholder="Optional contact number"
                    />
                  </label>
                </div>
                <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Project overview</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 h-40 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#102a6d]/50 focus:border-transparent resize-none"
                    placeholder="Tell us about your hot water, rooftop solar, lighting or pumping requirement…"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#102a6d] text-white font-semibold px-6 py-2.5 shadow hover:bg-[#0c3a99] focus:outline-none focus:ring-4 focus:ring-blue-200"
                    disabled={loading}
                  >
                    {loading ? "Sending…" : "Send enquiry"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => {
                      setForm({ name: "", email: "", phone: "", message: "" });
                      setToast({ open: true, message: "Form cleared" });
                    }}
                  >
                    Clear
                  </button>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We typically respond within 24 hours. For urgent support call {data.contacts.phones[0]}.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toast.message} open={toast.open} onClose={() => setToast({ open: false, message: "" })} />
    </section>
  );
}
