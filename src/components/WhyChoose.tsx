import { CheckCircle } from 'lucide-react';

const features = [
    {
        title: '100% Wood-Pressed',
        desc: 'Extracted using traditional wooden Ghani.',
    },
    {
        title: 'No Preservatives',
        desc: 'Zero chemicals or additives used.',
    },
    {
        title: 'No Refined Processing',
        desc: 'Kept pure and natural, just like nature.',
    },
    {
        title: 'Nutrient Rich',
        desc: 'Retains natural aroma and essential nutrients.',
    },
];

export default function WhyChoose() {
    return (
        <section className="py-16 bg-[#f6f9f6]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Gokul Oils?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We bring you the goodness of tradition with modern hygiene standards.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-primary">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
