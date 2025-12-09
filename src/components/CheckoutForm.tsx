
'use client';


import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { placeOrder } from '@/actions/order';
import { Loader2, User } from 'lucide-react';
import { WooOrderPayload } from '@/types/woocommerce';
import CartProgressBar from './CartProgressBar';

import Script from 'next/script';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutForm() {
    const { cart, cartTotal, clearCart } = useCart();
    const { user, openAuthModal, isLoading: isAuthLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        city: '',
        state: '',
        postcode: '',
        email: '',
        phone: '',
    });

    // Auto-fill form when user logs in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                phone: user.billing?.phone || user.username || '',
                address1: user.billing?.address_1 || '',
                city: user.billing?.city || '',
                state: user.billing?.state || '',
                postcode: user.billing?.postcode || '',
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateFinalTotal = () => {
        let total = cartTotal;
        const shipping = total > 999 ? 0 : 50;
        const discount = total > 1500 ? 100 : 0;
        return total + shipping - discount;
    };

    const handleRazorpayPayment = async () => {
        setLoading(true);
        setError('');

        try {
            const finalAmount = calculateFinalTotal();

            // 1. Create Order on Server
            const response = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: finalAmount }),
            });

            const order = await response.json();

            if (!response.ok) {
                // Handle HTML error responses (500s from Next.js) gracefully
                if (typeof order === 'string') {
                    throw new Error('Server error. Please contact support.');
                }
                throw new Error(order.error || 'Failed to create order');
            }

            if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                throw new Error("Payment gateway configuration missing (Client ID).");
            }

            // 2. Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Gokul Oils",
                description: "Wood Pressed Oils",
                image: "/icons/Goful logo G.png",
                order_id: order.id,
                handler: async function (response: any) {
                    await handlePlaceOrder(response.razorpay_payment_id, response.razorpay_order_id);
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                notes: {
                    address: `${formData.address1}, ${formData.city}, ${formData.state} - ${formData.postcode}`
                },
                theme: {
                    color: "#1F4D3C",
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                setError(response.error.description || "Payment Failed");
                setLoading(false);
            });
            rzp1.open();

        } catch (err: any) {
            console.error("Payment Error:", err);
            setError(err.message || 'Something went wrong with payment initialization');
            setLoading(false);
        }
    };

    const handlePlaceOrder = async (paymentId?: string, orderId?: string) => {
        const isCod = paymentMethod === 'cod';

        const orderData: WooOrderPayload = {
            payment_method: isCod ? "cod" : "razorpay",
            payment_method_title: isCod ? "Cash on Delivery" : "Online Payment",
            set_paid: !isCod,
            transaction_id: paymentId || '',
            customer_id: user ? user.id : 0,
            billing: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                address_1: formData.address1,
                city: formData.city,
                state: formData.state,
                postcode: formData.postcode,
                country: "IN",
                email: formData.email,
                phone: formData.phone,
            },
            shipping: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                address_1: formData.address1,
                city: formData.city,
                state: formData.state,
                postcode: formData.postcode,
                country: "IN",
            },
            line_items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
            })),
            meta_data: paymentId ? [
                { key: 'razorpay_payment_id', value: paymentId },
                { key: 'razorpay_order_id', value: orderId || '' }
            ] : []
        };

        const result = await placeOrder(orderData);

        if (result.success) {
            setSuccess(true);
            clearCart();
        } else {
            setError(result.error || "Order placement failed after payment. Please contact support.");
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (paymentMethod === 'cod') {
            // Logic for COD (currently disabled)
            setLoading(true);
            setError("COD is currently unavailable.");
            setLoading(false);
            return;
        } else {
            await handleRazorpayPayment();
        }
    };

    if (success) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-3xl font-bold text-[#1F4D3C] mb-4">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-8">Thank you for shopping with Gokul Oils. Your order has been received.</p>
                <div className="flex justify-center gap-4">
                    <a href="/shop" className="bg-[#1F4D3C] text-white px-8 py-3 rounded-md font-bold hover:bg-[#16382b] transition-colors">
                        Continue Shopping
                    </a>
                    {/* Optional: Add View Order button if logged in */}
                </div>

            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <a href="/shop" className="text-[#1F4D3C] font-bold hover:underline">Go to Shop</a>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Step Progress Implementation (Visual only for now) */}
            <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2 bg-[#1F4D3C]/10 px-4 py-2 rounded-full">
                    <span className="w-6 h-6 rounded-full bg-[#1F4D3C] text-white flex items-center justify-center text-xs font-bold">1</span>
                    <span className="text-sm font-bold text-[#1F4D3C]">Details</span>
                    <div className="w-8 h-px bg-[#1F4D3C]/30 mx-2"></div>
                    <span className="w-6 h-6 rounded-full bg-[#1F4D3C] text-white flex items-center justify-center text-xs font-bold">2</span>
                    <span className="text-sm font-bold text-[#1F4D3C]">Payment</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                {/* Left Column: Form Details */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Login Banner */}
                    {!user && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden group cursor-pointer" onClick={openAuthModal}>
                            <div className="relative z-10 flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">📦</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight">Login to track your order details!</h3>
                                    <p className="text-gray-500 text-xs">View order history & save your address</p>
                                </div>
                            </div>
                            <button className="relative z-10 bg-[#1F4D3C] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#16382b] transition-colors">Login</button>
                            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white/40 to-transparent"></div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-[#1F4D3C] rounded-full"></span>
                            Contact & Shipping
                        </h2>

                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                            {/* Phone Number - Special Styling to match reference */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mobile Number</label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-3 flex items-center gap-2 border-r border-gray-200 pr-3 h-6">
                                        <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 rounded-[2px]" />
                                        <span className="text-sm font-bold text-gray-700">+91</span>
                                    </div>
                                    <input
                                        name="phone"
                                        required
                                        type="tel"
                                        placeholder="Phone number"
                                        className="pl-24 bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#1F4D3C] focus:border-[#1F4D3C] block w-full p-3.5 outline-none transition-all font-medium placeholder:text-gray-400 shadow-sm"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">First Name</label>
                                    <input
                                        name="firstName"
                                        required
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#1F4D3C] focus:border-[#1F4D3C] block w-full p-3.5 outline-none transition-all font-medium placeholder:text-gray-400 shadow-sm"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Last Name</label>
                                    <input
                                        name="lastName"
                                        required
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#1F4D3C] focus:border-[#1F4D3C] block w-full p-3.5 outline-none transition-all font-medium placeholder:text-gray-400 shadow-sm"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Delivery Address</label>
                                <input
                                    name="address1"
                                    required
                                    placeholder="House No, Building, Street"
                                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#1F4D3C] focus:border-[#1F4D3C] block w-full p-3.5 outline-none transition-all font-medium placeholder:text-gray-400 shadow-sm"
                                    value={formData.address1}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">City</label>
                                    <input
                                        name="city"
                                        required
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#1F4D3C] focus:border-[#1F4D3C] block w-full p-3.5 outline-none transition-all font-medium placeholder:text-gray-400 shadow-sm"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Pincode</label>
                                    <input
                                        name="postcode"
                                        required
                                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#1F4D3C] focus:border-[#1F4D3C] block w-full p-3.5 outline-none transition-all font-medium placeholder:text-gray-400 shadow-sm"
                                        value={formData.postcode}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    name="email"
                                    required
                                    type="email"
                                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#1F4D3C] focus:border-[#1F4D3C] block w-full p-3.5 outline-none transition-all font-medium placeholder:text-gray-400 shadow-sm"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Order Summary & Payment */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 h-fit">

                    {/* Collapsible Order Summary Look */}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/60">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Order Summary</span>
                            <span className="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md">{cart.length} items</span>
                        </div>
                        <div className="space-y-3 mb-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700 font-medium line-clamp-1 w-2/3">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                    <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t border-dashed border-gray-300 pt-3 space-y-2">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>

                            {/* Delivery Fee Logic: > 999 Free, else 50 */}
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Delivery Fee</span>
                                {cartTotal > 999 ? (
                                    <span className="text-green-600 font-bold">FREE</span>
                                ) : (
                                    <span className="text-gray-900">₹50</span>
                                )}
                            </div>

                            {/* Milestone Discount: > 1500 get 100 off */}
                            {cartTotal > 1500 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#1F4D3C] font-medium">Bulk Discount Applied</span>
                                    <span className="text-[#1F4D3C] font-bold">-₹100</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-3 flex justify-between items-center mt-3">
                            <span className="text-base font-bold text-gray-900">Grand Total</span>
                            <span className="text-xl font-bold text-[#1F4D3C]">
                                {/* Calculation: Subtotal + Shipping - Milestone */}
                                ₹{(() => {
                                    let total = cartTotal;
                                    const shipping = total > 999 ? 0 : 50;
                                    const discount = total > 1500 ? 100 : 0;
                                    let final = total + shipping - discount;
                                    return final.toLocaleString();
                                })()}
                            </span>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Payment</span>
                            <div className="flex gap-1 opacity-60 grayscale">
                                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        {/* Banner for COD */}
                        <div className="bg-gray-900 text-white text-[10px] font-medium py-2 px-4 text-center tracking-wide">
                            100% Secure Payments. Trusted by millions.
                        </div>

                        <div className="divide-y divide-gray-100">
                            {/* Option 1: UPI */}
                            <div
                                onClick={() => setPaymentMethod('upi')}
                                className={`p-4 cursor-pointer transition-all hover:bg-gray-50 group flex items-start gap-4 ${paymentMethod === 'upi' ? 'bg-[#1F4D3C]/5' : ''}`}
                            >
                                <div className="w-5 mt-0.5">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[#1F4D3C] bg-[#1F4D3C]' : 'border-gray-300'}`}>
                                        {paymentMethod === 'upi' && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-gray-900 text-sm">Pay using UPI</h4>
                                    </div>
                                    <div className="flex gap-4 items-center opacity-90 grayscale-[0.2]">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-4 w-auto object-contain" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="h-4 w-auto object-contain" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="h-3 w-auto object-contain" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-3 w-auto object-contain" />
                                    </div>
                                </div>
                            </div>

                            {/* Option 2: Cards */}
                            <div
                                onClick={() => setPaymentMethod('card')}
                                className={`p-4 cursor-pointer transition-all hover:bg-gray-50 group flex items-start gap-4 ${paymentMethod === 'card' ? 'bg-[#1F4D3C]/5' : ''}`}
                            >
                                <div className="w-5 mt-0.5">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#1F4D3C] bg-[#1F4D3C]' : 'border-gray-300'}`}>
                                        {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-gray-900 text-sm">Credit / Debit Cards</h4>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">Visa, Mastercard, RuPay, Amex</p>
                                    <div className="flex -space-x-1 pl-1">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-4 w-auto object-contain" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2.5 w-auto object-contain self-center ml-2" />
                                    </div>
                                </div>
                            </div>

                            {/* COD (Disabled) */}
                            <div className="p-4 flex items-start gap-4 bg-gray-50/80 cursor-not-allowed border-l-4 border-l-transparent">
                                <div className="w-5 mt-0.5">
                                    <div className="w-5 h-5 rounded-full border border-gray-300 bg-gray-100"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-gray-400 text-sm">Cash on Delivery</h4>
                                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Unavailable</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">Pay cash upon receiving your order.</p>
                                    <div className="text-[11px] text-red-600 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100 flex gap-2 items-start">
                                        <span className="mt-0.5">⚠️</span>
                                        <span>Due to logistics issue COD is paused. Will be back soon.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex gap-3 items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 animate-pulse"></div>
                        {error}
                    </div>}

                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-base uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 ${paymentMethod !== 'cod' ? 'bg-[#1F4D3C] text-white shadow-green-900/20' : 'bg-gray-900 text-white shadow-gray-900/20'}`}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                            // Logic: Show exact final amount
                            `Pay ₹${(() => {
                                let total = cartTotal;
                                const shipping = total > 999 ? 0 : 50;
                                const discount = total > 1500 ? 100 : 0;
                                let final = total + shipping - discount;
                                return final.toLocaleString();
                            })()}`
                        )}
                    </button>

                    <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        100% Secure Payments
                    </p>
                </div>
            </div>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
        </div>
    );
}
