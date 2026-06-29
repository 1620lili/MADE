'use client';

import { useState, useTransition, useEffect } from 'react';
import { updateUser } from '@/features/users/actions';

interface User {
  id: string;
  email: string;
  fullName: string | null;
  companyId: number | null;
  isActive: boolean;
  UserRole?: {
    roleId: number;
    companyId: number;
  }[];
}

interface Company {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  companies: Company[];
  roles: Role[];
}

export default function EditUserModal({ isOpen, onClose, user, companies, roles }: EditUserModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(user.fullName || '');
  const [email, setEmail] = useState(user.email);
  const [companyId, setCompanyId] = useState<string>(user.companyId?.toString() || '');
  const [roleId, setRoleId] = useState<string>(user.UserRole?.[0]?.roleId?.toString() || '');
  const [isActive, setIsActive] = useState(user.isActive);

  useEffect(() => {
    if (isOpen) {
      setFullName(user.fullName || '');
      setEmail(user.email);
      setCompanyId(user.companyId?.toString() || '');
      setRoleId(user.UserRole?.[0]?.roleId?.toString() || '');
      setIsActive(user.isActive);
      setSuccess(false);
      setError(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('companyId', companyId);
    formData.append('roleId', roleId);
    formData.append('isActive', isActive.toString());

    startTransition(async () => {
      const result = await updateUser(null, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(onClose, 2000);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-surface-container-low border border-outline-variant/20 shadow-2xl p-10 space-y-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>

        <header className="space-y-2">
          <h3 className="font-headline text-2xl tracking-tight">Editar Colaborador</h3>
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Modificar perfil y permisos</p>
        </header>

        {success ? (
          <div className="bg-secondary/10 text-secondary p-6 text-center animate-in zoom-in duration-300">
            <span className="material-symbols-outlined text-4xl mb-4 block">check_circle</span>
            <p className="font-label text-[10px] uppercase tracking-widest">Usuario actualizado correctamente</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-error/10 text-error text-[10px] uppercase tracking-widest font-label border border-error/20">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-sm text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-sm text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Boutique / Empresa</label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-sm text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors appearance-none"
                >
                  <option value="" className="bg-surface-container-low">Sin Empresa (Global)</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id} className="bg-surface-container-low">
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Rol Asignado</label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-sm text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors appearance-none"
                >
                  <option value="" className="bg-surface-container-low">Seleccionar Rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id} className="bg-surface-container-low">
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4 py-4">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-secondary' : 'bg-outline-variant'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface">
                Usuario {isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="pt-4">
              <button
                disabled={isPending}
                type="submit"
                className="w-full bg-on-surface text-surface py-4 font-label text-[10px] uppercase tracking-[0.3em] hover:bg-secondary transition-all disabled:opacity-50"
              >
                {isPending ? 'Sincronizando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
