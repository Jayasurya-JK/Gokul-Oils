
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const oils = [
    {
        name: "Gokul Groundnut Oil",
        image: "/icons/Gokul oils Bottle Transition.webp",
        url: "/product/wood-pressed-groundnut-oil",
        uses: ["Deep Frying", "Sautéing", "Daily Cooking"],
        weather: "Any Weather",
        benefits: "Heart Health & Cholesterol Control",
        aroma: "Traditional Nutty Aroma",
        nutrients: "Rich in Vitamin E, MUFA, PUFA",
        flavor: "Rich & Authentic Nutty",
        color: "bg-yellow-50",
        buttonColor: "bg-yellow-600"
    },
    {
        name: "Gokul Coconut Oil",
        image: "/icons/Coconut oil Gokul.webp",
        url: "/product/wood-pressed-coconut-oil",
        uses: ["Cooking", "Baking", "Skin & Hair Care"],
        weather: "All Seasons",
        benefits: "Boosts Metabolism & Immunity",
        aroma: "Fresh Copra Aroma",
        nutrients: "High in Lauric Acid (50%)",
        flavor: "Sweet, Natural Coconut",
        color: "bg-green-50",
        buttonColor: "bg-green-600"
    },
    {
        name: "Gokul Sesame Oil",
        image: "/icons/Sesame Oil Gokul.webp",
        url: "/product/sesame-oil",
        uses: ["Indian Gravies", "Pickling", "Oil Pulling"],
        weather: "Cool Weather",
        benefits: "Bone Strength & Body Cooling",
        aroma: "Strong Earthy Scent",
        nutrients: "Zinc, Copper, Magnesium",
        flavor: "Robust & Distinctive",
        color: "bg-orange-50",
        buttonColor: "bg-orange-600"
    }
];

const rows = [
    { label: "Uses", key: "uses", isList: true },
    { label: "Suitable Weather", key: "weather" },
    { label: "Good For", key: "benefits" },
    { label: "Aroma", key: "aroma" },
    { label: "Nutrients (RDA)", key: "nutrients" },
    { label: "Flavour", key: "flavor" },
];

export default function OilComparisonTable() {
    return (
        <div className="w-full py-8 md:py-12 bg-white">
            <div className="text-center mb-6 md:mb-10 px-4">
                <h2 className="text-2xl md:text-4xl font-bold text-[#1F4D3C] font-playfair mb-2 md:mb-3">
                    Know Your Oils
                </h2>
                <p className="text-xs md:text-base text-gray-500">
                    A simple guide to uses, benefits, and flavors.
                </p>
            </div>

            <div className="overflow-x-auto pb-4 relative scrollbar-hide">
                {/* Removed overflow-hidden to allow sticky to work properly relative to this scrolling container */}
                <div className="min-w-[500px] md:min-w-[800px] border border-gray-100 rounded-xl shadow-sm relative isolate">

                    {/* Header Row (Products) */}
                    {/* Mobile: 110px sticky col. Desktop: 200px sticky col. */}
                    <div className="grid grid-cols-[110px_repeat(3,1fr)] md:grid-cols-[200px_repeat(3,1fr)] bg-white divide-x divide-gray-100 rounded-t-xl">
                        {/* Sticky "Features" Header Cell - Empty feature text removed as requested */}
                        <div className="p-2 md:p-6 flex items-center justify-center font-bold text-gray-300 md:text-gray-400 uppercase tracking-wider text-[10px] md:text-sm bg-gray-50 sticky left-0 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] rounded-tl-xl border-b border-gray-100">

                        </div>

                        {/* Product Columns */}
                        {oils.map((oil, idx) => (
                            <div key={oil.name} className={`p-2 md:p-6 flex flex-col items-center text-center relative group min-w-[130px] md:min-w-[200px] border-b border-gray-100 ${idx === oils.length - 1 ? 'rounded-tr-xl' : ''}`}>
                                <Link href={oil.url} className="absolute inset-0 z-10" />

                                {/* External Link Icon - Always Visible, Top Right */}
                                <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
                                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-[#1F4D3C]" />
                                </div>

                                {/* Reduced image height on mobile */}
                                <div className="relative w-16 h-28 md:w-24 md:h-48 mb-2 md:mb-4 transition-transform group-hover:scale-105 duration-300 flex items-center justify-center">
                                    <Image
                                        src={oil.image}
                                        alt={oil.name}
                                        fill
                                        className="object-contain drop-shadow-md"
                                        unoptimized={true}
                                    />
                                </div>
                                {/* Compact text on mobile */}
                                <h3 className="font-bold text-gray-900 text-xs md:text-lg mb-1 leading-tight">{oil.name.replace('Gokul ', '')}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Data Rows */}
                    {rows.map((row, idx) => (
                        <div key={row.key} className={`grid grid-cols-[110px_repeat(3,1fr)] md:grid-cols-[200px_repeat(3,1fr)] divide-x divide-gray-100 border-t border-gray-100 hover:bg-gray-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'} ${idx === rows.length - 1 ? 'rounded-b-xl' : ''}`}>
                            {/* Sticky Label Cell */}
                            <div className={`p-2 md:p-4 px-3 md:px-6 font-bold text-[10px] md:text-base text-gray-700 bg-gray-100 flex items-center sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] break-words leading-tight ${idx === rows.length - 1 ? 'rounded-bl-xl' : ''}`}>
                                {row.label}
                            </div>

                            {/* Value Cells */}
                            {oils.map((oil, oilIdx) => (
                                <div key={`${oil.name}-${row.key}`} className={`p-2 md:p-4 px-1 md:px-6 text-[10px] md:text-sm text-gray-600 leading-snug flex items-center justify-center text-center min-w-[130px] md:min-w-[200px] ${idx === rows.length - 1 && oilIdx === oils.length - 1 ? 'rounded-br-xl' : ''}`}>
                                    {row.isList && Array.isArray(oil[row.key as keyof typeof oil]) ? (
                                        <ul className="space-y-0.5 md:space-y-1">
                                            {(oil[row.key as keyof typeof oil] as string[]).map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>{String(oil[row.key as keyof typeof oil])}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
