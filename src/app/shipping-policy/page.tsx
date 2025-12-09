import Link from 'next/link';

export const metadata = {
    title: 'Shipping Policy - Gokul Oils',
    description: 'Read our shipping and delivery policies.',
};

export default function ShippingPolicyPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1F4D3C] mb-8 font-playfair border-b pb-4">Shipping Policy</h1>

                    <div className="space-y-8 text-gray-700 leading-relaxed bg-white">

                        <section>
                            <h2 className="text-xl font-bold text-[#1F4D3C] mb-3">1. Order Processing</h2>
                            <p>
                                All orders are processed within <strong>1 to 2 business days</strong> (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#1F4D3C] mb-3">2. Shipping Rates & Estimates</h2>
                            <p className="mb-4">
                                Shipping charges for your order will be calculated and displayed at checkout.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Standard Shipping:</strong> Usually takes 3-7 business days depending on delivery location.</li>
                                <li><strong>Free Shipping:</strong> Available for orders above ₹999.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#1F4D3C] mb-3">3. How do I check the status of my order?</h2>
                            <p className="mb-4">
                                When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
                            </p>
                            <p>
                                If you haven’t received your order within 7 days of receiving your shipping confirmation email, please contact us at <a href="mailto:sales.gokuloils@gmail.com" className="text-blue-600 hover:underline">sales.gokuloils@gmail.com</a> with your name and order number, and we will look into it for you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#1F4D3C] mb-3">4. Shipping to Remote Areas</h2>
                            <p>
                                Standard shipping is available for most pin codes in India. If your location is in a remote area, additional shipping days may apply. We will notify you if there are any restrictions for your specific location.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#1F4D3C] mb-3">5. Damaged Orders</h2>
                            <p>
                                In the unlikely event that your order arrives damaged in any way, please email us as soon as possible at <a href="mailto:sales.gokuloils@gmail.com" className="text-blue-600 hover:underline">sales.gokuloils@gmail.com</a> with your order number and a photo of the item’s condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </main>
    );
}
