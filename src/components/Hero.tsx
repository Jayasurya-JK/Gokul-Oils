'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
    {
        id: 1,
        imageSrc: '/icons/Banner_Desktop_1.webp',
        mobileImageSrc: '/icons/Website Banners - Mobile_1.webp',
        bgClass: 'bg-green-100', // Fallback
        title: 'Cold-Pressed. Pure. Traditional.',
        subtitle: 'Experience the authentic taste of tradition.',
        cta: 'Shop Oils',
    },
    {
        id: 2,
        imageSrc: '/icons/Banner_Desktop_2.webp',
        mobileImageSrc: '/icons/Website Banners - Mobile_2.webp',
        bgClass: 'bg-yellow-100',
        title: 'Better Taste, Better Health',
        subtitle: 'Rich in nutrients, just as nature intended.',
        cta: 'Discover More',
    },
    {
        id: 3,
        imageSrc: '/icons/Banner_Desktop_3.webp',
        mobileImageSrc: '/icons/Website Banners - Mobile_3.webp',
        bgClass: 'bg-orange-100',
        title: 'From Farm to Bottle',
        subtitle: 'Sourced directly from farmers, processed with care.',
        cta: 'View Process',
    },
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }

        if (isRightSwipe) {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        }
    };

    return (
        <section
            className="relative w-full h-[420px] md:h-[600px] overflow-hidden bg-gray-100 touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <Link href="/shop" className="block w-full h-full cursor-pointer">
                        {/* Background: Image or Color Placeholder */}
                        <div className={`w-full h-full relative ${!slide.imageSrc ? slide.bgClass : ''} flex items-center justify-center`}>

                            {/* Desktop Image */}
                            {slide.imageSrc && (
                                <div className={`absolute inset-0 w-full h-full ${slide.mobileImageSrc ? 'hidden md:block' : ''}`}>
                                    <Image
                                        src={slide.imageSrc}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                    />
                                </div>
                            )}

                            {/* Mobile Image */}
                            {slide.mobileImageSrc && (
                                <div className="absolute inset-0 w-full h-full md:hidden">
                                    <Image
                                        src={slide.mobileImageSrc}
                                        alt={slide.title}
                                        fill
                                        className={`object-cover ${slide.id === 3 ? 'object-bottom' : 'object-center'}`}
                                        priority={index === 0}
                                    />
                                </div>
                            )}

                            {/* Content Container */}
                            <div className="absolute inset-0 flex flex-col md:flex-row items-center md:items-center justify-start pt-6 md:pt-0 px-6 md:px-16 container mx-auto">
                                <div className="relative z-10 text-center md:text-left max-w-2xl w-full">
                                    <h1 className="text-2xl md:text-6xl font-extrabold mb-2 md:mb-4 leading-tight text-green-950 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
                                        {slide.title}
                                    </h1>
                                    <p className="text-sm md:text-xl opacity-100 font-bold text-green-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
                                        {slide.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-accent w-8' : 'bg-white/50 hover:bg-white'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
