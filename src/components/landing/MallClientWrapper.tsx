'use client';

import { useState, useEffect } from 'react';
import VirtualDoors from '@/components/landing/VirtualDoors';
import MallFloor from '@/components/landing/MallFloor';
import GlobalNavbar from '@/components/common/GlobalNavbar';

interface MallClientWrapperProps {
  stores: any[];
  session?: any;
}

export default function MallClientWrapper({ stores, session }: MallClientWrapperProps) {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-background overflow-hidden selection:bg-secondary-container selection:text-secondary-dim">
      <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-surface-container-low to-transparent opacity-50 pointer-events-none" />

      <VirtualDoors onOpenComplete={() => setDoorsOpen(true)} />
      
      {/* Dynamic Navigation */}
      <GlobalNavbar
        session={session}
        transparent={true}
        showSearch={true}
        showCart={true}
      />

      {/* Rendering MallFloor inside the client wrapper to pass the isVisible prop */}
      <MallFloor isVisible={doorsOpen} stores={stores} />
    </main>
  );
}
