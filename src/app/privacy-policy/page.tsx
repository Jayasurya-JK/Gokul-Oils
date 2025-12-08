import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1F4D3C] mb-8 font-serif">Privacy Policy</h1>

            <div className="prose prose-lg text-gray-700 max-w-none">
                <p className="mb-4">Last Updated: December 2025</p>

                <p>
                    At <strong>Gokul Oils</strong>, we value your trust and form a commitment to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you visit our website <strong>www.gokuloils.in</strong> and purchase our wood-pressed oil products.
                </p>

                <h2 className="text-2xl font-bold text-[#1F4D3C] mt-8 mb-4">1. Information We Collect</h2>
                <p>We collect information to provide better services to all our users. This includes:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping address when you register or place an order.</li>
                    <li><strong>Payment Information:</strong> We do not store your credit/debit card details. All payments are processed securely through our trusted payment gateway partners (e.g., Stripe, Razorpay/PhonePe).</li>
                    <li><strong>Account Data:</strong> Login credentials if you create an account with us or sign in using Google.</li>
                </ul>

                <h2 className="text-2xl font-bold text-[#1F4D3C] mt-8 mb-4">2. How We Use Your Information</h2>
                <p>We use the information we collect for the following purposes:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>To process and deliver your orders efficiently.</li>
                    <li>To communicate with you regarding order updates, shipping status, and support.</li>
                    <li>To improve our website functionality and user experience.</li>
                    <li>To prevent fraud and ensure the security of our platform.</li>
                </ul>

                <h2 className="text-2xl font-bold text-[#1F4D3C] mt-8 mb-4">3. Data Security</h2>
                <p>
                    We implement industry-standard security measures to protect your data. Your personal information is stored on secure servers, and sensitive data transmission is encrypted using SSL technology.
                </p>

                <h2 className="text-2xl font-bold text-[#1F4D3C] mt-8 mb-4">4. Cookies</h2>
                <p>
                    Our website uses cookies to enhance your browsing experience, remember your preferences (like items in your cart), and analyze site traffic. You can choose to disable cookies through your browser settings, but this may limit some features of our site.
                </p>

                <h2 className="text-2xl font-bold text-[#1F4D3C] mt-8 mb-4">5. Third-Party Services</h2>
                <p>
                    We may use third-party services such as Google Analytics for tracking and payment gateways for processing transactions. These third parties have their own privacy policies governing the use of your data.
                </p>

                <h2 className="text-2xl font-bold text-[#1F4D3C] mt-8 mb-4">6. Your Rights</h2>
                <p>
                    You have the right to access, correct, or delete your personal information stored with us. If you wish to exercise these rights, please contact our support team.
                </p>

                <h2 className="text-2xl font-bold text-[#1F4D3C] mt-8 mb-4">7. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at:<br />
                    <strong>Email:</strong> sales.gokuloils@gmail.com<br />
                    <strong>Address:</strong> Sri Gokul Enterprises, No:30, Ashok Nagar, Nellikuppam Main Road, Kondur, Cuddalore - 607006, Tamil Nadu.
                </p>
            </div>
        </div>
    );
}
