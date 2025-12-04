import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/919876543210" // Replace with actual number
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 lg:bottom-8 right-4 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-8 h-8" />
        </a>
    );
}
