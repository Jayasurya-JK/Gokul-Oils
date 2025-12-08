import About from '@/components/About';

export default function AboutPage() {
    return (
        <div className="bg-[#f9fcfa]">
            {/* Page Header */}
            <div className="bg-[#1a4d2e] text-white py-12 md:py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">About Us</h1>
                    <p className="text-green-100 text-lg max-w-2xl mx-auto">
                        Discover the story behind Gokul Oils and our commitment to purity.
                    </p>
                </div>
            </div>

            <About />
        </div>
    );
}
