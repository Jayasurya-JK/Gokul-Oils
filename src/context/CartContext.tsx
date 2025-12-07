
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
    originalPrice?: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    lastAddedItem: CartItem | null;
    isAddedToCartModalOpen: boolean;
    setIsAddedToCartModalOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // New state for Added to Cart Modal
    const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
    const [isAddedToCartModalOpen, setIsAddedToCartModalOpen] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('gokul_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('gokul_cart', JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    const addToCart = (newItem: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === newItem.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prevCart, newItem];
        });

        // Trigger Popup instead of Drawer
        setLastAddedItem(newItem);
        setIsAddedToCartModalOpen(true);
        // setIsCartOpen(true); // Don't open drawer automatically anymore
    };

    const removeFromCart = (id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
                isCartOpen,
                setIsCartOpen,
                lastAddedItem,
                isAddedToCartModalOpen,
                setIsAddedToCartModalOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
