'use client';

import { useState } from 'react';
import Link from 'next/link';
import EditVariantsModal from './EditVariantsModal';

interface InventoryGridProps {
  products: any[];
}

export default function InventoryGrid({ products }: InventoryGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products?.map((product) => {
          const variants = (product.ProductVariant as any[]) || [];
          const mainImage = (product.ProductImage as any[])?.find(img => img.isMain)?.url || variants[0]?.imageUrl || 'https://placehold.co/600x800/222/white?text=LUXE';
          const minPrice = variants.length > 0 ? Math.min(...variants.map(v => v.price)) : 0;
          const totalStock = variants.reduce((acc, v) => acc + v.stock, 0);

          return (
            <div key={product.id} className="bg-surface-lowest border border-outline-variant/10 group flex flex-col">
              <div className="aspect-[3/4] overflow-hidden relative bg-surface-container-low">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
                {!product.isActive && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="text-[8px] font-label uppercase tracking-[0.3em] bg-surface px-4 py-2 border border-outline-variant/20">Inactivo</span>
                  </div>
                )}
                {totalStock < 5 && product.isActive && (
                   <div className="absolute top-4 right-4 bg-error text-white px-3 py-1 rounded-sm text-[8px] font-label uppercase tracking-widest animate-in fade-in">
                      Stock Bajo
                   </div>
                )}
              </div>
              
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="space-y-1">
                  <p className="text-[8px] font-label uppercase tracking-widest text-secondary">{product.brand}</p>
                  <h4 className="font-headline text-xl italic tracking-tight text-on-surface line-clamp-1">{product.name}</h4>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5 mt-auto">
                   <div>
                      <p className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant mb-1">Desde</p>
                      <p className="text-sm font-label font-bold">${minPrice.toLocaleString('es-CL')}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant mb-1">Total Stock</p>
                      <p className={`text-sm font-label font-bold ${totalStock < 5 ? 'text-error' : ''}`}>{totalStock}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4">
                   <Link 
                     href={`/dashboard/inventario/${product.id}/editar`}
                     className="py-2 border border-outline-variant/20 text-[8px] font-label uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-all text-center"
                   >
                     Editar
                   </Link>
                   <button 
                     onClick={() => setSelectedProduct(product)}
                     className="py-2 border border-outline-variant/20 text-[8px] font-label uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-all"
                   >
                     Variantes
                   </button>
                </div>
              </div>
            </div>
          );
        })}

        {(!products || products.length === 0) && (
          <div className="col-span-full py-24 text-center bg-surface-lowest border border-outline-variant/10 italic">
             <span className="material-symbols-outlined text-4xl text-outline-variant mb-4 opacity-50">shopping_bag</span>
             <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Aún no has registrado piezas en tu catálogo</p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <EditVariantsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}
