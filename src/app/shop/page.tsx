import { getProducts } from "@/lib/woocommerce";
import WooProductCard from "@/components/WooProductCard";
import { WooProduct } from "@/types/woocommerce";

// Set revalidation time to update products periodically (e.g., every hour)
const revalidate = 3600;

interface ShopPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    let products: WooProduct[] = [];
    let error: string | null = null;
    const resolvedParams = await searchParams;
    const searchQuery = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';

    try {
        products = await getProducts();

        // Filter by Search Query
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.description?.toLowerCase().includes(lowerQuery) ||
                p.short_description?.toLowerCase().includes(lowerQuery)
            );
        }

    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load products";
        console.error("Shop page error:", e);
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header / Hero Section for Shop */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-12 md:py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                        {searchQuery ? `Results for "${searchQuery}"` : "Our Collection"}
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Pure, wood-pressed oils crafted with tradition and care. No chemicals, just nature's goodness.
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12">
                {/* Filters and Sorting can go here later */}

                {error ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong.</h2>
                        <p className="text-gray-600">{error}</p>
                        <p className="text-sm text-gray-500 mt-4">Please try refreshing the page later.</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {searchQuery ? `No products found matching "${searchQuery}"` : "No products found."}
                        </h2>
                        {searchQuery ? (
                            <a href="/shop" className="text-[#1F4D3C] hover:underline mt-4 inline-block">View all products</a>
                        ) : (
                            <p className="text-gray-600 mt-2">We are currently restocking. Please check back soon!</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                        {products.map((product) => (
                            <WooProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

