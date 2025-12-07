import { WooProduct } from "@/types/woocommerce";
import WooProductCard from "./WooProductCard";
import Link from 'next/link';

interface ProductSectionProps {
    products: WooProduct[];
}

export default function ProductSection({ products }: ProductSectionProps) {
    return (
        <section className="pt-12 pb-4 md:pt-16 md:pb-6 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Bestsellers</h2>
                        <p className="text-gray-500">Pure, wood-pressed oils for your daily needs.</p>
                    </div>
                    <Link href="/shop" className="hidden md:block text-primary font-semibold hover:underline">
                        View All Products
                    </Link>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <div key={product.id} className="snap-center min-w-[240px] md:min-w-[260px]">
                                <WooProductCard product={product} priority={index < 2} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-10 text-gray-400">
                            Loading products...
                        </div>
                    )}
                </div>

                <div className="md:hidden text-center mt-4">
                    <Link href="/shop" className="text-primary font-semibold hover:underline">
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
}
