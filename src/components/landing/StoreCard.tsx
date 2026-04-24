'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface StoreCardProps {
  id: number;
  name: string;
  category: string;
  image: string;
}

export default function StoreCard({ id, name, category, image }: StoreCardProps) {
  return (
    <Link href={`/store/${id}`} className="block">
      <motion.div 
        className="group flex flex-col gap-6 cursor-pointer"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container-low shadow-[0px_20px_40px_rgba(47,51,49,0.06)]">
          <img 
            src={image} 
            alt={name} 
            className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform duration-700 ease-[0.25,1,0.5,1] grayscale-[30%] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="flex flex-col gap-1 items-center px-4">
          <h3 className="font-headline text-xl text-on-surface tracking-wide group-hover:text-secondary transition-colors duration-300">{name}</h3>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">{category}</span>
        </div>
      </motion.div>
    </Link>
  );
}
