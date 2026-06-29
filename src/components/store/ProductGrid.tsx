'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'

interface ProductGridProps {
  products: any[]
  company: any
}

export default function ProductGrid({ products, company }: ProductGridProps) {
  const { addItem } = useCart()

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  }).format(price)

  if (!products || products.length === 0) {
    return (
      <div className="py-40 flex flex-col items-center
      justify-center space-y-8 opacity-40">
        <span className="material-symbols-outlined text-[80px]
        text-[#00FFC2]/50 animate-pulse">grid_view</span>
        <div className="text-center space-y-4">
          <span className="font-['Space_Grotesk'] text-[14px]
          font-bold uppercase tracking-[0.6em] text-white">
            COLLECTION_PENDING
          </span>
          <p className="font-['Inter'] text-sm text-white/40
          max-w-xs mx-auto">
            Estamos curando una selección exclusiva.
            Vuelve pronto.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2
    lg:grid-cols-3 gap-10">
      {products.map((product: any) => {
        const mainImage =
          product.ProductImage?.find((img: any) => img.isMain)?.url
          || product.ProductVariant?.[0]?.imageUrl
          || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop'

        const variants = product.ProductVariant || []
        const minPrice = variants.length > 0
          ? Math.min(...variants.map((v: any) => v.price))
          : 0
        const totalStock = variants.reduce(
          (sum: number, v: any) => sum + (v.stock || 0), 0
        )
        const colors = [...new Set(
          variants.map((v: any) => v.color).filter(Boolean)
        )]
        const sizes = [...new Set(
          variants.map((v: any) => v.size).filter(Boolean)
        )]

        const handleAddToCart = () => {
          if (totalStock <= 0) return
          // Usar primera variante disponible con stock
          const variant = variants.find((v: any) => v.stock > 0)
            || variants[0]
          if (!variant) return

          addItem({
            id: `${product.id}-${variant.id}`,
            productId: product.id,
            variantId: variant.id,
            productName: product.name,
            variantSku: variant.sku,
            price: variant.price,
            stock: variant.stock || 0,
            color: variant.color || undefined,
            size: variant.size || undefined,
            imageUrl: mainImage,
            companyId: company.id,
            companyName: company.name,
          })
        }

        return (
          <div key={product.id}
            className="bg-[#111111]/40 backdrop-blur-sm
            border border-[#00FFC2]/5 p-10 space-y-8 group
            hover:border-[#00FFC2]/30 transition-all duration-500
            rounded-sm hover:shadow-[0_0_40px_rgba(0,255,194,0.05)]"
          >
            {/* Imagen */}
            <div className="relative overflow-visible h-72
            flex items-center justify-center
            bg-[#0a0a0a]/50 rounded-sm">
              <div className="absolute inset-0 bg-[#00FFC2]/5
              rounded-full blur-3xl opacity-0
              group-hover:opacity-100 transition-opacity" />
              <img
                src={mainImage}
                alt={product.name}
                className="relative z-10 max-h-full max-w-full
                object-contain transform group-hover:scale-110
                transition-transform duration-700"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#050505]/95
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
              flex flex-col items-center justify-center
              p-10 gap-8 backdrop-blur-md z-20">
                {colors.length > 0 && (
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-['Space_Grotesk']
                    font-bold uppercase tracking-[0.3em] text-[#00FFC2]">
                      COLOR_VARIANTS
                    </span>
                    <div className="flex gap-3">
                      {(colors as string[]).map((color) => (
                        <div
                          key={color}
                          className="w-5 h-5 rounded-full
                          border border-white/20"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {sizes.length > 0 && (
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-['Space_Grotesk']
                    font-bold uppercase tracking-[0.3em] text-[#00FFC2]">
                      SIZE_SYSTEM
                    </span>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {(sizes as string[]).map((size) => (
                        <span key={size}
                          className="text-[11px] font-['Space_Grotesk']
                          font-bold text-white px-3 py-1.5
                          bg-white/5 border border-white/10
                          rounded-sm uppercase tracking-tighter"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {totalStock <= 0 && (
                <div className="absolute top-4 left-4
                bg-[#93000a] text-[#ffdad6] px-3 py-1.5
                text-[10px] font-['Space_Grotesk'] font-bold
                uppercase tracking-[0.2em] z-30 rounded-sm
                border border-[#ffb4ab]/20">
                  OUT_OF_STOCK
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-['Space_Grotesk'] text-2xl
                  font-bold text-white group-hover:text-[#00FFC2]
                  transition-colors uppercase leading-none">
                    {product.name}
                  </h3>
                  <p className="font-['Space_Grotesk'] text-[11px]
                  font-bold uppercase tracking-[0.2em] text-white/30">
                    {product.brand || company.name}
                  </p>
                </div>
                <span className="font-['Space_Grotesk'] text-xl
                font-black text-[#00FFC2] tracking-tighter shrink-0">
                  {formatPrice(minPrice)}
                </span>
              </div>

              <div className="flex items-center gap-3
              border-t border-white/5 pt-6">
                <span className="px-3 py-1.5 bg-white/5 text-[10px]
                font-bold tracking-tighter uppercase text-white/50
                border border-white/5 rounded-sm">
                  Premium Edition
                </span>
                <span className={`px-3 py-1.5 text-[10px] font-bold
                tracking-tighter uppercase rounded-sm
                ${totalStock > 0
                  ? 'bg-[#00FFC2]/5 text-[#00FFC2] border border-[#00FFC2]/10'
                  : 'bg-red-500/5 text-red-400 border border-red-500/10'
                }`}>
                  {totalStock > 0 ? `${totalStock} Available` : 'Agotado'}
                </span>
              </div>

              {/* Botón ADD TO CART funcional */}
              <button
                onClick={handleAddToCart}
                disabled={totalStock <= 0}
                className="w-full py-4 border border-[#00FFC2]/20
                text-[#00FFC2] font-['Space_Grotesk'] font-bold
                uppercase text-[11px] tracking-[0.3em]
                hover:bg-[#00FFC2] hover:text-black
                hover:border-[#00FFC2] transition-all duration-300
                disabled:opacity-30 disabled:cursor-not-allowed
                active:scale-95"
              >
                {totalStock <= 0 ? 'OUT_OF_STOCK' : 'ADD TO CART +'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
