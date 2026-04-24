'use client';
import { useActionState, useState } from 'react';
import { login } from '@/features/auth/actions';

const initialState = { error: '' };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [role, setRole] = useState<'Shopper' | 'Store Owner'>('Shopper');

  return (
    <section className="p-12 lg:p-20 border-r-0 lg:border-r border-outline-variant/15 flex flex-col justify-center h-full">
      <div className="max-w-md mx-auto w-full">
        <header className="mb-12">
          <span className="font-label text-[0.6875rem] uppercase tracking-[0.3em] text-secondary mb-4 block">Bienvenido de Nuevo</span>
          <h1 className="font-headline text-4xl lg:text-5xl tracking-tight text-on-surface">Iniciar Sesión</h1>
          <p className="mt-4 text-on-surface-variant font-body leading-relaxed">Accede a tu colección curada y privilegios de miembro.</p>
        </header>

        {state?.error && <p className="text-error font-label text-xs uppercase tracking-widest mb-6">{state.error}</p>}

        {/* Role Switcher (Visual Only for now based on design) */}
        <div className="flex space-x-8 mb-10 border-b border-outline-variant/20">
          <button 
            type="button" 
            onClick={() => setRole('Shopper')}
            className={`pb-3 text-sm font-label uppercase tracking-widest transition-all duration-300 ${role === 'Shopper' ? 'text-on-surface border-b-2 border-secondary' : 'text-on-surface-variant hover:text-secondary'}`}
          >
            Comprador
          </button>
          <button 
            type="button" 
            onClick={() => setRole('Store Owner')}
            className={`pb-3 text-sm font-label uppercase tracking-widest transition-all duration-300 ${role === 'Store Owner' ? 'text-on-surface border-b-2 border-secondary' : 'text-on-surface-variant hover:text-secondary'}`}
          >
            Dueño de Tienda
          </button>
        </div>

        <form action={formAction} className="space-y-8">
          <input type="hidden" name="role" value={role} />
          
          <div className="group relative">
            <label htmlFor="email" className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">Correo Electrónico</label>
            <input id="email" name="email" type="email" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-on-surface placeholder:text-outline-variant/50 focus:border-secondary focus:ring-0 outline-none transition-all" placeholder="atelier@dominio.com" />
          </div>
          
          <div className="group relative">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant">Contraseña</label>
              <a href="#" className="font-label text-[0.6rem] uppercase tracking-widest text-secondary underline underline-offset-4">¿Olvidaste tu contraseña?</a>
            </div>
            <input id="password" name="password" type="password" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-on-surface placeholder:text-outline-variant/50 focus:border-secondary focus:ring-0 outline-none transition-all" placeholder="••••••••" />
          </div>

          <div className="pt-4">
            <button disabled={pending} type="submit" className="w-full bg-primary text-on-primary py-4 font-label text-sm uppercase tracking-[0.2em] hover:bg-primary-dim transition-all active:scale-95 duration-300 disabled:opacity-50">
              {pending ? 'Autenticando...' : 'Entrar al Atelier'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
