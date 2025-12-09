import React from 'react';

interface CartProgressBarProps {
    cartTotal: number;
    className?: string;
}

export default function CartProgressBar({ cartTotal, className = '' }: CartProgressBarProps) {
    if (cartTotal === 0) return null;

    return (
        <div className={`bg-white px-6 pt-6 pb-20 border-b border-gray-100 relative z-10 transition-all duration-300 ${className}`}>
            {/* Dynamic Message */}
            <div className="text-center mb-8">
                {cartTotal < 999 ? (
                    <p className="text-gray-900 font-medium text-sm">
                        Add <span className="font-bold text-[#1F4D3C]">₹{999 - cartTotal}</span> for <span className="font-bold">Free Shipping</span>
                    </p>
                ) : cartTotal < 1500 ? (
                    <p className="text-gray-900 font-medium text-sm">
                        <span className="text-green-600 font-bold">Free Shipping unlocked!</span> Add <span className="font-bold text-[#1F4D3C]">₹{1500 - cartTotal}</span> for <span className="font-bold">Flat ₹100 Off</span>
                    </p>
                ) : (
                    <p className="text-[#1F4D3C] font-bold text-sm flex items-center justify-center gap-2">
                        <span>🎉</span> You've unlocked all offers!
                    </p>
                )}
            </div>

            {/* Progress Visuals */}
            <div className="relative mx-2">
                {/* Track */}
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 rounded-full -translate-y-1/2"></div>

                {/* Fill Line */}
                <div
                    className="absolute top-1/2 left-0 h-1.5 bg-[#1F4D3C] rounded-full -translate-y-1/2 transition-all duration-700 ease-out"
                    style={{
                        width: `${cartTotal < 999
                            ? (cartTotal / 999) * 50
                            : 50 + ((Math.min(cartTotal, 1500) - 999) / (1500 - 999)) * 50}%`
                    }}
                />

                {/* Milestone 1: Free Shipping (50% Visual Position) */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group"
                    style={{ left: '50%' }}
                >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-500 shadow-sm ${cartTotal >= 999 ? 'border-[#1F4D3C] bg-[#1F4D3C] text-white' : 'border-gray-200 bg-white text-gray-400'}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                    </div>
                    <div className={`absolute top-9 pt-1 flex flex-col items-center transition-colors duration-500`}>
                        <span className={`text-[10px] uppercase font-bold tracking-wide whitespace-nowrap ${cartTotal >= 999 ? 'text-[#1F4D3C]' : 'text-gray-400'}`}>
                            Free Shipping
                        </span>
                    </div>
                    <div className="absolute top-[52px] text-[9px] text-gray-400 font-medium">₹999</div>
                </div>

                {/* Milestone 2: 100 Off (100% -> ₹1500) */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group"
                    style={{ left: '100%' }}
                >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-500 shadow-sm ${cartTotal >= 1500 ? 'border-[#1F4D3C] bg-[#1F4D3C] text-white' : 'border-gray-200 bg-white text-gray-400'}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                            <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                    </div>
                    <div className={`absolute top-9 pt-1 flex flex-col items-center transition-colors duration-500`}>
                        <span className={`text-[10px] uppercase font-bold tracking-wide whitespace-nowrap ${cartTotal >= 1500 ? 'text-[#1F4D3C]' : 'text-gray-400'}`}>
                            ₹100 Off
                        </span>
                    </div>
                    <div className="absolute top-[52px] text-[9px] text-gray-400 font-medium">₹1500</div>
                </div>
            </div>
        </div>
    );
}
