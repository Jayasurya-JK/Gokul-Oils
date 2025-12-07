
'use client';

import { useCart } from '@/context/CartContext';
import { X, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AddedToCartModal() {
    const {
        isAddedToCartModalOpen,
        setIsAddedToCartModalOpen,
        lastAddedItem,
        cartCount,
        setIsCartOpen
    } = useCart();

    // Auto-dismiss logic
    useEffect(() => {
        if (isAddedToCartModalOpen) {
            const timer = setTimeout(() => {
                setIsAddedToCartModalOpen(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isAddedToCartModalOpen, setIsAddedToCartModalOpen]);

    if (!isAddedToCartModalOpen || !lastAddedItem) return null;

    const handleContinueShopping = () => {
        setIsAddedToCartModalOpen(false);
    };

    const handleViewCart = () => {
        setIsAddedToCartModalOpen(false);
        setIsCartOpen(true);
    };

    return (
        <div className="fixed top-20 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
            {/* Modal - Wrapper for pointer events */}
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-top-10 duration-300 pointer-events-auto border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-2 text-gray-800 font-medium">
                        <Check className="w-5 h-5 text-[#1F4D3C]" />
                        <span className="font-playfair font-bold text-[#1F4D3C] text-lg">Item added to your cart</span>
                    </div>
                    <button
                        onClick={() => setIsAddedToCartModalOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Product Details */}
                <div className="p-5 bg-white">
                    <div className="flex gap-4 mb-6">
                        <div className="relative w-24 h-24 bg-[#F9F9F9] rounded-md overflow-hidden border border-gray-100 shrink-0">
                            <Image
                                src={lastAddedItem.image}
                                alt={lastAddedItem.name}
                                fill
                                className="object-contain p-2"
                                unoptimized={true}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-gray-900 font-bold mb-1 leading-tight text-lg font-playfair">{lastAddedItem.name}</h3>
                            <p className="text-gray-600 font-medium">₹{lastAddedItem.price.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={handleViewCart}
                            className="flex-1 border-2 border-[#1F4D3C] text-[#1F4D3C] py-2.5 rounded-lg font-bold hover:bg-[#1F4D3C]/5 transition-colors text-sm uppercase tracking-wide"
                        >
                            View cart ({cartCount})
                        </button>
                        <Link
                            href="/checkout"
                            onClick={() => setIsAddedToCartModalOpen(false)}
                            aria-disabled="true" /* Since logic is handled by CartDrawer usually, but here we link directly. */
                            className="flex-1 bg-[#F2C94C] text-black py-2.5 rounded-lg font-bold hover:bg-[#e0b943] transition-colors text-center flex items-center justify-center text-sm uppercase tracking-wide shadow-sm"
                        >
                            Checkout
                        </Link>
                    </div>

                    <button
                        onClick={handleContinueShopping}
                        className="w-full text-center text-[#1F4D3C] font-semibold underline decoration-1 hover:text-[#16382b] text-sm"
                    >
                        Continue shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
