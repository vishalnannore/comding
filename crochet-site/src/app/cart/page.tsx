'use client';

import { useCart } from '@/lib/cartContext';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/mockProducts';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, removeFromCart, total, clearCart, addToCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(i => ({ id: i.id, quantity: i.quantity })) })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      // Dynamically load Razorpay SDK
      const loadScript = () => new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      const isLoaded = await loadScript();
      if (!isLoaded) {
        alert('RAZORPAY SDK FAILED TO LOAD.');
        setIsCheckingOut(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_test_key_ignore_this',
        amount: Math.round(data.verifiedTotal * 100),
        currency: 'USD',
        name: 'COZY/CROCHET',
        description: 'SECURE ARCHIVE TRANSACTION',
        order_id: data.orderId,
        handler: function (response: any) {
          alert(`TRANSACTION ACKNOWLEDGED. ID: ${response.razorpay_payment_id}`);
          clearCart(); 
        },
        prefill: {
          name: 'SYSTEM USER',
          email: 'user@system.com',
        },
        theme: {
          color: '#ff6b4a' // Brutalist Orange
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      
    } catch (e) {
      console.error(e);
      alert('TRANSACTION FAILED.');
    }
    setIsCheckingOut(false);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col pt-32 pb-20 px-6 md:px-12 bg-background border-b border-border cursor-none">
         <div className="max-w-[1200px] w-full mx-auto cursor-none">
           <h1 className="text-[10vw] sm:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter mix-blend-difference mb-8 text-left cursor-none text-foreground border-b-2 border-primary pb-8">
             YOUR ARCHIVE
           </h1>
           <p className="font-mono uppercase tracking-widest text-muted-foreground mt-12 cursor-none text-lg">SYSTEM QUEUE IS EMPTY.</p>
           <Link href="/" className="inline-block mt-8 bg-primary text-primary-foreground font-bold px-8 py-5 uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors cursor-none border-2 border-transparent hover:border-border">
             RETURN TO CATALOGUE
           </Link>
         </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col pt-32 pb-20 px-6 md:px-12 bg-background border-b border-border cursor-none">
      <div className="max-w-[1200px] w-full mx-auto cursor-none">
        <h1 className="text-[10vw] sm:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter mix-blend-difference mb-16 text-left cursor-none text-foreground border-b-2 border-primary pb-8">
          YOUR ARCHIVE
        </h1>
        
        <div className="flex flex-col gap-8 cursor-none w-full border-b border-border pb-16">
          <AnimatePresence>
            {items.map(item => (
              <motion.div layout initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, scale:0.95}} key={item.id} className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center cursor-none group">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden cursor-none">
                  <img src={item.image_url} alt={item.name} className="w-[150%] -rotate-6 grayscale group-hover:grayscale-0 transition-all duration-500 object-cover h-full cursor-none" />
                </div>
                <div className="flex-1 cursor-none">
                  <h3 className="text-2xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-2 md:mb-4 cursor-none">{item.name}</h3>
                  <p className="font-mono text-sm md:text-base uppercase tracking-widest text-muted-foreground cursor-none">${item.price.toFixed(2)} / EACH</p>
                </div>
                <div className="flex items-center gap-6 cursor-none w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
                  <div className="flex items-center gap-2 md:gap-4 border border-border p-1 md:p-2 cursor-none">
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-transparent border border-transparent hover:bg-foreground hover:text-background transition-colors cursor-none font-mono text-xl">-</button>
                    <span className="font-black text-xl md:text-2xl w-8 md:w-12 text-center cursor-none">{item.quantity}</span>
                    <button onClick={() => addToCart(item as Product)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-transparent border border-transparent hover:bg-foreground hover:text-background transition-colors cursor-none font-mono text-xl">+</button>
                  </div>
                  <span className="text-3xl md:text-4xl font-black tracking-tighter w-24 md:w-32 text-right cursor-none text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-16 flex flex-col items-end cursor-none w-full">
           <div className="flex justify-between w-full max-w-lg items-center mb-8 border-b-2 border-foreground pb-4 cursor-none">
              <span className="font-mono uppercase tracking-widest text-muted-foreground cursor-none text-sm md:text-base">GROSS TOTAL</span>
              <span className="text-4xl md:text-6xl font-black tracking-tighter text-foreground cursor-none">${total.toFixed(2)}</span>
           </div>
           <button 
             disabled={isCheckingOut}
             onClick={handleCheckout} 
             className="w-full max-w-lg bg-foreground text-background font-black uppercase tracking-widest py-6 flex items-center justify-center gap-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50 cursor-none border-2 border-transparent"
           >
             {isCheckingOut ? 'PROCESSING...' : 'INITIATE SECURE CHECKOUT'} <ArrowRight className="w-6 h-6"/>
           </button>
        </div>
      </div>
    </main>
  );
}
