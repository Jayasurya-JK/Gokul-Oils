'use client';

import Image from 'next/image';
import { useState } from 'react';

const certifications = [
    { name: 'FSSAI Certified', src: '/icons/fssai.webp' },
    { name: '100% Natural', src: '/icons/Natural.webp' },
    { name: '100% Wood Pressed', src: '/icons/wood pressed.webp' },
    { name: 'Made in India', src: '/icons/made in india.webp' },
];

// Sub-component to handle individual image loading state
function CertificationBadge({ cert }: { cert: { name: string, src: string } }) {
    const [imgSrc, setImgSrc] = useState(cert.src);
    const [hasError, setHasError] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-w-[140px] -mx-6 md:-mx-8 md:min-w-[200px] transition-opacity duration-300">
            <div className="relative h-24 w-44 md:h-32 md:w-60 flex items-center justify-center mb-2 px-1">
                {!hasError ? (
                    <Image
                        src={imgSrc}
                        alt={cert.name}
                        fill
                        className="object-contain"
                        onError={() => setHasError(true)}
                        unoptimized
                    />
                ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg h-full w-full flex items-center justify-center bg-gray-50">
                        <span className="text-xs font-bold text-gray-400 text-center px-1">{cert.name}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Certifications() {
    return (
        <section className="py-12 md:py-16 bg-white border-t border-gray-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1F4D3C] font-serif">Quality Assurance</h2>
                <div className="w-24 h-1 bg-[#1F4D3C] mx-auto rounded-full mt-4"></div>
            </div>

            {/* Title Removed - Restored above */}

            <style jsx global>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }
                .animate-infinite-scroll {
                    animation: scroll 30s linear infinite;
                }
                @media (min-width: 768px) {
                    .animate-infinite-scroll {
                        animation: none;
                        transform: none;
                    }
                }
            `}</style>

            <div className="relative w-full overflow-hidden md:overflow-visible">
                {/* Gradient Masks (referencing only mobile) */}
                <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-10 md:hidden"></div>
                <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10 md:hidden"></div>

                {/* Container: Scroll on mobile, Center Grid on Desktop */}
                <div className="flex w-max md:w-full md:flex-wrap md:justify-center md:gap-16 animate-infinite-scroll md:animate-none">
                    {/* Loop 1 - Always visible (on desktop this is the only one we want effectively, but structure makes it tricky. I'll just map the items once for desktop if I change structure, but simpler to just hide duplicates on desktop via CSS) */}

                    {/* Actually, to support both modes cleanly:
                       Mobile: big wide wrapper with duplicates.
                       Desktop: just one centered wrapper.
                       I will use a different structure refactor.
                    */}

                    {/* Mobile Only Scroller */}
                    <div className="flex md:hidden w-max animate-infinite-scroll">
                        {[1, 2, 3, 4].map((loop) => (
                            <div key={`loop-${loop}`} className="flex gap-0 items-center">
                                {certifications.map((cert, index) => (
                                    <CertificationBadge key={`${loop}-${index}`} cert={cert} />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Desktop Only Static Grid */}
                    <div className="hidden md:flex flex-wrap justify-center gap-0 items-center w-full">
                        {certifications.map((cert, index) => (
                            <CertificationBadge key={`desktop-${index}`} cert={cert} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
