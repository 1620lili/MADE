'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Store {
  id: number;
  name: string;
  city: string;
  bannerUrl?: string;
  logoUrl?: string;
}

interface MallFloorProps {
  isVisible: boolean;
  stores: Store[];
}

const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515347619362-e67c29c54e2c?q=80&w=1200&auto=format&fit=crop',
];

const SLIDES = [
  {
    tag: 'The Digital Atelier — Plaza MADE',
    title: ['Boutiques', 'Exclusivas'],
    sub: 'Colecciones curadas · Marcas independientes',
    cta: 'Explorar tiendas',
  },
  {
    tag: 'Nuevas incorporaciones · 2024',
    title: ['Diseño', 'Contemporáneo'],
    sub: 'Artesanía · Tecnología · Estilo',
    cta: 'Ver colecciones',
  },
  {
    tag: 'Tu espacio en la plaza digital',
    title: ['Tu Marca', 'Aquí'],
    sub: 'Registra tu boutique hoy',
    cta: 'Unirse al atelier',
  },
];

export default function MallFloor({ isVisible, stores }: MallFloorProps) {
  const router = useRouter();
  const [heroSlide, setHeroSlide] = useState(0);
  const [active, setActive] = useState(
    Math.floor(stores.length / 2)
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isVisible) return;
    intervalRef.current = setInterval(() => {
      setHeroSlide(p => (p + 1) % SLIDES.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isVisible]);

  const goTo = (n: number) => {
    setHeroSlide(n);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setHeroSlide(p => (p + 1) % SLIDES.length);
    }, 5000);
  };

  const heroBg = stores[heroSlide]?.bannerUrl
    || PLACEHOLDERS[heroSlide % PLACEHOLDERS.length];

  const getCardStyle = (i: number) => {
    const diff = i - active;
    const absDiff = Math.abs(diff);
    if (absDiff === 0) return {
      width: '380px', height: '520px',
      zIndex: 10, opacity: 1,
      transform: 'scale(1)',
    };
    if (absDiff === 1) return {
      width: '280px', height: '400px',
      zIndex: 8, opacity: 0.65,
      transform: `scale(0.9) translateX(${diff > 0 ? '-30px' : '30px'})`,
    };
    if (absDiff === 2) return {
      width: '200px', height: '300px',
      zIndex: 6, opacity: 0.35,
      transform: `scale(0.8) translateX(${diff > 0 ? '-50px' : '50px'})`,
    };
    return {
      width: '140px', height: '220px',
      zIndex: 4, opacity: 0.15,
      transform: 'scale(0.7)',
    };
  };

  return (
    <motion.div
      className="w-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ duration: 1.2, delay: 0.2 }}
    >

      {/* ═══ HERO SLIDER ═══ */}
      <div className="relative w-full h-[88vh] overflow-hidden 
      bg-[#1a1a18]">

        {/* Fondo con imagen de la tienda activa */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <img
              src={heroBg}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* Overlays editoriales */}
            <div className="absolute inset-0 bg-[#1a1a18]/65" />
            <div className="absolute inset-0 bg-gradient-to-r 
            from-[#1a1a18]/90 via-[#1a1a18]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t 
            from-[#1a1a18] via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Textura de puntos decorativa */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Contenido del slide */}
        <div className="absolute inset-0 flex flex-col justify-end 
        pb-24 px-12 md:px-20 z-10 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
              className="space-y-5"
            >
              {/* Tag con línea */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-px bg-[#8b7355]" />
                <span className="font-label text-[9px] uppercase 
                tracking-[0.4em] text-[#8b7355]">
                  {SLIDES[heroSlide].tag}
                </span>
              </div>

              {/* Título gigante */}
              <h1 className="font-headline text-[64px] md:text-[80px] 
              text-white leading-none tracking-tighter">
                {SLIDES[heroSlide].title[0]}
                <br />
                <span className="italic text-white/50">
                  {SLIDES[heroSlide].title[1]}
                </span>
              </h1>

              {/* Sub */}
              <p className="font-label text-[10px] uppercase 
              tracking-[0.3em] text-white/40">
                {SLIDES[heroSlide].sub}
              </p>

              {/* CTA + contador */}
              <div className="flex items-center gap-8 pt-2">
                <button
                  onClick={() => document.getElementById('boutiques')
                    ?.scrollIntoView({ behavior: 'smooth' })}
                  className="group flex items-center gap-3 
                  bg-white text-[#1a1a18] px-8 py-4 
                  font-label text-[9px] uppercase tracking-[0.3em] 
                  hover:bg-[#8b7355] hover:text-white 
                  transition-all duration-500"
                >
                  {SLIDES[heroSlide].cta}
                  <span className="material-symbols-outlined 
                  group-hover:translate-x-1 transition-transform"
                  style={{fontSize:'14px'}}>arrow_forward</span>
                </button>

                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-5xl text-white">
                    {stores.length}
                  </span>
                  <span className="font-label text-[9px] uppercase 
                  tracking-[0.2em] text-white/30">boutiques</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Número slide */}
        <div className="absolute top-20 right-12 z-10 font-label 
        text-[9px] tracking-[0.3em] text-white/20">
          0{heroSlide + 1} / 0{SLIDES.length}
        </div>

        {/* Dots verticales */}
        <div className="absolute bottom-10 right-12 z-10 
        flex flex-col gap-2 items-center">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-500 
              ${i === heroSlide
                ? 'w-1 h-8 bg-[#8b7355]'
                : 'w-1 h-4 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Flechas */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 
        z-10 flex flex-col gap-2">
          <button
            onClick={() => goTo((heroSlide - 1 + SLIDES.length) 
              % SLIDES.length)}
            className="w-9 h-9 flex items-center justify-center 
            border border-white/15 text-white/40 
            hover:border-white hover:text-white 
            transition-all duration-300"
          >
            <span className="material-symbols-outlined"
            style={{fontSize:'16px'}}>arrow_upward</span>
          </button>
          <button
            onClick={() => goTo((heroSlide + 1) % SLIDES.length)}
            className="w-9 h-9 flex items-center justify-center 
            border border-white/15 text-white/40 
            hover:border-white hover:text-white 
            transition-all duration-300"
          >
            <span className="material-symbols-outlined"
            style={{fontSize:'16px'}}>arrow_downward</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-12 z-10 
          flex flex-col items-center gap-2"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-px h-10 bg-white/30" />
          <span className="font-label text-[8px] uppercase 
          tracking-[0.4em] text-white/30">Scroll</span>
        </motion.div>
      </div>

      {/* ═══ SEPARADOR ═══ */}
      <div id="boutiques"
        className="bg-[#1a1a18] flex items-center gap-6 
        px-12 md:px-20 py-8">
        <div className="h-px bg-white/8 flex-1" />
        <span className="font-label text-[9px] uppercase 
        tracking-[0.4em] text-white/30 shrink-0">
          Nuestras Boutiques
        </span>
        <div className="h-px bg-white/8 flex-1" />
      </div>

      {/* ═══ CARRUSEL INMERSIVO ═══ */}
      <div className="bg-[#1a1a18] pb-20 pt-4">

        {/* Cards solapadas con profundidad */}
        <div className="flex items-center justify-center gap-0 
        px-8 min-h-[580px] overflow-hidden">
          {stores.map((store, i) => {
            const style = getCardStyle(i);
            const isActive = i === active;
            return (
              <motion.div
                key={store.id}
                animate={style}
                transition={{ duration: 0.6, 
                  ease: [0.25, 1, 0.5, 1] }}
                className="relative flex-shrink-0 overflow-hidden"
                onClick={() => {
                  if (isActive) {
                    router.push(`/store/${store.id}`);
                  } else {
                    setActive(i);
                  }
                }}
                style={{ 
                  zIndex: style.zIndex,
                  cursor: isActive ? 'pointer' : 'pointer'
                }}
              >
                {/* Imagen */}
                <img
                  src={store.bannerUrl 
                    || PLACEHOLDERS[i % PLACEHOLDERS.length]}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className={`absolute inset-0 transition-all 
                duration-500 bg-gradient-to-t
                ${isActive
                  ? 'from-black/90 via-black/20 to-transparent'
                  : 'from-black/80 via-black/50 to-black/20'
                }`} />

                {!isActive && (
                  <div className="absolute inset-0 flex items-center 
                  justify-center opacity-0 hover:opacity-100 
                  transition-opacity duration-300 bg-black/20">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-white" 
                      style={{ fontSize: '24px' }}>visibility</span>
                      <span className="font-label text-[10px] uppercase 
                      tracking-[0.2em] text-white">Ver</span>
                    </div>
                  </div>
                )}

                {/* Logo */}
                {store.logoUrl && isActive && (
                  <div className="absolute top-4 left-4 
                  w-10 h-10 bg-white/10 backdrop-blur-sm 
                  flex items-center justify-center overflow-hidden">
                    <img src={store.logoUrl} alt=""
                      className="w-full h-full object-contain p-1" />
                  </div>
                )}

                {/* Badge activa */}
                {isActive && (
                  <div className="absolute top-4 right-4 
                  bg-[#8b7355] px-2 py-1 font-label 
                  text-white uppercase tracking-[0.2em]"
                  style={{fontSize:'7px'}}>
                    Destacada
                  </div>
                )}

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className={`font-headline text-white leading-tight 
                  transition-all duration-300
                  ${isActive ? 'text-3xl' : 'text-base'}`}>
                    {store.name}
                  </p>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 mt-3"
                    >
                      <p className="font-label text-[10px] uppercase 
                      tracking-[0.25em] text-white/50">
                        {store.city}
                      </p>
                      <Link
                        href={`/store/${store.id}`}
                        className="inline-flex items-center gap-3 
                        bg-white text-[#1a1a18] px-6 py-3 
                        font-label text-[10px] uppercase 
                        tracking-[0.2em] hover:bg-[#8b7355] 
                        hover:text-white transition-all duration-300"
                        onClick={e => e.stopPropagation()}
                      >
                        Entrar a la tienda
                        <span className="material-symbols-outlined"
                        style={{fontSize:'14px'}}>arrow_forward</span>
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Número */}
                <div className="absolute top-3 left-3 font-label 
                text-white/20 tracking-[0.2em]"
                style={{fontSize:'8px'}}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              </motion.div>
            );
          })}

          {stores.length === 0 && (
            <div className="text-center py-20">
              <span className="font-label text-[10px] uppercase 
              tracking-[0.3em] text-white/20">
                No hay boutiques disponibles
              </span>
            </div>
          )}
        </div>

        {/* Nav del carrusel */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={() => setActive(p => Math.max(p - 1, 0))}
            disabled={active === 0}
            className="w-10 h-10 flex items-center justify-center 
            border border-white/15 text-white/40 
            hover:border-white hover:text-white 
            disabled:opacity-20 disabled:cursor-not-allowed 
            transition-all duration-300"
          >
            <span className="material-symbols-outlined"
            style={{fontSize:'16px'}}>arrow_back</span>
          </button>

          <div className="flex gap-2 items-center">
            {stores.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`transition-all duration-400 rounded-full
                ${i === active
                  ? 'w-6 h-1 bg-[#8b7355]'
                  : 'w-3 h-1 bg-white/15 hover:bg-white/30'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActive(p => 
              Math.min(p + 1, stores.length - 1))}
            disabled={active === stores.length - 1}
            className="w-10 h-10 flex items-center justify-center 
            border border-white/15 text-white/40 
            hover:border-white hover:text-white 
            disabled:opacity-20 disabled:cursor-not-allowed 
            transition-all duration-300"
          >
            <span className="material-symbols-outlined"
            style={{fontSize:'16px'}}>arrow_forward</span>
          </button>
        </div>

        {/* Contador */}
        <div className="text-center mt-4 font-label text-[9px] 
        uppercase tracking-[0.3em] text-white/20">
          {active + 1} / {stores.length} boutiques
        </div>
      </div>

    </motion.div>
  );
}
