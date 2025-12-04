import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import WhyChoose from '@/components/WhyChoose';
import Comparison from '@/components/Comparison';
import ProcessTimeline from '@/components/ProcessTimeline';
import Testimonials from '@/components/Testimonials';
import Certifications from '@/components/Certifications';

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <ProductSection />
      <WhyChoose />
      <Comparison />
      <ProcessTimeline />
      <Testimonials />
      <Certifications />
    </div>
  );
}
