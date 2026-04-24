'use client';
import { useActionState, useState } from 'react';
import { register } from '@/features/auth/actions';

const initialState = { error: '' };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, initialState);
  const [role, setRole] = useState<'Shopper' | 'Store Owner'>('Shopper');

  return (
    <section className="p-12 lg:p-20 bg-surface-container-low flex flex-col justify-center min-h-screen">
      <div className="max-w-md mx-auto w-full">
        <header className="mb-12">
          <span className="font-label text-[0.6875rem] uppercase tracking-[0.3em] text-secondary mb-4 block">Nueva Membresía</span>
          <h2 className="font-headline text-4xl lg:text-5xl tracking-tight text-on-surface">Crear Cuenta</h2>
          <p className="mt-4 text-on-surface-variant font-body leading-relaxed">Únete a una red global de boutiques y coleccionistas exigentes.</p>
        </header>

        {state?.error && <p className="text-error font-label text-xs uppercase tracking-widest mb-6">{state.error}</p>}

        <form action={formAction} className="space-y-6">
          {/* --- DATOS DE USUARIO --- */}
          <div className="grid grid-cols-2 gap-6">
            <div className="group relative">
              <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">Nombre</label>
              <input name="firstName" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface placeholder:text-outline-variant/50 focus:border-secondary focus:ring-0 outline-none transition-all" placeholder="Julian" />
            </div>
            <div className="group relative">
              <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">Apellido</label>
              <input name="lastName" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface placeholder:text-outline-variant/50 focus:border-secondary focus:ring-0 outline-none transition-all" placeholder="Leandros" />
            </div>
          </div>

          <div className="group relative">
            <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">Correo Electrónico</label>
            <input name="email" type="email" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface placeholder:text-outline-variant/50 focus:border-secondary focus:ring-0 outline-none transition-all" placeholder="contacto@dominio.com" />
          </div>

          <div className="group relative">
            <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">Contraseña</label>
            <input name="password" type="password" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface placeholder:text-outline-variant/50 focus:border-secondary focus:ring-0 outline-none transition-all" placeholder="Crea una contraseña segura" />
          </div>

          {/* --- SELECCIÓN DE ROL --- */}
          <div className="py-4">
            <span className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-4">Tipo de Membresía</span>
            <div className="flex space-x-10">
              <label className="flex items-center space-x-3 cursor-pointer group" onClick={() => setRole('Shopper')}>
                <input type="radio" name="role" value="Shopper" checked={role === 'Shopper'} readOnly className="hidden peer" />
                <div className="w-4 h-4 border border-outline-variant rounded-full flex items-center justify-center peer-checked:border-secondary transition-colors">
                  <div className="w-2 h-2 bg-secondary scale-0 peer-checked:scale-100 transition-transform rounded-full"></div>
                </div>
                <span className={`text-xs font-label uppercase tracking-widest transition-colors ${role === 'Shopper' ? 'text-on-surface' : 'text-on-surface-variant'}`}>Comprador</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group" onClick={() => setRole('Store Owner')}>
                <input type="radio" name="role" value="Store Owner" checked={role === 'Store Owner'} readOnly className="hidden peer" />
                <div className="w-4 h-4 border border-outline-variant rounded-full flex items-center justify-center peer-checked:border-secondary transition-colors">
                  <div className="w-2 h-2 bg-secondary scale-0 peer-checked:scale-100 transition-transform rounded-full"></div>
                </div>
                <span className={`text-xs font-label uppercase tracking-widest transition-colors ${role === 'Store Owner' ? 'text-on-surface' : 'text-on-surface-variant'}`}>Dueño de Tienda</span>
              </label>
            </div>
          </div>

          {/* --- CAMPOS DE EMPRESA (CONDICIONALES) --- */}
          {role === 'Store Owner' && (
            <div className="space-y-6 pt-6 border-t border-outline-variant/30 animate-in fade-in slide-in-from-top-4 duration-500">
              <span className="block font-label text-[0.6875rem] uppercase tracking-[0.2em] text-secondary mb-2">Detalles de la Boutique</span>

              <div className="group relative">
                <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">Nombre de la Empresa</label>
                <input name="companyName" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary outline-none transition-all" placeholder="Nombre Comercial" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="group relative">
                  <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">NIT / Legal ID</label>
                  <input name="legalId" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary outline-none transition-all" placeholder="123456789-0" />
                </div>
                <div className="group relative">
                  <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">Representante Legal</label>
                  <input name="legalRepresentative" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary outline-none transition-all" placeholder="Nombre Completo" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="group relative">
                  <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">País</label>
                  <input name="country" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary outline-none transition-all" placeholder="Colombia" />
                </div>
                <div className="group relative">
                  <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">Ciudad</label>
                  <input name="city" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary outline-none transition-all" placeholder="Medellín" />
                </div>
              </div>

              <div className="group relative">
                <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">Dirección Física</label>
                <input name="address" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary outline-none transition-all" placeholder="Calle 10 # 43 - 12" />
              </div>

              <div className="group relative">
                <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2">Teléfono de Contacto</label>
                <input name="phone" type="tel" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary outline-none transition-all" placeholder="+57 300 000 0000" />
              </div>

              {/* Nota: Logo y Banner se manejarían mejor como archivos después del registro, 
                  pero aquí los preparamos como inputs de texto/url inicial */}
            </div>
          )}

          <div className="pt-6">
            <button disabled={pending} type="submit" className="w-full border border-primary text-primary py-4 font-label text-sm uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all active:scale-95 duration-300 disabled:opacity-50">
              {pending ? 'Registrando...' : 'Comenzar Viaje'}
            </button>
          </div>

          <p className="text-[0.6rem] font-label uppercase tracking-widest text-center text-on-surface-variant mt-6">
            Al unirte, aceptas nuestros <a href="#" className="underline underline-offset-2">Términos de Servicio Curatorial</a>.
          </p>
        </form>
      </div>
    </section>
  );
}