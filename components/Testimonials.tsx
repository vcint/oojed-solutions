"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import data from "@/data/site.json";

export default function Testimonials() {
    const [index, setIndex] = useState(0);
    const testimonials = (data as any).testimonials || [];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    if (!testimonials.length) return null;

    return (
        <section className="py-16 bg-secondary/10 overflow-hidden">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">Trusted by Maharashtra</h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        See what our customers say about their journey to lower bills and reliable energy with OOJED.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-10">
                        <button
                            onClick={prev}
                            className="p-2 rounded-full bg-background shadow-md hover:bg-secondary transition-colors text-foreground"
                            aria-label="Previous testimonial"
                        >
                            <FiChevronLeft className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-10">
                        <button
                            onClick={next}
                            className="p-2 rounded-full bg-background shadow-md hover:bg-secondary transition-colors text-foreground"
                            aria-label="Next testimonial"
                        >
                            <FiChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="overflow-hidden px-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.4 }}
                                className="glass p-8 md:p-12 rounded-2xl text-center"
                            >
                                <div className="flex justify-center gap-1 mb-6">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <FiStar
                                            key={i}
                                            className={`w-5 h-5 ${i < testimonials[index].rating
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
                                    "{testimonials[index].text}"
                                </blockquote>
                                <div className="mt-8">
                                    <div className="font-bold text-lg text-primary">
                                        {testimonials[index].name}
                                    </div>
                                    <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
                                        {testimonials[index].role}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                                    }`}
                                aria-label={`Go to testimonial ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
