'use client';

import { useState } from 'react';
import Link from 'next/link';
import EditCompanyModal from '@/components/company/EditCompanyModal';
import EditProductModal from '@/components/inventory/EditProductModal';
import VariantsModal from '@/components/inventory/VariantsModal';
import { toggleProductStatus } from '@/features/inventory/actions';
import type { SessionPayload } from '@/features/auth/session';

interface ManageCompanyClientProps {
  company: any;
  products: any[];
  companyUsers: any[];
  session: SessionPayload;
  isSuper: boolean;
}

type Tab = 'coleccion' | 'equipo' | 'info';

export default function ManageCompanyClient({
  company,
  products: initialProducts,
  companyUsers,
  session,
  isSuper,
}: ManageCompanyClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('coleccion');
  const [showEditCompany, setShowEditCompany] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [variantsProduct, setVariantsProduct] = useState<any | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'coleccion', label: 'Colección', icon: 'inventory_2' },
    { key: 'equipo', label: 'Equipo', icon: 'group' },
    { key: 'info', label: 'Información', icon: 'info' },
  ];

  const handleToggleProduct = async (productId: number, currentStatus: boolean) => {
    const msg = currentStatus
      ? '¿Desactivar este producto? Dejará de ser visible en la tienda.'
      : '¿Activar este producto? Será visible en la tienda.';
    if (!confirm(msg)) return;
    setTogglingId(productId);
    try {
      await toggleProductStatus(productId, currentStatus);
    } catch {
      alert('Error al cambiar el estado del producto.');
    } finally {
      setTogglingId(null);
    }
  };

  const addProductHref = isSuper
    ? `/admin/inventario/${company.id}/nuevo`
    : '/dashboard/inventario/nuevo';

  return (
    <div className="space-y-0">
      {/* ───────── HERO HEADER ───────── */}
      <div className="relative w-full h-64 md:h-72 overflow-hidden -mt-8 -mx-8 md:-mx-12" style={{ width: 'calc(100% + 4rem)' }}>
        <img
          src={
            company.bannerUrl ||
            'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop'
          }
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-12 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-end gap-6">
              {/* Logo */}
              <div className="w-20 h-20 bg-surface-lowest border border-outline-variant/20 flex items-center justify-center overflow-hidden shadow-xl flex-shrink-0">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-3xl text-outline-variant">store</span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="font-headline text-3xl md:text-4xl tracking-tight text-on-surface">
                    {company.name}
                  </h1>
                  <span
                    className={`text-[0.55rem] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-sm ${
                      company.isActive
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-error/10 text-error'
                    }`}
                  >
                    {company.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                  <span className="text-[10px] font-label uppercase tracking-widest">
                    {company.city}, {company.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href={`/store/${company.id}`}
                className="flex items-center gap-2 px-6 py-2.5 border border-outline-variant/20 text-[10px] font-label uppercase tracking-widest text-on-surface hover:bg-on-surface hover:text-surface transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>storefront</span>
                Ver en el Mall
              </Link>
              {isSuper && (
                <button
                  onClick={() => setShowEditCompany(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-surface text-[10px] font-label uppercase tracking-widest hover:bg-secondary-dim transition-all"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                  Editar Empresa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ───────── TABS ───────── */}
      <div className="border-b border-outline-variant/10 mt-8 mb-10">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-8 py-4 text-[10px] font-label uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab.key
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ───────── TAB CONTENT ───────── */}

      {/* TAB 1: COLECCIÓN */}
      {activeTab === 'coleccion' && (
        <div className="space-y-8">
          {/* Header + Add button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h2 className="font-headline text-2xl tracking-tight">Catálogo de Productos</h2>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                {initialProducts.length} producto{initialProducts.length !== 1 ? 's' : ''} registrado{initialProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link
              href={addProductHref}
              className="bg-on-surface text-surface px-8 py-3.5 text-[10px] tracking-widest uppercase font-label font-bold hover:bg-secondary transition-all shadow-lg hover:shadow-secondary/20 flex items-center gap-3"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
              Agregar Producto
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {initialProducts.map((product) => {
              const variants = (product.ProductVariant as any[]) || [];
              const images = (product.ProductImage as any[]) || [];
              const mainImage =
                images.find((img: any) => img.isMain)?.url ||
                variants[0]?.imageUrl ||
                'https://placehold.co/600x800/222/white?text=LUXE';
              const minPrice = variants.length > 0 ? Math.min(...variants.map((v: any) => v.price)) : 0;
              const totalStock = variants.reduce((acc: number, v: any) => acc + v.stock, 0);

              return (
                <div
                  key={product.id}
                  className="bg-surface-lowest border border-outline-variant/10 group flex flex-col"
                >
                  <div className="aspect-[3/4] overflow-hidden relative bg-surface-container-low">
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    {!product.isActive && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-[8px] font-label uppercase tracking-[0.3em] bg-surface px-4 py-2 border border-outline-variant/20">
                          Inactivo
                        </span>
                      </div>
                    )}
                    {totalStock === 0 && product.isActive && (
                      <div className="absolute top-4 right-4 bg-on-surface text-surface px-3 py-1 rounded-sm text-[8px] font-label uppercase tracking-widest">
                        Agotado
                      </div>
                    )}
                    {totalStock > 0 && totalStock < 5 && product.isActive && (
                      <div className="absolute top-4 right-4 bg-error text-white px-3 py-1 rounded-sm text-[8px] font-label uppercase tracking-widest animate-pulse">
                        Stock Bajo
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="space-y-1">
                      <p className="text-[8px] font-label uppercase tracking-widest text-secondary">
                        {product.brand}
                      </p>
                      <h4 className="font-headline text-xl italic tracking-tight text-on-surface line-clamp-1">
                        {product.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5 mt-auto">
                      <div>
                        <p className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
                          Desde
                        </p>
                        <p className="text-sm font-label font-bold">
                          ${minPrice.toLocaleString('es-CL')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
                          Stock
                        </p>
                        <p className={`text-sm font-label font-bold ${totalStock < 5 ? 'text-error' : ''}`}>
                          {totalStock}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4">
                      <button
                        onClick={() => setEditProduct(product)}
                        className="py-2 border border-outline-variant/20 text-[8px] font-label uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-all"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setVariantsProduct(product)}
                        className="py-2 border border-outline-variant/20 text-[8px] font-label uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-all"
                      >
                        Variantes
                      </button>
                      <button
                        onClick={() => handleToggleProduct(product.id, product.isActive)}
                        disabled={togglingId === product.id}
                        className={`py-2 border text-[8px] font-label uppercase tracking-widest transition-all disabled:opacity-50 ${
                          product.isActive
                            ? 'border-error/30 text-error hover:bg-error hover:text-white'
                            : 'border-secondary/30 text-secondary hover:bg-secondary hover:text-surface'
                        }`}
                      >
                        {product.isActive ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {initialProducts.length === 0 && (
              <div className="col-span-full py-24 text-center bg-surface-lowest border border-dashed border-outline-variant/20 space-y-4">
                <span className="material-symbols-outlined text-4xl text-outline-variant opacity-50">
                  shopping_bag
                </span>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                  Esta empresa aún no tiene productos registrados
                </p>
                <Link
                  href={addProductHref}
                  className="inline-flex items-center gap-2 mt-4 px-8 py-3 bg-secondary text-surface text-[10px] font-label uppercase tracking-widest hover:bg-secondary-dim transition-all"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
                  Crear Primer Producto
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EQUIPO */}
      {activeTab === 'equipo' && (
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="font-headline text-2xl tracking-tight">Equipo de Trabajo</h2>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
              {companyUsers.length} miembro{companyUsers.length !== 1 ? 's' : ''}
            </p>
          </div>

          {companyUsers.length > 0 ? (
            <div className="space-y-3">
              {companyUsers.map((user) => {
                const roles = (user.UserRole as any[]) || [];
                const roleName = roles[0]?.Role?.name || 'Sin rol';
                const initials = (user.fullName || 'U')
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-6 bg-surface-lowest border border-outline-variant/10 p-5 hover:border-outline-variant/30 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-surface-container flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-headline italic text-on-surface-variant">
                        {initials}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-headline text-lg tracking-tight truncate">{user.fullName}</p>
                      <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Role */}
                    <div className="hidden md:block">
                      <span className="text-[9px] font-label uppercase tracking-widest bg-surface-container px-4 py-2 text-on-surface-variant">
                        {roleName}
                      </span>
                    </div>

                    {/* Status */}
                    <span
                      className={`text-[0.55rem] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-sm ${
                        user.isActive
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center bg-surface-lowest border border-dashed border-outline-variant/20 space-y-4">
              <span className="material-symbols-outlined text-4xl text-outline-variant opacity-50">
                group_off
              </span>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                No hay usuarios asignados a esta empresa
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INFORMACIÓN */}
      {activeTab === 'info' && (
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="font-headline text-2xl tracking-tight">Datos de la Empresa</h2>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                Información legal y de contacto
              </p>
            </div>
            <button
              onClick={() => setShowEditCompany(true)}
              className="flex items-center gap-2 px-6 py-2.5 border border-outline-variant/20 text-[10px] font-label uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
              Editar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 bg-surface-lowest border border-outline-variant/10 p-10">
            <InfoField label="Nombre de la empresa" value={company.name} />
            <InfoField label="NIT / Identificación legal" value={company.legalId} />
            <InfoField label="Representante legal" value={company.legalRepresentative} />
            <InfoField label="País" value={company.country} />
            <InfoField label="Ciudad" value={company.city} />
            <InfoField label="Dirección" value={company.address || '—'} />
            <InfoField label="Email empresarial" value={company.email || '—'} />
            <InfoField label="Teléfono" value={company.phone || '—'} />

            {/* Images preview */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-outline-variant/10">
              <div className="space-y-3">
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Logo</p>
                <div className="w-24 h-24 bg-surface-low border border-outline-variant/10 flex items-center justify-center overflow-hidden">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: '32px' }}>
                      image
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Banner</p>
                <div className="w-full h-24 bg-surface-low border border-outline-variant/10 flex items-center justify-center overflow-hidden">
                  {company.bannerUrl ? (
                    <img src={company.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: '32px' }}>
                      panorama
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────── MODALS ───────── */}
      {showEditCompany && (
        <EditCompanyModal
          isOpen={showEditCompany}
          onClose={() => setShowEditCompany(false)}
          company={company}
        />
      )}

      {editProduct && (
        <EditProductModal
          isOpen={!!editProduct}
          onClose={() => setEditProduct(null)}
          product={editProduct}
        />
      )}

      {variantsProduct && (
        <VariantsModal
          isOpen={!!variantsProduct}
          onClose={() => setVariantsProduct(null)}
          product={variantsProduct}
        />
      )}
    </div>
  );
}

/* ── Helper component ── */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{label}</p>
      <p className="text-on-surface font-body text-lg">{value}</p>
    </div>
  );
}
