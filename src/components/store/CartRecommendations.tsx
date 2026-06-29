"use client";
import React from 'react';

interface Recommendation {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  onQuickAdd?: () => void;
}

interface CartRecommendationsProps {
  recommendations: Recommendation[];
  /**
   * Optional callback when "View All" is clicked.
   */
  onViewAll?: () => void;
}

export const CartRecommendations: React.FC<CartRecommendationsProps> = ({
  recommendations,
  onViewAll,
}) => {
  return (
    <section className="mt-32">
      <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
        <h2 className="font-['Space_Grotesk'] font-semibold text-3xl uppercase tracking-tighter text-white">
          Complete Your Setup
        </h2>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onViewAll?.();
          }}
          className="font-['Space_Grotesk'] font-bold text-[10px] text-[#00ffc2] hover:underline tracking-[0.2em] uppercase"
        >
          VIEW ALL ACCESSORIES
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="bg-[#141414]/60 backdrop-blur-md border border-white/5 group flex flex-col h-full rounded-lg razor-border overflow-hidden transition-all duration-500 hover:translate-y-[-8px]"
          >
            <div className="aspect-square bg-[#201f1f] relative overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                <button
                  onClick={() => item.onQuickAdd?.()}
                  className="w-full bg-white text-black font-['Space_Grotesk'] font-bold py-3 text-[10px] tracking-widest hover:bg-[#00FFC2] transition-colors uppercase"
                >
                  QUICK ADD
                </button>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-['Space_Grotesk'] font-semibold text-lg uppercase tracking-wider mb-1 text-white group-hover:text-[#00FFC2] transition-colors">
                  {item.name}
                </h3>
                <p className="text-[#b9cbc1]/60 font-['Inter'] text-xs mb-4">
                  {/* Placeholder for short description */}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-['Space_Grotesk'] font-semibold text-[#00ffc2] text-xl">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                  }).format(item.price)}
                </span>
                <button
                  onClick={() => item.onQuickAdd?.()}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined" style={{fontSize: '20px'}}>visibility</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
