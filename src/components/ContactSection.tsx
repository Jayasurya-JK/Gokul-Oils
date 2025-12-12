import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactSection() {
    return (
        <section className="py-16 bg-[#f9fcfa]">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1a4d2e] mb-4 font-serif">Visit Our Store</h2>
                    <p className="text-gray-600">
                        Experience the aroma of freshly pressed oil at our manufacturing unit and store in Cuddalore.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Address Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#1a4d2e] mb-6">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a4d2e] mb-4">Our Location</h3>
                        <p className="text-gray-600 leading-relaxed">
                            No:30, Ashok Nagar,<br />
                            Nellikuppam Main Road,<br />
                            Opp to VKM Mini Mahal, Kondur,<br />
                            Cuddalore - 607006
                        </p>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#1a4d2e] mb-6">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a4d2e] mb-4">Call Us</h3>
                        <p className="text-gray-600 mb-2">For orders and enquiries:</p>
                        <div className="space-y-1">
                            <a href="tel:+919445099191" className="block text-lg font-semibold text-[#1a4d2e] hover:underline">
                                +91 94450 99191
                            </a>
                        </div>
                    </div>

                    {/* Hours/Email Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#1a4d2e] mb-6">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a4d2e] mb-4">Get in Touch</h3>
                        <p className="text-gray-600 mb-4">
                            Email us anytime at:<br />
                            <a href="mailto:sales.gokuloils@gmail.com" className="font-semibold text-[#1a4d2e] hover:underline">sales.gokuloils@gmail.com</a>
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                            <Clock className="w-4 h-4" />
                            <span>Mon - Sat: 9:00 AM - 9:00 PM</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
