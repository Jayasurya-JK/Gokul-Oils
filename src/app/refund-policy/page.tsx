import Link from 'next/link';

export const metadata = {
    title: 'Cancellation & Refund Policy - Gokul Oils',
    description: 'Read our cancellation and refund policies.',
};

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1F4D3C] mb-8 font-playfair border-b pb-4">Cancellation & Refund Policy</h1>

                    <div className="space-y-8 text-gray-700 leading-relaxed bg-white">

                        <section>
                            <h2 className="text-xl font-bold text-[#1F4D3C] mb-3">1. Cancellation Policy</h2>
                            <p className="mb-4">
                                You can cancel your order within <strong>24 hours</strong> of placing it. To cancel, please contact our support team immediately at <a href="mailto:sales.gokuloils@gmail.com" className="text-blue-600 hover:underline">sales.gokuloils@gmail.com</a> or WhatsApp us.
                            </p>
                            <p>
                                Orders that have already been shipped cannot be cancelled. In such cases, you may choose to return the product as per our Return Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#1F4D3C] mb-3">2. Return Policy</h2>
                            <p className="mb-4">
                                We accept returns only if:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>The product received is damaged or leaking.</li>
                                <li>The wrong product was delivered.</li>
                                <li>The product is expired or defective.</li>
                            </ul>
                            <p className="mt-4">
                                To initiate a return, please initiate a request within <strong>48 hours</strong> of delivery. Proof of damage (photos/video) is required.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#1F4D3C] mb-3">3. Refund Process</h2>
                            <p className="mb-4">
                                Once your return is received and inspected, we will notify you of the approval or rejection of your refund.
                            </p>
                            <p className="mb-4">
                                If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment (Credit Card, UPI, etc.) within <strong>5-7 business days</strong>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#1F4D3C] mb-3">4. Late or Missing Refunds</h2>
                            <p>
                                If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company or bank, as it may take some time before your refund is officially posted.
                                <br />
                                If you’ve done all of this and you still have not received your refund yet, please contact us at <a href="mailto:sales.gokuloils@gmail.com" className="text-blue-600 hover:underline">sales.gokuloils@gmail.com</a>.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </main>
    );
}
