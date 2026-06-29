'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function VirtualDoors({ onOpenComplete }: { onOpenComplete: () => void }) {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [logoFaded, setLogoFaded] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // 1. Abrir las puertas
    const doorTimer = setTimeout(() => {
      setDoorsOpen(true);
    }, 800);

    // 2. Desvanecer el logo intermedio y empezar a mostrar el mall
    const logoTimer = setTimeout(() => {
      setLogoFaded(true);
      onOpenComplete(); // Dispara el fade-in de MallFloor
    }, 2800);

    return () => {
      clearTimeout(doorTimer);
      clearTimeout(logoTimer);
    };
  }, []);

  if (isRemoved) return null;

  return (
    <AnimatePresence 
      onExitComplete={() => setIsRemoved(true)}
    >
      {!logoFaded && (
        <motion.div
           className="fixed inset-0 z-50 flex pointer-events-none"
           exit={{ opacity: 0, scale: 1.1 }}
           transition={{ duration: 1.5, ease: "easeInOut" }} 
        >
          {/* CAPA INTERMEDIA: FONDO OSCURO CON EL LOGO */}
          {/* Esta capa está detrás de las puertas, y es lo primero que se ve al abrirse */}
          <div className="absolute inset-0 z-0 bg-[#1a1a18] flex items-center justify-center">
            <motion.img 
              src="/image/made-logo.jpeg" 
              alt="MADE" 
              className="w-[280px] md:w-[450px] h-auto rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.5)]"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, ease: "easeOut" }}
            />
          </div>

          {/* CAPA SUPERIOR: LAS PUERTAS */}
          <AnimatePresence>
            {!doorsOpen && (
              <>
                {/* PANEL IZQUIERDO */}
                <motion.div 
                  className="absolute top-0 left-0 w-1/2 h-full z-10 bg-[#1a1a18] border-r border-white/5 shadow-[10px_0_30px_rgba(0,0,0,0.8)]"
                  exit={{ x: '-100%' }}
                  transition={{ duration: 2.2, ease: [0.65, 0, 0.1, 1] }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
                  <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 opacity-30">
                    <div className="w-[1px] h-24 bg-white/50" />
                  </div>
                </motion.div>
                
                {/* PANEL DERECHO */}
                <motion.div 
                  className="absolute top-0 right-0 w-1/2 h-full z-10 bg-[#1a1a18] border-l border-white/5 shadow-[-10px_0_30px_rgba(0,0,0,0.8)]"
                  exit={{ x: '100%' }}
                  transition={{ duration: 2.2, ease: [0.65, 0, 0.1, 1] }}
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/40" />
                  <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 opacity-30">
                    <div className="w-[1px] h-24 bg-white/50" />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
