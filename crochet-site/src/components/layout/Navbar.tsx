'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <nav className="fixed top-0 w-full z-50 mix-blend-difference pointer-events-none">
      <div className="w-full px-6 md:px-12 h-24 flex items-center justify-between pointer-events-auto">
        <Link href="/" className="text-2xl font-black font-sans text-foreground transition-transform hover:scale-105 cursor-none">
          COZY/CROCHET
        </Link>
        <div className="flex items-center gap-8 font-mono">
          <Link href="/custom" className="text-sm md:text-base font-bold text-foreground hover:text-primary transition-colors cursor-none uppercase tracking-widest">
            Custom
          </Link>
          <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors flex items-center cursor-none">
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-none animate-in zoom-in cursor-none">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
