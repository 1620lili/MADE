'use client';

import { useActionState, useTransition, useState } from 'react';
import { changePassword, updateRolePermissions } from '@/features/users/actions';

/**
 * MODAL DE CAMBIO DE CONTRASEÑA
 */
export function PasswordResetModal({ userId, onClose }: { userId: string, onClose: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pass = formData.get('password') as string;
    const confirm = formData.get('confirm') as string;

    if (pass !== confirm) {
       setError('Las contraseñas no coinciden');
       return;
    }

    setPending(true);
    setError('');
    try {
      await changePassword(userId, pass);
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      setError('Error al actualizar la contraseña');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-24 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-surface-container-low border border-outline-variant/20 shadow-2xl p-10 space-y-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors">
           <span className="material-symbols-outlined">close</span>
        </button>

        <header className="space-y-2">
          <h3 className="font-headline text-2xl tracking-tight">Reiniciar Credenciales</h3>
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Establecer nueva clave de acceso</p>
        </header>

        {success ? (
          <div className="bg-secondary/10 text-secondary p-6 text-center animate-in zoom-in duration-300">
             <span className="material-symbols-outlined text-4xl mb-4 block">check_circle</span>
             <p className="font-label text-[10px] uppercase tracking-widest">Contraseña actualizada exitosamente</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-error font-label text-[10px] uppercase tracking-widest bg-error/5 p-3 italic">{error}</p>}
            
            <div className="space-y-4">
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Nueva Contraseña</label>
                <input name="password" type="password" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Confirmar Contraseña</label>
                <input name="confirm" type="password" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors" />
              </div>
            </div>

            <button disabled={pending} type="submit" className="w-full bg-on-surface text-surface py-4 font-label text-[10px] uppercase tracking-[0.3em] hover:bg-secondary transition-all disabled:opacity-50">
               {pending ? 'Actualizando...' : 'Confirmar Cambio'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-surface-container-low border border-outline-variant/20 shadow-2xl flex flex-col md:flex-row divide-x divide-outline-variant/10 overflow-hidden h-[80vh]">
        
        {/* Sidebar de Roles */}
        <div className="w-full md:w-80 bg-surface-low p-10 flex flex-col space-y-10 shrink-0">
          <header>
            <h3 className="font-headline text-2xl tracking-tight">Jerarquías</h3>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Definir roles del sistema</p>
          </header>
          <nav className="flex flex-col space-y-4">
            {roles.map(role => (
              <button 
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`text-left px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em] transition-all border-l-2 ${selectedRoleId === role.id ? 'border-secondary bg-surface-container-high text-on-surface font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:pl-6'}`}
              >
                {role.name}
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-10 border-t border-outline-variant/10">
             <button onClick={onClose} className="text-[10px] font-label uppercase tracking-widest text-secondary hover:underline">Finalizar Edición</button>
          </div>
        </div>

        {/* Panel de Permisos */}
        <div className="flex-1 bg-surface-container-low p-12 overflow-y-auto">
          {selectedRole ? (
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
                       <span className="text-[8px] text-outline-variant tracking-widest">PERMISO_ID: 00{perm.id}</span>
                    </div>
                    <div className="relative">
                       <input 
                         type="checkbox" 
                         className="hidden peer"
                         checked={activePermissionIds.includes(perm.id)}
                         onChange={() => handleTogglePermission(perm.id)}
                         disabled={isPending}
                       />
                       <div className="w-10 h-10 border border-outline-variant flex items-center justify-center peer-checked:bg-on-surface peer-checked:border-on-surface transition-all">
                          <span className="material-symbols-outlined text-sm text-surface hidden peer-checked:block">done</span>
                       </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-on-surface-variant/40 font-headline italic">
               Selecciona un rol de la lista para gestionar sus atribuciones.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
