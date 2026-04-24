'use client';

import { useActionState } from 'react';
import { createProduct } from '@/features/inventory/actions';

interface CreateProductFormProps {
  companyId: number;
  isSuper?: boolean;
}

export default function CreateProductForm({ companyId, isSuper }: CreateProductFormProps) {
  const [state, formAction, pending] = useActionState(createProduct, { error: '' });

  return (
    <div className="max-w-4xl mx-auto">
      <form action={formAction} className="space-y-16">
        <input type="hidden" name="companyId" value={companyId} />

        {/* ERRORES */}
        {state?.error && (
          <div className="bg-error/5 border border-error/20 p-6 flex items-center space-x-4 animate-in fade-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="text-error font-label text-[10px] uppercase tracking-widest">{state.error}</p>
          </div>
        )}

        {/* SECCIÓN 1: DATOS DEL PRODUCTO */}
        <section className="space-y-10">
          <header className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-surface-container-low border border-outline-variant/10 flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-secondary">inventory</span>
            </div>
            <div>
              <h3 className="font-headline text-3xl tracking-tight">Especificaciones del Producto</h3>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">Identidad fundamental y marca</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="md:col-span-2">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Nombre de la Pieza</label>
              <input 
                name="name" 
                type="text" 
                required 
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-lg font-headline italic placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all" 
                placeholder="Ej. Bolso de Piel de Becerro" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Descripción / Concepto</label>
              <textarea 
                name="description" 
                rows={2}
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-sm font-body placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all resize-none" 
                placeholder="Describe la artesanía y materiales..." 
              />
            </div>

            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Casa / Marca</label>
              <input 
                name="brand" 
                type="text" 
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-sm font-label placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all" 
                placeholder="Ej. Maison Dior" 
              />
            </div>

            <div className="flex items-center space-x-6 pt-6">
               <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" name="isActive" defaultChecked className="hidden peer" />
                  <div className="w-5 h-5 border border-outline-variant group-hover:border-secondary peer-checked:bg-on-surface peer-checked:border-on-surface transition-all flex items-center justify-center mr-3">
                     <span className="material-symbols-outlined text-[14px] text-surface hidden peer-checked:block">check</span>
                  </div>
                  <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface">Producto Activo</span>
               </label>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: PRIMERA VARIANTE */}
        <section className="space-y-10">
          <header className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-surface-container-low border border-outline-variant/10 flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-secondary">layers</span>
            </div>
            <div>
              <h3 className="font-headline text-3xl tracking-tight">Variante Inicial & Logística</h3>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">Configuración del primer SKU y disponibilidad</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Código SKU</label>
              <input 
                name="sku" 
                type="text" 
                required 
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-sm font-mono placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all uppercase" 
                placeholder="LUXE-BG-001" 
              />
            </div>

            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Inversión / Precio</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  required 
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant pl-6 pr-0 py-3 text-sm font-label placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all" 
                  placeholder="0.00" 
                />
              </div>
            </div>

            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Stock Inicial</label>
              <input 
                name="stock" 
                type="number" 
                defaultValue="0"
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-sm font-label placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all" 
                placeholder="Cantidad" 
              />
            </div>

            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Color</label>
              <input 
                name="color" 
                type="text" 
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-sm font-label placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all" 
                placeholder="Ej. Marfil" 
              />
            </div>

            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Talla / Tamaño</label>
              <input 
                name="size" 
                type="text" 
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-sm font-label placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all" 
                placeholder="Ej. Large, 38, Unica" 
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">URL Imagen Principal</label>
              <input 
                name="imageUrl" 
                type="url" 
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-sm font-label placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all" 
                placeholder="https://images.unsplash.com/..." 
              />
            </div>
          </div>
        </section>

        <footer className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center space-x-4 text-on-surface-variant opacity-60 italic">
              <span className="material-symbols-outlined text-sm">info</span>
              <p className="text-[10px] tracking-wide">Se registrará automáticamente una entrada de inventario al crear el producto.</p>
           </div>
           
           <div className="flex items-center space-x-6">
              <button 
                type="button" 
                onClick={() => window.history.back()}
                className="text-[10px] font-label uppercase tracking-[0.3em] text-on-surface-variant hover:text-on-surface"
              >
                Cancelar
              </button>
              <button 
                disabled={pending}
                type="submit" 
                className="bg-on-surface text-surface px-12 py-5 font-label text-[10px] uppercase tracking-[0.3em] hover:bg-secondary transition-all shadow-lg hover:shadow-secondary/20 disabled:opacity-50"
              >
                {pending ? 'Registrando...' : 'Finalizar Catálogo'}
              </button>
           </div>
        </footer>
      </form>
    </div>
  );
}
