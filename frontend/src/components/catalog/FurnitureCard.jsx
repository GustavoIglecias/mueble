import React from 'react';
import { QrCode, Edit3, Trash2 } from 'lucide-react';

// ─── FurnitureCard ────────────────────────────────────────────────────────────
// Tarjeta individual de un mueble en el grid del catálogo.
// Muestra imagen, categoría, nombre y bloque de precios (contado + crédito).

export default function FurnitureCard({ item, isGestor, onSelect, onShowQR, onEdit, onDelete }) {
  return (
    <article
      className="bg-[#f9f2ef] rounded-xl overflow-hidden flex flex-col shadow-[0_2px_12px_rgba(29,27,25,0.04)] border border-[#ede7e3] cursor-pointer group"
      onClick={() => onSelect(item)}
    >
      {/* Imagen */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#f3ede9]">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Controles del gestor */}
        {isGestor && (
          <div
            className="absolute top-2 right-2 flex gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(item)}
              title="Editar"
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-blue-600 shadow-sm hover:bg-white transition-colors"
            >
              <Edit3 size={13} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              title="Eliminar"
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-red-500 shadow-sm hover:bg-white transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}

        {/* Botón QR */}
        <button
          onClick={(e) => { e.stopPropagation(); onShowQR(item); }}
          title="Ver QR"
          className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#635e56] shadow-sm hover:bg-white transition-colors"
        >
          <QrCode size={13} />
        </button>

        {/* Badge crédito */}
        {item.price_credit && (
          <div className="absolute bottom-2 right-2 bg-[#9f3c16]/90 backdrop-blur-xs px-2 py-0.5 rounded-full">
            <span className="text-[9px] text-white font-semibold uppercase tracking-wide">Crédito</span>
          </div>
        )}

        {/* Badges arriba izquierda */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {item.is_featured === 1 && (
            <div className="bg-[#9f3c16] text-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wider">⭐ Destacada</span>
            </div>
          )}
          {item.is_compact === 1 && (
            <div className="bg-[#f3ede9]/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#dec0b7]/60">
              <span className="text-[9px] text-[#57423b] font-semibold">Compacto</span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3">
        <span className="text-[9px] uppercase tracking-wider text-[#8a726a] font-semibold">
          {item.category}
        </span>
        <h3 className="font-serif-custom text-sm font-medium text-[#1d1b19] leading-snug line-clamp-2">
          {item.name}
        </h3>

        {/* Precios */}
        <div className="mt-auto pt-2.5 border-t border-[#ede7e3] flex flex-col gap-1.5">
          {/* Fila Contado */}
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-[9px] uppercase tracking-wider text-[#8a726a] font-semibold shrink-0">
              Contado
            </span>
            <span className="font-price text-sm font-bold text-[#1d1b19] leading-tight text-right">
              ${Number(item.price).toLocaleString('es-MX')}
              <span className="text-[9px] font-normal text-[#706a62] ml-0.5">MXN</span>
            </span>
          </div>

          {/* Fila Crédito */}
          {item.price_credit ? (
            <div className="flex items-baseline justify-between gap-1 pt-1.5 border-t border-[#ede7e3]/60">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-[#9f3c16] font-semibold">
                  A Crédito
                </span>
                {item.weekly_payment && Number(item.weekly_payment) > 0 && (
                  <span className="text-[10px] text-[#706a62] font-medium leading-tight">
                    ${Number(item.weekly_payment).toLocaleString('es-MX')}/sem · {Math.ceil(Number(item.price_credit) / Number(item.weekly_payment))} sem.
                  </span>
                )}
              </div>
              <span className="font-price text-xs font-bold text-[#9f3c16] leading-tight text-right shrink-0">
                ${Number(item.price_credit).toLocaleString('es-MX')}
                <span className="text-[8px] font-normal text-[#706a62] ml-0.5">MXN</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1.5 border-t border-[#ede7e3]/60">
              <span className="text-[9px] uppercase tracking-wider text-[#b0a9a4] font-semibold">
                A Crédito
              </span>
              <span className="text-[10px] text-[#b0a9a4]">Solo contado</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
