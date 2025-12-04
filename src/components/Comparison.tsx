import { X, Check } from 'lucide-react';

export default function Comparison() {
    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                    Refined vs Wood-Pressed
                </h2>

                <div className="relative grid md:grid-cols-2 gap-8 md:gap-0 max-w-5xl mx-auto">
                    {/* Center Image (Desktop) */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-64 bg-white rounded-full shadow-xl items-center justify-center border-4 border-white">
                        <div className="text-xs text-center text-gray-400">Bottle<br />Image</div>
                    </div>

                    {/* Left: Refined Oil */}
                    <div className="bg-red-50 rounded-3xl p-8 md:pr-16 border border-red-100 relative">
                        <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center text-red-700">
                                <X className="w-5 h-5" />
                            </span>
                            Refined Oil
                        </h3>
                        <ul className="space-y-4">
                            {[
                                'Extracted using heat & chemicals',
                                'Added preservatives',
                                'Artificial odor/color',
                                'Anti-foaming agents',
                                'Can harm heart health'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-700">
                                    <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Wood-Pressed Oil */}
                    <div className="bg-green-50 rounded-3xl p-8 md:pl-16 border border-green-100 relative">
                        <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2 md:justify-end">
                            Natural Wood-Pressed
                            <span className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-primary">
                                <Check className="w-5 h-5" />
                            </span>
                        </h3>
                        <ul className="space-y-4 md:text-right">
                            {[
                                'Extracted by wooden Ghani',
                                'Zero preservatives',
                                'Natural aroma',
                                'Natural color',
                                'Good fats, heart-friendly'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-700 md:flex-row-reverse">
                                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
