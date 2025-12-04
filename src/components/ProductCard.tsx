import { ShoppingCart, MessageCircle } from 'lucide-react';

interface ProductProps {
    name: string;
    price: string;
    size: string;
    badge?: string;
    imageColor: string; // Placeholder for image
}

export default function ProductCard({ name, price, size, badge, imageColor }: ProductProps) {
    return (
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden min-w-[260px] md:min-w-[280px]">
            {/* Badge */}
            {badge && (
                <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                    {badge}
                </span>
            )}

            {/* WhatsApp Icon */}
            <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm hover:bg-[#25D366] hover:text-white text-gray-500 transition-colors z-10">
                <MessageCircle className="w-5 h-5" />
            </button>

            {/* Image Placeholder */}
            <div className={`h-64 w-full ${imageColor} flex items-center justify-center relative overflow-hidden`}>
                <div className="text-gray-400 font-medium">Product Image</div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                    {name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{size}</p>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">{price}</span>
                    <button className="bg-gray-900 hover:bg-primary text-white p-3 rounded-xl transition-colors shadow-lg shadow-gray-200">
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
