'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Focus after a small delay to ensure animation/rendering is ready
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
            onClose();
            setQuery('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                <form onSubmit={handleSearch} className="flex items-center p-4">
                    <Search className="w-6 h-6 text-gray-400 ml-2" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for products..."
                        className="flex-1 h-12 px-4 text-lg text-gray-900 outline-none placeholder:text-gray-400 bg-transparent"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </form>

                {/* Visual suggestion: "Popular: Coconut Oil, Groundnut Oil..." could act here */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex gap-2 overflow-x-auto">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap py-1">Popular:</span>
                    {['Coconut Oil', 'Groundnut Oil', 'Sesame Oil', 'Ghee'].map(term => (
                        <button
                            key={term}
                            type="button"
                            onClick={() => {
                                setQuery(term);
                                router.push(`/shop?search=${encodeURIComponent(term)}`);
                                onClose();
                            }}
                            className="text-sm text-gray-600 hover:text-[#1F4D3C] hover:underline whitespace-nowrap bg-white px-3 py-1 rounded-full border border-gray-200"
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
