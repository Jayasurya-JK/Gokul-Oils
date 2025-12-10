'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
    // Accordion state for mobile
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer className="bg-[#0a6847] text-[#F4E6C3] pt-12 pb-24 lg:pb-8 overflow-hidden relative">


            <div className="container mx-auto px-4 relative z-10">

                {/* ================= DESKTOP LAYOUT ================= */}
                <div className="hidden lg:grid grid-cols-12 gap-8 mb-2">
                    {/* Left Column: Brand & Address */}
                    <div className="col-span-3 pr-4">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden relative shadow-md">
                                <Image
                                    src="/icons/Goful logo G.png"
                                    alt="Gokul Oils"
                                    fill
                                    className="object-cover scale-[1.35]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-serif font-bold text-white leading-none">Gokul Oils</h2>
                                <span className="text-[10px] text-[#F4E6C3] uppercase tracking-wider font-semibold mt-1">
                                    Wood-Pressed • 100% Natural
                                </span>
                            </div>
                        </Link>

                        <div className="space-y-4 text-sm text-[#F4E6C3]/80 mb-8 leading-relaxed max-w-xs">
                            <p><strong>Store Address:</strong><br /> No:30, Ashok Nagar, Nellikuppam Main Road,<br /> Cuddalore - 607006</p>
                            <p><strong>Contact:</strong> +91 94450 99191</p>
                            <p><strong>Email:</strong> sales.gokuloils@gmail.com</p>
                        </div>


                    </div>

                    {/* Quick Links */}
                    <div className="col-span-2 pt-4">
                        <h3 className="font-bold text-[#F4E6C3] mb-6 tracking-wide uppercase">Quick Links</h3>
                        <ul className="space-y-3 text-sm font-medium text-white/90">
                            <li><Link href="/shop" className="hover:text-[#F4E6C3] transition-colors">Shop</Link></li>
                            <li><Link href="/track-order" className="hover:text-[#F4E6C3] transition-colors">Track Order</Link></li>
                            <li><Link href="/about" className="hover:text-[#F4E6C3] transition-colors">Our Story</Link></li>
                            <li><Link href="/contact" className="hover:text-[#F4E6C3] transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Wood Pressed Oils */}
                    <div className="col-span-3 pt-4">
                        <h3 className="font-bold text-[#F4E6C3] mb-6 tracking-wide uppercase">Wood Pressed Oils</h3>
                        <ul className="space-y-3 text-sm font-medium text-white/90">
                            <li><Link href="/product/wood-pressed-groundnut-oil" className="hover:text-[#F4E6C3] transition-colors">Groundnut Oil</Link></li>
                            <li><Link href="/product/wood-pressed-coconut-oil" className="hover:text-[#F4E6C3] transition-colors">Coconut Oil</Link></li>
                            <li><Link href="/product/sesame-oil" className="hover:text-[#F4E6C3] transition-colors">Sesame Oil</Link></li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div className="col-span-2 pt-4">
                        <h3 className="font-bold text-[#F4E6C3] mb-6 tracking-wide uppercase">Policies</h3>
                        <ul className="space-y-3 text-sm font-medium text-white/90">
                            <li><Link href="/privacy-policy" className="hover:text-[#F4E6C3] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/shipping-policy" className="hover:text-[#F4E6C3] transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-[#F4E6C3] transition-colors">Refund Policy</Link></li>
                            <li><Link href="/terms-and-conditions" className="hover:text-[#F4E6C3] transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Need Help Column (New) */}
                    <div className="col-span-2 pt-4">
                        <h3 className="font-bold text-[#F4E6C3] mb-6 tracking-wide uppercase text-sm">Need Help?</h3>
                        <Link href="/contact" className="inline-block bg-[#F4E6C3] text-[#0a6847] px-6 py-2 rounded-full font-bold text-sm hover:bg-white transition-colors mb-6 shadow-lg">
                            Contact Us
                        </Link>

                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 bg-[#F4E6C3] rounded-full flex items-center justify-center text-[#0a6847] hover:bg-white transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-[#F4E6C3] rounded-full flex items-center justify-center text-[#0a6847] hover:bg-white transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="mailto:sales.gokuloils@gmail.com" className="w-9 h-9 bg-[#F4E6C3] rounded-full flex items-center justify-center text-[#0a6847] hover:bg-white transition-colors">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>


                {/* ================= MOBILE LAYOUT ================= */}
                <div className="lg:hidden flex flex-col">

                    {/* Brand Centered */}
                    <div className="mb-8 flex justify-center">
                        <Link href="/" className="inline-flex items-center gap-3 group text-left">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden relative shadow-md">
                                <Image
                                    src="/icons/Goful logo G.png"
                                    alt="Gokul Oils"
                                    fill
                                    className="object-cover scale-[1.35]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-serif font-bold text-white leading-none">Gokul Oils</h2>
                                <span className="text-[10px] text-[#F4E6C3] uppercase tracking-wider font-semibold mt-1">
                                    Wood-Pressed • 100% Natural
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Accordion: Quick Links */}
                    <div className="w-full border-b border-[#F4E6C3]/20">
                        <button
                            onClick={() => toggleSection('quick-links')}
                            className="w-full flex justify-between items-center py-4 font-bold text-[#F4E6C3] tracking-wide text-left"
                        >
                            QUICK LINKS
                            <ChevronDown className={`w-5 h-5 transition-transform ${openSection === 'quick-links' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openSection === 'quick-links' ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                            <ul className="space-y-3 text-sm text-white/90 pb-2 text-left pl-2">
                                <li><Link href="/shop">Shop</Link></li>
                                <li><Link href="/track-order">Track Order</Link></li>
                                <li><Link href="/about">Our Story</Link></li>
                                <li><Link href="/contact">Contact</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Accordion: Wood Pressed Oils */}
                    <div className="w-full border-b border-[#F4E6C3]/20">
                        <button
                            onClick={() => toggleSection('oils')}
                            className="w-full flex justify-between items-center py-4 font-bold text-[#F4E6C3] tracking-wide text-left"
                        >
                            WOOD PRESSED OILS
                            <ChevronDown className={`w-5 h-5 transition-transform ${openSection === 'oils' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openSection === 'oils' ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                            <ul className="space-y-3 text-sm text-white/90 pb-2 text-left pl-2">
                                <li><Link href="/product/wood-pressed-groundnut-oil">Groundnut Oil</Link></li>
                                <li><Link href="/product/wood-pressed-coconut-oil">Coconut Oil</Link></li>
                                <li><Link href="/product/sesame-oil">Sesame Oil</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Accordion: Policies */}
                    <div className="w-full border-b border-[#F4E6C3]/20 mb-8">
                        <button
                            onClick={() => toggleSection('policies')}
                            className="w-full flex justify-between items-center py-4 font-bold text-[#F4E6C3] tracking-wide text-left"
                        >
                            POLICIES
                            <ChevronDown className={`w-5 h-5 transition-transform ${openSection === 'policies' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openSection === 'policies' ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                            <ul className="space-y-3 text-sm text-white/90 pb-2 text-left pl-2">
                                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                                <li><Link href="/shipping-policy">Shipping Policy</Link></li>
                                <li><Link href="/refund-policy">Refund Policy</Link></li>
                                <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Need Help Row */}
                    <div className="flex justify-between items-center mb-10 w-full px-1">
                        <span className="font-bold text-[#F4E6C3] tracking-wide text-lg">NEED HELP?</span>
                        <Link href="/contact" className="bg-[#F4E6C3] text-[#0a6847] px-6 py-2 rounded-full font-bold text-sm hover:bg-white transition-colors shadow-lg">
                            Contact Us
                        </Link>
                    </div>

                    {/* Social Icons Centered */}
                    <div className="flex justify-center gap-4 mb-8">
                        <a href="#" className="w-12 h-12 bg-[#F4E6C3] rounded-full flex items-center justify-center text-[#0a6847] hover:scale-105 transition-transform">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="#" className="w-12 h-12 bg-[#F4E6C3] rounded-full flex items-center justify-center text-[#0a6847] hover:scale-105 transition-transform">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="mailto:sales.gokuloils@gmail.com" className="w-12 h-12 bg-[#F4E6C3] rounded-full flex items-center justify-center text-[#0a6847] hover:scale-105 transition-transform">
                            <Mail className="w-6 h-6" />
                        </a>
                        <a href="#" className="w-12 h-12 bg-[#F4E6C3] rounded-full flex items-center justify-center text-[#0a6847] hover:scale-105 transition-transform">
                            <X className="w-6 h-6" />
                        </a>
                    </div>

                    {/* Address Centered */}
                    <div className="text-center w-full mb-8">
                        <div className="text-xs text-[#F4E6C3]/80 space-y-1">
                            <p><strong>Store Address:</strong> No:30, Ashok Nagar, <br />Nellikuppam Main Road, Cuddalore</p>
                        </div>
                    </div>



                </div>

                {/* Copyright & Credits - Visible on all screens */}
                <div className="pt-8 text-center border-t border-[#F4E6C3]/20">
                    <p className="text-xs text-[#F4E6C3]/90 mb-2">
                        Copyright © {new Date().getFullYear()} Gokul Oils. All Rights Reserved.
                    </p>
                    <p className="text-[10px] text-[#F4E6C3]/80 uppercase tracking-widest">
                        Designed and Managed by Jay Webstudio
                    </p>
                </div>
            </div>
        </footer>
    );
}
