"use client";
import React from 'react';

interface CartSummaryProps {
  subtotal: number;
  shipping: number | "FREE";
  tax: number;
}

import { useRouter } from 'next/navigation';

export const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, shipping, tax }) => {
  const router = useRouter();
  const total = subtotal + tax + (typeof shipping === 'number' ? shipping : 0);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <aside className="w-full lg:w-[400px] shrink-0">
      <div className="bg-[#141414]/60 backdrop-blur-md p-8 rounded-lg border border-[#00ffc2]/20 sticky top-32 shadow-[0_0_20px_rgba(0,255,194,0.05)]">
        <h2 className="font-['Space_Grotesk'] font-semibold text-xl text-white uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-4">
          Order Summary
        </h2>
        
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between font-['Space_Grotesk'] font-bold text-[12px] uppercase tracking-widest text-[#b9cbc1]">
            <span>SUBTOTAL</span>
            <span className="text-white">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between font-['Space_Grotesk'] font-bold text-[12px] uppercase tracking-widest text-[#b9cbc1]">
            <span>ESTIMATED SHIPPING</span>
            <span className="text-white">{typeof shipping === 'number' ? formatPrice(shipping) : shipping}</span>
          </div>
          <div className="flex justify-between font-['Space_Grotesk'] font-bold text-[12px] uppercase tracking-widest text-[#b9cbc1]">
            <span>TAX (CALCULATED AT CHECKOUT)</span>
            <span className="text-white">{formatPrice(tax)}</span>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 mb-10">
          <div className="flex justify-between items-baseline text-white">
            <span className="font-['Space_Grotesk'] font-semibold text-lg uppercase tracking-wider">Total</span>
            <span className="font-['Space_Grotesk'] font-bold text-4xl text-[#00ffc2] tracking-tighter">
              {formatPrice(total)}
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => router.push('/checkout')}
          className="w-full bg-[#00ffc2] text-[#007255] font-['Space_Grotesk'] font-bold text-[12px] uppercase tracking-widest py-6 rounded-none shadow-[0_0_20px_rgba(0,255,194,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
        >
          PROCEED TO CHECKOUT
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#b9cbc1]/60">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span className="text-[10px] font-['Space_Grotesk'] font-bold uppercase tracking-widest">SECURE AES-256 ENCRYPTION</span>
          </div>
          <div className="flex items-center gap-3 text-[#b9cbc1]/60">
            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            <span className="text-[10px] font-['Space_Grotesk'] font-bold uppercase tracking-widest">EXPEDITED DISPATCH WITHIN 24H</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
