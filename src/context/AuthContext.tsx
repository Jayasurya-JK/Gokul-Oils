'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WooCustomer, WooOrder } from '@/types/woocommerce';
// import { sendOtp, verifyOtp, logoutUser } from '@/actions/auth'; // Legacy OTP
import { signIn, signOut, useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";

interface AuthContextType {
    user: WooCustomer | null;
    orders: WooOrder[];
    isLoading: boolean;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    loginWithGoogle: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Main Provider wrapper that includes SessionProvider
export function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AuthContent>{children}</AuthContent>
        </SessionProvider>
    );
}

function AuthContent({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<WooCustomer | null>(null);
    const [orders, setOrders] = useState<WooOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Sync NextAuth session with our Backend
    useEffect(() => {
        const syncUser = async () => {
            if (status === "authenticated" && session?.user?.email) {
                // If we have a session but no local user data yet, fetch it
                if (!user || user.email !== session.user.email) {
                    setIsLoading(true);
                    try {
                        // We use the same server action but now called automatically
                        // Dynamically import to avoid server-on-client issues
                        const { loginWithGoogle } = await import('@/actions/auth');
                        const result = await loginWithGoogle(
                            session.user.email,
                            session.user.name || '',
                            session.user.image || ''
                        );

                        if (result.success && result.user) {
                            setUser(result.user);
                            setOrders(result.orders || []);
                        }
                    } catch (e) {
                        console.error("Failed to sync user", e);
                    } finally {
                        setIsLoading(false);
                    }
                }
            } else if (status === "unauthenticated") {
                setUser(null);
                setOrders([]);
            }
        };

        syncUser();
    }, [session, status]);

    // Force refresh orders when modal opens
    useEffect(() => {
        if (isAuthModalOpen && user) {
            const refreshOrders = async () => {
                try {
                    const { loginWithGoogle } = await import('@/actions/auth');
                    // Re-fetch using existing credentials to get latest orders
                    const result = await loginWithGoogle(user.email, user.first_name + ' ' + user.last_name, user.avatar_url);
                    if (result.success && result.orders) {
                        setOrders(result.orders);
                    }
                } catch (e) {
                    console.error("Failed to refresh orders", e);
                }
            }
            refreshOrders();
        }
    }, [isAuthModalOpen, user]);

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const loginWithGoogle = () => {
        // Redirects to Google Sign In
        signIn("google");
    };

    const logout = async () => {
        setIsLoading(true);
        await signOut();
        // State clear handled by useEffect
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                orders,
                isLoading: isLoading || status === "loading",
                isAuthModalOpen,
                openAuthModal,
                closeAuthModal,
                loginWithGoogle,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
