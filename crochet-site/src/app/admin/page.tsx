/* eslint-disable @next/next/no-img-element */
'use client';

import { Package, Plus, ListOrdered, Save, X, Trash2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface DatabaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  created_at?: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DatabaseProduct>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEditClick = (p: DatabaseProduct) => {
    setEditingId(p.id);
    setEditForm(p);
  };

  const handleSave = async () => {
    if (!editingId) return;
    setIsLoading(true);
    
    if (editingId.startsWith('new_')) {
      const insertData = { ...editForm };
      delete insertData.id;
      delete insertData.created_at;
      const { error } = await supabase.from('products').insert([insertData]);
      if (error) alert('FAILED TO INITIALIZE OBJECT: ' + error.message);
    } else {
      const updateData = { ...editForm };
      delete updateData.id;
      delete updateData.created_at;
      const { error } = await supabase.from('products').update(updateData).eq('id', editingId);
      if (error) alert('FAILED TO OVERRIDE: ' + error.message);
    }
    
    await fetchProducts();
    setEditingId(null);
  };

  const handleCancel = () => {
    if (editingId?.startsWith('new_')) {
       setProducts(products.filter(p => p.id !== editingId));
    }
    setEditingId(null);
  };

  const addProduct = () => {
    const newProduct = {
      id: 'new_' + Date.now().toString(),
      name: 'NEW_ARTIFACT // UNNAMED',
      description: 'AWAITING DESCRIPTION.',
      price: 0,
      stock: 0,
      image_url: 'https://images.unsplash.com/photo-1620077839352-731336c535cc?w=800&q=80',
    };
    setProducts([newProduct, ...products]);
    setEditingId(newProduct.id);
    setEditForm(newProduct);
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('new_')) {
      setProducts(products.filter(p => p.id !== id));
      setEditingId(null);
      return;
    }
    
    setIsLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('FAILED TO DESTROY: ' + error.message);
    await fetchProducts();
    setEditingId(null);
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12 cursor-none">
      <div className="max-w-[1600px] mx-auto cursor-none">
        
        <div className="mb-16 border-b border-border pb-8">
          <h1 className="text-[8vw] sm:text-[6vw] font-black uppercase leading-[0.85] tracking-tighter mix-blend-difference text-foreground">
            SYSTEM // <br/>
            <span className="text-primary tracking-normal">ADMIN</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 cursor-none">
          <div className="lg:col-span-2 flex flex-col gap-8 cursor-none">
            <div className="bg-background w-full border border-border p-8 cursor-none">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-border gap-6 cursor-none">
                <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-4 cursor-none">
                  <Package className="text-primary w-6 h-6" /> Inventory_
                </h2>
                <button onClick={addProduct} disabled={isLoading} className="hover-brutalist border border-foreground bg-foreground text-background px-6 py-4 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 cursor-none transition-colors disabled:opacity-50">
                  <Plus className="w-4 h-4" /> Initialize Object
                </button>
              </div>

              <div className="flex flex-col gap-0 cursor-none border-t border-l border-r border-border min-h-[200px]">
                {isLoading && products.length === 0 ? (
                   <p className="p-8 font-mono text-center uppercase tracking-widest text-muted-foreground">SCANNING DATA BANKS...</p>
                ) : products.map((p) => {
                  const isEditing = editingId === p.id;

                  return (
                    <div key={p.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border bg-background hover:bg-muted transition-colors cursor-none ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 cursor-none w-full mr-6">
                        <div className="relative flex-shrink-0 aspect-square w-20 overflow-hidden border border-border cursor-none">
                          <img src={isEditing && editForm.image_url ? editForm.image_url : p.image_url} className="w-full h-full object-cover grayscale cursor-none" alt="Product" />
                        </div>
                        
                        {isEditing ? (
                          <div className="flex flex-col gap-3 w-full cursor-none">
                            <input 
                              type="text" 
                              value={editForm.name || ''} 
                              onChange={e => setEditForm({...editForm, name: e.target.value})}
                              className="bg-background border border-border text-foreground p-3 font-black uppercase text-xl cursor-none w-full"
                              placeholder="OBJECT NAME"
                            />
                            <div className="flex gap-4 cursor-none">
                              <div className="relative cursor-none">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">$</span>
                                <input 
                                  type="number" 
                                  value={editForm.price || 0} 
                                  onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                                  className="bg-background border border-border text-foreground py-2 pl-8 pr-2 font-mono text-lg uppercase w-32 cursor-none"
                                  placeholder="PRICE"
                                />
                              </div>
                              <div className="relative cursor-none">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">#</span>
                                <input 
                                  type="number" 
                                  value={editForm.stock || 0} 
                                  onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})}
                                  className="bg-background border border-border text-foreground py-2 pl-8 pr-2 font-mono text-lg uppercase w-32 cursor-none"
                                  placeholder="STOCK"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="cursor-none">
                            <p className="font-black text-xl uppercase tracking-tight cursor-none">{p.name}</p>
                            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-2 cursor-none">
                              ${Number(p.price).toFixed(2)} // SEC: <span className={p.stock > 0 ? "text-primary" : "text-destructive"}>{p.stock}</span>
                            </p>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="flex gap-3 mt-6 sm:mt-0">
                          <button onClick={handleSave} className="text-xs font-black uppercase tracking-widest border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors p-4 cursor-none flex items-center justify-center">
                            <Save className="w-5 h-5"/>
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="text-xs font-black uppercase tracking-widest border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors p-4 cursor-none flex items-center justify-center">
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button onClick={handleCancel} className="text-xs font-black uppercase tracking-widest border border-border text-foreground hover:bg-foreground hover:text-background transition-colors p-4 cursor-none flex items-center justify-center">
                            <X className="w-5 h-5"/>
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleEditClick(p)} className="mt-6 sm:mt-0 text-xs font-black uppercase tracking-widest border border-border text-foreground hover:bg-foreground hover:text-background transition-colors px-8 py-4 cursor-none w-full sm:w-auto text-center">
                          Override
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 cursor-none">
            <div className="bg-background w-full border border-border p-8 h-fit cursor-none">
              <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-4 mb-10 pb-6 border-b border-border cursor-none">
                <ListOrdered className="text-primary w-6 h-6" /> Queue_
              </h2>
              <div className="flex flex-col items-center justify-center py-16 text-center border border-border border-dashed cursor-none">
                <div className="w-16 h-16 bg-muted flex items-center justify-center mb-6 cursor-none">
                  <ListOrdered className="w-8 h-8 text-foreground mix-blend-difference" />
                </div>
                <p className="font-black text-xl uppercase tracking-widest mb-2 cursor-none">Awaiting Data</p>
                <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest max-w-[200px] cursor-none">System queue is empty. Stand by.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
