"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import data from '@/data/site.json';

const CITY_COOKIE = 'oojed_city';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;
const DISMISSED_KEY = 'oojed_city_selector_dismissed';

const cities: string[] = Array.isArray((data as any).cities) ? (data as any).cities : [];

const toSlug = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const setCityCookie = (slug: string) => {
    try {
        document.cookie = `${CITY_COOKIE}=${encodeURIComponent(slug)}; path=/; max-age=${COOKIE_MAX_AGE}; sameSite=Lax`;
    } catch (e) {
        // ignore
    }
};

export default function CitySelector() {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    useEffect(() => {
        // Only show if user hasn't dismissed and no city is set
        const dismissed = localStorage.getItem(DISMISSED_KEY);
        if (dismissed) return;

        const hasCookie = document.cookie.includes(CITY_COOKIE);
        if (hasCookie) return;

        // Show after a short delay (not immediately, less annoying)
        const timer = setTimeout(() => setVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (city: string) => {
        const slug = toSlug(city);
        setCityCookie(slug);
        setVisible(false);
        localStorage.setItem(DISMISSED_KEY, '1');
        router.refresh();
    };

    const handleDismiss = () => {
        setVisible(false);
        localStorage.setItem(DISMISSED_KEY, '1');
        // Set default city (Pune)
        setCityCookie('pune');
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 right-4 z-50 w-full max-w-sm">
            <div className="glass-panel rounded-lg border border-slate-200 bg-white/95 p-4 shadow-2xl dark:border-white/20 dark:bg-slate-900/95">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Select Your City
                        </h3>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                            Get accurate pricing and availability for your area
                        </p>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        aria-label="Dismiss"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mt-3">
                    <input
                        type="text"
                        placeholder="Search cities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                    />
                </div>

                <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                    {filteredCities.slice(0, 20).map((city) => (
                        <button
                            key={city}
                            onClick={() => handleSelect(city)}
                            className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            {city}
                        </button>
                    ))}
                    {filteredCities.length === 0 && (
                        <div className="px-3 py-4 text-center text-sm text-slate-500">
                            No cities found
                        </div>
                    )}
                </div>

                <div className="mt-3 flex gap-2">
                    <button
                        onClick={handleDismiss}
                        className="flex-1 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
}
