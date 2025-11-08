"use client";
import React, { useState } from "react";
import data from "@/data/site.json";
import Toast from "@/components/Toast";
import { FiPhone, FiMail, FiMapPin, FiClock, FiMessageCircle, FiArrowRightCircle } from "react-icons/fi";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "" });
  const nameRef = React.useRef<HTMLInputElement | null>(null);

  const responsePromises = [
    "Energy audit review and ROI model shared within one business day.",
    "Segment-specific proposal deck modelled on top-tier homeowner journeys.",
    "OEM pricing with milestone-linked payment schedule and AMC options.",
  ];

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
        setToast({ open: true, message: "Enquiry sent - we will contact you shortly." });
        setForm({ name: "", email: "", phone: "", city: "", message: "" });
      } else if (res.status === 501) {
        const subject = encodeURIComponent(`Website enquiry from ${form.name}`);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCity: ${form.city}\n\n${form.message}`);
        window.location.href = `mailto:${data.contacts.email}?subject=${subject}&body=${body}`;
        setToast({ open: true, message: "Mail client opened as fallback. Thanks!" });
      } else {
        const json = await res.json().catch(() => ({}));
        setToast({ open: true, message: json.error || "Failed to send. Please try mailto fallback." });
      }
    } catch (err) {
      const subject = encodeURIComponent(`Website enquiry from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCity: ${form.city}\n\n${form.message}`);
      window.location.href = `mailto:${data.contacts.email}?subject=${subject}&body=${body}`;
      setToast({ open: true, message: "Network error - opened mail client as fallback." });
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
          // ignore
        }
        handler();
      }
    } catch (e) {
      // ignore
    }
    return () => window.removeEventListener("openContactForm", handler as EventListener);
  }, []);

  return (
    <section id="contact" className="section relative overflow-hidden bg-transparent ">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#0b1d3c]/12 via-slate-50 to-transparent dark:from-[#041025]/45 pointer-events-none" />
      <div className="absolute -right-36 top-8 w-72 h-72 bg-[#e3f1ff] dark:bg-[#17345f]/45 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -left-32 bottom-0 w-80 h-80 bg-[#f2f8ff] dark:bg-[#13243d]/45 blur-3xl rounded-full pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6 glass-panel p-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#102a6d] text-white px-4 py-1 text-xs font-semibold uppercase tracking-widest shadow-sm">
              <FiMessageCircle className="w-3.5 h-3.5" />
              Schedule a discovery call
            </span>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Let us plan your solar or lighting project
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                Expect transparent communication with distributor-level access and OEM-backed assurance. Our pre-sales engineers map requirements, documentation and delivery commitments tailored to residential, industrial or public infrastructure mandates.
              </p>
            </div>
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <FiMail className="w-5 h-5 text-[#102a6d] dark:text-[#9cbcff] mt-1" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Email</div>
                  <a href={`mailto:${data.contacts.email}`} className="text-slate-600 dark:text-slate-300 hover:text-[#102a6d] dark:hover:text-[#9cbcff]">
                    {data.contacts.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="w-5 h-5 text-[#102a6d] dark:text-[#9cbcff] mt-1" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Phone</div>
                  <div className="text-slate-600 dark:text-slate-300">{data.contacts.phones.join(" / ")}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-[#102a6d] dark:text-[#9cbcff] mt-1" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Pune office</div>
                  <div className="text-slate-600 dark:text-slate-300">{data.contacts.puneOffice}</div>
                </div>
              </div>
            </div>
            <div className="glass-panel p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#102a6d] dark:text-[#9cbcff]">
                What happens next
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-200 leading-relaxed">
                {responsePromises.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <FiClock className="w-4 h-4 text-[#102a6d] dark:text-[#9cbcff] mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <form
            onSubmit={submit}
            className="lg:col-span-3 glass-panel p-6 md:p-8"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#102a6d] dark:text-[#9cbcff]">
                  Start the conversation
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Tell us a little about your project and we will line up the right engineer for a quick consult.
                </p>
              </div>
              <FiArrowRightCircle className="w-6 h-6 text-[#102a6d] dark:text-[#9cbcff]" />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Name*</label>
                <input
                  ref={nameRef}
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-slate-200/70 dark:border-[#5ea8ff]/30 bg-white/90 dark:bg-[#0b1e3b] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 caret-[#0f3fa6] dark:caret-[#5ea8ff] focus:outline-none focus:ring-2 focus:ring-[#102a6d]/40 focus:border-[#102a6d]/60 dark:focus:ring-[#5ea8ff]/40"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email*</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-slate-200/70 dark:border-[#5ea8ff]/30 bg-white/90 dark:bg-[#0b1e3b] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 caret-[#0f3fa6] dark:caret-[#5ea8ff] focus:outline-none focus:ring-2 focus:ring-[#102a6d]/40 focus:border-[#102a6d]/60 dark:focus:ring-[#5ea8ff]/40"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-slate-200/70 dark:border-[#5ea8ff]/30 bg-white/90 dark:bg-[#0b1e3b] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 caret-[#0f3fa6] dark:caret-[#5ea8ff] focus:outline-none focus:ring-2 focus:ring-[#102a6d]/40 focus:border-[#102a6d]/60 dark:focus:ring-[#5ea8ff]/40"
                  placeholder="+91 95112 29430"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Preferred city</label>
                <input
                  name="city"
                  value={(form as any).city || ""}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-slate-200/70 dark:border-[#5ea8ff]/30 bg-white/90 dark:bg-[#0b1e3b] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 caret-[#0f3fa6] dark:caret-[#5ea8ff] focus:outline-none focus:ring-2 focus:ring-[#102a6d]/40 focus:border-[#102a6d]/60 dark:focus:ring-[#5ea8ff]/40"
                  placeholder="City or site location"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Project details</label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                rows={6}
                className="mt-1 w-full rounded-lg border border-slate-200/70 dark:border-[#5ea8ff]/30 bg-white/90 dark:bg-[#0b1e3b] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 caret-[#0f3fa6] dark:caret-[#5ea8ff] focus:outline-none focus:ring-2 focus:ring-[#102a6d]/40 focus:border-[#102a6d]/60 dark:focus:ring-[#5ea8ff]/40"
                placeholder="Share load profile, timelines, site constraints or desired outcomes."
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1b3f92] via-[#0f5bd8] to-[#00a8ff] text-white font-semibold px-6 py-3 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send enquiry"}
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We reply within one business day with next steps, documentation checklist and scheduling options.
              </p>
            </div>
          </form>
        </div>
      </div>

      <Toast open={toast.open} onClose={() => setToast((t) => ({ ...t, open: false }))} message={toast.message} />
    </section>
  );
}
