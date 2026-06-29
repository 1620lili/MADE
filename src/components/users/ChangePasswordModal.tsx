'use client';

import { useState } from 'react';
import { changePassword } from '@/features/users/actions';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export default function ChangePasswordModal({ isOpen, onClose, userId, userName }: ChangePasswordModalProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setPending(true);
    setError('');
    try {
      await changePassword(userId, newPassword);
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-surface-container-low border border-outline-variant/20 shadow-2xl p-10 space-y-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>

        <header className="space-y-2">
          <h3 className="font-headline text-2xl tracking-tight">Cambiar Contraseña</h3>
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Usuario: {userName}</p>
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
                <input 
                  name="newPassword" 
                  type="password" 
                  required 
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Confirmar Contraseña</label>
                <input 
                  name="confirmPassword" 
                  type="password" 
                  required 
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors" 
                />
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
