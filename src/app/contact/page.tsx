import ContactSection from '@/components/ContactSection';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
    return (
        <div className="bg-[#f9fcfa]">
            {/* Page Header */}
            <div className="bg-[#1a4d2e] text-white py-12 md:py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Contact Us</h1>
                    <p className="text-green-100 text-lg max-w-2xl mx-auto">
                        We'd love to hear from you. Reach out to us for any queries or feedback.
                    </p>
                </div>
            </div>

            <ContactSection />

            <section className="py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <ContactForm />
                </div>
            </section>
        </div>
    );
}
