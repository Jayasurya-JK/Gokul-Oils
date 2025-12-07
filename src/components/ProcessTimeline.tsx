'use client';

import { Sun, Droplet, Package, Leaf, Filter } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const steps = [
    { icon: Leaf, title: 'Selecting Seeds', desc: 'Premium quality seeds sourced directly.' },
    { icon: Sun, title: 'Sun Drying', desc: 'Naturally dried to remove moisture.' },
    { icon: Filter, title: 'Wood Pressing', desc: 'Slow extraction at low temperature.' },
    { icon: Droplet, title: 'Sedimentation', desc: 'Natural settling for 3-5 days.' },
    { icon: Package, title: 'Packing', desc: 'Hygienic bottling with zero heat.' },
];

function SimpleScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

// Arrow Curve Left to Right
const ArrowLeftToRight = () => (
    <svg width="100%" height="60" viewBox="0 0 100 60" preserveAspectRatio="none" className="block mx-auto text-[#1F4D3C] opacity-40">
        <path d="M 22.5 0 C 22.5 30, 77.5 30, 77.5 60" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 73.5 52 L 77.5 60 L 81.5 52" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

// Arrow Curve Right to Left
const ArrowRightToLeft = () => (
    <svg width="100%" height="60" viewBox="0 0 100 60" preserveAspectRatio="none" className="block mx-auto text-[#1F4D3C] opacity-40">
        <path d="M 77.5 0 C 77.5 30, 22.5 30, 22.5 60" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 18.5 52 L 22.5 60 L 26.5 52" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);


export default function ProcessTimeline() {
    return (
        <section className="py-12 md:py-24 bg-[#fcfdfc] overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <SimpleScrollReveal>
                    <h2 className="text-3xl md:text-5xl font-bold text-center text-[#1F4D3C] mb-12 md:mb-24 font-serif">
                        How Gokul Oils are Made
                    </h2>
                </SimpleScrollReveal>

                {/* Desktop View (Horizontal) */}
                <div className="hidden md:block relative">
                    <div className="absolute top-12 left-0 w-full h-1 bg-gray-100 -z-0"></div>
                    <div className="grid grid-cols-5 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <SimpleScrollReveal key={index} delay={index * 150} className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-[#1F4D3C] text-white rounded-full border-[6px] border-green-50 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#16382b] transition-all duration-300 relative z-10">
                                    <step.icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1F4D3C] mb-3 font-serif">{step.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed max-w-[160px]">{step.desc}</p>
                            </SimpleScrollReveal>
                        ))}
                    </div>
                </div>

                {/* Mobile View (ZigZag - Compact) */}
                <div className="md:hidden flex flex-col relative w-full px-2">
                    {steps.map((step, index) => {
                        const isEven = index % 2 === 0; // 0, 2, 4 -> Left
                        return (
                            <div key={index} className="contents">
                                {/* The Step Card */}
                                <SimpleScrollReveal className={`flex w-full ${isEven ? 'justify-start' : 'justify-end'}`}>
                                    <div className="flex flex-col items-center text-center w-[45%] z-10 pb-1">
                                        <div className="w-20 h-20 bg-[#1F4D3C] text-white rounded-full border-[5px] border-green-50 shadow-lg flex items-center justify-center mb-3 transition-transform duration-300 hover:scale-105">
                                            <step.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-[#1F4D3C] mb-1 leading-tight font-serif">{step.title}</h3>
                                        <p className="text-xs text-gray-600 leading-snug font-medium max-w-[140px]">{step.desc}</p>
                                    </div>
                                </SimpleScrollReveal>

                                {/* The Connector Arrow (If not last item) */}
                                {index < steps.length - 1 && (
                                    <SimpleScrollReveal delay={50} className="w-full h-16 relative -my-6 z-0 pointer-events-none">
                                        {isEven ? <ArrowLeftToRight /> : <ArrowRightToLeft />}
                                    </SimpleScrollReveal>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
