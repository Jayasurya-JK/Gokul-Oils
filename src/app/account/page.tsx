'use client';

import { useAuth } from '@/context/AuthContext';
import { Package, Calendar, MapPin, Phone, LogOut, ChevronRight, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AccountPage() {
    const { user, orders, logout, openAuthModal, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // ...
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#1F4D3C] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading your account...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Not Signed In</h2>
                <p className="text-gray-500 mb-6 text-center max-w-xs">Please sign in to view your orders and manage your account.</p>
                <button
                    onClick={openAuthModal}
                    className="bg-[#1a4d2e] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#143d24] transition-colors"
                >
                    Sign In
                </button>
            </div>
        );
    }

    // Determine address to display: specific user address > last order address > null
    const lastOrder = orders.length > 0 ? orders[0] : null;
    const displayAddress = user.shipping?.address_1 ? user.shipping :
        user.billing?.address_1 ? user.billing :
            lastOrder?.shipping?.address_1 ? lastOrder.shipping :
                lastOrder?.billing?.address_1 ? lastOrder.billing : null;

    // Phone fallback
    const displayPhone = user.billing?.phone || lastOrder?.billing?.phone || 'No phone number';

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24 md:pb-12 pt-20">
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {user.avatar_url ? (
                            <Image
                                src={user.avatar_url}
                                width={80}
                                height={80}
                                alt={user.first_name}
                                className="rounded-full ring-4 ring-[#1a4d2e]/10"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-[#1a4d2e]/10 rounded-full flex items-center justify-center text-[#1a4d2e] font-bold text-2xl ring-4 ring-[#1a4d2e]/10">
                                {user.first_name ? user.first_name[0].toUpperCase() : 'U'}
                            </div>
                        )}
                        <div className="text-center md:text-left">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-0.5">
                                {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="md:ml-auto mt-2 md:mt-0">
                            <button
                                onClick={() => {
                                    logout();
                                    router.push('/');
                                }}
                                className="flex items-center gap-2 text-red-600 font-medium px-4 py-1.5 hover:bg-red-50 rounded-lg transition-colors border border-red-100 text-sm"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Address & Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#1a4d2e]" />
                                Default Address
                            </h2>
                            {displayAddress && displayAddress.address_1 ? (
                                <div className="space-y-3 text-sm text-gray-600">
                                    <p className="font-semibold text-gray-900 text-base">
                                        {displayAddress.first_name || user.first_name} {displayAddress.last_name || user.last_name}
                                    </p>
                                    <p>{displayAddress.address_1}</p>
                                    <p>
                                        {displayAddress.city || ''}, {displayAddress.state || ''} {displayAddress.postcode ? `- ${displayAddress.postcode}` : ''}
                                    </p>
                                    <div className="pt-3 mt-3 border-t border-gray-100 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{displayPhone}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    No default address found. It will be saved automatically when you place your first order.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-[#1a4d2e]" />
                                    Order History
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {orders.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Package className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders yet</h3>
                                        <p className="text-gray-500 mb-6">Looks like you haven't bought anything yet.</p>
                                        <Link href="/shop" className="inline-flex items-center text-[#1a4d2e] font-semibold hover:underline">
                                            Start Shopping <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ) : (
                                    orders.map((order) => (
                                        <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-bold text-gray-900">#{order.id}</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="text-lg font-bold text-[#1a4d2e]">
                                                    ₹{order.total}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(order.date_created).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-gray-400" />
                                                    {order.line_items.length} items
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="text-sm text-gray-900 font-medium">
                                                    {order.line_items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
