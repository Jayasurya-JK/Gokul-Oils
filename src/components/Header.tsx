'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { cartCount, setIsCartOpen } = useCart();
    const { openAuthModal, user } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Left: Hamburger Menu */}
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full lg:hidden"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6 text-primary" />
                    </button>

                    {/* Center: Logo */}
                    <div className="flex-1 flex justify-center lg:justify-start lg:flex-none">
                        <Link href="/" className="block relative w-48 h-14 md:w-56 md:h-16">
                            <Image
                                src="/logo.webp"
                                alt="Gokul Oils"
                                fill
                                className="object-contain object-center lg:object-left"
                                unoptimized={true}
                            />
                        </Link>
                    </div>

                    {/* Desktop Nav (Hidden on Mobile) */}
                    <nav className="hidden lg:flex items-center gap-8 mx-auto font-medium text-gray-700">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                        <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                        <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                    </nav>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Search className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCart className="w-5 h-5 text-gray-600" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
                            onClick={openAuthModal}
                        >
                            {user ? (
                                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs ring-2 ring-primary/20">
                                    {user.first_name ? user.first_name[0] : 'U'}
                                </div>
                            ) : (
                                <User className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="absolute top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-white shadow-2xl p-6 animate-in slide-in-from-left duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="relative w-36 h-10">
                                <Image
                                    src="/logo.webp"
                                    alt="Gokul Oils"
                                    fill
                                    className="object-contain object-left"
                                    unoptimized={true}
                                />
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <nav className="flex flex-col gap-6 text-lg font-medium text-gray-700">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-primary">Home</Link>
                            <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="hover:text-primary">Shop</Link>
                            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-primary">About Us</Link>
                            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-primary">Contact</Link>
                        </nav>

                        <div className="mt-auto pt-8 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    openAuthModal();
                                }}
                                className="flex items-center gap-3 text-gray-600 mb-4 w-full text-left"
                            >
                                {user ? (
                                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                                        {user.first_name ? user.first_name[0] : 'U'}
                                    </div>
                                ) : (
                                    <User className="w-5 h-5" />
                                )}
                                <span>{user ? `Hi, ${user.first_name}` : 'My Account'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
