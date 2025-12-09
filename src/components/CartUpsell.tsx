'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getUpsellProducts } from '@/actions/shop';
import { useCart } from '@/context/CartContext';
import { WooProduct } from '@/types/woocommerce';
import { Loader2 } from 'lucide-react';

export default function CartUpsell() {
    const { cart, addToCart } = useCart();
    const [products, setProducts] = useState<WooProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<number | null>(null);

    useEffect(() => {
        async function loadProducts() {
            try {
                const fetched = await getUpsellProducts();
                setProducts(fetched);
            } catch (error) {
                console.error("Failed to load upsells", error);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    // Filter out items already in cart
    const upsellItems = products.filter(p => !cart.some(item => item.id === p.id));

    const handleAdd = async (product: WooProduct) => {
        setAddingId(product.id);

        const price = product.price ? parseFloat(product.price) : 0;
        const regularPrice = product.regular_price ? parseFloat(product.regular_price) : 0;

        addToCart({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: price,
            originalPrice: regularPrice,
            image: product.images[0]?.src || '/placeholder.png',
            quantity: 1,
        });

        setAddingId(null);
    };

    if (loading) return null;
    if (upsellItems.length === 0) return null;

    return (
        <div className="mb-6 mt-2">
            <div className="px-6 mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">May we suggest</h3>
            </div>

            {/* Horizontal Scroll List */}
            <div className="flex overflow-x-auto gap-3 px-6 pb-4 scrollbar-hide snap-x">
                {upsellItems.map((product) => {
                    const price = product.price ? parseFloat(product.price) : 0;
                    const regularPrice = product.regular_price ? parseFloat(product.regular_price) : 0;
                    const discount = regularPrice > price
                        ? Math.round(((regularPrice - price) / regularPrice) * 100)
                        : 0;

                    return (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-[140px] md:w-[150px] bg-white border border-gray-100 rounded-lg p-2 snap-start relative group hover:border-[#1F4D3C]/30 transition-colors shadow-sm"
                        >
                            {/* Discount Badge */}
                            {discount > 0 && (
                                <div className="absolute top-2 left-2 bg-[#1F4D3C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm z-10 shadow-sm">
                                    {discount}%
                                </div>
                            )}

                            {/* Image */}
                            <div className="relative w-full h-24 mb-2 bg-gray-50 rounded-md overflow-hidden">
                                {product.images[0] && (
                                    <Image
                                        src={product.images[0].src}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-1 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-900 leading-tight mb-2 line-clamp-2 h-8" title={product.name}>
                                    {product.name}
                                </h4>


                                <div className="flex items-end justify-between">
                                    <div className="flex flex-col leading-none">
                                        <span className="font-bold text-sm text-gray-900">₹{price.toLocaleString()}</span>
                                        {discount > 0 && (
                                            <span className="text-[9px] text-gray-400 line-through mt-0.5">₹{regularPrice.toLocaleString()}</span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleAdd(product)}
                                        disabled={addingId === product.id}
                                        className="bg-white border border-gray-200 hover:border-[#1F4D3C] hover:bg-[#1F4D3C] hover:text-white text-[#1F4D3C] text-[10px] font-bold px-3 py-1.5 rounded-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        {addingId === product.id ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            "Add"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
