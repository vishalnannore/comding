'use client';

import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useState } from 'react';
import { Product } from '@/lib/mockProducts';

export default function ProductClientArea({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.some(i => i.id === product.id);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={product.stock === 0 || inCart}
      className={`w-full font-black uppercase tracking-widest text-xl py-6 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 border-2 border-transparent ${inCart ? 'bg-background text-foreground border-foreground' : 'bg-primary text-primary-foreground hover:bg-foreground hover:text-background hover:border-foreground border-border'}`}
    >
      {inCart ? <Check className="w-6 h-6 mr-3" /> : <ShoppingBag className="w-6 h-6 mr-3" />}
      {inCart ? 'ALREADY IN SYSTEM.' : added ? 'RETRIEVED.' : 'ADD TO ARCHIVE'}
    </button>
  );
}
