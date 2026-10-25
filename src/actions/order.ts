'use server';

import { createOrder, getOutOfStockItemNames } from "@/lib/woocommerce";
import { WooOrderPayload } from "@/types/woocommerce";
import { razorpay } from "@/lib/razorpay";

const OUT_OF_STOCK_MESSAGE = "Sorry, this product is currently out of stock. Please check back later.";

export async function checkCartStock(lineItems: WooOrderPayload['line_items']) {
    try {
        return { outOfStock: await getOutOfStockItemNames(lineItems) };
    } catch (error) {
        console.error("Stock check failed:", error);
        return { outOfStock: [] as string[] };
    }
}

export async function placeOrder(orderData: WooOrderPayload) {
    try {
        const outOfStock = await getOutOfStockItemNames(orderData.line_items);
        if (outOfStock.length > 0) {
            return { success: false, error: OUT_OF_STOCK_MESSAGE };
        }

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

        // 0. Block payment for out-of-stock items before any order or charge is created
        const outOfStock = await getOutOfStockItemNames(orderData.line_items);
        if (outOfStock.length > 0) {
            return { success: false, error: OUT_OF_STOCK_MESSAGE };
        }

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

        // LOGGING TO FILE FOR DEBUGGING
        try {
            const fs = require('fs');
            const path = require('path');
            const logPath = path.join(process.cwd(), 'error_log.txt');
            const timestamp = new Date().toISOString();
            const errorDetails = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message;
            const logMessage = `\n[${timestamp}] Error: ${errorDetails}\nStack: ${error.stack}\nRequest Data: ${JSON.stringify(orderData, null, 2)}\n`;
            fs.appendFileSync(logPath, logMessage);
        } catch (logErr) {
            console.error("Failed to write to error log:", logErr);
        }

        // Extract more specific error message if available (e.g., from WooCommerce/Axios)
        let errorMessage = error.message || "Failed to initiate payment";

        if (error.response && error.response.data) {
            const apiError = error.response.data;
            if (apiError.message) {
                errorMessage = `API Error: ${apiError.message}`;
            } else if (apiError.code) {
                errorMessage = `API Error: ${apiError.code}`;
            } else {
                errorMessage = `API Error: ${JSON.stringify(apiError)}`;
            }
        }

        return { success: false, error: errorMessage };
    }
}
