'use client';

import { useState, useRef } from 'react';
import { SplitText } from '@/components/ui/SplitText';
import { createClient } from '@/lib/supabase/client';

const COLORS = [
  { name: 'Pitch Black', hex: '#0a0a0a' },
  { name: 'Off White', hex: '#f4f4f5' },
  { name: 'Charcoal', hex: '#1f1f22' },
  { name: 'Electric Orange', hex: '#ff6b4a' },
  { name: 'Steel Gray', hex: '#71717a' },
  { name: 'Crimson', hex: '#991b1b' }
];

const SIZES = ['MINIature', 'STANDARD', 'OVERSIZED', 'WEARABLE'];

export default function CustomOrderPage() {
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedColor || !selectedSize) {
      alert("PLEASE SELECT A COLOR AND SIZE.");
      return;
    }
    
    setIsSubmitting(true);
    const colorObj = COLORS.find(c => c.name === selectedColor);
    const colorHex = colorObj ? colorObj.hex : selectedColor;

    const { error } = await supabase.from('custom_orders').insert([{
      size: selectedSize,
      color_hex: colorHex,
      details: description,
      status: 'PENDING'
    }]);
    
    setIsSubmitting(false);

    if (error) {
      alert('TRANSMISSION FAILED: ' + error.message);
      return;
    }

    alert('SYSTEM // LOGGED\nTRANSMISSION RECEIVED. WE WILL BE IN TOUCH.');
    setDescription('');
    setSelectedColor('');
    setSelectedSize('');
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12 flex flex-col items-center border-b border-border cursor-none">
      <div className="w-full max-w-[1200px] mb-12 cursor-none">
        <h1 className="text-[10vw] sm:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter mix-blend-difference mb-8 text-left cursor-none">
          <SplitText text="DREAM IT." delay={0.1} />
          <br/>
          <span className="text-primary"><SplitText text="WE BUILD IT." delay={0.3} /></span>
        </h1>
        <p className="form-field text-sm md:text-base font-mono text-muted-foreground uppercase tracking-widest max-w-xl text-left border-l-2 border-primary pl-4 cursor-none">
          From personalized artifacts to custom-sized structural wear. Feed us your vision.
        </p>
      </div>
      
      <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-[1200px] bg-background border border-border p-8 md:p-12 flex flex-col gap-12 cursor-none relative overflow-hidden">
        
        {/* Description */}
        <div className="form-field flex flex-col gap-4 cursor-none">
          <label className="font-mono text-primary text-xs uppercase tracking-widest cursor-none">01 // The Vision</label>
          <textarea 
            required
            rows={4}
            className="w-full bg-background border-b border-border p-4 focus:outline-none focus:border-foreground transition-colors resize-none text-lg md:text-2xl font-bold uppercase tracking-tight text-foreground cursor-none rounded-none placeholder:text-muted"
            placeholder="I NEED A MASSIVE OCTOPUS..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Color Palette */}
        <div className="form-field flex flex-col gap-4 cursor-none">
          <label className="font-mono text-primary text-xs uppercase tracking-widest cursor-none">02 // Primary Tone</label>
          <div className="flex flex-wrap gap-4 cursor-none">
            {COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color.name)}
                className={`w-16 h-16 cursor-none transition-all duration-300 border ${selectedColor === color.name ? 'border-primary scale-110 rotate-3 z-10' : 'border-border hover:border-foreground'}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="form-field flex flex-col gap-4 cursor-none">
          <label className="font-mono text-primary text-xs uppercase tracking-widest cursor-none">03 // Scale</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 cursor-none">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`py-5 px-4 font-bold text-xs md:text-sm uppercase tracking-widest border transition-colors cursor-none ${selectedSize === size ? 'bg-foreground text-background border-foreground' : 'bg-transparent border-border text-foreground hover:border-foreground'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="form-field mt-8 hover-brutalist disabled:opacity-50 w-full md:w-auto self-end bg-primary text-primary-foreground text-xl font-black uppercase tracking-widest py-6 px-12 border border-transparent cursor-none"
        >
          {isSubmitting ? 'TRANSMITTING...' : 'Transmit'}
        </button>
      </form>
    </main>
  );
}
