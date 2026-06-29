'use client';

import { useTransition } from 'react';
import { toggleProductStatus } from '@/features/inventory/actions';

interface ProductData {
  id: number;
  name: string;
  brand: string | null;
  isActive: boolean;
  companyId?: number;
  ProductVariant: {
    price: number;
    stock: number;
    imageUrl?: string | null;
  }[];
  ProductImage: {
    url: string;
    isMain: boolean;
  }[];
  Company?: {
    name: string;
  };
}

interface InventoryTableProps {
  products: ProductData[];
  showCompany?: boolean;
}

export default function InventoryTable({ products, showCompany }: InventoryTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (id: number, current: boolean) => {
    startTransition(async () => {
      try {
        await toggleProductStatus(id, current);
      } catch (error) {
        alert('Error al actualizar el estado del producto');
      }
    });
  };

  if (products.length === 0) {
    return (
      <div className="bg-surface-lowest border border-outline-variant/10 rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-low/30 border-b border-outline-variant/20">
              <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant">Producto</th>
              {showCompany && (
                <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant">Boutique</th>
              )}
              <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Variantes</th>
              <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Stock Total</th>
              <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Desde</th>
              <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Estado</th>
              <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={showCompany ? 7 : 6}>
                <div className="text-center py-20 space-y-4">
                  <span className="material-symbols-outlined text-outline-variant" style={{fontSize: '48px'}}>inventory_2</span>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    El inventario está actualmente vacío.
                  </p>
                  <p className="text-[9px] text-outline-variant">
                    Selecciona una boutique y agrega tu primer producto.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-surface-lowest border border-outline-variant/10 rounded-sm shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-low/30 border-b border-outline-variant/20">
            <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant">Producto</th>
            {showCompany && (
              <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant">Boutique</th>
            )}
            <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Variantes</th>
            <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Stock Total</th>
            <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Desde</th>
            <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Estado</th>
            <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {products.map((product) => {
            const mainImage = product.ProductImage.find(img => img.isMain)?.url || product.ProductVariant?.[0]?.imageUrl;
            const variants = product.ProductVariant || [];
            const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);
            const minPrice = variants.length > 0 ? Math.min(...variants.map(v => v.price)) : 0;
            const formattedPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(minPrice);

            return (
              <tr key={product.id} className="hover:bg-surface-low/30 transition-colors group">
                <td className="px-8 py-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-surface-container-low border border-outline-variant/10 flex items-center justify-center overflow-hidden shrink-0">
                      {mainImage ? (
                        <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <span className="material-symbols-outlined text-outline-variant opacity-40" style={{fontSize: '24px'}}>inventory_2</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline text-lg group-hover:text-secondary transition-colors italic">{product.name}</span>
                      <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{product.brand || 'Atelier Selection'}</span>
                    </div>
                  </div>
                </td>
                
                {showCompany && (
                  <td className="px-8 py-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {product.Company?.name || '---'}
                    </span>
                  </td>
                )}

                <td className="px-8 py-8 text-center text-xs font-label">
                  {variants.length} SKU
                </td>

                <td className="px-8 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-bold ${totalStock < 5 ? 'text-error' : 'text-on-surface'}`}>{totalStock}</span>
                    <span className="text-[0.55rem] font-bold uppercase tracking-widest text-outline-variant">Unidades</span>
                  </div>
                </td>

                <td className="px-8 py-8 text-center font-label text-sm">
                  {formattedPrice}
                </td>

                <td className="px-8 py-8 text-center">
                  <span className={`text-[0.55rem] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm ${product.isActive ? 'bg-secondary/10 text-secondary' : 'bg-surface-low text-on-surface-variant border border-outline-variant/10'}`}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                <td className="px-8 py-8 text-right">
                  <div className="flex items-center justify-end space-x-4">
                    <button className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors" title="Ver Variantes" style={{fontSize: '20px'}}>layers</button>
                    {product.companyId && (
                      <a href={`/admin/inventario/${product.companyId}/${product.id}/editar`} className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors" title="Editar" style={{fontSize: '20px'}}>edit_square</a>
                    )}
                    <button 
                      onClick={() => handleToggleStatus(product.id, product.isActive)}
                      disabled={isPending}
                      className={`material-symbols-outlined transition-colors ${product.isActive ? 'text-on-surface-variant hover:text-error' : 'text-secondary hover:text-on-surface'}`}
                      title={product.isActive ? 'Desactivar' : 'Activar'}
                      style={{fontSize: '20px'}}
                    >
                      {product.isActive ? 'visibility_off' : 'visibility'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
