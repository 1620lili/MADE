"use client";
import React from 'react';

// Using any for items temporarily since we are bridging to CartContext types
interface CartItemListProps {
  items: any[];
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({ items, updateQuantity, removeItem }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="flex-grow flex flex-col gap-6">
      {items.map((item) => (
        <div key={item.id} className="glass-card p-6 flex flex-col md:flex-row items-center gap-8 rounded-lg razor-border bg-[#141414]/60 backdrop-blur-md border border-white/5">
          <div className="w-full md:w-48 h-48 bg-[#201f1f] rounded flex items-center justify-center overflow-hidden relative group shrink-0">
            <img 
              alt={item.productName} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100" 
              src={item.imageUrl}
            />
          </div>
          
          <div className="flex-grow flex flex-col justify-between h-full py-2 w-full">
            <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap">
              <div>
                <h3 className="font-['Space_Grotesk'] font-semibold text-2xl uppercase tracking-wider mb-2 text-white">
                  {item.productName}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.color && (
                    <span className="bg-[#353534] px-3 py-1 rounded font-['Space_Grotesk'] font-bold text-[10px] text-[#b7b5b4] uppercase tracking-widest">
                      {item.color}
                    </span>
                  )}
                  {item.size && (
                    <span className="bg-[#353534] px-3 py-1 rounded font-['Space_Grotesk'] font-bold text-[10px] text-[#b7b5b4] uppercase tracking-widest">
                      {item.size}
                    </span>
                  )}
                  {item.variantSku && (
                    <span className="bg-[#353534] px-3 py-1 rounded font-['Space_Grotesk'] font-bold text-[10px] text-[#b7b5b4] uppercase tracking-widest">
                      {item.variantSku}
                    </span>
                  )}
                </div>
              </div>
              <span className="font-['Space_Grotesk'] font-semibold text-[#00ffc2] text-2xl whitespace-nowrap">
                {formatPrice(item.price)}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center border border-white/10 rounded overflow-hidden">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-4 py-2 hover:bg-white/5 transition-colors text-white/60 font-bold"
                >
                  —
                </button>
                <span className="px-4 py-2 font-['Space_Grotesk'] font-semibold text-sm border-x border-white/10 text-white">
                  {String(item.quantity).padStart(2, '0')}
                </span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="px-4 py-2 hover:bg-white/5 transition-colors text-white/60 font-bold disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={() => removeItem(item.id)}
                className="text-[#b9cbc1] hover:text-[#ffb4ab] transition-colors flex items-center gap-2 font-['Space_Grotesk'] font-bold text-[12px] uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-lg" style={{fontSize: '18px'}}>delete</span>
                REMOVE
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
