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
    "We'll review your energy bills and share a clear ROI estimate within one business day.",
    "You get a detailed proposal sized for your actual needs, no cookie-cutter quotes.",
    "Fair pricing, flexible payment schedules, and AMC options explained upfront.",
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
    <section id="contact" className="section relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-background" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6 glass p-6 rounded-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold uppercase tracking-widest shadow-sm">
              <FiMessageCircle className="w-3.5 h-3.5" />
              Schedule a discovery call
            </span>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Let's talk about your solar project
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                No sales pressure, no confusing jargon. Just an honest conversation about what solar can do for your home or business. We'll check if your roof works, size the system properly, and walk you through costs, savings, and realistic timelines.
              </p>
            </div>
            <div className="space-y-4 text-sm text-foreground">
              <div className="flex items-start gap-3">
                <FiMail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold text-foreground">Email</div>
                  <a href={`mailto:${data.contacts.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {data.contacts.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold text-foreground">Phone</div>
                  <div className="text-muted-foreground">{data.contacts.phones.join(" / ")}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold text-foreground">Pune office</div>
                  <div className="text-muted-foreground">{data.contacts.puneOffice}</div>
                </div>
              </div>
            </div>
            <div className="glass p-5 rounded-xl bg-secondary/30">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                What happens next
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed">
                {responsePromises.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <FiClock className="w-4 h-4 text-primary mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <form
            onSubmit={submit}
            className="lg:col-span-3 glass p-6 md:p-8 rounded-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  Start the conversation
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Just share what you're thinking about (solar water heater, rooftop power, LED upgrade) and we'll connect you with the right person on our team.
                </p>
              </div>
              <FiArrowRightCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="text-sm font-medium text-foreground">Name*</label>
                <input
                  ref={nameRef}
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email*</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                  placeholder="+91 95112 29430"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Preferred city</label>
                <input
                  name="city"
                  value={(form as any).city || ""}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                  placeholder="City or site location"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-foreground">Project details</label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                rows={6}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                placeholder="Share load profile, timelines, site constraints or desired outcomes."
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-6 py-3 shadow-md hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-ring/30 disabled:opacity-70 transition-colors"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send enquiry"}
              </button>
              <p className="text-xs text-muted-foreground">
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
