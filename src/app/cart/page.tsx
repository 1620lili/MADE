'use client';

import React from 'react';
import GlobalNavbar from "@/components/common/GlobalNavbar";
import { CartItemList } from "@/components/store/CartItemList";
import { CartSummary } from "@/components/store/CartSummary";
import { CartRecommendations } from "@/components/store/CartRecommendations";
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { 
    items, removeItem, updateQuantity, 
    totalItems, totalPrice, clearCart 
  } = useCart();
  const router = useRouter();

  const mockRecommendations = [
    {
      id: "rec1",
      name: "Lumina MK-II",
      price: 159.00,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZvPrZ_TeDgd_3DOYeSDKRSTQPCpkwMn_GFvRRyYjXhll4Z_Z1deVQ8neyc46GTd4E60lvbw_SC8QRN8x8awV6W3oSFN9gWcUePyxe6x2WxrUDoedDhlq-o3XEecd4qexIi-5PUnfLcEzFJjgl9Go-MaOU7mxazeAjTbcwcJn7OoHLTL87FsTjenTlSSAXWFJwT7dV8Du-OxbglBiBE4GvF4QMxoCMFGkyofqDSKdNiC1c0A04l-6NWI7sAT8JZOp29S1GHJrv4gNw",
    },
    {
      id: "rec2",
      name: "Titan Desk Mat",
      price: 45.00,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_34bEFhZ4xoV0i8FCrY9tX1GJzA0CF1OkIp3RpK01oQuaMh1J7DIwL_oP8qFPIGAkq-_p3y6zKyY-GTvbP4Vpm2UT8IHlptJk9dEADIuIzZTw6jqaiVruzEnODnNPUBOjOfKYv5M56_xH1hmf0nPltS4RqujVrK-CqcEJmquO7Og5xOd0YdLqDDQJeTY69A0vD8g37OFi1qnmqy2EVZozGL_3txdl0E7RpeMKSbdj43qRqZKfGEwIgoumnUn2rPEexSokiLWIFVmw",
    },
    {
      id: "rec3",
      name: "Vector Pro Arm",
      price: 129.00,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGytKFqfmcnU12Tl1qRYDyUAwMNCHYv3Fa8sIj-miJIV_mGnyTyE3djYKFAimIBLisTMIwdDwoA97QiMd7PJoWUEf4ZzEW0q70Zb_QNevhezKwAYe6eDv5bLdq_1F1XxRvTMX9laQ0Nwx_skpvj6WkeScVFqIFwqekZJZ3lygoLOxhtNA4AOqiAdAuvgS_n29iRcWoPIeuszE0p_dTLrmtgObEkVIwZaPXQrstH88YjEODhZYt1PUhHDPwvZeG7ihJLsDQhdA3vUlB",
    },
    {
      id: "rec4",
      name: "Aether Cables",
      price: 39.00,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEo72md2v2KBhrNx-8Q27dNemv_ZHl2M4_TtQeH2xnJorCWriQPE6MDVauFdsK7xiUZPWbL4Z41v7IQlzbDoNTGO7PM-SJArsrrOPVB3CV4wkr3jAp8iR_IOUSFaGpM56RrL2fVkxvS2COnAWHZHtFhXIDSOkdzfUeB1MNveajvCslpZu7v5hJVc7dh2ZjMyd1NooXFZ-8AqLGjgMOckg1t535mSlRqmUj9lInhQT-CSP4gYY4ovaJz2NBWc_NhuCrA0OtRKEdzC54",
    }
  ];

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-['Inter'] selection:bg-[#00FFC2] selection:text-[#003828]">
      <GlobalNavbar session={null as any} showCart={true} />

      <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-40 pb-16">
        <div className="flex flex-col gap-4 mb-12">
          <h1 className="font-['Space_Grotesk'] text-5xl uppercase tracking-tight font-bold text-white">Your Arsenal</h1>
          <button 
            onClick={() => router.back()}
            className="font-['Space_Grotesk'] font-bold text-[12px] uppercase tracking-widest text-[#b9cbc1] flex items-center gap-2 hover:text-[#00FFC2] transition-colors group w-fit"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Continue Shopping
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-40 space-y-6 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[60px] text-[#00FFC2]/20">shopping_bag</span>
            <p className="font-['Space_Grotesk'] text-white/30 uppercase tracking-[0.4em] text-sm">CART_EMPTY</p>
            <button 
              onClick={() => router.back()}
              className="border border-[#00FFC2]/20 text-[#00FFC2] px-8 py-3 font-['Space_Grotesk'] text-[11px] uppercase tracking-[0.3em] hover:bg-[#00FFC2] hover:text-black transition-all mt-4"
            >
              ← CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <CartItemList 
              items={items} 
              updateQuantity={updateQuantity} 
              removeItem={removeItem} 
            />
            <CartSummary subtotal={totalPrice} shipping="FREE" tax={0} />
          </div>
        )}

        <CartRecommendations recommendations={mockRecommendations} />
      </main>

      <footer className="bg-[#050505] w-full mt-32 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-12 py-24 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-bold text-white tracking-[0.3em] font-['Space_Grotesk']">TECNO STORE MEDELLÍN</div>
          <div className="flex gap-12 font-['Space_Grotesk'] text-[10px] tracking-widest uppercase text-white/40">
            <a className="hover:text-[#00FFC2] transition-colors cursor-pointer opacity-80 hover:opacity-100" href="#">WARRANTY</a>
            <a className="hover:text-[#00FFC2] transition-colors cursor-pointer opacity-80 hover:opacity-100" href="#">DRIVERS</a>
            <a className="hover:text-[#00FFC2] transition-colors cursor-pointer opacity-80 hover:opacity-100" href="#">SUPPORT</a>
            <a className="hover:text-[#00FFC2] transition-colors cursor-pointer opacity-80 hover:opacity-100" href="#">PRIVACY</a>
            <a className="hover:text-[#00FFC2] transition-colors cursor-pointer opacity-80 hover:opacity-100" href="#">TERMS</a>
          </div>
          <div className="font-['Space_Grotesk'] text-[10px] tracking-widest uppercase text-white/40">
            © 2024 TECNO STORE MEDELLÍN. ENGINEERED FOR PRECISION.
          </div>
        </div>
      </footer>
    </div>
  );
}
