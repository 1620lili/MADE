import { getServiceSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { verifySession } from "@/features/auth/session";
import GlobalNavbar from "@/components/common/GlobalNavbar";
import ProductGrid from '@/components/store/ProductGrid';
import CartDrawer from '@/components/store/CartDrawer';

import { CartRecommendations } from "@/components/store/CartRecommendations";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StorePage({ params }: Props) {
  const { id } = await params;
  const session = await verifySession();
  const adminSupabase = getServiceSupabase();

  // Load company data
  const { data: company } = await adminSupabase
    .from('Company')
    .select('*')
    .eq('id', id)
    .eq('isActive', true)
    .single();

  if (!company) {
    notFound();
  }

  // Load products with variants and images
  const { data: products } = await adminSupabase
    .from('Product')
    .select(`
      *,
      ProductVariant (id, price, stock, color, size, imageUrl, sku),
      ProductImage (url, isMain)
    `)
    .eq('companyId', company.id)
    .eq('isActive', true)
    .order('createdAt', { ascending: false });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] font-['Inter'] flex flex-col selection:bg-[#00FFC2] selection:text-[#003828]">
      <GlobalNavbar 
        session={session}
        transparent={true}
        showSearch={true}
        showCart={true}
      />

      {/* Hero Section - Epic Style */}
      <header className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
          <div className="absolute top-1/4 -right-1/4 w-[1000px] h-[1000px] bg-[#00ffc2]/10 rounded-full blur-[180px]"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-[#00ffc2]/5 rounded-full blur-[150px]"></div>
        </div>
        
        <img 
          src={company.bannerUrl || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop'} 
          alt={company.name} 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10" />
        
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-20 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center pt-20">
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="font-['Space_Grotesk'] text-[12px] md:text-[14px] font-bold uppercase tracking-[0.6em] text-[#00FFC2] block">
                OFFICIAL BOUTIQUE SERIES
              </span>
              <h1 className="font-['Space_Grotesk'] text-6xl md:text-[100px] font-bold text-white leading-[0.9] tracking-tighter uppercase">
                {company.name.split(' ')[0]}<br/>
                <span className="text-[#00FFC2] drop-shadow-[0_0_20px_rgba(0,255,194,0.4)]">
                  {company.name.split(' ').slice(1).join(' ') || 'EST. 2024'}
                </span>
              </h1>
            </div>
            
            <p className="font-['Inter'] text-white/60 text-lg md:text-xl max-w-md leading-relaxed">
              Descubre la exclusividad en {company.city}. Una selección curada de piezas únicas diseñadas para los gustos más exigentes.
            </p>

            <div className="flex items-center gap-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FFC2] animate-pulse shadow-[0_0_12px_#00FFC2]" />
              <span className="font-['Space_Grotesk'] text-[12px] text-[#00FFC2] uppercase tracking-[0.3em] font-bold">
                Status: Verified & Active
              </span>
            </div>
          </div>

          <div className="hidden md:flex justify-end">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#00FFC2]/10 rounded-full blur-[100px] group-hover:bg-[#00FFC2]/20 transition-all duration-700"></div>
              <div className="relative w-[320px] h-[320px] bg-black/60 backdrop-blur-3xl border border-[#00FFC2]/20 p-8 flex items-center justify-center rounded-sm shadow-[0_0_50px_rgba(0,255,194,0.1)] overflow-hidden">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                ) : (
                  <span className="material-symbols-outlined text-[100px] text-[#00FFC2]/30">store</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Info Section - Technical Bar */}
      <section className="bg-[#0e0e0e] border-y border-white/5 py-12 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-between items-center gap-8">
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
              {company.email && (
                <div className="flex items-center gap-3 text-white/40 hover:text-[#00FFC2] transition-colors group cursor-default">
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">mail</span>
                  <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-widest font-bold">{company.email}</span>
                </div>
              )}
              {company.phone && (
                <div className="flex items-center gap-3 text-white/40 hover:text-[#00FFC2] transition-colors group cursor-default">
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">phone</span>
                  <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-widest font-bold">{company.phone}</span>
                </div>
              )}
              {company.address && (
                <div className="flex items-center gap-3 text-white/40 hover:text-[#00FFC2] transition-colors group cursor-default">
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">location_on</span>
                  <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-widest font-bold">{company.address}</span>
                </div>
              )}
            </div>
            <div className="font-['Space_Grotesk'] text-[11px] text-white/20 uppercase tracking-[0.4em] font-bold">
              {company.city} // {company.country}
            </div>
          </div>
        </div>
      </section>

      {/* Products Catalog - Grid Style */}
      <main className="flex-1 max-w-[1440px] mx-auto px-6 md:px-12 py-32 w-full relative z-10">
        <div className="flex justify-between items-end mb-24">
          <div className="space-y-4">
            <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-[0.5em] text-[#00FFC2]">WORLD CLASS GEAR</span>
            <h2 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">BEST SELLERS</h2>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="w-12 h-12 flex items-center justify-center border border-white/10 hover:border-[#00FFC2] hover:text-[#00FFC2] transition-colors"><span className="material-symbols-outlined" style={{fontSize:'20px'}}>chevron_left</span></button>
            <button className="w-12 h-12 flex items-center justify-center border border-white/10 hover:border-[#00FFC2] hover:text-[#00FFC2] transition-colors"><span className="material-symbols-outlined" style={{fontSize:'20px'}}>chevron_right</span></button>
          </div>
        </div>
        <ProductGrid products={products || []} company={company} />
      </main>

      {/* Footer - Tech Style */}
      <footer className="bg-[#050505] border-t border-white/5 py-32 mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16 mb-24">
            <img src="/image/made-logo.jpeg" alt="MADE" className="h-10 w-auto invert opacity-40 hover:opacity-100 transition-opacity" />
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
              {['Warranty', 'Drivers', 'Support', 'Privacy', 'Terms'].map((item) => (
                <a key={item} href="#" className="font-['Space_Grotesk'] text-[11px] uppercase tracking-[0.3em] text-white/30 hover:text-[#00FFC2] transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
            <div className="font-['Space_Grotesk'] text-[11px] text-white/20 uppercase tracking-[0.5em]">
              © 2024 MADE TECHNOLOGY. ENGINEERED FOR PRECISION.
            </div>
            <div className="flex gap-6">
              <div className="w-10 h-[1px] bg-[#00FFC2]/20" />
              <div className="font-['Space_Grotesk'] text-[11px] text-[#00FFC2]/40 uppercase tracking-[0.2em]">LUXE ATELIER & MALL</div>
            </div>
          </div>
        </div>
      </footer>
      <CartDrawer />
    </div>
  );
}
