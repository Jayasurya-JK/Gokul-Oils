import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0a6847] text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            {/* Icon: White circle wrapper cropping to the 'G' */}
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden relative shadow-md">
                                <Image
                                    src="/icons/Goful logo G.png"
                                    alt="Gokul Oils"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>

                            {/* HTML Text */}
                            <div className="flex flex-col">
                                <h2 className="text-xl md:text-2xl font-bold font-serif leading-tight">Gokul Oils</h2>
                                <span className="text-[10px] md:text-xs text-green-200 uppercase tracking-wider font-medium group-hover:text-white transition-colors">
                                    Wood-Pressed • 100% Natural
                                </span>
                            </div>
                        </Link>

                        <p className="text-green-100 mb-6 leading-relaxed">
                            Bringing the purity of tradition to your kitchen. 100% wood-pressed, chemical-free oils for a healthier life.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-green-100">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/shop" className="hover:text-white transition-colors">Shop Oils</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Our Products</h3>
                        <ul className="space-y-4 text-green-100">
                            <li><Link href="/shop/groundnut" className="hover:text-white transition-colors">Groundnut Oil</Link></li>
                            <li><Link href="/shop/sesame" className="hover:text-white transition-colors">Sesame Oil</Link></li>
                            <li><Link href="/shop/coconut" className="hover:text-white transition-colors">Coconut Oil</Link></li>
                            <li><Link href="/shop/deepam" className="hover:text-white transition-colors">Deepam Oil</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-green-100">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 shrink-0 mt-1" />
                                <span>
                                    No:30, Ashok Nagar, Nellikuppam Main Road,<br />
                                    Opp to VKM Mini Mahal, Kondur,<br />
                                    Cuddalore - 607006
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 shrink-0" />
                                <span>+91 94450 99191 / 63855 71021</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 shrink-0" />
                                <span>sales.gokuloils@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 pb-20 md:pb-0 flex flex-col md:flex-row justify-between items-center gap-4 text-green-200 text-sm">
                    <p className="order-2 md:order-1">&copy; {new Date().getFullYear()} Gokul Oils. All rights reserved.</p>
                    <div className="flex flex-row gap-4 md:gap-6 items-center order-1 md:order-2">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <span className="text-green-200/50">|</span>
                        <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
