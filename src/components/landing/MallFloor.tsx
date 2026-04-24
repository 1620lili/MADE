'use client';

import { motion } from 'framer-motion';
import StoreCard from './StoreCard';
import Link from 'next/link';

interface MallFloorProps {
  isVisible: boolean;
  stores: any[];
}

export default function MallFloor({ isVisible, stores }: MallFloorProps) {
  // Use mock images as placeholders if bannerUrl is missing
  const placeholders = [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599643478524-fb66f7f6a73c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop'
  ];

  return (
    <motion.div
      className="w-full max-w-[1600px] mx-auto px-6 md:px-12 py-32 flex flex-col items-center min-h-screen"
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.4, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
    >
      <header className="text-center mb-28 space-y-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <span className="font-label text-[10px] md:text-xs uppercase tracking-[0.4em] text-secondary">The Digital Atelier</span>
        </motion.div>
        <h2 className="flex items-center justify-center gap-4">
          <img src="/image/made-logo.jpeg" alt="MADE" className="h-16 md:h-24 w-auto" />
        </h2>
        <motion.p
          className="font-body text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed mt-6"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
        >
          An exclusive collection of independent boutiques and contemporary designers. Step inside and discover curated excellence.
        </motion.p>

        <motion.div
          className="pt-8"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <button className="bg-transparent border border-outline-variant/30 text-on-surface hover:border-secondary hover:text-secondary px-8 py-3 font-label text-[10px] uppercase tracking-[0.2em] transition-colors duration-300">
            Directory
          </button>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20 w-full pb-32">
        {stores.map((store, i) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.0 + i * 0.1, ease: 'easeOut' }}
          >
            <StoreCard 
              id={store.id}
              name={store.name} 
              category={store.city} 
              image={store.bannerUrl || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop'} 
            />
          </motion.div>
        ))}

        {stores.length === 0 && (
           <div className="col-span-full py-20 text-center opacity-40">
             <span className="font-label text-[10px] uppercase tracking-[0.3em]">No boutiques available at the moment</span>
           </div>
        )}
      </div>
    </motion.div>
  );
}
