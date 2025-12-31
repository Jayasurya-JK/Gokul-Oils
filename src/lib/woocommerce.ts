import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { WooProduct, WooOrder, WooOrderPayload, WooVariation } from "@/types/woocommerce";

// Suppress specific deprecation warnings caused by the woocommerce-rest-api library which uses an older Node.js API
// This prevents the 'DeprecationWarning: url.parse() behavior is not standardized...' error in the console
const originalEmitWarning = process.emitWarning;
// @ts-ignore - Monkey patching to suppress specific unnecessary warning
process.emitWarning = (warning, ...args) => {
    if (typeof warning === 'string' && warning.includes('url.parse()')) {
        return;
    }
    if (typeof warning === 'object' && warning.message && warning.message.includes('url.parse()')) {
        return;
    }
    return (originalEmitWarning as any)(warning, ...args);
};

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

// Cache wrapper for Product Fetching
import { unstable_cache } from 'next/cache';

const getProductsCached = unstable_cache(
    async () => {
        const response = await wooCommerceApi.get("products");
        return response.data;
    },
    ['all-products'],
    { revalidate: 25200 }
);

const getProductBySlugCached = unstable_cache(
    async (slug: string) => {
        const response = await wooCommerceApi.get("products", { slug });
        return response.data;
    },
    ['product-by-slug'],
    { revalidate: 25200 }
);

const getProductVariationsCached = unstable_cache(
    async (productId: number) => {
        const response = await wooCommerceApi.get(`products/${productId}/variations`);
        return response.data;
    },
    ['product-variations'],
    { revalidate: 25200 }
);

export async function getProducts(): Promise<WooProduct[]> {
    try {
        const products = await getProductsCached();
        // Force remove Dummy Product
        return products.filter((p: WooProduct) => !p.name.toLowerCase().includes('dummy product'));
    } catch (error) {
        throw new Error(`WooCommerce API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
    try {
        const data = await getProductBySlugCached(slug);
        return data[0] || null;
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

export async function getProductVariations(productId: number): Promise<WooVariation[]> {
    try {
        return await getProductVariationsCached(productId);
    } catch (error) {
        console.error(`Error fetching variations for product ${productId}:`, error);
        return [];
    }
}

export async function enrichProductWithDefaultVariation(product: WooProduct): Promise<WooProduct> {
    // If no default attributes or not a variable product, return specific product
    if (product.type !== 'variable' || !product.default_attributes || product.default_attributes.length === 0) {
        return product;
    }

    try {
        // Fetch variations
        const variations = await getProductVariations(product.id);

        // Find the variation that matches the default attributes
        const defaultVariation = variations.find(v => {
            return product.default_attributes.every(da => {
                const variationAttribute = v.attributes.find(va => va.name === da.name);
                return variationAttribute && variationAttribute.option === da.option;
            });
        });

        if (defaultVariation) {
            // Create a copy of the product to avoid mutating the original reference if needed
            const enrichedProduct = { ...product };
            enrichedProduct.default_variation_id = defaultVariation.id;

            // Update price fields with the default variation's price
            enrichedProduct.price = defaultVariation.price;
            enrichedProduct.regular_price = defaultVariation.regular_price;
            enrichedProduct.sale_price = defaultVariation.sale_price;
            enrichedProduct.on_sale = defaultVariation.on_sale; // Also update on_sale status

            // Update attributes options order to ensure default option is displayed first in cards
            enrichedProduct.attributes = enrichedProduct.attributes.map(attr => {
                const defaultAttr = product.default_attributes.find(da => da.name === attr.name);
                if (defaultAttr && attr.options.includes(defaultAttr.option)) {
                    // Move the default option to the beginning of the array
                    const newOptions = [
                        defaultAttr.option,
                        ...attr.options.filter(opt => opt !== defaultAttr.option)
                    ];
                    return { ...attr, options: newOptions };
                }
                return attr;
            });

            // Update main image if default variation has a specific image
            if (defaultVariation.image && defaultVariation.image.src) {
                // Ensure the variation image is the first one in the list
                enrichedProduct.images = [
                    defaultVariation.image,
                    ...product.images.filter(img => img.src !== defaultVariation.image?.src)
                ];
            }

            return enrichedProduct;
        }
    } catch (error) {
        console.error(`Failed to enrich product ${product.id} with default variation:`, error);
    }

    return product;
}

export async function enrichProductWithSpecificOption(product: WooProduct, optionName: string): Promise<WooProduct | null> {
    if (product.type !== 'variable') {
        return null; // Skip non-variable products for specific option targeting
    }

    try {
        const variations = await getProductVariations(product.id);

        // Normalize helper
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

        const targetOpt = normalize(optionName);
        const aliases: Record<string, string[]> = {
            '1litre': ['1l', '1liter', '1000ml'],
            '5litre': ['5l', '5liter', '5000ml'],
            '500ml': ['0.5l', 'half liter'],
        };
        const searchTerms = [targetOpt, ...(aliases[targetOpt] || [])];

        const targetVariation = variations.find(v =>
            v.attributes.some(attr => {
                const opt = normalize(attr.option);
                // Check exact match or contains
                return searchTerms.some(term => opt === term || opt.includes(term) || term.includes(opt));
            })
        );

        if (targetVariation) {
            const enrichedProduct = { ...product };
            enrichedProduct.default_variation_id = targetVariation.id;

            // Update price and sale details to match the variation
            enrichedProduct.price = targetVariation.price;
            enrichedProduct.regular_price = targetVariation.regular_price;
            enrichedProduct.sale_price = targetVariation.sale_price;
            enrichedProduct.on_sale = targetVariation.on_sale;

            // Prioritize the target option in the attributes list
            enrichedProduct.attributes = enrichedProduct.attributes.map(attr => {
                const matchingOpt = attr.options.find(opt => {
                    const nOpt = normalize(opt);
                    return searchTerms.some(term => nOpt === term || nOpt.includes(term) || term.includes(nOpt));
                });

                if (matchingOpt) {
                    const newOptions = [
                        matchingOpt,
                        ...attr.options.filter(opt => opt !== matchingOpt)
                    ];
                    return { ...attr, options: newOptions };
                }
                return attr;
            });

            // Update image to the variation's specific image
            if (targetVariation.image && targetVariation.image.src) {
                enrichedProduct.images = [
                    targetVariation.image,
                    ...product.images.filter(img => img.src !== targetVariation.image?.src)
                ];
            }

            return enrichedProduct;
        } else {
            console.log(`No matching variation found for ${product.name} with option ${optionName}. Search terms: ${searchTerms.join(', ')}`);
        }

    } catch (error) {
        console.error(`Failed to enrich product ${product.id} with option ${optionName}:`, error);
    }

    return null; // Return null if option not found
}
