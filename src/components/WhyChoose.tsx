import Image from 'next/image';


const features = [
    {
        icon: '/icons/tn_seed_transparent.png',
        title: 'Premium Tamil Nadu Seeds',
        desc: 'Handpicked directly from trusted local farmers for the best purity and taste.',
        isImage: true,
        scale: 'scale-125',
    },
    {
        icon: '/icons/Marachekku Machine Colored.png',
        title: 'Traditional Wood-Pressed',
        desc: 'Slow and cold process keeps nutrients, aroma, and natural antioxidants alive.',
        isImage: true,
        scale: 'scale-100',
    },
    {
        icon: '/icons/shield colored.png',
        title: 'Zero Chemicals',
        desc: 'No bleaching, no deodorizing, no artificial filtering — just pure oil as nature made it.',
        isImage: true,
        scale: 'scale-125',
    },
    {
        icon: '/icons/The heart nature colored.png',
        title: 'Good Fats for Health',
        desc: 'Rich in Vitamin E & essential fatty acids that support heart and overall wellness.',
        isImage: true,
        scale: 'scale-125',
    },
];

export default function WhyChoose() {
    return (
        <section className="pt-12 pb-2 bg-[#fcfdfc]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-4xl font-bold text-[#1a4d2e] font-serif tracking-wide">
                        Why Choose Gokul Oils?
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className={`mb-6 relative w-28 h-28 md:w-40 md:h-40 flex items-center justify-center transform ${feature.scale}`}>
                                <Image
                                    src={feature.icon as string}
                                    alt={feature.title}
                                    fill
                                    className="object-contain mix-blend-multiply"
                                />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#1a4d2e] mb-3 font-serif leading-tight">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-[200px] md:max-w-[260px]">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
