import { Award, ShieldCheck, Leaf, Heart } from 'lucide-react';

const certifications = [
    { name: 'FSSAI Certified', icon: Award },
    { name: 'ISO 9001:2015', icon: ShieldCheck },
    { name: 'No GMO', icon: Leaf },
    { name: 'Chemical Free', icon: FilterIcon }, // Custom icon below
    { name: 'Cold Pressed', icon: DropletIcon }, // Custom icon below
    { name: 'Locally Sourced', icon: Heart },
];

function FilterIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    )
}

function DropletIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
    )
}

export default function Certifications() {
    return (
        <section className="py-12 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center text-center">
                    {certifications.map((cert, index) => (
                        <div key={index} className="flex flex-col items-center gap-3 group opacity-70 hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <cert.icon className="w-8 h-8" />
                            </div>
                            <span className="text-sm font-semibold text-gray-600 group-hover:text-primary transition-colors">
                                {cert.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
