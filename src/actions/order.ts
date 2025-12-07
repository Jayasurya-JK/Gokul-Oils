
'use server';

import { createOrder } from "@/lib/woocommerce";
import { WooOrderPayload } from "@/types/woocommerce";

export async function placeOrder(orderData: WooOrderPayload) {
    try {
        const order = await createOrder(orderData);
        return { success: true, orderId: order.id, orderKey: order.order_key };
    } catch (error) {
        console.error("Order placement failed:", error);
        return { success: false, error: "Failed to place order. Please try again." };
    }
}
