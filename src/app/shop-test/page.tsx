import { getProducts } from "@/lib/woocommerce";

export default async function ShopTestPage() {
    try {
        const products = await getProducts();

        return (
            <div className="p-10">
                <h1 className="text-3xl font-bold mb-6">WooCommerce Connection Test</h1>
                <p className="mb-4 text-green-600">Successfully connected! Found {products.length} products.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="border p-4 rounded shadow">
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                            <div dangerouslySetInnerHTML={{ __html: product.price_html }} />
                            {product.images?.[0] && (
                                <img
                                    src={product.images[0].src}
                                    alt={product.images[0].alt}
                                    className="w-full h-48 object-cover mt-2"
                                />
                            )}
                            <pre className="mt-4 bg-gray-100 p-2 text-xs overflow-auto max-h-40">
                                {JSON.stringify(product, null, 2)}
                            </pre>
                        </div>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        return (
            <div className="p-10">
                <h1 className="text-3xl font-bold mb-6 text-red-600">Connection Failed</h1>
                <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700">
                    {error instanceof Error ? error.message : "Unknown error occurred"}
                </div>
                <p className="mt-4 text-gray-600">
                    Please check your .env.local file and ensure the credentials are correct.
                    <br />
                    Current URL: {process.env.WOOCOMMERCE_SITE_URL}
                </p>
            </div>
        );
    }
}
