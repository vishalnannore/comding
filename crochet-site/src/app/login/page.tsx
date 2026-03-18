'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('ACCESS DENIED: ' + error.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center py-20 px-6 cursor-none">
      <div className="w-full max-w-md border border-border bg-background p-8 md:p-12 cursor-none">
        
        <div className="mb-10 border-b border-border pb-6 flex items-center justify-between cursor-none">
          <h1 className="text-3xl font-black uppercase tracking-widest text-primary cursor-none">
            SYSTEM // AUTH
          </h1>
          <KeyRound className="w-6 h-6 text-muted-foreground mr-2"/>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-8 cursor-none">
          
          <div className="flex flex-col gap-3 cursor-none">
            <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground cursor-none">Admin Identifier</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-b border-border py-3 text-lg font-mono placeholder:lowercase focus:outline-none focus:border-foreground transition-colors cursor-none placeholder:text-muted"
              placeholder="operator@cozy.com"
            />
          </div>

          <div className="flex flex-col gap-3 cursor-none">
            <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground cursor-none">Security Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-b border-border py-3 text-lg focus:outline-none focus:border-foreground transition-colors cursor-none placeholder:text-muted"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="hover-brutalist mt-4 w-full bg-foreground text-background font-black uppercase tracking-widest py-5 flex items-center justify-center gap-3 disabled:opacity-50 cursor-none transition-colors border-2 border-transparent"
          >
            {loading ? 'AUTHENTICATING...' : 'REQUEST ACCESS'} <ArrowRight className="w-5 h-5"/>
          </button>
        </form>

      </div>
    </main>
  );
}
