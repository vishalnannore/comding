/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';

export function HeroScene() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scriptId = 'tubes-cursor-script';
    let app: any = null;

    // We dynamically inject the script to bypass bundler/SSR issues with external CDNs
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'module';
      script.innerHTML = `
        import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";
        window.initTubes = TubesCursor;
      `;
      document.head.appendChild(script);
    }

    // Poll until the module is attached to window
    const checkInit = setInterval(() => {
      if ((window as any).initTubes && canvasRef.current && !app) {
        app = (window as any).initTubes(canvasRef.current, {
          tubes: {
            colors: ["#ff6b4a", "#261a35", "#f4f4f5"], // Electric Orange, Deep Charcoal, White
            lights: {
              intensity: 300,
              colors: ["#ff6b4a", "#ffffff", "#ff008a", "#60aed5"]
            }
          }
        });
        clearInterval(checkInit);
      }
    }, 100);

    const handleClick = () => {
      if (app && app.tubes) {
        const randomHex = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        app.tubes.setColors([randomHex(), randomHex(), randomHex()]);
      }
    };
    document.body.addEventListener('click', handleClick);

    return () => {
      clearInterval(checkInit);
      document.body.removeEventListener('click', handleClick);
      if (canvas) {
        canvas.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-[100vw] h-[100vh] pointer-events-none"
    />
  );
}
