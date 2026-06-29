'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import GlobalNavbar from './GlobalNavbar';

interface DashboardLayoutWrapperProps {
  sidebar: ReactNode;
  children: ReactNode;
  headerTitle: string;
  userName?: string;
  session?: any;
}

export default function DashboardLayoutWrapper({ sidebar, children, headerTitle, userName, session }: DashboardLayoutWrapperProps) {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-secondary-container selection:text-on-secondary-container">
      {sidebar}

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto bg-surface/20">
        <GlobalNavbar 
          session={session}
          transparent={false}
          showSearch={true}
          showCart={false}
        />
        <div className="p-8 lg:p-12 max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700 mt-16 md:mt-20">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-outline-variant/10">
            <div className="flex items-center gap-4">
              {/* Botones navegación limpios */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => router.back()}
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-surface-container-high rounded-full transition-all duration-200"
                  title="Atrás"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                </button>
                <button
                  onClick={() => router.forward()}
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-surface-container-high rounded-full transition-all duration-200"
                  title="Adelante"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </button>
              </div>
              {/* Título de la página */}
              <h1 className="font-headline text-2xl tracking-tight text-on-surface">{headerTitle}</h1>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
