'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Phone, Loader2, Package, Calendar, ChevronRight, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, loginWithGoogle, user, orders, logout } = useAuth();
    const [loading, setLoading] = useState(false);

    // Test helper for Google Login simulation
    const [testEmail, setTestEmail] = useState('');

    if (!isAuthModalOpen) return null;


    const handleGoogleLogin = async () => {
        setLoading(true);
        // This will redirect to Google
        await loginWithGoogle();
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={closeAuthModal}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={closeAuthModal}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    {!user ? (
                        <>
                            <div className="text-center mb-8">
                                <Image src="/google-logo.png" width={48} height={48} alt="Google" className="mx-auto mb-4 w-12 h-12" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Sign In with Google
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Use your Google account to track orders and manage addresses.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full bg-white text-gray-700 font-semibold py-3.5 rounded-xl border border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all flex justify-center items-center gap-3 shadow-sm"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                            Continue with Google
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-xs text-center text-gray-400 mt-6">
                                We'll check if you have any past orders with this email.
                            </p>
                        </>
                    ) : (
                        // Logged In View
                        <div className="flex flex-col h-full max-h-[70vh]">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                {user.avatar_url ? (
                                    <Image src={user.avatar_url} width={48} height={48} alt="Avatar" className="rounded-full" />
                                ) : (
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                                        {user.first_name ? user.first_name[0] : 'U'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        {user.first_name} {user.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-gray-500" />
                                    Order History
                                </h4>

                                {orders.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">No orders found.</p>
                                        <p className="text-xs text-gray-400 mt-1">Make sure you used {user.email} at checkout.</p>
                                        <button onClick={closeAuthModal} className="mt-3 text-primary text-sm font-medium hover:underline">
                                            Start Shopping
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors bg-gray-50/50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-sm font-semibold text-gray-900">#{order.id}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ml-2 font-medium capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-bold text-primary">₹{order.total}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(order.date_created).toLocaleDateString()}
                                                </p>
                                                <div className="text-sm text-gray-600 line-clamp-1">
                                                    {order.line_items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Address Section */}
                            {(user.shipping?.address_1 || user.billing?.address_1) && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        Default Address
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                                        <p className="font-medium text-gray-900">{(user.shipping?.first_name || user.billing?.first_name)} {(user.shipping?.last_name || user.billing?.last_name)}</p>
                                        <p>{user.shipping?.address_1 || user.billing?.address_1}</p>
                                        <p>{user.shipping?.city || user.billing?.city}, {user.shipping?.state || user.billing?.state} - {user.shipping?.postcode || user.billing?.postcode}</p>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                            <Phone className="w-3 h-3" />
                                            {user.billing?.phone || 'No phone'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <button
                                    onClick={logout}
                                    className="w-full py-2.5 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors text-sm"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
