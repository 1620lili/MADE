'use client';

import { useState } from 'react';
import { updateVariant, deleteVariant, createVariant } from '@/features/inventory/actions';

interface Variant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  color: string | null;
  size: string | null;
}

interface EditVariantsModalProps {
  product: {
    id: number;
    name: string;
    ProductVariant: Variant[];
  };
  onClose: () => void;
}

export default function EditVariantsModal({ product, onClose }: EditVariantsModalProps) {
  const [variants, setVariants] = useState<Variant[]>(product.ProductVariant || []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para nueva variante
  const [newVariant, setNewVariant] = useState({
    sku: '',
    price: '',
    stock: '0',
    color: '',
    size: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleUpdate = async (v: Variant) => {
    setIsProcessing(true);
    setError(null);
    try {
      await updateVariant(v.id, {
        price: v.price,
        stock: v.stock,
        color: v.color || undefined,
        size: v.size || undefined
      });
    } catch (err: any) {
      setError("Error al actualizar variante.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (variantId: number) => {
    if (variants.length <= 1) {
      alert("No puedes eliminar la única variante.");
      return;
    }
    if (!confirm("¿Eliminar esta variante?")) return;

    setIsProcessing(true);
    try {
      await deleteVariant(variantId);
      setVariants(prev => prev.filter(v => v.id !== variantId));
    } catch (err: any) {
      setError("Error al eliminar variante.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdd = async () => {
    if (!newVariant.sku || !newVariant.price) {
      alert("SKU y Precio son obligatorios.");
      return;
    }

    setIsProcessing(true);
    try {
      await createVariant(product.id, {
        sku: newVariant.sku,
        price: parseFloat(newVariant.price),
        stock: parseInt(newVariant.stock) || 0,
        color: newVariant.color || undefined,
        size: newVariant.size || undefined
      });
      // Refetching would be better, but for now we assume it revalidates
      // In a real app we might want the returned new variant to update local state
      onClose(); // Cerrar para ver cambios
    } catch (err: any) {
      setError("Error al crear variante (SKU duplicado?).");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-surface-lowest w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-outline-variant/20 shadow-2xl">
        <header className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-low">
          <div>
            <h2 className="font-headline text-2xl italic">Variantes: {product.name}</h2>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">Gestiona SKUs, precios y existencias</p>
          </div>
          <button onClick={onClose} className="text-on-surface hover:text-error transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-3 text-[10px] font-label uppercase tracking-widest">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {variants.map((v) => (
              <div key={v.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end bg-surface-low/30 p-4 border border-outline-variant/10 group">
                <div className="space-y-1">
                  <p className="text-[8px] font-label uppercase tracking-widest text-secondary font-bold">SKU</p>
                  <p className="text-xs font-mono bg-surface-lowest px-2 py-1 border border-outline-variant/5">{v.sku}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Precio</label>
                  <input 
                    type="number" 
                    value={v.price} 
                    onChange={(e) => setVariants(prev => prev.map(item => item.id === v.id ? {...item, price: parseFloat(e.target.value)} : item))}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Stock</label>
                  <input 
                    type="number" 
                    value={v.stock} 
                    onChange={(e) => setVariants(prev => prev.map(item => item.id === v.id ? {...item, stock: parseInt(e.target.value)} : item))}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Color</label>
                  <input 
                    type="text" 
                    value={v.color || ''} 
                    onChange={(e) => setVariants(prev => prev.map(item => item.id === v.id ? {...item, color: e.target.value} : item))}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Talla</label>
                  <input 
                    type="text" 
                    value={v.size || ''} 
                    onChange={(e) => setVariants(prev => prev.map(item => item.id === v.id ? {...item, size: e.target.value} : item))}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={() => handleUpdate(v)}
                    disabled={isProcessing}
                    className="p-2 text-secondary hover:bg-secondary/10 transition-colors"
                    title="Guardar"
                  >
                    <span className="material-symbols-outlined" style={{fontSize:'20px'}}>check</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(v.id)}
                    disabled={isProcessing}
                    className="p-2 text-error hover:bg-error/10 transition-colors"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined" style={{fontSize:'20px'}}>delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!showAddForm ? (
            <button 
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 border border-dashed border-outline-variant/30 text-[10px] font-label uppercase tracking-widest text-on-surface-variant hover:text-secondary hover:border-secondary transition-all"
            >
              + Añadir nueva variante
            </button>
          ) : (
            <div className="bg-secondary/5 p-6 border border-secondary/20 space-y-6">
               <h4 className="font-label text-[10px] uppercase tracking-widest text-secondary font-bold">Nueva Variante</h4>
               <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="space-y-1">
                    <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">SKU *</label>
                    <input 
                      type="text" 
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant(prev => ({...prev, sku: e.target.value}))}
                      className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Precio *</label>
                    <input 
                      type="number" 
                      value={newVariant.price}
                      onChange={(e) => setNewVariant(prev => ({...prev, price: e.target.value}))}
                      className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Stock</label>
                    <input 
                      type="number" 
                      value={newVariant.stock}
                      onChange={(e) => setNewVariant(prev => ({...prev, stock: e.target.value}))}
                      className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Color</label>
                    <input 
                      type="text" 
                      value={newVariant.color}
                      onChange={(e) => setNewVariant(prev => ({...prev, color: e.target.value}))}
                      className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">Talla</label>
                    <input 
                      type="text" 
                      value={newVariant.size}
                      onChange={(e) => setNewVariant(prev => ({...prev, size: e.target.value}))}
                      className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                    />
                  </div>
               </div>
               <div className="flex justify-end gap-4">
                  <button onClick={() => setShowAddForm(false)} className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Cancelar</button>
                  <button 
                    onClick={handleAdd}
                    disabled={isProcessing}
                    className="bg-secondary text-surface px-6 py-2 text-[10px] font-label uppercase tracking-widest font-bold"
                  >
                    {isProcessing ? 'Guardando...' : 'Crear Variante'}
                  </button>
               </div>
            </div>
          )}
        </div>

        <footer className="p-6 border-t border-outline-variant/10 flex justify-end bg-surface-low">
          <button 
            onClick={onClose}
            className="bg-on-surface text-surface px-8 py-3 text-[10px] font-label uppercase tracking-widest font-bold hover:bg-secondary transition-all"
          >
            Cerrar Panel
          </button>
        </footer>
      </div>
    </div>
  );
}
