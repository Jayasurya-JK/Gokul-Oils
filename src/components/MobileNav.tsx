import Link from 'next/link';
import { Home, Droplet, Tag, User } from 'lucide-react';

export default function MobileNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                <Link href="/" className="flex flex-col items-center gap-1 text-primary">
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link href="/shop" className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                    <Droplet className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Oils</span>
                </Link>
                <Link href="/deals" className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                    <Tag className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Deals</span>
                </Link>
                <Link href="/account" className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Account</span>
                </Link>
            </div>
        </div>
    );
}
