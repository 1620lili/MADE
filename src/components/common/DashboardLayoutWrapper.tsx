import { ReactNode } from 'react';

interface DashboardLayoutWrapperProps {
  sidebar: ReactNode;
  children: ReactNode;
  headerTitle: string;
}

export default function DashboardLayoutWrapper({ sidebar, children, headerTitle }: DashboardLayoutWrapperProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Google Material Symbols */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        rel="stylesheet" 
      />

      {sidebar}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-surface/20">
        <header className="h-20 bg-background/60 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-12 sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            <span className="w-8 h-[1px] bg-outline-variant"></span>
            <span className="font-headline text-sm tracking-[0.4em] text-on-surface/60 uppercase">{headerTitle}</span>
          </div>
          
          <div className="flex items-center space-x-8 text-on-surface-variant">
            <div className="relative group cursor-pointer">
              <span className="material-symbols-outlined text-xl group-hover:text-on-surface transition-colors">search</span>
            </div>
            <div className="relative group cursor-pointer">
              <span className="material-symbols-outlined text-xl group-hover:text-on-surface transition-colors">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full border-2 border-background"></span>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center cursor-pointer hover:border-secondary transition-colors overflow-hidden">
               <span className="material-symbols-outlined text-lg">account_circle</span>
            </div>
          </div>
        </header>

        <div className="p-12 lg:p-16 max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
