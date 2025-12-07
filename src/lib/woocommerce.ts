import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { WooProduct, WooOrder, WooOrderPayload } from "@/types/woocommerce";

if (!process.env.WOOCOMMERCE_SITE_URL || !process.env.WOOCOMMERCE_CONSUMER_KEY || !process.env.WOOCOMMERCE_CONSUMER_SECRET) {
    throw new Error("WooCommerce environment variables are missing");
}

export const wooCommerceApi = new WooCommerceRestApi({
    url: process.env.WOOCOMMERCE_SITE_URL,
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    version: "wc/v3",
    axiosConfig: {
        timeout: 60000 // 60 seconds
    }
});

export async function getProducts(): Promise<WooProduct[]> {
    try {
        const response = await wooCommerceApi.get("products");
        return response.data;
    } catch (error) {
        throw new Error(`WooCommerce API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
    try {
        const response = await wooCommerceApi.get("products", {
            slug: slug,
        });
        return response.data[0] || null;
    } catch (error) {
        console.error(`Error fetching product with slug ${slug}:`, error);
        return null;
    }
}

export async function createOrder(data: WooOrderPayload): Promise<WooOrder> {
    try {
        const response = await wooCommerceApi.post("orders", data);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function getProductVariations(productId: number): Promise<WooProduct[]> {
    try {
        const response = await wooCommerceApi.get(`products/${productId}/variations`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching variations for product ${productId}:`, error);
        return [];
    }
}
