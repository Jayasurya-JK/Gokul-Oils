'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Minerva Thakur',
        role: 'Customer',
        rating: 5,
        text: 'The aroma of Gokul’s Groundnut Oil takes me back to my grandmother’s kitchen. It’s absolutely pure, light on the stomach, and adds a wonderful flavor to our daily meals.',
        initial: 'M',
        color: 'bg-orange-100 text-orange-600'
    },
    {
        id: 2,
        name: 'Lakshmi Dev',
        role: 'Customer',
        rating: 5,
        text: 'I use their Sesame Oil for traditional recipes and oil pulling. You can really taste the difference of authentic wood pressing. The quality is simply exceptional.',
        initial: 'L',
        color: 'bg-blue-100 text-blue-600'
    },
    {
        id: 3,
        name: 'Dr Shagun Walia',
        role: 'Doctor',
        rating: 5,
        text: 'Gokul’s Coconut Oil is the purest I’ve found. Unbleached and natural—perfect for my family’s health. I highly recommend switching to these wood pressed oils.',
        initial: 'S',
        color: 'bg-green-100 text-green-600'
    },
    {
        id: 4,
        name: 'Pankaj Tiwari',
        role: 'Chef',
        rating: 5,
        text: 'As a chef, distinct flavors matter. The natural texture and freshness of Gokul Oils are unmatched. They are far superior to any refined oil available in the market.',
        initial: 'P',
        color: 'bg-purple-100 text-purple-600'
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
                    <div className="overflow-hidden px-1">
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
                                    <div className="bg-white rounded-2xl p-6 md:p-8 h-full shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between min-h-[280px]">

                                        {/* Quote Text */}
                                        <div className="mb-6">
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
