'use client';

import { useState } from 'react';
import { updateProduct } from '@/features/inventory/actions';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSuccess?: () => void;
}

export default function EditProductModal({ isOpen, onClose, product, onSuccess }: EditProductModalProps) {
  const [name, setName] = useState(product.name || '');
  const [description, setDescription] = useState(product.description || '');
  const [brand, setBrand] = useState(product.brand || '');
  const [isActive, setIsActive] = useState(product.isActive ?? true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await updateProduct(product.id, { name, description, brand, isActive });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError('Error al actualizar el producto.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-on-surface/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-surface-lowest w-full max-w-2xl flex flex-col border border-outline-variant/20 shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-low/30">
          <div>
            <h2 className="font-headline text-2xl tracking-tight">Editar Producto</h2>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">
              ID: #{product.id.toString().padStart(4, '0')}
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
        <form onSubmit={handleSubmit} className="flex-1 p-8 space-y-8">
          {error && (
            <div className="bg-error/10 border-l-4 border-error text-error p-4 text-[10px] font-label uppercase tracking-widest">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:border-secondary outline-none text-on-surface transition-colors font-body"
              placeholder="Nombre del producto"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
              Marca
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:border-secondary outline-none text-on-surface transition-colors font-body"
              placeholder="Nombre de la marca"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-transparent border-b border-outline-variant/30 py-2 focus:border-secondary outline-none text-on-surface transition-colors font-body resize-none"
              placeholder="Describe el producto..."
            />
          </div>

          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-10 h-5 bg-outline-variant/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
            </div>
            <span className="font-label text-[11px] uppercase tracking-wider text-on-surface group-hover:text-secondary transition-colors">
              Producto Activo
            </span>
          </label>

          {/* Footer */}
          <div className="pt-6 border-t border-outline-variant/10 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="text-[10px] font-label uppercase tracking-[0.2em] px-8 py-3 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="bg-secondary text-surface px-10 py-3 text-[10px] font-label uppercase tracking-[0.2em] hover:bg-secondary-dim transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
