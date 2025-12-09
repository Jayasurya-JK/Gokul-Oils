
'use client';

import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, ChevronLeft, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import CartProgressBar from './CartProgressBar';
import CartUpsell from './CartUpsell';

export default function CartDrawer() {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, isCartOpen, setIsCartOpen } = useCart();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">

                {/* 1. Header */}
                <div className="flex items-center justify-between p-4 bg-white sticky top-0 z-10">
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-primary"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold font-playfair text-[#1F4D3C] mx-auto">Your Cart</h2>
                    <button className="p-2 -mr-2 text-[#1F4D3C]">
                        <Heart className="w-6 h-6" />
                    </button>
                </div>

                {/* 2. Trust Banner */}
                <div className="bg-[#1F4D3C] text-white py-2 px-4 text-center font-medium text-sm flex items-center justify-center gap-2 shadow-sm relative z-20">
                    <span>Trusted by 10 Lakh+ Customers</span>
                </div>

                {/* Premium Milestone Progress Bar */}
                {cart.length > 0 && (
                    <CartProgressBar cartTotal={cartTotal} />
                )}

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 pb-24">

                    {/* Empty State */}
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center space-y-4 pt-20 px-4">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <ShoppingCart className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="px-8 py-3 bg-[#1F4D3C] text-white rounded-full font-bold text-sm hover:bg-[#16382b] transition-colors shadow-lg shadow-green-900/10"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 space-y-6">

                            {/* Cart Details Header */}
                            <div className="flex justify-between items-center">
                                <h3 className="flex items-center gap-2 text-xl font-bold text-[#1F4D3C]">
                                    <ShoppingCart className="w-6 h-6" />
                                    Cart details
                                </h3>
                                <span className="text-gray-600 font-medium">Total items: {cartCount}</span>
                            </div>

                            {/* Cart Items Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-6">
                                {cart.map((item) => {
                                    const discount = item.originalPrice && item.originalPrice > item.price
                                        ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                                        : 0;

                                    return (
                                        <div key={item.id} className="flex gap-3 pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                                            {/* Image */}
                                            <div className="relative w-20 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-0.5 mix-blend-multiply"
                                                    unoptimized={true}
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col">
                                                <h4 className="text-sm font-bold text-gray-900 mb-1 leading-tight line-clamp-2">{item.name}</h4>

                                                {/* Badge */}
                                                <div className="mb-1.5">
                                                    <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm">Top Choice</span>
                                                </div>

                                                {/* Pricing */}
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-base font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                                                    {item.originalPrice && item.originalPrice > item.price && (
                                                        <>
                                                            <span className="text-xs text-gray-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
                                                            <span className="text-xs text-[#1F4D3C] font-bold">({discount}% off)</span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Quantity Row */}
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center border border-gray-200 rounded-full h-7 w-24 bg-white">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 rounded-l-full"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="flex-1 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 rounded-r-full"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <CartUpsell />

                            {/* Add More Items */}
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-full border border-[#1F4D3C] text-[#1F4D3C] rounded-full py-3 font-bold flex items-center justify-center gap-2 hover:bg-[#1F4D3C]/5 transition-colors"
                            >
                                Add more items <ChevronLeft className="w-4 h-4 rotate-180" />
                            </button>

                        </div>
                    )}


                </div>

                {/* 3. Bottom Sticky Bar */}
                {cart.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1">
                                <span className="text-2xl font-bold text-gray-900">₹{cartTotal.toLocaleString()}</span>
                                <ChevronLeft className="w-5 h-5 -rotate-90 text-gray-400" />
                            </div>
                            <Link
                                href="/checkout"
                                onClick={() => setIsCartOpen(false)}
                                className="flex-1 bg-[#1F4D3C] hover:bg-[#16382b] text-white py-3.5 rounded-full font-bold text-center text-lg transition-colors shadow-lg shadow-green-900/20"
                            >
                                Continue
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
