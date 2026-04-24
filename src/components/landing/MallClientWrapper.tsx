'use client';

import { useState, useEffect } from 'react';
import VirtualDoors from '@/components/landing/VirtualDoors';
import MallFloor from '@/components/landing/MallFloor';

interface MallClientWrapperProps {
  stores: any[];
}

export default function MallClientWrapper({ stores }: MallClientWrapperProps) {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-background overflow-hidden selection:bg-secondary-container selection:text-secondary-dim">
      <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-surface-container-low to-transparent opacity-50 pointer-events-none" />

      {!doorsOpen && <VirtualDoors onOpenComplete={() => setDoorsOpen(true)} />}
      
      {/* Dynamic Navigation */}
      <nav className={`fixed top-0 inset-x-0 z-40 px-6 md:px-12 py-8 flex justify-between items-center transition-all duration-1000 ${doorsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
         <div className="flex items-center">
             <img src="/image/made-logo.jpeg" alt="MADE" className="h-8 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
         </div>
         <div className="flex space-x-8">
            <a href="/auth" className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-secondary transition-colors">Sign In</a>
            <a href="/auth" className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-secondary transition-colors">Join</a>
            <button className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-secondary transition-colors">Cart (0)</button>
         </div>
      </nav>

      {/* Rendering MallFloor inside the client wrapper to pass the isVisible prop */}
      <MallFloor isVisible={doorsOpen} stores={stores} />
    </main>
  );
}
