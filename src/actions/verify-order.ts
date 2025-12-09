'use server';

import { createOrder } from "@/lib/woocommerce";
import { verifyRazorpaySignature } from "@/lib/razorpay-verify";
import { WooOrderPayload } from "@/types/woocommerce";

interface VerifyAndPlaceOrderParams {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    orderData: WooOrderPayload;
}

export async function verifyAndPlaceOrder({
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderData
}: VerifyAndPlaceOrderParams) {
    try {
        // 1. Verify Signature
        const isValid = verifyRazorpaySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            console.error("Invalid Razorpay Signature");
            return { success: false, error: "Payment verification failed. Invalid signature." };
        }

        // 2. Create Order in WooCommerce
        // Ensure the transaction ID is set to the verified payment ID
        const finalOrderData = {
            ...orderData,
            transaction_id: razorpay_payment_id,
            set_paid: true,
            meta_data: [
                ...(orderData.meta_data || []),
                { key: 'razorpay_payment_id', value: razorpay_payment_id },
                { key: 'razorpay_order_id', value: razorpay_order_id },
                { key: 'razorpay_signature', value: razorpay_signature }
            ]
        };

        const order = await createOrder(finalOrderData);
        return { success: true, orderId: order.id, orderKey: order.order_key };

    } catch (error: any) {
        console.error("Order placement failed:", error);
        return { success: false, error: error.message || "Failed to place order." };
    }
}
