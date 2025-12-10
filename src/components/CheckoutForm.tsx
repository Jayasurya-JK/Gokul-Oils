
'use client';


import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { placeOrder } from '@/actions/order';
import { Loader2, User, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { WooOrderPayload } from '@/types/woocommerce';
import CartProgressBar from './CartProgressBar';

import Script from 'next/script';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutForm() {
    const { cart, cartTotal, clearCart, updateQuantity } = useCart();
    const { user, openAuthModal, isLoading: isAuthLoading, orders } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState('');

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
            // Priority: User Profile Address -> Last Order Address -> Empty
            const lastOrder = orders && orders.length > 0 ? orders[0] : null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const billing: any = user.billing?.address_1 ? user.billing : (lastOrder?.billing || {});

            setFormData(prev => ({
                ...prev,
                firstName: user.first_name || prev.firstName,
                lastName: user.last_name || prev.lastName,
                email: user.email || prev.email,
                phone: user.billing?.phone || user.username || lastOrder?.billing?.phone || prev.phone,

                address1: billing.address_1 || prev.address1,
                city: billing.city || prev.city,
                state: billing.state || prev.state,
                postcode: billing.postcode || prev.postcode,
            }));
        }
    }, [user, orders]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const applyCoupon = () => {
        if (couponCode.toLowerCase() === 'teat01') {
            setCouponDiscount(50);
            setCouponMessage('Coupon applied successfully!');
        } else {
            setCouponDiscount(0);
            setCouponMessage('Invalid coupon code');
        }
    };

    const calculateFinalTotal = () => {
        let total = cartTotal;
        const shipping = total > 999 ? 0 : 50;
        const discount = total > 1500 ? 100 : 0;
        return total + shipping - discount - couponDiscount;
    };

    // Check for URL success params on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === 'true') {
            setSuccess(true);
            clearCart();
            // Clear URL params
            window.history.replaceState({}, '', '/checkout');
        } else if (params.get('error')) {
            setError("Payment processed but failed to update order properly. Please contact support.");
            window.history.replaceState({}, '', '/checkout');
        }
    }, []);

    const handleRazorpayPayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Prepare Order Data
            // NOTE: We do NOT use calculateFinalTotal() here directly because initiateRazorpayOrder logic 
            // relies on the order data sent to WooCommerce.
            // However, we want the WC order to reflect accurate amounts.
            // createOrder on server will use the 'line_items' and prices sent.

            // Wait, we need to ensure the WC Order total matches what we want to charge.
            // We can pass 'fee_lines' or 'coupon_lines' to WC payload to adjust total.
            // Or easier: Let WC calculate the total based on line items?
            // If we manipulate total client-side (minus 50 for shipping, etc), we must mirror this in WC payload using 'fee_lines' (negative fee for discount) or shipping lines.

            const shippingCost = cartTotal > 999 ? 0 : 50;
            const bulkDiscount = cartTotal > 1500 ? 100 : 0;
            const finalTotal = calculateFinalTotal();

            // Construct valid WC Payload
            const orderData: WooOrderPayload = {
                payment_method: "razorpay",
                payment_method_title: "Online Payment",
                set_paid: false,
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
                shipping_lines: [
                    {
                        method_id: "flat_rate",
                        method_title: "Shipping",
                        total: shippingCost.toString()
                    }
                ],
                // Add discount as a negative fee if applicable
                fee_lines: [
                    ...(bulkDiscount > 0 ? [{
                        name: "Bulk Discount",
                        total: (-bulkDiscount).toString(),
                        tax_class: "zero-rate"
                    }] : []),
                    ...(couponDiscount > 0 ? [{
                        name: "Coupon Discount",
                        total: (-couponDiscount).toString(),
                        tax_class: "zero-rate"
                    }] : [])
                ]
            };


            const { initiateRazorpayOrder } = await import('@/actions/order');
            const result = await initiateRazorpayOrder(orderData);

            if (!result.success || !result.razorpayOrderId) {
                throw new Error(result.error || 'Failed to initiate order');
            }

            if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                throw new Error("Payment gateway configuration missing.");
            }

            // Initialize Razorpay with Callback URL (Redirect Mode)
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: result.amount,
                currency: result.currency,
                name: "Gokul Oils",
                description: "Wood Pressed Oils",
                image: "/icons/Goful logo G.png",
                order_id: result.razorpayOrderId,
                // The magic sauce for auto-redirect on mobile apps
                callback_url: `${window.location.origin}/api/payment-callback?wc_order_id=${result.wcOrderId}`,
                redirect: true,
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                notes: {
                    address: `${formData.address1}, ${formData.city}, ${formData.state} - ${formData.postcode}`,
                    wc_order_id: result.wcOrderId
                },
                theme: {
                    color: "#1F4D3C",
                },
                config: {
                    display: {
                        hide: [
                            { method: 'emi' },
                            { method: 'paylater' }
                        ]
                    }
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

    // Removed handlePlaceOrder as it is now handled by server callback

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (paymentMethod === 'cod') {
            setLoading(true);
            // .. COD Logic can remain similar but needs to call placeOrder directly ..
            // For brevity, using placeOrder for COD
            const isCod = true;
            const orderData: WooOrderPayload = {
                payment_method: "cod",
                payment_method_title: "Cash on Delivery",
                set_paid: false,
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
                // Add same fee logic for COD if needed
            };

            const result = await placeOrder(orderData);
            if (result.success) {
                setSuccess(true);
                clearCart();
            } else {
                setError(result.error || "Order failed.");
            }
            setLoading(false);
            return;
        } else {
            await handleRazorpayPayment();
        }
    };

    // Scroll to top on success
    useEffect(() => {
        if (success) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [success]);

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

            {/* Offer Progress Bar */}
            <div className="mb-8 max-w-2xl mx-auto">
                <CartProgressBar cartTotal={cartTotal} className="rounded-2xl border border-gray-100 shadow-sm" />
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

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                        {isAuthLoading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-2xl transition-all duration-300">
                                <div className="flex flex-col items-center">
                                    <Loader2 className="w-8 h-8 text-[#1F4D3C] animate-spin mb-2" />
                                    <p className="text-[#1F4D3C] font-bold text-sm animate-pulse">Syncing your details...</p>
                                </div>
                            </div>
                        )}
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
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Order Summary</span>
                            <div className="flex items-center gap-2">
                                {cart.length > 1 && (
                                    <span className="text-[10px] text-gray-400 font-medium animate-pulse sm:hidden flex items-center gap-1">
                                        Swipe <span className="text-lg leading-none">→</span>
                                    </span>
                                )}
                                <span className="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md">{cart.length} items</span>
                            </div>
                        </div>

                        <div className="flex flex-nowrap sm:flex-col gap-4 mb-6 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide snap-x">
                            {cart.map((item) => {
                                const discount = item.originalPrice && item.originalPrice > item.price
                                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                                    : 0;

                                return (
                                    <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-100 flex gap-4 transition-shadow hover:shadow-md min-w-[85%] w-[85%] sm:min-w-0 sm:w-full shrink-0 snap-center">
                                        <div className="relative w-20 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-0.5 mix-blend-multiply"
                                                unoptimized={true}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <h4 className="text-sm font-bold text-gray-900 mb-1 leading-tight line-clamp-2">{item.name}</h4>
                                            <div className="mb-2">
                                                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">Top Choice</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-base font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                                                {item.originalPrice && item.originalPrice > item.price && (
                                                    <>
                                                        <span className="text-xs text-gray-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
                                                        <span className="text-xs text-[#1F4D3C] font-bold">({discount}% off)</span>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center border border-gray-200 rounded-full h-8 w-28 bg-gray-50/50">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-100 text-gray-500 rounded-l-full disabled:opacity-50"
                                                        type="button"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="flex-1 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-100 text-gray-500 rounded-r-full"
                                                        type="button"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
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

                            {/* Coupon Code Section */}
                            <div className="pt-2">
                                {!couponDiscount ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Coupon Code"
                                            className="flex-1 bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#1F4D3C]"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            className="bg-[#1F4D3C] text-white text-xs font-bold px-4 rounded-lg hover:bg-[#16382b] transition-colors"
                                        >
                                            APPLY
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                                        <span className="text-green-700 font-medium flex items-center gap-1">
                                            <span className="text-xs">🏷️</span> Coupon Applied
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-green-700 font-bold">-₹{couponDiscount}</span>
                                            <button onClick={() => { setCouponDiscount(0); setCouponCode(''); setCouponMessage(''); }} className="text-gray-400 hover:text-red-500">
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {couponMessage && !couponDiscount && <p className="text-xs text-red-500 mt-1 ml-1">{couponMessage}</p>}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 flex justify-between items-center mt-3">
                            <span className="text-base font-bold text-gray-900">Grand Total</span>
                            <span className="text-xl font-bold text-[#1F4D3C]">
                                {/* Calculation: Subtotal + Shipping - Milestone - Coupon */}
                                ₹{calculateFinalTotal().toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Payment</span>
                        </div>

                        {/* Banner for COD */}
                        <div className="bg-[#1F4D3C] text-white text-[10px] font-medium py-2 px-4 text-center tracking-wide">
                            100% Secure Payments via Razorpay
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

                    {/* Desktop Pay Button (Hidden on Mobile) */}
                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={loading}
                        className={`hidden lg:block w-full py-4 rounded-xl font-bold text-base uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 ${paymentMethod !== 'cod' ? 'bg-[#1F4D3C] text-white shadow-green-900/20' : 'bg-gray-900 text-white shadow-gray-900/20'}`}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                            `Pay ₹${calculateFinalTotal().toLocaleString()}`
                        )}
                    </button>

                    <p className="hidden lg:block text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        100% Secure Payments
                    </p>

                    {/* Mobile Sticky Pay Button */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] lg:hidden z-50">
                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-full font-bold text-base uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 ${paymentMethod !== 'cod' ? 'bg-[#1F4D3C] text-white shadow-green-900/20' : 'bg-gray-900 text-white shadow-gray-900/20'}`}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                                `Click to Pay ₹${calculateFinalTotal().toLocaleString()}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
        </div>
    );
}
