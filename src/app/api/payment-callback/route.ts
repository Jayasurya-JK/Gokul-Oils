import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay-verify';
import { wooCommerceApi } from '@/lib/woocommerce';

export async function POST(req: NextRequest) {
    try {
        // Parse Form Data (Razorpay sends application/x-www-form-urlencoded)
        const formData = await req.formData();
        const paymentId = formData.get('razorpay_payment_id') as string;
        const orderId = formData.get('razorpay_order_id') as string;
        const signature = formData.get('razorpay_signature') as string;

        // Use searchParams to get the linked WC Order ID
        const { searchParams } = new URL(req.url);
        const wcOrderId = searchParams.get('wc_order_id');

        if (!paymentId || !orderId || !signature || !wcOrderId) {
            console.error("Missing payment details in callback", { paymentId, orderId, signature, wcOrderId });
            return NextResponse.redirect(new URL('/checkout?error=missing_details', req.url), { status: 303 });
        }

        // 1. Verify Signature
        const isValid = verifyRazorpaySignature(orderId, paymentId, signature);
        if (!isValid) {
            console.error("Invalid Signature in Callback");
            return NextResponse.redirect(new URL('/checkout?error=invalid_signature', req.url), { status: 303 });
        }

        // 2. Fetch current order status to avoid double processing
        // (Optional optimization, but nice to have. For now, just update.)

        // 3. Update WooCommerce Order
        // Mark as Processing (Paid)
        await wooCommerceApi.put(`orders/${wcOrderId}`, {
            status: 'processing',
            set_paid: true,
            transaction_id: paymentId,
            date_paid: new Date().toISOString(),
            meta_data: [
                { key: 'razorpay_payment_id', value: paymentId },
                { key: 'razorpay_order_id', value: orderId },
                { key: 'razorpay_signature', value: signature },
                { key: 'payment_method_title', value: 'Online Payment (Razorpay)' }
            ]
        });

        // 4. Redirect to Success Page
        return NextResponse.redirect(new URL('/checkout?success=true', req.url), { status: 303 });

    } catch (error: any) {
        console.error("Payment Callback Error:", error);
        return NextResponse.redirect(new URL('/checkout?error=server_error', req.url), { status: 303 });
    }
}
