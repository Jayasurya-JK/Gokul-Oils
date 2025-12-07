'use server';

import { wooCommerceApi } from "@/lib/woocommerce";
import { WooCustomer, WooOrder } from "@/types/woocommerce";

// Mock OTP storage (in memory - will reset on server restart, but fine for demo)
const otpStore: Record<string, string> = {};

// --- Google Login Flow ---

export async function loginWithGoogle(email: string, name: string, photoUrl: string) {
    try {
        console.log(`[AUTH] Attempting Google login for ${email}`);

        // 1. Check if customer exists by email
        let customer = await getCustomerByEmail(email);

        // 2. If not, create new customer
        if (!customer) {
            console.log(`[AUTH] Creating new customer for ${email}`);
            customer = await createCustomerFromGoogle(email, name, photoUrl);
        }

        if (!customer) {
            return { success: false, error: 'Failed to create/find user' };
        }

        // 3. Fetch Orders for this customer
        const orders = await getCustomerOrders(customer.id);

        return { success: true, user: customer, orders };
    } catch (error) {
        console.error("Google Login error:", error);
        return { success: false, error: 'Login failed' };
    }
}

// --- Legacy OTP Flow (Optional) ---

export async function sendOtp(phone: string) {
    // Validate phone number
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
        return { success: false, error: 'Invalid phone number' };
    }

    // Generate Mock OTP
    const otp = '123456';
    otpStore[cleanPhone] = otp;

    console.log(`[AUTH] OTP for ${cleanPhone} is ${otp}`);

    return { success: true, message: 'OTP sent successfully' };
}

export async function verifyOtp(phone: string, otp: string) {
    const cleanPhone = phone.replace(/\D/g, '');

    if (otp !== '123456' && otpStore[cleanPhone] !== otp) {
        return { success: false, error: 'Invalid OTP' };
    }

    delete otpStore[cleanPhone];

    try {
        // Find user by Phone
        let customer = await getCustomerByPhone(cleanPhone);

        if (!customer) {
            customer = await createCustomer(cleanPhone);
        }

        if (!customer) {
            return { success: false, error: 'Failed to create/find user' };
        }

        const orders = await getCustomerOrders(customer.id);

        return { success: true, user: customer, orders };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: 'Login failed' };
    }
}

export async function logoutUser() {
    return { success: true };
}

// --- Helpers ---

async function getCustomerByEmail(email: string): Promise<WooCustomer | null> {
    try {
        const response = await wooCommerceApi.get("customers", { email: email });
        if (response.data && response.data.length > 0) {
            return response.data[0];
        }
        return null;
    } catch (error) {
        console.error("Error searching customer by email:", error);
        return null;
    }
}

async function createCustomerFromGoogle(email: string, name: string, photoUrl: string): Promise<WooCustomer | null> {
    try {
        // Split name into first and last
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        const username = email.split('@')[0];

        const data = {
            email: email,
            first_name: firstName,
            last_name: lastName,
            username: username,
            avatar_url: photoUrl
        };

        const response = await wooCommerceApi.post("customers", data);
        return response.data;
    } catch (error) {
        console.error("Error creating customer from Google:", error);
        return null; // Handle error gracefully
    }
}

async function getCustomerByPhone(phone: string): Promise<WooCustomer | null> {
    try {
        const fakeEmail = `${phone}@gokuloils.in`;
        const response = await wooCommerceApi.get("customers", { email: fakeEmail });
        if (response.data && response.data.length > 0) {
            return response.data[0];
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function createCustomer(phone: string): Promise<WooCustomer | null> {
    try {
        const fakeEmail = `${phone}@gokuloils.in`;
        const data = {
            email: fakeEmail,
            first_name: 'Guest',
            last_name: 'User',
            username: phone,
            billing: {
                phone: phone,
                email: fakeEmail
            }
        };

        const response = await wooCommerceApi.post("customers", data);
        return response.data;
    } catch (error) {
        return null;
    }
}

async function getCustomerOrders(customerId: number): Promise<WooOrder[]> {
    try {
        const response = await wooCommerceApi.get("orders", { customer: customerId });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}
