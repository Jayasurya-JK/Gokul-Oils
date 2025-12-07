'use server';

import { wooCommerceApi } from "@/lib/woocommerce";
import { WooOrder } from "@/types/woocommerce";

export async function trackOrder(orderId: string, email: string) {
    try {
        console.log(`[TRACK] Tracking order #${orderId} for ${email}`);

        // 1. Fetch the order by ID
        const response = await wooCommerceApi.get(`orders/${orderId}`);
        const order: WooOrder = response.data;

        // 2. Security Check: verify the email matches the order
        // We check billing email OR shipping email to be safe
        const billingEmail = order.billing?.email?.toLowerCase() || '';

        if (billingEmail !== email.toLowerCase()) {
            // Intentionally vague error for security (don't reveal if order exists)
            return { success: false, error: 'Order not found with these details.' };
        }

        return { success: true, order };
    } catch (error) {
        console.error("Track Order error:", error);
        // If 404 or other error
        return { success: false, error: 'Order not found or invalid details.' };
    }
}
