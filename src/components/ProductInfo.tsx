
'use client';

import { useState, useEffect } from 'react';
import { Star, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { WooProduct } from '@/types/woocommerce';
import { useCart } from '@/context/CartContext';

interface ProductInfoProps {
    product: WooProduct;
    variations?: WooProduct[];
}

export default function ProductInfo({ product, variations = [] }: ProductInfoProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    // State for selected variation
    // If we have variations, default to the first one, otherwise null (Simple product)
    const [selectedVarId, setSelectedVarId] = useState<number>(
        (variations && variations.length > 0) ? variations[0].id : 0
    );

    const currentVariation = variations?.find(v => v.id === selectedVarId);

    // Determine which data to show (Variation or Parent)
    const activeData = currentVariation || product;

    // Price parsing
    const price = parseInt(activeData.price || activeData.sale_price || activeData.regular_price || "0");
    const regularPrice = parseInt(activeData.regular_price || activeData.price || "0");
    const salePrice = parseInt(activeData.sale_price || activeData.price || "0");
    const isOnSale = activeData.on_sale && salePrice < regularPrice;

    // Helper to get variation Name/Label
    const getVariantLabel = (v: WooProduct) => {
        // Try to find a 'size' or 'volume' attribute
        const attr = v.attributes?.find(a =>
            a.name.toLowerCase().includes('size') ||
            a.name.toLowerCase().includes('volume') ||
            a.name.toLowerCase().includes('weight')
        );
        // Variation attributes from API have 'option' string, Parent attributes have 'options' array.
        // We handle both or cast to any for the variation case.
        return attr ? ((attr as any).option || (attr.options && attr.options[0])) : v.name || 'Option';
    };

    const handleAddToCart = () => {
        addToCart({
            id: activeData.id,
            name: activeData.name,
            price: price,
            quantity: quantity,
            image: activeData.images?.[0]?.src || product.images?.[0]?.src || '',
            slug: product.slug,
            originalPrice: isOnSale ? regularPrice : undefined,
        });
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">
                    {product.name}
                </h1>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Subtitle/Tagline */}
            <p className="text-[10px] md:text-xs tracking-widest text-[#1F4D3C] uppercase mb-2 font-medium">AS PURE AS IT GETS...</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(parseFloat(product.average_rating || "5")) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                </div>
                <span className="text-xs text-gray-500">({product.rating_count || 12} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-4">
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
                    {isOnSale && (
                        <span className="text-base text-gray-400 line-through">MRP ₹{regularPrice.toLocaleString()}</span>
                    )}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">MRP (incl. of all taxes)</p>
            </div>

            {/* Dynamic Variants Grid */}
            {variations.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Select Variant</p>
                    <div className="grid grid-cols-3 gap-3">
                        {variations.map((v) => {
                            const vPrice = parseInt(v.price || "0");
                            const vRegular = parseInt(v.regular_price || v.price || "0");
                            const vLabel = getVariantLabel(v);
                            const isSelected = selectedVarId === v.id;
                            const vOnSale = v.on_sale && vPrice < vRegular;
                            const discount = vOnSale ? Math.round(((vRegular - vPrice) / vRegular) * 100) : 0;

                            return (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVarId(v.id)}
                                    className={`rounded-lg overflow-hidden border w-full transition-all duration-200 ${isSelected
                                            ? 'border-[#1F4D3C] shadow-md ring-1 ring-[#1F4D3C]'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {/* Header */}
                                    <div className={`py-2 px-1 text-center font-medium text-[11px] uppercase tracking-wide ${isSelected ? 'bg-[#1F4D3C] text-white' : 'bg-gray-100 text-gray-700'}`}>
                                        {vLabel}
                                    </div>
                                    {/* Body */}
                                    <div className="bg-white py-3 flex flex-col items-center justify-center min-h-[70px]">
                                        <span className="text-xl font-bold text-gray-900 leading-none mb-1">₹{vPrice.toLocaleString()}</span>
                                    </div>
                                    {/* Discount strip */}
                                    {discount > 0 && (
                                        <div className="bg-white pb-2 flex items-center justify-center gap-1 text-[9px] leading-none">
                                            <span className="text-gray-400 line-through">₹{vRegular}</span>
                                            <span className="text-red-500 font-bold">{discount}% off</span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Actions: Compact Row */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-4">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-md h-10 md:h-12 w-28 md:w-32 bg-white shrink-0">
                    <button
                        onClick={() => handleQuantityChange(-1)}
                        className="w-8 md:w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#1F4D3C] hover:bg-gray-50 font-bold transition-colors"
                    >-</button>
                    <input type="text" value={quantity} readOnly className="w-full h-full text-center bg-transparent border-none focus:ring-0 font-semibold text-gray-700 text-sm" />
                    <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-8 md:w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#1F4D3C] hover:bg-gray-50 font-bold transition-colors"
                    >+</button>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 w-full">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-[#1F4D3C] hover:bg-[#16382b] text-white h-10 md:h-12 rounded-md font-bold text-[10px] sm:text-sm tracking-wider uppercase transition-all shadow-sm flex items-center justify-center"
                    >
                        Add into Cart
                    </button>
                    <Link
                        href={`/checkout`}
                        className="flex-1 bg-[#F2C94C] hover:bg-[#e0b943] text-black h-10 md:h-12 rounded-md font-bold text-[10px] sm:text-sm tracking-wider uppercase transition-all shadow-sm flex items-center justify-center"
                    >
                        Buy Now
                    </Link>
                </div>
            </div>

            {/* Icons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-t border-gray-100 items-start mb-4">
                {[
                    { src: "/icons/Marachekku Machine.png", label: "Free Shipping Above ₹999", sizeClass: "w-28 h-28 md:w-32 md:h-32" },
                    { src: "/icons/Return.png", label: "7 Days Replacement", sizeClass: "w-28 h-28 md:w-32 md:h-32" },
                    { src: "/icons/Free_delivery.png", label: "Traditional Wood Pressed", sizeClass: "w-28 h-28 md:w-32 md:h-32" },
                    { src: "/icons/shield.png", label: "Lab Tested Purity", sizeClass: "w-24 h-24 md:w-24 md:h-24" },
                ].map((feature, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center gap-2">
                        <div className="relative h-28 w-full md:h-32 flex items-center justify-center">
                            <div className={`relative ${feature.sizeClass}`}>
                                <Image
                                    src={feature.src}
                                    alt={feature.label}
                                    fill
                                    className="object-contain"
                                    unoptimized={true}
                                />
                            </div>
                        </div>
                        <span className="text-sm md:text-base font-bold text-[#1F4D3C] leading-tight max-w-[140px] h-10 flex items-start justify-center">{feature.label}</span>
                    </div>
                ))}
            </div>

            {/* Product Short Description (Right Column) - Dynamic */}
            <div className="mb-4 border-t border-gray-100 pt-8">
                <h3 className="text-xl font-bold text-[#1F4D3C] font-playfair mb-4">Product Description</h3>
                <div
                    className="prose prose-sm text-gray-600 max-w-none [&>p]:mb-4 leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: product.short_description || product.description }}
                />
            </div>
        </div>
    );
}
