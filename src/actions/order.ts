'use server';

import { createOrder, wooCommerceApi } from "@/lib/woocommerce";
import { WooOrderPayload } from "@/types/woocommerce";
import { razorpay } from "@/lib/razorpay";

export async function placeOrder(orderData: WooOrderPayload) {
    try {
        const order = await createOrder(orderData);
        return { success: true, orderId: order.id, orderKey: order.order_key };
    } catch (error) {
        console.error("Order placement failed:", error);
        return { success: false, error: "Failed to place order. Please try again." };
    }
}

export async function initiateRazorpayOrder(orderData: WooOrderPayload) {
    try {
        if (!razorpay) throw new Error("Razorpay configuration missing");

        // 1. Create WooCommerce Order (Pending)
        // Ensure set_paid is false initially
        const wcOrderPayload = { ...orderData, set_paid: false, status: 'pending' };
        const wcOrder = await createOrder(wcOrderPayload);

        if (!wcOrder || !wcOrder.id) {
            throw new Error("Failed to create WooCommerce order");
        }

        // 2. Create Razorpay Order
        const amountInPaise = Math.round(parseFloat(wcOrder.total) * 100);

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `wc_${wcOrder.id}`,
            notes: {
                wc_order_id: wcOrder.id.toString(),
                wc_order_key: wcOrder.order_key
            }
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Optional: specific update to link razorpay order id to WC order metadata now?
        // Not strictly necessary if we verify later, but good for debugging.
        // await wooCommerceApi.put(`orders/${wcOrder.id}`, { meta_data: [{ key: 'razorpay_order_id', value: razorpayOrder.id }] });

        return {
            success: true,
            wcOrderId: wcOrder.id,
            wcOrderKey: wcOrder.order_key,
            razorpayOrderId: razorpayOrder.id,
            amount: amountInPaise,
            currency: 'INR',
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        };

    } catch (error: any) {
        console.error("Initiate Razorpay Order Failed:", error);
        return { success: false, error: error.message || "Failed to initiate payment" };
    }
}
