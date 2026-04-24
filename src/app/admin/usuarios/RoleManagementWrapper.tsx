'use client';

import { useState } from 'react';
import { RolePermissionsModal } from '@/components/users/Modals';

export default function RoleManagementWrapper({ roles, permissions }: { roles: any[], permissions: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-surface-container-high border border-outline-variant/20 text-on-surface px-8 py-4 text-[10px] tracking-widest uppercase font-label font-bold hover:bg-surface-high transition-all flex items-center space-x-3"
      >
        <span className="material-symbols-outlined text-sm">security</span>
        <span>Gestionar Roles</span>
      </button>

      {isOpen && (
        <RolePermissionsModal 
          roles={roles} 
          allPermissions={permissions} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
