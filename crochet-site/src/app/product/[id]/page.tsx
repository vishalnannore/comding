import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductClientArea from './ProductClientArea';

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single();

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background py-20 px-6 md:px-12 cursor-none">
      <div className="max-w-[1200px] mx-auto mt-20 cursor-none">
        <Link href="/" className="inline-flex items-center font-bold text-muted-foreground hover:text-foreground mb-12 transition-colors uppercase tracking-widest text-sm font-mono cursor-none border-b border-transparent hover:border-foreground pb-1">
          <ArrowLeft className="w-5 h-5 mr-4" />
          SYSTEM // RETURN
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start cursor-none border-t border-b border-border py-12">
          <div className="relative aspect-square rounded-none overflow-hidden bg-background border border-border cursor-none group">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover grayscale mix-blend-screen scale-110 -rotate-3 group-hover:rotate-0 group-hover:grayscale-0 group-hover:scale-100 transition-all duration-700 cursor-none"
            />
          </div>
          
          <div className="flex flex-col cursor-none">
            <h1 className="text-[6vw] md:text-[4vw] font-black uppercase tracking-tighter leading-[0.9] mb-4 cursor-none">{product.name}</h1>
            <p className="text-4xl text-primary font-black tracking-tighter mb-8 cursor-none border-b border-border pb-8">${product.price.toFixed(2)}</p>
            
            <div className="font-mono text-muted-foreground uppercase tracking-widest text-sm mb-10 leading-relaxed cursor-none">
              <p className="cursor-none">{product.description}</p>
            </div>
            
            <div className="bg-background border border-border p-8 mb-10 cursor-none">
              <h3 className="font-black text-xl mb-3 tracking-widest uppercase cursor-none">Availability //</h3>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground cursor-none">
                {product.stock > 0 ? (
                  <span className="text-primary flex items-center cursor-none">
                    <span className="w-3 h-3 bg-primary inline-block mr-3 shadow-inner" />
                    In Stock (SEC: {product.stock})
                  </span>
                ) : (
                  <span className="text-destructive flex items-center cursor-none">
                    <span className="w-3 h-3 bg-destructive inline-block mr-3 shadow-inner" />
                    Out of Stock // DEPLETED
                  </span>
                )}
              </p>
            </div>
            
            <ProductClientArea product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
