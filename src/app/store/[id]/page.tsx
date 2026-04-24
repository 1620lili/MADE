import { getServiceSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StorePage({ params }: Props) {
  const { id } = await params;
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
    <div className="min-h-screen bg-surface-lowest flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-lowest/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/image/made-logo.jpeg" alt="MADE" className="h-10 w-auto" />
            <span className="font-headline text-xl tracking-tight">MADE</span>
          </Link>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver al Mall
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full h-[60vh] mt-20 overflow-hidden">
        <img 
          src={company.bannerUrl || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop'} 
          alt={company.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6">
          <div className="w-24 h-24 bg-surface-lowest border border-outline-variant/20 mb-6 shadow-2xl flex items-center justify-center overflow-hidden">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-outline-variant">store</span>
            )}
          </div>
          <h1 className="font-headline text-5xl md:text-7xl text-surface tracking-tighter mb-4 text-center">
            {company.name}
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-label text-[10px] md:text-xs text-surface/80 uppercase tracking-[0.4em]">
              {company.city}, {company.country}
            </span>
            <span className="h-4 w-[1px] bg-surface/20" />
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-label text-[10px] text-secondary uppercase tracking-widest font-bold">Boutique Activa</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Info Section */}
      <section className="bg-surface-low border-b border-outline-variant/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-10">
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-6">
            {company.email && (
              <div className="flex items-center gap-3 text-on-surface-variant hover:text-secondary transition-colors group cursor-default">
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">mail</span>
                <span className="font-body text-xs">{company.email}</span>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center gap-3 text-on-surface-variant hover:text-secondary transition-colors group cursor-default">
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">phone</span>
                <span className="font-body text-xs">{company.phone}</span>
              </div>
            )}
            {company.address && (
              <div className="flex items-center gap-3 text-on-surface-variant hover:text-secondary transition-colors group cursor-default">
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">location_on</span>
                <span className="font-body text-xs">{company.address}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Catalog */}
      <main className="flex-1 max-w-[1600px] mx-auto px-6 md:px-12 py-24 w-full">
        <div className="flex flex-col items-center mb-16 space-y-4">
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-secondary text-center">Colección Curada</span>
          <h2 className="font-headline text-4xl tracking-tighter text-on-surface text-center italic">En el Atelier</h2>
          <div className="w-12 h-[1px] bg-outline-variant/30 mt-4" />
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {products.map((product: any) => {
              const mainImage = product.ProductImage?.find((img: any) => img.isMain)?.url 
                || product.ProductVariant?.[0]?.imageUrl 
                || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop';
              
              const minPrice = Math.min(...product.ProductVariant.map((v: any) => v.price));
              const totalStock = product.ProductVariant.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
              
              const colors = [...new Set(product.ProductVariant.map((v: any) => v.color).filter(Boolean))];
              const sizes = [...new Set(product.ProductVariant.map((v: any) => v.size).filter(Boolean))];

              return (
                <div key={product.id} className="group flex flex-col gap-6 cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface-low group-hover:shadow-2xl group-hover:shadow-secondary/5 transition-all duration-700">
                    <img 
                      src={mainImage} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    
                    {/* Hover Overlay: Variants */}
                    <div className="absolute inset-0 bg-on-surface/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-8 gap-6 backdrop-blur-sm">
                      {colors.length > 0 && (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[8px] font-label uppercase tracking-widest text-surface/60">Colores</span>
                          <div className="flex gap-2">
                            {colors.map((color: any) => (
                              <div 
                                key={color} 
                                className="w-3 h-3 rounded-full border border-surface/20" 
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {sizes.length > 0 && (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[8px] font-label uppercase tracking-widest text-surface/60">Tallas</span>
                          <div className="flex gap-2 flex-wrap justify-center">
                            {sizes.map((size: any) => (
                              <span key={size} className="text-[10px] font-label text-surface px-2 py-1 border border-surface/20">{size}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <button className="mt-4 bg-surface text-on-surface px-6 py-2 text-[8px] font-label uppercase tracking-[0.2em] hover:bg-secondary hover:text-surface transition-all">
                        Ver Detalles
                      </button>
                    </div>

                    {totalStock <= 0 && (
                      <div className="absolute top-4 left-4 bg-error text-surface px-3 py-1 text-[8px] font-label uppercase tracking-widest">
                        Agotado
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center px-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[8px] font-label uppercase tracking-[0.3em] text-secondary">{product.brand || company.name}</span>
                      <h3 className="font-headline text-xl text-on-surface group-hover:text-secondary transition-colors">{product.name}</h3>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-body text-sm font-medium text-on-surface">{formatPrice(minPrice)}</span>
                      <span className="h-3 w-[1px] bg-outline-variant/30" />
                      <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                        {totalStock} en stock
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center space-y-6 opacity-30">
            <span className="material-symbols-outlined text-6xl">grid_view</span>
            <p className="font-label text-xs uppercase tracking-[0.4em] text-center max-w-xs leading-loose">
              Esta boutique está preparando su colección
            </p>
          </div>
        )}
      </main>

      {/* Footer minimalista */}
      <footer className="bg-on-surface text-surface py-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col items-center space-y-8">
          <img src="/image/made-logo.jpeg" alt="MADE" className="h-12 w-auto invert" />
          <p className="font-label text-[10px] uppercase tracking-[0.5em] opacity-40">Luxe Atelier & Mall</p>
        </div>
      </footer>
    </div>
  );
}
