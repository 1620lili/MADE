'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function VirtualDoors({ onOpenComplete }: { onOpenComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  if (isRemoved) return null;

  return (
    <AnimatePresence 
      onExitComplete={() => {
        setIsRemoved(true);
        onOpenComplete();
      }}
    >
      {!isOpen && (
        <motion.div
           className="fixed inset-0 z-50 flex pointer-events-none"
           exit={{ opacity: 0 }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} 
        >
          {/* Full logo background covering both doors */}
          <div className="absolute inset-0 z-0 flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #fde9f1 0%, #f8d0de 50%, #f5c0d0 100%)' }}>
            <img 
              src="/image/made-logo.jpeg" 
              alt="MADE - A Market for Makers" 
              className="w-[80%] md:w-[50%] max-w-[600px] h-auto drop-shadow-2xl"
            />
          </div>

          {/* Left Door Panel (invisible but clips the logo) */}
          <motion.div 
            className="w-1/2 h-full relative z-10"
            style={{ background: 'linear-gradient(135deg, #fde9f1 0%, #f8d0de 100%)' }}
            initial={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1], delay: 0.15 }}
          >
            {/* Left half of the full logo */}
            <div className="absolute inset-0 flex items-center justify-end overflow-hidden">
              <img 
                src="/image/made-logo.jpeg" 
                alt="" 
                className="w-[160%] md:w-[100vw] max-w-none h-auto absolute left-0 top-1/2 -translate-y-1/2"
                style={{ transform: 'translateY(-50%)' }}
              />
            </div>
            
            {/* Door handle */}
            <div className="absolute top-1/2 right-3 -translate-y-1/2 flex flex-col items-center gap-1.5 opacity-40">
              <div className="w-[2px] h-10 bg-[#9a6070] rounded-full"></div>
              <div className="w-2.5 h-2.5 border border-[#9a6070] rounded-full"></div>
            </div>
          </motion.div>
          
          {/* Right Door Panel */}
          <motion.div 
            className="w-1/2 h-full relative z-10"
            style={{ background: 'linear-gradient(225deg, #fde9f1 0%, #f8d0de 100%)' }}
            initial={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1], delay: 0.15 }}
          >
            {/* Right half of the full logo */}
            <div className="absolute inset-0 flex items-center justify-start overflow-hidden">
              <img 
                src="/image/made-logo.jpeg" 
                alt="" 
                className="w-[160%] md:w-[100vw] max-w-none h-auto absolute right-0 top-1/2 -translate-y-1/2"
                style={{ transform: 'translateY(-50%)' }}
              />
            </div>

            {/* Door handle */}
            <div className="absolute top-1/2 left-3 -translate-y-1/2 flex flex-col items-center gap-1.5 opacity-40">
              <div className="w-[2px] h-10 bg-[#9a6070] rounded-full"></div>
              <div className="w-2.5 h-2.5 border border-[#9a6070] rounded-full"></div>
            </div>
          </motion.div>

          {/* Center seam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-[#d4a0b8]/30 z-20"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
