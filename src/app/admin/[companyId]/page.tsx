import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'LUXE ATELIER | Operations Overview' };

export default async function AdminCompanyOverview({ params }: { params: Promise<{ companyId: string }> }) {
  const supabase = await createClient();
  
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) redirect('/auth');

  const resolvedParams = await params;
  const companyIdNum = parseInt(resolvedParams.companyId, 10);

  // Fetch company details
  const { data: company, error: companyError } = await supabase
    .from('Company')
    .select('*')
    .eq('id', companyIdNum)
    .single();

  if (companyError || !company) {
    console.error("Company Fetch Error:", companyError);
    redirect('/dashboard');
  }

  // Fetch counts
  const { count: userCount } = await supabase
    .from('CompanyUser')
    .select('*', { count: 'exact', head: true })
    .eq('companyId', companyIdNum);

  const { count: productCount } = await supabase
    .from('Product')
    .select('*', { count: 'exact', head: true })
    .eq('companyId', companyIdNum);

  const { count: orderCount } = await supabase
    .from('Order')
    .select('*', { count: 'exact', head: true })
    .eq('companyId', companyIdNum);

  const counts = {
    users: userCount || 0,
    products: productCount || 0,
    orders: orderCount || 0
  };

  return (
    <>
      {/* Section Header */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-end mb-16 gap-6">
        <div className="space-y-4">
          <p className="text-[10px] tracking-[0.3em] uppercase text-secondary font-label">Global Directory</p>
          <h2 className="text-4xl md:text-5xl font-headline text-on-surface leading-tight">Operations &amp; <br/> Boutiques Overview</h2>
        </div>
        <button className="bg-on-surface text-surface px-8 py-4 text-[10px] tracking-widest uppercase font-label font-bold flex items-center justify-center gap-3 hover:bg-secondary transition-all w-full xl:w-auto">
          <span className="material-symbols-outlined text-sm">add</span>
          Register Subsidiary
        </button>
      </div>

      {/* Bento-Inspired Boutique Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Boutique Card: The actual registered company */}
        <div className="group">
          <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden mb-6 shadow-sm group-hover:shadow-[0px_20px_40px_rgba(47,51,49,0.08)] transition-all duration-500">
            <img className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" alt="Boutique Exterior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmd3MWl4iC332kNnft5vG8RfdNz6c7bTEy6dp9eSyx5Ttmt1eQ21geNW-gPKgYHyLfWbeZvcZz51_zORUBcDVHt830vkkqmG-X6rxdn1GvD1Uum3OY8cO6IEVVLyBfsBOJJpQeKpIEiFzF1eOCyHO6u--HjWkIHS-QdaQNHZKmqmM9zWCZP9uRYfDDB3aqpXFBxaVnswI2pEqzmTFQx_ULIY05H06X68xrlSI7uyKsvQZXTbYIUxcUu0mPwfZqeptVoIaIEGlGvRI" />
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-background/90 backdrop-blur px-3 py-1">
              <span className={`w-1.5 h-1.5 rounded-full ${company.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-on-surface font-label">{company.isActive ? 'Active' : 'Closed'}</span>
            </div>
            <div className="absolute bottom-6 right-6">
              <div className="w-16 h-16 bg-surface flex items-center justify-center p-3 shadow-md">
                <span className="text-xs font-headline italic text-on-surface truncate px-1">{company.name.substring(0,4).toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-headline text-on-surface mb-1">{company.name}</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-4 font-label">{company.country} - {company.city}</p>
              <div className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-outline font-label">
                <span>Rep: {company.legalRepresentative}</span>
                <span>Orders: {counts.orders} / Month</span>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-secondary transition-colors duration-300">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>

        {/* Mock Boutique Card 2 (To match HTML design aesthetic) */}
        <div className="group hidden md:block">
          <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden mb-6 shadow-sm group-hover:shadow-[0px_20px_40px_rgba(47,51,49,0.08)] transition-all duration-500">
            <img className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" alt="Boutique 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC36LGsrDTkXrqsaVmhIX_9AkpNz2OhWHAlsOzyn9Qn63T0yIkz9cADCJnnj9Y_Gaj75EWBXkn2cTqcT-eF3f_9lDp4ywIlvkCPnY-oUgD-xId3SPW4X2YaHfkdF0MkZcfX__rN1tQqmSv8QAnf7zivo5qQgh1A5YyZWQb0PjyxSdADutpDCNEyGp5AH3sxePvZVtqYVt6gRlmBZA-efu-DEoiEzjgvyUQmsPXEHQ9MKVUwwZro8t2wtOLezh8WGrQnXLV5cUenecY" />
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-background/90 backdrop-blur px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-on-surface font-label">Maintenance</span>
            </div>
          </div>
          <div className="flex justify-between items-start opacity-70">
            <div>
              <h3 className="text-2xl font-headline text-on-surface mb-1">Aurum Atelier</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-4 font-label">Fine Jewelry</p>
              <div className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-outline font-label">
                <span>Rep: Julian Sterling</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Boutique Card 3 */}
        <div className="group hidden lg:block">
          <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden mb-6 shadow-sm group-hover:shadow-[0px_20px_40px_rgba(47,51,49,0.08)] transition-all duration-500">
            <img className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" alt="Boutique 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrb5kvVms7hCWyIxvSV4kkBF12P5t_GzudGcqMCU26YaKyxm4C4OvqKCGs9CuQb6-2b4tBc3JyqAjB1EfBaxbXyXQu1X7F2CpqyNYOVqATsNUYJPplA5l1zTh92azhwesCDNBUbzVx8G-gCRNeos9uIvu8lfpTgpRWHBZV9bH7hCpLOesgN--ejuJIKu9kQFzWJm89_tVcQ7_UvuisezZbU0fjuU0B7YwNIlMS7tVnYMnOMvX7YV3g4dO06UrUmdwD0OWNvLwd_DU" />
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-background/90 backdrop-blur px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-on-surface font-label">Closed</span>
            </div>
          </div>
          <div className="flex justify-between items-start opacity-70">
            <div>
              <h3 className="text-2xl font-headline text-on-surface mb-1">Noir Concept</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-4 font-label">Prêt-à-porter</p>
              <div className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-outline font-label">
                <span>Rep: Marcus Thorne</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* List View Summary */}
      <section className="mt-24">
        <div className="mb-10 border-b border-outline-variant/20 pb-4">
          <h3 className="text-xl font-headline text-on-surface">Operations Summary</h3>
        </div>
        
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-2 text-[10px] tracking-[0.2em] uppercase font-bold text-outline font-label hidden md:grid">
            <div className="col-span-12 md:col-span-4">Establishment</div>
            <div className="col-span-3 text-center">Category</div>
            <div className="col-span-2 text-center">Performance</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1"></div>
          </div>
          
          {/* Row 1 - Current DB Company mapping */}
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 md:gap-0 px-6 py-6 bg-surface-container-low hover:bg-surface-container transition-colors duration-300 shadow-sm border border-transparent hover:border-outline-variant/10">
            <div className="col-span-12 md:col-span-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-variant flex-shrink-0">
                <img className="w-full h-full object-cover" alt="Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwYecv6a79Cq8aWrtWB0UIkImdQ6Wh_iH5JT-XO9_ox6ozNT-7X19Z_KUyQUI3SpoZqxC6B7Ka-d3v2-sm2aDURKFb7G78JlMablPrS48VWtuEg_wYToUThB_KVTaiShnElrX56gnHtLZpm6muET99aRdlqz73JOoP5Rj0Gk66iuuW9cZltKU1T0AzYcQ7l-xOzL3xzuZngXqJVraWNdpOtEkgKmoTUGTNqU1mSH37iGL_oz20kca94qIKK5CcekPgTYrETPnBTKw" />
              </div>
              <div>
                <h4 className="font-headline text-on-surface text-base md:text-lg">{company.name}</h4>
                <p className="text-[10px] font-label uppercase tracking-widest text-outline">{company.legalId}</p>
              </div>
            </div>
            <div className="hidden md:block col-span-3 text-center">
              <span className="px-4 py-1.5 border border-outline-variant/30 text-[9px] font-label uppercase tracking-[0.2em] bg-background">General Operations</span>
            </div>
            <div className="hidden md:block col-span-2 text-center">
              <span className="text-sm font-semibold text-on-surface">{counts.products} <span className="text-[10px] font-label text-outline font-normal tracking-widest">SKUS</span></span>
            </div>
            <div className="hidden md:flex col-span-2 justify-center">
              <div className="flex items-center gap-2 bg-surface px-3 py-1 border border-outline-variant/20">
                <span className={`w-1.5 h-1.5 rounded-full ${company.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                <span className="text-[9px] font-label uppercase tracking-widest font-bold">Active</span>
              </div>
            </div>
            <div className="hidden md:block col-span-1 text-right">
              <button className="material-symbols-outlined text-outline hover:text-secondary transition-colors">chevron_right</button>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
}

