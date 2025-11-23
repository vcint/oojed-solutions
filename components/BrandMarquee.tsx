"use client";
import Image from "next/image";

const brands = [
    { name: 'Vikram Solar', file: 'vikram-solar.jpg' },
    { name: 'Waaree Energies', file: 'Waaree-logo.png' },
    { name: 'Greensense', file: 'greensense.png' },
    { name: 'Exide', file: 'exide-logo.png' },
    { name: 'Luminous', file: 'LuminousLogoBlue.webp' },
    { name: 'OOJED', file: 'oojed-logo.png' },
];

export default function BrandMarquee() {
    return (
        <div className="relative overflow-hidden group select-none">
            {/* Grayscale Overlay (Masked) - Sits on top */}
            <div
                className="absolute inset-0 pointer-events-none z-10 backdrop-grayscale"
                style={{
                    backdropFilter: "grayscale(100%)",
                    WebkitBackdropFilter: "grayscale(100%)",
                    maskImage: "linear-gradient(90deg, black 0%, black 15%, transparent 40%, transparent 60%, black 85%, black 100%)",
                    WebkitMaskImage: "linear-gradient(90deg, black 0%, black 15%, transparent 40%, transparent 60%, black 85%, black 100%)"
                }}
            />

            {/* Scrolling Track Container */}
            <div className="flex gap-0 w-full">
                {/* Track 1 */}
                <div className="flex flex-shrink-0 animate-marquee items-center justify-around min-w-full">
                    {brands.map((brand, index) => (
                        <div
                            key={`${brand.name}-${index}-1`}
                            className="flex items-center justify-center h-16 w-28 md:h-24 md:w-48 relative mx-2 md:mx-6"
                        >
                            <Image
                                src={`/brand_Partners/${brand.file}`}
                                alt={`${brand.name} logo`}
                                width={160}
                                height={80}
                                className="object-contain max-w-full max-h-full"
                                sizes="(max-width: 768px) 112px, 192px"
                            />
                        </div>
                    ))}
                </div>
                {/* Track 2 (Duplicate for seamless loop) */}
                <div className="flex flex-shrink-0 animate-marquee items-center justify-around min-w-full" aria-hidden="true">
                    {brands.map((brand, index) => (
                        <div
                            key={`${brand.name}-${index}-2`}
                            className="flex items-center justify-center h-16 w-28 md:h-24 md:w-48 relative mx-2 md:mx-6"
                        >
                            <Image
                                src={`/brand_Partners/${brand.file}`}
                                alt={`${brand.name} logo`}
                                width={160}
                                height={80}
                                className="object-contain max-w-full max-h-full"
                                priority={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
