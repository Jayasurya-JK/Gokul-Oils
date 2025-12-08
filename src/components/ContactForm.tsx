'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
    };

    if (status === 'success') {
        return (
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100 text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a4d2e] mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">Thank you for reaching out. We will get back to you shortly.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="text-[#1a4d2e] font-semibold underline hover:text-green-700"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-2xl font-bold text-[#1a4d2e] mb-6">Send us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a4d2e] focus:ring-1 focus:ring-[#1a4d2e] outline-none transition-all placeholder:text-gray-400"
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a4d2e] focus:ring-1 focus:ring-[#1a4d2e] outline-none transition-all placeholder:text-gray-400"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a4d2e] focus:ring-1 focus:ring-[#1a4d2e] outline-none transition-all placeholder:text-gray-400"
                        placeholder="How can we help?"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                    <textarea
                        id="message"
                        required
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a4d2e] focus:ring-1 focus:ring-[#1a4d2e] outline-none transition-all placeholder:text-gray-400 resize-none"
                        placeholder="Tell us more completely..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-[#1a4d2e] text-white py-4 rounded-xl font-bold hover:bg-[#143d24] transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {status === 'submitting' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Send Message
                            <Send className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
