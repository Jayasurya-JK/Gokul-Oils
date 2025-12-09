'use server';

import { getProducts } from "@/lib/woocommerce";
import { WooProduct } from "@/types/woocommerce";

export async function getUpsellProducts(): Promise<WooProduct[]> {
    try {
        const products = await getProducts();

        // Simple logic: Return first 5 variable products or straightforward products
        // Ideally, filtering by 'featured' or 'bestseller' if available
        // For now, returning top 5 products
        return products.slice(0, 10);
    } catch (error) {
        console.error("Failed to fetch upsell products:", error);
        return [];
    }
}
