"use client";
import { useState } from "react";
import { FiArrowRight, FiCheckCircle, FiPhone, FiUser, FiGrid } from "react-icons/fi";
import data from "@/data/site.json";

export default function QuickLeadForm() {
    const [form, setForm] = useState({ name: "", phone: "", interest: "Solar Water Heater" });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const services = [
        "Solar Water Heater",
        "Rooftop Solar Power",
        "Solar Pump",
        "LED Lighting",
        "AMC / Service"
    ];

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name: form.name,
            email: "quick-lead@example.com", // Placeholder email since we only ask for phone
            phone: form.phone,
            city: "Not specified",
            message: `Quick Lead: Interested in ${form.interest}`
        };

        try {
            // Using the existing contact API
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok || res.status === 501) { // 501 is mailto fallback, count as success for UI
                setSubmitted(true);
            } else {
                alert("Something went wrong. Please call us directly.");
            }
        } catch (err) {
            // Fallback to mailto if API fails
            const subject = encodeURIComponent(`Quick Enquiry: ${form.interest}`);
            const body = encodeURIComponent(`Name: ${form.name}\nPhone: ${form.phone}\nInterest: ${form.interest}`);
            window.location.href = `mailto:${data.contacts.email}?subject=${subject}&body=${body}`;
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="glass p-8 rounded-2xl text-center animate-in fade-in zoom-in duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <FiCheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Request Received!</h3>
                <p className="mt-2 text-muted-foreground">
                    Thanks, {form.name}. We'll call you shortly at <strong>{form.phone}</strong>.
                </p>
                <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", interest: "Solar Water Heater" }); }}
                    className="mt-6 text-primary font-semibold hover:underline"
                >
                    Send another request
                </button>
            </div>
        );
    }

    return (
        <div className="glass p-6 md:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <FiGrid className="w-32 h-32" />
            </div>

            <div className="relative z-10">
                <h3 className="text-2xl font-bold text-foreground">Get a Free Callback</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                    Share your number and we'll call you to discuss your solar needs. No spam, just answers.
                </p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <label className="sr-only">Your Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="text-muted-foreground" />
                            </div>
                            <input
                                required
                                type="text"
                                placeholder="Your Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="sr-only">Phone Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiPhone className="text-muted-foreground" />
                            </div>
                            <input
                                required
                                type="tel"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1 mb-1.5 block">
                            I'm interested in
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {services.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setForm({ ...form, interest: s })}
                                    className={`text-xs py-2 px-3 rounded-lg border transition-all text-left ${form.interest === s
                                            ? "border-primary bg-primary/10 text-primary font-medium"
                                            : "border-border hover:border-primary/50 text-muted-foreground"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-primary text-primary-foreground font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? "Sending..." : "Request Callback"}
                        {!loading && <FiArrowRight />}
                    </button>
                </form>
            </div>
        </div>
    );
}
