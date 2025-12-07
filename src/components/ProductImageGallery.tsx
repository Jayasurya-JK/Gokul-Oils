"use client";

import { WooProductImage } from "@/types/woocommerce";
import Image from "next/image";
import { useState } from "react";


interface ProductImageGalleryProps {
    images: WooProductImage[];
    productName: string;
    isOnSale?: boolean;
}

export default function ProductImageGallery({ images, productName, isOnSale }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    if (!images || images.length === 0) {
        return (
            <div className="bg-gray-50 aspect-square flex items-center justify-center rounded-2xl">
                <span className="text-gray-400">No Image Available</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative bg-white aspect-square rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {isOnSale && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold z-10 uppercase tracking-wider rounded">
                        Sale
                    </span>
                )}
                <div className="relative w-full h-full">
                    <Image
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
            </div>

            {/* Thumbnails */}
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
