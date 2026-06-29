'use client';

import { useState } from 'react';
import { updateVariant, deleteVariant, createVariant } from '@/features/inventory/actions';

interface VariantData {
  id: number;
  sku: string;
  price: number;
  stock: number;
  color: string | null;
  size: string | null;
}

interface VariantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    ProductVariant: VariantData[];
  };
  onSuccess?: () => void;
}

export default function VariantsModal({ isOpen, onClose, product, onSuccess }: VariantsModalProps) {
  const [variants, setVariants] = useState<VariantData[]>(product.ProductVariant || []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newVariant, setNewVariant] = useState({
    sku: '',
    price: '',
    stock: '0',
    color: '',
    size: '',
  });

  if (!isOpen) return null;

  const handleUpdate = async (v: VariantData) => {
    setIsProcessing(true);
    setError(null);
    try {
      await updateVariant(v.id, {
        price: v.price,
        stock: v.stock,
        color: v.color || undefined,
        size: v.size || undefined,
      });
      onSuccess?.();
    } catch (err: any) {
      setError('Error al actualizar la variante.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (variantId: number) => {
    if (variants.length <= 1) {
      alert('No puedes eliminar la única variante.');
      return;
    }
    if (!confirm('¿Eliminar esta variante permanentemente?')) return;

    setIsProcessing(true);
    try {
      await deleteVariant(variantId);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
      onSuccess?.();
    } catch (err: any) {
      setError('Error al eliminar la variante.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdd = async () => {
    if (!newVariant.sku || !newVariant.price) {
      setError('SKU y Precio son obligatorios.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      await createVariant(product.id, {
        sku: newVariant.sku,
        price: parseFloat(newVariant.price),
        stock: parseInt(newVariant.stock) || 0,
        color: newVariant.color || undefined,
        size: newVariant.size || undefined,
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError('Error al crear la variante. ¿SKU duplicado?');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateLocalVariant = (id: number, field: keyof VariantData, value: any) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  return (
    <div className="fixed inset-0 bg-on-surface/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-surface-lowest w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-outline-variant/20 shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-low/30">
          <div>
            <h2 className="font-headline text-2xl tracking-tight">Variantes</h2>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">
              {product.name} — {variants.length} variante{variants.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {error && (
            <div className="bg-error/10 border-l-4 border-error text-error p-3 text-[10px] font-label uppercase tracking-widest">
              {error}
            </div>
          )}

          {/* Existing Variants */}
          <div className="space-y-4">
            {variants.map((v) => (
              <div
                key={v.id}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end bg-surface-low/30 p-5 border border-outline-variant/10"
              >
                <div className="space-y-1">
                  <p className="text-[8px] font-label uppercase tracking-widest text-secondary font-bold">SKU</p>
                  <p className="text-xs font-mono bg-surface-lowest px-2 py-1.5 border border-outline-variant/5">
                    {v.sku}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">
                    Precio
                  </label>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => updateLocalVariant(v.id, 'price', parseFloat(e.target.value))}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => updateLocalVariant(v.id, 'stock', parseInt(e.target.value))}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">
                    Color
                  </label>
                  <input
                    type="text"
                    value={v.color || ''}
                    onChange={(e) => updateLocalVariant(v.id, 'color', e.target.value)}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">
                    Talla
                  </label>
                  <input
                    type="text"
                    value={v.size || ''}
                    onChange={(e) => updateLocalVariant(v.id, 'size', e.target.value)}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleUpdate(v)}
                    disabled={isProcessing}
                    className="p-2 text-secondary hover:bg-secondary/10 transition-colors"
                    title="Guardar cambios"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    disabled={isProcessing}
                    className="p-2 text-error hover:bg-error/10 transition-colors"
                    title="Eliminar variante"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Variant */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 border border-dashed border-outline-variant/30 text-[10px] font-label uppercase tracking-widest text-on-surface-variant hover:text-secondary hover:border-secondary transition-all"
            >
              + Añadir nueva variante
            </button>
          ) : (
            <div className="bg-secondary/5 p-6 border border-secondary/20 space-y-6">
              <h4 className="font-label text-[10px] uppercase tracking-widest text-secondary font-bold">
                Nueva Variante
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={newVariant.sku}
                    onChange={(e) => setNewVariant((p) => ({ ...p, sku: e.target.value }))}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                    placeholder="PROD-001-S"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">
                    Precio *
                  </label>
                  <input
                    type="number"
                    value={newVariant.price}
                    onChange={(e) => setNewVariant((p) => ({ ...p, price: e.target.value }))}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={newVariant.stock}
                    onChange={(e) => setNewVariant((p) => ({ ...p, stock: e.target.value }))}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">
                    Color
                  </label>
                  <input
                    type="text"
                    value={newVariant.color}
                    onChange={(e) => setNewVariant((p) => ({ ...p, color: e.target.value }))}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                    placeholder="Negro"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant">
                    Talla
                  </label>
                  <input
                    type="text"
                    value={newVariant.size}
                    onChange={(e) => setNewVariant((p) => ({ ...p, size: e.target.value }))}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-xs py-1 focus:border-secondary outline-none"
                    placeholder="M"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  disabled={isProcessing}
                  className="bg-secondary text-surface px-8 py-2.5 text-[10px] font-label uppercase tracking-widest font-bold disabled:opacity-50"
                >
                  {isProcessing ? 'Guardando...' : 'Crear Variante'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant/10 flex justify-end bg-surface-low/30">
          <button
            onClick={onClose}
            className="bg-on-surface text-surface px-8 py-3 text-[10px] font-label uppercase tracking-[0.2em] font-bold hover:bg-secondary transition-all"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
}
