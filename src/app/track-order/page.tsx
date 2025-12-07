'use client';

import { useState, useRef, useEffect } from 'react';
import { trackOrder } from '@/actions/track-order';
import { WooOrder } from '@/types/woocommerce';
import { Loader2, Package, Search, MapPin, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState<WooOrder | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (order && resultsRef.current) {
            setTimeout(() => {
                const yOffset = -80; // Offset for header
                const element = resultsRef.current;
                if (element) {
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 100);
        }
    }, [order]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);

        if (!orderId || !email) {
            setError('Please enter both Order ID and Billing Email');
            setLoading(false);
            return;
        }

        try {
            const result = await trackOrder(orderId, email);
            if (result.success && result.order) {
                setOrder(result.order);
            } else {
                setError(result.error || 'Could not find order');
            }
        } catch (e) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-[#1F4D3C] font-playfair sm:text-4xl">
                        Track Your Order
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Enter your Order ID and Email to check the status of your delivery.
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="order_id" className="block text-sm font-medium text-gray-700">
                                    Order ID
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Package className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="order_id"
                                        id="order_id"
                                        className="focus:ring-[#1F4D3C] focus:border-[#1F4D3C] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                        placeholder="e.g. 12345"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-500">Found in your confirmation SMS/Email</p>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Billing Email
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="focus:ring-[#1F4D3C] focus:border-[#1F4D3C] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-500">Email used during checkout</p>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1F4D3C] hover:bg-[#16382b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F4D3C] disabled:opacity-70 transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Tracking...
                                </>
                            ) : (
                                'Track Status'
                            )}
                        </button>
                    </form>
                </div>

                {/* Results Section */}
                {order && (
                    <div ref={resultsRef} className="bg-white shadow sm:rounded-lg overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    Order #{order.id}
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <Calendar className="w-4 h-4" />
                                    Placed on {new Date(order.date_created).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-xl font-bold text-[#1F4D3C]">₹{order.total}</p>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Items */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Items Ordered</h3>
                                <ul className="divide-y divide-gray-100">
                                    {order.line_items.map((item) => (
                                        <li key={item.id} className="py-3 flex justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-gray-100 w-12 h-12 rounded-md flex items-center justify-center text-gray-400">
                                                    {/* Start fetching product image if available, for now placeholder */}
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">₹{item.total}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Shipping Info */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Delivery Details</h3>
                                <div className="flex items-start gap-3 text-sm text-gray-600">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {order.shipping.first_name} {order.shipping.last_name}
                                        </p>
                                        <p>{order.shipping.address_1}</p>
                                        <p>{order.shipping.city}, {order.shipping.state} - {order.shipping.postcode}</p>
                                        <p>{order.shipping.country}</p>
                                        <p className="mt-2 text-gray-500">Phone: {order.billing.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Progress / Tracking Link if available */}
                        {/* Note: In real world, we would check for a tracking number meta field here */}
                        <div className="bg-blue-50 px-6 py-4 border-t border-blue-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                <p className="text-sm text-blue-700 font-medium">
                                    We will send updates to {order.billing.email}
                                </p>
                            </div>
                            <Link href="/shop" className="text-sm font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                                Continue Shopping <ArrowRight className="w-4 h-4" />
                            </Link>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
