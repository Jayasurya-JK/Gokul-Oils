
import { getProductBySlug, getProductVariations } from "@/lib/woocommerce";
import { MessageCircle, ShoppingCart, Truck, ShieldCheck, Leaf, Star, Share2, Phone, RotateCcw, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductFAQ from "@/components/ProductFAQ";
import OilComparisonTable from "@/components/OilComparisonTable";
import ProductInfo from "@/components/ProductInfo";

export const revalidate = 3600;

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    // Fetch variations if variable product
    const variations = product.type === 'variable' ? await getProductVariations(product.id) : [];

    const price = product.sale_price || product.regular_price || product.price;
    const isOnSale = product.on_sale && product.sale_price;

    return (
        <div className="bg-white min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Breadcrumb / Back Link */}
                <div className="mb-6">
                    <Link href="/shop" className="text-gray-500 hover:text-[#1F4D3C] text-sm font-medium transition-colors">
                        ← Back to Shop
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                    {/* Left Column: Image Gallery (Sticky) */}
                    <div className="lg:sticky lg:top-24 lg:self-start lg:h-fit z-10">
                        <ProductImageGallery
                            images={product.images}
                            productName={product.name}
                            isOnSale={Boolean(isOnSale)}
                        />
                    </div>

                    {/* Right Column: Product Details */}
                    <ProductInfo product={product} variations={variations} />
                </div>

                {/* Uses & FAQ Section - Full Width Below Main Grid */}
                {/* Changed container width to max-w-6xl for wider display on desktop */}
                <div className="max-w-6xl mx-auto mt-16 px-4">
                    {/* Uses */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-[#1F4D3C] font-playfair text-center mb-8 relative inline-block w-full">
                            <span className="relative z-10 bg-white px-6">Uses</span>
                            <span className="absolute left-0 top-1/2 w-full h-px bg-gray-200 -z-0"></span>
                        </h3>
                        {/* Centered container but left-aligned text for readability */}
                        <div className="max-w-3xl mx-auto">
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-base text-gray-700 leading-relaxed list-disc pl-5 marker:text-[#1F4D3C]">
                                <li>Use for stir-frying vegetables, adding a distinctive nutty flavour.</li>
                                <li>Spray on tandoors for making rotis.</li>
                                <li>Perfect for deep-frying snacks and appetizers, achieving a crispy texture with less oil absorption.</li>
                                <li>Coat grilling food for enhanced taste.</li>
                                <li>Use to temper lentils and veggies.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="mb-6">
                        <OilComparisonTable />
                    </div>

                    {/* FAQ */}
                    <div className="w-full">
                        <ProductFAQ productName={product.name} />
                    </div>
                </div>
            </div>
        </div>
    );
}
