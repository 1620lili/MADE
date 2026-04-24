'use client';

import { useActionState, useState, useEffect } from 'react';
import { createUser } from '@/features/users/actions';

interface RoleWithPermissions {
  id: number;
  name: string;
  RolePermission: {
    Permission: {
      name: string;
    }
  }[];
}

interface CreateUserFormProps {
  companies: { id: number; name: string }[];
  roles: RoleWithPermissions[];
  initialCompanyId?: number;
  isSuper?: boolean;
}

export default function CreateUserForm({ 
  companies, 
  roles, 
  initialCompanyId, 
  isSuper 
}: CreateUserFormProps) {
  const [state, formAction, pending] = useActionState(createUser, { error: '' });
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const selectedRole = roles.find(r => r.id === selectedRoleId);
  const permissions = selectedRole?.RolePermission?.map(rp => rp.Permission.name) || [];

  return (
    <div className="max-w-4xl mx-auto">
      <form action={formAction} className="space-y-16">
        <input type="hidden" name="companyId" value={initialCompanyId || ''} />

        {/* ERRORES */}
        {state?.error && (
          <div className="bg-error/5 border border-error/20 p-6 flex items-center space-x-4 animate-in fade-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="text-error font-label text-[10px] uppercase tracking-widest">{state.error}</p>
          </div>
        )}

        {/* SECCIÓN 1: DATOS PERSONALES */}
        <section className="space-y-10">
          <header className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-surface-container-low border border-outline-variant/10 flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-secondary">person</span>
            </div>
            <div>
              <h3 className="font-headline text-3xl tracking-tight">Identidad del Colaborador</h3>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">Credenciales de acceso y contacto</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="md:col-span-2">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Nombre Completo</label>
              <input 
                name="fullName" 
                type="text" 
                required 
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-lg font-headline italic placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all" 
                placeholder="Ej. Julian de l'Atelier" 
              />
            </div>

            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Correo Electrónico</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-sm font-label placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all" 
                placeholder="colleague@made-shop.com" 
              />
            </div>

            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Contraseña Provisional</label>
              <input 
                name="password" 
                type="text" 
                required 
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-sm font-mono placeholder:text-outline-variant/30 focus:border-secondary focus:ring-0 outline-none transition-all" 
                placeholder="Clave de 8+ caracteres" 
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: ASIGNACIÓN A EMPRESA (Sólo Super Admin) */}
        {isSuper && (
          <section className="space-y-10">
            <header className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-surface-container-low border border-outline-variant/10 flex items-center justify-center rounded-sm">
                <span className="material-symbols-outlined text-secondary">storefront</span>
              </div>
              <div>
                <h3 className="font-headline text-3xl tracking-tight">Vinculación de Red</h3>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">Asignar miembro a una boutique específica</p>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-10">
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Seleccionar Boutique</label>
                <select 
                  name="companyId"
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-sm font-label focus:border-secondary focus:ring-0 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Seleccione una boutique...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 3: ROL Y PERMISOS */}
        <section className="space-y-10">
          <header className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-surface-container-low border border-outline-variant/10 flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-secondary">security</span>
            </div>
            <div>
              <h3 className="font-headline text-3xl tracking-tight">Privilegios & Rol</h3>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">Atribuciones funcionales dentro del sistema</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Designar Jerarquía</label>
              <select 
                name="roleId"
                required
                onChange={(e) => setSelectedRoleId(parseInt(e.target.value, 10))}
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-sm font-label focus:border-secondary focus:ring-0 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Seleccione un rol...</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div className="bg-surface-low border border-outline-variant/10 p-8 space-y-6">
               <h4 className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10 pb-4">
                  Permisos Adquiridos {selectedRole ? `para ${selectedRole.name}` : ''}
               </h4>
               <div className="grid grid-cols-1 gap-3">
                  {permissions.length > 0 ? (
                    permissions.map((p, i) => (
                      <div key={i} className="flex items-center space-x-3 text-on-surface opacity-80">
                         <span className="material-symbols-outlined text-sm text-secondary">verified</span>
                         <span className="text-[10px] font-label uppercase tracking-widest">{p}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[9px] font-label uppercase tracking-widest text-outline-variant italic">Selecciona un rol para ver sus atribuciones</p>
                  )}
               </div>
            </div>
          </div>
        </section>

        <footer className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-8">
           <label className="flex items-center cursor-pointer group">
              <input type="checkbox" name="isActive" defaultChecked className="hidden peer" />
              <div className="w-5 h-5 border border-outline-variant group-hover:border-secondary peer-checked:bg-secondary peer-checked:border-secondary transition-all flex items-center justify-center mr-3">
                 <span className="material-symbols-outlined text-[14px] text-surface hidden peer-checked:block">check</span>
              </div>
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface">Cuenta Activa (Habilitar Login)</span>
           </label>
           
           <div className="flex items-center space-x-6">
              <button 
                type="button" 
                onClick={() => window.history.back()}
                className="text-[10px] font-label uppercase tracking-[0.3em] text-on-surface-variant hover:text-on-surface"
              >
                Cancelar
              </button>
              <button 
                disabled={pending}
                type="submit" 
                className="bg-on-surface text-surface px-12 py-5 font-label text-[10px] uppercase tracking-[0.3em] hover:bg-secondary transition-all shadow-lg hover:shadow-secondary/20 disabled:opacity-50"
              >
                {pending ? 'Autorizando...' : 'Finalizar Registro'}
              </button>
           </div>
        </footer>
      </form>
    </div>
  );
}
