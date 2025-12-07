
'use client';


import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { placeOrder } from '@/actions/order';
import { Loader2, User } from 'lucide-react';
import { WooOrderPayload } from '@/types/woocommerce';

export default function CheckoutForm() {
    const { cart, cartTotal, clearCart } = useCart();
    const { user, openAuthModal, isLoading: isAuthLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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
                phone: user.billing?.phone || user.username || '', // simplistic fallback
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const orderData: WooOrderPayload = {
            payment_method: "cod",
            payment_method_title: "Cash on Delivery",
            set_paid: false,
            customer_id: user ? user.id : 0, // IMPORTANT: Link order to user
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
        };

        const result = await placeOrder(orderData);

        if (result.success) {
            setSuccess(true);
            clearCart();
        } else {
            setError(result.error || "Something went wrong");
        }
        setLoading(false);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Billing Details */}
            <div>
                <h2 className="text-2xl font-bold text-[#1F4D3C] font-playfair mb-6">Billing Details</h2>

                {/* Login Prompt */}
                {!user && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <User className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-800 font-medium">Already have an account?</p>
                            <button
                                onClick={openAuthModal}
                                className="text-sm text-blue-600 font-bold hover:underline text-left mt-1"
                            >
                                Click here to login with Google to auto-fill details & track this order.
                            </button>
                        </div>
                    </div>
                )}

                {user && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#1F4D3C] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user.first_name?.[0]}
                        </div>
                        <div>
                            <p className="text-sm text-green-800 font-medium">Logged in as {user.first_name}</p>
                            <p className="text-xs text-green-600">{user.email}</p>
                        </div>
                    </div>
                )}

                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            name="firstName"
                            placeholder="First Name"
                            required
                            className="border p-3 rounded-md w-full"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <input
                            name="lastName"
                            placeholder="Last Name"
                            required
                            className="border p-3 rounded-md w-full"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        name="address1"
                        placeholder="Street Address"
                        required
                        className="border p-3 rounded-md w-full"
                        value={formData.address1}
                        onChange={handleChange}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            name="city"
                            placeholder="City"
                            required
                            className="border p-3 rounded-md w-full"
                            value={formData.city}
                            onChange={handleChange}
                        />
                        <input
                            name="state"
                            placeholder="State/Province"
                            required
                            className="border p-3 rounded-md w-full"
                            value={formData.state}
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        name="postcode"
                        placeholder="Postcode / ZIP"
                        required
                        className="border p-3 rounded-md w-full"
                        value={formData.postcode}
                        onChange={handleChange}
                    />
                    <input
                        name="phone"
                        placeholder="Phone"
                        required
                        type="tel"
                        className="border p-3 rounded-md w-full"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <input
                        name="email"
                        placeholder="Email Address"
                        required
                        type="email"
                        className="border p-3 rounded-md w-full"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </form>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-8 rounded-xl h-fit sticky top-24">
                <h2 className="text-2xl font-bold text-[#1F4D3C] font-playfair mb-6">Your Order</h2>
                <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{item.name} x {item.quantity}</span>
                            <span className="font-bold">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                    <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{cartTotal}</span>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 p-3 border border-[#1F4D3C] bg-white rounded-md">
                        <input type="radio" id="cod" name="payment" defaultChecked className="text-[#1F4D3C] focus:ring-[#1F4D3C]" />
                        <label htmlFor="cod" className="font-bold text-gray-800 cursor-pointer">Cash on Delivery</label>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button
                    type="submit"
                    form="checkout-form"
                    disabled={loading}
                    className="w-full bg-[#1F4D3C] hover:bg-[#16382b] text-white py-4 rounded-md font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    Place Order
                </button>
            </div>
        </div>
    );
}
