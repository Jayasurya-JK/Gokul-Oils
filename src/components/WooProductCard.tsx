
'use client';

import { WooProduct } from "@/types/woocommerce";
import { ShoppingCart, Zap, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: WooProduct;
    priority?: boolean;
}

export default function WooProductCard({ product, priority = false }: ProductCardProps) {
    const { addToCart } = useCart();

    // Price Logic
    const regularPrice = parseInt(product.regular_price || product.price || "0");
    const salePrice = parseInt(product.sale_price || product.price || "0");
    const isOnSale = product.on_sale && regularPrice > salePrice;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if card is a link
        addToCart({
            id: product.id,
            name: product.name,
            price: salePrice,
            quantity: 1,
            image: product.images[0]?.src || '',
            slug: product.slug,
            originalPrice: regularPrice
        });
    };

    return (
        <div className="group flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">

            {/* Image Link */}
            <Link href={`/product/${product.slug}`} className="block relative bg-[#f5f5f5] aspect-square overflow-hidden">
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0].src}
                        alt={product.images[0].alt || product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={true}
                        priority={priority}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="text-sm">No Image</span>
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">

                <Link href={`/product/${product.slug}`} className="block">
                    <h3 className="text-lg font-bold text-gray-900 font-playfair mb-1 leading-tight line-clamp-2 hover:text-[#1F4D3C] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-xs text-gray-500 mb-3 italic line-clamp-1">
                    {product.short_description?.replace(/<[^>]*>/g, '').slice(0, 30) || "Pure, traditional wood pressed oil..."}
                </p>

                {/* Pricing Area */}
                <div className="mt-auto space-y-1 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">₹{salePrice.toLocaleString()}</span>
                        {isOnSale && (
                            <span className="text-sm text-gray-400 line-through">₹{regularPrice.toLocaleString()}</span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 mt-2">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-[#1F4D3C] hover:bg-[#16382b] text-white py-2.5 rounded-full font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to cart
                    </button>
                    <Link
                        href={`/checkout`}
                        className="w-full border border-[#1F4D3C] text-[#1F4D3C] hover:bg-[#1F4D3C]/5 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                        <Zap className="w-4 h-4" />
                        Buy Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
