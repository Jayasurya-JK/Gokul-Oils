import Link from 'next/link';
import { Menu, Search, ShoppingCart, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Left: Hamburger Menu */}
                <button className="p-2 hover:bg-gray-100 rounded-full lg:hidden">
                    <Menu className="w-6 h-6 text-primary" />
                </button>

                {/* Center: Logo */}
                <div className="flex-1 flex justify-center lg:justify-start lg:flex-none">
                    <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
                        Gokul Oils
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
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                        <ShoppingCart className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                        <User className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </header>
    );
}
