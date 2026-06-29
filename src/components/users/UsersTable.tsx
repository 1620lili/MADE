'use client';

import { useTransition, useState } from 'react';
import { updateUserStatus } from '@/features/users/actions';
import ChangePasswordModal from './ChangePasswordModal';
import EditUserModal from './EditUserModal';

interface UserData {
  id: string;
  email: string;
  fullName: string | null;
  isSuper: boolean;
  isActive: boolean;
  companyId: number | null;
  Company?: {
    id: number;
    name: string;
  } | null;
  UserRole?: {
    roleId: number;
    Role: {
      id: number;
      name: string;
    };
  }[];
}

interface UsersTableProps {
  users: UserData[];
  companies: any[];
  roles: any[];
  showCompany?: boolean;
}

export default function UsersTable({ users, companies, roles, showCompany = true }: UsersTableProps) {
  const [isPending, startTransition] = useTransition();
  const [resetUser, setResetUser] = useState<{ id: string; name: string } | null>(null);
  const [editUser, setEditUser] = useState<UserData | null>(null);

  const handleToggleStatus = (id: string, current: boolean) => {
    const action = current ? 'desactivar' : 'activar';
    if (!window.confirm(`¿Deseas ${action} este usuario?`)) return;
    
    startTransition(async () => {
      try {
        await updateUserStatus(id, !current);
      } catch (error) {
        alert('Error al actualizar el estado del usuario');
      }
    });
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="overflow-x-auto bg-surface-lowest border border-outline-variant/10 rounded-sm shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-low/30 border-b border-outline-variant/20">
              <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant">Miembro</th>
              {showCompany && (
                <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant">Boutique</th>
              )}
              <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Rol Designado</th>
              <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-center">Estado</th>
              <th className="px-8 py-6 font-label text-[0.625rem] uppercase tracking-[0.3em] text-on-surface-variant text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {users.map((user) => {
              const rolesList = user.UserRole?.map((ur) => ur.Role.name) || [];
              const roleDisplay = user.isSuper ? 'SUPER ADMIN' : (rolesList[0] || 'SIN ROL');

              return (
                <tr key={user.id} className="hover:bg-surface-low/30 transition-colors group">
                  <td className="px-8 py-7">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-surface-container-low flex items-center justify-center rounded-full border border-outline-variant/10 text-on-surface-variant group-hover:bg-secondary/10 group-hover:text-secondary transition-colors font-headline italic text-sm">
                        {getInitials(user.fullName, user.email)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-label font-medium text-on-surface">{user.fullName || 'Pendiente'}</span>
                        <span className="text-[10px] text-outline-variant tracking-wider">{user.email}</span>
                      </div>
                    </div>
                  </td>

                  {showCompany && (
                    <td className="px-8 py-7">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        {user.Company?.name || 'Gestión Global'}
                      </span>
                    </td>
                  )}

                  <td className="px-8 py-7 text-center">
                    <span className={`text-[0.55rem] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-sm ${
                      user.isSuper 
                        ? 'bg-[#D4AF37] text-white shadow-sm' 
                        : 'bg-surface-low text-on-surface-variant border border-outline-variant/10'
                    }`}>
                      {roleDisplay}
                    </span>
                  </td>

                  <td className="px-8 py-7 text-center">
                    <div className="flex items-center justify-center">
                      <span className={`text-[0.6rem] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                        user.isActive 
                          ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                          : 'bg-outline-variant/10 border-outline-variant/20 text-on-surface-variant opacity-60'
                      }`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-7 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setEditUser(user)}
                        className="p-2 material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors text-lg" 
                        title="Editar Perfil"
                      >
                        edit
                      </button>
                      <button 
                        onClick={() => setResetUser({ id: user.id, name: user.fullName || user.email })}
                        className="p-2 material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors text-lg" 
                        title="Cambiar Contraseña"
                      >
                        lock_reset
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        disabled={isPending}
                        className={`p-2 material-symbols-outlined transition-colors text-lg ${
                          user.isActive 
                            ? 'text-on-surface-variant hover:text-error' 
                            : 'text-secondary hover:text-on-surface'
                        }`}
                        title={user.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {user.isActive ? 'toggle_on' : 'toggle_off'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={showCompany ? 5 : 4} className="px-8 py-24 text-center text-on-surface-variant font-body italic opacity-60 uppercase tracking-widest text-xs">
                  No hay colaboradores registrados bajo este criterio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {resetUser && (
        <ChangePasswordModal 
          isOpen={!!resetUser}
          userId={resetUser.id} 
          userName={resetUser.name}
          onClose={() => setResetUser(null)} 
        />
      )}

      {editUser && (
        <EditUserModal
          isOpen={!!editUser}
          user={editUser}
          companies={companies}
          roles={roles}
          onClose={() => setEditUser(null)}
        />
      )}
    </>
  );
}
