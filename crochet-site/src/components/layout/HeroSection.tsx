'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import { SplitText } from '@/components/ui/SplitText';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene').then(mod => mod.HeroScene), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Brutalist fade up for subtext and buttons
      gsap.from('.brutalist-reveal', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.1,
        delay: 0.6,
      });

      // Scroll trigger to fade out the hero
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        opacity: 0,
        y: '20vh',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-background border-b border-border pt-32 pb-20 items-center px-6 md:px-12"
    >
      <div className="absolute inset-0 z-0 scale-110 pointer-events-none">
        <HeroScene />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] flex flex-col justify-center mix-blend-difference" ref={textRef}>
        <h1 className="text-[14vw] sm:text-[13vw] leading-[0.8] font-black uppercase text-foreground tracking-tighter mb-8 text-left flex flex-col">
          <span className="overflow-visible"><SplitText text="YARN." delay={0.1} /></span>
          <span className="overflow-visible"><SplitText text="THAT." delay={0.2} /></span>
          <span className="overflow-visible text-primary"><SplitText text="MOVES." delay={0.3} /></span>
        </h1>
        
        <div className="mt-8 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <p className="brutalist-reveal text-sm md:text-xl font-mono text-muted-foreground uppercase max-w-xl text-left">
            A digital crochet studio built for high aesthetics and uncompromising craft. One thread at a time.
          </p>
          
          <div className="brutalist-reveal flex flex-col sm:flex-row md:justify-end gap-6 w-full md:w-auto">
            <button 
              onClick={() => window.location.href = '/custom'}
              className="hover-brutalist relative overflow-hidden border border-foreground bg-transparent text-foreground px-8 py-5 text-sm md:text-lg font-bold uppercase tracking-widest cursor-none"
            >
              Order Custom
            </button>
            <button 
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover-brutalist border border-transparent bg-primary text-primary-foreground px-8 py-5 text-sm md:text-lg font-bold uppercase tracking-widest cursor-none"
            >
              Shop Collection
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
