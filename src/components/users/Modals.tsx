'use client';

import { useTransition, useState } from 'react';
import { updateRolePermissions, createRole, createPermission } from '@/features/users/actions';

/**
 * MODAL DE GESTIÓN DE ROLES Y PERMISOS
 */
export function RolePermissionsModal({ 
  roles, 
  allPermissions, 
  onClose 
}: { 
  roles: any[], 
  allPermissions: any[], 
  onClose: () => void 
}) {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(roles[0]?.id || null);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'manage' | 'create-role' | 'create-permission'>('manage');

  const selectedRole = roles.find(r => r.id === selectedRoleId);
  const activePermissionIds = selectedRole?.RolePermission?.map((rp: any) => rp.permissionId) || [];

  const handleTogglePermission = (permissionId: number) => {
    if (!selectedRoleId) return;
    
    let newList = [...activePermissionIds];
    if (newList.includes(permissionId)) {
      newList = newList.filter(id => id !== permissionId);
    } else {
      newList.push(permissionId);
    }

    startTransition(async () => {
      try {
        await updateRolePermissions(selectedRoleId, newList);
      } catch (err) {
        alert('Error al actualizar permisos');
      }
    });
  };

  const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createRole(null, formData);
      if (result.error) alert(result.error);
      else {
        alert('Rol creado exitosamente');
        setActiveTab('manage');
      }
    });
  };

  const handleCreatePermission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createPermission(null, formData);
      if (result.error) alert(result.error);
      else {
        alert('Permiso creado exitosamente');
        setActiveTab('manage');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-6xl bg-surface-container-low border border-outline-variant/20 shadow-2xl flex flex-col md:flex-row divide-x divide-outline-variant/10 overflow-hidden h-[85vh]">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-surface-low p-10 flex flex-col space-y-10 shrink-0 overflow-y-auto">
          <header>
            <h3 className="font-headline text-2xl tracking-tight">Estructura</h3>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Gestión de Acceso Global</p>
          </header>

          <nav className="flex flex-col space-y-2">
            <button 
              onClick={() => setActiveTab('manage')}
              className={`text-left px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em] transition-all flex items-center space-x-3 ${activeTab === 'manage' ? 'bg-surface-container-high text-on-surface font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-sm">settings_suggest</span>
              <span>Gestionar Roles</span>
            </button>
            <button 
              onClick={() => setActiveTab('create-role')}
              className={`text-left px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em] transition-all flex items-center space-x-3 ${activeTab === 'create-role' ? 'bg-surface-container-high text-on-surface font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Nuevo Rol</span>
            </button>
            <button 
              onClick={() => setActiveTab('create-permission')}
              className={`text-left px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em] transition-all flex items-center space-x-3 ${activeTab === 'create-permission' ? 'bg-surface-container-high text-on-surface font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Nuevo Permiso</span>
            </button>
          </nav>

          {activeTab === 'manage' && (
            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
              <p className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">Seleccionar Rol</p>
              {roles.map(role => (
                <button 
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`text-left w-full px-4 py-2 font-label text-[10px] uppercase tracking-[0.1em] transition-all border-l-2 ${selectedRoleId === role.id ? 'border-secondary text-secondary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                >
                  {role.name}
                </button>
              ))}
            </div>
          )}

          <div className="mt-auto pt-10 border-t border-outline-variant/10">
             <button onClick={onClose} className="text-[10px] font-label uppercase tracking-widest text-secondary hover:underline">Cerrar Gestión</button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 bg-surface-container-low p-12 overflow-y-auto">
          {activeTab === 'manage' && (
            selectedRole ? (
              <div className="space-y-12">
                <header className="flex justify-between items-center">
                   <div>
                      <h4 className="font-headline text-3xl italic">{selectedRole.name}</h4>
                      <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Configuración de capacidades operativas</p>
                   </div>
                   {isPending && <span className="text-[10px] font-label uppercase text-secondary animate-pulse">Sincronizando...</span>}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allPermissions.map(perm => (
                    <label key={perm.id} className="group flex items-center justify-between p-6 bg-surface-low border border-outline-variant/10 hover:border-secondary/30 transition-all cursor-pointer">
                      <div className="flex flex-col space-y-1">
                         <span className="font-label text-[11px] uppercase tracking-widest group-hover:text-secondary transition-colors">{perm.name}</span>
                         <span className="text-[8px] text-outline-variant tracking-widest italic">{perm.name.replace(/ /g, '_').toUpperCase()}</span>
                      </div>
                      <div className="relative">
                         <input 
                           type="checkbox" 
                           className="hidden peer"
                           checked={activePermissionIds.includes(perm.id)}
                           onChange={() => handleTogglePermission(perm.id)}
                           disabled={isPending}
                         />
                         <div className="w-10 h-10 border border-outline-variant flex items-center justify-center peer-checked:bg-secondary peer-checked:border-secondary transition-all">
                            <span className="material-symbols-outlined text-sm text-surface hidden peer-checked:block">done</span>
                         </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-on-surface-variant/40 font-headline italic">
                 Selecciona un rol para gestionar sus atribuciones.
              </div>
            )
          )}

          {activeTab === 'create-role' && (
            <div className="max-w-2xl mx-auto space-y-12">
               <header>
                  <h4 className="font-headline text-4xl">Nuevo Rol</h4>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Definir una nueva jerarquía en el sistema</p>
               </header>
               
               <form onSubmit={handleCreateRole} className="space-y-10">
                  <div className="space-y-4">
                    <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Nombre del Rol</label>
                    <input name="name" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-4 text-xl text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors" placeholder="EJ: ADMINISTRADOR DE BOUTIQUE" />
                  </div>

                  <div className="space-y-6">
                    <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Asignar Permisos Iniciales</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allPermissions.map(perm => (
                        <label key={perm.id} className="flex items-center space-x-3 p-4 border border-outline-variant/10 hover:bg-surface-low transition-colors cursor-pointer">
                          <input type="checkbox" name="permissions" value={perm.id} className="accent-secondary" />
                          <span className="font-label text-[10px] uppercase tracking-widest">{perm.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button disabled={isPending} className="w-full bg-on-surface text-surface py-5 font-label text-[10px] uppercase tracking-[0.4em] hover:bg-secondary transition-all disabled:opacity-50">
                    {isPending ? 'CREANDO...' : 'CREAR ROL DEL SISTEMA'}
                  </button>
               </form>
            </div>
          )}

          {activeTab === 'create-permission' && (
            <div className="max-w-2xl mx-auto space-y-12">
               <header>
                  <h4 className="font-headline text-4xl">Nuevo Permiso</h4>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Añadir una nueva capacidad operativa</p>
               </header>
               
               <form onSubmit={handleCreatePermission} className="space-y-10">
                  <div className="space-y-4">
                    <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Nombre del Permiso</label>
                    <input name="name" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-4 text-xl text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors" placeholder="EJ: VER_REPORTES_VENTAS" />
                  </div>

                  <button disabled={isPending} className="w-full bg-on-surface text-surface py-5 font-label text-[10px] uppercase tracking-[0.4em] hover:bg-secondary transition-all disabled:opacity-50">
                    {isPending ? 'CREANDO...' : 'CREAR PERMISO ATÓMICO'}
                  </button>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
