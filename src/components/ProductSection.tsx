import ProductCard from './ProductCard';

const products = [
    {
        id: 1,
        name: 'Groundnut Oil',
        price: '₹380',
        size: '1L',
        badge: 'Best Seller',
        imageColor: 'bg-yellow-50',
    },
    {
        id: 2,
        name: 'Sesame Oil',
        price: '₹420',
        size: '1L',
        badge: 'Popular',
        imageColor: 'bg-orange-50',
    },
    {
        id: 3,
        name: 'Coconut Oil',
        price: '₹350',
        size: '1L',
        badge: 'Pure',
        imageColor: 'bg-blue-50',
    },
    {
        id: 4,
        name: 'Deepam Oil',
        price: '₹290',
        size: '1L',
        badge: 'New Launch',
        imageColor: 'bg-red-50',
    },
];

export default function ProductSection() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Bestsellers</h2>
                        <p className="text-gray-500">Pure, wood-pressed oils for your daily needs.</p>
                    </div>
                    <a href="/shop" className="hidden md:block text-primary font-semibold hover:underline">
                        View All Products
                    </a>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {products.map((product) => (
                        <div key={product.id} className="snap-center">
                            <ProductCard {...product} />
                        </div>
                    ))}
                </div>

                <div className="md:hidden text-center mt-6">
                    <a href="/shop" className="text-primary font-semibold hover:underline">
                        View All Products
                    </a>
                </div>
            </div>
        </section>
    );
}
