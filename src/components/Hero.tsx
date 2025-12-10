'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        image: 'bg-green-100', // Placeholder class
        title: 'Cold-Pressed. Pure. Traditional.',
        subtitle: 'Experience the authentic taste of tradition.',
        cta: 'Shop Oils',
    },
    {
        id: 2,
        image: 'bg-yellow-100',
        title: 'Better Taste, Better Health',
        subtitle: 'Rich in nutrients, just as nature intended.',
        cta: 'Discover More',
    },
    {
        id: 3,
        image: 'bg-orange-100',
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
        }, 4000);
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
                    {/* Background Image Placeholder */}
                    <div className={`w-full h-full ${slide.image} flex items-center justify-center`}>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Content */}
                        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto mt-20">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
                                {slide.title}
                            </h1>
                            <p className="text-lg md:text-xl mb-8 opacity-90 font-light">
                                {slide.subtitle}
                            </p>
                            <button className="bg-accent hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 flex items-center gap-2 mx-auto">
                                {slide.cta} <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
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
