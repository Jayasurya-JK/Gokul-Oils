import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import WhyChoose from '@/components/WhyChoose';
import Comparison from '@/components/Comparison';
import ProcessTimeline from '@/components/ProcessTimeline';
import Testimonials from '@/components/Testimonials';
import Certifications from '@/components/Certifications';
import { getProducts } from '@/lib/woocommerce';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const products = await getProducts().catch(err => {
    console.error("Failed to fetch products for home page:", err);
    return [];
  });

  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <ProductSection products={products.slice(0, 4)} />
      <WhyChoose />
      <Comparison />
      <ProcessTimeline />
      <Testimonials />
      <Certifications />
    </div>
  );
}
