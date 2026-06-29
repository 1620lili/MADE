'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/features/auth/actions';

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  title: string;
  subtitle: string;
  items: MenuItem[];
  homeHref: string;
  userName?: string;
  userEmail?: string;
}

export default function Sidebar({ title, subtitle, items, homeHref, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col pt-12 pb-8 px-6 shrink-0 h-screen sticky top-0">
      <div className="mb-14 px-3">
        <Link href={homeHref}>
          <h2 className="font-headline text-2xl tracking-widest text-on-surface uppercase opacity-90 cursor-pointer hover:text-secondary transition-colors">{title}</h2>
        </Link>
        <p className="text-[10px] font-label uppercase tracking-[0.4em] text-secondary mt-2">{subtitle}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        <Link 
          href={homeHref} 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${pathname === homeHref ? 'bg-secondary/10 text-secondary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
        >
          <span 
            className="material-symbols-outlined shrink-0" 
            style={{ fontSize: '20px', fontVariationSettings: pathname === homeHref ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="font-label text-[11px] uppercase tracking-[0.15em] font-medium truncate">
            Inicio Dashboard
          </span>
          {pathname === homeHref && (
            <div className="ml-auto w-1 h-4 bg-secondary rounded-full" />
          )}
        </Link>

        <div className="h-[1px] bg-outline-variant/10 my-4 mx-3"></div>

        {items.filter(item => item.href !== homeHref).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-secondary/10 text-secondary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
            >
              <span 
                className="material-symbols-outlined shrink-0" 
                style={{ fontSize: '20px', fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="font-label text-[11px] uppercase tracking-[0.15em] font-medium truncate">
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1 h-4 bg-secondary rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/10 space-y-3">
        {/* Avatar + nombre */}
        {(userName || userEmail) && (
          <div className="flex items-center gap-3 px-3 py-3 bg-surface-container-low rounded-lg">
            <div className="w-8 h-8 rounded-full bg-secondary text-surface flex items-center justify-center font-bold text-[11px] shrink-0">
              {userName?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() || '?'}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="font-label text-[10px] font-bold uppercase tracking-wide text-on-surface truncate">
                {userName || 'Usuario'}
              </p>
              <p className="text-[9px] text-on-surface-variant truncate">
                {userEmail}
              </p>
            </div>
          </div>
        )}

        {/* Ir al Mall */}
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition-all duration-200"
        >
          <span className="material-symbols-outlined" style={{fontSize: '18px'}}>storefront</span>
          <span className="font-label text-[10px] uppercase tracking-[0.2em]">
            Ir al Mall
          </span>
        </Link>

        {/* Cerrar sesión */}
        <form action={logout}>
          <button type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-error/10 border border-transparent hover:border-error/20 transition-all duration-200"
          >
            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>logout</span>
            <span className="font-label text-[10px] uppercase tracking-[0.2em]">
              Cerrar Sesión
            </span>
          </button>
        </form>
      </div>
    </aside>
  );
}
