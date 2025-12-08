import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/woocommerce';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://gokuloils.in';

    // Static Routes
    const routes = [
        '',
        '/shop',
        '/about-us', // Assuming you have these pages, or will have them
        '/contact',
        '/privacy-policy',
        '/terms-and-conditions',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    try {
        // Dynamic Product Routes
        const products = await getProducts();
        const productRoutes = products.map((product) => ({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: new Date(product.date_modified || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        return [...routes, ...productRoutes];
    } catch (error) {
        console.error('Failed to generate product sitemap:', error);
        return routes;
    }
}
