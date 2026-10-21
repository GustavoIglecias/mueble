import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

// ─── ImageGallery ─────────────────────────────────────────────────────────────
// Carousel de imágenes con flechas, puntos de paginación y tira de miniaturas.
//
// Props:
//   images  → array de URLs de imágenes
//   altBase → texto base para el atributo alt

export default function ImageGallery({ images = [], altBase = 'Imagen' }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === images.length - 1 ? 0 : i + 1));

  if (images.length === 0) return null;

  return (
    <section className="px-5 mt-1 flex flex-col gap-2">
      {/* Imagen principal */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#f3ede9] shadow-sm select-none group">
        <img
          src={images[current]}
          alt={`${altBase} vista ${current + 1}`}
          className="w-full h-full object-cover transition-all duration-300 ease-out"
        />

        {/* Flechas de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Foto anterior"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1d1b19] shadow-md backdrop-blur-xs flex items-center justify-center active:scale-95 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Siguiente foto"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1d1b19] shadow-md backdrop-blur-xs flex items-center justify-center active:scale-95 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Contador */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-[#1d1b19] shadow-sm backdrop-blur-xs flex items-center gap-1 text-[11px] font-semibold border border-[#dec0b7]/50">
          <ImageIcon size={13} className="text-[#9f3c16]" />
          <span>{current + 1} / {images.length}</span>
        </div>

        {/* Puntos de paginación */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xs">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  current === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tira de miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                current === idx
                  ? 'border-[#9f3c16] scale-100 shadow-xs'
                  : 'border-transparent opacity-65 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
