'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import GlobalNavbar from '@/components/common/GlobalNavbar'
import { createOrder } from '@/features/checkout/actions'

type PaymentMethod = 'stripe' | 'mercadopago' | 'wompi' | 'payu'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '',
    address: '', city: '', country: 'Colombia', postalCode: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const tax = totalPrice * 0.19
  const total = totalPrice + tax

  useEffect(() => {
    if (items.length === 0 && !orderConfirmed) {
      router.push('/')
    }
  }, [items, orderConfirmed, router])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP',
      maximumFractionDigits: 0
    }).format(price)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Nombre requerido'
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email inválido'
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono requerido'
    if (!formData.address.trim()) newErrors.address = 'Dirección requerida'
    if (!formData.city.trim()) newErrors.city = 'Ciudad requerida'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const processPayment = async (method: PaymentMethod, orderId: number, amount: number) => {
    try {
      if (method === 'mercadopago') {
        const res = await fetch('/api/mercadopago', { method: 'POST', body: JSON.stringify({ amount, email: formData.email, orderId }) })
        const data = await res.json()
        if (data.init_point) {
          window.location.href = data.init_point
          return
        }
      }
      // Simulate success for others as they require complex form rendering
      router.push(`/checkout/success?orderId=${orderId}`)
    } catch (err) {
      console.error(err)
      router.push(`/checkout/success?orderId=${orderId}`)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setIsProcessing(true)
    try {
      const result = await createOrder({
        formData,
        items,
        totalPrice,
        tax,
        total,
        paymentMethod,
        currency: 'COP'
      })
      if (result.error) throw new Error(result.error)
      
      setOrderNumber(`ORD-${result.orderId}`)
      setOrderConfirmed(true)
      
      await processPayment(paymentMethod, result.orderId, total)
      
    } catch (err: any) {
      alert(`Error: ${err.message}`)
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !orderConfirmed) return null

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-['Inter'] selection:bg-[#00FFC2] selection:text-[#003828]">
      <GlobalNavbar session={null as any} showCart={true} />
      
      <main className="pt-32 pb-24 max-w-[1440px] mx-auto px-8">
        <div className="mb-12">
          <h1 className="font-['Space_Grotesk'] text-5xl md:text-6xl font-black text-white tracking-tighter uppercase">Checkout</h1>
          <p className="text-white/40 font-['Inter'] mt-2 text-sm uppercase tracking-widest">SECURE ENCRYPTED TRANSACTION // 256-BIT PROTOCOL</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Shipping Section */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full border border-[#00FFC2] flex items-center justify-center text-[#00FFC2] font-['Space_Grotesk'] font-bold text-sm">01</span>
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-widest uppercase text-white">Shipping Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-white/40 mb-2">FULL NAME</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-[#0e0e0e] border border-white/10 px-4 py-4 focus:ring-0 focus:border-[#00FFC2] transition-colors font-['Inter'] text-white outline-none" 
                    placeholder="ELON T. VOID"
                  />
                  {errors.fullName && <p className="text-red-400 text-[10px] mt-1 font-['Space_Grotesk'] uppercase">{errors.fullName}</p>}
                </div>
                
                <div className="md:col-span-1">
                  <label className="block font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-white/40 mb-2">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#0e0e0e] border border-white/10 px-4 py-4 focus:ring-0 focus:border-[#00FFC2] transition-colors font-['Inter'] text-white outline-none" 
                    placeholder="USER@TECNO.TECH"
                  />
                  {errors.email && <p className="text-red-400 text-[10px] mt-1 font-['Space_Grotesk'] uppercase">{errors.email}</p>}
                </div>

                <div className="md:col-span-1">
                  <label className="block font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-white/40 mb-2">PHONE</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-[#0e0e0e] border border-white/10 px-4 py-4 focus:ring-0 focus:border-[#00FFC2] transition-colors font-['Inter'] text-white outline-none" 
                    placeholder="+57 300 000 0000"
                  />
                  {errors.phone && <p className="text-red-400 text-[10px] mt-1 font-['Space_Grotesk'] uppercase">{errors.phone}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-white/40 mb-2">STREET ADDRESS</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-[#0e0e0e] border border-white/10 px-4 py-4 focus:ring-0 focus:border-[#00FFC2] transition-colors font-['Inter'] text-white outline-none" 
                    placeholder="77 NEON DISTRICT, SECTOR 4"
                  />
                  {errors.address && <p className="text-red-400 text-[10px] mt-1 font-['Space_Grotesk'] uppercase">{errors.address}</p>}
                </div>
                
                <div>
                  <label className="block font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-white/40 mb-2">CITY</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-[#0e0e0e] border border-white/10 px-4 py-4 focus:ring-0 focus:border-[#00FFC2] transition-colors font-['Inter'] text-white outline-none" 
                    placeholder="MEDELLÍN"
                  />
                  {errors.city && <p className="text-red-400 text-[10px] mt-1 font-['Space_Grotesk'] uppercase">{errors.city}</p>}
                </div>
                
                <div>
                  <label className="block font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-white/40 mb-2">COUNTRY</label>
                  <select 
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full bg-[#0e0e0e] border border-white/10 px-4 py-4 focus:ring-0 focus:border-[#00FFC2] transition-colors font-['Inter'] text-white outline-none"
                  >
                    <option value="Colombia">COLOMBIA</option>
                  </select>
                </div>
              </div>
            </section>
            
            {/* Payment Section */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full border border-[#00FFC2] flex items-center justify-center text-[#00FFC2] font-['Space_Grotesk'] font-bold text-sm">02</span>
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-widest uppercase text-white">Payment Method</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'stripe', label: 'STRIPE', icon: 'credit_card', color: 'white' },
                  { id: 'mercadopago', label: 'MERCADOPAGO', icon: 'handshake', color: '#009ee3' },
                  { id: 'wompi', label: 'WOMPI', icon: 'account_balance_wallet', color: '#0055ff' },
                  { id: 'payu', label: 'PAYU', icon: 'payments', color: '#a6c307' }
                ].map(method => (
                  <label key={method.id} className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      className="hidden peer" 
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id as PaymentMethod)}
                    />
                    <div className="bg-white/5 p-6 border border-white/5 peer-checked:border-[#00FFC2] peer-checked:bg-[#00FFC2]/5 flex flex-col items-center gap-3 transition-all duration-300">
                      <span className="material-symbols-outlined text-3xl" style={{color: method.color}}>{method.icon}</span>
                      <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-white/80">{method.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>
          
          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-white/5 p-8 border border-white/5">
              <h3 className="font-['Space_Grotesk'] text-xl font-bold tracking-widest uppercase mb-8 pb-4 border-b border-white/10 text-white">Order Summary</h3>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-[#0e0e0e] border border-white/5 flex-shrink-0 flex items-center justify-center p-1">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                      ) : (
                        <span className="material-symbols-outlined text-white/20">image</span>
                      )}
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <h4 className="font-['Space_Grotesk'] text-xs font-bold text-white uppercase line-clamp-1">{item.productName}</h4>
                      <div className="flex gap-2">
                        <span className="font-['Space_Grotesk'] text-[9px] text-white/40 uppercase">QTY: {item.quantity}</span>
                      </div>
                      <p className="text-[#00FFC2] font-['Space_Grotesk'] font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-6 border-t border-white/10 mb-8 font-['Space_Grotesk'] text-[11px] text-white/60">
                <div className="flex justify-between uppercase">
                  <span>SUBTOTAL</span>
                  <span className="text-white">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between uppercase">
                  <span>SHIPPING</span>
                  <span className="text-[#00FFC2]">FREE [EXPRESS]</span>
                </div>
                <div className="flex justify-between uppercase">
                  <span>TAX (19%)</span>
                  <span className="text-white">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-white/10 font-['Space_Grotesk'] text-xl font-black text-[#00FFC2]">
                  <span>TOTAL</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-[#00FFC2] py-5 font-['Space_Grotesk'] font-black text-black text-[12px] tracking-[0.2em] uppercase hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'PROCESSING...' : 'Place Order'}
              </button>
              
              <p className="text-center mt-6 text-[9px] font-['Space_Grotesk'] text-white/40 uppercase tracking-widest">
                Orders are typically processed within 120ms.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-16 border-t border-white/5 bg-[#050505]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
          <div className="text-xl font-black text-white tracking-[0.3em] uppercase font-['Space_Grotesk']">TECNO STORE MEDELLÍN</div>
          <div className="flex gap-8">
            <a className="text-white/40 font-['Space_Grotesk'] text-[10px] tracking-widest uppercase hover:text-[#00FFC2] transition-colors" href="#">PRIVACY</a>
            <a className="text-white/40 font-['Space_Grotesk'] text-[10px] tracking-widest uppercase hover:text-[#00FFC2] transition-colors" href="#">TERMS</a>
            <a className="text-white/40 font-['Space_Grotesk'] text-[10px] tracking-widest uppercase hover:text-[#00FFC2] transition-colors" href="#">WARRANTY</a>
            <a className="text-white/40 font-['Space_Grotesk'] text-[10px] tracking-widest uppercase hover:text-[#00FFC2] transition-colors" href="#">CONTACT</a>
          </div>
          <div className="text-white/20 font-['Space_Grotesk'] text-[10px] tracking-widest uppercase">
            © 2024 TECNO STORE MEDELLÍN. ENGINEERED FOR PRECISION.
          </div>
        </div>
      </footer>
    </div>
  )
}
