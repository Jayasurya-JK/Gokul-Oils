'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, ChevronsLeftRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Comparison() {
    const [activeSeedIndex, setActiveSeedIndex] = useState(0);
    // Track if user has manually changed seeds to pause auto-rotation


    const seedData = [
        { name: 'Groundnut Oil', src: '/icons/Groundnut Seed.webp', bottleSrc: '/icons/Gokul oils Bottle Transition.webp', refinedBottleSrc: '/icons/refined_oil_bottle.webp' },
        { name: 'Sesame Oil', src: '/icons/Sesame Seed.webp', bottleSrc: '/icons/Sesame Oil Gokul.webp', refinedBottleSrc: '/icons/Refined Oil bottle - sesame.webp' },
        { name: 'Coconut Oil', src: '/icons/Coconut seed.webp', bottleSrc: '/icons/Coconut oil Gokul.webp', refinedBottleSrc: '/icons/Refined Oil bottle - Coconut.webp' },
    ];

    const handlePrevSeed = () => {
        setActiveSeedIndex((prev) => (prev - 1 + seedData.length) % seedData.length);
    };

    const handleNextSeed = () => {
        setActiveSeedIndex((prev) => (prev + 1) % seedData.length);
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Auto-play animation ref
    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    // Handle mouse/touch move
    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const relativeX = clientX - containerRect.left;
        const percentage = Math.max(0, Math.min(100, (relativeX / containerRect.width) * 100));
        setSliderPosition(percentage);
    }, []);

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    }, [isDragging, handleMove]);

    const onTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging) return;
        handleMove(e.touches[0].clientX);
    }, [isDragging, handleMove]);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onMouseUp);
        };
    }, [isDragging, onMouseMove, onTouchMove, onMouseUp]);

    const handleContainerClick = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setHasInteracted(true);
        const containerRect = containerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - containerRect.left;
        const percentage = Math.max(0, Math.min(100, (relativeX / containerRect.width) * 100));
        setSliderPosition(percentage);
    };

    const handleMouseDown = () => {
        setHasInteracted(true);
        setIsDragging(true);
    };

    const cycleRef = useRef(0);

    // ANIMATION LOOP
    useEffect(() => {
        if (hasInteracted) {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            return;
        }

        const animate = (time: number) => {
            if (startTimeRef.current === null) startTimeRef.current = time;
            const elapsed = time - startTimeRef.current; // ms

            // Cycle defined as:
            // 1. Wait at 0 (0.5s) [Seed Changes Here]
            // 2. 0 -> 100 (2s) [Sweep Right to reveal new oil]
            // 3. Wait at 100 (3s) [Show Gokul]
            // 4. 100 -> 0 (2s) [Reset Left to hide Gokul]
            // 5. Wait at 0 (0.5s)

            const phase1 = 500;
            const phase2 = 2000;
            const phase3 = 3000;
            const phase4 = 2000;
            const phase5 = 500;
            const totalDuration = phase1 + phase2 + phase3 + phase4 + phase5;

            const cycle = Math.floor(elapsed / totalDuration);
            const loopTime = elapsed % totalDuration;

            // Change seed at the start of a new cycle (when slider is at 0)
            if (cycle > cycleRef.current) {
                cycleRef.current = cycle;
                setActiveSeedIndex((prev) => (prev + 1) % seedData.length);
            }

            let newPos = 0;

            if (loopTime < phase1) {
                // Phase 1: Wait at 0
                newPos = 0;
            } else if (loopTime < phase1 + phase2) {
                // Phase 2: Sweep 0 -> 100
                const t = (loopTime - phase1) / phase2;
                // Smoothstep easing
                newPos = (t * t * (3 - 2 * t)) * 100;
            } else if (loopTime < phase1 + phase2 + phase3) {
                // Phase 3: Wait at 100
                newPos = 100;
            } else if (loopTime < phase1 + phase2 + phase3 + phase4) {
                // Phase 4: Sweep 100 -> 0 (Reset)
                const t = (loopTime - (phase1 + phase2 + phase3)) / phase4;
                newPos = (1 - (t * t * (3 - 2 * t))) * 100;
            } else {
                // Phase 5: Wait at 0
                newPos = 0;
            }

            setSliderPosition(newPos);
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [hasInteracted, seedData.length]); // Fixed dependencies

    return (
        <section className="relative w-full py-12 md:py-20 bg-gradient-to-br from-green-50 to-white overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#1a4d2e] mb-10 md:mb-16 leading-tight">
                    The Truth About Your Cooking Oil
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
                    {/* Left: Gokul Oil (New Left Card) */}
                    {/* Desktop: Active when > 50. Inactive (blurred) when <= 50 */}
                    <div className={`order-2 lg:order-1 space-y-4 lg:space-y-6 transition-all duration-500 ease-in-out ${sliderPosition <= 50
                        ? 'hidden lg:block lg:opacity-50 lg:blur-[2px] lg:scale-95'
                        : 'block lg:opacity-100 lg:blur-0 lg:scale-110 lg:z-10'
                        }`}>
                        <div className="bg-green-50 rounded-2xl md:rounded-3xl p-4 lg:p-8 border border-green-100 shadow-sm h-full flex flex-col justify-center">
                            <h3 className="text-lg lg:text-2xl font-bold text-[#1a4d2e] mb-4 lg:mb-6 flex items-center gap-3">
                                <span className="w-6 h-6 lg:w-8 lg:h-8 bg-green-200 rounded-full flex items-center justify-center text-[#1a4d2e] shadow-sm">
                                    <Check className="w-4 h-4 lg:w-5 lg:h-5" />
                                </span>
                                {`Gokul's ${seedData[activeSeedIndex].name}`}
                            </h3>
                            <ul className="space-y-2 lg:space-y-4">
                                {[
                                    'Produced through natural wood pressed method',
                                    'Strictly no preservatives',
                                    'Natural aroma',
                                    'Natural colour',
                                    'Consists good fat',
                                    'Good for heart'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 lg:gap-3 text-gray-700">
                                        <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 shrink-0 mt-0.5" />
                                        <span className="text-xs lg:text-base font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Center: Slider (Mobile: Order 1) - Make it more compact on mobile */}
                    <div className="order-1 lg:order-2 flex justify-center py-2 lg:py-0">
                        {/* Wrapper for Arrows + Slider */}
                        <div className="flex flex-col items-center gap-6">

                            {/* Seed Icons Section (MOVED INSIDE CENTER COLUMN FOR MOBILE/DESKTOP UNIFICATION) */}
                            <div className="inline-flex justify-center items-center gap-3 md:gap-10 border border-gray-100 rounded-full px-6 py-3 md:px-8 md:py-3 bg-white shadow-sm ring-1 ring-gray-50 mb-6">
                                {seedData.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setActiveSeedIndex(index);
                                        }}
                                        className={`flex flex-col items-center cursor-pointer transition-all duration-300 ease-out select-none ${index === activeSeedIndex
                                            ? 'scale-110 opacity-100 filter-none'
                                            : 'scale-95 opacity-50 grayscale hover:opacity-80'
                                            }`}
                                    >
                                        <div className="relative w-16 h-16 md:w-22 md:h-22">
                                            <Image
                                                src={item.src}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 64px, 88px"
                                                unoptimized={true}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-6 md:gap-14">
                                {/* Left Arrow */}
                                <button
                                    onClick={handlePrevSeed}
                                    className="p-3 rounded-full bg-white/90 backdrop-blur-sm border border-green-100 shadow-[0_4px_12px_rgb(0,0,0,0.08)] text-[#1a4d2e] hover:bg-[#1a4d2e] hover:text-white transition-all duration-300 md:hidden active:scale-95 z-20 group"
                                    aria-label="Previous Oil"
                                >
                                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                                </button>

                                <div
                                    ref={containerRef}
                                    className="relative w-[160px] h-[290px] md:w-[280px] md:h-[500px] cursor-ew-resize select-none group touch-pan-y"
                                    onClick={handleContainerClick}
                                >
                                    {/* Left Image (Gokul Oil - Base) */}
                                    <div
                                        className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
                                        style={{
                                            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                                        }}
                                    >
                                        <div className="relative w-full h-full animate-fade-in">
                                            <Image
                                                key={activeSeedIndex} // Force re-render for clean transition
                                                src={seedData[activeSeedIndex].bottleSrc}
                                                alt={`${seedData[activeSeedIndex].name} Bottle`}
                                                fill
                                                className="object-contain rotate-12 scale-95 transition-all duration-500 ease-in-out"
                                                draggable={false}
                                                sizes="(max-width: 768px) 160px, 280px"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Image (Refined Oil - Top) */}
                                    <div
                                        className="absolute inset-0 w-full h-full overflow-hidden"
                                        style={{
                                            clipPath: `inset(0 0 0 ${sliderPosition}%)`
                                        }}
                                    >
                                        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                                            <Image
                                                key={activeSeedIndex}
                                                src={seedData[activeSeedIndex].refinedBottleSrc}
                                                alt="Refined Oil"
                                                fill
                                                className="object-contain rotate-12 scale-95 transition-all duration-500 ease-in-out"
                                                draggable={false}
                                                sizes="(max-width: 768px) 160px, 280px"
                                            />
                                        </div>
                                    </div>

                                    {/* Slider Handle */}
                                    <div
                                        className="absolute top-0 bottom-0 w-0.5 md:w-1 bg-[#1a4d2e] cursor-ew-resize z-20 shadow-[0_0_10px_rgba(26,77,46,0.5)]"
                                        style={{ left: `${sliderPosition}%` }}
                                        onMouseDown={handleMouseDown}
                                        onTouchStart={handleMouseDown}
                                    >
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-[#1a4d2e] rounded-full flex items-center justify-center text-white shadow-lg border-2 md:border-4 border-white transform transition-transform hover:scale-110 active:scale-95">
                                            <ChevronsLeftRight className="w-4 h-4 md:w-6 md:h-6" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Arrow */}
                                <button
                                    onClick={handleNextSeed}
                                    className="p-3 rounded-full bg-white/90 backdrop-blur-sm border border-green-100 shadow-[0_4px_12px_rgb(0,0,0,0.08)] text-[#1a4d2e] hover:bg-[#1a4d2e] hover:text-white transition-all duration-300 md:hidden active:scale-95 z-20 group"
                                    aria-label="Next Oil"
                                >
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Refined Oil (New Right Card) */}
                    {/* Desktop: Active when <= 50. Inactive (blurred) when > 50 */}
                    <div className={`order-3 lg:order-3 space-y-4 lg:space-y-6 transition-all duration-500 ease-in-out ${sliderPosition > 50
                        ? 'hidden lg:block lg:opacity-50 lg:blur-[2px] lg:scale-95'
                        : 'block lg:opacity-100 lg:blur-0 lg:scale-110 lg:z-10'
                        }`}>
                        <div className="bg-red-50 rounded-2xl md:rounded-3xl p-4 lg:p-8 border border-red-100 shadow-sm h-full flex flex-col justify-center">
                            <h3 className="text-lg lg:text-2xl font-bold text-red-700 mb-4 lg:mb-6 flex items-center gap-3">
                                <span className="w-6 h-6 lg:w-8 lg:h-8 bg-red-200 rounded-full flex items-center justify-center text-red-700 shadow-sm">
                                    <X className="w-4 h-4 lg:w-5 lg:h-5" />
                                </span>
                                {`Branded Refined ${seedData[activeSeedIndex].name}`}
                            </h3>
                            <ul className="space-y-2 lg:space-y-4">
                                {[
                                    'Extracted through a chemically hazardous process',
                                    'Added preservatives',
                                    'Artificial odour or odourless',
                                    'Artificial colour',
                                    'Anti-foaming agent',
                                    'Affects cardiovascular system'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 lg:gap-3 text-gray-700">
                                        <X className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 shrink-0 mt-0.5" />
                                        <span className="text-xs lg:text-base font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
