"use client";
import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiHelpCircle } from "react-icons/fi";

const faqs = [
    {
        q: "What is the real payback period for solar in Maharashtra?",
        a: "For solar water heaters, payback is typically 1.5–2 years. For rooftop solar power plants, it's 3–4 years with net-metering. After that, your energy is essentially free for the next 20+ years."
    },
    {
        q: "Do solar water heaters work during the monsoon?",
        a: "Yes. Our systems are sized with insulated storage tanks that keep water hot for up to 48 hours. On heavy rain days, an optional electrical backup ensures you never run out of hot water."
    },
    {
        q: "Does OOJED provide service after installation?",
        a: "Absolutely. We are known for our after-sales support. We offer Annual Maintenance Contracts (AMC) that include preventive cleaning, health checks, and priority breakdown support."
    },
    {
        q: "Is financing or subsidy available?",
        a: "Yes, government subsidies are available for residential rooftop solar (PM Surya Ghar). We handle all the documentation and application processes for you."
    },
    {
        q: "How much roof space do I need?",
        a: "A typical 3kW home solar system needs about 300 sq. ft. of shadow-free area. For water heaters, a 200L system needs roughly 20 sq. ft. We offer free site surveys to check feasibility."
    }
];

export default function HomeFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="container py-12 md:py-16">
            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 items-start">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground mb-4">
                        <FiHelpCircle />
                        Common Questions
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Got questions? <br /> We have answers.
                    </h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        Solar can be confusing with all the technical terms. Here are simple answers to the things our customers ask most often.
                    </p>
                    <div className="mt-8 p-6 rounded-2xl bg-secondary/30 border border-border">
                        <h3 className="font-semibold text-foreground mb-2">Still have doubts?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Our engineers are happy to explain everything over a quick call. No sales pressure.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto"
                        >
                            Ask an Expert
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    {faqs.map((item, i) => (
                        <div
                            key={i}
                            className={`rounded-xl border transition-all duration-200 ${openIndex === i
                                ? "bg-card border-primary/30 shadow-lg"
                                : "bg-card/50 border-border hover:border-primary/30"
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="flex items-center justify-between w-full p-5 text-left"
                            >
                                <span className={`font-semibold text-lg ${openIndex === i ? "text-primary" : "text-foreground"}`}>
                                    {item.q}
                                </span>
                                {openIndex === i ? (
                                    <FiChevronUp className="w-5 h-5 text-primary flex-shrink-0 ml-4" />
                                ) : (
                                    <FiChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                                )}
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="p-5 pt-0 text-muted-foreground leading-relaxed border-t border-border/50 mt-2">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
