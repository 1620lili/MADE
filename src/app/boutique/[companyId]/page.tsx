import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ companyId: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  
  const { data: company } = await supabase
    .from('Company')
    .select('name')
    .eq('id', parseInt(resolvedParams.companyId, 10))
    .single();

  return { title: company ? `${company.name} | LUXE ATELIER` : 'Storefront Not Found' };
}

export default async function BoutiqueStorefrontPage({ params }: { params: Promise<{ companyId: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const companyIdNum = parseInt(resolvedParams.companyId, 10);
  if (isNaN(companyIdNum)) notFound();

  // Fetch Company and Products via Supabase
  const { data: company, error } = await supabase
    .from('Company')
    .select(`
      *,
      Product (
        *,
        ProductVariant (*)
      )
    `)
    .eq('id', companyIdNum)
    .single();

  if (error || !company) {
    console.error("Boutique Fetch Error:", error);
    notFound();
  }

  // Cast Product to any to handle joined data structure easily for compatibility
  const products = (company as any).Product || [];
  const displayProducts = products.filter((p: any) => p.isActive && p.ProductVariant && p.ProductVariant.length > 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="font-body selection:bg-secondary-fixed bg-background text-on-surface min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-12 py-8">
        <Link href="/" className="flex items-center gap-4">
           <img src="/image/made-logo.jpeg" alt="MADE" className="h-10 w-auto" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </Link>
        <div className="hidden md:flex gap-12 font-headline tracking-[0.15em] uppercase text-sm">
          <span className="text-on-surface border-b-2 border-on-surface pb-1">{company.name}</span>
          <Link href={`#collection`} className="text-on-surface-variant hover:text-on-surface transition-opacity duration-300 ease-out">Collections</Link>
        </div>
        <div className="flex items-center gap-8">
          <button className="text-on-surface hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
          </button>
          <Link href="/dashboard" className="text-on-surface hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </Link>
        </div>
      </nav>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative h-[921px] w-full px-12 pb-16 overflow-hidden">
          <div className="relative h-full w-full group">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKeJ69LXOBmSgRVG0LqylqZfnq7QMTPqvIOtRyYUnhh3jMGWQuMZApKzrDbeXEVldKTtfLKhDvMYRh-gt3qDYtQzHSCG_cxYlmNEs2w1yHqvxC3BUCfprO_pKMMWmt9Do8mGBo2EtThf1x1m8j0HbMD2A6sTTrMG_K9UldBD5YSnCKu1KnOypWcormDag5zUJN2V4B8SmE_z1nbO3LSFyuv0-XA1L0knUVKwXBDSyHxtV5Jf2LUkp8RDYeEzVV0JyHFmcox5rUpDA" alt="Storefront Banner"/>
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-12 max-w-2xl">
              <span className="font-label text-xs tracking-[0.4em] text-white uppercase mb-4 block">Store Profile</span>
              <h1 className="font-headline text-6xl md:text-8xl text-white font-light tracking-tight leading-none mb-6">{company.name}</h1>
              <p className="font-body text-white/80 text-lg max-w-md">{company.description || "A sculptural sanctuary of avant-garde design and silent luxury within the LUXE ATELIER collective."}</p>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="px-12 py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface font-light leading-tight mb-8">Minimalist. Sculptural. Avant-garde.</h2>
            <div className="space-y-6 text-on-surface-variant leading-relaxed">
              <p>{company.name} is a manifestation of pure form. We believe that true luxury exists in the space between the material and the metaphysical. Our curated selection focuses on pieces that defy temporary trends in favor of architectural permanence.</p>
              <p>Each object in our collection is selected for its ability to transform the wearer's environment through silhouette and texture alone.</p>
            </div>
          </div>
          <div className="lg:col-span-7 relative h-[600px]">
            <div className="absolute top-0 right-0 w-4/5 h-4/5 z-10 shadow-[0px_20px_40px_rgba(47,51,49,0.06)]">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5xGQBFY6Xy-ylTMxI6rx-hMAwU_WVRVdntrxR0TObjyiDJwfk_A4zzxMoavYYRIhw-Z3elm-VHX7fh9GNObtvZ6aJrYjK0ncpYT4qopkZF_Hcp74gqC401Mv9gxD6yYscYCR3YW4LpeGT61r8jv4etWRN2v4kabNIVRIEvqXVaEsnn-yPJ3lqetqo2BwJOaweSuVau6WsrTJ3LgrDaIMuRJTjsCyQOTTcsrEyTzvZULuSfiQcPbX60i6hsP5199Xn3VLjiA0pJoQ" alt="Philosophy Image"/>
            </div>
            <div className="absolute bottom-0 left-0 w-3/5 h-3/5 bg-surface-container-low p-8 flex items-end">
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">Permanent Collection No. 04 / Alabaster &amp; Onyx</p>
            </div>
          </div>
        </section>

        {/* Product Exploration */}
        <section id="collection" className="px-12 py-24 bg-surface-container-low">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h3 className="font-headline text-3xl font-light mb-2">Curated Pieces</h3>
              <p className="font-label text-xs uppercase tracking-widest text-outline">The Current Narrative</p>
            </div>
            <div className="flex flex-wrap gap-8 items-center font-label text-xs uppercase tracking-[0.2em]">
              <div className="flex gap-6 border-r border-outline/20 pr-8">
                <button className="text-on-surface border-b border-on-surface">All</button>
                <button className="text-outline hover:text-on-surface transition-colors">Apparel</button>
                <button className="text-outline hover:text-on-surface transition-colors">Accessories</button>
              </div>
            </div>
          </div>

          {displayProducts.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-lowest font-label text-xs uppercase tracking-widest text-outline border border-outline-variant/15">
                  The curated collection is currently sequestered. Please return later.
              </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {displayProducts.map((product: any) => {
                  const headVariant = product.ProductVariant[0];
                  return (
                    <Link href={`/boutique/${companyIdNum}/product/${product.id}`} key={product.id} className="group cursor-pointer block">
                      <div className="aspect-[3/4] overflow-hidden mb-6 bg-surface-container-highest">
                        {headVariant.imageUrl ? (
                           <img src={headVariant.imageUrl} alt={product.name} className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                           <div className="w-full h-full bg-surface-container flex items-center justify-center text-outline">
                               <span className="material-symbols-outlined text-4xl">inventory_2</span>
                           </div>
                        )}
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-headline text-xl font-light mb-1">{product.name}</h4>
                          <p className="font-label text-[10px] uppercase tracking-widest text-outline">{product.brand || 'Apparel'}</p>
                        </div>
                        <span className="font-body text-sm text-on-surface-variant">{formatCurrency(headVariant.price)}</span>
                      </div>
                      <div className="mt-6 inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-on-surface transition-colors">
                            View Piece <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </div>
                    </Link>
                  );
              })}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="py-40 px-12 text-center bg-surface-container-lowest">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline text-5xl md:text-7xl font-light tracking-tight mb-12">Experience the Atelier in person.</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center font-label tracking-[0.2em] uppercase text-xs">
              <button className="bg-primary text-on-primary px-12 py-5 hover:bg-secondary transition-colors duration-300">Schedule Private View</button>
              <button className="border border-outline/30 px-12 py-5 hover:border-on-surface transition-colors duration-300">View Map</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-12 pt-24 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 border-t border-outline-variant/10 bg-surface">
        <div className="flex flex-col gap-6">
          <div className="font-headline text-lg tracking-[0.2em] text-on-surface uppercase flex items-center gap-3">
            <img src="/image/made-logo.jpeg" className="h-8 w-auto" alt="MADE" />
          </div>
          <p className="font-body text-sm text-on-surface-variant">A market for makers. The premier destination for curated creations.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="font-label text-xs uppercase tracking-widest font-bold text-on-surface">Quick Links</h5>
          <div className="flex flex-col gap-2 font-label text-sm uppercase">
            <a className="text-on-surface-variant hover:text-on-surface transition-all underline-offset-8" href="#">Privacy</a>
            <a className="text-on-surface-variant hover:text-on-surface transition-all underline-offset-8" href="#">Terms</a>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="font-label text-xs uppercase tracking-widest font-bold text-on-surface">Location</h5>
          <p className="font-body text-sm text-on-surface-variant italic">Level 2, East Wing<br/>The Luxe Mall, New York</p>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-on-surface-variant">public</span>
            <span className="material-symbols-outlined text-on-surface-variant">mail</span>
            <span className="material-symbols-outlined text-on-surface-variant">call</span>
          </div>
          <div className="font-label text-[10px] tracking-[0.1em] text-on-surface-variant mt-8 md:mt-0 uppercase">
              © 2024 LUXE ATELIER.
          </div>
        </div>
      </footer>
    </div>
  );
}

