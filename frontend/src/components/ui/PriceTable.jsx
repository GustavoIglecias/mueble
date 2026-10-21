import React from 'react';

// ─── PriceTable ──────────────────────────────────────────────────────────────
// Tabla de 3 columnas: Contado | A Crédito | Semanal.
// Usada en FeaturedCard, FurnitureCard y ProductDetailModal.
//
// Props:
//   item         → objeto del mueble (price, price_credit, weekly_payment)
//   variant      → 'hero' (fondo #f3ede9, hero card) | 'detail' (fondo blanco, modal)

export default function PriceTable({ item, variant = 'hero' }) {
  const weeks = item.price_credit && item.weekly_payment && Number(item.weekly_payment) > 0
    ? Math.ceil(Number(item.price_credit) / Number(item.weekly_payment))
    : null;

  const cellBg   = variant === 'detail' ? 'bg-white'    : 'bg-[#f3ede9]';
  const labelSz  = variant === 'detail' ? 'text-[9px]'  : 'text-[9px]';
  const priceSz  = variant === 'detail' ? 'text-xl'     : 'text-base';
  const subSz    = variant === 'detail' ? 'text-[10px]' : 'text-[9px]';

  return (
    <div className="grid grid-cols-3 gap-px rounded-xl overflow-hidden border border-[#dec0b7] bg-[#dec0b7] shadow-xs">
      {/* Contado */}
      <div className={`flex flex-col ${cellBg} px-2.5 py-2.5`}>
        <span className={`${labelSz} uppercase tracking-wider font-semibold text-[#8a726a] mb-0.5`}>
          Contado
        </span>
        <span className={`font-price ${priceSz} font-bold text-[#1d1b19] leading-tight`}>
          ${Number(item.price).toLocaleString('es-MX')}
        </span>
        <span className={`${subSz} text-[#706a62]`}>MXN</span>
        {variant === 'detail' && (
          <span className="text-[10px] text-[#635e56] mt-1.5 leading-snug">Entrega directa</span>
        )}
      </div>

      {/* A Crédito */}
      <div className={`flex flex-col ${cellBg} px-2.5 py-2.5 items-center text-center border-x border-[#dec0b7]`}>
        <span
          className={`${labelSz} uppercase tracking-wider font-semibold mb-0.5`}
          style={{ color: item.price_credit ? '#9f3c16' : '#b0a9a4' }}
        >
          A Crédito
        </span>
        {item.price_credit ? (
          <>
            <span className={`font-price ${priceSz} font-bold text-[#9f3c16] leading-tight`}>
              ${Number(item.price_credit).toLocaleString('es-MX')}
            </span>
            <span className={`${subSz} text-[#706a62]`}>MXN total</span>
            {variant === 'detail' && (
              <span className="text-[10px] text-[#635e56] mt-1.5 leading-snug">INE + comprobante</span>
            )}
          </>
        ) : (
          <>
            <span className="text-sm text-[#b0a9a4] font-medium mt-0.5">—</span>
            {variant === 'detail' && (
              <span className="text-[10px] text-[#b0a9a4] mt-1.5">Consultar</span>
            )}
          </>
        )}
      </div>

      {/* Semanal */}
      <div className={`flex flex-col ${cellBg} px-2.5 py-2.5 items-end text-right`}>
        <span
          className={`${labelSz} uppercase tracking-wider font-semibold mb-0.5`}
          style={{ color: item.weekly_payment && Number(item.weekly_payment) > 0 ? '#9f3c16' : '#b0a9a4' }}
        >
          Semanal
        </span>
        {item.weekly_payment && Number(item.weekly_payment) > 0 ? (
          <>
            <span className={`font-price ${priceSz} font-bold text-[#9f3c16] leading-tight`}>
              ${Number(item.weekly_payment).toLocaleString('es-MX')}
            </span>
            <span className={`${subSz} text-[#706a62]`}>
              {weeks ? `${weeks} sem.` : '/sem'}
            </span>
            {variant === 'detail' && weeks && (
              <span className="text-[10px] text-[#9f3c16] font-semibold mt-1.5">{weeks} semanas</span>
            )}
          </>
        ) : (
          <>
            <span className="text-sm text-[#b0a9a4] font-medium mt-0.5">—</span>
            {variant === 'detail' && (
              <span className="text-[10px] text-[#b0a9a4] mt-1.5">Sin datos</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
