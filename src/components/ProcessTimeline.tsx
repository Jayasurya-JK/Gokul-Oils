import { Sun, Droplet, Package, Leaf, Filter } from 'lucide-react';

const steps = [
    { icon: Leaf, title: 'Selecting Seeds', desc: 'Premium quality seeds sourced directly.' },
    { icon: Sun, title: 'Sun Drying', desc: 'Naturally dried to remove moisture.' },
    { icon: Filter, title: 'Wood Pressing', desc: 'Slow extraction at low temperature.' },
    { icon: Droplet, title: 'Sedimentation', desc: 'Natural settling for 3-5 days.' },
    { icon: Package, title: 'Packing', desc: 'Hygienic bottling with zero heat.' },
];

export default function ProcessTimeline() {
    return (
        <section className="py-16 bg-[#f6f9f6]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
                    How Gokul Oils are Made
                </h2>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-200 -z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <step.icon className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500 max-w-[150px]">{step.desc}</p>

                                {/* Mobile Connector (Vertical) */}
                                {index < steps.length - 1 && (
                                    <div className="md:hidden w-1 h-12 bg-gray-200 my-4"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
