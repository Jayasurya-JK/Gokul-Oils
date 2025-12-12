'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Manimaran R',
        role: 'Customer',
        rating: 5,
        text: 'Quality products, good taste can buy from this shop',
        initial: 'M',
        color: 'bg-orange-100 text-orange-600'
    },
    {
        id: 2,
        name: 'Ramesh P.R',
        role: 'Customer',
        rating: 5,
        text: 'Very natural and good for health',
        initial: 'R',
        color: 'bg-blue-100 text-blue-600'
    },
    {
        id: 3,
        name: 'Mohamed Iqbal Atham',
        role: 'Local Guide',
        rating: 5,
        text: 'Purely organic oil. Manufactured within the outlet. Highly recommended.',
        initial: 'M',
        color: 'bg-green-100 text-green-600'
    },
    {
        id: 4,
        name: 'Soundar Rajan',
        role: 'Customer',
        rating: 5,
        text: '1000 percentage authentic wood pressed oil',
        initial: 'S',
        color: 'bg-purple-100 text-purple-600'
    },
    {
        id: 5,
        name: 'Srini Vasan',
        role: 'Customer',
        rating: 5,
        text: 'We have been buying oil here for over a year now, and we feel very healthy. Very good products',
        initial: 'S',
        color: 'bg-yellow-100 text-yellow-600'
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(1);

    // Responsive items to show
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setItemsToShow(3);
            else if (window.innerWidth >= 768) setItemsToShow(2);
            else setItemsToShow(1);
        };
        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev + itemsToShow >= testimonials.length ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? Math.max(0, testimonials.length - itemsToShow) : prev - 1
        );
    };

    const maxIndex = testimonials.length - itemsToShow;
    const isBeginning = currentIndex === 0;
    const isEnd = currentIndex >= maxIndex;

    // Touch Handling for Swipe
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

        if (isLeftSwipe && !isEnd) {
            nextSlide();
        }
        if (isRightSwipe && !isBeginning) {
            prevSlide();
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    return (
        <section className="py-12 md:py-16 bg-[#f8fcf8]"> {/* Light background for contrast with white cards */}
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Testimonials</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1F4D3C] font-serif">
                        What Do Our Customers Say
                    </h2>
                    <div className="w-24 h-1 bg-[#1F4D3C] mx-auto rounded-full mt-4"></div>
                </div>

                <div className="relative max-w-7xl mx-auto">
                    <div
                        className="overflow-hidden px-1 touch-pan-y"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="flex-shrink-0 px-3"
                                    style={{ width: `${100 / itemsToShow}%` }}
                                >
                                    <div className="bg-white rounded-2xl p-6 md:p-8 h-full shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between min-h-[200px]">

                                        {/* Quote Text */}
                                        <div className="mb-4">
                                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                                "{testimonial.text}"
                                            </p>
                                        </div>

                                        {/* User Profile */}
                                        <div className="flex items-center gap-4 border-t border-gray-50 pt-4 mt-auto">
                                            <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center font-bold text-lg`}>
                                                {testimonial.initial}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm md:text-base">
                                                    {testimonial.name}
                                                </h4>
                                                <div className="flex gap-0.5 mt-0.5">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows (Centered Below) */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={prevSlide}
                            disabled={isBeginning}
                            className={`p-3 rounded-full border transition-all ${isBeginning ? 'border-gray-200 text-gray-300' : 'border-[#1a4d2e] text-[#1a4d2e] hover:bg-[#1a4d2e] hover:text-white'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Dots in middle of arrows */}
                        <div className="flex items-center gap-2">
                            {Array.from({ length: testimonials.length - itemsToShow + 1 }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-[#1a4d2e]' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            disabled={isEnd}
                            className={`p-3 rounded-full border transition-all ${isEnd ? 'border-gray-200 text-gray-300' : 'border-[#1a4d2e] text-[#1a4d2e] hover:bg-[#1a4d2e] hover:text-white'}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
