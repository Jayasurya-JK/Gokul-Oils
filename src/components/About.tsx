import Link from 'next/link';
import Image from 'next/image';

export default function About() {
    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-white p-8 border border-green-50">
                            <Image
                                src="/icons/Marachekku Machine Colored.webp"
                                alt="Traditional Wood Pressing (Marachekku)"
                                fill
                                className="object-contain p-4"
                            />
                            {/* Fallback color if image is missing is handled by parent bg, but for now we rely on alt or just text if image fails loading */}
                            <div className="absolute inset-0 bg-green-900/10"></div>
                        </div>
                        {/* Decorative blob or element */}
                        <div className="absolute -z-10 top-[-20%] left-[-20%] w-[140%] h-[140%] bg-green-50 rounded-full blur-3xl opacity-50"></div>
                    </div>

                    <div className="w-full lg:w-1/2 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#1a4d2e] leading-tight font-serif">
                            Our Roots in Tradition
                        </h2>
                        <div className="h-1 w-20 bg-[#1a4d2e]"></div>

                        <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                            <p>
                                <strong>Gokul Oils</strong> is a proud part of <strong>Sri Gokul Enterprises</strong>, established in 2020. Based in Cuddalore, we have grown to become one of the most trusted and leading manufacturers of authentic wood-pressed (Marachekku) edible oils.
                            </p>
                            <p>
                                For over 5 years (since 2020), our physical store in Cuddalore has been a beacon of purity, serving our community with oils extracted using traditional methods that preserve natural aroma, color, and nutrients. We believe in transparency and health, ensuring every drop that reaches your kitchen is free from chemicals and preservatives.
                            </p>
                            <p>
                                At Gokul Oils, we don't just sell oil; we deliver a promise of good health and the rich heritage of our ancestors.
                            </p>
                        </div>

                        {/* Sister Concern / Group Info */}
                        <div className="mt-8 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                            <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">Part of Sri Gokul Enterprises</h3>
                            <p className="text-gray-700 mb-4">
                                Our commitment to sustainability extends beyond oils. Our group also operates <strong>Surya's Solar</strong>, a trusted name in residential solar installation in Cuddalore.
                            </p>
                            <ul className="space-y-2 mb-4 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Official vendor for Tata Power Sunroof Solar
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Over 100kW+ installed capacity across 50+ homes
                                </li>
                            </ul>
                            <Link
                                href="https://suryassolar.com"
                                target="_blank"
                                className="inline-flex items-center text-[#1a4d2e] font-semibold hover:underline"
                            >
                                Visit Surya's Solar →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
