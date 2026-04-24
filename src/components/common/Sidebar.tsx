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
}

export default function Sidebar({ title, subtitle, items, homeHref }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col pt-12 pb-8 px-10 shrink-0 h-screen sticky top-0">
      <div className="mb-14">
        <Link href={homeHref}>
          <h2 className="font-headline text-2xl tracking-widest text-on-surface uppercase opacity-90 cursor-pointer">{title}</h2>
        </Link>
        <p className="text-[10px] font-label uppercase tracking-[0.4em] text-secondary mt-2">{subtitle}</p>
      </div>

      <nav className="flex-1 space-y-4">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== homeHref && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center space-x-5 py-2 group transition-all ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${isActive ? 'text-secondary font-fill' : 'group-hover:text-secondary'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className={`font-label text-[0.6875rem] uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-on-surface font-bold' : 'group-hover:text-on-surface'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-10 border-t border-outline-variant/10 space-y-5">
        <Link href="/" className="block text-[10px] font-label uppercase tracking-[0.3em] text-on-surface-variant hover:text-secondary transition-colors">
          Ver Boutique Front
        </Link>
        <form action={logout}>
          <button type="submit" className="text-[10px] font-label uppercase tracking-[0.3em] text-error hover:opacity-80 transition-opacity flex items-center space-x-2">
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
