'use client';

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface UserFiltersProps {
  companies: { id: number; name: string }[];
  companyId?: string;
  isActive?: string;
}

export default function UserFilters({ companies, companyId, isActive }: UserFiltersProps) {
  const router = useRouter();

  const handleCompanyChange = (id: string) => {
    const params = new URLSearchParams();
    if (id) params.set('companyId', id);
    if (isActive) params.set('isActive', isActive);
    router.push(`/admin/usuarios?${params.toString()}`);
  };

  return (
    <nav className="flex flex-wrap gap-8 items-center bg-surface-low border border-outline-variant/10 p-6">
      <div className="flex flex-col space-y-2">
        <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant ml-1">Boutique</span>
        <select 
          className="bg-transparent border-b border-outline-variant text-[10px] uppercase tracking-widest py-2 focus:ring-0 outline-none cursor-pointer"
          onChange={(e) => handleCompanyChange(e.target.value)}
          defaultValue={companyId || ""}
        >
          <option value="">Todas las Empresas</option>
          {companies.map(c => <option key={c.id} value={c.id.toString()}>{c.name}</option>)}
        </select>
      </div>
      
      <div className="flex flex-col space-y-2">
        <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant ml-1">Estado</span>
        <div className="flex space-x-4">
          <Link 
            href="/admin/usuarios" 
            className={`text-[10px] uppercase tracking-widest ${!isActive ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}
          >
            Todos
          </Link>
          <Link 
            href={`/admin/usuarios?isActive=true${companyId ? `&companyId=${companyId}` : ''}`} 
            className={`text-[10px] uppercase tracking-widest ${isActive === 'true' ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}
          >
            Activos
          </Link>
          <Link 
            href={`/admin/usuarios?isActive=false${companyId ? `&companyId=${companyId}` : ''}`} 
            className={`text-[10px] uppercase tracking-widest ${isActive === 'false' ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}
          >
            Inactivos
          </Link>
        </div>
      </div>
    </nav>
  );
}
