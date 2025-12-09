
import crypto from 'crypto';

export function verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        throw new Error('RAZORPAY_KEY_SECRET is not defined');
    }

    const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(orderId + '|' + paymentId)
        .digest('hex');

    return generatedSignature === signature;
}
