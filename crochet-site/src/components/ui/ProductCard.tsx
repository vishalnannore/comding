import Link from 'next/link';
import { Product } from '@/lib/mockProducts';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block h-full select-none cursor-none">
      <div className="bg-card border border-border flex flex-col h-full hover:border-primary transition-colors duration-500 cursor-none">
        
        <div className="relative aspect-[4/5] overflow-hidden bg-muted cursor-none border-b border-border">
          {/* Using img tag to skip Next.js external domain config issues temporarily */}
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105 cursor-none"
          />
          <div className="absolute top-4 left-4 bg-background text-foreground text-xs font-mono uppercase tracking-widest px-3 py-1 border border-border cursor-none mix-blend-difference z-10">
            ${product.price.toFixed(2)}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow cursor-none">
          <h3 className="text-xl md:text-2xl font-black uppercase text-card-foreground mb-2 tracking-tight leading-none cursor-none">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-[10px] md:text-xs font-mono flex-grow line-clamp-2 uppercase tracking-widest leading-relaxed cursor-none mt-2">
            {product.description}
          </p>
          <div className="mt-8 flex justify-between items-end border-t border-border pt-4 cursor-none">
            <span className="text-xs font-mono uppercase tracking-widest text-primary group-hover:text-foreground transition-colors cursor-none">
              View Item
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-foreground cursor-none">
              [ {product.stock > 0 ? "In Stock" : "Archive"} ]
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
