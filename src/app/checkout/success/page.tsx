'use client'
import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import GlobalNavbar from '@/components/common/GlobalNavbar'

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'UNKNOWN'

  useEffect(() => { 
    clearCart() 
  }, [clearCart])

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-['Inter'] selection:bg-[#00FFC2] selection:text-[#003828] flex flex-col">
      <GlobalNavbar session={null as any} showCart={false} />
      
      <main className="flex-1 flex flex-col items-center justify-center p-8 mt-20">
        <div className="w-24 h-24 rounded-full border-2 border-[#00FFC2] flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-[#00FFC2]/20 blur-xl rounded-full animate-pulse"></div>
          <span className="material-symbols-outlined text-[48px] text-[#00FFC2] relative z-10">check_circle</span>
        </div>
        
        <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl font-black text-white uppercase tracking-tighter text-center mb-4">
          ORDER_CONFIRMED
        </h1>
        
        <div className="bg-white/5 border border-white/10 px-8 py-6 mb-12 text-center">
          <p className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-white/40 mb-2">TRANSACTION ID</p>
          <p className="font-['Space_Grotesk'] text-2xl font-bold text-[#00FFC2] tracking-wider">ORD-{orderId}</p>
        </div>
        
        <p className="text-white/60 font-['Inter'] max-w-md text-center mb-12">
          Su orden ha sido recibida y está siendo procesada. Recibirá un correo electrónico con los detalles y la confirmación de envío pronto.
        </p>
        
        <Link 
          href="/"
          className="border border-[#00FFC2]/30 text-[#00FFC2] font-['Space_Grotesk'] px-12 py-4 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#00FFC2] hover:text-black transition-all duration-300"
        >
          RETURN TO MALL
        </Link>
      </main>
    </div>
  )
}
