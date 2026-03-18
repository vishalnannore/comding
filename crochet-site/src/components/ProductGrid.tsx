'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ProductCard } from '@/components/ui/ProductCard';
import { Product } from '@/lib/mockProducts';

interface ProductGridProps {
  initialProducts: Product[];
}

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.product-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="products" ref={containerRef} className="py-32 px-6 md:px-12 w-full z-10 relative bg-background border-b border-border">
      <div className="w-full max-w-[1600px] mx-auto mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
        <h2 className="text-[10vw] sm:text-[6vw] font-black uppercase leading-[0.85] tracking-tighter mix-blend-difference text-foreground">
          Archive // <br/>
          <span className="text-primary tracking-normal">001</span>
        </h2>
        <p className="text-xs sm:text-sm font-mono text-muted-foreground max-w-sm uppercase tracking-widest text-left md:text-right">
          Handmade with precision. Curated for the modern space. Discover our structural crochet artifacts.
        </p>
      </div>
      
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {initialProducts.map((prod) => (
           <div key={prod.id} className="product-card">
             <ProductCard product={prod} />
           </div>
        ))}
      </div>
    </section>
  );
}
