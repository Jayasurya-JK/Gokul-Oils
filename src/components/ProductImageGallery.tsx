"use client";

import { WooProductImage } from "@/types/woocommerce";
import Image from "next/image";
import { useState, useEffect } from "react";


interface ProductImageGalleryProps {
    images: WooProductImage[];
    productName: string;
    isOnSale?: boolean;
}

export default function ProductImageGallery({ images, productName, isOnSale }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<WooProductImage | null>(images && images.length > 0 ? images[0] : null);

    // Update selected image when images prop changes (e.g. variation change)
    useEffect(() => {
        if (images && images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [images]);

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

        const currentIndex = images.findIndex(img => img.id === selectedImage.id);

        if (isLeftSwipe && currentIndex < images.length - 1) {
            setSelectedImage(images[currentIndex + 1]);
        }
        if (isRightSwipe && currentIndex > 0) {
            setSelectedImage(images[currentIndex - 1]);
        }
    };

    if (!images || images.length === 0 || !selectedImage) {
        return (
            <div className="bg-gray-50 aspect-square flex items-center justify-center rounded-2xl">
                <span className="text-gray-400">No Image Available</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div
                className="relative bg-white aspect-square rounded-xl border border-gray-200 overflow-hidden shadow-sm touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {isOnSale && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold z-10 uppercase tracking-wider rounded">
                        Sale
                    </span>
                )}

                {/* Swipe Hint (Mobile Only) */}
                {images.length > 1 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 lg:hidden pointer-events-none opacity-50">
                        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-white text-xl">›</span>
                        </div>
                    </div>
                )}

                <div className="relative w-full h-full transition-transform duration-300 ease-out">
                    <Image
                        key={selectedImage.id} // Key change triggers animation
                        src={selectedImage.src}
                        alt={selectedImage.alt || productName}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain"
                        priority={true}
                        loading="eager"
                        unoptimized={true}
                    />
                </div>

                {/* Mobile Dots Indicator */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 lg:hidden">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${images[idx].id === selectedImage.id ? 'bg-[#1F4D3C] w-4' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Thumbnails (Desktop & Tablet) */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {images.map((image) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedImage(image)}
                            className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all snap-start ${selectedImage.id === image.id
                                ? "border-[#1F4D3C]"
                                : "border-gray-100 hover:border-gray-300"
                                }`}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt || productName}
                                fill
                                sizes="100px"
                                className="object-cover"
                                unoptimized={true}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
