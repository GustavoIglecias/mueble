import React from 'react';
import { ArrowRight, Edit3 } from 'lucide-react';
import PriceTable from '../ui/PriceTable';

// ─── FeaturedCard ─────────────────────────────────────────────────────────────
// Tarjeta grande hero de la pieza destacada del catálogo.
// Solo se muestra cuando no hay filtros activos.

export default function FeaturedCard({ item, isGestor, onSelect, onEdit }) {
  return (
    <section className="px-5 pb-7">
      <div className="bg-[#f9f2ef] rounded-xl overflow-hidden p-3.5 flex flex-col gap-3 shadow-[0_4px_20px_rgba(29,27,25,0.04)] border border-[#ede7e3]">

        {/* Imagen con badge */}
        <div
          className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-[#f3ede9] cursor-pointer group"
          onClick={() => onSelect(item)}
        >
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Badge "Edición Destacada" */}
          <div className="absolute top-3 left-3 bg-[#fff8f4]/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-2xs border border-[#dec0b7]/50 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9f3c16] animate-pulse" />
            <span className="text-[10px] text-[#9f3c16] uppercase tracking-wider font-semibold">
              ⭐ Edición Destacada
            </span>
          </div>

          {/* Controles del gestor */}
          {isGestor && (
            <div
              className="absolute top-3 right-3 flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(item)}
                title="Editar pieza destacada"
                className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-blue-600 text-[11px] font-semibold shadow-sm hover:bg-white flex items-center gap-1 transition-colors"
              >
                <Edit3 size={12} />
                <span>Editar</span>
              </button>
            </div>
          )}
        </div>

        {/* Info y precios */}
        <div className="flex flex-col gap-2 px-1 pt-1">
          <h2 className="font-serif-custom text-xl md:text-2xl text-[#1d1b19] font-medium leading-snug">
            {item.name}
          </h2>
          <p className="text-xs text-[#635e56] leading-relaxed">
            {item.materials || item.description}
          </p>

          <PriceTable item={item} variant="hero" />

          <div className="flex items-center gap-3 text-xs text-[#635e56]">
            <span className="font-medium text-[#1d1b19]">Dim: {item.dimensions}</span>
            <span className="w-1 h-1 rounded-full bg-[#dec0b7]" />
            <span>Trato directo</span>
          </div>

          <button
            onClick={() => onSelect(item)}
            className="mt-3 w-full bg-[#9f3c16] hover:bg-[#832600] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-colors shadow-xs group"
          >
            <span>Ver ficha de pieza</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
