'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Anjali R.',
        rating: 5,
        text: 'The aroma of the groundnut oil takes me back to my grandmother’s kitchen. Absolutely pure and authentic!',
        image: 'bg-pink-100',
    },
    {
        id: 2,
        name: 'Rahul K.',
        rating: 5,
        text: 'I switched to Gokul Oils a month ago, and I can feel the difference in lightness and taste. Highly recommended.',
        image: 'bg-blue-100',
    },
    {
        id: 3,
        name: 'Priya S.',
        rating: 5,
        text: 'Best cold-pressed oil in the market. The sesame oil is perfect for traditional cooking.',
        image: 'bg-purple-100',
    },
    {
        id: 4,
        name: 'Vikram M.',
        rating: 5,
        text: 'Genuine wood-pressed oil. You can tell by the texture and smell. Great packaging too!',
        image: 'bg-green-100',
    },
];

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
    const prevSlide = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                    What Our Customers Say
                </h2>

                <div className="relative max-w-4xl mx-auto">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                                    <div className="bg-[#f6f9f6] rounded-2xl p-8 md:p-12 text-center">
                                        <div className={`w-20 h-20 ${testimonial.image} rounded-full mx-auto mb-6 flex items-center justify-center text-gray-500 font-bold text-xl`}>
                                            {testimonial.name[0]}
                                        </div>
                                        <div className="flex justify-center gap-1 mb-6">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-lg md:text-xl text-gray-700 italic mb-6">
                                            "{testimonial.text}"
                                        </p>
                                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-colors ${index === activeIndex ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
