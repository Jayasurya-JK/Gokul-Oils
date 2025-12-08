'use client';

import { Sun, Droplet, Package, Leaf, Filter } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import Image from 'next/image';

// Placeholder structure - User will provide images later
const steps = [
    {
        icon: Leaf,
        title: 'Selecting Seeds',
        desc: 'Premium quality seeds sourced directly.',
        image: null // User will provide: "agri women holding raw groundnut" 
    },
    {
        icon: Sun,
        title: 'Sun Drying',
        desc: 'Naturally dried to remove moisture.',
        image: null
    },
    {
        icon: Filter,
        title: 'Wood Pressing',
        desc: 'Slow extraction at low temperature.',
        image: null
    },
    {
        icon: Droplet,
        title: 'Sedimentation',
        desc: 'Natural settling for 3-5 days.',
        image: null
    },
    {
        icon: Package,
        title: 'Packing',
        desc: 'Hygienic bottling with zero heat.',
        image: null
    },
];

export default function ProcessTimeline() {
    return (
        <section className="py-16 md:py-24 bg-[#fcfdfc] overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16 md:mb-24">
                    <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3 block">Pure Methodology</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1F4D3C] font-serif">How Gokul Oils are Made</h2>
                </div>

                {/* Desktop View (Horizontal) */}
                <div className="hidden md:block">
                    <DesktopTimeline />
                </div>

                {/* Mobile View (ZigZag Vertical with Framer Motion) */}
                <div className="md:hidden">
                    <MobileTimeline />
                </div>
            </div>
        </section>
    );
}

// Separate Component for Desktop to keep it clean (Standard Horizontal)
function DesktopTimeline() {
    return (
        <div className="relative">
            {/* The Connecting Line Background */}
            <div className="absolute top-12 left-0 w-full h-1 bg-gray-100 z-0"></div>

            <div className="grid grid-cols-5 gap-8 relative z-10">
                {steps.map((step, index) => {
                    return (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-full border-[6px] shadow-lg flex items-center justify-center mb-6 relative z-10 bg-[#1F4D3C] border-yellow-400 text-white overflow-hidden">
                                {step.image ? (
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <step.icon className="w-10 h-10" />
                                )}
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-serif text-[#1F4D3C]">{step.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-[160px]">{step.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Advanced Mobile Timeline with Framer Motion and Clean Layout
function MobileTimeline() {
    return (
        <div className="relative flex flex-col w-full space-y-0">
            {steps.map((step, index) => (
                <MobileStepItem key={index} step={step} index={index} total={steps.length} />
            ))}
        </div>
    );
}

function MobileStepItem({ step, index, total }: { step: any, index: number, total: number }) {
    const isEven = index % 2 === 0;
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50px 0px -50px 0px", once: true });

    // Determine gradient direction for the card border/shadow
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div ref={ref} className="relative w-full min-h-[180px] pb-8">
            {/* The Connecting Curve (Rendered first so it's behind) */}
            {index < total - 1 && (
                <div className="absolute top-[2.5rem] left-0 w-full h-[calc(100%+2.5rem)] z-0 pointer-events-none">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* 1. Ash Background Line (Empty Pipe) */}
                        <path
                            d={isEven
                                ? "M 25,0 C 25,50 75,50 75,100"
                                : "M 75,0 C 75,50 25,50 25,100"
                            }
                            stroke="#e5e7eb" // Ash/Light Gray
                            strokeWidth="4"
                            vectorEffect="non-scaling-stroke"
                            fill="none"
                            strokeLinecap="round"
                        />

                        {/* 2. Liquid Gold Line (Solid Fill) */}
                        <motion.path
                            d={isEven
                                ? "M 25,0 C 25,50 75,50 75,100"
                                : "M 75,0 C 75,50 25,50 25,100"
                            }
                            stroke="#FACC15"
                            strokeWidth="4"
                            vectorEffect="non-scaling-stroke"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />

                        {/* 3. Flow Texture (Moving Highlights) */}
                        <motion.path
                            d={isEven
                                ? "M 25,0 C 25,50 75,50 75,100"
                                : "M 75,0 C 75,50 25,50 25,100"
                            }
                            stroke="white"
                            strokeWidth="2"
                            strokeOpacity={0.4}
                            vectorEffect="non-scaling-stroke"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray="4 8"
                            initial={{ pathLength: 0, strokeDashoffset: 0 }}
                            animate={isInView ? {
                                pathLength: 1,
                                strokeDashoffset: [-12, 0] // Loop backwards for forward flow appearance
                            } : {
                                pathLength: 0,
                                strokeDashoffset: 0
                            }}
                            transition={{
                                pathLength: { duration: 1.5, ease: "easeInOut" },
                                strokeDashoffset: { duration: 0.8, repeat: Infinity, ease: "linear" }
                            }}
                        />
                    </svg>
                </div>
            )}

            {/* The Step Content */}
            <div className={`flex w-full ${isEven ? 'justify-start' : 'justify-end'} relative z-10`}>
                <div className="w-1/2 flex flex-col items-center">

                    {/* Icon/Image (Centered on the line start) */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-20 h-20 rounded-full border-[3px] border-yellow-400 shadow-lg flex items-center justify-center mb-4 bg-[#1F4D3C] text-white z-20 relative overflow-hidden"
                    >
                        {step.image ? (
                            <Image
                                src={step.image}
                                alt={step.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <step.icon className="w-9 h-9" />
                        )}
                    </motion.div>

                    {/* Text Card (Backdrop Blur to hide line behind) */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="w-full bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100 text-center relative z-10"
                    >
                        <h3 className="text-lg font-bold mb-1 font-serif text-[#1F4D3C] leading-tight">
                            {step.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            {step.desc}
                        </p>
                    </motion.div>
                </div>
            </div>
        </div >
    );
}
