'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Droplet, User, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MobileNav() {
    const { openAuthModal, user } = useAuth();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Shop', href: '/shop', icon: Droplet },
        { name: 'Track', href: '/track-order', icon: Package },
    ];

    if (pathname === '/checkout') return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a4d2e] backdrop-blur-md border-t border-[#235c39] lg:hidden z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="flex justify-around items-center h-[70px] px-2">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 ${active ? 'text-white' : 'text-green-200/60 hover:text-white'
                                }`}
                        >
                            <item.icon
                                className={`w-6 h-6 transition-transform duration-300 ${active ? 'scale-110 stroke-[2.5px]' : 'scale-100 stroke-2'}`}
                            />
                            <span className={`text-[11px] font-medium transition-all ${active ? 'font-bold' : ''}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}

                {(isMounted && user) ? (
                    <Link
                        href="/account"
                        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 ${isActive('/account') ? 'text-white' : 'text-green-200/60 hover:text-white'
                            }`}
                    >
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-[#1a4d2e] font-bold text-xs ring-2 ring-white/20 shadow-sm">
                            {user.first_name ? user.first_name[0].toUpperCase() : 'U'}
                        </div>
                        <span className={`text-[11px] font-medium ${isActive('/account') ? 'font-bold' : ''}`}>
                            Account
                        </span>
                    </Link>
                ) : (
                    <button
                        onClick={openAuthModal}
                        className="flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 text-green-200/60 hover:text-white"
                    >
                        <User className="w-6 h-6 stroke-2" />
                        <span className="text-[11px] font-medium">
                            Account
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}
