"use client";
import { useState, useEffect } from "react";
import { FiPhone, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import data from "@/data/site.json";

export default function FloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 300px
            if (window.scrollY > 300 && !isClosed) {
                setIsVisible(true);
            } else if (window.scrollY <= 300) {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isClosed]);

    if (!isVisible || isClosed) return null;

    const phone = (data as any).contacts?.phones?.[0] || "+91 95112 29430";
    const whatsappNumber = phone.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi, I'm interested in your solar solutions`;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-primary to-blue-600 text-white shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="container mx-auto px-2 md:px-4 py-2 md:py-3">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold">Ready to go solar?</p>
                        <p className="text-xs opacity-90">Get your free site survey today!</p>
                    </div>

                    {/* Mobile: Grid Layout | Desktop: Flex Row */}
                    <div className="grid grid-cols-3 gap-2 w-full md:w-auto md:flex md:items-center md:gap-3">
                        <a
                            href={`tel:${phone.replace(/[^+0-9]/g, "")}`}
                            className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 bg-white text-primary px-2 md:px-4 py-2 rounded-lg md:rounded-full font-semibold text-xs md:text-sm hover:bg-white/90 transition-colors shadow-sm"
                            title="Call us now"
                        >
                            <FiPhone className="h-4 w-4 md:h-4 md:w-4" />
                            <span>Call Now</span>
                        </a>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 bg-[#25D366] text-white px-2 md:px-4 py-2 rounded-lg md:rounded-full font-semibold text-xs md:text-sm hover:bg-[#20bd5a] transition-colors shadow-sm"
                            title="Chat on WhatsApp"
                        >
                            <FaWhatsapp className="h-4 w-4 md:h-4 md:w-4" />
                            <span>WhatsApp</span>
                        </a>

                        <Link
                            href="/contact"
                            className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 bg-white/20 backdrop-blur text-white px-2 md:px-4 py-2 rounded-lg md:rounded-full font-semibold text-xs md:text-sm hover:bg-white/30 transition-colors border border-white/30"
                            title="Get a free quote"
                        >
                            <span className="md:hidden text-lg font-bold">₹</span>
                            <span className="hidden md:inline">Get Quote</span>
                            <span className="md:hidden">Quote</span>
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsClosed(true)}
                        className="absolute -top-10 right-4 md:static p-2 bg-black/50 md:bg-transparent text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-md md:backdrop-blur-none"
                        aria-label="Close"
                        title="Close"
                    >
                        <FiX className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
