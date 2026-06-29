'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/features/auth/actions';
import { useCart } from '@/context/CartContext';

interface GlobalNavbarProps {
  session?: {
    fullName?: string;
    email?: string;
    isSuper?: boolean;
    companyId?: any;
  } | null;
  transparent?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
}

export default function GlobalNavbar({
  session,
  transparent = false,
  showSearch = true,
  showCart = true,
}: GlobalNavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  
  // Conditionally use context since it might throw if outside provider (though Navbar should be inside)
  const cartContext = useCart();
  const totalItems = cartContext?.totalItems || 0;
  const openCart = cartContext?.openCart || (() => {});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initials = session?.fullName
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  const firstName = session?.fullName?.split(' ')[0] || session?.email;
  const dashHref = session?.isSuper ? '/admin' : '/dashboard';
  const isTransparent = transparent && !scrolled;

  const btnClass = `w-12 h-[46px] flex flex-col items-center justify-center gap-1 
    bg-[#1a1a18]/60 backdrop-blur-md border border-white/20 text-white/70 
    hover:bg-[#1a1a18]/90 hover:text-white hover:border-white/50
    transition-all duration-200`;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 flex items-center 
      justify-between px-6 md:px-10 transition-all duration-500
      ${isTransparent
        ? 'h-20 bg-transparent'
        : 'h-20 bg-[#1a1a18] border-b border-white/5 shadow-lg'
      }`}
    >
      {/* LOGO */}
      <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
        <div className={`w-12 h-12 flex items-center justify-center bg-pink-200/90 rounded-sm
          ${isTransparent ? 'opacity-90' : 'opacity-100'}`}>
          <img
            src="/image/made-logo.jpeg"
            alt="MADE"
            className="h-6 w-auto object-contain mix-blend-multiply opacity-80"
          />
        </div>
      </Link>

      {/* BOTONES DERECHA */}
      <div className="flex items-center gap-2">

        {/* 1. LUPA */}
        {showSearch && (
          <button className={btnClass} title="Buscar">
            <span className="material-symbols-outlined" style={{fontSize:'16px'}}>search</span>
            <span className="text-[5.5px] font-label uppercase tracking-[0.2em]">Buscar</span>
          </button>
        )}

        {/* 2. CARRITO */}
        {showCart && (
          <button onClick={openCart} className={`${btnClass} relative`} title="Carrito de compras">
            <span className="material-symbols-outlined" style={{fontSize:'16px'}}>shopping_bag</span>
            <span className="text-[5.5px] font-label uppercase tracking-[0.2em]">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-[14px] h-[14px] 
              bg-[#8b7355] text-white text-[7px] font-bold 
              rounded-full flex items-center justify-center border-2 border-[#1a1a18]">
                {totalItems}
              </span>
            )}
          </button>
        )}

        {/* DIVIDER */}
        <div className="w-px h-8 bg-white/20 mx-2" />

        {/* 3. ATRÁS */}
        <button onClick={() => router.back()} className={btnClass} title="Página anterior">
          <span className="material-symbols-outlined" style={{fontSize:'16px'}}>navigate_before</span>
          <span className="text-[5.5px] font-label uppercase tracking-[0.2em]">Atrás</span>
        </button>

        {/* 4. SIGUIENTE */}
        <button onClick={() => router.forward()} className={btnClass} title="Página siguiente">
          <span className="material-symbols-outlined" style={{fontSize:'16px'}}>navigate_next</span>
          <span className="text-[5.5px] font-label uppercase tracking-[0.2em]">Siguiente</span>
        </button>

        {/* DIVIDER */}
        <div className="w-px h-8 bg-white/20 mx-2" />

        {session ? (
          <div className="flex items-center gap-2">
            {/* 5a. NOMBRE USUARIO */}
            <div className="hidden sm:flex items-center gap-3 
            px-4 h-[46px] bg-[#1a1a18]/60 backdrop-blur-md border border-white/20">
              <div className={`w-6 h-6 rounded-full flex items-center 
              justify-center text-white font-bold shrink-0
              ${session.isSuper ? 'bg-[#534AB7]' : 'bg-[#8b7355]'}`}
              style={{fontSize:'9px'}}>
                {initials}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-white font-headline tracking-wide text-xs uppercase">
                  {firstName}
                </span>
                <span className="text-white/40 font-label uppercase tracking-[0.3em] text-[5.5px]">
                  {session.isSuper ? 'Super Admin' : 'Usuario'}
                </span>
              </div>
            </div>

            {/* 5b. DASHBOARD */}
            <Link
              href={dashHref}
              className={`hidden sm:flex flex-col items-center justify-center gap-1 
              px-6 h-[46px] text-white transition-all duration-200 border border-transparent
              ${session.isSuper
                ? 'bg-[#534AB7] hover:bg-[#3C3489]'
                : 'bg-[#8b7355] hover:bg-[#6e5c42]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined" style={{fontSize:'14px'}}>dashboard</span>
                <span className="font-headline tracking-widest text-xs uppercase">
                  {session.isSuper ? 'Admin' : 'Dashboard'}
                </span>
              </div>
              <span className="font-label uppercase tracking-[0.3em] text-[5.5px] text-white/60">
                {session.isSuper ? 'Panel Admin' : 'Ir al panel'}
              </span>
            </Link>

            {/* 5c. CERRAR SESIÓN */}
            <form action={logout}>
              <button
                type="submit"
                className="w-12 h-[46px] flex flex-col items-center justify-center gap-1 
                bg-[#1a1a18]/80 backdrop-blur-md border border-red-500/30 text-red-400 
                hover:bg-red-500 hover:text-white hover:border-red-500
                transition-all duration-200"
                title="Cerrar sesión"
              >
                <span className="material-symbols-outlined" style={{fontSize:'16px'}}>power_settings_new</span>
                <span className="text-[5.5px] font-label uppercase tracking-[0.2em]">Salir</span>
              </button>
            </form>
          </div>
        ) : (
          /* 5d. INICIAR SESIÓN (sin sesión) */
          <Link
            href="/auth"
            className="flex flex-col items-center justify-center gap-1 px-8 h-[46px] 
            bg-[#1a1a18]/60 backdrop-blur-md border border-white/20 text-white/90 
            hover:bg-white/10 hover:border-white/50 hover:text-white 
            transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined" style={{fontSize:'14px'}}>login</span>
              <span className="font-headline uppercase tracking-widest text-xs">
                Iniciar sesión
              </span>
            </div>
            <span className="font-label uppercase tracking-[0.3em] text-[5.5px] text-white/50">
              Login
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
