import { HeroSection } from '@/components/layout/HeroSection';
import { ProductGrid } from '@/components/ProductGrid';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0; // Disable caching to see live DB updates

export default async function Home() {
  const supabase = createClient();
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ProductGrid initialProducts={products || []} />
    </main>
  );
}
