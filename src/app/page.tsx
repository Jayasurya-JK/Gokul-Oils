import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import WhyChoose from '@/components/WhyChoose';
import Comparison from '@/components/Comparison';
import ProcessTimeline from '@/components/ProcessTimeline';
import Testimonials from '@/components/Testimonials';
import Certifications from '@/components/Certifications';
import { getProducts, enrichProductWithSpecificOption } from '@/lib/woocommerce';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const products = await getProducts().catch(err => {
    console.error("Failed to fetch products for home page:", err);
    return [];
  });

  // Identify specific products by name helper - Prioritize Variable products to avoid "Value Pack" simple products
  const findProduct = (namePart: string) => {
    const matches = products.filter(p => p.name.toLowerCase().includes(namePart.toLowerCase()));
    // Prefer variable products first
    return matches.find(p => p.type === 'variable') || matches[0];
  };

  const groundnut = findProduct('Groundnut');
  const sesame = findProduct('Sesame');
  const coconut = findProduct('Coconut');

  // Create the 1L Set
  const set1L = await Promise.all([
    groundnut ? enrichProductWithSpecificOption(groundnut, '1 Litre') : null,
    sesame ? enrichProductWithSpecificOption(sesame, '1 Litre') : null,
    coconut ? enrichProductWithSpecificOption(coconut, '1 Litre') : null,
  ]);

  // Create the 5L Set
  const set5L = await Promise.all([
    groundnut ? enrichProductWithSpecificOption(groundnut, '5 Litre') : null,
    sesame ? enrichProductWithSpecificOption(sesame, '5 Litre') : null,
    coconut ? enrichProductWithSpecificOption(coconut, '5 Litre') : null,
  ]);

  // Filter out nulls and combine in specific order
  const finalDisplay = [
    ...set1L.filter((p): p is any => p !== null),
    ...set5L.filter((p): p is any => p !== null)
  ];

  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <ProductSection products={finalDisplay} />
      <WhyChoose />
      <Comparison />
      <ProcessTimeline />
      <Testimonials />
      <Certifications />
    </div>
  );
}
