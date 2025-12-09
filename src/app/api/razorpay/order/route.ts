import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
    try {
        if (!razorpay) {
            return NextResponse.json(
                { error: 'Razorpay keys are missing in server configuration.' },
                { status: 500 }
            );
        }

        const { amount, currency } = await request.json();

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { error: error.message || 'Error creating order' },
            { status: 500 }
        );
    }
}
