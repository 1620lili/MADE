'use client';

import { useState } from "react";
import RegisterCompanyModal from "./RegisterCompanyModal";
import { useRouter } from "next/navigation";

export default function CompaniesHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/20 pb-10">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">store</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Gestión de Socios</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Boutiques & Empresas</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Directorio global de boutiques asociadas. Control de estado y configuración de marca.
           </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-on-surface text-surface px-8 py-4 text-[10px] tracking-widest uppercase font-label font-bold hover:bg-secondary transition-all flex items-center space-x-3 group"
          id="open_register_modal_btn"
        >
          <span className="material-symbols-outlined text-sm group-hover:rotate-90 transition-transform">add_business</span>
          <span>Registrar Nueva Empresa</span>
        </button>
      </header>

      <RegisterCompanyModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          router.refresh(); // Refresh the server component data
        }} 
      />
    </>
  );
}
