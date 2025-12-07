
import CheckoutForm from "@/components/CheckoutForm";

export const metadata = {
    title: "Checkout - Gokul Oils",
    description: "Secure checkout for Gokul Oils.",
};

export default function CheckoutPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-4xl font-bold text-center text-[#1F4D3C] font-playfair mb-12">Checkout</h1>
            <CheckoutForm />
        </div>
    );
}
