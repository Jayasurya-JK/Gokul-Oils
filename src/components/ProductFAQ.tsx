"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface ProductFAQProps {
    productName: string;
}

export default function ProductFAQ({ productName }: ProductFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // SEO Friendly, specific to Gokul Oils
    const faqs: FAQItem[] = [
        {
            question: `What makes Gokul Oils ${productName} special?`,
            answer: `Our ${productName} is extracted using the traditional wooden ghani (marachekku) method without any heat or chemicals. This cold-pressed technique preserves all the natural nutrients, aroma, and flavor, making it the purest choice for your kitchen.`
        },
        {
            question: "Is this oil 100% natural and chemical-free?",
            answer: "Yes, absolutely! Gokul Oils guarantees 100% purity. We use no preservatives, no artificial colors, and no added fragrances. It is unrefined, unfiltered, and naturally sedimented to ensure you get nothing but nature's goodness."
        },
        {
            question: "Can I use this oil for deep frying?",
            answer: "Yes, our wood-pressed oils have a high smoke point, making them excellent for Indian cooking styles, including deep frying, sautéing, and tempering. They maintain their stability and nutritional value even at high temperatures."
        },
        {
            question: "Is it suitable for daily skin and hair care?",
            answer: "Certainly! Because it is cold-pressed and sulphur-free, it retains vital vitamins and fatty acids that are excellent for nourishing skin and hair. It's a multipurpose oil for both culinary and cosmetic use."
        },
        {
            question: "How should I store this oil?",
            answer: "Store it in a cool, dry place away from direct sunlight. Since it is natural and unrefined, you might see slight sedimentation at the bottom, which is a sign of purity."
        }
    ];

    return (
        <div className="border-t border-gray-100 pt-6 mt-4">
            <h3 className="text-xl font-bold text-[#1F4D3C] font-playfair text-center mb-6">Frequently Asked Questions</h3>
            <div className="space-y-3">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:border-[#1F4D3C]/30 bg-white">
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full flex justify-between items-center p-4 text-left bg-gray-50/50 hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-semibold text-gray-800 text-sm md:text-base pr-4 text-[#1F4D3C]">
                                Q. {faq.question}
                            </span>
                            <span className="text-[#1F4D3C] shrink-0">
                                {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </span>
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                }`}
                        >
                            <div className="p-4 pt-0 text-sm text-gray-600 leading-relaxed bg-gray-50/50 border-t border-gray-100/50">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
