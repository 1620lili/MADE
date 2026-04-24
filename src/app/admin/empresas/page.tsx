'use client';

import { useState, useEffect } from "react";
import CompaniesHeader from "@/components/company/CompaniesHeader";
import EditCompanyModal from "@/components/company/EditCompanyModal";
import { getCompanies, toggleCompanyStatus } from "@/features/company/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleToggleStatus = async (companyId: number, isActive: boolean) => {
    const message = isActive 
      ? "¿Deseas desactivar esta empresa? Dejará de aparecer en el Mall."
      : "¿Deseas activar esta empresa? Volverá a aparecer en el Mall.";
      
    if (!window.confirm(message)) return;

    try {
      await toggleCompanyStatus(companyId, isActive);
      // Actualizar lista local
      await fetchCompanies();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("No se pudo cambiar el estado de la empresa.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <CompaniesHeader />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.map((company) => (
          <div key={company.id} className="bg-surface-lowest border border-outline-variant/10 hover:border-secondary transition-all group relative overflow-hidden flex flex-col min-h-[400px] shadow-sm">
            {/* Banner Background */}
            <div className="h-32 w-full overflow-hidden relative">
               <img 
                 src={company.bannerUrl || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop"} 
                 alt="Banner" 
                 className="w-full h-full object-cover grayscale-[30%] group-hover:scale-110 transition-transform duration-700" 
               />
               <div className="absolute inset-0 bg-on-surface/20" />
            </div>

            <div className="p-8 pt-0 -mt-8 relative z-10 flex-1 flex flex-col">
               <div className="w-16 h-16 bg-surface-lowest border border-outline-variant/20 flex items-center justify-center overflow-hidden mb-6 shadow-md shadow-on-surface/5">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-outline-variant text-2xl">store</span>
                  )}
               </div>

               <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                     <h3 className="font-headline text-2xl tracking-tight group-hover:text-secondary transition-colors line-clamp-1">{company.name}</h3>
                     <span className={`text-[0.55rem] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-sm ${company.isActive ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                        {company.isActive ? 'Activa' : 'Inactiva'}
                     </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-on-surface-variant">
                     <div className="flex items-center space-x-2">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span className="text-[10px] font-label uppercase tracking-widest">{company.city}, {company.country}</span>
                     </div>
                     <span className="text-outline-variant/30">|</span>
                     <span className="text-[10px] font-label uppercase tracking-widest">ID: #{company.id.toString().padStart(3, '0')}</span>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-outline-variant/10 flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center -space-x-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border-2 border-surface-lowest">
                            <span className="material-symbols-outlined text-xs opacity-40">person</span>
                         </div>
                       ))}
                       <div className="w-8 h-8 rounded-full bg-secondary text-surface flex items-center justify-center border-2 border-surface-lowest text-[8px] font-black">
                          +5
                       </div>
                    </div>
                    
                    <Link href={`/admin/empresas/${company.id}`} className="flex items-center space-x-2 text-secondary hover:translate-x-1 transition-transform">
                      <span className="text-[10px] font-label uppercase tracking-[0.2em] font-bold">Gestionar</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => { setSelectedCompany(company); setIsEditModalOpen(true); }}
                      className="flex items-center space-x-1 text-on-surface-variant hover:text-secondary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span className="text-[10px] font-label uppercase tracking-[0.2em]">Editar</span>
                    </button>

                    <button
                      onClick={() => handleToggleStatus(company.id, company.isActive)}
                      className={`flex items-center space-x-1 transition-colors ${company.isActive ? 'text-error hover:text-error/70' : 'text-secondary hover:text-secondary/70'}`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {company.isActive ? 'visibility_off' : 'visibility'}
                      </span>
                      <span className="text-[10px] font-label uppercase tracking-[0.2em]">
                        {company.isActive ? 'Desactivar' : 'Activar'}
                      </span>
                    </button>
                  </div>
               </div>
            </div>
          </div>
        ))}

        {(!isLoading && companies.length === 0) && (
          <div className="col-span-full bg-surface-lowest border border-dashed border-outline-variant/30 p-20 text-center space-y-4">
             <span className="material-symbols-outlined text-4xl text-outline-variant opacity-50">search_off</span>
             <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">No se encontraron empresas registradas.</p>
          </div>
        )}
      </section>

      {selectedCompany && (
        <EditCompanyModal 
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCompany(null);
            fetchCompanies();
          }}
          company={selectedCompany}
        />
      )}
    </div>
  );
}
