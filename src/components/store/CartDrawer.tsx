'use client'

import { useCart } from '@/context/CartContext'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

export default function CartDrawer() {
  const {
    items, isOpen, closeCart,
    removeItem, updateQuantity,
    totalItems, totalPrice, clearCart
  } = useCart()

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  }).format(price)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md
            bg-[#0e0e0e] border-l border-[#00FFC2]/10 z-[70]
            flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6
            border-b border-white/5">
              <div>
                <h2 className="font-['Space_Grotesk'] text-xl font-black
                uppercase tracking-tighter text-white">
                  CART_{totalItems}
                </h2>
                <p className="text-[10px] font-['Space_Grotesk']
                uppercase tracking-[0.3em] text-[#00FFC2]/60 mt-1">
                  {totalItems} artículo{totalItems !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="w-10 h-10 flex items-center justify-center
                border border-white/10 text-white/50
                hover:border-[#00FFC2] hover:text-[#00FFC2]
                transition-all"
              >
                <span className="material-symbols-outlined"
                style={{fontSize:'18px'}}>close</span>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center
                h-full space-y-6 opacity-40">
                  <span className="material-symbols-outlined text-[60px]
                  text-[#00FFC2]/30">shopping_bag</span>
                  <p className="font-['Space_Grotesk'] text-[12px]
                  uppercase tracking-[0.4em] text-white/50 text-center">
                    CART_EMPTY
                  </p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id}
                    className="bg-[#111]/60 border border-white/5 p-4
                    space-y-4 hover:border-[#00FFC2]/20 transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Imagen */}
                      <div className="w-20 h-20 bg-[#0a0a0a]
                      flex items-center justify-center shrink-0
                      overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="material-symbols-outlined
                          text-white/20" style={{fontSize:'28px'}}>
                            inventory_2
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-['Space_Grotesk'] text-sm
                        font-bold text-white uppercase tracking-tight
                        line-clamp-1">
                          {item.productName}
                        </p>
                        <p className="text-[10px] font-['Space_Grotesk']
                        uppercase tracking-[0.2em] text-white/30">
                          {item.companyName}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {item.color && (
                            <span className="text-[9px] px-2 py-0.5
                            bg-white/5 border border-white/10
                            text-white/50 uppercase tracking-wider">
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="text-[9px] px-2 py-0.5
                            bg-white/5 border border-white/10
                            text-white/50 uppercase tracking-wider">
                              {item.size}
                            </span>
                          )}
                        </div>
                        <p className="font-['Space_Grotesk'] text-[#00FFC2]
                        font-black text-sm">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Eliminar */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-white/20 hover:text-red-400
                        transition-colors shrink-0 self-start"
                      >
                        <span className="material-symbols-outlined"
                        style={{fontSize:'16px'}}>delete</span>
                      </button>
                    </div>

                    {/* Cantidad */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border
                      border-white/10">
                        <button
                          onClick={() => updateQuantity(
                            item.id, item.quantity - 1
                          )}
                          className="w-8 h-8 flex items-center
                          justify-center text-white/50
                          hover:text-white hover:bg-white/5
                          transition-all"
                        >
                          <span className="material-symbols-outlined"
                          style={{fontSize:'14px'}}>remove</span>
                        </button>
                        <span className="w-10 text-center
                        font-['Space_Grotesk'] text-sm font-bold
                        text-white">
                          {String(item.quantity).padStart(2, '0')}
                        </span>
                        <button
                          onClick={() => updateQuantity(
                            item.id, item.quantity + 1
                          )}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center
                          justify-center text-white/50
                          hover:text-[#00FFC2] hover:bg-white/5
                          transition-all disabled:opacity-20
                          disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined"
                          style={{fontSize:'14px'}}>add</span>
                        </button>
                      </div>
                      <p className="font-['Space_Grotesk'] text-sm
                      font-black text-white">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="font-['Space_Grotesk'] text-[11px]
                  uppercase tracking-[0.3em] text-white/40">TOTAL</span>
                  <span className="font-['Space_Grotesk'] text-2xl
                  font-black text-[#00FFC2]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-4 bg-[#00FFC2] text-black
                  font-['Space_Grotesk'] font-black uppercase text-[12px]
                  tracking-[0.3em] hover:bg-white transition-all
                  duration-300 flex items-center justify-center"
                >
                  PROCEED TO CHECKOUT →
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full py-3 border border-white/10
                  text-white/30 font-['Space_Grotesk'] text-[10px]
                  uppercase tracking-[0.3em] hover:border-red-500/30
                  hover:text-red-400 transition-all"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
