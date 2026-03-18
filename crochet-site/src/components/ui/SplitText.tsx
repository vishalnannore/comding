'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function SplitText({ text, className = '', delay = 0 }: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll('.char');
    
    gsap.fromTo(
      chars,
      { y: 50, opacity: 0, rotateX: -90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'back.out(2)',
        delay: delay,
      }
    );
  }, [delay, text]); // Re-run if text changes

  return (
    <span ref={containerRef} className={`inline-block ${className}`} style={{ perspective: '1000px' }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="char inline-block whitespace-pre"
          style={{ transformOrigin: '50% 100%' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
